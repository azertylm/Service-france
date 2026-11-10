import React, { useState, useMemo } from 'react';
import {
  Scale,
  Compass,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  Heart,
  Stethoscope,
  Smartphone,
  FileKey,
  Coins,
  HeartPulse,
  PhoneCall,
  FileX,
  ShieldAlert,
  Building2,
  Car,
  Key,
  Crown,
  Layers,
  ExternalLink,
  Search,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { MainService } from './Header';

interface ServiceFranceHomeProps {
  onSelectService: (service: MainService) => void;
  onOpenZeroKnowledge?: () => void;
  onOpenKeychain?: () => void;
  onOpenPricing?: () => void;
  onOpenByok?: () => void;
  onOpenSynergy?: () => void;
}

type ToolCategory = 'all' | 'logement' | 'vehicule' | 'demarches' | 'sante' | 'pratique';

interface ToolItem {
  id: MainService;
  title: string;
  badge: string;
  badgeStyle: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  accentBorder: string;
  category: ToolCategory;
  categoryLabel: string;
  tagline: string;
  description: string;
  features: string[];
  ctaLabel: string;
  keywords: string[];
}

const TOOLS_CATALOG: ToolItem[] = [
  {
    id: 'permisprotect',
    title: 'PermisProtect',
    badge: 'ANTAI & Barème 2026',
    badgeStyle: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    icon: Car,
    iconBg: 'bg-indigo-600 text-white',
    accentBorder: 'hover:border-indigo-500 hover:shadow-indigo-500/10',
    category: 'vehicule',
    categoryLabel: 'Véhicule & Route',
    tagline: 'Suivi de points & Contestation PV',
    description: 'Calculateur automatique de perte de points, respect des délais minorés de télépaiement et lettres de contestation ANTAI.',
    features: ['Contestation PV automatisée', 'Calculateur de solde de points', 'Délais minorés 15 à 30 jours'],
    ctaLabel: 'Gérer mon permis',
    keywords: ['permis', 'amende', 'pv', 'points', 'antai', 'voiture', 'radar', 'contester', 'contravention', 'vitesse'],
  },
  {
    id: 'autobailleur',
    title: 'AutoBailleur',
    badge: '0% Commission',
    badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    icon: Building2,
    iconBg: 'bg-emerald-600 text-white',
    accentBorder: 'hover:border-emerald-500 hover:shadow-emerald-500/10',
    category: 'logement',
    categoryLabel: 'Logement & Bailleur',
    tagline: 'Gestion locative & Quittances A4',
    description: 'Gestion locative citoyenne : génération instantanée de quittances conformes, indexation INSEE IRL et régularisation des charges.',
    features: ['Quittances A4 prêtes à signer', 'Indexation IRL INSEE trimestrielle', 'Décompte charges décret 87-713'],
    ctaLabel: 'Gérer mes locations',
    keywords: ['bailleur', 'loyer', 'quittance', 'locataire', 'irl', 'insee', 'charges', 'location', 'bail', 'proprietaire'],
  },
  {
    id: 'claircontrat',
    title: 'ClairContrat',
    badge: 'IA Mistral Souveraine',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: Scale,
    iconBg: 'bg-amber-500 text-slate-950',
    accentBorder: 'hover:border-amber-500 hover:shadow-amber-500/10',
    category: 'demarches',
    categoryLabel: 'Droit & Contrats',
    tagline: 'Décodeur juridique de contrats',
    description: 'Analyse instantanée de vos devis d’artisans, baux d’habitation et CGV pour détecter les clauses abusives ou illégales.',
    features: ['Clauses abusives Code conso', 'Détection des frais cachés', 'Checklist avant signature'],
    ctaLabel: 'Décoder un contrat',
    keywords: ['contrat', 'devis', 'juridique', 'clauses', 'abusif', 'loi', 'avocat', 'signer', 'litige', 'droit'],
  },
  {
    id: 'etatdeslieux',
    title: 'ÉtatDesLieux Protect',
    badge: 'Bouclier Caution',
    badgeStyle: 'bg-sky-100 text-sky-900 border-sky-200',
    icon: ShieldAlert,
    iconBg: 'bg-sky-600 text-white',
    accentBorder: 'hover:border-sky-500 hover:shadow-sky-500/10',
    category: 'logement',
    categoryLabel: 'Logement & Caution',
    tagline: 'Photos certifiées & Vétusté',
    description: 'Horodatage et filigrane SHA-256 infalsifiable pour vos photos d’état des lieux, avec grille légale de vétusté (décret 2016-382).',
    features: ['Horodatage photo cryptographique', 'Grille de vétusté officielle', 'Lettre de restitution caution'],
    ctaLabel: 'Protéger ma caution',
    keywords: ['caution', 'etat des lieux', 'edl', 'logement', 'appartement', 'depot de garantie', 'vetuste', 'locataire'],
  },
  {
    id: 'resiliation',
    title: 'Résil-Express',
    badge: 'Lois Hamon & Chatel',
    badgeStyle: 'bg-rose-100 text-rose-900 border-rose-200',
    icon: FileX,
    iconBg: 'bg-rose-600 text-white',
    accentBorder: 'hover:border-rose-500 hover:shadow-rose-500/10',
    category: 'demarches',
    categoryLabel: 'Abonnements',
    tagline: 'Désengagement en 3 clics',
    description: 'Résiliez sans frais vos abonnements mobiles, salles de sport, assurances et services grâce aux formulaires LRAR juridiquement étayés.',
    features: ['Catalogue 50+ prestataires', 'Générateur LRAR avec mentions légales', 'Zéro pénalité abusive'],
    ctaLabel: 'Résilier un contrat',
    keywords: ['resilier', 'resiliation', 'abonnement', 'assurance', 'salle de sport', 'forfait', 'hamon', 'chatel', 'lrar'],
  },
  {
    id: 'succession',
    title: 'Vigilance Succession',
    badge: '48h à 6 mois',
    badgeStyle: 'bg-stone-200 text-stone-900 border-stone-300',
    icon: Heart,
    iconBg: 'bg-stone-800 text-white',
    accentBorder: 'hover:border-stone-500 hover:shadow-stone-500/10',
    category: 'demarches',
    categoryLabel: 'Obsèques & Famille',
    tagline: 'Guide après décès & Pack courriers',
    description: 'Calendrier chronologique des démarches obligatoires après un décès et génération du pack complet de courriers (Banques, Impôts, Caisses).',
    features: ['Planning 48h / 7j / 30j / 6 mois', 'Pack complet 12+ courriers', 'Déblocage des comptes & pensions'],
    ctaLabel: 'Organiser la succession',
    keywords: ['succession', 'deces', 'obseques', 'heritage', 'notaire', 'banque', 'pension', 'deuil', 'famille'],
  },
  {
    id: 'tuteur',
    title: 'Tuteur Numérique',
    badge: 'Anti-Arnaque & Anti-Rejet',
    badgeStyle: 'bg-blue-100 text-blue-900 border-blue-200',
    icon: Compass,
    iconBg: 'bg-blue-600 text-white',
    accentBorder: 'hover:border-blue-500 hover:shadow-blue-500/10',
    category: 'demarches',
    categoryLabel: 'Démarches en Ligne',
    tagline: 'Guide pas-à-pas ANTS, CAF, Impôts',
    description: 'Assistant interactif pour réussir vos démarches administratives sans payer d’intermédiaires frauduleux et sans rejet de dossier.',
    features: ['Checklist des pièces conformes', 'Alerte anti-sites payants arnaques', 'Accès guichets physiques France Services'],
    ctaLabel: 'Lancer une démarche',
    keywords: ['demarche', 'ants', 'caf', 'impots', 'carte grise', 'passeport', 'cni', 'ameli', 'administration', 'arnaque'],
  },
  {
    id: 'droits',
    title: 'Décodeur de Droits Sociaux',
    badge: 'Anti Non-Recours',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: Coins,
    iconBg: 'bg-amber-500 text-slate-950',
    accentBorder: 'hover:border-amber-500 hover:shadow-amber-500/10',
    category: 'demarches',
    categoryLabel: 'Pouvoir d’Achat',
    tagline: 'Simulateur d’aides non-réclamées',
    description: 'Estimez en toute confidentialité vos droits aux aides de l’État : Prime d’activité, Chèque énergie, Complémentaire Santé Solidaire, CCAS.',
    features: ['Calcul immédiat sans compte', 'Zéro transfert de données web', 'Préparation dossier 1-clic'],
    ctaLabel: 'Calculer mes aides',
    keywords: ['aides', 'droits', 'caf', 'prime activite', 'cheque energie', 'css', 'rsa', 'apl', 'argent', 'pouvoir achat'],
  },
  {
    id: 'garantie',
    title: 'ScanGarantie',
    badge: 'Conformité 2 Ans',
    badgeStyle: 'bg-violet-100 text-violet-900 border-violet-200',
    icon: ShieldCheck,
    iconBg: 'bg-violet-600 text-white',
    accentBorder: 'hover:border-violet-500 hover:shadow-violet-500/10',
    category: 'pratique',
    categoryLabel: 'Achats & Consommation',
    tagline: 'Tickets de caisse & Garanties',
    description: 'Coffre-fort anti-effacement thermique pour vos factures et tickets, avec rappels 30 jours avant la fin de garantie légale de conformité.',
    features: ['Sauvegarde ticket thermique', 'Export rappel iCal / Google Cal', 'Générateur réclamation SAV gratuit'],
    ctaLabel: 'Enregistrer un ticket',
    keywords: ['ticket', 'facture', 'garantie', 'achat', 'sav', 'reparation', 'panne', 'electromenager', 'consommation'],
  },
  {
    id: 'plume',
    title: 'PlumeCitoyenne',
    badge: 'Écrivain Public IA',
    badgeStyle: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    icon: FileText,
    iconBg: 'bg-emerald-700 text-white',
    accentBorder: 'hover:border-emerald-600 hover:shadow-emerald-600/10',
    category: 'demarches',
    categoryLabel: 'Courriers & Litiges',
    tagline: 'Courriers officiels & Mises en demeure',
    description: 'Rédacteur public assisté : génère des courriers juridiquement irréprochables pour vos réclamations administratives et litiges du quotidien.',
    features: ['30+ trames officielles préconçues', 'Rigueur juridique et vouvoiement', 'Bouton 1-clic d’impression A4'],
    ctaLabel: 'Rédiger un courrier',
    keywords: ['courrier', 'lettre', 'mise en demeure', 'reclamation', 'rediger', 'ecrivain public', 'litige', 'voisinage'],
  },
  {
    id: 'memosante',
    title: 'MémoSanté',
    badge: '100% Chiffré Local',
    badgeStyle: 'bg-teal-100 text-teal-900 border-teal-200',
    icon: Stethoscope,
    iconBg: 'bg-teal-600 text-white',
    accentBorder: 'hover:border-teal-500 hover:shadow-teal-500/10',
    category: 'sante',
    categoryLabel: 'Santé Familiale',
    tagline: 'Carnet de santé familial privé',
    description: 'Votre carnet médical souverain sans aucun stockage dans le cloud : vaccins, allergies, décodage d’analyses et fiche d’urgence vitale.',
    features: ['Fiche d’urgence vitale imprimable', 'Profils familiaux protégés par PIN', 'Décodeur d’analyses sanguines'],
    ctaLabel: 'Ouvrir MémoSanté',
    keywords: ['sante', 'medical', 'vaccin', 'allergie', 'analyse', 'medecin', 'ordonnance', 'sang', 'carnet'],
  },
  {
    id: 'patrimoine',
    title: 'Patrimoine en Poche',
    badge: 'Zéro Publicité',
    badgeStyle: 'bg-amber-100 text-amber-900 border-amber-200',
    icon: Building,
    iconBg: 'bg-amber-600 text-white',
    accentBorder: 'hover:border-amber-500 hover:shadow-amber-500/10',
    category: 'pratique',
    categoryLabel: 'Culture & Balades',
    tagline: 'Guide architectural & Scan de façades',
    description: 'Guide du patrimoine civique indépendant sans publicité : reconnaissance de styles architecturaux, boussole hors-ligne et circuits culturels.',
    features: ['Scanner visuel d’architecture', 'Boussole éco-batterie hors-ligne', 'Fiches historiques certifiées'],
    ctaLabel: 'Explorer le patrimoine',
    keywords: ['patrimoine', 'monument', 'architecture', 'visite', 'histoire', 'balade', 'chateau', 'eglise', 'culture'],
  },
  {
    id: 'urgence',
    title: 'Balise 114 & Urgences',
    badge: '24/7 Hors-Ligne',
    badgeStyle: 'bg-rose-100 text-rose-900 border-rose-200',
    icon: HeartPulse,
    iconBg: 'bg-rose-600 text-white',
    accentBorder: 'hover:border-rose-500 hover:shadow-rose-500/10',
    category: 'sante',
    categoryLabel: 'Urgences Vitales',
    tagline: 'Numéros d’urgence & Gestes de secours',
    description: 'Accès immédiat 1-clic aux numéros d’urgence (15, 17, 18, 114 SMS, 3919, 119) et tutoriel pas-à-pas des gestes qui sauvent la vie.',
    features: ['Balise SMS 114 pour personnes sourdes', 'Appels direct SAMU, Police, Pompiers', 'Guide PLS et arrêt cardiaque'],
    ctaLabel: 'Accéder aux urgences',
    keywords: ['urgence', '15', '17', '18', '114', 'secours', 'samu', 'pompiers', 'police', 'danger', '3919', 'malaise'],
  },
];

export const ServiceFranceHome: React.FC<ServiceFranceHomeProps> = ({
  onSelectService,
  onOpenZeroKnowledge,
  onOpenKeychain,
  onOpenPricing,
  onOpenByok,
  onOpenSynergy,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTools = useMemo(() => {
    return TOOLS_CATALOG.filter((tool) => {
      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false;
      }
      // Text search filter
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = tool.title.toLowerCase().includes(q);
      const matchTagline = tool.tagline.toLowerCase().includes(q);
      const matchDesc = tool.description.toLowerCase().includes(q);
      const matchKeywords = tool.keywords.some((k) => k.toLowerCase().includes(q));
      const matchCategory = tool.categoryLabel.toLowerCase().includes(q);
      return matchTitle || matchTagline || matchDesc || matchKeywords || matchCategory;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      {/* 1. Platform Manifesto Banner */}
      <div className="text-center max-w-4xl mx-auto space-y-4 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-xs">
          <span className="flex h-2.5 w-3.5 rounded-xs overflow-hidden border border-white/20">
            <span className="w-1.5 bg-[#002654]" />
            <span className="w-1 bg-white" />
            <span className="w-1.5 bg-[#CE1126]" />
          </span>
          <span>papierpapier.fr · Suite Civique & Familiale d'Utilité Publique</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Tous vos outils administratifs et juridiques,{' '}
          <span className="underline decoration-amber-400 decoration-wavy decoration-3">
            en un seul clic
          </span>
          .
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Sélectionnez ci-dessous l'outil dont vous avez besoin : calcul de points de permis, quittances locatives, analyse de contrat, résiliation, succession, aides sociales ou urgences.
        </p>

        {/* Quick Trousseau & Multi-Device Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {onOpenKeychain && (
            <button
              onClick={onOpenKeychain}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl border border-slate-200 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <FileKey className="w-3.5 h-3.5 text-amber-600" />
              <span>Mon trousseau administratif (local)</span>
            </button>
          )}

          {onOpenZeroKnowledge && (
            <button
              onClick={onOpenZeroKnowledge}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              <span>Confidentialité de vos données</span>
            </button>
          )}

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold rounded-xl border border-amber-200 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Bouquet & Tarifs</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. THE MAIN TOOLS CATALOG SECTION — CLEAR, INTERACTIVE CARDS */}
      <section className="max-w-7xl mx-auto space-y-6">
        {/* Controls: Search Bar + Category Tabs */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un outil (ex: permis, quittance, résiliation, bail, aides, ticket...)"
                className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results counter & quick label */}
            <div className="flex items-center gap-2 text-xs text-slate-500 shrink-0">
              <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full font-bold bg-slate-900 text-white text-[11px]">
                {filteredTools.length}
              </span>
              <span>outil{filteredTools.length > 1 ? 's' : ''} disponible{filteredTools.length > 1 ? 's' : ''} en accès direct</span>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pr-1 flex items-center gap-1 shrink-0">
              <SlidersHorizontal className="w-3 h-3" />
              Filtres :
            </span>
            {[
              { id: 'all', label: 'Tous les outils', count: TOOLS_CATALOG.length },
              { id: 'logement', label: '🏠 Logement & Caution', count: TOOLS_CATALOG.filter((t) => t.category === 'logement').length },
              { id: 'vehicule', label: '🚗 Permis & Route', count: TOOLS_CATALOG.filter((t) => t.category === 'vehicule').length },
              { id: 'demarches', label: '⚖️ Démarches & Droit', count: TOOLS_CATALOG.filter((t) => t.category === 'demarches').length },
              { id: 'sante', label: '🩺 Santé & Urgences', count: TOOLS_CATALOG.filter((t) => t.category === 'sante').length },
              { id: 'pratique', label: '🛍️ Vie Pratique', count: TOOLS_CATALOG.filter((t) => t.category === 'pratique').length },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ToolCategory)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs flex items-center gap-1.5 shrink-0 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* The Grid of Square / Tile Cards */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-900 text-base">Aucun outil ne correspond à votre recherche</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Essayez avec un autre mot-clé ou réinitialisez les filtres pour revoir tous les services.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Afficher les 13 outils
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-stretch">
            {filteredTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectService(tool.id)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectService(tool.id);
                    }
                  }}
                  className={`bg-white rounded-3xl border-2 border-slate-200 p-5 sm:p-6 shadow-xs hover:shadow-xl transition-all duration-200 flex flex-col justify-between group cursor-pointer text-left relative overflow-hidden active:scale-[0.98] ${tool.accentBorder}`}
                >
                  {/* Top Bar: Icon + Category Badge */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div
                        className={`w-12 h-12 rounded-2xl ${tool.iconBg} flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform shrink-0`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>

                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${tool.badgeStyle}`}
                      >
                        {tool.badge}
                      </span>
                    </div>

                    {/* Tool Title and Subtitle */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-700 transition-colors flex items-center justify-between">
                        <span>{tool.title}</span>
                      </h3>
                      <p className="text-xs font-bold text-slate-700 mt-0.5">
                        {tool.tagline}
                      </p>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {tool.description}
                    </p>

                    {/* Feature Micro-Pills */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-100">
                      {tool.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-700">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Direct Launch CTA */}
                  <div className="pt-5 mt-auto">
                    <div className="w-full py-2.5 px-3 rounded-xl bg-slate-900 group-hover:bg-blue-600 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-xs">
                      <span>{tool.ctaLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-white/80" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. ZERO-KNOWLEDGE & SOVEREIGNTY GUARANTEE BANNER */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-black text-emerald-300">
              Engagement Solennel Zero-Knowledge
            </span>
          </div>

          <blockquote className="text-sm sm:text-base font-bold text-white leading-relaxed italic border-l-3 border-emerald-500 pl-3">
            « Vos données ne quittent pas votre appareil de manière lisible. ALPHABETTE n'a aucun moyen technique d'accéder à vos documents, analyses ou courriers. »
          </blockquote>

          <p className="text-xs text-slate-300">
            Stockage 100 % local (IndexedDB chiffré) · Synchronisation multi-appareils (E2EE) par clé éphémère · Profils familiaux cloisonnés par code PIN.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
          {onOpenZeroKnowledge && (
            <button
              onClick={onOpenZeroKnowledge}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Confidentialité de vos données</span>
            </button>
          )}

          {onOpenKeychain && (
            <button
              onClick={onOpenKeychain}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <FileKey className="w-4 h-4 text-amber-400" />
              <span>Mon trousseau administratif</span>
            </button>
          )}
        </div>
      </div>

      {/* 4. QUICK ACCESS EMERGENCY & 114 BANNER */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 animate-pulse">
            <HeartPulse className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-white">
                🚨 Urgences Vitales & Balise SMS 114
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% Hors-ligne
              </span>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              Accès direct 15, 17, 18, 3919 (violences), 119 (enfance), 3018 (cyberharcèlement) & guide des gestes qui sauvent.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectService('urgence')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-950 font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Ouvrir l'Espace Urgence</span>
        </button>
      </div>

      {/* 5. ÉCOSYSTÈME LOGICIEL ALPHABETTE — SOUVERAINETÉ MISTRAL AI & LE BOUQUET */}
      <div className="max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 border-2 border-indigo-500/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex h-3.5 w-5 rounded-xs overflow-hidden border border-white/20">
                <span className="w-1.5 bg-[#002654]" />
                <span className="w-1 bg-white" />
                <span className="w-1.5 bg-[#CE1126]" />
              </span>
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-300">
                Écosystème Logiciel Alphabette · Hub Central http://alphabette.fr
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mistral AI Exclusif (RGPD Natif · UE)</span>
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Une suite d'applications civiques interconnectées propulsée par l'IA française.
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Toutes les applications d'Alphabette fonctionnent comme des briques autonomes mais complémentaires.
              Elles reposent rigoureusement et exclusivement sur la technologie <strong>Mistral AI</strong> : données traitées en Europe sans jamais quitter le cadre juridique de l'Union, et confidentialité absolue garantie (zéro réutilisation pour l'entraînement public).
            </p>

            {/* 3 Niveaux d'accès & Grille tarifaire rapide */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-amber-400/20 flex items-center justify-center text-[10px]">1</span>
                  <span>7 Jours Offerts</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Accès immédiat alimenté par la clé Mistral propriétaire fournie par Alphabette.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-blue-400 font-bold text-xs">
                  <span className="w-5 h-5 rounded-full bg-blue-400/20 flex items-center justify-center text-[10px]">2</span>
                  <span>Mode BYOK (39 € / an)</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Renseignez votre clé Mistral perso ou connectez votre Ollama Mac local à 0 €.
                </p>
              </div>

              <div className="bg-white/5 border border-amber-400/40 rounded-2xl p-3 space-y-1 bg-amber-500/10">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Bouquet Alphabette</span>
                </div>
                <p className="text-[11px] text-amber-200 leading-snug">
                  <strong>99 € / 199 € par an</strong> pour débloquer TOUTES les applications de la suite !
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-72 shrink-0">
            <a
              href="http://alphabette.fr"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 text-center group"
            >
              <span>Découvrir toutes les applications de la suite sur http://alphabette.fr</span>
              <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </a>

            {onOpenPricing && (
              <button
                onClick={onOpenPricing}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
              >
                <Crown className="w-4 h-4 text-slate-950" />
                <span>Grille Tarifaire & Bouquet</span>
              </button>
            )}

            <div className="flex items-center gap-2">
              {onOpenByok && (
                <button
                  onClick={onOpenByok}
                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Key className="w-3.5 h-3.5 text-blue-400" />
                  <span>Clé Mistral (BYOK)</span>
                </button>
              )}

              {onOpenSynergy && (
                <button
                  onClick={onOpenSynergy}
                  className="flex-1 py-2 px-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Synergie</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 6. Citizen Trust & Privacy Guarantees */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-6xl mx-auto shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
          Les engagements républicains de papierpapier.fr
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Confidentialité intégrale</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos baux, réclamations CAF et litiges personnels ne sont ni indexés ni vendus. Zéro revente de vos données.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Données de santé souveraines</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              MémoSanté fonctionne en stockage local sur votre appareil. Aucune base de données médicale centrale.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Zéro sponsoring commercial</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aucun restaurant, pharmacie ou commerce ne peut acheter de visibilité ou d'emplacement sponsorisé.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900">Sobriété & Accessibilité</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interface allégée, respect de l'autonomie batterie et explications rédigées sans jargon technique.
            </p>
          </div>
        </div>
      </div>

      {/* 7. MANDATORY ECOSYSTEM HUB CALLOUT */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-7 max-w-6xl mx-auto shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="text-base font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <span>Écosystème Logiciel Alphabette</span>
            <span className="text-[10px] bg-blue-500/30 text-blue-300 border border-blue-400/30 font-black px-2 py-0.5 rounded-full">
              Souverain & RGPD
            </span>
          </h4>
          <p className="text-xs text-slate-300 mt-1">
            Une suite complète d'outils civiques et professionnels interconnectés, propulsée exclusivement par Mistral AI.
          </p>
        </div>
        <a
          href="http://alphabette.fr"
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 transition-all shadow-md shrink-0 group"
        >
          <span>Découvrir toutes les applications de la suite sur http://alphabette.fr</span>
          <ExternalLink className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
        </a>
      </div>
    </div>
  );
};
