import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Zap,
  Printer,
  Compass,
  ArrowLeft,
} from 'lucide-react';
import { CircuitTheme, ArchitecturalSite } from '../../types/patrimoine';
import { SITES_DATA } from '../../data/patrimoineData';
import { BatteryFriendlyCompass } from './BatteryFriendlyCompass';

interface CircuitViewerProps {
  circuit: CircuitTheme;
  onBack: () => void;
  onSelectSite: (site: ArchitecturalSite) => void;
  progress: {
    visitedSiteIds: string[];
    completedQuizIds: Record<string, number>;
  };
  onOpenPrintModal: (circuit: CircuitTheme) => void;
}

export const CircuitViewer: React.FC<CircuitViewerProps> = ({
  circuit,
  onBack,
  onSelectSite,
  progress,
  onOpenPrintModal,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const circuitSites = circuit.siteIds
    .map((id) => SITES_DATA.find((s) => s.id === id))
    .filter((s): s is ArchitecturalSite => Boolean(s));

  const totalSteps = circuitSites.length;
  const answeredStepsCount = circuitSites.filter((s) => progress.completedQuizIds[s.id] !== undefined).length;
  const circuitCompleted = answeredStepsCount === totalSteps && totalSteps > 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top navigation back button */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux parcours</span>
        </button>

        <button
          onClick={() => onOpenPrintModal(circuit)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs transition-colors"
          title="Prêt pour l'office de tourisme ou impression papier"
        >
          <Printer className="w-3.5 h-3.5 text-slate-500" />
          <span>Fiche imprimable (Kit Office de Tourisme)</span>
        </button>
      </div>

      {/* Circuit Header Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
            {circuit.commune} • {circuit.transportMode}
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded border border-emerald-800/60">
            <Zap className="w-3 h-3" />
            <span>Batterie préservée (sans suivi GPS continu)</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{circuit.title}</h1>
          <p className="text-slate-300 text-sm sm:text-base mt-1 italic">{circuit.subtitle}</p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">{circuit.description}</p>

        {/* Quick metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Durée estimée</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              {circuit.duration}
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Distance totale</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-indigo-400" />
              {circuit.distanceKm} km
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Étapes remarquables</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              {circuitSites.length} édifices
            </span>
          </div>
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-0.5">Progression quiz</span>
            <span className="text-white font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              {answeredStepsCount} / {totalSteps}
            </span>
          </div>
        </div>

        {/* Highlights */}
        <div className="border-t border-slate-800 pt-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Points forts de l'itinéraire :
          </span>
          <div className="flex flex-wrap gap-2">
            {circuit.highlights.map((h, i) => (
              <span
                key={i}
                className="text-xs bg-slate-800 text-slate-200 px-3 py-1 rounded-full border border-slate-700/60"
              >
                ✨ {h}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Completion message */}
      {circuitCompleted && (
        <div className="bg-emerald-900/40 border border-emerald-600/50 rounded-2xl p-5 text-emerald-100 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl shrink-0">
              🏆
            </div>
            <div>
              <div className="font-bold text-white text-sm sm:text-base">
                Félicitations citoyen ! Parcours entièrement validé
              </div>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Vous avez visité tous les édifices de ce circuit et répondu à chaque énigme architecturale.
              </p>
            </div>
          </div>
          <button
            onClick={() => onOpenPrintModal(circuit)}
            className="px-3 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg transition-colors shrink-0"
          >
            Télécharger mon diplôme / carnet
          </button>
        </div>
      )}

      {/* Steps List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Étapes de la balade ({circuitSites.length})</span>
          <span className="text-xs font-normal text-slate-500">— Cliquez sur un édifice pour décrypter ses secrets</span>
        </h2>

        <div className="space-y-4">
          {circuitSites.map((site, index) => {
            const isQuizDone = progress.completedQuizIds[site.id] !== undefined;

            return (
              <div
                key={site.id}
                className={`bg-white rounded-xl border transition-all p-5 shadow-xs ${
                  activeStepIndex === index
                    ? 'border-amber-500 ring-2 ring-amber-500/20 shadow-md'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Step number badge & details */}
                  <div className="flex items-start gap-3.5">
                    <span
                      className={`w-8 h-8 rounded-full font-bold text-sm flex items-center justify-center shrink-0 mt-0.5 ${
                        isQuizDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isQuizDone ? '✓' : index + 1}
                    </span>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold text-slate-500">{site.style}</span>
                        {site.label && (
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            {site.label}
                          </span>
                        )}
                        {isQuizDone && (
                          <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Énigme résolue ({site.badgeToUnlock.icon})
                          </span>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900">{site.name}</h3>
                      <p className="text-xs sm:text-sm text-slate-600 italic">« {site.shortTagline} »</p>
                      <p className="text-xs text-slate-500">
                        {site.architect} ({site.yearBuilt}) • {site.address}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                    <button
                      onClick={() => onSelectSite(site)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <span>Fiche complète & Audio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setActiveStepIndex(activeStepIndex === index ? -1 : index)}
                      className="text-xs text-amber-700 hover:text-amber-900 font-medium flex items-center gap-1 py-1"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>{activeStepIndex === index ? 'Masquer la boussole' : 'Cap & Distance'}</span>
                    </button>
                  </div>
                </div>

                {/* Expanded Compass / Orientation for this step */}
                {activeStepIndex === index && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <BatteryFriendlyCompass targetCoords={site.coordinates} targetName={site.name} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
