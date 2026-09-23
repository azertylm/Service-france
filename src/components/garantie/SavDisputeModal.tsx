import React, { useState, useEffect } from 'react';
import {
  X,
  Copy,
  Printer,
  Download,
  Check,
  Wrench,
  AlertTriangle,
  Scale,
  ShieldCheck,
  Send,
  Sparkles,
  FileText,
  User,
  MapPin,
  Clock,
} from 'lucide-react';
import { ProductWarranty } from '../../types/garantie';
import { generateWarrantyDisputeLetter, downloadFile } from '../../utils/garantieUtils';
import { AdministrativeKeychain } from '../../types/security';

interface SavDisputeModalProps {
  warranty: ProductWarranty | null;
  onClose: () => void;
  onSendToPlume?: (prompt: string, category: string) => void;
}

const COMMON_DEFECTS = [
  "L'appareil ne s'allume plus du tout, sans aucune cause extérieure ni choc",
  "Dysfonctionnement intermittent ou arrêt impromptu en cours de fonctionnement",
  "Surchauffe anormale avec mise en sécurité automatique",
  "Pièce mécanique ou charnière brisée lors d'une utilisation normale",
  "Affichage écran défectueux (lignes verticales, écran noir ou clignotement)",
  "Bruit strident ou vibrations anormales du moteur",
  "Fuite d'eau ou problème de vidange systématique",
];

