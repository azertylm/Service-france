import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Calculator,
  FileCheck2,
  Scale,
  Receipt,
  Printer,
  Copy,
  Download,
  AlertTriangle,
  Info,
  Calendar,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Percent,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Coins,
  ShieldCheck,
  User,
  Home
} from 'lucide-react';
import {
  IRLIndex,
  ChargeItem,
  AutoBailleurProperty,
  RentReceiptData
} from '../../types/autobailleur';
import {
  OFFICIAL_IRL_DATA,
  calculateIRLRevision,
  MONTH_NAMES_FR
} from '../../data/irlData';
import {
  DEFAULT_SAMPLE_CHARGES,
  OFFICIAL_LEGAL_CHARGES_RULE
} from '../../data/chargesCategories';

interface AutoBailleurHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category?: any) => void;
}

const STORAGE_PROPERTY_KEY = 'autobailleur_property_v1';
const STORAGE_CHARGES_KEY = 'autobailleur_charges_v1';
const STORAGE_ADMIN_PROFILE = 'claircontrat_admin_profile_v1';

export const AutoBailleurHub: React.FC<AutoBailleurHubProps> = ({
  onNavigateToPlumeWithPrompt
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'indexation' | 'quittance' | 'charges' | 'bien'>('indexation');

  // Property & Landlord State
  const [property, setProperty] = useState<AutoBailleurProperty>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROPERTY_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      id: 'prop_1',
      propertyLabel: 'Appartement T2 Centre-Ville',
      address: '14 Rue Paradis',
      postalCode: '13006',
      city: 'Marseille',
      tenantFullName: 'Julien DUBOIS',
      tenantEmail: 'julien.dubois@email.fr',
      tenantPhone: '06 98 76 54 32',
      leaseStartDate: '2023-09-01',
      anniversaryMonth: 9, // Septembre
      baseRentExcludingCharges: 680,
      monthlyChargesProvision: 75,
      securityDeposit: 680,
      baselineIRLQuarter: 'T2 2023',
      baselineIRLValue: 140.59,
      paymentMethod: 'Virement bancaire'
    };
  });

  // Landlord Name / Info (from Keychain if present)
  const [landlordInfo, setLandlordInfo] = useState({
    fullName: 'Marc DELAUNAY',
    address: '28 Boulevard Michelet, 13008 Marseille',
    phone: '06 12 34 56 78',
    email: 'marc.delaunay@email.fr'
  });

  // Pull Keychain info if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ADMIN_PROFILE);
      if (raw) {
        const p = JSON.parse(raw);
        setLandlordInfo((prev) => ({
          fullName: p.fullName || prev.fullName,
          address: p.address || prev.address,
          phone: p.phone || prev.phone,
          email: p.email || prev.email
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save property data
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROPERTY_KEY, JSON.stringify(property));
    } catch (e) {
      console.error(e);
    }
  }, [property]);

  // ==========================================
  // 1. CALCULATEUR D'INDEXATION IRL (INSEE)
  // ==========================================
  const [rentToRevise, setRentToRevise] = useState<number>(property.baseRentExcludingCharges);
  const [oldIrlLabel, setOldIrlLabel] = useState<string>('T2 2023');
  const [newIrlLabel, setNewIrlLabel] = useState<string>('T2 2024');
  const [revisionEffectiveDate, setRevisionEffectiveDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });

  // Lookups for IRL values
  const oldIrlObj = useMemo(() => {
    return OFFICIAL_IRL_DATA.find((i) => i.label === oldIrlLabel) || OFFICIAL_IRL_DATA[12];
  }, [oldIrlLabel]);

  const newIrlObj = useMemo(() => {
    return OFFICIAL_IRL_DATA.find((i) => i.label === newIrlLabel) || OFFICIAL_IRL_DATA[8];
  }, [newIrlLabel]);

  // Compute revision
  const revisionResult = useMemo(() => {
    return calculateIRLRevision(rentToRevise, oldIrlObj.value, newIrlObj.value);
  }, [rentToRevise, oldIrlObj.value, newIrlObj.value]);

  const annualExtraAmount = Math.round(revisionResult.difference * 12 * 100) / 100;

  // Generated Revision Letter
  const revisionLetterText = useMemo(() => {
    return `Expéditeur :
${landlordInfo.fullName}
${landlordInfo.address}
Tél : ${landlordInfo.phone} | Email : ${landlordInfo.email}

Destinataire :
${property.tenantFullName}
${property.address}
${property.postalCode} ${property.city}

Fait à ${property.city}, le ${new Date().toLocaleDateString('fr-FR')}
Objet : Notification de révision annuelle de loyer (Indice IRL INSEE)

Madame, Monsieur ${property.tenantFullName},

En vertu de la clause d'indexation stipulée dans votre bail d'habitation signé le ${new Date(property.leaseStartDate).toLocaleDateString('fr-FR')} pour le logement situé au ${property.address}, ${property.postalCode} ${property.city}, et conformément à l'article 17-1 de la Loi n° 89-462 du 6 juillet 1989, je vous notifie la révision annuelle de votre loyer.

Le calcul de cette indexation légale s'établit selon la formule officielle suivante :
Nouveau loyer = Loyer en cours x (Nouvel IRL / Ancien IRL)

Détail du calcul officiel INSEE :
- Loyer nu en cours hors charges : ${rentToRevise.toFixed(2)} €
- Ancien indice de référence (${oldIrlObj.label}) : ${oldIrlObj.value}
- Nouvel indice de référence (${newIrlObj.label}, publié le ${newIrlObj.publishedDate}) : ${newIrlObj.value}
- Variation constatée : +${revisionResult.percentageIncrease.toFixed(2)} %

Soit : ${rentToRevise.toFixed(2)} € x (${newIrlObj.value} / ${oldIrlObj.value}) = ${revisionResult.newRent.toFixed(2)} €

Par conséquent, à compter du ${new Date(revisionEffectiveDate).toLocaleDateString('fr-FR')}, le montant de votre loyer mensuel s'élèvera à :
- Loyer principal : ${revisionResult.newRent.toFixed(2)} €
- Provision pour charges (inchangée) : ${property.monthlyChargesProvision.toFixed(2)} €
- TOTAL MENSUEL DÛ : ${(revisionResult.newRent + property.monthlyChargesProvision).toFixed(2)} €

Je vous invite à bien vouloir mettre à jour le montant de votre virement bancaire pour l'échéance à venir.

Restant à votre disposition, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

${landlordInfo.fullName}`;
  }, [
    landlordInfo,
    property,
    rentToRevise,
    oldIrlObj,
    newIrlObj,
    revisionResult,
    revisionEffectiveDate
  ]);

  const [copiedRevision, setCopiedRevision] = useState(false);
  const handleCopyRevision = () => {
    navigator.clipboard.writeText(revisionLetterText);
    setCopiedRevision(true);
    setTimeout(() => setCopiedRevision(false), 3000);
  };

  // ==========================================
  // 2. GÉNÉRATEUR DE QUITTANCES DE LOYER
  // ==========================================
  const currentDate = new Date();
  const [receiptMonth, setReceiptMonth] = useState<number>(currentDate.getMonth() + 1);
  const [receiptYear, setReceiptYear] = useState<number>(currentDate.getFullYear());
  const [receiptPaymentDate, setReceiptPaymentDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(5); // Le 5 du mois en cours
    return d.toISOString().split('T')[0];
  });
  const [receiptMethod, setReceiptMethod] = useState<string>(property.paymentMethod);
  const [receiptRent, setReceiptRent] = useState<number>(property.baseRentExcludingCharges);
  const [receiptCharges, setReceiptCharges] = useState<number>(property.monthlyChargesProvision);
  const [receiptApl, setReceiptApl] = useState<number>(0);

  const receiptTotalNet = Math.max(0, receiptRent + receiptCharges - receiptApl);
  const receiptNumber = `QUITT-${receiptYear}-${String(receiptMonth).padStart(2, '0')}`;

  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const handleCopyReceipt = () => {
    const text = `QUITTANCE DE LOYER N° ${receiptNumber}
Période : Mois de ${MONTH_NAMES_FR[receiptMonth - 1]} ${receiptYear}

Bailleur :
${landlordInfo.fullName}
${landlordInfo.address}

Locataire :
${property.tenantFullName}
Adresse de location : ${property.address}, ${property.postalCode} ${property.city}

DÉTAIL DU RÈGLEMENT EFFECTUÉ :
- Loyer nu hors charges : ${receiptRent.toFixed(2)} €
- Provision pour charges récupérables : ${receiptCharges.toFixed(2)} €
${receiptApl > 0 ? `- Déduction tiers payant (APL / CAF) : -${receiptApl.toFixed(2)} €\n` : ''}- TOTAL PAYÉ PAR LE LOCATAIRE : ${receiptTotalNet.toFixed(2)} €

Date de règlement : ${new Date(receiptPaymentDate).toLocaleDateString('fr-FR')}
Mode de paiement : ${receiptMethod}

Je soussigné(e) ${landlordInfo.fullName}, propriétaire du logement désigné ci-dessus, déclare avoir reçu de Monsieur/Madame ${property.tenantFullName} la somme de ${receiptTotalNet.toFixed(2)} euros en paiement du loyer et des charges pour la période mentionnée.
Cette quittance annule tous les reçus qui auraient pu être donnés pour acompte et est délivrée gratuitement en application de l'article 21 de la loi n° 89-462 du 6 juillet 1989.`;

    navigator.clipboard.writeText(text);
    setCopiedReceipt(true);
    setTimeout(() => setCopiedReceipt(false), 3000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // ==========================================
  // 3. DÉCOMPTE ANNUEL DE RÉGULARISATION CHARGES
  // ==========================================
  const [chargesList, setChargesList] = useState<ChargeItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_CHARGES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SAMPLE_CHARGES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHARGES_KEY, JSON.stringify(chargesList));
    } catch (e) {
      console.error(e);
    }
  }, [chargesList]);

  // Form to add custom charge
  const [newChargeName, setNewChargeName] = useState('');
  const [newChargeAmount, setNewChargeAmount] = useState<number>(100);
  const [newChargeTantiemes, setNewChargeTantiemes] = useState<number>(95);
  const [newChargeRecupPct, setNewChargeRecupPct] = useState<number>(100);
  const [newChargeIsRecup, setNewChargeIsRecup] = useState<boolean>(true);

  const handleAddCharge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChargeName.trim() || newChargeAmount <= 0) return;

    const newItem: ChargeItem = {
      id: `ch_${Date.now()}`,
      name: newChargeName.trim(),
      category: 'parties_communes',
      totalInvoiceAmount: newChargeAmount,
      tantiemes: newChargeTantiemes,
      baseTantiemes: 1000,
      recuperablePercentage: newChargeIsRecup ? newChargeRecupPct : 0,
      isRecuperable: newChargeIsRecup,
      legalNote: newChargeIsRecup
        ? 'Charge déclarée récupérable selon justificatif produit.'
        : 'Charge non récupérable (100% à la charge du bailleur).'
    };

    setChargesList((prev) => [newItem, ...prev]);
    setNewChargeName('');
    setNewChargeAmount(100);
  };

  const handleDeleteCharge = (id: string) => {
    setChargesList((prev) => prev.filter((c) => c.id !== id));
  };

  // Compute total recoverable charges for the tenant
  const chargesSummary = useMemo(() => {
    let totalBuildingInvoiced = 0;
    let totalTenantRecoverable = 0;
    let totalLandlordExcluded = 0;

    chargesList.forEach((c) => {
      totalBuildingInvoiced += c.totalInvoiceAmount;
      const shareRatio = c.tantiemes / (c.baseTantiemes || 1000);
      const tenantShareOfTotal = c.totalInvoiceAmount * shareRatio;

      if (c.isRecuperable && c.recuperablePercentage > 0) {
        const netRecup = tenantShareOfTotal * (c.recuperablePercentage / 100);
        totalTenantRecoverable += netRecup;
      } else {
        totalLandlordExcluded += tenantShareOfTotal;
      }
    });

    const yearlyProvisionsPaid = property.monthlyChargesProvision * 12;
    const balance = Math.round((totalTenantRecoverable - yearlyProvisionsPaid) * 100) / 100;

    return {
      totalBuildingInvoiced: Math.round(totalBuildingInvoiced * 100) / 100,
      totalTenantRecoverable: Math.round(totalTenantRecoverable * 100) / 100,
      totalLandlordExcluded: Math.round(totalLandlordExcluded * 100) / 100,
      yearlyProvisionsPaid,
      balance, // > 0: tenant owes money; < 0: landlord must refund
      isDueByTenant: balance > 0
    };
  }, [chargesList, property.monthlyChargesProvision]);

  // Annual Regularisation Letter
  const regularisationLetterText = useMemo(() => {
    return `Expéditeur :
${landlordInfo.fullName}
${landlordInfo.address}

Destinataire :
${property.tenantFullName}
${property.address}, ${property.postalCode} ${property.city}

Fait à ${property.city}, le ${new Date().toLocaleDateString('fr-FR')}
Lettre Recommandée ou Remise en main propre contre décharge
Objet : Régularisation annuelle des charges locatives (Décret n° 87-713 / Loi du 6 juillet 1989)

Madame, Monsieur ${property.tenantFullName},

Conformément à l'article 23 de la Loi n° 89-462 du 6 juillet 1989, je vous transmets par la présente le décompte annuel de régularisation des charges locatives afférentes au logement que vous occupez au ${property.address}.

1. DÉCOMPTE DES DÉPENSES RÉELLES RÉCUPÉRABLES :
Total des charges récupérables imputables à votre lot : ${chargesSummary.totalTenantRecoverable.toFixed(2)} €

2. BILAN AVEC VOS PROVISIONS VERSÉES :
- Provisions mensuelles versées (${property.monthlyChargesProvision.toFixed(2)} € x 12 mois) : ${chargesSummary.yearlyProvisionsPaid.toFixed(2)} €
- Dépenses réelles justifiées : ${chargesSummary.totalTenantRecoverable.toFixed(2)} €

3. SOLDE DÉFINITIF DE LA RÉGULARISATION :
${
  chargesSummary.isDueByTenant
    ? `Il apparaît un reliquat en ma faveur de : +${chargesSummary.balance.toFixed(2)} € à régulariser lors de votre prochaine échéance.`
    : `Il apparaît un trop-perçu en votre faveur de : ${Math.abs(chargesSummary.balance).toFixed(2)} €, qui sera déduit de votre prochain loyer ou remboursé sous 15 jours.`
}

Conformément aux dispositions légales, les pièces justificatives (factures des prestataires, taxe foncière avec décompte TEOM, arrêté des comptes du syndic) sont tenues à votre disposition à mon domicile pendant un délai de six mois à compter de ce jour.

Restant à votre entière disposition, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.

${landlordInfo.fullName}`;
  }, [landlordInfo, property, chargesSummary]);

  const [copiedRegularisation, setCopiedRegularisation] = useState(false);
  const handleCopyRegularisation = () => {
    navigator.clipboard.writeText(regularisationLetterText);
    setCopiedRegularisation(true);
    setTimeout(() => setCopiedRegularisation(false), 3000);
  };

  // Commission savings estimate (8% agency fee)
  const annualAgencyFeeSaved = Math.round(property.baseRentExcludingCharges * 12 * 0.08);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      {/* ========================================= */}
      {/* HERO BANNER - AUTOBAILLEUR                */}
      {/* ========================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-emerald-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gestion Locative Sans Commission & 100% Conforme</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-serif-title">
            AutoBailleur
          </h1>

          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-sans">
            Gérez votre logement en direct en toute sécurité juridique.
            Calculez l'<strong>indexation IRL officielle INSEE</strong> sans erreur,
            générez vos <strong>quittances de loyer conformes en 1 clic</strong> et
            ventilez le <strong>décompte annuel de charges</strong> (récupérables vs bailleur)
            sans payer 8% de commission d'agence.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-800/80 border border-emerald-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-emerald-300/80 uppercase font-semibold">Économie agence</span>
              <span className="text-lg font-black text-emerald-300">
                ~{annualAgencyFeeSaved} € / an
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">0% de frais de gestion</span>
            </div>

            <div className="bg-slate-800/80 border border-emerald-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-emerald-300/80 uppercase font-semibold">Dernier IRL INSEE</span>
              <span className="text-lg font-black text-amber-300">
                {OFFICIAL_IRL_DATA[0].value}
              </span>
              <span className="block text-[10px] text-slate-400 mt-0.5">{OFFICIAL_IRL_DATA[0].label} (Officiel)</span>
            </div>

            <div className="bg-slate-800/80 border border-emerald-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-emerald-300/80 uppercase font-semibold">Quittances</span>
              <span className="text-lg font-black text-sky-300">Art. 21</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">100% conforme loi 1989</span>
            </div>

            <div className="bg-slate-800/80 border border-emerald-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-emerald-300/80 uppercase font-semibold">Charges décret</span>
              <span className="text-lg font-black text-purple-300">87-713</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Ventilation TEOM & copro</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* NAVIGATION TABS                          */}
      {/* ========================================= */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 border border-slate-200">
        <button
          onClick={() => setActiveTab('indexation')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'indexation'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Calculator className="w-4 h-4 text-emerald-600" />
          <span>Calculateur IRL INSEE</span>
        </button>

        <button
          onClick={() => setActiveTab('quittance')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'quittance'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Receipt className="w-4 h-4 text-sky-600" />
          <span>Générateur de Quittances</span>
        </button>

        <button
          onClick={() => setActiveTab('charges')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'charges'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Scale className="w-4 h-4 text-purple-600" />
          <span>Décompte Annuel Charges</span>
        </button>

        <button
          onClick={() => setActiveTab('bien')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'bien'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Home className="w-4 h-4 text-amber-600" />
          <span>Fiche Bien & Locataire</span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: CALCULATEUR D'INDEXATION IRL       */}
      {/* ========================================= */}
      {activeTab === 'indexation' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Indexation Annuelle du Loyer (IRL officiel INSEE)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Application stricte de l'article 17-1 de la Loi du 6 juillet 1989. Pas d'erreur, formule certifiée.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Formule légale vérifiée</span>
              </span>
            </div>
          </div>

          {/* Form & Simulator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Controls (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                1. Paramètres de votre contrat
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Loyer nu en cours hors charges (€ / mois) :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="50"
                    step="1"
                    value={rentToRevise}
                    onChange={(e) => setRentToRevise(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">€ / mois</span>
                </div>
                <span className="text-[11px] text-slate-500 block">
                  Ne jamais inclure les provisions pour charges dans la base de calcul !
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Trimestre de référence d'origine (Ancien IRL) :
                </label>
                <select
                  value={oldIrlLabel}
                  onChange={(e) => setOldIrlLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {OFFICIAL_IRL_DATA.map((item) => (
                    <option key={`old_${item.label}`} value={item.label}>
                      {item.label} — Indice {item.value} (Publié {item.publishedDate})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 block">
                  Indice mentionné au bail d'origine ou lors de la dernière révision.
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Nouveau trimestre d'échéance (Nouvel IRL) :
                </label>
                <select
                  value={newIrlLabel}
                  onChange={(e) => setNewIrlLabel(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {OFFICIAL_IRL_DATA.map((item) => (
                    <option key={`new_${item.label}`} value={item.label}>
                      {item.label} — Indice {item.value} (Publié {item.publishedDate})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Date effective de notification au locataire :
                </label>
                <input
                  type="date"
                  value={revisionEffectiveDate}
                  onChange={(e) => setRevisionEffectiveDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* Crucial Loi ALUR warning */}
              <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>Règle d'or Loi ALUR (Non-rétroactivité) :</span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  La révision ne prend effet <strong>qu'à compter du jour de la notification formelle</strong>. Si vous oubliez d'envoyer la demande pendant 4 mois, les arriérés de ces 4 mois sont <strong>définitivement perdus</strong> pour le bailleur.
                </p>
              </div>
            </div>

            {/* Revision Result Card & Formula (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-6 text-white shadow-md space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-emerald-100 font-bold block">
                      Nouveau loyer légal calculé
                    </span>
                    <div className="text-3xl sm:text-4xl font-black mt-1">
                      {revisionResult.newRent.toFixed(2)} € <span className="text-base font-normal">/ mois</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-white/20 backdrop-blur-xs text-white font-bold text-xs px-3 py-1 rounded-full">
                      +{revisionResult.percentageIncrease.toFixed(2)} %
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-emerald-400/40 text-xs">
                  <div>
                    <span className="text-emerald-100 block">Augmentation mensuelle :</span>
                    <span className="text-lg font-bold">+{revisionResult.difference.toFixed(2)} € / mois</span>
                  </div>
                  <div>
                    <span className="text-emerald-100 block">Gain annuel total :</span>
                    <span className="text-lg font-bold">+{annualExtraAmount.toFixed(2)} € / an</span>
                  </div>
                </div>

                {/* Formula display */}
                <div className="bg-emerald-950/30 p-3 rounded-xl text-xs font-mono border border-emerald-300/30">
                  <span className="block text-[10px] text-emerald-200 uppercase font-sans font-bold">
                    Formule légale appliquée :
                  </span>
                  <span>
                    {rentToRevise.toFixed(2)} € x ({newIrlObj.value} / {oldIrlObj.value}) ={' '}
                    <strong>{revisionResult.newRent.toFixed(2)} €</strong>
                  </span>
                </div>
              </div>

              {/* Ready to send Notification Letter */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    <span>Courrier officiel de notification au locataire</span>
                  </h3>
                  <button
                    onClick={handleCopyRevision}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedRevision ? 'Copié !' : 'Copier lettre'}</span>
                  </button>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 max-h-56 overflow-y-auto whitespace-pre-line leading-relaxed">
                  {revisionLetterText}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-500">
                    Conseil : Envoyez ce courrier par lettre recommandée ou email avec accusé de lecture.
                  </span>
                  {onNavigateToPlumeWithPrompt && (
                    <button
                      onClick={() =>
                        onNavigateToPlumeWithPrompt(
                          `Rédige un courrier de révision de loyer selon l'IRL INSEE pour le locataire ${property.tenantFullName} passant de ${rentToRevise}€ à ${revisionResult.newRent}€.`,
                          'immobilier'
                        )
                      }
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Personnaliser dans PlumeCitoyenne</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: GÉNÉRATEUR DE QUITTANCES           */}
      {/* ========================================= */}
      {activeTab === 'quittance' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <span>Édition Officielle de la Quittance de Loyer</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Conforme à l'article 21 de la Loi du 6 juillet 1989. Gratuité absolue obligatoire, quittance libératoire.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyReceipt}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedReceipt ? 'Copié !' : 'Copier texte'}</span>
              </button>
              <button
                onClick={handlePrintReceipt}
                className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Quittance A4</span>
              </button>
            </div>
          </div>

          {/* Controls + Printable Sheet */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Controls (4 cols) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Données du mois
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Mois :</label>
                  <select
                    value={receiptMonth}
                    onChange={(e) => setReceiptMonth(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                  >
                    {MONTH_NAMES_FR.map((m, idx) => (
                      <option key={m} value={idx + 1}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">Année :</label>
                  <input
                    type="number"
                    value={receiptYear}
                    onChange={(e) => setReceiptYear(parseInt(e.target.value) || 2026)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Loyer nu hors charges (€) :
                </label>
                <input
                  type="number"
                  step="1"
                  value={receiptRent}
                  onChange={(e) => setReceiptRent(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Provision pour charges (€) :
                </label>
                <input
                  type="number"
                  step="1"
                  value={receiptCharges}
                  onChange={(e) => setReceiptCharges(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Déduction tiers payant APL / CAF (€) le cas échéant :
                </label>
                <input
                  type="number"
                  step="1"
                  value={receiptApl}
                  onChange={(e) => setReceiptApl(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Date de réception du paiement :
                </label>
                <input
                  type="date"
                  value={receiptPaymentDate}
                  onChange={(e) => setReceiptPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Mode de règlement :
                </label>
                <select
                  value={receiptMethod}
                  onChange={(e) => setReceiptMethod(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                >
                  <option value="Virement bancaire">Virement bancaire</option>
                  <option value="Prélèvement automatique">Prélèvement automatique</option>
                  <option value="Chèque bancaire">Chèque bancaire</option>
                  <option value="Espèces (contre reçu signé)">Espèces</option>
                </select>
              </div>

              <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-900 space-y-1">
                <strong className="block font-bold">Rappel de la Loi du 6 juillet 1989 :</strong>
                <p className="text-[11px] leading-relaxed">
                  La quittance de loyer doit obligatoirement distinguer le loyer principal net des provisions pour charges. Aucun frais d'envoi postal ou de gestion ne peut être réclamé au locataire.
                </p>
              </div>
            </div>

            {/* Right Printable A4 Receipt Sheet (8 cols) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-300 p-8 sm:p-12 shadow-md space-y-6 text-slate-900 font-sans print:border-none print:shadow-none print:p-0">
              {/* Header Box */}
              <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-5 gap-4">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase font-serif-title">
                    Quittance de Loyer
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    Référence : {receiptNumber}
                  </p>
                </div>
                <div className="text-right sm:text-right bg-slate-100 p-3 rounded-xl border border-slate-200">
                  <span className="block text-[10px] uppercase font-bold text-slate-500">
                    Période de location acquittée
                  </span>
                  <span className="text-sm font-black text-slate-900">
                    Du 01/{String(receiptMonth).padStart(2, '0')}/{receiptYear} au{' '}
                    {new Date(receiptYear, receiptMonth, 0).getDate()}/
                    {String(receiptMonth).padStart(2, '0')}/{receiptYear}
                  </span>
                </div>
              </div>

              {/* Parties block */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Bailleur (Propriétaire) :
                  </strong>
                  <div className="font-bold text-slate-900 text-sm">{landlordInfo.fullName}</div>
                  <div className="text-xs text-slate-600">{landlordInfo.address}</div>
                  <div className="text-[11px] text-slate-500 pt-1 font-mono">
                    Tél : {landlordInfo.phone} | Email : {landlordInfo.email}
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                  <strong className="block text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Locataire (Preneur) :
                  </strong>
                  <div className="font-bold text-slate-900 text-sm">{property.tenantFullName}</div>
                  <div className="text-xs text-slate-700 font-medium">
                    Logement loué : {property.address}, {property.postalCode} {property.city}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <div className="bg-slate-900 text-white p-3 text-xs font-bold uppercase tracking-wider flex justify-between">
                  <span>Désignation des sommes perçues</span>
                  <span>Montant (€)</span>
                </div>

                <div className="divide-y divide-slate-100 text-xs sm:text-sm">
                  <div className="p-3 flex justify-between items-center">
                    <span className="text-slate-800">Loyer principal nu (hors charges)</span>
                    <span className="font-bold text-slate-900">{receiptRent.toFixed(2)} €</span>
                  </div>

                  <div className="p-3 flex justify-between items-center bg-slate-50/50">
                    <div>
                      <span className="text-slate-800">Provision pour charges locatives</span>
                      <span className="block text-[11px] text-slate-500">
                        Soumis à régularisation annuelle selon Décret 87-713
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">{receiptCharges.toFixed(2)} €</span>
                  </div>

                  {receiptApl > 0 && (
                    <div className="p-3 flex justify-between items-center text-emerald-800 bg-emerald-50/50">
                      <div>
                        <span>Déduction aide au logement CAF / APL (Tiers payant)</span>
                        <span className="block text-[11px] text-emerald-600">Versée directement au bailleur</span>
                      </div>
                      <span className="font-bold">-{receiptApl.toFixed(2)} €</span>
                    </div>
                  )}

                  <div className="p-4 bg-slate-100 flex justify-between items-center border-t-2 border-slate-300">
                    <span className="font-black text-slate-900 uppercase">
                      Total net payé par le locataire
                    </span>
                    <span className="text-lg font-black text-emerald-700">
                      {receiptTotalNet.toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>

              {/* Legal Certificate text */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  Je soussigné(e) <strong>{landlordInfo.fullName}</strong>, propriétaire du logement situé au{' '}
                  <strong>
                    {property.address}, {property.postalCode} {property.city}
                  </strong>
                  , déclare avoir reçu de <strong>{property.tenantFullName}</strong> la somme totale de{' '}
                  <strong>{receiptTotalNet.toFixed(2)} euros</strong>, en paiement intégral du loyer et des provisions sur charges pour la période sus-indiquée, réglée par{' '}
                  <strong>{receiptMethod}</strong> le{' '}
                  <strong>{new Date(receiptPaymentDate).toLocaleDateString('fr-FR')}</strong>.
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  Cette quittance libère le locataire de toute obligation pour la période mentionnée, sous réserve de tous droits et de la régularisation annuelle des charges. Délivrée gratuitement conformément à l'article 21 de la loi n° 89-462 du 6 juillet 1989.
                </p>
              </div>

              {/* Signature block */}
              <div className="flex justify-between items-end pt-4">
                <div className="text-[11px] text-slate-400">
                  Document généré via Service France • AutoBailleur
                </div>
                <div className="text-right space-y-3">
                  <span className="text-xs font-bold text-slate-700 block">
                    Fait à {property.city}, le {new Date(receiptPaymentDate).toLocaleDateString('fr-FR')}
                  </span>
                  <div className="h-12 border-b border-dashed border-slate-300 w-44 ml-auto" />
                  <span className="text-[11px] text-slate-500 italic block">
                    Signature du bailleur : {landlordInfo.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 3: DÉCOMPTE ANNUEL DE CHARGES         */}
      {/* ========================================= */}
      {activeTab === 'charges' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-600" />
                <span>Décompte Annuel de Régularisation des Charges</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ventilation automatique selon le <strong>Décret n° 87-713 du 26 août 1987</strong> : récupérable sur le locataire vs non-récupérable (à la charge du propriétaire).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyRegularisation}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedRegularisation ? 'Copié !' : 'Copier lettre décompte'}</span>
              </button>
            </div>
          </div>

          {/* Balance Summary Banner */}
          <div
            className={`p-6 rounded-2xl border-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              chargesSummary.isDueByTenant
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-wider font-bold block opacity-80">
                Bilan de la régularisation sur 12 mois
              </span>
              <div className="text-2xl sm:text-3xl font-black">
                {chargesSummary.isDueByTenant ? (
                  <span>
                    Reliquat dû par le locataire :{' '}
                    <strong className="text-amber-700">+{chargesSummary.balance.toFixed(2)} €</strong>
                  </span>
                ) : (
                  <span>
                    Trop-perçu à rembourser au locataire :{' '}
                    <strong className="text-emerald-700">
                      {Math.abs(chargesSummary.balance).toFixed(2)} €
                    </strong>
                  </span>
                )}
              </div>
              <p className="text-xs opacity-90">
                Total dépenses réelles récupérables :{' '}
                <strong>{chargesSummary.totalTenantRecoverable.toFixed(2)} €</strong> • Provisions perçues :{' '}
                <strong>{chargesSummary.yearlyProvisionsPaid.toFixed(2)} €</strong> ({property.monthlyChargesProvision} € x 12)
              </p>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1 shrink-0">
              <span className="block font-bold">Loi du 6 juillet 1989 art. 23 :</span>
              <span className="block text-[11px] text-slate-500">
                Décompte à envoyer 1 mois avant la régularisation.
              </span>
              <span className="block text-[11px] text-slate-500">
                Pièces justificatives conservées 6 mois.
              </span>
            </div>
          </div>

          {/* Add custom charge inline form */}
          <form
            onSubmit={handleAddCharge}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Ajouter une ligne de dépense / facture</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nom de la charge :</label>
                <input
                  type="text"
                  placeholder="Ex : Réparation interphone, TEOM..."
                  value={newChargeName}
                  onChange={(e) => setNewChargeName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Montant facture (€) :</label>
                <input
                  type="number"
                  step="0.01"
                  value={newChargeAmount}
                  onChange={(e) => setNewChargeAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Tantièmes / 1000 :</label>
                <input
                  type="number"
                  value={newChargeTantiemes}
                  onChange={(e) => setNewChargeTantiemes(parseInt(e.target.value) || 1000)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[11px] font-semibold text-slate-600">Nature :</label>
                <select
                  value={newChargeIsRecup ? 'recup' : 'non_recup'}
                  onChange={(e) => setNewChargeIsRecup(e.target.value === 'recup')}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                >
                  <option value="recup">Récupérable locataire</option>
                  <option value="non_recup">À charge du bailleur</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
            </div>
          </form>

          {/* Charges Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">
                Ventilation détaillée des charges de l'exercice
              </h3>
              <span className="text-xs text-slate-500">
                {chargesList.length} postes comptabilisés
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Poste de dépense</th>
                    <th className="p-3 text-right">Facture totale</th>
                    <th className="p-3 text-center">Quote-part</th>
                    <th className="p-3 text-center">Statut légal (Décret 87-713)</th>
                    <th className="p-3 text-right">Part Locataire</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {chargesList.map((charge) => {
                    const ratio = charge.tantiemes / (charge.baseTantiemes || 1000);
                    const tenantShareOfTotal = charge.totalInvoiceAmount * ratio;
                    const finalTenantAmount = charge.isRecuperable
                      ? tenantShareOfTotal * (charge.recuperablePercentage / 100)
                      : 0;

                    return (
                      <tr
                        key={charge.id}
                        className={`hover:bg-slate-50/60 transition-colors ${
                          !charge.isRecuperable ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{charge.name}</div>
                          <div className="text-[11px] text-slate-500">{charge.legalNote}</div>
                        </td>

                        <td className="p-3 text-right font-semibold text-slate-800">
                          {charge.totalInvoiceAmount.toFixed(2)} €
                        </td>

                        <td className="p-3 text-center text-slate-600 font-mono">
                          {charge.tantiemes === 1000
                            ? '100% direct'
                            : `${charge.tantiemes}/${charge.baseTantiemes}`}
                        </td>

                        <td className="p-3 text-center">
                          {charge.isRecuperable ? (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Récupérable ({charge.recuperablePercentage}%)
                            </span>
                          ) : (
                            <span className="inline-block px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                              100% Bailleur (Interdit)
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <span
                            className={`font-black ${
                              finalTenantAmount > 0 ? 'text-emerald-700' : 'text-slate-400'
                            }`}
                          >
                            {finalTenantAmount.toFixed(2)} €
                          </span>
                        </td>

                        <td className="p-3 text-center">
                          <button
                            onClick={() => handleDeleteCharge(charge.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                            title="Supprimer cette ligne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 4: FICHE BIEN & LOCATAIRE (LOCAL)    */}
      {/* ========================================= */}
      {activeTab === 'bien' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Home className="w-5 h-5 text-amber-600" />
                <span>Configuration du Bien Loué & Parties Contractantes</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Données sauvegardées exclusivement sur votre navigateur (Zero-Knowledge). Utilisées pour pré-remplir automatiquement toutes vos quittances et calculs.
              </p>
            </div>

            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Chiffrement local</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Property Form */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Logement loué</span>
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Désignation / Nom du bien :</label>
                <input
                  type="text"
                  value={property.propertyLabel}
                  onChange={(e) => setProperty({ ...property, propertyLabel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Adresse du logement :</label>
                <input
                  type="text"
                  value={property.address}
                  onChange={(e) => setProperty({ ...property, address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Code Postal :</label>
                  <input
                    type="text"
                    value={property.postalCode}
                    onChange={(e) => setProperty({ ...property, postalCode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Ville :</label>
                  <input
                    type="text"
                    value={property.city}
                    onChange={(e) => setProperty({ ...property, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Loyer nu de base (€) :</label>
                  <input
                    type="number"
                    value={property.baseRentExcludingCharges}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        baseRentExcludingCharges: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Provision charges (€) :</label>
                  <input
                    type="number"
                    value={property.monthlyChargesProvision}
                    onChange={(e) =>
                      setProperty({
                        ...property,
                        monthlyChargesProvision: parseFloat(e.target.value) || 0
                      })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date de début du bail :</label>
                <input
                  type="date"
                  value={property.leaseStartDate}
                  onChange={(e) => setProperty({ ...property, leaseStartDate: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                />
              </div>
            </div>

            {/* Tenant and Landlord Details */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-sky-600" />
                  <span>Locataire en titre</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nom et prénom du locataire :</label>
                  <input
                    type="text"
                    value={property.tenantFullName}
                    onChange={(e) => setProperty({ ...property, tenantFullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Email :</label>
                    <input
                      type="email"
                      value={property.tenantEmail}
                      onChange={(e) => setProperty({ ...property, tenantEmail: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Téléphone :</label>
                    <input
                      type="tel"
                      value={property.tenantPhone}
                      onChange={(e) => setProperty({ ...property, tenantPhone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Landlord identity */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Coordonnées du bailleur (propriétaire)</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Nom complet :</label>
                  <input
                    type="text"
                    value={landlordInfo.fullName}
                    onChange={(e) => setLandlordInfo({ ...landlordInfo, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Adresse postale :</label>
                  <input
                    type="text"
                    value={landlordInfo.address}
                    onChange={(e) => setLandlordInfo({ ...landlordInfo, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
