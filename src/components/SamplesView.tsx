import React, { useState } from 'react';
import { SAMPLE_CONTRACTS } from '../data/sampleContracts';
import { SampleContract } from '../types/contract';
import { ArrowRight, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';

interface SamplesViewProps {
  onAnalyzeSample: (sample: SampleContract) => void;
  isLoading: boolean;
}

export const SamplesView: React.FC<SamplesViewProps> = ({
  onAnalyzeSample,
  isLoading,
}) => {
  const [selectedSample, setSelectedSample] = useState<SampleContract>(SAMPLE_CONTRACTS[0]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif-title">
          Exemples types de contrats du quotidien
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Découvrez comment les clauses abusives se dissimulent dans les contrats réels (baux, devis, assurances, abonnements) et comment ClairContrat les débusque.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sample List Sidebar */}
        <div className="md:col-span-1 space-y-2.5">
          {SAMPLE_CONTRACTS.map((sample) => (
            <div
              key={sample.id}
              onClick={() => setSelectedSample(sample)}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                selectedSample.id === sample.id
                  ? 'border-slate-900 bg-white shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] text-slate-500 font-medium">
                {sample.category}
              </div>
              <h3 className="text-xs font-bold text-slate-900 mt-1">
                {sample.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {sample.shortDesc}
              </p>
              <div className="mt-2 text-[11px] text-amber-800 font-mono">
                {sample.knownTrapsCount} clauses pièges incluses
              </div>
            </div>
          ))}
        </div>

        {/* Selected Sample Detail & Preview */}
        <div className="md:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-medium text-slate-500">
                  {selectedSample.category}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5 font-serif-title">
                  {selectedSample.title}
                </h2>
              </div>
              <button
                onClick={() => onAnalyzeSample(selectedSample)}
                disabled={isLoading}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              >
                <span>{isLoading ? 'Analyse...' : 'Lancer le diagnostic'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </button>
            </div>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Extrait du document contractuel :
              </h4>
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed max-h-96 overflow-y-auto whitespace-pre-wrap select-all">
                {selectedSample.text}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Pourquoi cet exemple ?</span>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Ce texte reprend fidèlement les clauses abusives régulièrement sanctionnées par la Commission des clauses abusives (CCA) et les tribunaux français, mais qui continuent d'être signées chaque jour par des citoyens désarmés.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
