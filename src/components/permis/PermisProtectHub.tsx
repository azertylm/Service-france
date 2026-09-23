import React, { useState, useMemo, useEffect } from 'react';
import {
  ShieldAlert,
  Car,
  AlertTriangle,
  Clock,
  FileText,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronRight,
  Copy,
  Printer,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
  Info,
  Calendar,
  CreditCard,
  UserCheck,
  FileCheck2,
  Compass,
  ArrowRight,
  Eye,
  Camera,
  RefreshCw
} from 'lucide-react';
import {
  InfractionDefinition,
  ContestationReason,
  PointEvent,
  PVAnalysisInput
} from '../../types/permisprotect';
import {
  COMMON_INFRACTIONS,
  calculatePVDates,
  estimatePointRestitutionDate
} from '../../data/infractionsData';

interface PermisProtectHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category?: any) => void;
}

const STORAGE_PV_INPUT = 'permisprotect_pv_input_v1';
const STORAGE_POINTS_EVENTS = 'permisprotect_points_events_v1';
const STORAGE_USER_POINTS = 'permisprotect_user_points_v1';
const STORAGE_ADMIN_PROFILE = 'claircontrat_admin_profile_v1';

export const PermisProtectHub: React.FC<PermisProtectHubProps> = ({
  onNavigateToPlumeWithPrompt
}) => {
  const [activeTab, setActiveTab] = useState<'analyse' | 'contester' | 'carnet'>('analyse');

  // User contact profile
  const [driverProfile, setDriverProfile] = useState({
    fullName: 'Alexandre MARTIN',
    address: '12 Avenue des Champs, 75008 Paris',
    licenseNumber: '15AA12345',
    licenseIssueDate: '2016-04-18',
    phone: '06 12 34 56 78',
    email: 'alexandre.martin@email.fr'
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ADMIN_PROFILE);
      if (raw) {
        const p = JSON.parse(raw);
        setDriverProfile((prev) => ({
          ...prev,
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

  // 1. PV ANALYSIS FORM STATE
  const [pvInput, setPvInput] = useState<PVAnalysisInput>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PV_INPUT);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    const today = new Date();
    const noticeD = new Date(today);
    noticeD.setDate(noticeD.getDate() - 8); // Avis reçu il y a 8 jours

    const infDate = new Date(today);
    infDate.setDate(infDate.getDate() - 14);

    return {
      noticeNumber: '3789421502',
      noticeDate: noticeD.toISOString().split('T')[0],
      infractionDate: infDate.toISOString().split('T')[0],
      infractionTime: '14:25',
      location: 'RD 906 - PK/PR 12.400 (Direction Sud)',
      vehiclePlate: 'AB-123-CD',
      selectedInfractionId: 'vit_inf_20_sup_50',
      isRadarAutomatique: true,
      paymentMethod: 'internet'
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PV_INPUT, JSON.stringify(pvInput));
    } catch (e) {
      console.error(e);
    }
  }, [pvInput]);

  const selectedInfraction = useMemo(() => {
    return (
      COMMON_INFRACTIONS.find((i) => i.id === pvInput.selectedInfractionId) ||
      COMMON_INFRACTIONS[0]
    );
  }, [pvInput.selectedInfractionId]);

  // Compute key deadlines
  const datesCalc = useMemo(() => {
    return calculatePVDates(
      pvInput.noticeDate,
      pvInput.isRadarAutomatique,
      pvInput.paymentMethod === 'internet'
    );
  }, [pvInput.noticeDate, pvInput.isRadarAutomatique, pvInput.paymentMethod]);

  // 2. CONTESTATION WIZARD STATE
  const [contestReason, setContestReason] = useState<ContestationReason>('cas_3_photo_non_probante');
  const [thirdPartyDriver, setThirdPartyDriver] = useState({
    fullName: '',
    address: '',
    birthDate: '',
    birthPlace: '',
    licenseNumber: '',
    licenseDate: ''
  });
  const [contestDetails, setContestDetails] = useState('');

  // 3. CARNET DE POINTS STATE
  const [currentPointsTotal, setCurrentPointsTotal] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_POINTS);
      if (saved) return parseInt(saved);
    } catch (e) {
      console.error(e);
    }
    return 11;
  });

  const [isProbatoire, setIsProbatoire] = useState(false);
  const maxPointsPossible = isProbatoire ? 6 : 12;

  const [pointsHistory, setPointsHistory] = useState<PointEvent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_POINTS_EVENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'pt_1',
        date: '2024-03-10',
        infractionTitle: 'Excès de vitesse < 20 km/h (zone limitée à 80 km/h)',
        pointsDeducted: 1,
        fineClass: 3,
        restituted: true,
        expectedRestitutionDate: '2024-09-10',
        restitutionRule: '6 mois sans nouvelle infraction (Règle 1 point - Art. L223-6)',
        notes: 'Point récupéré automatiquement le 10/09/2024'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USER_POINTS, currentPointsTotal.toString());
      localStorage.setItem(STORAGE_POINTS_EVENTS, JSON.stringify(pointsHistory));
    } catch (e) {
      console.error(e);
    }
  }, [currentPointsTotal, pointsHistory]);

  // Generate Official Contestation Letter
  const contestationLetterText = useMemo(() => {
    let casLabel = '';
    let motifCorps = '';
    let piecesJointes: string[] = [
      "Copie recto-verso de l'avis de contravention n° " + pvInput.noticeNumber,
      'Copie du certificat d’immatriculation du véhicule'
    ];

    if (contestReason === 'cas_1_usurpation_vol') {
      casLabel = 'CAS N° 1 (Vol, destruction ou usurpation de plaques - Doublette)';
      motifCorps = `Je vous informe que je n'étais pas en possession de mon véhicule à la date et à l'heure des faits constatés.
En effet, mon véhicule ou mes plaques d'immatriculation ont fait l'objet d'un vol ou d'une usurpation (doublette). Une plainte a été déposée auprès des services de police/gendarmerie compétents.`;
      piecesJointes.push(
        'Récépissé original du dépôt de plainte pour vol ou usurpation de plaque',
        'Le cas échéant, certificat de destruction du véhicule'
      );
    } else if (contestReason === 'cas_2_designation_conducteur') {
      casLabel = 'CAS N° 2 (Prêt de véhicule ou cession : Désignation du conducteur)';
      motifCorps = `Je vous indique que je ne conduisais pas le véhicule immatriculé ${pvInput.vehiclePlate} lors de l'infraction mentionnée.
Le véhicule avait été prêté à la personne suivante, qui en avait la garde exclusive :
- Nom et Prénom : ${thirdPartyDriver.fullName || '[Nom et Prénom du conducteur]'}
- Adresse : ${thirdPartyDriver.address || '[Adresse complète]'}
- Né(e) le : ${thirdPartyDriver.birthDate || '[Date de naissance]'} à ${thirdPartyDriver.birthPlace || '[Lieu de naissance]'}
- Titulaire du permis de conduire n° : ${thirdPartyDriver.licenseNumber || '[N° de permis]'}, délivré le ${thirdPartyDriver.licenseDate || '[Date]'}`;
      piecesJointes.push(
        'Copie du permis de conduire de la personne désignée (si disponible)'
      );
    } else if (contestReason === 'cas_3_photo_non_probante') {
      casLabel = 'CAS N° 3 (Contestation de la matérialité de l’infraction - Cliché non probant)';
      motifCorps = `En application de l'article L. 121-3 du Code de la route, le titulaire du certificat d'immatriculation n'est responsable pécuniairement que s'il est formellement établi qu'il était le conducteur effectif au moment des faits, ou à défaut d'identification, sous réserve des règles applicables.
Or, le cliché photographique réalisé lors du contrôle (prise de vue arrière ou vue floue/éloignée) ne permet aucunement d'identifier le visage du conducteur.
Ne pouvant me souvenir avec certitude de la personne conduisant mon véhicule à cette date précise, et aucun élément matériel n'établissant ma présence au volant, je conteste formellement être l'auteur de ladite infraction et sollicite ma relaxe ou le classement sans suite, ainsi que la restitution de la consignation versée.`;
      piecesJointes.push(
        'Justificatif du versement de la consignation préalable obligatoire (quittance télépaiement ANTAI)',
        'Copie de la demande ou du cliché photographique officiel obtenu auprès du CACIR de Rennes'
      );
    } else if (contestReason === 'cas_3_signalisation_panneau') {
      casLabel = 'CAS N° 3 (Défaillance manifeste de la signalisation réglementaire)';
      motifCorps = `Je conteste l'infraction reprochée en raison d'une irrégularité substantielle de la signalisation routière sur les lieux de l'infraction.
En effet, la signalisation matérialisant la limitation ou l'interdiction était soit masquée par de la végétation, soit inexistante, soit rendue illisible par des travaux non signalés conformément aux normes de l'Instruction Interministérielle sur la Signalisation Routière (IISR).
${contestDetails ? `Précisions : ${contestDetails}` : ''}
Par conséquent, l'infraction ne peut m'être valablement opposée faute d'information claire et conforme de l'usager.`;
      piecesJointes.push(
        'Justificatif du versement de la consignation préalable obligatoire',
        'Photographies des lieux attestant du défaut ou masquage de signalisation',
        'Arrêté municipal ou préfectoral de circulation'
      );
    } else {
      casLabel = 'CAS N° 3 (État de nécessité / Urgence impérieuse justifiée)';
      motifCorps = `Je conteste cette contravention en invoquant l'état de nécessité au sens de l'article 122-7 du Code pénal.
En effet, la situation exigeait d'agir face à un danger imminent pour la santé ou l'intégrité physique d'une personne :
${contestDetails || '[Décrire précisément la situation d’urgence médicale ou le péril imminent]'}.
Je sollicite en conséquence l'examen bienveillant de ma situation et le classement sans suite de ce dossier.`;
      piecesJointes.push(
        'Justificatif de consignation préalable',
        'Certificat médical d’admission aux urgences ou rapport d’intervention'
      );
    }

    return `Expéditeur :
${driverProfile.fullName}
${driverProfile.address}
Permis de conduire n° : ${driverProfile.licenseNumber}
Tél : ${driverProfile.phone} | Email : ${driverProfile.email}

Destinataire :
Monsieur l'Officier du Ministère Public (OMP)
Près le Centre Automatisé de Constatation des Infractions Routières (CACIR)
CS 41101 - 35911 RENNES CEDEX 9
(Ou via téléservice officiel : antai.gouv.fr)

Fait à ${driverProfile.address.split(',')[1] || 'Paris'}, le ${new Date().toLocaleDateString('fr-FR')}

Objet : Requête en exonération - ${casLabel}
Référence Avis de contravention n° : ${pvInput.noticeNumber}
Immatriculation du véhicule : ${pvInput.vehiclePlate}
Date de l'avis : ${new Date(pvInput.noticeDate).toLocaleDateString('fr-FR')}
Infraction alléguée : ${selectedInfraction.title}

Monsieur l'Officier du Ministère Public,

Par la présente, je forme formellement une requête en exonération conformément aux articles 529-2, 529-10 et 530-1 du Code de procédure pénale, à l'encontre de l'avis de contravention n° ${pvInput.noticeNumber} dressé le ${new Date(pvInput.infractionDate).toLocaleDateString('fr-FR')} à ${pvInput.infractionTime || 'l’heure indiquée'}.

EXPOSÉ DES MOTIFS :
${motifCorps}

Je vous remercie par conséquent de bien vouloir classer cette contravention sans suite ou, à défaut, de transmettre le présent dossier devant le Tribunal de Police territorialement compétent afin que je puisse faire valoir mes droits et moyens de défense.

Pièces jointes obligatoires :
${piecesJointes.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n')}

Restant à votre disposition pour tout renseignement complémentaire, je vous prie d'agréer, Monsieur l'Officier du Ministère Public, l'expression de ma considération distinguée.

${driverProfile.fullName}`;
  }, [
    driverProfile,
    pvInput,
    selectedInfraction,
    contestReason,
    thirdPartyDriver,
    contestDetails
  ]);

  const [copiedLetter, setCopiedLetter] = useState(false);
  const handleCopyLetter = () => {
    navigator.clipboard.writeText(contestationLetterText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 3000);
  };

  // Add event to carnet
  const handleAddInfractionToCarnet = () => {
    const est = estimatePointRestitutionDate(
      pvInput.infractionDate,
      selectedInfraction.pointsLoss,
      selectedInfraction.fineClass
    );

    const newEvt: PointEvent = {
      id: `pt_${Date.now()}`,
      date: pvInput.infractionDate,
      infractionTitle: selectedInfraction.title,
      pointsDeducted: selectedInfraction.pointsLoss,
      fineClass: selectedInfraction.fineClass,
      restituted: false,
      expectedRestitutionDate: est.expectedDate.toISOString().split('T')[0],
      restitutionRule: est.ruleLabel,
      notes: `Avis n° ${pvInput.noticeNumber}`
    };

    setPointsHistory((prev) => [newEvt, ...prev]);
    if (selectedInfraction.pointsLoss > 0) {
      setCurrentPointsTotal((prev) => Math.max(0, prev - selectedInfraction.pointsLoss));
    }
    setActiveTab('carnet');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      {/* ========================================= */}
      {/* HERO BANNER - PERMISPROTECT               */}
      {/* ========================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-indigo-900/60">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            <span>Bouclier Juridique Routier & Préservation du Permis</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-serif-title">
            PermisProtect
          </h1>

          <p className="text-sm sm:text-base text-indigo-100/90 leading-relaxed font-sans">
            Ne laissez pas les délais passer ni votre permis s'évaporer. Analysez votre avis de contravention,
            bénéficiez du <strong>délai télépaiement (+15 jours)</strong>, générez votre <strong>requête en exonération conforme ANTAI</strong>
            et suivez la <strong>récupération automatique de vos points</strong> en toute confidentialité locale.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-slate-800/80 border border-indigo-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-indigo-300/80 uppercase font-semibold">Délai minoré ANTAI</span>
              <span className="text-lg font-black text-emerald-400">30 jours</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Par télépaiement en ligne</span>
            </div>

            <div className="bg-slate-800/80 border border-indigo-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-indigo-300/80 uppercase font-semibold">1 point perdu</span>
              <span className="text-lg font-black text-amber-300">6 mois</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Récupération sans récidive</span>
            </div>

            <div className="bg-slate-800/80 border border-indigo-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-indigo-300/80 uppercase font-semibold">Contestation</span>
              <span className="text-lg font-black text-sky-300">45 à 60 j</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Article 529-2 CPP</span>
            </div>

            <div className="bg-slate-800/80 border border-indigo-800/50 rounded-2xl p-3">
              <span className="block text-[11px] text-indigo-300/80 uppercase font-semibold">Stage de points</span>
              <span className="text-lg font-black text-purple-300">+4 points</span>
              <span className="block text-[10px] text-slate-400 mt-0.5">Max 1 par an et 1 jour</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* NAVIGATION TABS                          */}
      {/* ========================================= */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 border border-slate-200">
        <button
          onClick={() => setActiveTab('analyse')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'analyse'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-indigo-600" />
          <span>Analyse du PV & Délais</span>
        </button>

        <button
          onClick={() => setActiveTab('contester')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'contester'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>Assistant de Contestation</span>
        </button>

        <button
          onClick={() => setActiveTab('carnet')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'carnet'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Car className="w-4 h-4 text-amber-600" />
          <span>Carnet de Points & Récupération</span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: ANALYSE DE L'AVIS DE CONTRAVENTION */}
      {/* ========================================= */}
      {activeTab === 'analyse' && (
        <div className="space-y-6">
          {/* CRITICAL WARNING BANNER */}
          <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-rose-950">
            <AlertTriangle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-sm font-bold block uppercase tracking-wide text-rose-900">
                Avertissement Légal Majeur : Payer = Reconnaître
              </strong>
              <p className="text-xs text-rose-800 leading-relaxed">
                Selon l'article L. 223-1 du Code de la route, <strong>le paiement de l'amende entraîne automatiquement la reconnaissance de la réalité de l'infraction</strong>. Dès que vous payez, le retrait de points est irréversible et toute contestation ultérieure devient strictement irrecevable. Si vous souhaitez contester ou désigner un autre conducteur, <strong>ne payez surtout pas l'amende</strong> !
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <span>1. Saisie des mentions de l'avis</span>
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">Formulaire ANTAI</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 block">
                  Infraction constatée :
                </label>
                <select
                  value={pvInput.selectedInfractionId}
                  onChange={(e) =>
                    setPvInput((prev) => ({ ...prev, selectedInfractionId: e.target.value }))
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  {COMMON_INFRACTIONS.map((inf) => (
                    <option key={inf.id} value={inf.id}>
                      {inf.title} ({inf.pointsLoss > 0 ? `-${inf.pointsLoss} pt(s)` : '0 point'})
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 block">
                  {selectedInfraction.legalArticle} • {selectedInfraction.description}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    N° d'avis (10 chiffres) :
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    value={pvInput.noticeNumber}
                    onChange={(e) =>
                      setPvInput((prev) => ({ ...prev, noticeNumber: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Immatriculation :
                  </label>
                  <input
                    type="text"
                    value={pvInput.vehiclePlate}
                    onChange={(e) =>
                      setPvInput((prev) => ({
                        ...prev,
                        vehiclePlate: e.target.value.toUpperCase()
                      }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Date de l'avis :
                  </label>
                  <input
                    type="date"
                    value={pvInput.noticeDate}
                    onChange={(e) =>
                      setPvInput((prev) => ({ ...prev, noticeDate: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                  />
                  <span className="text-[10px] text-slate-500">Date en haut à droite</span>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Date infraction :
                  </label>
                  <input
                    type="date"
                    value={pvInput.infractionDate}
                    onChange={(e) =>
                      setPvInput((prev) => ({ ...prev, infractionDate: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700 block">
                  Lieu de l'infraction :
                </label>
                <input
                  type="text"
                  value={pvInput.location || ''}
                  onChange={(e) =>
                    setPvInput((prev) => ({ ...prev, location: e.target.value }))
                  }
                  placeholder="Ex : RN 10, KM 45, Direction Bordeaux"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800">
                    Radar automatique / CSA Rennes :
                  </span>
                  <input
                    type="checkbox"
                    checked={pvInput.isRadarAutomatique}
                    onChange={(e) =>
                      setPvInput((prev) => ({ ...prev, isRadarAutomatique: e.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="space-y-1 pt-1 border-t border-slate-200">
                  <label className="text-[11px] font-semibold text-slate-700 block">
                    Mode de règlement envisagé :
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        setPvInput((prev) => ({ ...prev, paymentMethod: 'internet' }))
                      }
                      className={`p-2 rounded-lg font-bold border text-center transition-all ${
                        pvInput.paymentMethod === 'internet'
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Télépaiement (+15 j)
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setPvInput((prev) => ({ ...prev, paymentMethod: 'courrier_bancaire' }))
                      }
                      className={`p-2 rounded-lg font-bold border text-center transition-all ${
                        pvInput.paymentMethod === 'courrier_bancaire'
                          ? 'bg-indigo-600 text-white border-indigo-700'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Courrier chèque (standard)
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddInfractionToCarnet}
                className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Enregistrer dans mon Carnet de Points</span>
              </button>
            </div>

            {/* Analysis Result & Timeline (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Financial & Points Summary Card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Bilan de l'infraction
                    </span>
                    <h4 className="text-lg font-black text-slate-900 mt-0.5">
                      {selectedInfraction.title}
                    </h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1 ${
                        selectedInfraction.pointsLoss > 0
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>
                        {selectedInfraction.pointsLoss > 0
                          ? `-${selectedInfraction.pointsLoss} POINT(S)`
                          : '0 POINT RETIRÉ'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* 3 Price tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Minorée */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                        Tarif Minoré
                      </span>
                      <span className="text-xs bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.5 rounded">
                        Échéance 1
                      </span>
                    </div>
                    <div className="text-2xl font-black text-emerald-900">
                      {selectedInfraction.fineMinoree} €
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      Jusqu'au {datesCalc.dateLimitMinoree.toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700">
                      {datesCalc.daysRemainingMinoree >= 0
                        ? `Il vous reste ${datesCalc.daysRemainingMinoree} jour(s)`
                        : 'Délai dépassé'}
                    </div>
                  </div>

                  {/* Forfaitaire */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Tarif Forfaitaire
                      </span>
                      <span className="text-xs bg-slate-200 text-slate-800 font-bold px-1.5 py-0.5 rounded">
                        Échéance 2
                      </span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">
                      {selectedInfraction.fineForfaitaire} €
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Jusqu'au {datesCalc.dateLimitForfaitaire.toLocaleDateString('fr-FR')}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      Après expiration du tarif minoré
                    </div>
                  </div>

                  {/* Majorée */}
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">
                        Tarif Majoré
                      </span>
                      <span className="text-xs bg-rose-200 text-rose-900 font-bold px-1.5 py-0.5 rounded">
                        Pénalité
                      </span>
                    </div>
                    <div className="text-2xl font-black text-rose-900">
                      {selectedInfraction.fineMajoree} €
                    </div>
                    <div className="text-[11px] text-rose-800 font-medium">
                      Au-delà de l'échéance 2
                    </div>
                    <div className="text-[10px] text-rose-700">
                      Titres exécutoires Trésor Public
                    </div>
                  </div>
                </div>

                {/* Contestation Deadline Card */}
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-indigo-950">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wide text-indigo-900">
                      <Clock className="w-4 h-4 text-indigo-700" />
                      <span>Délai strict pour contester sans payer :</span>
                    </div>
                    <p className="text-xs text-indigo-800">
                      Votre requête en exonération doit être expédiée au plus tard le :{' '}
                      <strong>{datesCalc.dateLimitContest.toLocaleDateString('fr-FR')}</strong>{' '}
                      ({datesCalc.daysRemainingContest >= 0 ? `${datesCalc.daysRemainingContest} jours restants` : 'Délai forclos'}).
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('contester')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 flex items-center gap-1.5 transition-all"
                  >
                    <span>Lancer la contestation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Automatic Point Recovery Rule info */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 text-xs text-amber-950">
                  <strong className="block font-bold text-amber-900">
                    Si l'infraction est reconnue (après paiement) :
                  </strong>
                  <p className="text-[11px] leading-relaxed text-stone-700">
                    {selectedInfraction.pointsLoss === 1
                      ? 'Ce point unique sera récupéré automatiquement au bout de 6 mois sans aucune nouvelle infraction constatée (Art. L223-6 al. 1). Si vous commettez une nouvelle infraction durant ce délai, le délai est repoussé à 2 ou 3 ans.'
                      : selectedInfraction.fineClass <= 3
                      ? 'Les points seront réattribués après un délai de 2 ans sans aucune nouvelle infraction constatée.'
                      : 'Les points seront réattribués après un délai de 3 ans sans aucune nouvelle infraction constatée (contraventions de 4e classe).'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: ASSISTANT DE CONTESTATION ANTAI    */}
      {/* ========================================= */}
      {activeTab === 'contester' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-600" />
                <span>Requête en Exonération Officielle (ANTAI / OMP)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Génération de votre dossier de contestation conforme aux articles 529-2 et 529-10 du Code de procédure pénale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLetter}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
              >
                <Copy className="w-4 h-4" />
                <span>{copiedLetter ? 'Copié !' : 'Copier lettre'}</span>
              </button>
              <a
                href="https://www.antai.gouv.fr/particulier/designer-ou-contester"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <span>Accéder au portail ANTAI</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Contestation Wizard Selector (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
                Sélectionnez votre motif légal de contestation
              </h3>

              <div className="space-y-2">
                {/* Cas 1 */}
                <label
                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    contestReason === 'cas_1_usurpation_vol'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="contestReason"
                      value="cas_1_usurpation_vol"
                      checked={contestReason === 'cas_1_usurpation_vol'}
                      onChange={() => setContestReason('cas_1_usurpation_vol')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        Cas 1 : Vol, destruction ou usurpation (doublette)
                      </strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Véhicule volé, cédé pour destruction ou plaques copiées. Aucune consignation requise.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cas 2 */}
                <label
                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    contestReason === 'cas_2_designation_conducteur'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="contestReason"
                      value="cas_2_designation_conducteur"
                      checked={contestReason === 'cas_2_designation_conducteur'}
                      onChange={() => setContestReason('cas_2_designation_conducteur')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        Cas 2 : Prêt du véhicule / Désignation d'un tiers
                      </strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Vous n'étiez pas au volant (véhicule prêté à un conjoint, collègue, enfant). Aucune consignation requise.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cas 3 - Photo non probante */}
                <label
                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    contestReason === 'cas_3_photo_non_probante'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="contestReason"
                      value="cas_3_photo_non_probante"
                      checked={contestReason === 'cas_3_photo_non_probante'}
                      onChange={() => setContestReason('cas_3_photo_non_probante')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        Cas 3 : Cliché non probant / Flash arrière (Art. L121-3)
                      </strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Conducteur non identifiable sur la photo. Consignation préalable requise mais 0 point retiré.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cas 3 - Signalisation */}
                <label
                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    contestReason === 'cas_3_signalisation_panneau'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="contestReason"
                      value="cas_3_signalisation_panneau"
                      checked={contestReason === 'cas_3_signalisation_panneau'}
                      onChange={() => setContestReason('cas_3_signalisation_panneau')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        Cas 3 : Signalisation défaillante ou masquée
                      </strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Panneau de limitation masqué, incohérence de signalisation de chantier ou marquage effacé.
                      </span>
                    </div>
                  </div>
                </label>

                {/* Cas 3 - Urgence */}
                <label
                  className={`block p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    contestReason === 'cas_3_urgence_force_majeure'
                      ? 'border-indigo-600 bg-indigo-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="contestReason"
                      value="cas_3_urgence_force_majeure"
                      checked={contestReason === 'cas_3_urgence_force_majeure'}
                      onChange={() => setContestReason('cas_3_urgence_force_majeure')}
                      className="mt-0.5 text-indigo-600"
                    />
                    <div>
                      <strong className="text-xs font-bold text-slate-900 block">
                        Cas 3 : Urgence médicale / Force majeure (Art. 122-7)
                      </strong>
                      <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                        Danger grave et imminent justifié par un certificat médical ou d'admission d'urgence.
                      </span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Conditional Third-Party Details Form (Cas 2) */}
              {contestReason === 'cas_2_designation_conducteur' && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 pt-2">
                  <strong className="text-xs font-bold text-slate-900 block">
                    Coordonnées du conducteur à désigner (Obligatoire) :
                  </strong>
                  <input
                    type="text"
                    placeholder="Nom et Prénom du conducteur"
                    value={thirdPartyDriver.fullName}
                    onChange={(e) =>
                      setThirdPartyDriver((prev) => ({ ...prev, fullName: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Adresse complète"
                    value={thirdPartyDriver.address}
                    onChange={(e) =>
                      setThirdPartyDriver((prev) => ({ ...prev, address: e.target.value }))
                    }
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Date & Lieu naissance"
                      value={thirdPartyDriver.birthDate}
                      onChange={(e) =>
                        setThirdPartyDriver((prev) => ({ ...prev, birthDate: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="N° Permis de conduire"
                      value={thirdPartyDriver.licenseNumber}
                      onChange={(e) =>
                        setThirdPartyDriver((prev) => ({ ...prev, licenseNumber: e.target.value }))
                      }
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              )}

              {/* Free text additional details */}
              {(contestReason === 'cas_3_signalisation_panneau' ||
                contestReason === 'cas_3_urgence_force_majeure') && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 block">
                    Circonstances et précisions factuelles :
                  </label>
                  <textarea
                    rows={3}
                    value={contestDetails}
                    onChange={(e) => setContestDetails(e.target.value)}
                    placeholder="Décrivez précisément l'état de la route, la position des arbres/panneaux, ou l'urgence..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              )}

              {/* Consignation Alert for Cas 3 */}
              {contestReason.startsWith('cas_3') && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1 text-xs">
                  <strong className="text-amber-900 font-bold block">
                    Attention : Consignation préalable obligatoire (Cas 3)
                  </strong>
                  <p className="text-stone-700 text-[11px] leading-relaxed">
                    Pour contester dans le Cas 3 (radar automatique), l'article 529-10 du CPP exige le versement d'une <strong>consignation financière</strong> ({selectedInfraction.fineForfaitaire} € ou {selectedInfraction.fineMinoree} €).
                    Cette somme n'est pas un paiement : elle vous est <strong>intégralement remboursée</strong> si l'Officier du Ministère Public classe le dossier ou si le juge vous relaxe.
                  </p>
                </div>
              )}
            </div>

            {/* Generated Official Letter (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    Modèle officiel de requête en exonération
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Prêt pour expédition postale LRAR ou télétransmission ANTAI
                  </span>
                </div>
                <button
                  onClick={handleCopyLetter}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedLetter ? 'Copié !' : 'Copier texte'}</span>
                </button>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-[11px] text-slate-800 max-h-96 overflow-y-auto whitespace-pre-line leading-relaxed">
                {contestationLetterText}
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block font-bold">Conseil pour contester sans frais :</strong>
                  <p className="text-[11px] leading-relaxed">
                    Privilégiez la contestation en ligne sur le site officiel <strong>antai.gouv.fr</strong>. Vous n'aurez aucun frais d'affranchissement postal recommandé et vous recevrez immédiatement un accusé d'enregistrement électronique certifié.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 3: CARNET DE POINTS LOCAL            */}
      {/* ========================================= */}
      {activeTab === 'carnet' && (
        <div className="space-y-6">
          {/* Top Scorecard */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Current Balance */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-sm border border-indigo-800 space-y-2">
              <span className="text-xs uppercase tracking-wider text-indigo-300 font-bold block">
                Solde estimé actuel
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-amber-300">
                  {currentPointsTotal}
                </span>
                <span className="text-lg text-slate-300 font-bold">/ {maxPointsPossible} pts</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {currentPointsTotal <= 6
                  ? '⚠️ Attention : capital points fragilisé. Envisagez un stage volontaire.'
                  : 'Capital sécurisé. Consultez vos délais de récupération ci-dessous.'}
              </p>
            </div>

            {/* Stage Recovery Simulator */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Stage de récupération (+4 pts)
                </span>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                  L. 223-6
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Effectuer un stage de sensibilisation à la sécurité routière (2 jours consécutifs) permet de récupérer <strong>immédiatement 4 points</strong> (dans la limite du plafond de 12 points).
              </p>
              <div className="text-[11px] font-bold text-purple-700 bg-purple-50 p-2 rounded-xl border border-purple-100">
                Règle légale : 1 seul stage crédité tous les 1 an et 1 jour.
              </div>
            </div>

            {/* Official Règle des 10 ans */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wide block">
                Règle d'or des 10 ans (Art. L223-6)
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chaque retrait de point est <strong>définitivement et automatiquement effacé</strong> au bout de 10 ans jour pour jour, même s'il y a eu d'autres infractions entre-temps (tant que le permis n'a pas été invalidé à 0 point).
              </p>
              <a
                href="https://mespoints.permisdeconduire.gouv.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Consulter mon solde officiel MesPoints.gouv.fr</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Points Deduction History */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Historique de vos retraits & Calendrier de récupération
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Toutes les données sont stockées exclusivement sur votre navigateur (Zero-Knowledge).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPointsTotal(12)}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-2 py-1 rounded bg-slate-100"
                >
                  Réinitialiser à 12 pts
                </button>
              </div>
            </div>

            {pointsHistory.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                Aucun retrait de points enregistré dans votre historique local.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {pointsHistory.map((item) => (
                  <div
                    key={item.id}
                    className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {item.infractionTitle}
                        </span>
                        <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-black rounded-full">
                          -{item.pointsDeducted} pt(s)
                        </span>
                        {item.restituted && (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Point restitué</span>
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">
                        Date de l'infraction : {new Date(item.date).toLocaleDateString('fr-FR')} • {item.notes}
                      </div>
                      <div className="text-[11px] text-indigo-700 font-medium">
                        Règle légale : {item.restitutionRule}
                      </div>
                    </div>

                    <div className="text-right sm:text-right flex items-center gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Date de restitution estimée
                        </span>
                        <span className="text-xs font-black text-slate-800">
                          {new Date(item.expectedRestitutionDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          setPointsHistory((prev) => prev.filter((p) => p.id !== item.id))
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
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
        </div>
      )}
    </div>
  );
};
