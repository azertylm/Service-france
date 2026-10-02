import React, { useState, useEffect } from 'react';
import {
  X,
  Key,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Laptop,
  Cloud,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  getByokConfig,
  saveByokConfig,
  clearByokKey,
  getAlphabetteAccessState,
} from '../../utils/alphabetteAccess';
import { testMistralConnection } from '../../utils/apiClient';

interface MistralByokModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
}

export const MistralByokModal: React.FC<MistralByokModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('https://api.mistral.ai/v1');
  const [model, setModel] = useState('mistral-small-latest');
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const cfg = getByokConfig();
      setApiKey(cfg.key);
      setBaseUrl(cfg.baseUrl || 'https://api.mistral.ai/v1');
      setModel(cfg.model || 'mistral-small-latest');
      setTestResult(null);
      setSavedSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveByokConfig(apiKey, baseUrl, model);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleClear = () => {
    clearByokKey();
    setApiKey('');
    setTestResult(null);
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testMistralConnection({
        apiKey,
        baseUrl,
        model,
      });
      setTestResult({
        success: res.success,
        message: res.message,
      });
    } catch (e: any) {
      setTestResult({
        success: false,
        message: e?.message || 'Erreur lors du test de connexion Mistral.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const setPresetOllama = () => {
    setBaseUrl('http://localhost:11434/v1');
    setModel('mistral');
    setTestResult(null);
  };

  const setPresetMistralCloud = () => {
    setBaseUrl('https://api.mistral.ai/v1');
    setModel('mistral-small-latest');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="flex h-3 w-4 rounded-xs overflow-hidden border border-white/20">
              <span className="w-1.5 bg-[#002654]" />
              <span className="w-1 bg-white" />
              <span className="w-1.5 bg-[#CE1126]" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
              Souveraineté & RGPD Natif
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Key className="w-6 h-6 text-amber-400" />
            <span>Mode BYOK : Votre Clé Mistral AI</span>
          </h2>

          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            Toutes les applications de la suite Alphabette reposent <strong>rigoureusement et exclusivement sur Mistral AI</strong>.
            En mode BYOK (Bring Your Own Key), vos requêtes consomment directement votre quota personnel en toute indépendance.
          </p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto text-slate-800 text-xs">
          {/* Sovereign Guarantee Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[12px]">Conformité RGPD native</p>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  Mistral AI est une entreprise française dont les infrastructures sont hébergées en Union Européenne. Vos données ne quittent pas le cadre juridique communautaire.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-950 flex items-start gap-2.5">
              <Lock className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[12px]">Confidentialité absolue</p>
                <p className="text-[11px] text-blue-800 leading-relaxed mt-0.5">
                  Les modèles commerciaux de Mistral garantissent que vos requêtes et documents ne sont <strong>jamais réutilisés</strong> pour l'entraînement public des modèles.
                </p>
              </div>
            </div>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Sélectionnez votre environnement d'exécution :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={setPresetMistralCloud}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  baseUrl === 'https://api.mistral.ai/v1'
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Cloud className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">API Cloud Officielle Mistral</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    https://api.mistral.ai/v1 (Production souveraine recommandée)
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={setPresetOllama}
                className={`p-3 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                  baseUrl.includes('localhost') || baseUrl.includes('11434')
                    ? 'border-slate-900 bg-slate-50 ring-2 ring-slate-400'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <Laptop className="w-5 h-5 text-slate-800 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-900">Mac Local (Ollama / Metal)</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    http://localhost:11434/v1 (100% hors-ligne sur votre machine)
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* API Key input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                Clé API Mistral personnelle :
              </label>
              <a
                href="https://console.mistral.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
              >
                <span>Obtenir une clé sur console.mistral.ai</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Ex: mistral_sk_live_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Votre clé est stockée localement dans votre navigateur (Zero-Knowledge). Elle n'est jamais transmise à des tiers.
            </p>
          </div>

          {/* Advanced config: Base URL & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                URL de base API (AI_BASE_URL) :
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.mistral.ai/v1"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Modèle par défaut (MISTRAL_MODEL) :
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-hidden"
              >
                <option value="mistral-small-latest">mistral-small-latest (Rapide & frugal)</option>
                <option value="mistral-large-latest">mistral-large-latest (Raisonnement juridique supérieur)</option>
                <option value="codestral-latest">codestral-latest (Règles logiques & calculs)</option>
                <option value="pixtral-12b-2409">pixtral-12b-2409 (Vision & documents scannés)</option>
                <option value="open-mistral-nemo">open-mistral-nemo (Open source)</option>
                <option value="mistral">mistral (Alias local Ollama)</option>
              </select>
            </div>
          </div>

          {/* Test connection output */}
          {testResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 animate-in fade-in duration-150 ${
                testResult.success
                  ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border border-rose-300 text-rose-900'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-bold">
                  {testResult.success ? 'Connexion validée !' : 'Échec de connexion'}
                </p>
                <p className="text-[11px] mt-0.5 leading-relaxed">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Cross-selling notice */}
          {onOpenPricing && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between gap-3 text-amber-950">
              <div className="space-y-0.5">
                <p className="font-bold text-xs">
                  Vous ne souhaitez pas gérer de clé API ?
                </p>
                <p className="text-[11px] text-amber-800">
                  Découvrez l'offre clé en main <strong>Confort (59 € / an)</strong> ou le <strong>Pass Bouquet Intégral (199 € / an)</strong> avec consommation Mistral managée.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap transition-colors"
              >
                Voir les tarifs
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleTest}
                disabled={isTesting}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 w-full sm:w-auto text-xs"
              >
                {isTesting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                )}
                <span>Tester la connexion</span>
              </button>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-2 text-slate-400 hover:text-rose-600 font-semibold transition-colors text-xs"
                >
                  Effacer
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 w-full sm:w-auto text-xs flex items-center justify-center gap-2"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Enregistré !</span>
                </>
              ) : (
                <span>Enregistrer la configuration BYOK</span>
              )}
            </button>
          </div>
        </div>

        {/* Modal Footer with MANDATORY LINK TO http://alphabette.fr */}
        <div className="bg-slate-900 text-white px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-center sm:text-left text-[11px]">
            ALPHABETTE SASU · La Grande-Motte · Mistral AI Exclusif
          </span>
          <a
            href="http://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors text-xs"
          >
            <span>Découvrir toutes les applications de la suite sur http://alphabette.fr</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
