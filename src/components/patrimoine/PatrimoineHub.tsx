import React, { useState, useEffect } from 'react';
import {
  Compass,
  MapPin,
  Clock,
  Sparkles,
  Award,
  Search,
  BookOpen,
  Filter,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Share2,
  Camera,
  Info,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { ArchitecturalSite, CircuitTheme, CommuneTag, ExplorerProgress } from '../../types/patrimoine';
import { SITES_DATA, CIRCUITS_DATA } from '../../data/patrimoineData';
import { SiteDetailModal } from './SiteDetailModal';
import { CircuitViewer } from './CircuitViewer';
import { ArchitectureScanner } from './ArchitectureScanner';
import { TourismExportModal } from './TourismExportModal';

const STORAGE_KEY = 'service_france_patrimoine_progress';

export const PatrimoineHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'circuits' | 'sites' | 'scanner' | 'carnet' | 'charte'>('circuits');
  const [selectedSite, setSelectedSite] = useState<ArchitecturalSite | null>(null);
  const [activeCircuit, setActiveCircuit] = useState<CircuitTheme | null>(null);
  const [printableCircuit, setPrintableCircuit] = useState<CircuitTheme | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommune, setSelectedCommune] = useState<CommuneTag | 'Toutes'>('Toutes');

  // Gamification progress saved locally
  const [progress, setProgress] = useState<ExplorerProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      visitedSiteIds: [],
      completedQuizIds: {},
      unlockedBadgeIds: [],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.warn(e);
    }
  }, [progress]);

  const handleQuizCompleted = (siteId: string, score: number) => {
    const site = SITES_DATA.find((s) => s.id === siteId);
    setProgress((prev) => {
      const newCompleted = { ...prev.completedQuizIds, [siteId]: score };
      const newBadges = [...prev.unlockedBadgeIds];
      if (site && !newBadges.includes(site.badgeToUnlock.id)) {
        newBadges.push(site.badgeToUnlock.id);
      }
      return {
        ...prev,
        completedQuizIds: newCompleted,
        unlockedBadgeIds: newBadges,
      };
    });
  };

  // Filtered sites
  const filteredSites = SITES_DATA.filter((site) => {
    const matchesCommune = selectedCommune === 'Toutes' || site.commune === selectedCommune;
    const matchesQuery =
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.architect.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.shortTagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCommune && matchesQuery;
  });

  const totalBadgesCount = SITES_DATA.length;
  const unlockedCount = progress.unlockedBadgeIds.length;

  return (
    <div className="space-y-6">
      {/* Hero Banner for Patrimoine en Poche */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 px-2.5 py-1 rounded border border-amber-700/60">
                Guide culturel & architectural interactif
              </span>
              <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% indépendant • Zéro pub sponsorisée
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Patrimoine en Poche
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explorez le patrimoine bâti remarquable, du <strong>modernisme visionnaire de La Grande-Motte</strong> aux
              remparts médiévaux d’<strong>Aigues-Mortes</strong>, en passant par le phare de l’Espiguette et les audaces d’Antigone.
              Parcours géolocalisés respectueux de votre batterie et quiz d’observation sans traçage.
            </p>
          </div>

          {/* Quick Explorer score widget */}
          <div className="bg-slate-950/60 backdrop-blur-sm border border-slate-800 p-4 rounded-xl shrink-0 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-2xl">
              🏛️
            </div>
            <div>
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider block">
                Carnet d'explorateur
              </span>
              <div className="text-lg font-black text-white">
                {unlockedCount} / {totalBadgesCount} badges
              </div>
              <span className="text-[11px] text-amber-300">
                {unlockedCount === 0
                  ? 'Faites votre premier pas !'
                  : unlockedCount === totalBadgesCount
                  ? 'Grand Maître du Patrimoine'
                  : 'Arpenteur citoyen en cours'}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap items-center gap-1.5 pt-6 mt-6 border-t border-slate-700/80 text-xs font-semibold">
          <button
            onClick={() => {
              setActiveCircuit(null);
              setActiveTab('circuits');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'circuits'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>Parcours thématiques ({CIRCUITS_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCircuit(null);
              setActiveTab('sites');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'sites'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Tous les édifices ({SITES_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveCircuit(null);
              setActiveTab('scanner');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'scanner'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Décrypteur d'édifice IA</span>
          </button>

          <button
            onClick={() => {
              setActiveCircuit(null);
              setActiveTab('carnet');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'carnet'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Quiz & Badges ({unlockedCount})</span>
          </button>

          <button
            onClick={() => {
              setActiveCircuit(null);
              setActiveTab('charte');
            }}
            className={`px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${
              activeTab === 'charte'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Kit Offices de Tourisme</span>
          </button>
        </div>
      </div>

      {/* Main View Switcher */}
      {activeCircuit ? (
        <CircuitViewer
          circuit={activeCircuit}
          onBack={() => setActiveCircuit(null)}
          onSelectSite={(site) => setSelectedSite(site)}
          progress={progress}
          onOpenPrintModal={(circ) => setPrintableCircuit(circ)}
        />
      ) : activeTab === 'circuits' ? (
        /* CIRCUITS LIST */
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Parcours découverte thématiques
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Sélectionnez un circuit pour débuter votre balade architecturale respectueuse de la batterie.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ⚡ 0% géolocalisation en arrière-plan
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CIRCUITS_DATA.map((circuit) => (
              <div
                key={circuit.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-amber-500 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                      {circuit.commune}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">{circuit.transportMode}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                      {circuit.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 italic">{circuit.subtitle}</p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {circuit.description}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-500 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                      {circuit.duration}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                      {circuit.distanceKm} km
                    </span>
                    <span className="text-slate-500">{circuit.siteIds.length} étapes</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setPrintableCircuit(circuit)}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium py-1 px-2"
                  >
                    Fiche papier
                  </button>
                  <button
                    onClick={() => setActiveCircuit(circuit)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>Lancer le parcours</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === 'sites' ? (
        /* ALL SITES DIRECTORY */
        <div className="space-y-5">
          {/* Search & Commune filter bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un édifice, architecte, motif..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Commune Filter Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {(
                [
                  'Toutes',
                  'La Grande-Motte',
                  'Aigues-Mortes',
                  'Le Grau-du-Roi',
                  'Carnon & Mauguio',
                  'Montpellier & Littoral',
                ] as const
              ).map((commune) => (
                <button
                  key={commune}
                  onClick={() => setSelectedCommune(commune)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    selectedCommune === commune
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {commune}
                </button>
              ))}
            </div>
          </div>

          {/* Sites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSites.map((site) => {
              const isQuizDone = progress.completedQuizIds[site.id] !== undefined;

              return (
                <div
                  key={site.id}
                  onClick={() => setSelectedSite(site)}
                  className="bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {site.commune}
                      </span>
                      {isQuizDone && (
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Validé
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug">{site.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 italic">« {site.shortTagline} »</p>

                    <div className="text-xs text-slate-500 pt-1">
                      <span>{site.style}</span> • <span>{site.yearBuilt}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px] truncate max-w-[180px]">
                      {site.architect}
                    </span>
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      Découvrir <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredSites.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
              <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun édifice ne correspond à votre recherche.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCommune('Toutes');
                }}
                className="mt-3 text-xs text-amber-700 hover:underline font-medium"
              >
                Réinitialiser les filtres
              </button>
            </div>
          )}
        </div>
      ) : activeTab === 'scanner' ? (
        /* AI ARCHITECTURE SCANNER */
        <ArchitectureScanner onSiteSelected={(siteId) => {
          const s = SITES_DATA.find((x) => x.id === siteId);
          if (s) setSelectedSite(s);
        }} />
      ) : activeTab === 'carnet' ? (
        /* QUIZ & BADGES SUMMARY */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Votre carnet d'explorateur citoyen
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Chaque énigme de terrain résolue débloque un badge patrimonial symbolique et consolide votre compréhension du bâti remarquable.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {SITES_DATA.map((site) => {
                const isUnlocked = progress.unlockedBadgeIds.includes(site.badgeToUnlock.id);

                return (
                  <div
                    key={site.id}
                    className={`rounded-xl border p-4 transition-all flex items-start gap-3.5 ${
                      isUnlocked
                        ? 'bg-amber-50/60 border-amber-300 text-slate-900 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 ${
                        isUnlocked ? 'bg-amber-100 shadow-inner' : 'bg-slate-200 grayscale'
                      }`}
                    >
                      {site.badgeToUnlock.icon}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <strong className="text-xs sm:text-sm text-slate-900">
                          {site.badgeToUnlock.name}
                        </strong>
                        {isUnlocked && (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                            Débloqué
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {site.badgeToUnlock.description}
                      </p>
                      <button
                        onClick={() => setSelectedSite(site)}
                        className="text-[11px] text-amber-700 hover:underline font-medium block pt-1"
                      >
                        {isUnlocked ? 'Revoir la fiche' : 'Tenter le quiz sur place'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* CHARTE & KIT OFFICE DE TOURISME */
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-1">
                Engagement de service public
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                La Charte Citoyenne « 0% Publicité - 100% Culture »
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 space-y-2">
                <span className="text-2xl">🚫</span>
                <h3 className="font-bold text-sm text-amber-950">Aucun restaurant sponsorisé</h3>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Contrairement aux applications touristiques commerciales, aucun établissement ne peut payer pour figurer ici. Seul le patrimoine bâti compte.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 space-y-2">
                <span className="text-2xl">🔋</span>
                <h3 className="font-bold text-sm text-emerald-950">Sobriété & Batterie</h3>
                <p className="text-xs text-emerald-900 leading-relaxed">
                  Aucun traçage permanent de vos déplacements. Le calcul de cap est ponctuel, laissant votre batterie intacte pour photographier les monuments.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-indigo-50/80 border border-indigo-200 space-y-2">
                <span className="text-2xl">🏛️</span>
                <h3 className="font-bold text-sm text-indigo-950">Prêt pour les collectivités</h3>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Outil clé en main pour les offices de tourisme locaux (La Grande-Motte, Pays de l'Or, Terre de Camargue) souhaitant valoriser leur cadre de vie.
                </p>
              </div>
            </div>

            {/* Territorial Partners ready notice */}
            <div className="border-t border-slate-200 pt-6 space-y-3">
              <h3 className="font-bold text-sm text-slate-900 uppercase tracking-wider">
                Déploiement pour votre commune ou office de tourisme
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Ce module est conçu pour être imprimé sous forme de carnet d'exploration A4 ou intégré directement sur les bornes d'information municipales. Vous pouvez imprimer les parcours immédiatement sans coût ni abonnement.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {CIRCUITS_DATA.map((circ) => (
                  <button
                    key={circ.id}
                    onClick={() => setPrintableCircuit(circ)}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
                  >
                    <span>Imprimer {circ.commune} ({circ.title})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Site Detail Modal */}
      {selectedSite && (
        <SiteDetailModal
          site={selectedSite}
          onClose={() => setSelectedSite(null)}
          onQuizCompleted={handleQuizCompleted}
          isQuizCompleted={progress.completedQuizIds[selectedSite.id] !== undefined}
        />
      )}

      {/* Tourism Export / Print Modal */}
      {printableCircuit && (
        <TourismExportModal
          circuit={printableCircuit}
          onClose={() => setPrintableCircuit(null)}
        />
      )}
    </div>
  );
};
