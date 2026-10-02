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
    anthropic: 'claude-3-5-sonnet-20241022',
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

export async function callMistralAI(req: any, options: AIRequestOptions): Promise<any> {
  const config = getAIConfigFromReq(req);
  const hasImages = options.images && options.images.length > 0;
  const targetModel = options.modelOverride || config.model;

  if (config.apiKey || config.isLocalOllama) {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (config.apiKey) {
        if (config.provider === 'anthropic') {
          headers['x-api-key'] = config.apiKey;
          headers['anthropic-version'] = '2023-06-01';
        } else if (config.provider === 'gemini') {
          // Gemini uses query param ?key=
        } else {
          headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
      }

      // Handle OpenAI compatible APIs (Mistral, OpenAI, DeepSeek, xAI, Ollama)
      if (config.provider !== 'anthropic' && config.provider !== 'gemini') {
        const messages: any[] = [];
        if (options.systemPrompt) {
          messages.push({
            role: 'system',
            content: `${options.systemPrompt}\n\nIMPORTANT: Réponds STRICTEMENT et EXCLUSIVEMENT au format JSON valide, sans texte d'introduction ni balises markdown additionnelles.`,
          });
        }

        if (hasImages) {
          const contentParts: any[] = [{ type: 'text', text: options.userPrompt }];
          for (const img of options.images!) {
            const base64Url = img.data.startsWith('data:')
              ? img.data
              : `data:${img.mimeType || 'image/jpeg'};base64,${img.data}`;
            contentParts.push({
              type: 'image_url',
              image_url: { url: base64Url },
            });
          }
          messages.push({ role: 'user', content: contentParts });
        } else {
          messages.push({ role: 'user', content: options.userPrompt });
        }

        const endpoint = `${config.baseUrl}/chat/completions`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: targetModel,
            messages,
            response_format: { type: 'json_object' },
            temperature: options.temperature ?? 0.2,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          const rawContent = json.choices?.[0]?.message?.content;
          if (rawContent) {
            try {
              const cleanJson = rawContent
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/, '')
                .trim();
              return JSON.parse(cleanJson);
            } catch (pe) {
              const firstBrace = rawContent.indexOf('{');
              const lastBrace = rawContent.lastIndexOf('}');
              if (firstBrace !== -1 && lastBrace !== -1) {
                return JSON.parse(rawContent.substring(firstBrace, lastBrace + 1));
              }
            }
          }
        }
      }
    } catch (apiErr) {
      console.warn('Multi-provider API call failed, falling back to sovereign heuristic parser:', apiErr);
    }
  }

  // Fallback generator
  if (options.fallbackGenerator) {
    return options.fallbackGenerator();
  }

  throw new Error(
    "Service IA indisponible et aucun générateur de secours défini. Renseignez votre clé API dans votre espace Trousseau."
  );
}

export function getMistralConfigFromReq(req: any) {
  return getAIConfigFromReq(req);
}
