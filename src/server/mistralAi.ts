// ==============================================================================
// ÉCOSYSTÈME ALPHABETTE — ROUTEUR MULTI-FOURNISSEUR (Mistral, Gemini, OpenAI, Anthropic, DeepSeek, xAI)
// ==============================================================================

export interface AIRequestOptions {
  systemPrompt: string;
  userPrompt: string;
  images?: Array<{ data: string; mimeType: string }>;
  temperature?: number;
  modelOverride?: string;
  fallbackGenerator?: () => any;
}

export function getAIConfigFromReq(req: any) {
  const reqHeaders = req.headers || {};
  const reqBody = req.body || {};

  const provider = (reqHeaders['x-ai-provider'] as string) || reqBody.aiProvider || 'mistral';
  const apiKey =
    (reqHeaders['x-ai-api-key'] as string) ||
    (reqHeaders['x-mistral-api-key'] as string) ||
    reqBody.aiApiKey ||
    reqBody.byokKey ||
    process.env.AI_API_KEY ||
    process.env.MISTRAL_API_KEY ||
    '';

  const defaultUrls: Record<string, string> = {
    mistral: 'https://api.mistral.ai/v1',
    gemini: 'https://generativelanguage.googleapis.com/v1beta',
    openai: 'https://api.openai.com/v1',
    anthropic: 'https://api.anthropic.com/v1',
    deepseek: 'https://api.deepseek.com/v1',
    xai: 'https://api.x.ai/v1',
  };

  const defaultModels: Record<string, string> = {
    mistral: 'mistral-small-latest',
    gemini: 'gemini-2.5-flash',
    openai: 'gpt-4o-mini',
    anthropic: 'claude-sonnet-5-5',
    deepseek: 'deepseek-chat',
    xai: 'grok-2-latest',
  };

  const baseUrl =
    (reqHeaders['x-ai-base-url'] as string) ||
    (reqHeaders['x-mistral-base-url'] as string) ||
    reqBody.aiBaseUrl ||
    reqBody.byokBaseUrl ||
    process.env.AI_BASE_URL ||
    defaultUrls[provider] ||
    'https://api.mistral.ai/v1';

  const model =
    (reqHeaders['x-ai-model'] as string) ||
    (reqHeaders['x-mistral-model'] as string) ||
    reqBody.aiModel ||
    reqBody.byokModel ||
    process.env.MISTRAL_MODEL ||
    defaultModels[provider] ||
    'mistral-small-latest';

  return {
    provider,
    apiKey: apiKey.trim(),
    baseUrl: baseUrl.trim().replace(/\/+$/, ''),
    model: model.trim(),
    isLocalOllama: baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1'),
  };
}

/** Extrait l'objet JSON d'une réponse texte (avec ou sans balises ```json). */
function lireJson(brut: string): any {
  const propre = brut.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '').trim();
  try {
    return JSON.parse(propre);
  } catch {
    const a = brut.indexOf('{');
    const b = brut.lastIndexOf('}');
    if (a !== -1 && b > a) return JSON.parse(brut.substring(a, b + 1));
    throw new Error("La réponse de l'IA n'était pas lisible. Réessayez.");
  }
}

async function messageErreur(response: Response): Promise<string> {
  const texte = await response.text().catch(() => '');
  if (response.status === 401 || response.status === 403 || /api[ _-]?key/i.test(texte)) {
    return 'Clé IA refusée par le fournisseur : vérifiez-la dans « Ma clé IA ».';
  }
  if (response.status === 429) {
    return 'Limite du fournisseur IA atteinte (formule gratuite ou quota). Patientez une minute puis réessayez.';
  }
  return `Le fournisseur IA a répondu une erreur (${response.status}) : ${texte.slice(0, 160)}`;
}

/**
 * Appelle le fournisseur IA choisi par l'usager. Aucune réponse « d'exemple » n'est
 * jamais renvoyée à la place d'une vraie analyse : sans clé, ou si le fournisseur
 * échoue, une erreur claire est levée et affichée à l'usager.
 */
