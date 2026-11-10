import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Cpu,
} from 'lucide-react';
import {
  getActiveProvider,
  setActiveProvider,
  getProviderConfig,
  saveProviderConfig,
  clearProviderKey,
  MultiProviderKeys,
} from '../../utils/alphabetteAccess';

const STATIQUE = (import.meta as any).env?.VITE_ALPHABETTE_STATIC === '1';

interface KeychainByokModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
}

const PROVIDER_METADATA: Record<
  keyof MultiProviderKeys,
  { name: string; consoleUrl: string; placeholder: string; defaultModel: string; badge: string }
> = {
  mistral: {
    name: 'Mistral AI (Souveraineté Européenne / RGPD)',
    consoleUrl: 'https://console.mistral.ai',
    placeholder: 'mistral_sk_live_xxxxxxxxxxxxxxxxxxxx',
    defaultModel: 'mistral-small-latest',
    badge: 'Recommandé Alphabette',
  },
  gemini: {
    name: 'Google Gemini (AI Studio)',
    consoleUrl: 'https://aistudio.google.com',
    placeholder: 'AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    defaultModel: 'gemini-2.5-flash',
    badge: 'Multimodal Avancé',
  },
  openai: {
    name: 'OpenAI (GPT-4o / GPT-4o-mini)',
    consoleUrl: 'https://platform.openai.com',
    placeholder: 'sk-proj-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    defaultModel: 'gpt-4o-mini',
    badge: 'Standard Industriel',
  },
  anthropic: {
    name: 'Anthropic (Claude 3.5 Sonnet)',
    consoleUrl: 'https://console.anthropic.com',
    placeholder: 'sk-ant-api03-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    defaultModel: 'claude-sonnet-5-5',
    badge: 'Raisonnement Avancé',
  },
  deepseek: {
    name: 'DeepSeek (DeepSeek V3 / R1)',
    consoleUrl: 'https://platform.deepseek.com',
    placeholder: 'sk-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    defaultModel: 'deepseek-chat',
    badge: 'Haute Frugalité',
  },
  xai: {
    name: 'xAI (Grok 2)',
    consoleUrl: 'https://console.x.ai',
    placeholder: 'xai-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    defaultModel: 'grok-2-latest',
    badge: 'Temps Réel',
  },
};

export const KeychainByokModal: React.FC<KeychainByokModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const [activeProv, setActiveProv] = useState<keyof MultiProviderKeys>(getActiveProvider());
  const [config, setConfig] = useState(getProviderConfig(getActiveProvider()));
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const current = getActiveProvider();
      setActiveProv(current);
      setConfig(getProviderConfig(current));
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderSwitch = (prov: keyof MultiProviderKeys) => {
    setActiveProv(prov);
    setActiveProvider(prov);
    setConfig(getProviderConfig(prov));
  };

  const handleSave = () => {
    saveProviderConfig(activeProv, config.key, config.baseUrl, config.model);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const meta = PROVIDER_METADATA[activeProv];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-black uppercase tracking-wider border border-blue-400/30">
              Trousseau Centralisé Écosystème Alphabette
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Key className="w-6 h-6 text-amber-400" />
            <span>Espace Trousseau & Clés API Personnelles</span>
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {STATIQUE
              ? "Ajoutez votre propre clé d'intelligence artificielle pour utiliser les analyses de cette application (contrats, courriers, comptes-rendus…). Elle reste enregistrée dans ce navigateur."
              : "Configurez vos propres clés d'intelligence artificielle pour un accès illimité et direct sur toutes les applications du bouquet (Proxilien, Info Perso, Focus News, L'Œil de l'Atelier, Papier Papier, IA Débat)."}
          </p>
        </div>

        {/* Legal notice banner */}
        <div className="bg-indigo-50 border-b border-indigo-200 px-6 py-3.5 text-xs text-indigo-950 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed font-medium">
            {STATIQUE
              ? "Les analyses par IA utilisent votre propre clé : c'est le fournisseur choisi qui facture vos consommations, au prix public. Mistral AI (France) propose une formule gratuite, sans carte bancaire."
              : "« Vous réglez à Alphabette uniquement l'accès au service logiciel (15 € ou 40 €/an). Vos consommations d'IA sont facturées directement à prix coûtant par le fournisseur choisi. »"}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto text-slate-800 text-xs">
          {/* Provider tabs */}
          <div className="space-y-2">
            <label className="font-bold text-slate-700 block text-xs">
              Sélectionnez votre fournisseur d'intelligence artificielle :
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(PROVIDER_METADATA) as Array<keyof MultiProviderKeys>).map((prov) => {
                const pMeta = PROVIDER_METADATA[prov];
                const isSelected = activeProv === prov;
                const hasKey = getProviderConfig(prov).key.trim().length > 0;
                return (
                  <button
                    key={prov}
                    type="button"
                    onClick={() => handleProviderSwitch(prov)}
                    className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-300 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 capitalize text-xs">
                        {prov}
                      </span>
                      {hasKey && (
                        <span className="w-2 h-2 rounded-full bg-emerald-500" title="Clé renseignée" />
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 block truncate">
                      {pMeta.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active provider configuration card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{meta.name}</h4>
                <p className="text-[11px] text-slate-500">
                  Redirection directe vers la console officielle développeur
                </p>
              </div>
              <a
                href={meta.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 transition-colors text-xs"
              >
                <span>Console {activeProv}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* API Key input */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                Clé API {activeProv.toUpperCase()} :
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={config.key}
                  onChange={(e) => setConfig({ ...config, key: e.target.value })}
                  placeholder={meta.placeholder}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                {STATIQUE
                  ? "Gardée uniquement dans ce navigateur et envoyée directement au fournisseur choisi, jamais à Alphabette."
                  : "Gardée dans ce navigateur et relayée par le serveur uniquement pour vos requêtes."}
              </p>
            </div>

            {/* Base URL & Model */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">URL de base (Endpoint)</label>
                <input
                  type="text"
                  value={config.baseUrl}
                  onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Modèle préférentiel</label>
                <input
                  type="text"
                  value={config.model}
                  onChange={(e) => setConfig({ ...config, model: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Pricing cross-sell */}
          {onOpenPricing && !STATIQUE && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3 text-amber-950">
              <span className="text-xs">
                Besoin d'un accès clé en main sans configurer de clé personnelle ?
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Voir la grille (15€ / 40€)
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                clearProviderKey(activeProv);
                setConfig({ ...config, key: '' });
              }}
              className="px-3 py-2 text-slate-400 hover:text-rose-600 font-semibold text-xs transition-colors"
            >
              Effacer la clé {activeProv}
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 text-xs flex items-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <span>Enregistrer dans mon trousseau</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-white px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-xs">
            ALPHABETTE · La Grande-Motte · Authentification unique bouquet
          </span>
          <a
            href="http://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors text-xs"
          >
            <span>Découvrir la suite sur http://alphabette.fr</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
