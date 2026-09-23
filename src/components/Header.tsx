import React, { useState } from 'react';
import {
  Scale,
  Compass,
  FileText,
  Calculator,
  History,
  Plus,
  ShieldCheck,
  Building2,
  Camera,
  Award,
  Sparkles,
  LayoutGrid,
  Heart,
  Lock,
  FileKey,
  Coins,
  HeartPulse,
  PhoneCall,
  Menu,
  X,
  ChevronRight,
  Shield,
  EyeOff,
  FileX,
  ShieldAlert,
} from 'lucide-react';

export type MainService =
  | 'accueil'
  | 'claircontrat'
  | 'resiliation'
  | 'etatdeslieux'
  | 'autobailleur'
  | 'succession'
  | 'tuteur'
  | 'droits'
  | 'garantie'
  | 'patrimoine'
  | 'plume'
  | 'memosante'
  | 'urgence';
export type ClairContratTab = 'analyzer' | 'samples' | 'simulator' | 'rights' | 'history';

interface HeaderProps {
  currentService: MainService;
  setCurrentService: (service: MainService) => void;
  // ClairContrat sub-navigation
  clairTab: ClairContratTab;
  setClairTab: (tab: ClairContratTab) => void;
  onNewAnalysis: () => void;
  savedContractsCount: number;
  onOpenZeroKnowledge: () => void;
  onOpenKeychain: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentService,
  setCurrentService,
  clairTab,
  setClairTab,
  onNewAnalysis,
  savedContractsCount,
  onOpenZeroKnowledge,
  onOpenKeychain,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectService = (service: MainService) => {
    setCurrentService(service);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. Top Republic Utility Bar */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            {/* French Republic Tricolor Flag */}
            <div className="flex h-3.5 w-5 sm:h-4 sm:w-6 rounded-xs overflow-hidden shadow-xs border border-white/20 shrink-0">
              <div className="w-1/3 bg-[#002654]" />
              <div className="w-1/3 bg-white" />
              <div className="w-1/3 bg-[#CE1126]" />
            </div>
            <button
              onClick={() => handleSelectService('accueil')}
              className="font-black tracking-wider uppercase text-slate-100 text-[11px] sm:text-xs hover:text-white transition-colors truncate"
            >
              France Service
            </button>
            <span className="text-slate-600 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline text-[11px] truncate">
              ALPHABETTE SASU · La Grande-Motte
            </span>
          </div>

          {/* Right Controls: Desktop vs Mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Urgence 114 Direct Alert (Visible on all screens) */}
            <button
              onClick={() => handleSelectService('urgence')}
              className={`text-[11px] font-bold px-2 py-1 rounded-md transition-all flex items-center gap-1 shadow-xs active:scale-95 ${
                currentService === 'urgence'
                  ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
              title="Numéros d'urgence (15, 17, 18, 3919, 114) et premiers secours hors-ligne"
            >
              <HeartPulse className="w-3.5 h-3.5 fill-white" />
              <span className="font-extrabold">🚨 Urgence 114</span>
            </button>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center gap-1.5">
              {/* Zero-Knowledge modal button */}
              <button
                onClick={onOpenZeroKnowledge}
                className="text-[11px] text-emerald-400 bg-emerald-950/80 hover:bg-emerald-900/80 px-2 py-1 rounded border border-emerald-800/80 flex items-center gap-1 transition-all"
                title="Garantie de non-accès et synchronisation chiffrée E2EE"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zéro Connaissance</span>
              </button>

              {/* Trousseau Administratif */}
              <button
                onClick={onOpenKeychain}
                className="text-[11px] text-amber-300 bg-amber-950/80 hover:bg-amber-900/80 px-2 py-1 rounded border border-amber-800/80 flex items-center gap-1 transition-all"
                title="Trousseau d'identité administrative locale"
              >
                <FileKey className="w-3.5 h-3.5 text-amber-400" />
                <span>Trousseau Local</span>
              </button>

              {/* Quick switcher buttons (desktop only) */}
              <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700 ml-1">
                <button
                  onClick={() => handleSelectService('accueil')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all ${
                    currentService === 'accueil'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Portail
                </button>
                <button
                  onClick={() => handleSelectService('claircontrat')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'claircontrat'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>⚖️ ClairContrat</span>
                </button>
                <button
                  onClick={() => handleSelectService('resiliation')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'resiliation'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>✂️ Résil-Express</span>
                </button>
                <button
                  onClick={() => handleSelectService('etatdeslieux')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'etatdeslieux'
                      ? 'bg-sky-500 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🏠 ÉtatDesLieux</span>
                </button>
                <button
                  onClick={() => handleSelectService('autobailleur')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'autobailleur'
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🔑 AutoBailleur</span>
                </button>
                <button
                  onClick={() => handleSelectService('succession')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'succession'
                      ? 'bg-stone-500 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🕊️ Succession</span>
                </button>
                <button
                  onClick={() => handleSelectService('tuteur')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'tuteur'
                      ? 'bg-indigo-500 text-white font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🧭 Tuteur</span>
                </button>
                <button
                  onClick={() => handleSelectService('garantie')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'garantie'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🛡️ ScanGarantie</span>
                </button>
                <button
                  onClick={() => handleSelectService('droits')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'droits'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>💰 Droits</span>
                </button>
                <button
                  onClick={() => handleSelectService('memosante')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'memosante'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🩺 Santé</span>
                </button>
                <button
                  onClick={() => handleSelectService('plume')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'plume'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>✍️ Plume</span>
                </button>
                <button
                  onClick={() => handleSelectService('patrimoine')}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-all flex items-center gap-1 ${
                    currentService === 'patrimoine'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  <span>🏛️ Patrimoine</span>
                </button>
              </div>
            </div>

            {/* Mobile Controls: Trousseau + Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-1">
              <button
                onClick={onOpenKeychain}
                className="p-1.5 text-amber-300 hover:text-white bg-slate-800 rounded-md transition-colors"
                title="Trousseau administratif local"
                aria-label="Trousseau administratif local"
              >
                <FileKey className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-1.5 text-slate-200 hover:text-white bg-slate-800 rounded-md transition-colors"
                aria-label="Menu principal"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mobile Horizontal Swipeable Tabs Bar (prevents any screen blowout on phones) */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-2 py-1.5 flex items-center gap-1 overflow-x-auto text-[11px] scrollbar-none whitespace-nowrap">
        <button
          onClick={() => handleSelectService('accueil')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 ${
            currentService === 'accueil'
              ? 'bg-white text-slate-950'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🇫🇷 Portail
        </button>
        <button
          onClick={() => handleSelectService('urgence')}
          className={`px-2.5 py-1 rounded-md font-bold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'urgence'
              ? 'bg-rose-600 text-white'
              : 'text-rose-300 hover:text-rose-100 bg-rose-950/60 border border-rose-800/40'
          }`}
        >
          🚨 114 Urgence
        </button>
        <button
          onClick={() => handleSelectService('resiliation')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'resiliation'
              ? 'bg-rose-600 text-white font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          ✂️ Résil
        </button>
        <button
          onClick={() => handleSelectService('etatdeslieux')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'etatdeslieux'
              ? 'bg-sky-600 text-white font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🏠 EDL Protect
        </button>
        <button
          onClick={() => handleSelectService('autobailleur')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'autobailleur'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🔑 AutoBailleur
        </button>
        <button
          onClick={() => handleSelectService('succession')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'succession'
              ? 'bg-stone-600 text-white font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🕊️ Succession
        </button>
        <button
          onClick={() => handleSelectService('tuteur')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'tuteur'
              ? 'bg-indigo-600 text-white font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🧭 Tuteur
        </button>
        <button
          onClick={() => handleSelectService('garantie')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'garantie'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🛡️ Garanties
        </button>
        <button
          onClick={() => handleSelectService('droits')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'droits'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          💰 Droits
        </button>
        <button
          onClick={() => handleSelectService('claircontrat')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'claircontrat'
              ? 'bg-amber-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          ⚖️ Contrats
        </button>
        <button
          onClick={() => handleSelectService('memosante')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'memosante'
              ? 'bg-teal-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🩺 Santé
        </button>
        <button
          onClick={() => handleSelectService('plume')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'plume'
              ? 'bg-emerald-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          ✍️ Plume
        </button>
        <button
          onClick={() => handleSelectService('patrimoine')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all shrink-0 flex items-center gap-1 ${
            currentService === 'patrimoine'
              ? 'bg-indigo-500 text-slate-950 font-bold'
              : 'text-slate-300 hover:text-white bg-slate-900/60'
          }`}
        >
          🏛️ Patrimoine
        </button>
      </div>

