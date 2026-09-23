import React, { useState } from 'react';
import { Lock, EyeOff, ShieldCheck, ChevronRight, X, FileLock } from 'lucide-react';

export const ConfidentialityBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-900 text-slate-200 py-2.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium text-slate-100">
              Protection citoyenne & Confidentialité stricte :
            </span>
            <span className="text-slate-300 hidden md:inline">
              Analyse chiffrée. Vos contrats ne sont ni vendus ni stockés sur des serveurs publics.
            </span>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="text-amber-400 hover:text-amber-300 font-medium underline underline-offset-2 flex items-center gap-1 transition-colors"
          >
            <span>Consulter nos engagements</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold text-slate-900 text-base">
                  Charte de confidentialité citoyenne
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm text-slate-600 leading-relaxed">
              <div className="flex items-start gap-3">
                <FileLock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900">Analyse éphémère et sécurisée</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Le document téléversé est traité en mémoire uniquement pour extraire les clauses pertinentes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <EyeOff className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900">Zéro réutilisation pour l'entraînement</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vos informations personnelles, adresses, coordonnées bancaires et noms ne sont jamais conservés ni partagés avec des tiers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-slate-900">Stockage 100% local à votre navigateur</h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Votre historique d'analyses reste stocké exclusivement dans le stockage local de votre propre navigateur. Vous pouvez l'effacer d'un seul clic à tout moment.
                  </p>
                </div>
              </div>

              {/* Solennel Zero-Knowledge Quote */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
                <blockquote className="italic font-medium">
                  « Vos données ne quittent pas votre appareil de manière lisible. ALPHABETTE SASU n'a aucun moyen technique d'accéder à vos documents, analyses ou courriers. »
                </blockquote>
                <div className="text-[10px] text-emerald-800 font-semibold text-right">
                  — Valentin RICHAUD, Fondateur d'ALPHABETTE SASU (La Grande-Motte)
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
              >
                J'ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
