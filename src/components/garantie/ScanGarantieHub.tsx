import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Plus,
  Camera,
  Search,
  Filter,
  AlertTriangle,
  Calendar,
  Sparkles,
  Download,
  Info,
  Scale,
  Wrench,
  Store,
  DollarSign,
  Clock,
  HelpCircle,
  FileText,
  Printer,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ProductWarranty } from '../../types/garantie';
import { SAMPLE_WARRANTIES } from '../../data/garantieSamples';
import { WarrantyCard } from './WarrantyCard';
import { ScanTicketModal } from './ScanTicketModal';
import { TicketViewerModal } from './TicketViewerModal';
import { SavDisputeModal } from './SavDisputeModal';
import { computeWarrantyStatus, downloadFile } from '../../utils/garantieUtils';

interface ScanGarantieHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category: string) => void;
}

const STORAGE_KEY = 'fs_scangarantie_items_v1';

export const ScanGarantieHub: React.FC<ScanGarantieHubProps> = ({
  onNavigateToPlumeWithPrompt,
}) => {
  const [warranties, setWarranties] = useState<ProductWarranty[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return SAMPLE_WARRANTIES;
  });

  // Modals state
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);
  const [activeTicketWarranty, setActiveTicketWarranty] = useState<ProductWarranty | null>(null);
  const [activeSavWarranty, setActiveSavWarranty] = useState<ProductWarranty | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expiring_soon' | 'expired'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showLegalGuide, setShowLegalGuide] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(warranties));
    } catch (e) {
      console.warn(e);
    }
  }, [warranties]);

  const handleSaveWarranty = (newWarranty: ProductWarranty) => {
    setWarranties((prev) => [newWarranty, ...prev]);
  };

  const handleDeleteWarranty = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir retirer cet appareil de vos garanties ?")) {
      setWarranties((prev) => prev.filter((w) => w.id !== id));
    }
  };

  const handleResetSamples = () => {
    if (window.confirm("Recharger les 4 exemples de démonstration (Darty, Fnac, Boulanger, Leroy Merlin) ?")) {
      setWarranties(SAMPLE_WARRANTIES);
    }
  };

  // Calculations
  const stats = warranties.reduce(
    (acc, item) => {
      const status = computeWarrantyStatus(item.purchaseDate, item.warrantyEndDate);
      acc.totalCount += 1;
      if (item.purchasePrice) acc.totalValue += item.purchasePrice;
      if (status.status === 'expiring_soon') acc.expiringSoonCount += 1;
      if (status.status === 'active') acc.activeCount += 1;
      if (item.eligibleBonusReparation && item.estimatedBonusAmount) {
        acc.potentialBonusTotal += item.estimatedBonusAmount;
      }
      return acc;
    },
    {
      totalCount: 0,
      totalValue: 0,
      expiringSoonCount: 0,
      activeCount: 0,
      potentialBonusTotal: 0,
    }
  );

  // Filtered warranties
  const filteredWarranties = warranties.filter((item) => {
    const status = computeWarrantyStatus(item.purchaseDate, item.warrantyEndDate);

    // Status filter
    if (statusFilter !== 'all' && status.status !== statusFilter) {
      return false;
    }

    // Category filter
    if (categoryFilter !== 'all' && item.category !== categoryFilter) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.productName.toLowerCase().includes(q);
      const matchBrand = item.brand.toLowerCase().includes(q);
      const matchStore = item.store.toLowerCase().includes(q);
      const matchRef = item.modelReference?.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchStore && !matchRef) {
        return false;
      }
    }

    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>ScanGarantie · Coffre-Fort de Tickets & Garanties 2 Ans</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Ne perdez plus jamais une garantie légale.
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              Les tickets de caisse thermiques s'effacent chimiquement et on oublie la garantie légale de conformité (2 ans minimum d'ordre public). Numérisez vos reçus, suivez les dates clés et générez votre mise en demeure SAV en cas de panne.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
            >
              <Plus className="w-4 h-4 text-slate-950" />
              <span>Scanner / Ajouter un ticket</span>
            </button>

            <button
              onClick={() => setShowLegalGuide(!showLegalGuide)}
              className="px-4 py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700 transition-colors"
            >
              <Scale className="w-3.5 h-3.5 text-blue-400" />
              <span>Vos droits SAV (L. 217-3)</span>
              {showLegalGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs">
          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Appareils protégés
            </span>
            <span className="text-xl font-black text-white">{stats.totalCount}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {stats.activeCount} sous garantie
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Valeur protégée
            </span>
            <span className="text-xl font-black text-emerald-400">
              {stats.totalValue.toFixed(0)} €
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Prix d'achat d'origine
            </span>
          </div>

          <div
            className={`p-3 rounded-2xl border ${
              stats.expiringSoonCount > 0
                ? 'bg-amber-950/60 border-amber-600/50'
                : 'bg-slate-800/50 border-slate-700/60'
            }`}
          >
            <span
              className={`block text-[10px] uppercase font-bold ${
                stats.expiringSoonCount > 0 ? 'text-amber-300' : 'text-slate-400'
              }`}
            >
              Alertes &lt; 30 jours
            </span>
            <span
              className={`text-xl font-black ${
                stats.expiringSoonCount > 0 ? 'text-amber-400 animate-pulse' : 'text-white'
              }`}
            >
              {stats.expiringSoonCount}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Échéance imminente
            </span>
          </div>

          <div className="bg-slate-800/50 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">
              Bonus QualiRépar
            </span>
            <span className="text-xl font-black text-amber-300">
              jusqu'à {stats.potentialBonusTotal} €
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Aides hors garantie (AGEC)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Legal Guide Drawer */}
      {showLegalGuide && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in slide-in-from-top-3 duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Guide pratique : Vos droits légaux face au Service Après-Vente
                </h2>
                <p className="text-xs text-slate-500">
                  Articles L. 217-3 à L. 217-20 du Code de la consommation (Directive Européenne 2019/771)
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowLegalGuide(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-700 leading-relaxed">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 block text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>1. Durée de 2 ans d'ordre public</span>
              </span>
              <p>
                Tout bien meuble neuf acheté auprès d'un professionnel est couvert pendant <strong>24 mois</strong> de plein droit. Le vendeur ne peut pas réduire cette durée, même dans ses conditions générales de vente.
              </p>
              <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                <strong>Attention au piège :</strong> Les « extensions de garantie » vendues 50€ à 150€ en caisse doublent souvent inutilement les droits déjà garantis gratuitement par la loi.
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 block text-sm flex items-center gap-1.5">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>2. Zéro frais pour le consommateur</span>
              </span>
              <p>
                L'article L. 217-11 interdit formellement au vendeur de facturer des « frais de dossier », un « devis obligatoire » ou des frais d'expédition pour envoyer l'appareil au centre technique national.
              </p>
              <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                <strong>Délai maximal :</strong> Le vendeur dispose de <strong>30 jours</strong> calendaires maximum pour réparer ou remplacer l'appareil.
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
              <span className="font-extrabold text-slate-900 block text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>3. Extension automatique de 6 mois</span>
              </span>
              <p>
                Grâce à la loi AGEC (Art. L. 217-13), tout appareil réparé sous garantie légale de conformité bénéficie d'une <strong>prolongation automatique de 6 mois</strong> de sa garantie légale.
              </p>
              <div className="text-[11px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                <strong>Bonus Réparation QualiRépar :</strong> Pour les appareils hors garantie, une aide de 15€ à 60€ est déduite directement chez les réparateurs agréés.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Search & Filters Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par appareil, marque ou enseigne..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-slate-900 text-slate-800"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Tous ({warranties.length})
          </button>

          <button
            onClick={() => setStatusFilter('active')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'active'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Actifs</span>
            <span className="font-mono text-[10px] opacity-80">({stats.activeCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('expiring_soon')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap flex items-center gap-1 ${
              statusFilter === 'expiring_soon'
                ? 'bg-amber-500 text-slate-950 font-black'
                : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200/80'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>&lt; 30 jours</span>
            <span className="font-mono text-[10px] font-bold">({stats.expiringSoonCount})</span>
          </button>

          <button
            onClick={() => setStatusFilter('expired')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
              statusFilter === 'expired'
                ? 'bg-slate-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Expirés
          </button>
        </div>

        {/* Category selector */}
        <div className="w-full md:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full md:w-auto p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold focus:ring-2 focus:ring-slate-900"
          >
            <option value="all">Toutes catégories</option>
            <option value="electromenager">Électroménager</option>
            <option value="smartphone_tablette">Smartphone & Tablette</option>
            <option value="informatique">Informatique</option>
            <option value="tv_son">Image & Son</option>
            <option value="bricolage_jardin">Bricolage</option>
            <option value="mobilier">Mobilier</option>
          </select>
        </div>
      </div>

      {/* 4. Warranties Grid */}
      {filteredWarranties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWarranties.map((warranty) => (
            <WarrantyCard
              key={warranty.id}
              warranty={warranty}
              onOpenTicket={(w) => setActiveTicketWarranty(w)}
              onOpenSavLetter={(w) => setActiveSavWarranty(w)}
              onDelete={handleDeleteWarranty}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Camera className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900">
              Aucun appareil ne correspond à vos filtres
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Scannez le ticket de caisse de votre dernier achat ou rechargez les exemples pour tester les fonctionnalités.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              onClick={() => setIsScanModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Ajouter un ticket
            </button>
            <button
              onClick={handleResetSamples}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors"
            >
              Recharger les exemples
            </button>
          </div>
        </div>
      )}

      {/* 5. Modals */}
      {isScanModalOpen && (
        <ScanTicketModal
          onClose={() => setIsScanModalOpen(false)}
          onSaveWarranty={handleSaveWarranty}
        />
      )}

      {activeTicketWarranty && (
        <TicketViewerModal
          warranty={activeTicketWarranty}
          onClose={() => setActiveTicketWarranty(null)}
        />
      )}

      {activeSavWarranty && (
        <SavDisputeModal
          warranty={activeSavWarranty}
          onClose={() => setActiveSavWarranty(null)}
          onSendToPlume={onNavigateToPlumeWithPrompt}
        />
      )}
    </div>
  );
};
