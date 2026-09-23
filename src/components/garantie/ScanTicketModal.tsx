import React, { useState, useRef } from 'react';
import {
  X,
  Upload,
  Camera,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Store,
  Tag,
  DollarSign,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ProductWarranty, WarrantyCategory, ExtractedWarrantyData } from '../../types/garantie';
import { compressTicketImage, calculateWarrantyEndDate } from '../../utils/garantieUtils';
import { SAMPLE_WARRANTIES } from '../../data/garantieSamples';

interface ScanTicketModalProps {
  onClose: () => void;
  onSaveWarranty: (warranty: ProductWarranty) => void;
}

export const ScanTicketModal: React.FC<ScanTicketModalProps> = ({ onClose, onSaveWarranty }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedWarrantyData | null>(null);

  // Form Fields (editable once extracted or manually entered)
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [modelReference, setModelReference] = useState('');
  const [category, setCategory] = useState<WarrantyCategory>('electromenager');
  const [store, setStore] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [purchasePrice, setPurchasePrice] = useState<number | ''>('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [eligibleBonusReparation, setEligibleBonusReparation] = useState(false);
  const [estimatedBonusAmount, setEstimatedBonusAmount] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setErrorMessage(null);

      // 1. Client-side compression to preserve the ticket against fading without hogging storage
      const compressedDataUrl = await compressTicketImage(file);
      setSelectedImage(compressedDataUrl);

      // 2. Call server extraction endpoint
      const response = await fetch('/api/scan-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: {
            data: compressedDataUrl,
            mimeType: 'image/jpeg',
          },
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Impossible d'extraire les données du ticket.");
      }

      const data: ExtractedWarrantyData = result.warrantyData;
      setExtractedData(data);

      // Prefill fields
      if (data.productName) setProductName(data.productName);
      if (data.brand) setBrand(data.brand);
      if (data.modelReference) setModelReference(data.modelReference);
      if (data.category) setCategory(data.category);
      if (data.store) setStore(data.store);
      if (data.purchaseDate) setPurchaseDate(data.purchaseDate);
      if (data.purchasePrice) setPurchasePrice(data.purchasePrice);
      if (data.receiptNumber) setReceiptNumber(data.receiptNumber);
      if (data.serialNumber) setSerialNumber(data.serialNumber);
      if (data.eligibleBonusReparation) setEligibleBonusReparation(true);
      if (data.estimatedBonusAmount) setEstimatedBonusAmount(data.estimatedBonusAmount);
    } catch (err: any) {
      console.warn("Scan error:", err);
      setErrorMessage(
        err?.message ||
          "La lecture automatique n'a pas pu aboutir. Vous pouvez néanmoins renseigner manuellement votre garantie ci-dessous."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSample = (sample: ProductWarranty) => {
    setProductName(sample.productName);
    setBrand(sample.brand);
    setModelReference(sample.modelReference || '');
    setCategory(sample.category);
    setStore(sample.store);
    setPurchaseDate(sample.purchaseDate);
    setPurchasePrice(sample.purchasePrice || '');
    setReceiptNumber(sample.receiptNumber || '');
    setSerialNumber(sample.serialNumber || '');
    setNotes(sample.notes || '');
    setEligibleBonusReparation(sample.eligibleBonusReparation || false);
    setEstimatedBonusAmount(sample.estimatedBonusAmount || 0);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!productName.trim() || !brand.trim() || !store.trim()) {
      setErrorMessage("Veuillez au moins indiquer la marque, le produit et l'enseigne.");
      return;
    }

    const endDate = calculateWarrantyEndDate(purchaseDate, 24);

    const newWarranty: ProductWarranty = {
      id: `warr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productName: productName.trim(),
      brand: brand.trim(),
      modelReference: modelReference.trim() || undefined,
      category,
      store: store.trim(),
      purchaseDate,
      purchasePrice: typeof purchasePrice === 'number' ? purchasePrice : undefined,
      receiptNumber: receiptNumber.trim() || undefined,
      serialNumber: serialNumber.trim() || undefined,
      warrantyDurationMonths: 24,
      warrantyEndDate: endDate,
      ticketImageData: selectedImage || undefined,
      receiptType: 'ticket_de_caisse',
      notes: notes.trim() || undefined,
      eligibleBonusReparation,
      estimatedBonusAmount: eligibleBonusReparation ? estimatedBonusAmount : 0,
      createdAt: new Date().toISOString(),
    };

    onSaveWarranty(newWarranty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-amber-400 tracking-wider">
                  Numérisation de preuve d'achat
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Anti-effacement thermique
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Ajouter un ticket de caisse ou une facture
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

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* Top Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-blue-950">
            <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Pourquoi numériser immédiatement ?</strong> Les tickets de caisse imprimés sur papier thermique s'effacent chimiquement au bout de quelques mois (chaleur, lumière). Enregistrez la photo ici : elle est stockée en local de façon indélébile pour faire valoir vos 2 ans de garantie légale auprès du SAV.
            </div>
          </div>

          {/* Quick Sample Selector */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Ou essayez en 1 clic avec un exemple d'achat type :</span>
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_WARRANTIES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>📦 {sample.store.split(' ')[0]}</span>
                  <span className="text-slate-400">({sample.brand})</span>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Zone */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-900 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/60 hover:bg-slate-50 flex flex-col items-center justify-center gap-2 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />

            {isLoading ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                <span className="text-xs font-bold text-slate-700">
                  Détection automatique de l'appareil et des dates de garantie...
                </span>
              </div>
            ) : selectedImage ? (
              <div className="space-y-2">
                <div className="max-h-36 overflow-hidden rounded-xl border border-slate-200 shadow-xs inline-block">
                  <img
                    src={selectedImage}
                    alt="Ticket sélectionné"
                    className="max-h-36 object-contain"
                  />
                </div>
                <p className="text-xs font-bold text-emerald-700 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Ticket capturé et optimisé contre l'effacement</span>
                </p>
                <p className="text-[11px] text-slate-400">
                  Cliquez pour changer de photo
                </p>
              </div>
            ) : (
              <>
                <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-slate-700 group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6 text-slate-700" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-slate-800">
                    Prendre une photo ou importer un ticket de caisse / facture
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Appareil photo smartphone, fichier JPG, PNG ou PDF
                  </p>
                </div>
              </>
            )}
          </div>

          {errorMessage && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-xs text-amber-900">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Extracted Vigilance Points */}
          {extractedData?.detectedVigilancePoints && extractedData.detectedVigilancePoints.length > 0 && (
            <div className="bg-slate-900 text-white p-3.5 rounded-2xl space-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Points de vigilance détectés sur votre ticket :</span>
              </div>
              <ul className="space-y-1 text-slate-300">
                {extractedData.detectedVigilancePoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields for Review & Confirmation */}
          <form id="warranty-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
              Détails de l'appareil & Garantie légale
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Marque de l'appareil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Bosch, Samsung, Whirlpool, Apple..."
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Nom du produit / appareil *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Lave-linge hublot Série 4"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Catégorie
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as WarrantyCategory)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                >
                  <option value="electromenager">Gros ou petit électroménager</option>
                  <option value="smartphone_tablette">Smartphone ou tablette</option>
                  <option value="informatique">Informatique / Ordinateur</option>
                  <option value="tv_son">Téléviseur, son & vidéo</option>
                  <option value="bricolage_jardin">Bricolage & Outillage</option>
                  <option value="mobilier">Mobilier & Literie</option>
                  <option value="autre">Autre équipement</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Enseigne / Magasin vendeur *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex : Darty, Fnac, Boulanger, Leroy Merlin..."
                  value={store}
                  onChange={(e) => setStore(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Date d'achat *
                </label>
                <input
                  type="date"
                  required
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Prix d'achat TTC (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Ex : 499.99"
                  value={purchasePrice}
                  onChange={(e) =>
                    setPurchasePrice(e.target.value === '' ? '' : parseFloat(e.target.value))
                  }
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-medium focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Référence modèle (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : WAN28208FF"
                  value={modelReference}
                  onChange={(e) => setModelReference(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Numéro de ticket ou facture (optionnel)
                </label>
                <input
                  type="text"
                  placeholder="Ex : TK-2025-994820"
                  value={receiptNumber}
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            {/* Bonus Reparation Checkbox */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={eligibleBonusReparation}
                  onChange={(e) => setEligibleBonusReparation(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded"
                />
                <span className="font-bold text-emerald-950">
                  Éligible au Bonus Réparation QualiRépar (loi AGEC)
                </span>
              </label>

              {eligibleBonusReparation && (
                <div className="flex items-center gap-1 text-xs">
                  <span className="text-slate-600">Aide estimée :</span>
                  <input
                    type="number"
                    value={estimatedBonusAmount}
                    onChange={(e) => setEstimatedBonusAmount(parseInt(e.target.value) || 0)}
                    className="w-16 p-1 border border-emerald-300 rounded bg-white text-center font-bold text-emerald-800"
                  />
                  <span className="font-bold text-emerald-800">€</span>
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Notes personnelles (optionnel)
              </label>
              <textarea
                rows={2}
                placeholder="Ex : Livré au 2e étage, extension Darty Sérénité 1 an, panne mineure constatée..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Annuler
          </button>

          <button
            type="submit"
            form="warranty-form"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Enregistrer dans mon coffre-fort</span>
          </button>
        </div>
      </div>
    </div>
  );
};