export const SavDisputeModal: React.FC<SavDisputeModalProps> = ({
  warranty,
  onClose,
  onSendToPlume,
}) => {
  const [defectText, setDefectText] = useState(COMMON_DEFECTS[0]);
  const [demandType, setDemandType] = useState<
    'reparation_gratuite' | 'remplacement_neuf' | 'remboursement_integral'
  >('reparation_gratuite');

  // Consumer coordinates (autofilled from Trousseau Administratif if available)
  const [userFullName, setUserFullName] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const storedKeychain = localStorage.getItem('fs_admin_keychain_v1');
      if (storedKeychain) {
        const parsed: AdministrativeKeychain = JSON.parse(storedKeychain);
        if (parsed.fullName) setUserFullName(parsed.fullName);
        if (parsed.address) setUserAddress(parsed.address);
        if (parsed.city) setUserCity(`${parsed.postalCode || ''} ${parsed.city}`.trim());
        if (parsed.phoneNumber) setUserPhone(parsed.phoneNumber);
        if (parsed.email) setUserEmail(parsed.email);
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  if (!warranty) return null;

  const letterText = generateWarrantyDisputeLetter({
    warranty,
    userFullName: userFullName.trim() || undefined,
    userAddress: userAddress.trim() || undefined,
    userCity: userCity.trim() || undefined,
    userPhone: userPhone.trim() || undefined,
    userEmail: userEmail.trim() || undefined,
    defectDescription: defectText,
    demandType,
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(letterText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const safeName = warranty.productName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    downloadFile(letterText, `mise_en_demeure_sav_${safeName}.txt`);
  };

  const handleTransferToPlume = () => {
    if (onSendToPlume) {
      const prompt = `Je souhaite envoyer une mise en demeure formelle au SAV de l'enseigne ${warranty.store} pour mon appareil ${warranty.brand} ${warranty.productName} acheté le ${warranty.purchaseDate} (Facture n° ${warranty.receiptNumber || 'N/A'}).
La panne constatée est : « ${defectText} ».
L'appareil a moins de 2 ans et relève de la garantie légale de conformité (Code conso art. L.217-3 et suivants). Je réclame ${
        demandType === 'reparation_gratuite'
          ? "la réparation gratuite sous 30 jours sans aucun frais"
          : demandType === 'remplacement_neuf'
          ? "un échange contre un appareil neuf sans surcoût"
          : "le remboursement intégral immédiat"
      }. Merci de perfectionner ce courrier avec une rigueur juridique exemplaire.`;
      onSendToPlume(prompt, 'litige_consommation');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Garantie Légale de Conformité (2 ans)
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Art. L. 217-3 à L. 217-14
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Mise en demeure SAV — Réparation gratuite de plein droit
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Letter Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Legal Security Reminder */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-950 space-y-1">
              <strong className="text-sm font-bold block text-emerald-900">
                Vos 4 droits fondamentaux face au magasin :
              </strong>
              <p>
                <strong>1. Zéro frais :</strong> Le vendeur ne peut vous facturer ni devis, ni pièce, ni main-d'œuvre, ni frais d'envoi (Art. L. 217-11).
              </p>
              <p>
                <strong>2. Présomption de 24 mois :</strong> Vous n'avez pas à prouver la cause de la panne ; tout défaut apparaissant sous 2 ans est légalement réputé existant à l'achat (Art. L. 217-7).
              </p>
              <p>
                <strong>3. Délai limite de 30 jours :</strong> Le vendeur doit réparer sous 30 jours maximum. Passé ce délai, vous êtes en droit d'exiger le remboursement intégral (Art. L. 217-10 & L. 217-14).
              </p>
              <p>
                <strong>4. +6 mois de garantie :</strong> Tout appareil réparé sous garantie légale voit automatiquement sa garantie prolongée de 6 mois (loi AGEC / Art. L. 217-13).
              </p>
            </div>
          </div>

          {/* Configuration Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
            {/* Defect Selection */}
            <div className="space-y-2">
              <label className="font-bold text-slate-900 block flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5 text-amber-600" />
                <span>Panne constatée sur l'appareil :</span>
              </label>

              <select
                value={defectText}
                onChange={(e) => setDefectText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-slate-900 font-medium"
              >
                {COMMON_DEFECTS.map((defect, i) => (
                  <option key={i} value={defect}>
                    {defect}
                  </option>
                ))}
              </select>

              <textarea
                value={defectText}
                onChange={(e) => setDefectText(e.target.value)}
                placeholder="Ou décrivez précisément la panne..."
                rows={2}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-800 text-xs focus:ring-2 focus:ring-slate-900"
              />
            </div>

            {/* Demand Type & Contact */}
            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-900 block mb-1.5 flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-slate-700" />
                  <span>Votre demande formelle :</span>
                </label>
                <div className="grid grid-cols-1 gap-1.5">
                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="radio"
                      name="demand"
                      checked={demandType === 'reparation_gratuite'}
                      onChange={() => setDemandType('reparation_gratuite')}
                      className="text-slate-900"
                    />
                    <span className="font-semibold text-slate-800">
                      Réparation 100 % gratuite sous 30 jours
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="radio"
                      name="demand"
                      checked={demandType === 'remplacement_neuf'}
                      onChange={() => setDemandType('remplacement_neuf')}
                      className="text-slate-900"
                    />
                    <span className="font-semibold text-slate-800">
                      Échange contre un appareil neuf identique
                    </span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer hover:bg-slate-100">
                    <input
                      type="radio"
                      name="demand"
                      checked={demandType === 'remboursement_integral'}
                      onChange={() => setDemandType('remboursement_integral')}
                      className="text-slate-900"
                    />
                    <span className="font-semibold text-slate-800">
                      Remboursement intégral immédiat
                    </span>
                  </label>
                </div>
              </div>

              {/* Coordinates prefill */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="font-bold text-slate-700 block text-[11px]">
                  Vos coordonnées pour l'en-tête du courrier :
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <input
                    type="text"
                    placeholder="Prénom et NOM"
                    value={userFullName}
                    onChange={(e) => setUserFullName(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Tél (06...)"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="p-1.5 rounded-lg border border-slate-300 bg-white text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Letter Preview Display */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-600" />
                <span>Courrier type généré (Prêt à imprimer ou envoyer en LRAR)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Texte copié !</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-600" />
                      <span>Copier le texte</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4 sm:p-6 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap select-all shadow-inner max-h-[380px] overflow-y-auto">
              {letterText}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Fermer
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
            {onSendToPlume && (
              <button
                onClick={handleTransferToPlume}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                title="Ouvrir dans PlumeCitoyenne pour perfectionner et enrichir le courrier"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Peaufiner dans Plume</span>
              </button>
            )}

            <button
              onClick={handleDownloadTxt}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Télécharger (.txt)</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer le courrier</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
