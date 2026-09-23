import React, { useState, useMemo } from 'react';
import {
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  Printer,
  Sparkles,
  HelpCircle,
  Phone,
  ArrowRight,
  Filter,
  CheckSquare,
  Square,
  Lock,
  ChevronDown,
  ChevronUp,
  MapPin,
  RefreshCw,
  Info,
  Car,
  Scale,
  GraduationCap,
  CreditCard,
  Home,
  UserCheck
} from 'lucide-react';
import { DemarcheGuide, DemarcheCategory, RequiredDocument, RoadmapStep } from '../../types/tuteur';
import { PRELOADED_DEMARCHES } from '../../data/tuteurPreloaded';

interface TuteurHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category?: any) => void;
}

export const TuteurHub: React.FC<TuteurHubProps> = ({ onNavigateToPlumeWithPrompt }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGuide, setSelectedGuide] = useState<DemarcheGuide>(PRELOADED_DEMARCHES[0]);
  
  // Custom generated guides cache
  const [customGuides, setCustomGuides] = useState<DemarcheGuide[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // User's document checklist state (persisted per guide id in memory/state)
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [checkedStepActions, setCheckedStepActions] = useState<Record<string, boolean>>({});

  // Active step view (or expanded steps)
  const [expandedStep, setExpandedStep] = useState<number | null>(1);

  // All guides combining preloaded and generated
  const allGuides = useMemo(() => {
    return [...customGuides, ...PRELOADED_DEMARCHES];
  }, [customGuides]);

  // Filtered guides based on query and category
  const filteredGuides = useMemo(() => {
    return allGuides.filter((guide) => {
      const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
      const matchesQuery =
        !searchQuery.trim() ||
        guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.administration.toLowerCase().includes(searchQuery.toLowerCase()) ||
        guide.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allGuides, selectedCategory, searchQuery]);

  // Handle user toggling a document in the checklist
  const toggleDoc = (docId: string) => {
    setCheckedDocs((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };

  // Handle user toggling a step action
  const toggleStepAction = (actionKey: string) => {
    setCheckedStepActions((prev) => ({
      ...prev,
      [actionKey]: !prev[actionKey],
    }));
  };

  // Calculate doc completion percentage for active guide
  const docStats = useMemo(() => {
    if (!selectedGuide) return { total: 0, checked: 0, percent: 0, mandatoryTotal: 0, mandatoryChecked: 0 };
    const total = selectedGuide.requiredDocuments.length;
    const checked = selectedGuide.requiredDocuments.filter((d) => checkedDocs[d.id]).length;
    const mandatoryDocs = selectedGuide.requiredDocuments.filter((d) => d.mandatory);
    const mandatoryChecked = mandatoryDocs.filter((d) => checkedDocs[d.id]).length;
    const percent = total > 0 ? Math.round((checked / total) * 100) : 0;
    return {
      total,
      checked,
      percent,
      mandatoryTotal: mandatoryDocs.length,
      mandatoryChecked,
      isMandatoryComplete: mandatoryChecked === mandatoryDocs.length,
    };
  }, [selectedGuide, checkedDocs]);

  // Trigger custom AI roadmap generation for queries not in catalog
  const handleCustomGeneration = async (queryText: string) => {
    if (!queryText.trim()) return;
    setIsGenerating(true);
    setGenerationError(null);

    try {
      const response = await fetch('/api/tuteur-demarche', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText.trim() }),
      });

      const data = await response.json();
      if (!response.ok || !data.success || !data.guide) {
        throw new Error(data.error || "Impossible de générer la feuille de route.");
      }

      const newGuide: DemarcheGuide = data.guide;
      setCustomGuides((prev) => [newGuide, ...prev.filter((g) => g.id !== newGuide.id)]);
      setSelectedGuide(newGuide);
      setSearchQuery('');
    } catch (err: any) {
      console.error(err);
      setGenerationError(err?.message || "Une erreur est survenue lors de l'interrogation du Tuteur Numérique.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getCategoryIcon = (category: DemarcheCategory) => {
    switch (category) {
      case 'transport':
        return <Car className="w-4 h-4 text-blue-600" />;
      case 'justice_amende':
        return <Scale className="w-4 h-4 text-purple-600" />;
      case 'famille':
        return <GraduationCap className="w-4 h-4 text-amber-600" />;
      case 'fiscalite_social':
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case 'logement':
        return <Home className="w-4 h-4 text-rose-600" />;
      case 'etat_civil':
      default:
        return <UserCheck className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl border border-indigo-900/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-semibold">
            <Compass className="w-3.5 h-3.5" />
            <span>Tuteur Numérique · Réussite des Démarches Publiques</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-serif-title">
            Votre feuille de route pas-à-pas pour les démarches de l'État.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            Même avec un courrier, les interfaces publiques (ANTS, Impôts, CAF, ANTAI, FranceConnect) peuvent paralyser. Le <strong>Tuteur Numérique</strong> vous donne la liste exacte des pièces à réunir pour éviter tout rejet et le guide chronologique en 4 étapes claires.
          </p>
        </div>
      </div>

      {/* 2. Interactive Search & Category Selector */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim() && filteredGuides.length === 0) {
                  handleCustomGeneration(searchQuery);
                }
              }}
              placeholder="Indiquez ce que vous souhaitez faire (ex: refaire ma carte grise, contester un FPS, bourse collège, passeport...)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <button
            onClick={() => handleCustomGeneration(searchQuery)}
            disabled={!searchQuery.trim() || isGenerating}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-xs shrink-0"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyse officielle...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Créer ma feuille de route</span>
              </>
            )}
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Domaines :</span>
          </span>
          {[
            { id: 'all', label: 'Toutes les démarches' },
            { id: 'transport', label: '🚗 Véhicules & ANTS' },
            { id: 'justice_amende', label: '⚖️ Amendes & FPS' },
            { id: 'etat_civil', label: '🆔 CNI & Passeports' },
            { id: 'famille', label: '🎓 Bourses & Enfance' },
            { id: 'fiscalite_social', label: '💰 CAF & Impôts' },
            { id: 'logement', label: '🏠 Logement & Adresse' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Error notification */}
        {generationError && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{generationError}</span>
            </div>
            <button
              onClick={() => setGenerationError(null)}
              className="text-rose-600 font-bold hover:underline"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Quick Suggestions / Matching list */}
        {searchQuery.trim() && filteredGuides.length === 0 && (
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <strong className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                Démarche personnalisée non pré-enregistrée
              </strong>
              <p className="text-slate-600">
                Aucune fiche pré-enregistrée pour "{searchQuery}". Cliquez sur le bouton ci-contre pour générer instantanément la liste exacte des pièces et la feuille de route officielle.
              </p>
            </div>
            <button
              onClick={() => handleCustomGeneration(searchQuery)}
              disabled={isGenerating}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-xs"
            >
              <span>Générer avec l'assistant</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Direct access pills for quick switching */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 pt-2">
          {filteredGuides.map((guide) => (
            <button
              key={guide.id}
              onClick={() => {
                setSelectedGuide(guide);
                window.scrollTo({ top: 380, behavior: 'smooth' });
              }}
              className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2.5 ${
                selectedGuide.id === guide.id
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-xs ring-1 ring-indigo-500'
                  : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
              }`}
            >
              <div className="mt-0.5 shrink-0">{getCategoryIcon(guide.category)}</div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{guide.title}</h4>
                <p className="text-[11px] text-slate-500 truncate">{guide.administration}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 3. ACTIVE GUIDE DISPLAY */}
      {selectedGuide && (
        <div className="space-y-6">
          {/* Guide Title Card */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-2 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-100 text-indigo-900 text-xs font-bold">
                    {getCategoryIcon(selectedGuide.category)}
                    <span>{selectedGuide.administration}</span>
                  </span>

                  {selectedGuide.franceConnectRecommended && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-semibold">
                      <Lock className="w-3 h-3 text-blue-600" />
                      <span>FranceConnect conseillé</span>
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{selectedGuide.cost}</span>
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-serif-title">
                  {selectedGuide.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedGuide.description}
                </p>

                {selectedGuide.delaiEstime && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Délai moyen constaté : {selectedGuide.delaiEstime}</span>
                  </div>
                )}
              </div>

              {/* Action buttons on the right */}
              <div className="flex flex-wrap md:flex-col gap-2 shrink-0">
                <a
                  href={selectedGuide.officialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                >
                  <span>Accéder au site officiel</span>
                  <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                </a>

                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  title="Imprimer cette feuille de route avec cases à cocher au stylo"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-600" />
                  <span>Imprimer en A4</span>
                </button>
              </div>
            </div>

            {/* Anti-Scam Banner */}
            {selectedGuide.warningAntiArnaque && (
              <div className="p-4 rounded-2xl bg-amber-50 border-l-4 border-amber-500 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-950 space-y-1">
                  <strong className="font-bold text-amber-900 uppercase tracking-wider text-[11px] block">
                    Vigilance Anti-Arnaque & Sites Miroirs :
                  </strong>
                  <p className="leading-relaxed">{selectedGuide.warningAntiArnaque}</p>
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION A : BOÎTE À PIÈCES JUSTIFICATIVES (INTERACTIVE CHECKLIST) */}
            {/* ============================================================== */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif-title flex items-center gap-2">
                    <CheckSquare className="w-5 h-5 text-indigo-600" />
                    <span>Pièces justificatives à réunir avant de commencer</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Cochez chaque document dès qu'il est prêt. Cela vous évite une déconnexion pour inactivité pendant la démarche.
                  </p>
                </div>

                {/* Progress pill */}
                <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 shrink-0 self-start sm:self-auto">
                  <span>
                    {docStats.checked} / {docStats.total} prêts
                  </span>
                  <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        docStats.percent === 100
                          ? 'bg-emerald-500'
                          : docStats.percent > 50
                          ? 'bg-indigo-600'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${docStats.percent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Documents Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedGuide.requiredDocuments.map((doc: RequiredDocument) => {
                  const isChecked = !!checkedDocs[doc.id];
                  return (
                    <div
                      key={doc.id}
                      onClick={() => toggleDoc(doc.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                        isChecked
                          ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-indigo-300'
                      }`}
                    >
                      <button
                        type="button"
                        className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0"
                        aria-label="Cocher le document"
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-300" />
                        )}
                      </button>

                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-xs font-bold leading-tight ${
                              isChecked ? 'text-emerald-950 line-through' : 'text-slate-900'
                            }`}
                          >
                            {doc.label}
                          </h4>
                          <span
                            className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                              doc.mandatory
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {doc.mandatory ? 'Obligatoire' : 'Facultatif'}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {doc.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-mono">
                            {doc.format}
                          </span>
                          {doc.validityNotice && (
                            <span className="text-amber-700 font-medium">
                              ⚠️ {doc.validityNotice}
                            </span>
                          )}
                        </div>

                        {/* Anti-Rejection Tip */}
                        {doc.tipAntiRejet && (
                          <div className="mt-2 p-2 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <span>
                              <strong>Astuce Anti-Rejet :</strong> {doc.tipAntiRejet}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Completion feedback banner */}
              {docStats.isMandatoryComplete && (
                <div className="p-3.5 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Bravo ! Toutes les pièces obligatoires sont prêtes. Vous pouvez maintenant vous connecter en toute sérénité.
                  </span>
                </div>
              )}
            </div>

            {/* ============================================================== */}
            {/* SECTION B : LA FEUILLE DE ROUTE EN 4 ÉTAPES CHRONOLOGIQUES       */}
            {/* ============================================================== */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif-title flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Feuille de route en 4 étapes chronologiques</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Suivez cet ordre précis pour naviguer sur le site officiel sans vous perdre dans les menus.
                </p>
              </div>

              <div className="space-y-3">
                {selectedGuide.fourStepsRoadmap.map((step: RoadmapStep) => {
                  const isExpanded = expandedStep === step.stepNumber;
                  return (
                    <div
                      key={step.stepNumber}
                      className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
                    >
                      {/* Step Header */}
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.stepNumber)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left bg-slate-50/50 hover:bg-slate-100/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                            {step.stepNumber}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-black text-slate-900">
                              {step.title}
                            </h4>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {step.objective}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-slate-400">
                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {/* Step Content */}
                      {isExpanded && (
                        <div className="p-4 sm:p-6 space-y-4 border-t border-slate-200 bg-white animate-in slide-in-from-top-1 duration-150">
                          {/* Objective */}
                          <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-950">
                            <strong>Objectif :</strong> {step.objective}
                          </div>

                          {/* Chronological Actions */}
                          <div className="space-y-2">
                            <strong className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                              Actions à accomplir :
                            </strong>
                            <ol className="space-y-2 text-xs text-slate-800">
                              {step.actions.map((action: string, idx: number) => {
                                const actionKey = `${selectedGuide.id}_step${step.stepNumber}_action${idx}`;
                                const isDone = !!checkedStepActions[actionKey];
                                return (
                                  <li
                                    key={idx}
                                    onClick={() => toggleStepAction(actionKey)}
                                    className={`p-2.5 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                                      isDone
                                        ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                                        : 'bg-white border-slate-200 hover:border-slate-300'
                                    }`}
                                  >
                                    <span className="mt-0.5">
                                      {isDone ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                      ) : (
                                        <Square className="w-4 h-4 text-slate-300 shrink-0" />
                                      )}
                                    </span>
                                    <span className="leading-relaxed">{action}</span>
                                  </li>
                                );
                              })}
                            </ol>
                          </div>

                          {/* Anti-Trap Alert for this step */}
                          {step.antiTrapAlert && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                              <div className="space-y-0.5">
                                <strong className="font-bold text-rose-900 text-[11px] uppercase">
                                  Piège fréquent à cette étape :
                                </strong>
                                <p className="leading-relaxed">{step.antiTrapAlert}</p>
                              </div>
                            </div>
                          )}

                          {/* Step Checklist */}
                          {step.checklist && step.checklist.length > 0 && (
                            <div className="pt-2">
                              <span className="text-[11px] font-bold uppercase text-slate-400 block mb-1.5">
                                Points de contrôle avant de passer à l'étape suivante :
                              </span>
                              <div className="flex flex-wrap gap-2">
                                {step.checklist.map((item: string, i: number) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-indigo-600" />
                                    <span>{item}</span>
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ============================================================== */}
            {/* SECTION C : MOTIFS FRÉQUENTS DE REJET & SOLUTIONS               */}
            {/* ============================================================== */}
            {selectedGuide.commonRejectionReasons && selectedGuide.commonRejectionReasons.length > 0 && (
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <h3 className="text-base sm:text-lg font-black text-slate-900 font-serif-title flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span>Motifs fréquents de rejet par les agents instructeurs</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Ces erreurs retardent 80 % des dossiers de plusieurs semaines. Voici comment les désamorcer :
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedGuide.commonRejectionReasons.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-2 text-xs"
                    >
                      <div className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                          !
                        </span>
                        <strong className="font-bold text-amber-950 leading-snug">
                          {item.reason}
                        </strong>
                      </div>
                      <div className="pl-7 text-slate-700 leading-relaxed bg-white/70 p-2.5 rounded-xl border border-amber-200/50">
                        <strong className="text-emerald-800 font-bold">Solution : </strong>
                        {item.solution}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ============================================================== */}
            {/* SECTION D : PASSERELLE PLUMECITOYENNE & AIDE HUMAINE           */}
            {/* ============================================================== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
              {/* PlumeCitoyenne bridge */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                      ✍️
                    </div>
                    <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                      Besoin d'un courrier d'accompagnement ?
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Si votre situation requiert une lettre explicative sur l'honneur ou un recours préalable, rédigez-la avec <strong>PlumeCitoyenne</strong>.
                  </p>
                </div>

                <button
                  onClick={() => {
                    if (onNavigateToPlumeWithPrompt) {
                      onNavigateToPlumeWithPrompt(
                        `Je dois effectuer la démarche "${selectedGuide.title}" auprès de ${selectedGuide.administration}. Rédige un courrier officiel d'accompagnement ou de demande explicative avec les mentions légales adaptées.`
                      );
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Rédiger avec PlumeCitoyenne</span>
                </button>
              </div>

              {/* France Services physical support */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                      🇫🇷
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Besoin d'une aide humaine gratuite ?
                    </h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Les 2 600 espaces <strong>France Services</strong> vous accueillent gratuitement pour faire la démarche avec un conseiller à moins de 20 minutes de chez vous.
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedGuide.helplinePhone || '3939 (Allô Service Public)'}</span>
                  </span>
                  <a
                    href="https://www.france-services.gouv.fr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 text-[11px]"
                  >
                    <MapPin className="w-3 h-3" />
                    <span>Trouver mon point</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
