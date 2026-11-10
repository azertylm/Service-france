import React from 'react';
import { ExternalLink, ShieldCheck, Sparkles, Layers } from 'lucide-react';

interface AlphabetteFooterProps {
  onOpenPricing?: () => void;
  onOpenByok?: () => void;
  className?: string;
}

export const AlphabetteFooter: React.FC<AlphabetteFooterProps> = ({
  onOpenPricing,
  onOpenByok,
  className = '',
}) => {
  return (
    <footer className={`bg-slate-900 text-slate-300 py-8 px-4 sm:px-6 lg:px-8 print:hidden border-t border-slate-800 ${className}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* MANDATORY PROMINENT LINK TO CENTRAL HUB: http://alphabette.fr */}
        <div className="bg-gradient-to-r from-blue-900/60 via-slate-800/80 to-indigo-900/60 border border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30 flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm sm:text-base font-bold text-white flex items-center justify-center md:justify-start gap-2">
                <span>Écosystème Logiciel Alphabette</span>
                <span className="text-[10px] uppercase font-black tracking-wider bg-blue-500/30 text-blue-300 px-2 py-0.5 rounded-full border border-blue-400/20">
                  Hub Central
                </span>
              </p>
              <p className="text-xs text-slate-300 mt-0.5">
                Une suite complète de solutions autonomes et interconnectées d'utilité civique et professionnelle.
              </p>
            </div>
          </div>

          <a
            href="http://alphabette.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 shrink-0 group"
          >
            <span>Découvrir toutes les applications de la suite sur http://alphabette.fr</span>
            <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        {/* Technical sovereignty and official pricing links */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 text-xs text-slate-400">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-3 w-4 rounded-xs overflow-hidden border border-white/20">
                <span className="w-1.5 bg-[#002654]" />
                <span className="w-1 bg-white" />
                <span className="w-1.5 bg-[#CE1126]" />
              </span>
              <span className="font-semibold text-white">papierpapier.fr</span>
              <span>·</span>
              <span>Brique officielle de la suite Alphabette</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Mistral AI (Souveraineté européenne · RGPD natif)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenByok && (
              <button
                onClick={onOpenByok}
                className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-4 text-[11px]"
              >
                Configuration IA (BYOK)
              </button>
            )}
            {onOpenPricing && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenPricing}
                  className="hover:text-amber-300 font-medium text-amber-400 transition-colors underline decoration-amber-600 underline-offset-4 text-[11px]"
                >
                  Tarifs (15 € ou 40 € par an)
                </button>
              </>
            )}
            <span>•</span>
            <a
              href="http://alphabette.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
              alphabette.fr
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>
            Édité par <strong>ALPHABETTE</strong> · Fondée par Valentin RICHAUD à La Grande-Motte (Hérault).
          </p>
          <p>
            Modèles commerciaux Mistral AI sans réutilisation pour l'entraînement · Données hébergées en Union Européenne.
          </p>
        </div>
      </div>
    </footer>
  );
};
