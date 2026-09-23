import React from 'react';
import { X, Printer, ShieldCheck, Download, MapPin, Clock, Compass, Award } from 'lucide-react';
import { CircuitTheme, ArchitecturalSite } from '../../types/patrimoine';
import { SITES_DATA } from '../../data/patrimoineData';

interface TourismExportModalProps {
  circuit: CircuitTheme | null;
  onClose: () => void;
}

export const TourismExportModal: React.FC<TourismExportModalProps> = ({ circuit, onClose }) => {
  if (!circuit) return null;

  const sites = circuit.siteIds
    .map((id) => SITES_DATA.find((s) => s.id === id))
    .filter((s): s is ArchitecturalSite => Boolean(s));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Modal actions toolbar */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🖨️</span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                Kit Office de Tourisme & Partenaires Territoriaux
              </span>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Fiche de visite papier imprimable
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimer la fiche (A4)</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Sheet Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* Official Header */}
          <div className="border-b-2 border-slate-900 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold tracking-widest uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                  Service France
                </span>
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                  Patrimoine en Poche
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{circuit.title}</h1>
              <p className="text-sm text-slate-600 italic mt-0.5">{circuit.subtitle}</p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded">
                0% publicité • 100% culture
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Édition citoyenne libre</p>
            </div>
          </div>

          {/* Practical Info Bar */}
          <div className="grid grid-cols-4 gap-2 bg-slate-100 p-3 rounded-xl text-center text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Commune</span>
              <strong className="text-slate-900">{circuit.commune}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Durée</span>
              <strong className="text-slate-900">{circuit.duration}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Distance</span>
              <strong className="text-slate-900">{circuit.distanceKm} km ({circuit.transportMode})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Meilleur horaire</span>
              <strong className="text-slate-900">{circuit.recommendedTime}</strong>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed border-l-3 border-amber-500 pl-3">
            {circuit.description}
          </p>

          {/* Step-by-step markers */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b pb-1">
              Les étapes remarquables à explorer pas à pas :
            </h3>

            <div className="space-y-3.5">
              {sites.map((site, idx) => (
                <div
                  key={site.id}
                  className="border border-slate-200 rounded-lg p-3.5 text-xs space-y-1.5 break-inside-avoid"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-[11px]">
                        {idx + 1}
                      </span>
                      <strong className="text-sm text-slate-900">{site.name}</strong>
                    </div>
                    <span className="text-[11px] text-slate-500 italic">
                      {site.architect} ({site.yearBuilt})
                    </span>
                  </div>

                  <p className="text-slate-700 italic pl-7">« {site.shortTagline} »</p>

                  <div className="pl-7 space-y-1 pt-1">
                    <div className="text-[11px] text-slate-600">
                      <strong>À observer à l'œil nu :</strong> {site.whatToLookFor.join(' • ')}
                    </div>
                    <div className="text-[11px] text-purple-900 bg-purple-50 p-2 rounded">
                      <strong>Secret / Anecdote :</strong> {site.anecdote}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      📍 {site.address} — GPS : {site.coordinates.lat.toFixed(4)}, {site.coordinates.lng.toFixed(4)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charter & Independence notice */}
          <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>
                Charte d'utilité publique Service France : aucun partenariat rémunéré ni promotion de commerce.
              </span>
            </div>
            <span className="font-mono text-[10px]">Version prête pour affichage et distribution accueil</span>
          </div>
        </div>
      </div>
    </div>
  );
};
