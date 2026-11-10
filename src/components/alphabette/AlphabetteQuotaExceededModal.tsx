import React from 'react';
import { X, AlertTriangle, Key, Crown, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

interface AlphabetteQuotaExceededModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing: () => void;
  onOpenKeychain: () => void;
  dailyCount: number;
  maxLimit: number;
}

export const AlphabetteQuotaExceededModal: React.FC<AlphabetteQuotaExceededModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
  onOpenKeychain,
  dailyCount,
  maxLimit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full bg-black/20 text-amber-200 text-[11px] font-black uppercase tracking-wider border border-amber-300/30 flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Coupe-circuit Quota Quotidien (Règle 429)</span>
            </span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-amber-300" />
            <span>Quota quotidien atteint</span>
          </h3>
          <p className="text-xs text-amber-100 mt-1">
            Utilisation actuelle : {dailyCount} / {maxLimit} requêtes gratuites journalières.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 text-slate-800 text-xs sm:text-sm">
          {/* Exact mandatory quote */}
          <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-300/80 text-amber-950 leading-relaxed font-medium">
            « Votre quota quotidien gratuit est atteint. Pour bénéficier d'un accès instantané et sans restriction, activez votre abonnement annuel et renseignez votre propre clé API dans votre espace Alphabette. »
          </div>

          <div className="space-y-3 text-slate-600 text-xs">
            <p>
              Les services de l'écosystème Alphabette (Proxilien, Info Perso, Focus News, L'Œil de l'Atelier, Papier Papier, IA Débat, etc.) offrent une période d'essai généreuse et un quota journalier encadré pour garantir la haute disponibilité de l'infrastructure souveraine.
            </p>
            <ul className="space-y-2 pt-1 font-medium text-slate-700">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Formule application unique : 15 € / an</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600" />
                <span>Bouquet complet Alphabette : 40 € / an (Toutes les apps)</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <button
              onClick={() => {
                onClose();
                onOpenPricing();
              }}
              className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-xs sm:text-sm"
            >
              <Crown className="w-4 h-4 text-amber-400" />
              <span>S'abonner (15 € ou 40 €/an) pour débloquer l'illimité</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                onClose();
                onOpenKeychain();
              }}
              className="w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold rounded-xl flex items-center justify-center gap-2 transition-all text-xs border border-indigo-200"
            >
              <Key className="w-4 h-4 text-indigo-600" />
              <span>Renseigner ma clé API (Espace Trousseau)</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2 text-slate-400 hover:text-slate-700 font-semibold text-center text-xs transition-colors"
            >
              Revenir demain
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-900 text-slate-400 px-6 py-3 text-[11px] flex items-center justify-between border-t border-slate-800">
          <span>ALPHABETTE · La Grande-Motte</span>
          <span className="text-amber-300 font-bold">Sécurité & Équité d'accès</span>
        </div>
      </div>
    </div>
  );
};
