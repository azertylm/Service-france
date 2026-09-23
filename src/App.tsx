import React, { useState, useEffect } from 'react';
import { Header, MainService, ClairContratTab } from './components/Header';
import { ConfidentialityBanner } from './components/ConfidentialityBanner';
import { DocumentUploader } from './components/DocumentUploader';
import { AnalysisView } from './components/AnalysisView';
import { NoticeSimulator } from './components/NoticeSimulator';
import { RightsGuide } from './components/RightsGuide';
import { HistoryView } from './components/HistoryView';
import { SamplesView } from './components/SamplesView';
import { ServiceFranceHome } from './components/ServiceFranceHome';
import { PatrimoineHub } from './components/patrimoine/PatrimoineHub';
import { PlumeHub } from './components/plume/PlumeHub';
import { MemoSanteHub } from './components/memosante/MemoSanteHub';
import { DroitsSociauxHub } from './components/droits/DroitsSociauxHub';
import { EmergencyHub } from './components/emergency/EmergencyHub';
import { ScanGarantieHub } from './components/garantie/ScanGarantieHub';
import { TuteurHub } from './components/tuteur/TuteurHub';
import { ResilExpressHub } from './components/resiliation/ResilExpressHub';
import { EtatDesLieuxHub } from './components/etatdeslieux/EtatDesLieuxHub';
import { AutoBailleurHub } from './components/autobailleur/AutoBailleurHub';
import { VigilanceSuccessionHub } from './components/succession/VigilanceSuccessionHub';
import { ZeroKnowledgeModal } from './components/security/ZeroKnowledgeModal';
import { AdministrativeKeychainModal } from './components/security/AdministrativeKeychainModal';
import { ContractAnalysis, SavedContract, SampleContract } from './types/contract';
import { Scale, Compass, PenTool, AlertCircle, RefreshCw, ShieldCheck, Coins, HeartPulse, FileX, ShieldAlert } from 'lucide-react';

const STORAGE_KEY_CONTRACTS = 'claircontrat_saved_history_v1';
const STORAGE_KEY_SERVICE = 'service_france_active_service_v1';

