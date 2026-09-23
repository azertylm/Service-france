import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  FileX,
  Search,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ShieldCheck,
  FileText,
  Printer,
  Copy,
  ExternalLink,
  Trash2,
  Dumbbell,
  Wifi,
  Shield,
  Home,
  Zap,
  Tv,
  ArrowRight,
  Info,
  RefreshCw,
  Sparkles,
  UserCheck,
  KeyRound,
  Download
} from 'lucide-react';
import {
  ResilProvider,
  ResilCategory,
  LegalGround,
  GeneratedLRAR,
  SavedCancellation
} from '../../types/resiliation';
import { RESILIATION_PROVIDERS } from '../../data/resiliationCatalog';
import { generateCancellationLetter } from '../../utils/lrarGenerator';

interface ResilExpressHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category?: any) => void;
}

const STORAGE_SAVED_CANCELLATIONS = 'resilexpress_saved_cancellations_v1';
const STORAGE_ADMIN_PROFILE = 'claircontrat_admin_profile_v1';

export const ResilExpressHub: React.FC<ResilExpressHubProps> = ({
  onNavigateToPlumeWithPrompt,
}) => {
  // Selected category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected provider or custom provider
  const [selectedProvider, setSelectedProvider] = useState<ResilProvider | null>(
    RESILIATION_PROVIDERS[0]
  );
  const [customProviderName, setCustomProviderName] = useState('');
  const [customRecipientAddress, setCustomRecipientAddress] = useState({
    recipientName: '',
    street: '',
    postalCode: '',
    city: '',
    cedex: '',
  });

  // Legal Ground
  const [chosenGround, setChosenGround] = useState<LegalGround>('loi_hamon');
  const [customReasonDetail, setCustomReasonDetail] = useState('');

  // Contract Details
  const [clientNumber, setClientNumber] = useState('');
  const [contractNumber, setContractNumber] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState<number>(29.99);

  // Sender Details (Defaults from administrative profile if available)
  const [senderFullName, setSenderFullName] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [senderPostalCode, setSenderPostalCode] = useState('');
  const [senderCity, setSenderCity] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [senderEmail, setSenderEmail] = useState('');

  // OCR Photo Scan State
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generated Letter State
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Saved Cancellations (Tracker of savings)
  const [savedCancellations, setSavedCancellations] = useState<SavedCancellation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_CANCELLATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Load administrative profile from keychain if saved
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ADMIN_PROFILE);
      if (raw) {
        const profile = JSON.parse(raw);
        if (profile.fullName) setSenderFullName(profile.fullName);
        if (profile.address) setSenderAddress(profile.address);
        if (profile.postalCode) setSenderPostalCode(profile.postalCode);
        if (profile.city) setSenderCity(profile.city);
        if (profile.phone) setSenderPhone(profile.phone);
        if (profile.email) setSenderEmail(profile.email);
      }
    } catch (e) {
      console.warn('Could not read admin profile', e);
    }
  }, []);

  // Update default ground when provider changes
  useEffect(() => {
    if (selectedProvider) {
      setChosenGround(selectedProvider.defaultGround);
      setMonthlyAmount(selectedProvider.typicalMonthlyCost);
    }
  }, [selectedProvider]);

  // Save cancellations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_SAVED_CANCELLATIONS,
        JSON.stringify(savedCancellations)
      );
    } catch (e) {
      console.warn('Could not persist cancellations', e);
    }
  }, [savedCancellations]);

  // Compute total savings
  const totalSavings = useMemo(() => {
    const monthly = savedCancellations.reduce((acc, c) => acc + (c.monthlyAmount || 0), 0);
    const annual = monthly * 12;
    return {
      monthly: Math.round(monthly * 100) / 100,
      annual: Math.round(annual * 100) / 100,
      count: savedCancellations.length,
    };
  }, [savedCancellations]);

  // Filter providers in catalog
  const filteredProviders = useMemo(() => {
    return RESILIATION_PROVIDERS.filter((p) => {
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.serviceAddress.recipientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  // Generate live letter
  const currentLetter: GeneratedLRAR = useMemo(() => {
    const effectiveProvider = selectedProvider
      ? selectedProvider
      : {
          name: customProviderName || 'Organisme de service',
          serviceAddress: {
            recipientName: customRecipientAddress.recipientName || 'Service Résiliation Abonnés',
            street: customRecipientAddress.street || 'Adresse du siège social',
            postalCode: customRecipientAddress.postalCode || '75000',
            city: customRecipientAddress.city || 'Paris',
            cedex: customRecipientAddress.cedex,
          },
        };

    return generateCancellationLetter({
      provider: effectiveProvider,
      senderInfo: {
        fullName: senderFullName || '[Prénom NOM]',
        address: senderAddress || '[Votre adresse]',
        postalCode: senderPostalCode || '[Code postal]',
        city: senderCity || '[Ville]',
        phone: senderPhone,
        email: senderEmail,
        clientNumber,
        contractNumber,
      },
      legalGround: chosenGround,
      customReasonDetail,
      monthlySavings: Number(monthlyAmount) || 0,
    });
  }, [
    selectedProvider,
    customProviderName,
    customRecipientAddress,
    senderFullName,
    senderAddress,
    senderPostalCode,
    senderCity,
    senderPhone,
    senderEmail,
    clientNumber,
    contractNumber,
    chosenGround,
    customReasonDetail,
    monthlyAmount,
  ]);

  // Handle OCR scan of contract / invoice
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
      });
      reader.readAsDataURL(file);
      const dataUrl = await base64Promise;

      const res = await fetch('/api/resil-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: dataUrl,
          mimeType: file.type || 'image/jpeg',
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.error || "Impossible d'extraire les données du document.");
      }

      const d = json.data;

      // Check if matches an existing provider in catalog
      const matched = RESILIATION_PROVIDERS.find(
        (p) =>
          p.name.toLowerCase().includes(d.providerName.toLowerCase()) ||
          d.providerName.toLowerCase().includes(p.name.toLowerCase())
      );

      if (matched) {
        setSelectedProvider(matched);
      } else {
        setSelectedProvider(null);
        setCustomProviderName(d.providerName);
        setCustomRecipientAddress({
          recipientName: d.serviceAddress?.recipientName || `${d.providerName} - Service Résiliation`,
          street: d.serviceAddress?.street || '',
          postalCode: d.serviceAddress?.postalCode || '',
          city: d.serviceAddress?.city || '',
          cedex: d.serviceAddress?.cedex || '',
        });
      }

      if (d.clientNumber) setClientNumber(d.clientNumber);
      if (d.contractNumber) setContractNumber(d.contractNumber);
      if (d.monthlyAmount) setMonthlyAmount(Number(d.monthlyAmount));
      if (d.recommendedGround) setChosenGround(d.recommendedGround as LegalGround);
    } catch (err: any) {
      console.error(err);
      setScanError(err?.message || "Erreur lors de l'analyse du document.");
    } finally {
      setIsScanning(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLetter.body);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([currentLetter.body], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `LRAR_Resiliation_${(selectedProvider?.name || customProviderName || 'Contrat').replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Add to active cancellations tracker
  const handleAddToTracker = () => {
    const providerName = selectedProvider ? selectedProvider.name : customProviderName || 'Autre contrat';
    const newEntry: SavedCancellation = {
      id: 'resil-' + Date.now(),
      providerName,
      category: selectedProvider ? selectedProvider.category : 'autre',
      monthlyAmount: Number(monthlyAmount) || 0,
      cancellationDate: new Date().toLocaleDateString('fr-FR'),
      legalGround: chosenGround,
      status: 'lettre_generee',
    };

    setSavedCancellations((prev) => [newEntry, ...prev]);
  };

  const handleRemoveFromTracker = (id: string) => {
    setSavedCancellations((prev) => prev.filter((c) => c.id !== id));
  };

  const getCategoryIcon = (category: ResilCategory) => {
    switch (category) {
      case 'sport_loisirs':
        return <Dumbbell className="w-4 h-4 text-emerald-600" />;
      case 'telecom_internet':
        return <Wifi className="w-4 h-4 text-blue-600" />;
      case 'assurance':
        return <Shield className="w-4 h-4 text-indigo-600" />;
      case 'telesurveillance_habitat':
        return <Home className="w-4 h-4 text-amber-600" />;
      case 'energie':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      case 'presse_streaming':
        return <Tv className="w-4 h-4 text-purple-600" />;
      default:
        return <FileText className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-semibold">
            <FileX className="w-3.5 h-3.5" />
            <span>Résil-Express · Le gestionnaire de désengagement citoyen</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-serif-title">
            Reprenez le contrôle : résiliez vos abonnements en toute légalité.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Salles de sport, box internet, assurances doublons, contrats de télésurveillance… Les entreprises multiplient les démarches complexes et les préavis stricts. <strong>Résil-Express</strong> applique la loi française adaptée (loi Hamon après 1 an, loi Chatel, résiliation 3 clics) et génère immédiatement votre lettre recommandée (LRAR) avec l'adresse certifiée du service résiliation.
          </p>
        </div>
      </div>

      {/* 2. Tableau de bord des Économies Réalisées pour le Foyer */}
      <div className="bg-white rounded-3xl border-2 border-emerald-300 p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 font-serif-title">
              Économies Réalisées pour le Foyer
            </h3>
            <p className="text-xs text-slate-500">
              {totalSavings.count > 0
                ? `${totalSavings.count} contrat(s) en cours de désengagement`
                : "Ajoutez vos contrats résiliés pour mesurer le gain direct de pouvoir d'achat."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-emerald-50 px-5 py-3 rounded-2xl border border-emerald-200 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Gain Mensuel
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-700">
              +{totalSavings.monthly.toFixed(2)} € <span className="text-xs font-normal">/mois</span>
            </span>
          </div>
          <div className="h-8 w-px bg-emerald-300" />
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
              Gain Annuel
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-900">
              +{totalSavings.annual.toFixed(2)} € <span className="text-xs font-normal">/an</span>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Section Saisie & Annuaire ou Photo du Contrat */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-black text-slate-900 font-serif-title flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-600" />
              <span>1. Sélectionnez l'organisme ou scannez votre contrat</span>
            </h2>
            <p className="text-xs text-slate-500">
              Choisissez parmi les 40+ grandes enseignes ou photographiez une facture pour extraction automatique.
            </p>
          </div>

          {/* Quick Photo Upload Button */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyse OCR en cours...</span>
                </>
              ) : (
                <>
                  <Camera className="w-4 h-4" />
                  <span>Scanner un contrat / facture</span>
                </>
              )}
            </button>
          </div>
        </div>

        {scanError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{scanError}</span>
            </div>
            <button
              onClick={() => setScanError(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Tous les organismes' },
            { id: 'sport_loisirs', label: '🏋️ Salles de sport' },
            { id: 'telecom_internet', label: '📶 Box & Forfaits' },
            { id: 'assurance', label: '🛡️ Assurances' },
            { id: 'telesurveillance_habitat', label: '🚨 Télésurveillance' },
            { id: 'energie', label: '⚡ Énergie (Sans frais)' },
            { id: 'presse_streaming', label: '📺 Presse & Streaming' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search bar inside catalog */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par nom (ex: Basic-Fit, Free, MAIF, Verisure, Canal+, Orange...)"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
        </div>

        {/* Provider Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredProviders.map((provider) => {
            const isSelected = selectedProvider?.id === provider.id;
            return (
              <button
                key={provider.id}
                onClick={() => {
                  setSelectedProvider(provider);
                  setChosenGround(provider.defaultGround);
                  setMonthlyAmount(provider.typicalMonthlyCost);
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">{getCategoryIcon(provider.category)}</div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 truncate">{provider.name}</h4>
                  <p className="text-[11px] text-slate-500 truncate">
                    ~{provider.typicalMonthlyCost.toFixed(2)} €/mois · Préavis {provider.noticePeriodDays}j
                  </p>
                </div>
              </button>
            );
          })}

          {/* Custom provider button */}
          <button
            onClick={() => {
              setSelectedProvider(null);
              setCustomProviderName('');
            }}
            className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
              selectedProvider === null
                ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                : 'border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">Autre organisme non listé</h4>
              <p className="text-[11px] text-slate-500 truncate">Saisie manuelle personnalisée</p>
            </div>
          </button>
        </div>

        {/* Selected Provider Tip */}
        {selectedProvider?.tip && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <strong className="font-bold text-amber-900 uppercase tracking-wider text-[11px]">
                Astuce légale pour {selectedProvider.name} :
              </strong>
              <p className="leading-relaxed">{selectedProvider.tip}</p>
              {selectedProvider.threeClicksUrl && (
                <div className="pt-1">
                  <a
                    href={selectedProvider.threeClicksUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-bold text-indigo-700 hover:underline"
                  >
                    <span>Accéder au bouton de résiliation en ligne (3 clics)</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 4. Configuration Juridique & Paramètres du Contrat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form Parameters */}
        <div className="lg:col-span-1 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          <h3 className="text-base font-black text-slate-900 font-serif-title flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>2. Fondement juridique</span>
          </h3>

          {/* Legal Ground Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Article de loi applicable :
            </label>
            <div className="space-y-1.5 text-xs">
              {[
                {
                  id: 'loi_hamon',
                  title: '🛡️ Loi Hamon (Assurance > 1 an)',
                  desc: 'Résiliation à tout moment sans motif ni pénalité (Art. L. 113-15-2)',
                },
                {
                  id: 'loi_chatel',
                  title: '📜 Loi Chatel (Avis non reçu)',
                  desc: 'Absence d’avis d’échéance 15j avant = résiliation immédiate (Art. L. 215-1)',
                },
                {
                  id: 'resiliation_3_clics',
                  title: '⚡ Résiliation 3 Clics (Loi 2022)',
                  desc: 'Désengagement simplifié dématérialisé (Art. L. 215-1-1)',
                },
                {
                  id: 'hausse_tarifaire',
                  title: '📈 Hausse tarifaire unilatérale',
                  desc: 'Refus de hausse de tarif dans les 4 mois (Art. L. 224-33)',
                },
                {
                  id: 'motif_legitime',
                  title: '🏥 Motif légitime & inaptitude',
                  desc: 'Déménagement, arrêt maladie, perte d’emploi, force majeure',
                },
                {
                  id: 'retractation_14j',
                  title: '⏱️ Droit de rétractation 14 jours',
                  desc: 'Vente à distance ou démarchage (Art. L. 221-18)',
                },
                {
                  id: 'echeance_terme',
                  title: '📅 Résiliation à échéance normale',
                  desc: 'Non-reconduction au terme contractuel',
                },
              ].map((ground) => (
                <label
                  key={ground.id}
                  className={`p-2.5 rounded-xl border block cursor-pointer transition-all ${
                    chosenGround === ground.id
                      ? 'bg-indigo-50/70 border-indigo-600 shadow-2xs ring-1 ring-indigo-500'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="legalGround"
                      checked={chosenGround === ground.id}
                      onChange={() => setChosenGround(ground.id as LegalGround)}
                      className="text-indigo-600 focus:ring-indigo-500"
                    />
                    <strong className="text-slate-900 font-bold leading-tight">
                      {ground.title}
                    </strong>
                  </div>
                  <p className="text-[11px] text-slate-500 pl-5 pt-0.5">{ground.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {chosenGround === 'motif_legitime' && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 block">
                Précision du motif légitime :
              </label>
              <input
                type="text"
                value={customReasonDetail}
                onChange={(e) => setCustomReasonDetail(e.target.value)}
                placeholder="Ex: Certificat médical d'inaptitude physique définitive joint"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          )}

          {/* Contract references */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Numéro client / abonné :</label>
              <input
                type="text"
                value={clientNumber}
                onChange={(e) => setClientNumber(e.target.value)}
                placeholder="Ex: CLI-984729"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Numéro de contrat / police :</label>
              <input
                type="text"
                value={contractNumber}
                onChange={(e) => setContractNumber(e.target.value)}
                placeholder="Ex: CTR-2024-8841"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Mensualité payée (€/mois) :</label>
              <input
                type="number"
                step="0.01"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(parseFloat(e.target.value) || 0)}
                placeholder="29.99"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <span className="text-[10px] text-slate-400">
                Sert à mesurer vos économies réelles dans le tableau de bord.
              </span>
            </div>
          </div>

          {/* Sender info prefilled */}
          <div className="space-y-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-700 block">Vos coordonnées (Expéditeur) :</label>
              <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                <UserCheck className="w-3 h-3" />
                Trousseau local
              </span>
            </div>

            <input
              type="text"
              value={senderFullName}
              onChange={(e) => setSenderFullName(e.target.value)}
              placeholder="Prénom et NOM"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <input
              type="text"
              value={senderAddress}
              onChange={(e) => setSenderAddress(e.target.value)}
              placeholder="Adresse (N°, rue, bâtiment)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={senderPostalCode}
                onChange={(e) => setSenderPostalCode(e.target.value)}
                placeholder="Code postal"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
              <input
                type="text"
                value={senderCity}
                onChange={(e) => setSenderCity(e.target.value)}
                placeholder="Ville"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          {/* Add to tracker button */}
          <button
            onClick={handleAddToTracker}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all"
          >
            <Coins className="w-4 h-4" />
            <span>Enregistrer dans mon Panier d'économies</span>
          </button>
        </div>

        {/* Right Column: Live LRAR Letter Viewer */}
        <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-slate-300 p-6 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Lettre Recommandée avec Accusé de Réception (LRAR)
                </span>
                <h3 className="text-base font-black text-slate-900 font-serif-title mt-1">
                  Courrier juridique officiel prêt à envoyer
                </h3>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedNotification ? 'Copié !' : 'Copier'}</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export TXT</span>
                </button>
              </div>
            </div>

            {/* Letter Paper Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 font-mono text-xs text-slate-800 whitespace-pre-wrap leading-relaxed shadow-inner max-h-[500px] overflow-y-auto selection:bg-indigo-100">
              {currentLetter.body}
            </div>
          </div>

          {/* Postal Send & PlumeCitoyenne Shortcuts */}
          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Direct Link to La Poste Online LRAR */}
            <a
              href="https://www.laposte.fr/lettre-recommandee-en-ligne"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <span>Envoyer en LRAR en ligne La Poste</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Bridge to PlumeCitoyenne */}
            <button
              onClick={() => {
                if (onNavigateToPlumeWithPrompt) {
                  onNavigateToPlumeWithPrompt(
                    `Rédige une lettre de résiliation officielle auprès de ${
                      selectedProvider?.name || customProviderName
                    } sous le visa de la ${chosenGround} avec mise en demeure d'arrêt des prélèvements SEPA et de confirmation écrite sous 10 jours.`
                  );
                }
              }}
              className="p-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Personnaliser dans PlumeCitoyenne</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Historique du Panier de Désengagement */}
      {savedCancellations.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-900 font-serif-title flex items-center gap-2">
              <Coins className="w-5 h-5 text-emerald-600" />
              <span>Mon Panier de Désengagement & Historique d'économies</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              Total épargné : +{totalSavings.annual.toFixed(2)} € / an
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {savedCancellations.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">{item.providerName}</span>
                    <span className="text-xs font-black text-emerald-600">
                      +{item.monthlyAmount.toFixed(2)} €/m
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Fondement : {item.legalGround.replace('_', ' ')} · Ajouté le {item.cancellationDate}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                    Lettre prête
                  </span>

                  <button
                    onClick={() => handleRemoveFromTracker(item.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Supprimer du panier"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
