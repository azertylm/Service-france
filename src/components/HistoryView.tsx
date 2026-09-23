import React from 'react';
import { SavedContract } from '../types/contract';
import { Trash2, FileText, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface HistoryViewProps {
  savedContracts: SavedContract[];
  onSelectContract: (contract: SavedContract) => void;
  onDeleteContract: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  savedContracts,
  onSelectContract,
  onDeleteContract,
  onClearAll,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'CRITIQUE':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'ELEVE':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'MODERE':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif-title">
            Historique de vos contrats analysés
          </h1>
          <p className="mt-1 text-xs text-slate-600">
            Stockage 100% privé et local à votre navigateur. Aucune donnée n'est envoyée sur un cloud public.
          </p>
        </div>

        {savedContracts.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1.5 font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Effacer tout l'historique</span>
          </button>
        )}
      </div>

      {savedContracts.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">
            Aucun contrat sauvegardé pour le moment
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Lorsque vous analysez un contrat, cliquez sur « Sauvegarder » pour le retrouver ici ultérieurement.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {savedContracts.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-colors shadow-xs"
            >
              <div
                onClick={() => onSelectContract(item)}
                className="cursor-pointer flex-1"
              >
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span>{item.type}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-900 hover:underline">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                  {item.analysis.summary}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-md border font-medium ${getRiskColor(
                    item.riskLevel
                  )}`}
                >
                  {item.riskLevel}
                </span>

                <button
                  onClick={() => onSelectContract(item)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1 transition-colors"
                >
                  <span>Consulter la fiche</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteContract(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