export async function callMistralAI(req: any, options: AIRequestOptions): Promise<any> {
  const config = getAIConfigFromReq(req);
  const targetModel = options.modelOverride || config.model;
  const images = options.images || [];
  const consigneJson =
    "\n\nIMPORTANT: Réponds STRICTEMENT et EXCLUSIVEMENT au format JSON valide, sans texte d'introduction ni balises markdown additionnelles.";

  if (!config.apiKey && !config.isLocalOllama) {
    throw new Error(
      "Cette fonction utilise une intelligence artificielle : ajoutez votre propre clé IA (bouton « Ma clé IA »). Mistral AI propose une formule gratuite sans carte bancaire."
    );
  }

  let response: Response;
  try {
    if (config.provider === 'anthropic') {
      const contenu: any[] = images.map((img) => {
        const brut = img.data.startsWith('data:') ? img.data.split(',')[1] : img.data;
        const type = img.data.startsWith('data:') ? img.data.slice(5, img.data.indexOf(';')) : img.mimeType || 'image/jpeg';
        return type === 'application/pdf'
          ? { type: 'document', source: { type: 'base64', media_type: type, data: brut } }
          : { type: 'image', source: { type: 'base64', media_type: type, data: brut } };
      });
      contenu.push({ type: 'text', text: options.userPrompt });
      response = await fetch(`${config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: targetModel,
          max_tokens: 8000,
          temperature: options.temperature ?? 0.2,
          system: (options.systemPrompt || '') + consigneJson,
          messages: [{ role: 'user', content: contenu }],
        }),
      });
      if (!response.ok) throw new Error(await messageErreur(response));
      const json = await response.json();
      const texte = (json.content || []).filter((c: any) => c.type === 'text').map((c: any) => c.text).join('');
      return lireJson(texte);
    }

    // Mistral, OpenAI, DeepSeek, xAI, Ollama — et Gemini via son point d'accès compatible OpenAI.
    const estPdf = (img: { data: string; mimeType: string }) =>
      img.mimeType === 'application/pdf' || img.data.startsWith('data:application/pdf');
    if (images.some(estPdf)) {
      throw new Error(
        "Ce fournisseur IA ne lit pas les fichiers PDF envoyés ainsi. Prenez plutôt le document en photo (ou faites une capture d'écran), ou copiez-collez son texte."
      );
    }
    const messages: any[] = [];
    if (options.systemPrompt) {
      messages.push({ role: 'system', content: options.systemPrompt + consigneJson });
    }
    if (images.length) {
      const parts: any[] = [{ type: 'text', text: options.userPrompt }];
      for (const img of images) {
        const url = img.data.startsWith('data:') ? img.data : `data:${img.mimeType || 'image/jpeg'};base64,${img.data}`;
        parts.push({ type: 'image_url', image_url: { url } });
      }
      messages.push({ role: 'user', content: parts });
    } else {
      messages.push({ role: 'user', content: options.userPrompt });
    }

    const estGemini = config.provider === 'gemini';
    const endpoint = estGemini
      ? `${config.baseUrl.replace(/\/openai$/, '')}/openai/chat/completions`
      : `${config.baseUrl}/chat/completions`;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (config.apiKey) headers['Authorization'] = `Bearer ${config.apiKey}`;

    response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: targetModel,
        messages,
        ...(estGemini ? {} : { response_format: { type: 'json_object' } }),
        temperature: options.temperature ?? 0.2,
      }),
    });
    if (!response.ok) throw new Error(await messageErreur(response));
    const json = await response.json();
    const brut = json.choices?.[0]?.message?.content;
    if (!brut) throw new Error("Le fournisseur IA n'a renvoyé aucune réponse. Réessayez.");
    return lireJson(brut);
  } catch (err: any) {
    if (err instanceof TypeError) {
      // fetch() impossible : réseau coupé ou fournisseur injoignable depuis le navigateur.
      throw new Error(
        `Impossible de joindre le fournisseur IA (${config.provider}). Vérifiez votre connexion internet puis réessayez.` +
          (config.provider === 'mistral' ? '' : ' Si le problème continue, essayez Mistral AI dans « Ma clé IA ».')
      );
    }
    throw err;
  }
}

export function getMistralConfigFromReq(req: any) {
  return getAIConfigFromReq(req);
}
