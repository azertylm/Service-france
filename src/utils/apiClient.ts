// ==============================================================================
// CLIENT API SOUVERAIN ALPHABETTE (MULTI-FOURNISSEUR & GESTION DES QUOTAS)
// ==============================================================================
import { getMistralHeaders, incrementDailyQuota, getDailyQuotaStatus } from './alphabetteAccess';

/**
 * Enhanced fetch wrapper that checks daily quotas, attaches sovereign API headers (BYOK or Managed),
 * and intercepts quota exhaustion (Rule 429).
 */
export async function sovereignFetch(url: string, options: RequestInit = {}): Promise<Response> {
  // Check daily quota before dispatching request if using internal key / trial
  const quotaAllowed = incrementDailyQuota();
  if (!quotaAllowed) {
    const quota = getDailyQuotaStatus();
    const errObj = {
      success: false,
      error: `« Votre quota quotidien gratuit est atteint. Pour bénéficier d'un accès instantané et sans restriction, activez votre abonnement annuel et renseignez votre propre clé API dans votre espace Alphabette. »`,
      status: 429,
      quota,
    };
    // Dispatch custom event to open Quota Exceeded Modal globally
    window.dispatchEvent(new CustomEvent('alphabette-quota-exceeded', { detail: quota }));
    return new Response(JSON.stringify(errObj), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const customHeaders = getMistralHeaders();
  
  const mergedHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...customHeaders,
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, {
    ...options,
    headers: mergedHeaders,
  });

  return response;
}

export async function testMistralConnection(params?: {
  apiKey?: string;
  baseUrl?: string;
  model?: string;
}): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const res = await sovereignFetch('/api/mistral/status', {
      method: 'POST',
      body: JSON.stringify(params || {}),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Erreur de connexion avec le serveur IA.',
    };
  }
}
