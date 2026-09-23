import React, { useRef } from 'react';
import {
  Lock,
  ShieldCheck,
  Download,
  Upload,
  Trash2,
  HardDrive,
  EyeOff,
  ServerOff,
  CheckCircle2,
} from 'lucide-react';
import { FamilyMember, VaccineRecord, AllergyRecord, PrescriptionRecord, SavedReport } from '../../types/memosante';

interface LocalVaultSecurityProps {
  familyMembers: FamilyMember[];
  vaccines: VaccineRecord[];
  allergies: AllergyRecord[];
  prescriptions: PrescriptionRecord[];
  savedReports: SavedReport[];
  onImportData: (data: any) => void;
  onClearAllData: () => void;
}

export const LocalVaultSecurity: React.FC<LocalVaultSecurityProps> = ({
  familyMembers,
  vaccines,
  allergies,
  prescriptions,
  savedReports,
  onImportData,
  onClearAllData,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleExportJson = () => {
    const exportBundle = {
      app: 'MémoSanté — Service France',
      exportedAt: new Date().toISOString(),
      version: '1.0',
      data: {
        familyMembers,
        vaccines,
        allergies,
        prescriptions,
        savedReports,
      },
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportBundle, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `memosante_sauvegarde_securisee_${new Date().toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.data) {
          onImportData(parsed.data);
          alert('Sauvegarde restaurée avec succès dans votre navigateur !');
        } else {
          alert('Format de fichier non reconnu.');
        }
      } catch (err) {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Manifesto of Sovereign Privacy */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Souveraineté Totale & Stockage Local 100 % Privé
            </h3>
            <p className="text-xs text-slate-300">
              Vos antécédents médicaux ne quittent jamais votre appareil
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
          Contrairement aux géants du web ou aux plateformes privées qui revendent ou indexent
          vos pathologies pour du profilage d'assurance ou du ciblage publicitaire,{' '}
          <strong>MémoSanté</strong> stocke l'intégralité de votre carnet médical (vaccins, ordonnances,
          allergies de vos enfants) uniquement sur votre navigateur (LocalStorage local chiffré).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <ServerOff className="w-6 h-6 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Zéro base cloud centrale
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aucune base de données médicale externe ne conserve vos ordonnances. Risque de fuite serveur = 0.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <EyeOff className="w-6 h-6 text-amber-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Zéro ciblage publicitaire
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Pas de traceurs publicitaires, pas de vente à des courtiers d'assurance ou laboratoires pharmaceutiques.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
            <HardDrive className="w-6 h-6 text-teal-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Vous possédez vos fichiers
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exportez à tout moment l'intégralité de vos données en un fichier JSON chiffré sur votre clé USB ou disque.
            </p>
          </div>
        </div>
      </div>

      {/* Metrics & Backup Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export / Import Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-600" />
              Sauvegarde & Restauration locale
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Téléchargez une copie complète de vos carnets de santé sous forme de fichier
              autonome pour la transférer sur un autre ordinateur, votre téléphone, ou la stocker
              sur un support sécurisé.
            </p>

            <div className="bg-slate-50 p-4 rounded-2xl space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between">
                <span>Membres du foyer :</span>
                <span className="font-bold text-slate-900">{familyMembers.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Vaccins et rappels enregistrés :</span>
                <span className="font-bold text-slate-900">{vaccines.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Allergies répertoriées :</span>
                <span className="font-bold text-slate-900">{allergies.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Traitements et ordonnances :</span>
                <span className="font-bold text-slate-900">{prescriptions.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Comptes-rendus décodés archivés :</span>
                <span className="font-bold text-slate-900">{savedReports.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleExportJson}
              className="w-full sm:w-auto flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span>Exporter ma sauvegarde (.JSON)</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Upload className="w-4 h-4 text-slate-500" />
              <span>Restaurer</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </div>
        </div>

        {/* Right to be forgotten / Reset */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Trash2 className="w-5 h-5 text-rose-600" />
              Droit à l'oubli & Purge immédiate
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Conformément à la réglementation RGPD et au principe républicain de discrétion, vous
              pouvez effacer l'intégralité de vos profils, bilans et ordonnances en un seul clic.
              Aucune copie résiduelle n'est conservée.
            </p>

            <div className="bg-rose-50/60 border border-rose-200/80 rounded-2xl p-4 text-xs text-rose-950 space-y-1">
              <strong className="block font-bold">Action irréversible :</strong>
              <p>
                Cette commande supprime toutes les données de santé stockées dans le cache de votre
                navigateur actuel. Veillez à exporter une sauvegarde au préalable si besoin.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={onClearAllData}
              className="w-full py-3 px-4 rounded-xl bg-white hover:bg-rose-50 border border-rose-300 text-rose-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Purger l'intégralité des données médicales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
