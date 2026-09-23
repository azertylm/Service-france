import React, { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  Clock,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Copy,
  Download,
  ShieldAlert,
  Coins,
  Building,
  UserCheck,
  Check,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Ban,
  PhoneCall,
  Search,
  Filter,
  FileDown,
  Info,
  KeyRound,
  RotateCcw
} from 'lucide-react';
import {
  SuccessionTimeframe,
  SuccessionOrganism,
  SuccessionFormData,
  SavedSuccessionStep
} from '../../types/succession';
import {
  SUCCESSION_ORGANISMS,
  TIMEFRAME_LABELS,
  DIRECT_DEBIT_BLOCKING_INSTRUCTIONS
} from '../../data/successionCatalog';

interface VigilanceSuccessionHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category?: any) => void;
}

const STORAGE_STEPS_KEY = 'vigilance_succession_steps_v1';
const STORAGE_FORM_KEY = 'vigilance_succession_form_v1';
const STORAGE_ADMIN_PROFILE = 'claircontrat_admin_profile_v1';

export const VigilanceSuccessionHub: React.FC<VigilanceSuccessionHubProps> = ({
  onNavigateToPlumeWithPrompt
}) => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'chronologie' | 'courriers' | 'blocage' | 'dossier'>('chronologie');
  const [selectedTimeframe, setSelectedTimeframe] = useState<SuccessionTimeframe | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected organism for single letter preview / actions
  const [selectedOrganismId, setSelectedOrganismId] = useState<string>(SUCCESSION_ORGANISMS[0].id);

  // Form data for deceased and declarant
  const [formData, setFormData] = useState<SuccessionFormData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FORM_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    // Default template date: 5 days ago
    const d = new Date();
    d.setDate(d.getDate() - 5);
    const deathDateStr = d.toISOString().split('T')[0];

    const birth = new Date();
    birth.setFullYear(birth.getFullYear() - 78);
    const birthDateStr = birth.toISOString().split('T')[0];

    return {
      deceasedFullName: 'Robert MARTIN',
      deceasedGender: 'M',
      deceasedBirthDate: birthDateStr,
      deceasedBirthPlace: 'Lyon (69003)',
      deceasedDeathDate: deathDateStr,
      deceasedDeathPlace: 'Marseille (13008)',
      deceasedAddress: '24 Rue Paradis, 13006 Marseille',
      deceasedSocialSecurityNumber: '1 48 03 69 123 456 78',
      deceasedTaxNumber: '1234567890123',

      declarantFullName: 'Claire MARTIN',
      declarantRelationship: 'Fille du défunt',
      declarantAddress: '15 Avenue Foch, 75116 Paris',
      declarantPhone: '06 12 34 56 78',
      declarantEmail: 'claire.martin@email.fr',

      bankName: 'BNP Paribas - Agence Marseille Castellane',
      bankIban: 'FR76 3000 4001 2345 6789 0123 456',
      landlordOrAgencyName: 'Cabinet Immobilier Méditerranée',
      landlordAddress: '10 Place Castellane, 13006 Marseille',
      retirementFundNames: 'Carsat Sud-Est & Agirc-Arrco',
      mutualFundName: 'Harmonie Mutuelle (Contrat n° 8847291)',
      employerName: 'Retraité',
      notaryName: 'Étude Notariale SCP Dubois & Associés',
      notaryAddress: '5 Cours Pierre Puget, 13006 Marseille',
      additionalComments: ''
    };
  });

  // Track completed steps and checklist
  const [savedSteps, setSavedSteps] = useState<Record<string, SavedSuccessionStep>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STEPS_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      mairie_etat_civil: { organismId: 'mairie_etat_civil', completed: true, completedAt: '2026-09-20' },
      employeur_defunt: { organismId: 'employeur_defunt', completed: true, completedAt: '2026-09-21' }
    };
  });

  // Auto-fill declarant from Administrative Keychain if available
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_ADMIN_PROFILE);
      if (raw) {
        const p = JSON.parse(raw);
        setFormData((prev) => ({
          ...prev,
          declarantFullName: prev.declarantFullName === 'Claire MARTIN' && p.fullName ? p.fullName : prev.declarantFullName,
          declarantAddress: prev.declarantAddress === '15 Avenue Foch, 75116 Paris' && p.address ? p.address : prev.declarantAddress,
          declarantEmail: prev.declarantEmail === 'claire.martin@email.fr' && p.email ? p.email : prev.declarantEmail,
          declarantPhone: prev.declarantPhone === '06 12 34 56 78' && p.phone ? p.phone : prev.declarantPhone
        }));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save form data to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FORM_KEY, JSON.stringify(formData));
    } catch (e) {
      console.error(e);
    }
  }, [formData]);

  // Save steps to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STEPS_KEY, JSON.stringify(savedSteps));
    } catch (e) {
      console.error(e);
    }
  }, [savedSteps]);

  // Toggle step completion
  const handleToggleStep = (organismId: string) => {
    setSavedSteps((prev) => {
      const existing = prev[organismId];
      if (existing?.completed) {
        const updated = { ...prev };
        delete updated[organismId];
        return updated;
      } else {
        return {
          ...prev,
          [organismId]: {
            organismId,
            completed: true,
            completedAt: new Date().toISOString().split('T')[0]
          }
        };
      }
    });
  };

  // Selected organism object
  const currentOrganism = useMemo(() => {
    return SUCCESSION_ORGANISMS.find((o) => o.id === selectedOrganismId) || SUCCESSION_ORGANISMS[0];
  }, [selectedOrganismId]);

  // Filtered organisms list
  const filteredOrganisms = useMemo(() => {
    return SUCCESSION_ORGANISMS.filter((org) => {
      if (selectedTimeframe !== 'all' && org.timeframe !== selectedTimeframe) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          org.name.toLowerCase().includes(q) ||
          org.categoryLabel.toLowerCase().includes(q) ||
          org.description.toLowerCase().includes(q) ||
          org.legalBasis.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [selectedTimeframe, searchQuery]);

  // Overall progression calculation
  const totalOrganismsCount = SUCCESSION_ORGANISMS.length;
  const completedCount = useMemo(() => {
    return Object.values(savedSteps).filter((s) => s.completed).length;
  }, [savedSteps]);

  const progressionPercent = Math.round((completedCount / totalOrganismsCount) * 100);

  // Time elapsed since death
  const daysSinceDeath = useMemo(() => {
    if (!formData.deceasedDeathDate) return 0;
    const death = new Date(formData.deceasedDeathDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - death.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }, [formData.deceasedDeathDate]);

  // Copy single letter
  const [copiedLetter, setCopiedLetter] = useState(false);
  const handleCopySingleLetter = () => {
    const fullText = `Expéditeur :\n${formData.declarantFullName}\n${formData.declarantAddress}\nTél : ${formData.declarantPhone} | Email : ${formData.declarantEmail}\n\nDestinataire :\n${currentOrganism.defaultRecipientName}\n${currentOrganism.defaultRecipientAddress}\n\nFait le ${new Date().toLocaleDateString('fr-FR')}\nLettre Recommandée avec Accusé de Réception (LRAR)\n\nObjet : ${currentOrganism.letterSubjectTemplate}\n\n${currentOrganism.letterBodyTemplate(formData)}`;
    navigator.clipboard.writeText(fullText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 3000);
  };

  // Download all letters zip / print package
  const handlePrintSingleLetter = () => {
    window.print();
  };

  // Export full pack as text file
  const handleDownloadAllLettersText = () => {
    let fullPack = `========================================================================\n`;
    fullPack += `DOSSIER COMPLET SUCCESSION : PACK COURRIERS OFFICIELS D'INFORMATION\n`;
    fullPack += `Défunt : ${formData.deceasedFullName} (Décès le ${formData.deceasedDeathDate})\n`;
    fullPack += `Déclarant : ${formData.declarantFullName} (${formData.declarantRelationship})\n`;
    fullPack += `Généré le : ${new Date().toLocaleDateString('fr-FR')} via Vigilance Succession - Service France\n`;
    fullPack += `========================================================================\n\n`;

    SUCCESSION_ORGANISMS.forEach((org, idx) => {
      fullPack += `------------------------------------------------------------------------\n`;
      fullPack += `COURRIER N°${idx + 1} : ${org.name.toUpperCase()}\n`;
      fullPack += `Échéance légale : ${org.legalDeadline} | Fondement : ${org.legalBasis}\n`;
      fullPack += `------------------------------------------------------------------------\n`;
      fullPack += `Expéditeur :\n${formData.declarantFullName}\n${formData.declarantAddress}\nTél : ${formData.declarantPhone} - Email : ${formData.declarantEmail}\n\n`;
      fullPack += `Destinataire :\n${org.defaultRecipientName}\n${org.defaultRecipientAddress}\n\n`;
      fullPack += `Objet : ${org.letterSubjectTemplate}\n\n`;
      fullPack += org.letterBodyTemplate(formData);
      fullPack += `\n\nDocuments impératifs à joindre :\n- ${org.documentsRequired.join('\n- ')}\n\n\n`;
    });

    const blob = new Blob([fullPack], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Pack_Complet_Succession_${formData.deceasedFullName.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Direct debit blockers count
  const blockersCount = SUCCESSION_ORGANISMS.filter((o) => o.stopsDirectDebits).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16 px-4 sm:px-6">
      {/* ========================================= */}
      {/* HERO BANNER - VIGILANCE SUCCESSION        */}
      {/* ========================================= */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-stone-900 to-slate-950 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-stone-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-semibold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span>Soutien Démarches Après Obsèques</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight font-serif-title">
            Vigilance Succession
          </h1>

          <p className="text-sm sm:text-base text-stone-300 leading-relaxed font-sans">
            Le calvaire administratif des familles en deuil simplifié en un parcours clair.
            Suivez les formalités chronologiques (<strong>48h, 7 jours, 30 jours, 6 mois</strong>),
            générez l’ensemble des <strong>courriers officiels d’information en un clic</strong> et
            bloquez immédiatement les <strong>prélèvements bancaires indus</strong> après la date du décès.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3">
              <span className="block text-[11px] text-stone-400 uppercase font-semibold">Temps écoulé</span>
              <span className="text-lg font-black text-amber-300">
                {daysSinceDeath} jour{daysSinceDeath > 1 ? 's' : ''}
              </span>
              <span className="block text-[10px] text-stone-400 mt-0.5">depuis le décès</span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3">
              <span className="block text-[11px] text-stone-400 uppercase font-semibold">Progression</span>
              <span className="text-lg font-black text-emerald-400">
                {completedCount} / {totalOrganismsCount}
              </span>
              <span className="block text-[10px] text-stone-400 mt-0.5">organismes traités</span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3">
              <span className="block text-[11px] text-stone-400 uppercase font-semibold">Courriers prêts</span>
              <span className="text-lg font-black text-sky-300">{totalOrganismsCount}</span>
              <span className="block text-[10px] text-stone-400 mt-0.5">modèles pré-remplis</span>
            </div>

            <div className="bg-stone-800/80 border border-stone-700/80 rounded-2xl p-3">
              <span className="block text-[11px] text-stone-400 uppercase font-semibold">Anti-Prélèvement</span>
              <span className="text-lg font-black text-rose-300">{blockersCount} organismes</span>
              <span className="block text-[10px] text-stone-400 mt-0.5">cessation de plein droit</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* NAVIGATION TABS                          */}
      {/* ========================================= */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap sm:flex-nowrap gap-1.5 border border-slate-200">
        <button
          onClick={() => setActiveTab('chronologie')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'chronologie'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Parcours Chronologique ({completedCount}/{totalOrganismsCount})</span>
        </button>

        <button
          onClick={() => setActiveTab('courriers')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'courriers'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <FileText className="w-4 h-4 text-sky-600" />
          <span>Générateur de Courriers (1-Clic)</span>
        </button>

        <button
          onClick={() => setActiveTab('blocage')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'blocage'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <Ban className="w-4 h-4 text-rose-600" />
          <span>Bouclier Prélèvements Indus</span>
        </button>

        <button
          onClick={() => setActiveTab('dossier')}
          className={`flex-1 min-w-[140px] py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'dossier'
              ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
        >
          <UserCheck className="w-4 h-4 text-emerald-600" />
          <span>Fiche Défunt & Héritier</span>
        </button>
      </div>

      {/* ========================================= */}
      {/* TAB 1: PARCOURS CHRONOLOGIQUE             */}
      {/* ========================================= */}
      {activeTab === 'chronologie' && (
        <div className="space-y-6">
          {/* Timeline banner & progress bar */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span>📅 Calendrier officiel des démarches obligatoires</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    {progressionPercent}% effectué
                  </span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Chaque étape est adossée aux textes légaux stricts (Code Civil, Code du Travail, Code de la Sécurité Sociale, Code Général des Impôts).
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadAllLettersText}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  title="Télécharger l'intégralité des courriers prêts à l'envoi"
                >
                  <FileDown className="w-4 h-4 text-amber-400" />
                  <span>Télécharger le Pack Courriers complet (.txt)</span>
                </button>
              </div>
            </div>

            {/* Progression Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressionPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{completedCount} démarches clôturées</span>
                <span>{totalOrganismsCount - completedCount} formalités restantes</span>
              </div>
            </div>

            {/* Timeframe Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-semibold text-slate-600">Filtrer par délai :</span>
              <button
                onClick={() => setSelectedTimeframe('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedTimeframe === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Tout ({SUCCESSION_ORGANISMS.length})
              </button>
              {(['48h', '7j', '30j', '6m'] as SuccessionTimeframe[]).map((tf) => {
                const count = SUCCESSION_ORGANISMS.filter((o) => o.timeframe === tf).length;
                const completedInTf = SUCCESSION_ORGANISMS.filter(
                  (o) => o.timeframe === tf && savedSteps[o.id]?.completed
                ).length;
                return (
                  <button
                    key={tf}
                    onClick={() => setSelectedTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedTimeframe === tf
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{TIMEFRAME_LABELS[tf].badge}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedTimeframe === tf ? 'bg-amber-700 text-white' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {completedInTf}/{count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeframe Sections */}
          <div className="space-y-6">
            {(['48h', '7j', '30j', '6m'] as SuccessionTimeframe[])
              .filter((tf) => selectedTimeframe === 'all' || selectedTimeframe === tf)
              .map((tf) => {
                const organismsInTimeframe = filteredOrganisms.filter((o) => o.timeframe === tf);
                if (organismsInTimeframe.length === 0) return null;

                const tfConfig = TIMEFRAME_LABELS[tf];

                return (
                  <div key={tf} className="space-y-3">
                    {/* Timeframe Header */}
                    <div className={`p-3.5 rounded-2xl border-2 flex items-center justify-between ${tfConfig.color}`}>
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-5 h-5 shrink-0" />
                        <div>
                          <h3 className="font-black text-sm uppercase tracking-wide">{tfConfig.label}</h3>
                          <p className="text-xs opacity-90">{tfConfig.sub}</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-white/80 rounded-lg shadow-2xs">
                        {organismsInTimeframe.length} démarche{organismsInTimeframe.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* Organisms Cards in this Timeframe */}
                    <div className="grid grid-cols-1 gap-4">
                      {organismsInTimeframe.map((org) => {
                        const isDone = savedSteps[org.id]?.completed;

                        return (
                          <div
                            key={org.id}
                            className={`bg-white rounded-2xl border transition-all p-5 shadow-xs space-y-4 ${
                              isDone
                                ? 'border-emerald-300 bg-emerald-50/20'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <button
                                  type="button"
                                  onClick={() => handleToggleStep(org.id)}
                                  className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                                    isDone
                                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                                      : 'border-slate-300 bg-white hover:border-slate-400'
                                  }`}
                                  title={isDone ? 'Marquer comme non fait' : 'Marquer comme fait'}
                                >
                                  {isDone && <Check className="w-4 h-4 stroke-[3]" />}
                                </button>

                                <div className="space-y-1">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4
                                      className={`text-sm sm:text-base font-bold tracking-tight ${
                                        isDone ? 'text-slate-700 line-through' : 'text-slate-900'
                                      }`}
                                    >
                                      {org.name}
                                    </h4>
                                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                                      {org.categoryLabel}
                                    </span>
                                    {org.stopsDirectDebits && (
                                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 flex items-center gap-1">
                                        <Ban className="w-3 h-3" />
                                        Bloque prélèvements
                                      </span>
                                    )}
                                  </div>

                                  <p className="text-xs text-slate-600 leading-relaxed">{org.description}</p>
                                </div>
                              </div>

                              <div className="text-right shrink-0">
                                <span className="inline-block text-[11px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                                  Délai : {org.legalDeadline}
                                </span>
                              </div>
                            </div>

                            {/* Legal info & Documents list */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-100">
                              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                  <Info className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                  <span>Fondement juridique & Enjeu :</span>
                                </div>
                                <p className="text-[11px] text-slate-600 font-mono">{org.legalBasis}</p>
                                <p className="text-slate-700 text-xs italic">{org.whyCrucial}</p>
                              </div>

                              <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 border border-slate-100">
                                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                                  <FileText className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                                  <span>Pièces impératives à joindre :</span>
                                </div>
                                <ul className="space-y-1 text-slate-600 text-[11px]">
                                  {org.documentsRequired.map((doc, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-amber-500 font-bold">•</span>
                                      <span>{doc}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Practical Tips */}
                            {org.tips && org.tips.length > 0 && (
                              <div className="bg-amber-50/60 border-l-3 border-amber-500 p-2.5 rounded-r-xl text-xs space-y-1">
                                <strong className="text-amber-950 font-bold block text-[11px]">
                                  Conseils pratiques & pièges à éviter :
                                </strong>
                                <ul className="space-y-0.5 text-stone-700 text-[11px]">
                                  {org.tips.map((tip, idx) => (
                                    <li key={idx} className="flex items-start gap-1.5">
                                      <span className="text-amber-600">💡</span>
                                      <span>{tip}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Actions Buttons */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                              <button
                                type="button"
                                onClick={() => handleToggleStep(org.id)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                                  isDone
                                    ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                                }`}
                              >
                                {isDone ? (
                                  <>
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    <span>Annuler le marquage</span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Marquer cette démarche comme faite</span>
                                  </>
                                )}
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedOrganismId(org.id);
                                  setActiveTab('courriers');
                                }}
                                className="px-3.5 py-1.5 bg-sky-50 text-sky-800 hover:bg-sky-100 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border border-sky-200"
                              >
                                <FileText className="w-3.5 h-3.5 text-sky-600" />
                                <span>Voir & Imprimer le courrier pré-rempli</span>
                                <ChevronRight className="w-3 h-3 text-sky-400" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 2: GÉNÉRATEUR DE COURRIERS EN 1-CLIC */}
      {/* ========================================= */}
      {activeTab === 'courriers' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>✉️ Centrale de Rédaction des Courriers Officiels</span>
                <span className="text-xs bg-sky-100 text-sky-800 font-bold px-2 py-0.5 rounded-full">
                  {totalOrganismsCount} modèles disponibles
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Chaque courrier intègre les mentions légales rigoureuses, les références du défunt et les formules exécutoires adaptées à chaque destinataire.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadAllLettersText}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
              >
                <Download className="w-4 h-4 text-amber-400" />
                <span>Télécharger tous les courriers (.txt)</span>
              </button>
            </div>
          </div>

          {/* Grid Layout: Organism selector list on left, Letter viewer on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Organisms Menu (4 cols) */}
            <div className="lg:col-span-4 space-y-2">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 text-xs font-semibold text-slate-700">
                <span>Sélectionnez l'organisme destinataire :</span>
              </div>

              <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                {SUCCESSION_ORGANISMS.map((org) => {
                  const isSelected = org.id === selectedOrganismId;
                  const isDone = savedSteps[org.id]?.completed;

                  return (
                    <button
                      key={org.id}
                      type="button"
                      onClick={() => setSelectedOrganismId(org.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'border-sky-500 bg-sky-50/80 font-bold shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isDone ? 'bg-emerald-500' : 'bg-amber-400'
                            }`}
                          />
                          <span className="truncate text-slate-900">{org.name}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {org.categoryLabel} • {org.legalDeadline}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 mt-1 transition-transform ${
                          isSelected ? 'text-sky-600 translate-x-0.5' : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Letter View & Print Preview (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Actions Bar for the selected letter */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Courrier actif :</span>
                  <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100">
                    {currentOrganism.name}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopySingleLetter}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedLetter ? 'Copié !' : 'Copier texte'}</span>
                  </button>
                  <button
                    onClick={handlePrintSingleLetter}
                    className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Imprimer A4</span>
                  </button>
                  <a
                    href="https://www.laposte.fr/lettre-recommandee-en-ligne"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                    title="Envoyer directement sans vous déplacer depuis La Poste en ligne"
                  >
                    <span>LRAR La Poste</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Official Letter Paper Layout */}
              <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-10 shadow-md font-sans text-xs sm:text-sm text-slate-900 space-y-6 relative print:border-none print:shadow-none print:p-0">
                {/* Registered mail tag */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <span className="inline-block bg-slate-900 text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                      LETTRE RECOMMANDÉE AVEC A.R.
                    </span>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Fondement légal : {currentOrganism.legalBasis}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    Fait le {new Date().toLocaleDateString('fr-FR')}
                  </div>
                </div>

                {/* Sender & Recipient addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
                    <strong className="block text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                      Expéditeur (Déclarant / Ayant droit) :
                    </strong>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {formData.declarantFullName}
                    </div>
                    <div className="text-slate-600 text-xs leading-relaxed">
                      {formData.declarantAddress}
                    </div>
                    <div className="text-slate-500 text-[11px] pt-1 font-mono">
                      Tél : {formData.declarantPhone || '—'} | Email : {formData.declarantEmail || '—'}
                    </div>
                    <div className="text-sky-700 text-[11px] font-medium pt-0.5">
                      Qualité : {formData.declarantRelationship}
                    </div>
                  </div>

                  <div className="bg-sky-50/60 p-4 rounded-xl border border-sky-100 space-y-1">
                    <strong className="block text-[11px] uppercase tracking-wider text-sky-700 font-bold">
                      Destinataire officiel :
                    </strong>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">
                      {currentOrganism.defaultRecipientName}
                    </div>
                    <div className="text-slate-600 text-xs leading-relaxed">
                      {currentOrganism.defaultRecipientAddress}
                    </div>
                  </div>
                </div>

                {/* Subject block */}
                <div className="p-3 bg-amber-50/60 border-l-4 border-amber-500 rounded-r-xl">
                  <strong className="text-amber-950 font-bold">Objet : </strong>
                  <span className="font-semibold text-slate-900">{currentOrganism.letterSubjectTemplate}</span>
                </div>

                {/* Letter Body */}
                <div className="space-y-4 text-slate-800 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                  {currentOrganism.letterBodyTemplate(formData)}
                </div>

                {/* Signature Block */}
                <div className="pt-6 border-t border-slate-100 flex justify-between items-end">
                  <div className="text-xs text-slate-500 space-y-1">
                    <strong className="block text-slate-700 font-semibold">Pièces jointes obligatoires :</strong>
                    <ul className="space-y-0.5 list-disc list-inside text-[11px]">
                      {currentOrganism.documentsRequired.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-right space-y-3">
                    <p className="text-xs font-semibold text-slate-700">{formData.declarantFullName}</p>
                    <div className="h-10 border-b border-dashed border-slate-300 w-36 ml-auto" />
                    <span className="text-[10px] text-slate-400 italic">Signature de l'ayant droit</span>
                  </div>
                </div>

                {/* Plume Link */}
                {onNavigateToPlumeWithPrompt && (
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      Besoin d’adapter ou d’étoffer ce courrier pour une situation complexe ?
                    </span>
                    <button
                      onClick={() =>
                        onNavigateToPlumeWithPrompt(
                          `Rédige un courrier officiel d'information de décès pour ${currentOrganism.name} concernant le défunt ${formData.deceasedFullName}, décédé le ${formData.deceasedDeathDate}. Précise les textes de loi et demande le déblocage des droits successoraux.`,
                          'administrations'
                        )
                      }
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      <span>Personnaliser dans PlumeCitoyenne</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 3: BOUCLIER PRÉLÈVEMENTS INDUS        */}
      {/* ========================================= */}
      {activeTab === 'blocage' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <Ban className="w-5 h-5 text-rose-600" />
                <span>Bouclier de Cessation des Prélèvements Bancaires</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Extinction de plein droit des mandats de prélèvement SEPA et des procurations dès la date du décès (Art. 2003 du Code Civil).
              </p>
            </div>

            <span className="px-3 py-1 bg-rose-100 text-rose-800 rounded-full font-bold text-xs flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>Protection financière immédiate</span>
            </span>
          </div>

          {/* Legal Rules Explanation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {DIRECT_DEBIT_BLOCKING_INSTRUCTIONS.map((instr, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-2 hover:border-slate-300 transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-black text-sm">
                  {idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{instr.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{instr.detail}</p>
              </div>
            ))}
          </div>

          {/* Table of contracts with direct debit status */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Statut des contrats récurrents du défunt ({formData.deceasedFullName})
                </h3>
                <p className="text-xs text-slate-500">
                  Vérifiez que chaque organisme a bien été notifié afin qu'aucun prélèvement postérieur au{' '}
                  <strong>{formData.deceasedDeathDate}</strong> ne passe.
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {SUCCESSION_ORGANISMS.map((org) => {
                const isBlocked = org.stopsDirectDebits;
                const isDone = savedSteps[org.id]?.completed;

                return (
                  <div
                    key={org.id}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{org.name}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded">
                          {org.categoryLabel}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{org.whyCrucial}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {isBlocked ? (
                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-bold flex items-center gap-1 text-[11px]">
                          <Ban className="w-3 h-3 text-rose-600" />
                          <span>Prélèvement à stopper</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-medium text-[11px]">
                          Pas de prélèvement direct
                        </span>
                      )}

                      <button
                        onClick={() => handleToggleStep(org.id)}
                        className={`px-3 py-1 rounded-lg font-bold text-xs transition-all flex items-center gap-1 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Notifié & Bloqué</span>
                          </>
                        ) : (
                          <span>Marquer bloqué</span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* TAB 4: FICHE DÉFUNT & HÉRITIER            */}
      {/* ========================================= */}
      {activeTab === 'dossier' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-600" />
                <span>Fiche d'Identité Successorale & Données Partagées</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Renseignez ces informations une seule fois : elles alimentent automatiquement l’ensemble des {totalOrganismsCount} courriers administratifs.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                <span>Stockage 100% local (Zero-Knowledge)</span>
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 1: Le défunt */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-stone-900 text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Informations concernant le défunt</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nom et Prénom complets :</label>
                  <input
                    type="text"
                    value={formData.deceasedFullName}
                    onChange={(e) => setFormData({ ...formData, deceasedFullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date de naissance :</label>
                    <input
                      type="date"
                      value={formData.deceasedBirthDate}
                      onChange={(e) => setFormData({ ...formData, deceasedBirthDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lieu de naissance :</label>
                    <input
                      type="text"
                      placeholder="ex: Lyon (69)"
                      value={formData.deceasedBirthPlace}
                      onChange={(e) => setFormData({ ...formData, deceasedBirthPlace: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Date exacte du décès :</label>
                    <input
                      type="date"
                      value={formData.deceasedDeathDate}
                      onChange={(e) => setFormData({ ...formData, deceasedDeathDate: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-bold text-amber-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Lieu du décès :</label>
                    <input
                      type="text"
                      placeholder="ex: Marseille (13)"
                      value={formData.deceasedDeathPlace}
                      onChange={(e) => setFormData({ ...formData, deceasedDeathPlace: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Dernière adresse de résidence :</label>
                  <input
                    type="text"
                    value={formData.deceasedAddress}
                    onChange={(e) => setFormData({ ...formData, deceasedAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Numéro de Sécurité Sociale :</label>
                    <input
                      type="text"
                      placeholder="1 48 03 69 ..."
                      value={formData.deceasedSocialSecurityNumber}
                      onChange={(e) => setFormData({ ...formData, deceasedSocialSecurityNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Numéro Fiscal (13 chiffres) :</label>
                    <input
                      type="text"
                      placeholder="1234567890123"
                      value={formData.deceasedTaxNumber}
                      onChange={(e) => setFormData({ ...formData, deceasedTaxNumber: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Le déclarant (Héritier / Proche) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <h3 className="font-bold text-slate-900 text-sm">Informations sur l'ayant droit déclarant</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Votre Nom et Prénom :</label>
                  <input
                    type="text"
                    value={formData.declarantFullName}
                    onChange={(e) => setFormData({ ...formData, declarantFullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lien de parenté avec le défunt :</label>
                  <input
                    type="text"
                    placeholder="ex: Fille, Fils, Conjoint survivant, Frère, Neveu..."
                    value={formData.declarantRelationship}
                    onChange={(e) => setFormData({ ...formData, declarantRelationship: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Votre adresse postale complète :</label>
                  <input
                    type="text"
                    value={formData.declarantAddress}
                    onChange={(e) => setFormData({ ...formData, declarantAddress: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Téléphone de contact :</label>
                    <input
                      type="text"
                      value={formData.declarantPhone}
                      onChange={(e) => setFormData({ ...formData, declarantPhone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Email :</label>
                    <input
                      type="email"
                      value={formData.declarantEmail}
                      onChange={(e) => setFormData({ ...formData, declarantEmail: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <h4 className="font-bold text-slate-800 text-xs">Organismes et Notaire spécifiques :</h4>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Banque principale & IBAN défunt :</label>
                    <input
                      type="text"
                      placeholder="ex: BNP Paribas - FR76 ..."
                      value={formData.bankIban}
                      onChange={(e) => setFormData({ ...formData, bankIban: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Étude notariale pressentie :</label>
                    <input
                      type="text"
                      placeholder="ex: SCP Dubois & Associés, Marseille"
                      value={formData.notaryName}
                      onChange={(e) => setFormData({ ...formData, notaryName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
