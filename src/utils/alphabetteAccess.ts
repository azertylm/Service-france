// ==============================================================================
// GESTIONNAIRE D'ACCÈS SOUVERAIN ÉCOSYSTÈME ALPHABETTE (MULTI-FOURNISSEUR & QUOTAS)
// ==============================================================================

export type AlphabetteTier =
  | 'trial'            // 1. Période d'essai (7 jours offerts, 20 req/jour)
  | 'throttled'        // 2. Mode bridé (J+8 sans abonnement, 5 req/jour)
  | 'byok'             // 3. Mode BYOK (Clé personnelle illimitée)
  | 'bouquet_solo'     // 4. Abonnement application unique (15 € / an)
  | 'bouquet_full'     // 5. Bouquet complet Alphabette (40 € / an)
  | 'expired';         // Expiré

export type SubscriptionPlan =
  | 'none'
  | 'app_solo_15'      // 15 € / an (Application unique)
  | 'bouquet_40'       // 40 € / an (Bouquet complet : Proxilien, Info Perso, Focus News, L'Œil de l'Atelier, Papier Papier, IA Débat)
  | 'byok_custom';     // BYOK utilisateur

export interface AIProviderConfig {
  key: string;
  baseUrl: string;
  model: string;
}

export interface MultiProviderKeys {
  mistral: AIProviderConfig;
  gemini: AIProviderConfig;
  openai: AIProviderConfig;
  anthropic: AIProviderConfig;
  deepseek: AIProviderConfig;
  xai: AIProviderConfig;
}

const STORAGE_KEYS = {
  TRIAL_START: 'alphabette_trial_start_ts_v2',
  SUBSCRIPTION: 'alphabette_subscription_plan_v2',
  ACTIVE_PROVIDER: 'alphabette_active_ai_provider_v1',
  KEYS_PREFIX: 'alphabette_ai_key_',
  BASEURL_PREFIX: 'alphabette_ai_baseurl_',
  MODEL_PREFIX: 'alphabette_ai_model_',
  DAILY_USAGE_PREFIX: 'alphabette_daily_usage_',
};

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

export function getTrialStartTime(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.TRIAL_START);
    if (stored) {
      const parsed = parseInt(stored, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    const now = Date.now();
    localStorage.setItem(STORAGE_KEYS.TRIAL_START, now.toString());
    return now;
  } catch {
    return Date.now();
  }
}

export function getActiveProvider(): keyof MultiProviderKeys {
  try {
    const p = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROVIDER) as keyof MultiProviderKeys;
    if (['mistral', 'gemini', 'openai', 'anthropic', 'deepseek', 'xai'].includes(p)) {
      return p;
    }
  } catch {}
  return 'mistral';
}

export function setActiveProvider(provider: keyof MultiProviderKeys) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROVIDER, provider);
    window.dispatchEvent(new Event('alphabette-access-change'));
  } catch (e) {
    console.error('Error setting active provider:', e);
  }
}

export function getProviderConfig(provider: keyof MultiProviderKeys): AIProviderConfig {
  try {
    const key = localStorage.getItem(STORAGE_KEYS.KEYS_PREFIX + provider) || '';
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

    const baseUrl = localStorage.getItem(STORAGE_KEYS.BASEURL_PREFIX + provider) || defaultUrls[provider];
    const model = localStorage.getItem(STORAGE_KEYS.MODEL_PREFIX + provider) || defaultModels[provider];

    return { key, baseUrl, model };
  } catch {
    return { key: '', baseUrl: '', model: '' };
  }
}

export function saveProviderConfig(provider: keyof MultiProviderKeys, key: string, baseUrl?: string, model?: string) {
  try {
    localStorage.setItem(STORAGE_KEYS.KEYS_PREFIX + provider, key.trim());
    if (baseUrl) localStorage.setItem(STORAGE_KEYS.BASEURL_PREFIX + provider, baseUrl.trim());
    if (model) localStorage.setItem(STORAGE_KEYS.MODEL_PREFIX + provider, model.trim());
    window.dispatchEvent(new Event('alphabette-access-change'));
  } catch (e) {
    console.error('Error saving provider config:', e);
  }
}

export function clearProviderKey(provider: keyof MultiProviderKeys) {
  try {
    localStorage.removeItem(STORAGE_KEYS.KEYS_PREFIX + provider);
    window.dispatchEvent(new Event('alphabette-access-change'));
  } catch (e) {
    console.error('Error clearing provider key:', e);
  }
}

// Backward compatibility helpers for MistralByokModal
export function getByokConfig() {
  return getProviderConfig('mistral');
}

