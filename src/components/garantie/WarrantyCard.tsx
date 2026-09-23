import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Store,
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  Download,
  Eye,
  Trash2,
  Sparkles,
  Wrench,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { ProductWarranty } from '../../types/garantie';
import { computeWarrantyStatus, generateWarrantyIcs, downloadFile } from '../../utils/garantieUtils';

interface WarrantyCardProps {
  warranty: ProductWarranty;
  onOpenTicket: (warranty: ProductWarranty) => void;
  onOpenSavLetter: (warranty: ProductWarranty) => void;
  onDelete: (id: string) => void;
}

export const WarrantyCard: React.FC<WarrantyCardProps> = ({
  warranty,
  onOpenTicket,
  onOpenSavLetter,
  onDelete,
}) => {
  const statusInfo = computeWarrantyStatus(warranty.purchaseDate, warranty.warrantyEndDate);

  const handleDownloadIcs = () => {
    const icsContent = generateWarrantyIcs(warranty);
    const safeName = warranty.productName.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20);
    downloadFile(icsContent, `rappel_garantie_${safeName}.ics`, 'text/calendar;charset=utf-8');
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'electromenager':
        return 'Électroménager';
      case 'smartphone_tablette':
        return 'Téléphonie & Tablette';
      case 'informatique':
        return 'Informatique';
      case 'tv_son':
        return 'Image & Son';
      case 'bricolage_jardin':
        return 'Bricolage & Jardin';
      case 'mobilier':
        return 'Mobilier';
      default:
        return 'Bien d équipement';
    }
  };

  return (
    <div
      className={`bg-white rounded-2xl border transition-all duration-200 p-5 shadow-xs hover:shadow-md flex flex-col justify-between ${
        statusInfo.status === 'expiring_soon'
          ? 'border-amber-400 ring-2 ring-amber-200/60'
          : statusInfo.status === 'expired'
          ? 'border-slate-200 opacity-90'
          : 'border-slate-200 hover:border-blue-400'
      }`}
    >
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {getCategoryLabel(warranty.category)}
          </span>

          <span
            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusInfo.badgeClass}`}
          >
            {statusInfo.status === 'expiring_soon' && <AlertTriangle className="w-3 h-3 text-amber-600" />}
            {statusInfo.status === 'active' && <ShieldCheck className="w-3 h-3 text-emerald-600" />}
            {statusInfo.status === 'expired' && <ShieldAlert className="w-3 h-3 text-rose-500" />}
            <span>{statusInfo.label}</span>
          </span>
        </div>

        {/* Product Brand & Name */}
        <div className="mb-3">
          <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
            {warranty.brand}
          </span>
          <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
            {warranty.productName}
          </h3>
          {warranty.modelReference && (
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Réf : {warranty.modelReference}
            </p>
          )}
        </div>

        {/* Purchase Info Grid */}
        <div className="bg-slate-50 rounded-xl p-3 space-y-1.5 text-xs text-slate-600 mb-4 border border-slate-100">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Store className="w-3.5 h-3.5" />
              <span>Enseigne</span>
            </span>
            <span className="font-semibold text-slate-800 text-right truncate max-w-[170px]">
              {warranty.store}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              <span>Achat</span>
            </span>
            <span className="font-medium text-slate-800">
              {new Date(warranty.purchaseDate).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {warranty.purchasePrice !== undefined && warranty.purchasePrice > 0 && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500">
                <DollarSign className="w-3.5 h-3.5" />
                <span>Prix payé</span>
              </span>
              <span className="font-bold text-slate-900">
                {warranty.purchasePrice.toFixed(2)} € TTC
              </span>
            </div>
          )}

          {warranty.receiptNumber && (
            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
              <span className="text-slate-400">N° Ticket/Facture</span>
              <span className="font-mono text-slate-600 truncate max-w-[150px]">
                {warranty.receiptNumber}
              </span>
            </div>
          )}
        </div>

        {/* 24-Month Legal Warranty Gauge */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Garantie 2 ans (L. 217-3)</span>
            </span>
            <span className="font-bold text-slate-800 font-mono text-[11px]">
              Échéance : {new Date(warranty.warrantyEndDate).toLocaleDateString('fr-FR')}
            </span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                statusInfo.status === 'expired'
                  ? 'bg-rose-500'
                  : statusInfo.status === 'expiring_soon'
                  ? 'bg-amber-500'
                  : 'bg-emerald-500'
              }`}
              style={{ width: `${statusInfo.percentElapsed}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Achat</span>
            <span>{statusInfo.percentElapsed}% écoulé</span>
            <span>Fin 24 mois</span>
          </div>
        </div>

        {/* Bonus Réparation Badge (QualiRépar / AGEC) */}
        {warranty.eligibleBonusReparation && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">Bonus Réparation QualiRépar</span>
            </div>
            <span className="font-extrabold text-emerald-800 bg-white px-2 py-0.5 rounded-md border border-emerald-300 text-[11px]">
              jusqu à {warranty.estimatedBonusAmount || 30} € d aide
            </span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-slate-100 space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {/* View Ticket Image (Anti-thermal fading) */}
          <button
            onClick={() => onOpenTicket(warranty)}
            className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Consulter le ticket certifié anti-effacement"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600" />
            <span>Preuve / Ticket</span>
          </button>

          {/* Export .ICS 30-Day Reminder */}
          <button
            onClick={handleDownloadIcs}
            className="py-2 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            title="Télécharger un rappel iCal (.ics) 30 jours avant l'échéance"
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Rappel -30j</span>
          </button>
        </div>

        {/* Claim Free Repair Button */}
        <button
          onClick={() => onOpenSavLetter(warranty)}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <Wrench className="w-3.5 h-3.5 text-amber-400" />
          <span>Faire jouer la garantie (Courrier SAV)</span>
        </button>

        {/* Delete option */}
        <div className="flex justify-end pt-1">
          <button
            onClick={() => onDelete(warranty.id)}
            className="text-[11px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors p-1"
            title="Supprimer cet appareil de mes garanties"
          >
            <Trash2 className="w-3 h-3" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
