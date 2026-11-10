import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Layers,
  Crown,
  Key,
  Clock,
  Check,
} from 'lucide-react';
import {
  getAlphabetteAccessState,
  setSubscriptionPlan,
  SubscriptionPlan,
} from '../../utils/alphabetteAccess';

const STATIQUE = (import.meta as any).env?.VITE_ALPHABETTE_STATIC === '1';

interface AlphabettePricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenKeychain?: () => void;
  initialReason?: 'trial_expired' | 'user_requested' | 'limit_reached';
}

export const AlphabettePricingModal: React.FC<AlphabettePricingModalProps> = ({
  isOpen,
  onClose,
  onOpenKeychain,
  initialReason = 'user_requested',
}) => {
  const [accessState, setAccessState] = useState(getAlphabetteAccessState());
  const [selectedBilling, setSelectedBilling] = useState<'bouquet' | 'solo'>('bouquet');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSubscriptionPlan(plan);
    setAccessState(getAlphabetteAccessState());
    setSuccessNotice(`Formule activée avec succès : ${getPlanLabel(plan)}`);
    setTimeout(() => {
      setSuccessNotice(null);
    }, 3500);
  };

  const getPlanLabel = (plan: SubscriptionPlan) => {
    switch (plan) {
      case 'app_solo_15':
        return 'Formule Application Unique (15 € / an)';
      case 'bouquet_40':
        return 'Bouquet Complet Alphabette (40 € / an)';
      case 'byok_custom':
        return 'Mode BYOK (Clé personnelle active)';
      default:
        return 'Période d’essai';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold tracking-wide">
              <span className="flex h-2 w-3 rounded-xs overflow-hidden border border-white/20">
                <span className="w-1 bg-[#002654]" />
                <span className="w-1 bg-white" />
                <span className="w-1 bg-[#CE1126]" />
              </span>
              <span>Écosystème Logiciel Alphabette · Grille Tarifaire Officielle</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tarification transparente & Accès illimité
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong>Rappel légal :</strong> {accessState.legalNotice}
            </p>

            {/* Trial Status Capsule */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>
                  Statut actuel :{' '}
                  <strong className="text-amber-300">
                    {STATIQUE
                      ? accessState.hasAnyKey
                        ? 'Votre clé IA personnelle est active'
                        : 'Sans clé IA : guides et modèles gratuits'
                      : accessState.effectiveTier === 'trial'
                      ? `Période d'essai (${accessState.trialDaysLeft} jours restants)`
                      : accessState.effectiveTier === 'byok'
                      ? 'Mode BYOK (Clé personnelle active)'
                      : accessState.effectiveTier === 'bouquet_full'
                      ? 'Bouquet Complet Alphabette actif (40 €/an)'
                      : accessState.effectiveTier === 'bouquet_solo'
                      ? 'Formule Application Unique active (15 €/an)'
                      : 'Période d’essai expirée'}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Success toast */}
        {successNotice && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-xs font-semibold text-emerald-900 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {successNotice}
            </span>
            <span className="text-[11px] text-emerald-700">Simulation d'abonnement validée</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8 overflow-y-auto flex-1">
          {/* BOUQUET ALPHABETTE HIGHLIGHT BANNER */}
          <div className="bg-gradient-to-br from-amber-500/10 via-indigo-500/5 to-blue-500/10 border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex flex-col md:flex-row items-center justify-between gap-5 relative z-10">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[11px] font-black tracking-wide border border-amber-300">
                  <Crown className="w-3.5 h-3.5 text-amber-600" />
                  <span>BOUTIQUE OFFICIELLE ALPHABETTE</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Débloquez le Bouquet Complet pour seulement 40 € / an
                </h3>
                <p className="text-xs text-slate-600 max-w-xl leading-relaxed">
                  Accédez sans restriction à toutes les applications de la suite : <strong>Proxilien</strong>, <strong>Info Perso</strong>, <strong>Focus News</strong>, <strong>L'Œil de l'Atelier</strong>, <strong>Papier Papier</strong>, <strong>IA Débat</strong>, et l'ensemble des modules d'utilité publique.
                </p>
              </div>

              <div className="text-center md:text-right shrink-0 bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-300/50 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">
                  Offre Recommandée
                </span>
                <span className="text-2xl sm:text-3xl font-black text-amber-600">
                  40 €
                </span>
                <span className="text-[11px] text-slate-500 block">/ an (Bouquet illimité)</span>
              </div>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
              <button
                onClick={() => setSelectedBilling('bouquet')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedBilling === 'bouquet'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Bouquet Complet Alphabette (40 € / an)</span>
              </button>
              <button
                onClick={() => setSelectedBilling('solo')}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedBilling === 'solo'
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Application Unique (15 € / an)</span>
              </button>
            </div>
          </div>

          {/* PRICING CARDS */}
          {selectedBilling === 'bouquet' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-150">
              {/* Card 1: Application Unique (15 €) */}
              <div className="border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Accès centré
                      </span>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">
                        Application Unique
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-800">
                      <Layers className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">15 €</span>
                    <span className="text-xs font-semibold text-slate-500">/ an</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Idéal si vous n'avez besoin que d'une seule application de l'écosystème avec requêtes illimitées (avec votre clé API personnelle).
                  </p>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Accès illimité à l'application active</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Utilisation de votre clé API personnelle (trousseau)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Mises à jour et correctifs juridiques inclus</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href="http://alphabette.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                  >
                    <span>Souscrire sur alphabette.fr (15 €)</span>
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                  </a>
                  {!STATIQUE && (
<button
                    onClick={() => handleSelectPlan('app_solo_15')}
                    className="w-full py-2 px-3 text-[11px] text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                  >
                    Simuler l'activation (15 € / an)
                  </button>
                  )}
                </div>
              </div>

              {/* Card 2: Bouquet Complet Alphabette (40 €) */}
              <div className="border-2 border-amber-500 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between bg-gradient-to-b from-amber-50/50 to-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-xs">
                  Le plus populaire
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Bouquet Intégral
                      </span>
                      <h4 className="text-xl font-black text-slate-900 mt-0.5">
                        Bouquet Complet Alphabette
                      </h4>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md">
                      <Crown className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">40 €</span>
                    <span className="text-xs font-semibold text-slate-500">/ an</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Accès illimité à l'ensemble du bouquet : <strong>Proxilien</strong>, <strong>Info Perso</strong>, <strong>Focus News</strong>, <strong>L'Œil de l'Atelier</strong>, <strong>Papier Papier</strong>, <strong>IA Débat</strong>.
                  </p>

                  <div className="space-y-2.5 pt-3 border-t border-amber-200 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span><strong>Accès illimité à TOUTES les applications</strong> de l'écosystème</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>Authentification unique partagée sur tous les services</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>Trousseau centralisé pour vos clés API (Mistral, Gemini, OpenAI, etc.)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                      <span>Économie majeure par rapport aux abonnements séparés</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href="http://alphabette.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                  >
                    <span>Souscrire au Bouquet 40 € / an sur alphabette.fr</span>
                    <ExternalLink className="w-4 h-4 text-slate-950" />
                  </a>
                  {!STATIQUE && (
<button
                    onClick={() => handleSelectPlan('bouquet_40')}
                    className="w-full py-2 px-3 text-[11px] text-amber-900 hover:text-amber-950 font-semibold transition-colors"
                  >
                    Simuler l'activation du Bouquet 40 € / an
                  </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedBilling === 'solo' && (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 animate-in fade-in duration-150 max-w-xl mx-auto">
              <div className="border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6 flex flex-col justify-between bg-white">
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Application Unique
                    </span>
                    <h4 className="text-xl font-black text-slate-900 mt-0.5">
                      Formule Application Unique (15 € / an)
                    </h4>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black text-slate-900">15 €</span>
                    <span className="text-xs font-semibold text-slate-500">/ an</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Débloquez l'accès illimité à cette application spécifique pour 15 € par an.
                  </p>

                  <div className="space-y-2.5 pt-3 border-t border-slate-100 text-xs text-slate-700">
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Requêtes illimitées sur cette application</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>Utilisation de votre clé API personnelle dans le trousseau</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <a
                    href="http://alphabette.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98"
                  >
                    <span>Souscrire sur alphabette.fr (15 €)</span>
                    <ExternalLink className="w-4 h-4 text-slate-300" />
                  </a>
                  {!STATIQUE && (
<button
                    onClick={() => handleSelectPlan('app_solo_15')}
                    className="w-full py-2 px-3 text-[11px] text-slate-500 hover:text-slate-900 font-semibold transition-colors"
                  >
                    Simuler l'activation (15 € / an)
                  </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* KEYCHAIN REDIRECTION */}
          {onOpenKeychain && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold shrink-0">
                  <Key className="w-5 h-5 text-indigo-700" />
                </div>
                <p className="leading-relaxed">
                  <strong>Trousseau Centralisé :</strong> Vous possédez déjà une clé API Mistral, Gemini, OpenAI, Anthropic, DeepSeek ou xAI ? Renseignez-la dans votre espace Trousseau.
                </p>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onOpenKeychain();
                }}
                className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold rounded-xl whitespace-nowrap shadow-2xs text-xs"
              >
                Gérer mes clés API
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer with MANDATORY LINK TO http://alphabette.fr */}
        <div className="bg-slate-900 text-white px-6 py-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shrink-0">
          <span className="text-slate-400 text-center sm:text-left">
            Édité par ALPHABETTE SASU · La Grande-Motte
          </span>
          <a
            href="http://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-300 hover:text-white font-bold flex items-center gap-1.5 transition-colors"
          >
            <span>Découvrir toutes les applications sur http://alphabette.fr</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