export function saveByokConfig(key: string, baseUrl?: string, model?: string) {
  saveProviderConfig('mistral', key, baseUrl, model);
}

export function clearByokKey() {
  clearProviderKey('mistral');
}

export function getSubscriptionPlan(): SubscriptionPlan {
  try {
    const plan = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION) as SubscriptionPlan;
    if (['app_solo_15', 'bouquet_40', 'byok_custom'].includes(plan)) {
      return plan;
    }
  } catch {}
  return 'none';
}

export function setSubscriptionPlan(plan: SubscriptionPlan) {
  try {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, plan);
    window.dispatchEvent(new Event('alphabette-access-change'));
  } catch (e) {
    console.error('Error setting subscription plan:', e);
  }
}

// Daily Quota Tracking (20/day during trial, 5/day post-trial)
export function getDailyQuotaStatus(): {
  todayStr: string;
  count: number;
  maxLimit: number;
  isExceeded: boolean;
  isTrialActive: boolean;
} {
  const trialStart = getTrialStartTime();
  const now = Date.now();
  const isTrialActive = (now - trialStart) < TRIAL_DURATION_MS;
  const maxLimit = isTrialActive ? 20 : 5;

  const todayStr = new Date().toISOString().split('T')[0];
  const storageKey = STORAGE_KEYS.DAILY_USAGE_PREFIX + todayStr;

  let count = 0;
  try {
    const val = localStorage.getItem(storageKey);
    if (val) count = parseInt(val, 10) || 0;
  } catch {}

  return {
    todayStr,
    count,
    maxLimit,
    isExceeded: count >= maxLimit,
    isTrialActive,
  };
}

export function incrementDailyQuota(): boolean {
  const status = getDailyQuotaStatus();
  const subscription = getSubscriptionPlan();
  const activeProvider = getActiveProvider();
  const providerCfg = getProviderConfig(activeProvider);

  if (subscription !== 'none' || providerCfg.key.trim().length > 0) {
    return true;
  }

  if (status.isExceeded) {
    return false;
  }

  try {
    const storageKey = STORAGE_KEYS.DAILY_USAGE_PREFIX + status.todayStr;
    const newCount = status.count + 1;
    localStorage.setItem(storageKey, newCount.toString());
    window.dispatchEvent(new Event('alphabette-access-change'));
    return true;
  } catch {
    return true;
  }
}

export function getAlphabetteAccessState() {
  const trialStart = getTrialStartTime();
  const now = Date.now();
  const trialElapsed = Math.max(0, now - trialStart);
  const trialRemaining = Math.max(0, TRIAL_DURATION_MS - trialElapsed);
  const isTrialActive = trialRemaining > 0;

  const trialDaysLeft = Math.ceil(trialRemaining / (24 * 60 * 60 * 1000));
  const subscription = getSubscriptionPlan();
  const activeProvider = getActiveProvider();
  const providerCfg = getProviderConfig(activeProvider);
  const hasAnyKey = providerCfg.key.trim().length > 0;

  const quota = getDailyQuotaStatus();

  let effectiveTier: AlphabetteTier = 'trial';

  if (subscription === 'bouquet_40') {
    effectiveTier = 'bouquet_full';
  } else if (subscription === 'app_solo_15') {
    effectiveTier = 'bouquet_solo';
  } else if (hasAnyKey || subscription === 'byok_custom') {
    effectiveTier = 'byok';
  } else if (isTrialActive) {
    effectiveTier = 'trial';
  } else {
    effectiveTier = 'throttled';
  }

  return {
    effectiveTier,
    subscriptionPlan: subscription,
    isTrialActive,
    trialDaysLeft,
    activeProvider,
    providerCfg,
    hasAnyKey,
    quota,
    legalNotice: "Vous réglez à Alphabette uniquement l'accès au service logiciel (15 € ou 40 €/an). Vos consommations d'IA sont facturées directement à prix coûtant par le fournisseur choisi.",
  };
}

export function getMistralHeaders(): Record<string, string> {
  const activeProv = getActiveProvider();
  const cfg = getProviderConfig(activeProv);
  const headers: Record<string, string> = {};
  if (cfg.key) {
    headers['x-ai-provider'] = activeProv;
    headers['x-ai-api-key'] = cfg.key;
    headers['x-ai-base-url'] = cfg.baseUrl;
    headers['x-ai-model'] = cfg.model;
    headers['x-mistral-api-key'] = cfg.key;
    headers['x-mistral-base-url'] = cfg.baseUrl;
    headers['x-mistral-model'] = cfg.model;
  }
  return headers;
}
