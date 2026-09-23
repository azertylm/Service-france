import React, { useState } from 'react';
import {
  X,
  Printer,
  Download,
  ShieldCheck,
  Maximize2,
  ZoomIn,
  Sliders,
  Calendar,
  Store,
  DollarSign,
  FileText,
} from 'lucide-react';
import { ProductWarranty } from '../../types/garantie';

interface TicketViewerModalProps {
  warranty: ProductWarranty | null;
  onClose: () => void;
}

export const TicketViewerModal: React.FC<TicketViewerModalProps> = ({ warranty, onClose }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  if (!warranty) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!warranty.ticketImageData) return;
    const a = document.createElement('a');
    a.href = warranty.ticketImageData;
    a.download = `ticket_${warranty.brand}_${warranty.productName.slice(0, 15)}.jpg`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Coffre-fort anti-effacement thermique
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Preuve pérenne
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {warranty.brand} — {warranty.productName}
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

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Metadata pill bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Enseigne</span>
              <span className="font-bold text-slate-800">{warranty.store}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date d'achat</span>
              <span className="font-bold text-slate-800">
                {new Date(warranty.purchaseDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Montant</span>
              <span className="font-bold text-slate-800">
                {warranty.purchasePrice ? `${warranty.purchasePrice.toFixed(2)} € TTC` : 'Non renseigné'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Fin garantie légale</span>
              <span className="font-bold text-emerald-700">
                {new Date(warranty.warrantyEndDate).toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>

          {/* Thermal Ticket Preservation Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">Valeur probante auprès du SAV :</strong> La copie numérique
              haute fidélité du ticket de caisse est recevable en droit de la consommation (Code civil art. 1379)
              pour justifier de la date d'achat même si votre ticket thermique physique s'est entièrement effacé.
            </div>
          </div>

          {/* Ticket Image Display */}
          {warranty.ticketImageData ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Numérisation haute fidélité</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHighContrast(!highContrast)}
                    className={`px-2.5 py-1 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                      highContrast
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    title="Augmenter le contraste si le ticket original était estompé"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Contraste renforcé {highContrast ? 'Actif' : 'Normal'}</span>
                  </button>
                  <button
                    onClick={() => setZoomLevel(zoomLevel === 1 ? 1.5 : 1)}
                    className="px-2.5 py-1 rounded-lg border bg-white text-slate-700 border-slate-200 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{zoomLevel === 1 ? 'Zoomer' : 'Normal'}</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/5 rounded-2xl border border-slate-200 p-2 sm:p-4 flex items-center justify-center overflow-auto max-h-[460px]">
                <img
                  src={warranty.ticketImageData}
                  alt={`Ticket ${warranty.productName}`}
                  className="rounded-lg shadow-md max-w-full transition-all duration-200 object-contain"
                  style={{
                    filter: highContrast ? 'contrast(160%) brightness(95%)' : 'none',
                    transform: `scale(${zoomLevel})`,
                    transformOrigin: 'top center',
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center space-y-2">
              <FileText className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-700">Aucun scan attaché à cette fiche</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                La référence d'achat ({warranty.receiptNumber || 'N/A'}) et la date ({warranty.purchaseDate})
                sont enregistrées dans votre coffre-fort.
              </p>
            </div>
          )}

          {warranty.notes && (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 border border-slate-100">
              <strong className="text-slate-800 block mb-1">Notes personnelles :</strong>
              <p>{warranty.notes}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2">
            {warranty.ticketImageData && (
              <button
                onClick={handleDownload}
                className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-slate-600" />
                <span>Télécharger l'image</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer l'attestation</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
