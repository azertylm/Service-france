import React, { useState, useEffect } from 'react';
import {
  Clock,
  Key,
  ShieldCheck,
  Crown,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import {
  getAlphabetteAccessState,
  AlphabetteAccessState,
} from '../../utils/alphabetteAccess';

interface AlphabetteTrialBannerProps {
  onOpenPricing: () => void;
  onOpenByok: () => void;
}

export const AlphabetteTrialBanner: React.FC<AlphabetteTrialBannerProps> = ({
  onOpenPricing,
  onOpenByok,
}) => {
  const [access, setAccess] = useState<AlphabetteAccessState>(getAlphabetteAccessState());

  useEffect(() => {
    const handleUpdate = () => {
      setAccess(getAlphabetteAccessState());
    };
    window.addEventListener('alphabette-access-change', handleUpdate);
    return () => window.removeEventListener('alphabette-access-change', handleUpdate);
  }, []);

  // If Bouquet Intégral or Bouquet BYOK
  if (access.effectiveTier === 'bouquet_integral' || access.effectiveTier === 'bouquet_byok') {
    return (
      <div className="bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border-b border-amber-300/40 py-1.5 px-4 text-xs flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-amber-400 text-slate-950 font-bold">
              <Crown className="w-3.5 h-3.5" />
            </span>
            <span className="font-bold text-slate-900">
              {access.effectiveTier === 'bouquet_integral'
                ? 'Pass Bouquet Intégral Actif (Toutes les applications + IA Mistral managée)'
                : 'Pass Bouquet BYOK Actif (Toutes les applications · Clé Mistral client)'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenPricing}
              className="text-[11px] font-semibold text-slate-700 hover:text-slate-950 underline decoration-slate-300"
            >
              Gérer mon pass
            </button>
            <a
              href="http://alphabette.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1"
            >
              <span>alphabette.fr</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // If BYOK active (solo or personal key)
  if (access.effectiveTier === 'byok') {
    return (
      <div className="bg-emerald-50 border-b border-emerald-200/80 py-1.5 px-4 text-xs text-emerald-950">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">
              Mode BYOK Actif : Requêtes traitées exclusivement par votre clé Mistral AI (Souveraineté RGPD)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenByok}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline"
            >
              Configurer ma clé
            </button>
            <button
              onClick={onOpenPricing}
              className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900"
            >
              Découvrir le Bouquet (99 € / an)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If Managed solo (Confort 59€)
  if (access.effectiveTier === 'managed') {
    return (
      <div className="bg-indigo-50 border-b border-indigo-200/80 py-1.5 px-4 text-xs text-indigo-950">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold">
              Formule Confort Active : Consommation Mistral AI 100% incluse et managée par Alphabette
            </span>
          </div>

          <button
            onClick={onOpenPricing}
            className="text-[11px] font-bold text-indigo-700 hover:text-indigo-900 underline"
          >
            Passer au Bouquet Complet (199 € / an)
          </button>
        </div>
      </div>
    );
  }

  // If trial expired
  if (!access.isTrialActive) {
    return (
      <div className="bg-amber-500 text-slate-950 py-2.5 px-4 text-xs font-semibold shadow-xs">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              Votre période d'essai de 7 jours est terminée. Choisissez une formule ou saisissez votre clé Mistral (BYOK).
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenByok}
              className="px-2.5 py-1 bg-white/80 hover:bg-white text-slate-900 rounded-lg text-xs font-bold transition-colors"
            >
              Saisir ma clé (BYOK 39 €)
            </button>
            <button
              onClick={onOpenPricing}
              className="px-3 py-1 bg-slate-950 hover:bg-slate-900 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>Débloquer le Bouquet Alphabette</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Default: In 7-day trial
  return (
    <div className="bg-slate-900 text-slate-200 py-1.5 px-4 text-xs border-b border-slate-800">
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20 text-[10px] font-bold">
            <Clock className="w-3 h-3 text-amber-400" />
            <span>Période d'essai : {access.trialDaysLeft} jours restants</span>
          </span>
          <span className="text-slate-300 text-[11px] hidden md:inline">
            Accès complet alimenté par la clé Mistral propriétaire Alphabette (100% Souverain & RGPD)
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenByok}
            className="text-[11px] text-slate-300 hover:text-white underline decoration-slate-600 transition-colors"
          >
            Mode BYOK (Clé perso)
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={onOpenPricing}
            className="text-[11px] font-bold text-amber-400 hover:text-amber-300 transition-colors"
          >
            Tarifs & Bouquet Alphabette (dès 39 € / an)
          </button>
          <span className="text-slate-600 hidden sm:inline">•</span>
          <a
            href="http://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-blue-400 hover:text-blue-300 font-semibold hidden sm:inline"
          >
            alphabette.fr
          </a>
        </div>
      </div>
    </div>
  );
};
