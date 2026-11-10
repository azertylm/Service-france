import React, { useState } from 'react';
import {
  X,
  Layers,
  Download,
  Upload,
  CheckCircle2,
  FileJson,
  ShieldCheck,
  Crown,
  ExternalLink,
  ArrowRight,
  Database,
  RefreshCw,
} from 'lucide-react';

interface AlphabetteDataSynergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPricing?: () => void;
}

export const AlphabetteDataSynergyModal: React.FC<AlphabetteDataSynergyModalProps> = ({
  isOpen,
  onClose,
  onOpenPricing,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportBundle = () => {
    try {
      const bundleData: Record<string, any> = {
        format: 'alphabette_citizen_bundle_v1',
        exportedAt: new Date().toISOString(),
        issuer: 'papierpapier.fr · ALPHABETTE (Valentin RICHAUD)',
        sovereignty: 'Mistral AI Exclusive · Zero-Knowledge Local Storage',
        modules: {},
      };

      // Gather localStorage data from modules
      const keysToCollect = [
        'claircontrat_saved_history_v1',
        'autobailleur_tenants_v1',
        'autobailleur_properties_v1',
        'permisprotect_records_v1',
        'permisprotect_history_v1',
        'memosante_records_v1',
        'scangarantie_items_v1',
        'resilexpress_saved_v1',
        'etatdeslieux_inspections_v1',
        'zk_user_profiles_v1',
        'admin_keychain_vault_v1',
      ];

      for (const k of keysToCollect) {
        const item = localStorage.getItem(k);
        if (item) {
          try {
            bundleData.modules[k] = JSON.parse(item);
          } catch {
            bundleData.modules[k] = item;
          }
        }
      }

      const blob = new Blob([JSON.stringify(bundleData, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dossier_citoyen_alphabette_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Export error:', err);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.format && json.modules) {
          let count = 0;
          for (const [key, value] of Object.entries(json.modules)) {
            localStorage.setItem(
              key,
              typeof value === 'string' ? value : JSON.stringify(value)
            );
            count++;
          }
          setImportStatus(`Succès : ${count} modules synchronisés depuis le Bouquet Alphabette !`);
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        } else {
          setImportStatus("Format de fichier non reconnu. Veuillez fournir un export officiel Alphabette.");
        }
      } catch (pe) {
        setImportStatus("Erreur lors de la lecture du fichier JSON.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-md bg-blue-500/20 text-blue-300">
              <Database className="w-4 h-4" />
            </span>
            <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
              Synergie des Données & Bouquet Alphabette
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <span>Passerelle Inter-Applications Alphabette</span>
          </h2>

          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Format d'échange standardisé souverain : vos données dialoguent harmonieusement entre toutes les applications de la suite Alphabette sans aucun enfermement propriétaire.
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Export */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Download className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Exporter mon Dossier Citoyen
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Générez une archive JSON standardisée de vos contrats, quittances, avis ANTAI, relevés médicaux et tickets de garantie.
                </p>
              </div>

              <button
                type="button"
                onClick={handleExportBundle}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger l'archive JSON</span>
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <Upload className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  Importer un Dossier Alphabette
                </h4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Restaurez ou synchronisez instantanément votre dossier provenant d'une autre application ou machine de la suite.
                </p>
              </div>

              <label className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-100 text-slate-900 font-bold rounded-xl text-xs flex items-center justify-center gap-2 cursor-pointer shadow-2xs transition-colors">
                <Upload className="w-4 h-4 text-indigo-600" />
                <span>Sélectionner un fichier .json</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {importStatus && (
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Cross-selling Bouquet */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-amber-500/10 border border-amber-300/60 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Crown className="w-4 h-4 text-amber-600" />
              <span>Pourquoi choisir le Bouquet Alphabette complet ?</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              En souscrivant au <strong>Pass Bouquet Alphabette</strong> (99 € ou 199 € / an), toutes les applications de la suite communiquent nativement : vos quittances créées sur AutoBailleur alimentent votre décodeur de droits sociaux, et vos contestations ANTAI se lient automatiquement à vos courriers PlumeCitoyenne.
            </p>
            {onOpenPricing && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPricing();
                }}
                className="text-xs font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 pt-1"
              >
                <span>Découvrir la grille tarifaire du Bouquet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer with MANDATORY LINK */}
        <div className="bg-slate-900 text-white px-6 py-3.5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 text-center sm:text-left text-[11px]">
            ALPHABETTE · Synergie des données 100% souveraine
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