      {/* 3. Mobile Drawer Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 text-white border-b border-slate-800 p-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Services de France Service
            </span>
            <div className="grid grid-cols-1 gap-1.5 pt-1">
              <button
                onClick={() => handleSelectService('accueil')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'accueil'
                    ? 'bg-white text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <span>🇫🇷 Accueil du Portail</span>
                <ChevronRight className="w-4 h-4 opacity-60" />
              </button>

              <button
                onClick={() => handleSelectService('urgence')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'urgence'
                    ? 'bg-rose-600 text-white'
                    : 'bg-rose-950/70 border border-rose-700/50 text-rose-200 hover:bg-rose-900/80'
                }`}
              >
                <div className="flex items-center gap-2">
                  <HeartPulse className="w-4 h-4 text-rose-400" />
                  <span>🚨 Urgence 114 & Premiers Secours</span>
                </div>
                <span className="text-[10px] bg-rose-500/30 text-rose-300 px-1.5 py-0.5 rounded">
                  24/7 Hors-ligne
                </span>
              </button>

              <button
                onClick={() => handleSelectService('resiliation')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'resiliation'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileX className="w-4 h-4 text-rose-400" />
                  <span>✂️ Résil-Express — Gestionnaire de Désengagement</span>
                </div>
                <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded">
                  Lois Hamon & Chatel
                </span>
              </button>

              <button
                onClick={() => handleSelectService('etatdeslieux')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'etatdeslieux'
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-sky-400" />
                  <span>🏠 ÉtatDesLieux Protect — Bouclier Caution</span>
                </div>
                <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">
                  Vétusté & Décret 2016
                </span>
              </button>

              <button
                onClick={() => handleSelectService('autobailleur')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'autobailleur'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-400" />
                  <span>🔑 AutoBailleur — Gestionnaire Locatif 0%</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                  IRL & Quittances
                </span>
              </button>

              <button
                onClick={() => handleSelectService('succession')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'succession'
                    ? 'bg-stone-700 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-amber-400" />
                  <span>🕊️ Vigilance Succession — Démarches après obsèques</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  48h à 6 mois
                </span>
              </button>

              <button
                onClick={() => handleSelectService('tuteur')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'tuteur'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>🧭 Tuteur Numérique — Démarches Pas-à-Pas</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded">
                  Anti-rejet
                </span>
              </button>

              <button
                onClick={() => handleSelectService('garantie')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'garantie'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>🛡️ ScanGarantie — Tickets & Garanties 2 Ans</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  Anti-effacement
                </span>
              </button>

              <button
                onClick={() => handleSelectService('droits')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'droits'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>💰 Décodeur de Droits Sociaux</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">
                  Anti non-recours
                </span>
              </button>

              <button
                onClick={() => handleSelectService('claircontrat')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'claircontrat'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>⚖️ ClairContrat — Décodeur Juridique</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectService('memosante')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'memosante'
                    ? 'bg-teal-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-teal-400" />
                  <span>🩺 MémoSanté — Carnet Médical Local</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectService('plume')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'plume'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>✍️ PlumeCitoyenne — Écrivain Public</span>
                </div>
              </button>

              <button
                onClick={() => handleSelectService('patrimoine')}
                className={`p-2.5 rounded-xl text-left flex items-center justify-between text-xs font-bold transition-all ${
                  currentService === 'patrimoine'
                    ? 'bg-indigo-500 text-slate-950'
                    : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-indigo-400" />
                  <span>🏛️ Patrimoine en Poche</span>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenKeychain();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <FileKey className="w-4 h-4 text-amber-400" />
              <span>Trousseau</span>
            </button>

            <button
              onClick={() => {
                onOpenZeroKnowledge();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-700"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zéro Données</span>
            </button>
          </div>
        </div>
      )}

      {/* 4. Service-Specific Main Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          {/* Brand block based on current active service (with min-w-0 to avoid crushing) */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            {currentService === 'claircontrat' ? (
              <button
                onClick={() => setClairTab('analyzer')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Scale className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      ClairContrat
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                      Droit
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Le décodeur juridique du quotidien
                  </span>
                </div>
              </button>
            ) : currentService === 'patrimoine' ? (
              <button
                onClick={() => handleSelectService('patrimoine')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Patrimoine en Poche
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                      Culture
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Guide architectural & historique sans publicité
                  </span>
                </div>
              </button>
            ) : currentService === 'plume' ? (
              <button
                onClick={() => handleSelectService('plume')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      PlumeCitoyenne
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded shrink-0">
                      Social
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    L'écrivain public administratif citoyen
                  </span>
                </div>
              </button>
            ) : currentService === 'memosante' ? (
              <button
                onClick={() => handleSelectService('memosante')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      MémoSanté
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-teal-800 bg-teal-100 px-1.5 py-0.5 rounded shrink-0">
                      Santé 100% Privée
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Carnet familial souverain & décrypteur d'analyses
                  </span>
                </div>
              </button>
            ) : currentService === 'resiliation' ? (
              <button
                onClick={() => handleSelectService('resiliation')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <FileX className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Résil-Express
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                      Désengagement
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Générateur officiel de LRAR & lois françaises de résiliation immédiate
                  </span>
                </div>
              </button>
            ) : currentService === 'etatdeslieux' ? (
              <button
                onClick={() => handleSelectService('etatdeslieux')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldAlert className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      ÉtatDesLieux Protect
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-sky-800 bg-sky-100 px-1.5 py-0.5 rounded shrink-0">
                      Bouclier Caution
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Photos certifiées, analyse de vétusté IA (Décret 2016) & mise en demeure caution
                  </span>
                </div>
              </button>
            ) : currentService === 'succession' ? (
              <button
                onClick={() => handleSelectService('succession')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-stone-800 text-amber-400 flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400/20" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Vigilance Succession
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-stone-800 bg-stone-200 px-1.5 py-0.5 rounded shrink-0">
                      Après Obsèques
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Parcours chronologique 48h-6 mois, courriers officiels 1-clic & blocage prélèvements indus
                  </span>
                </div>
              </button>
            ) : currentService === 'tuteur' ? (
              <button
                onClick={() => handleSelectService('tuteur')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Tuteur Numérique
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-indigo-800 bg-indigo-100 px-1.5 py-0.5 rounded shrink-0">
                      Feuilles de route
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Guide officiel pas-à-pas pour réussir vos démarches sans rejet
                  </span>
                </div>
              </button>
            ) : currentService === 'garantie' ? (
              <button
                onClick={() => handleSelectService('garantie')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      ScanGarantie
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-800 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                      Garantie 2 ans
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Coffre-fort anti-effacement thermique & mise en demeure SAV
                  </span>
                </div>
              </button>
            ) : currentService === 'droits' ? (
              <button
                onClick={() => handleSelectService('droits')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <Coins className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Décodeur de Droits
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded shrink-0">
                      Aides
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Simulateur local d'aides non-réclamées (Prime, Énergie, CSS)
                  </span>
                </div>
              </button>
            ) : currentService === 'urgence' ? (
              <button
                onClick={() => handleSelectService('urgence')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-bold tracking-tight text-slate-900 font-serif-title truncate">
                      Urgences & Balise 114
                    </span>
                    <span className="text-[9px] sm:text-[10px] uppercase font-bold text-rose-800 bg-rose-100 px-1.5 py-0.5 rounded shrink-0">
                      Hors-Ligne 24/7
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 font-sans truncate">
                    Accès direct 15, 17, 18, 3919, 119, 3018 & gestes qui sauvent
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={() => handleSelectService('accueil')}
                className="flex items-center gap-2 text-left focus:outline-hidden group min-w-0"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs sm:text-sm shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  FS
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-xl font-black tracking-tight text-slate-900 font-serif-title truncate">
                      France Service
                    </span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                      ALPHABETTE SASU
                    </span>
                  </div>
                  <span className="hidden sm:inline-block text-xs text-slate-500 truncate">
                    Suite civique & familiale d'utilité publique · La Grande-Motte
                  </span>
                </div>
              </button>
            )}
          </div>

          {/* Center Navigation if in ClairContrat (Desktop) */}
          {currentService === 'claircontrat' && (
            <nav className="hidden md:flex items-center gap-5 text-xs font-medium text-slate-600">
              <button
                onClick={() => setClairTab('analyzer')}
                className={`transition-colors py-1 ${
                  clairTab === 'analyzer'
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                Analyser un contrat
              </button>
              <button
                onClick={() => setClairTab('samples')}
                className={`transition-colors py-1 ${
                  clairTab === 'samples'
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                Exemples types
              </button>
              <button
                onClick={() => setClairTab('simulator')}
                className={`transition-colors py-1 ${
                  clairTab === 'simulator'
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                Simulateur de préavis
              </button>
              <button
                onClick={() => setClairTab('rights')}
                className={`transition-colors py-1 ${
                  clairTab === 'rights'
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                Vos droits
              </button>
              <button
                onClick={() => setClairTab('history')}
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  clairTab === 'history'
                    ? 'text-slate-950 font-bold border-b-2 border-slate-900'
                    : 'hover:text-slate-900'
                }`}
              >
                <span>Historique</span>
                {savedContractsCount > 0 && (
                  <span className="text-xs font-mono tabular-nums text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                    {savedContractsCount}
                  </span>
                )}
              </button>
            </nav>
          )}

          {/* Right Action Block (Responsive) */}
          <div className="flex items-center gap-2 shrink-0">
            {currentService === 'claircontrat' ? (
              <button
                onClick={onNewAnalysis}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Nouveau document</span>
                <span className="sm:hidden">Analyser</span>
              </button>
            ) : currentService === 'accueil' ? (
              /* On desktop, show quick shortcuts; on mobile, hide them so the logo never gets squished */
              <div className="hidden md:flex items-center gap-1.5">
                <button
                  onClick={() => handleSelectService('claircontrat')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  ⚖️ ClairContrat
                </button>
                <button
                  onClick={() => handleSelectService('patrimoine')}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 transition-colors"
                >
                  🏛️ Patrimoine
                </button>
                <button
                  onClick={() => handleSelectService('plume')}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition-colors"
                >
                  ✍️ Plume
                </button>
                <button
                  onClick={() => handleSelectService('memosante')}
                  className="px-2.5 py-1.5 rounded-lg bg-teal-700 text-white text-xs font-bold hover:bg-teal-600 transition-colors"
                >
                  🩺 MémoSanté
                </button>
              </div>
            ) : currentService === 'urgence' ? (
              <button
                onClick={() => window.location.replace('https://meteofrance.com')}
                className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
                title="Quitter immédiatement cette page (Touche Échap)"
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sortie Rapide</span>
                <span className="sm:hidden">Échap</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Mobile Sub-Navigation for ClairContrat */}
        {currentService === 'claircontrat' && (
          <div className="md:hidden flex items-center justify-between py-2 border-t border-slate-100 text-xs font-medium text-slate-600 overflow-x-auto gap-4 scrollbar-none">
            <button
              onClick={() => setClairTab('analyzer')}
              className={`whitespace-nowrap ${clairTab === 'analyzer' ? 'text-slate-950 font-bold' : ''}`}
            >
              Analyser
            </button>
            <button
              onClick={() => setClairTab('samples')}
              className={`whitespace-nowrap ${clairTab === 'samples' ? 'text-slate-950 font-bold' : ''}`}
            >
              Exemples
            </button>
            <button
              onClick={() => setClairTab('simulator')}
              className={`whitespace-nowrap ${clairTab === 'simulator' ? 'text-slate-950 font-bold' : ''}`}
            >
              Préavis
            </button>
            <button
              onClick={() => setClairTab('rights')}
              className={`whitespace-nowrap ${clairTab === 'rights' ? 'text-slate-950 font-bold' : ''}`}
            >
              Droits
            </button>
            <button
              onClick={() => setClairTab('history')}
              className={`whitespace-nowrap ${clairTab === 'history' ? 'text-slate-950 font-bold' : ''}`}
            >
              Historique ({savedContractsCount})
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