export default function App() {
  const [currentService, setCurrentService] = useState<MainService>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICE);
      if (
        saved === 'claircontrat' ||
        saved === 'resiliation' ||
        saved === 'etatdeslieux' ||
        saved === 'autobailleur' ||
        saved === 'succession' ||
        saved === 'tuteur' ||
        saved === 'droits' ||
        saved === 'garantie' ||
        saved === 'patrimoine' ||
        saved === 'plume' ||
        saved === 'memosante' ||
        saved === 'urgence' ||
        saved === 'accueil'
      ) {
        return saved as MainService;
      }
    } catch (e) {
      console.warn(e);
    }
    return 'accueil';
  });

  const [clairTab, setClairTab] = useState<ClairContratTab>('analyzer');
  const [currentAnalysis, setCurrentAnalysis] = useState<ContractAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Plume prefill bridge from other services (e.g., Droits Sociaux)
  const [plumePrefill, setPlumePrefill] = useState<{
    prompt: string;
    category?: any;
  } | null>(null);

  // Security modals state
  const [isZeroKnowledgeOpen, setIsZeroKnowledgeOpen] = useState(false);
  const [isKeychainOpen, setIsKeychainOpen] = useState(false);

  // Saved contracts in localStorage
  const [savedContracts, setSavedContracts] = useState<SavedContract[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CONTRACTS);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SERVICE, currentService);
    } catch (e) {
      console.warn(e);
    }
  }, [currentService]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONTRACTS, JSON.stringify(savedContracts));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }, [savedContracts]);

  // Execute Analysis via Server-Side API
  const handleAnalyze = async (payload: {
    text?: string;
    file?: { data: string; mimeType: string; name: string };
    contractTypeHint?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/analyze-contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Une erreur est survenue lors de l'analyse du document.");
      }

      setCurrentAnalysis(data.analysis);
      setClairTab('analyzer');
      setCurrentService('claircontrat');
    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(
        err.message || "Erreur de connexion avec le serveur d'analyse. Veuillez réessayer."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sample: SampleContract) => {
    handleAnalyze({
      text: sample.text,
      contractTypeHint: sample.category,
    });
  };

  const handleSaveToHistory = () => {
    if (!currentAnalysis) return;

    const exists = savedContracts.some(
      (c) => c.title === currentAnalysis.contractTitle && c.timestamp > Date.now() - 60000
    );

    if (!exists) {
      const newItem: SavedContract = {
        id: `contract_${Date.now()}`,
        timestamp: Date.now(),
        title: currentAnalysis.contractTitle,
        type: currentAnalysis.contractType,
        riskLevel: currentAnalysis.riskLevel,
        analysis: currentAnalysis,
      };
      setSavedContracts((prev) => [newItem, ...prev]);
    }
  };

  const isCurrentSaved =
    !!currentAnalysis &&
    savedContracts.some((c) => c.analysis.contractTitle === currentAnalysis.contractTitle);

  const handleDeleteSaved = (id: string) => {
    setSavedContracts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleClearAllHistory = () => {
    if (window.confirm("Êtes-vous sûr de vouloir effacer l'intégralité de votre historique ?")) {
      setSavedContracts([]);
    }
  };

  const handleSelectSaved = (saved: SavedContract) => {
    setCurrentAnalysis(saved.analysis);
    setClairTab('analyzer');
  };

  const handleNewAnalysis = () => {
    setCurrentAnalysis(null);
    setErrorMessage(null);
    setClairTab('analyzer');
    setCurrentService('claircontrat');
  };

  const handleNavigateToPlumeWithPrompt = (prompt: string, category: string) => {
    setPlumePrefill({ prompt, category: category as any });
    setCurrentService('plume');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-amber-200">
      {/* Top Header */}
      <Header
        currentService={currentService}
        setCurrentService={setCurrentService}
        clairTab={clairTab}
        setClairTab={setClairTab}
        onNewAnalysis={handleNewAnalysis}
        savedContractsCount={savedContracts.length}
        onOpenZeroKnowledge={() => setIsZeroKnowledgeOpen(true)}
        onOpenKeychain={() => setIsKeychainOpen(true)}
      />

      {/* Show confidentiality banner only when in ClairContrat */}
      {currentService === 'claircontrat' && <ConfidentialityBanner />}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* VIEW 1: Service France Home / Portal */}
        {currentService === 'accueil' && (
          <ServiceFranceHome
            onSelectService={(srv) => setCurrentService(srv)}
            onOpenZeroKnowledge={() => setIsZeroKnowledgeOpen(true)}
            onOpenKeychain={() => setIsKeychainOpen(true)}
          />
        )}

        {/* VIEW 2: Décodeur de Droits Sociaux */}
        {currentService === 'droits' && (
          <DroitsSociauxHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: Résil-Express */}
        {currentService === 'resiliation' && (
          <ResilExpressHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: ÉtatDesLieux Protect */}
        {currentService === 'etatdeslieux' && (
          <EtatDesLieuxHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: AutoBailleur */}
        {currentService === 'autobailleur' && (
          <AutoBailleurHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: Vigilance Succession */}
        {currentService === 'succession' && (
          <VigilanceSuccessionHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: Tuteur Numérique */}
        {currentService === 'tuteur' && (
          <TuteurHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW: ScanGarantie */}
        {currentService === 'garantie' && (
          <ScanGarantieHub onNavigateToPlumeWithPrompt={handleNavigateToPlumeWithPrompt} />
        )}

        {/* VIEW 3: Patrimoine en Poche */}
        {currentService === 'patrimoine' && <PatrimoineHub />}

        {/* VIEW 4: PlumeCitoyenne */}
        {currentService === 'plume' && (
          <PlumeHub
            initialPrompt={plumePrefill?.prompt}
            initialCategory={plumePrefill?.category}
          />
        )}

        {/* VIEW 5: MémoSanté */}
        {currentService === 'memosante' && <MemoSanteHub />}

        {/* VIEW 6: Balise 114 & Urgence */}
        {currentService === 'urgence' && (
          <EmergencyHub onBackToPortal={() => setCurrentService('accueil')} />
        )}

        {/* VIEW 7: ClairContrat */}
        {currentService === 'claircontrat' && (
          <div className="space-y-6">
            {/* Error notification */}
            {errorMessage && (
              <div className="max-w-3xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-rose-950">Erreur lors de l'analyse</h4>
                  <p className="mt-0.5 text-rose-800 leading-relaxed">{errorMessage}</p>
                </div>
                <button
                  onClick={() => setErrorMessage(null)}
                  className="text-rose-500 hover:text-rose-800 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Loading banner */}
            {isLoading && (
              <div className="max-w-3xl mx-auto bg-white border border-slate-200 rounded-xl p-8 text-center shadow-xs space-y-3">
                <RefreshCw className="w-8 h-8 text-slate-900 animate-spin mx-auto" />
                <h3 className="text-base font-semibold text-slate-900">
                  ClairContrat décode votre document...
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Examen des clauses en regard de la législation française (Loi du 6 juillet 1989,
                  Code de la consommation, Code civil). Détection des pièges et des pénalités
                  cachées en cours.
                </p>
              </div>
            )}

            {/* Sub-Tabs of ClairContrat */}
            {clairTab === 'analyzer' && (
              <>
                {currentAnalysis ? (
                  <AnalysisView
                    analysis={currentAnalysis}
                    onReset={handleNewAnalysis}
                    onSaveToHistory={handleSaveToHistory}
                    isSaved={isCurrentSaved}
                  />
                ) : (
                  <DocumentUploader
                    onAnalyze={handleAnalyze}
                    isLoading={isLoading}
                    onSelectSample={handleSelectSample}
                  />
                )}
              </>
            )}

            {clairTab === 'samples' && (
              <SamplesView
                onAnalyzeSample={(sample) => {
                  handleSelectSample(sample);
                }}
                isLoading={isLoading}
              />
            )}

            {clairTab === 'simulator' && <NoticeSimulator />}

            {clairTab === 'rights' && <RightsGuide />}

            {clairTab === 'history' && (
              <HistoryView
                savedContracts={savedContracts}
                onSelectContract={handleSelectSaved}
                onDeleteContract={handleDeleteSaved}
                onClearAll={handleClearAllHistory}
              />
            )}
          </div>
        )}
      </main>

      {/* Global Service France Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="flex h-3 w-4 rounded-xs overflow-hidden border border-slate-300">
                <span className="w-1.5 bg-[#002654]" />
                <span className="w-1 bg-white" />
                <span className="w-1.5 bg-[#CE1126]" />
              </span>
              <span className="font-bold text-slate-900 text-sm">Service France</span>
              <span className="text-slate-300">·</span>
              <span className="text-slate-600 font-medium">
                Le portail citoyen d'utilité publique
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Composé de <strong>ClairContrat</strong> (décodeur juridique),{' '}
              <strong>Patrimoine en Poche</strong> (guide architectural sans publicité),{' '}
              <strong>PlumeCitoyenne</strong> (écrivain public administratif) et{' '}
              <strong>MémoSanté</strong> (carnet médical familial 100 % privé).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600">
            <button
              onClick={() => setCurrentService('accueil')}
              className="hover:text-slate-900 transition-colors"
            >
              Accueil du portail
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setCurrentService('claircontrat');
                setClairTab('analyzer');
              }}
              className="hover:text-slate-900 transition-colors"
            >
              ClairContrat
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('resiliation')}
              className="hover:text-slate-900 transition-colors"
            >
              Résil-Express
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('etatdeslieux')}
              className="hover:text-slate-900 transition-colors"
            >
              ÉtatDesLieux Protect
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('autobailleur')}
              className="hover:text-slate-900 transition-colors font-medium text-emerald-800"
            >
              AutoBailleur
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('succession')}
              className="hover:text-slate-900 transition-colors font-medium text-stone-700"
            >
              Vigilance Succession
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('tuteur')}
              className="hover:text-slate-900 transition-colors"
            >
              Tuteur Numérique
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('garantie')}
              className="hover:text-slate-900 transition-colors"
            >
              ScanGarantie
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('droits')}
              className="hover:text-slate-900 transition-colors"
            >
              Décodeur de Droits
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('patrimoine')}
              className="hover:text-slate-900 transition-colors"
            >
              Patrimoine en Poche
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('plume')}
              className="hover:text-slate-900 transition-colors"
            >
              PlumeCitoyenne
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('memosante')}
              className="hover:text-slate-900 transition-colors"
            >
              MémoSanté
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setCurrentService('urgence')}
              className="text-rose-600 hover:text-rose-800 font-bold transition-colors"
            >
              🚨 Balise 114 / Urgences
            </button>
          </div>

          <div className="text-center md:text-right max-w-sm text-[10px] text-slate-400 leading-relaxed">
            <strong>France Service</strong> · Conçue et éditée par ALPHABETTE SASU (fondée par Valentin RICHAUD à La Grande-Motte). Respect strict de la souveraineté citoyenne et architecture zéro connaissance.
          </div>
        </div>
      </footer>

      {/* Zero Knowledge & E2EE Sync Modal */}
      <ZeroKnowledgeModal
        isOpen={isZeroKnowledgeOpen}
        onClose={() => setIsZeroKnowledgeOpen(false)}
        profiles={[
          { id: 'prof_parent1', name: 'Valentin (Parent)', relationship: 'Parent' },
          { id: 'prof_enfant1', name: 'Léo (Enfant)', relationship: 'Enfant' },
          { id: 'prof_aine1', name: 'Mamie Colette (Aînée)', relationship: 'Aîné' },
        ]}
        currentProfileId="prof_parent1"
        onSwitchProfile={() => {}}
      />

      {/* Administrative Keychain Modal */}
      <AdministrativeKeychainModal
        isOpen={isKeychainOpen}
        onClose={() => setIsKeychainOpen(false)}
      />
    </div>
  );
}
