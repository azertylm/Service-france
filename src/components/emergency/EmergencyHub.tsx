import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall,
  MessageSquareWarning,
  HeartPulse,
  ShieldAlert,
  Flame,
  Globe2,
  HeartHandshake,
  Baby,
  SmartphoneNfc,
  LifeBuoy,
  Anchor,
  Home,
  MapPin,
  Copy,
  Check,
  Search,
  ExternalLink,
  AlertTriangle,
  Radio,
  Printer,
  ChevronDown,
  ChevronUp,
  Volume2,
  VolumeX,
  EyeOff,
  Activity,
  ArrowRight,
  ShieldCheck,
  Navigation,
} from 'lucide-react';
import { EMERGENCY_NUMBERS, FIRST_AID_PROTOCOLS, EmergencyNumber, FirstAidTopic } from '../../data/emergencyData';

interface EmergencyHubProps {
  onBackToPortal?: () => void;
}

export const EmergencyHub: React.FC<EmergencyHubProps> = ({ onBackToPortal }) => {
  const [activeTab, setActiveTab] = useState<'numeros' | 'balise114' | 'secours'>('numeros');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'vital' | 'protection' | 'prevention' | 'social'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProtocolId, setSelectedProtocolId] = useState<string>('arret_cardiaque');

  // Geolocation state for Balise 114
  const [isLocating, setIsLocating] = useState(false);
  const [locationText, setLocationText] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  // SMS 114 Generator State
  const [smsReason, setSmsReason] = useState('Agression / Danger physique');
  const [smsDetails, setSmsDetails] = useState('');
  const [copiedSms, setCopiedSms] = useState(false);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // CPR Metronome State (110 BPM)
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeTick, setMetronomeTick] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Panic button / quick escape
  const handlePanicEscape = () => {
    // Immediate redirect to a neutral weather website to protect user
    window.location.replace('https://meteofrance.com');
  };

  // Keyboard shortcut ESC to trigger Panic Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handlePanicEscape();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Metronome for CPR (110 bpm ~ 545ms)
  useEffect(() => {
    let interval: any = null;
    if (isMetronomeActive) {
      interval = setInterval(() => {
        setMetronomeTick((prev) => !prev);
        // Play short gentle beep if audio is allowed
        try {
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          const ctx = audioContextRef.current;
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          gain.gain.setValueAtTime(0.15, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.09);
        } catch (e) {
          // Silent fallback if audio context blocked
        }
      }, 545);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isMetronomeActive]);

  // Request HTML5 Geolocation
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par cet appareil.');
      return;
    }
    setIsLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const lat = position.coords.latitude.toFixed(5);
        const lon = position.coords.longitude.toFixed(5);
        const acc = Math.round(position.coords.accuracy);
        setLocationText(`GPS: ${lat}, ${lon} (Précision: ~${acc}m)`);
      },
      (err) => {
        setIsLocating(false);
        setLocationError(`Impossible de récupérer la position (${err.message}). Indiquez manuellement votre adresse.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Build SMS 114 body
  const generatedSmsBody = `URGENCE 114 : ${smsReason}. Lieu : ${locationText || '[Indiquez adresse/ville]'}. Détails : ${smsDetails || 'Besoin immédiat de secours'}.`;

  const handleCopySms = () => {
    navigator.clipboard.writeText(generatedSmsBody);
    setCopiedSms(true);
    setTimeout(() => setCopiedSms(false), 2500);
  };

  const handleCopyCoords = () => {
    if (locationText) {
      navigator.clipboard.writeText(locationText);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2500);
    }
  };

  // Filtered numbers
  const filteredNumbers = EMERGENCY_NUMBERS.filter((num) => {
    const matchesCategory = selectedCategory === 'all' || num.category === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      num.number.includes(searchQuery) ||
      num.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      num.whenToCall.some((w) => w.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Filtered protocols
  const filteredProtocols = FIRST_AID_PROTOCOLS.filter((proto) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      proto.title.toLowerCase().includes(q) ||
      proto.subtitle.toLowerCase().includes(q) ||
      proto.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  const selectedProtocol =
    FIRST_AID_PROTOCOLS.find((p) => p.id === selectedProtocolId) || FIRST_AID_PROTOCOLS[0];

  const getNumberIcon = (name: string) => {
    switch (name) {
      case 'MessageSquareWarning':
        return <MessageSquareWarning className="w-5 h-5 text-rose-500" />;
      case 'HeartPulse':
        return <HeartPulse className="w-5 h-5 text-red-500" />;
      case 'ShieldAlert':
        return <ShieldAlert className="w-5 h-5 text-blue-500" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Globe2':
        return <Globe2 className="w-5 h-5 text-indigo-500" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-purple-500" />;
      case 'Baby':
        return <Baby className="w-5 h-5 text-emerald-500" />;
      case 'SmartphoneNfc':
        return <SmartphoneNfc className="w-5 h-5 text-cyan-500" />;
      case 'LifeBuoy':
        return <LifeBuoy className="w-5 h-5 text-teal-500" />;
      case 'Anchor':
        return <Anchor className="w-5 h-5 text-sky-500" />;
      case 'Home':
        return <Home className="w-5 h-5 text-stone-500" />;
      default:
        return <PhoneCall className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Emergency & Discreet Banner */}
      <div className="bg-rose-950 text-white rounded-3xl p-5 sm:p-7 shadow-xl border-2 border-rose-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>Numéros d'Urgence & Balise 114</span>
              <span className="text-white/40">·</span>
              <span className="text-emerald-300 flex items-center gap-1 font-semibold">
                <Check className="w-3 h-3" /> Accessible 100% hors-ligne
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Aide Immédiate, Balise SMS 114 & Premiers Secours
            </h1>

            <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
              En cas de détresse vitale, violences conjugales, accident ou détresse psychologique :
              contactez directement les secours ou suivez le guide des gestes qui sauvent sans connexion internet.
            </p>
          </div>

          {/* Panic / Quick Escape Button */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              onClick={handlePanicEscape}
              className="px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 border border-red-400/40 group"
              title="Quitter immédiatement cette page et masquer l'écran (Touche Échap)"
            >
              <EyeOff className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
              <span>⚡ Sortie Rapide (Échap)</span>
            </button>

            {onBackToPortal && (
              <button
                onClick={onBackToPortal}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-rose-200 hover:text-white text-xs font-semibold rounded-xl transition-colors text-center"
              >
                ← Retour au portail France Service
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl">
          <button
            onClick={() => setActiveTab('numeros')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'numeros'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-rose-400" />
            <span>Tous les numéros d'urgence ({EMERGENCY_NUMBERS.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('balise114')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'balise114'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <MessageSquareWarning className="w-4 h-4" />
            <span>🚨 Balise 114 (SMS & Silencieux)</span>
          </button>

          <button
            onClick={() => setActiveTab('secours')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'secours'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HeartPulse className="w-4 h-4 text-emerald-400" />
            <span>Guide Premiers Secours Hors-Ligne</span>
          </button>
        </div>

        {/* Global Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher (ex: 3919, AVC, étouffement)..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-slate-900 bg-white"
          />
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: NUMÉROS D'URGENCE DIRECTS                              */}
      {/* ============================================================== */}
      {activeTab === 'numeros' && (
        <div className="space-y-6">
          {/* Quick Category Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-1">Filtrer par urgence :</span>
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Tous ({EMERGENCY_NUMBERS.length})
            </button>
            <button
              onClick={() => setSelectedCategory('vital')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedCategory === 'vital'
                  ? 'bg-red-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Urgences Vitales (15, 17, 18, 112, 114, 196)
            </button>
            <button
              onClick={() => setSelectedCategory('protection')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedCategory === 'protection'
                  ? 'bg-purple-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Violences & Protection (3919, 119, 3018)
            </button>
            <button
              onClick={() => setSelectedCategory('prevention')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedCategory === 'prevention'
                  ? 'bg-teal-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Écoute & Santé Mentale (3114)
            </button>
            <button
              onClick={() => setSelectedCategory('social')}
              className={`px-3 py-1 rounded-full font-medium transition-all ${
                selectedCategory === 'social'
                  ? 'bg-stone-700 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              Social & Sans Abri (115)
            </button>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredNumbers.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-900 transition-all p-5 shadow-xs hover:shadow-md flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Header of card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 group-hover:scale-105 transition-transform">
                        {getNumberIcon(item.iconName)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-2xl font-black text-slate-900 tracking-tight">
                            {item.number}
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {item.badge}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-medium block">
                          {item.hours}
                        </span>
                      </div>
                    </div>

                    {item.isDiscreet && (
                      <span
                        className="text-[10px] font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-md shrink-0 border border-purple-200"
                        title="Cet appel n'apparaît pas sur les relevés téléphoniques de votre opérateur"
                      >
                        Invisible facture
                      </span>
                    )}
                  </div>

                  {/* Descriptions */}
                  <div className="space-y-1">
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.shortDesc}
                    </p>
                  </div>

                  {/* When to call bullets */}
                  <div className="bg-slate-50 rounded-2xl p-3 space-y-1.5 border border-slate-100">
                    <strong className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
                      Quand contacter :
                    </strong>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {item.whenToCall.slice(0, 2).map((when, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-rose-600 font-black shrink-0">•</span>
                          <span className="leading-snug">{when}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Direct Dial Call CTA */}
                <div className="pt-4 mt-2 border-t border-slate-100">
                  {item.isSms ? (
                    <div className="grid grid-cols-2 gap-2">
                      <a
                        href={`sms:${item.number}`}
                        className="py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <MessageSquareWarning className="w-4 h-4" />
                        <span>SMS 114</span>
                      </a>
                      <button
                        onClick={() => setActiveTab('balise114')}
                        className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-1 transition-all"
                      >
                        <span>Générateur</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <a
                      href={`tel:${item.number}`}
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs group-hover:bg-red-600"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Appeler le {item.number} (Gratuit)</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: BALISE 114 (SMS & APPEL SILENCIEUX)                     */}
      {/* ============================================================== */}
      {activeTab === 'balise114' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Manifesto Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-rose-300 shadow-md space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-black shadow-md">
                <MessageSquareWarning className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Balise 114 : Alerte d'Urgence par SMS & Silencieuse
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  National · Gratuit · 24h/24 · Pour personnes sourdes, malentendantes ou en situation de danger immédiat
                </p>
              </div>
            </div>

            <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-2xl text-xs sm:text-sm text-rose-950 space-y-1 leading-relaxed">
              <strong>Quand utiliser la Balise SMS 114 ?</strong>
              <p>
                Vous êtes dans l'impossibilité de parler à voix haute sans vous mettre en danger mortel
                (cambriolage en cours, violences conjugales, agression, séquestration, attentat) ou vous êtes
                sourd, malentendant ou aphasique.
              </p>
            </div>

            {/* Step 1: Geolocation */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <span>Étape 1 : Localisation exacte pour les secours</span>
                </span>

                <button
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
                >
                  <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Recherche GPS en cours...' : 'Obtenir mes coordonnées GPS'}</span>
                </button>
              </div>

              {locationText ? (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-2xl flex items-center justify-between gap-3 text-xs text-emerald-950">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-mono font-bold">{locationText}</span>
                  </div>
                  <button
                    onClick={handleCopyCoords}
                    className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-100 rounded-lg text-[11px] font-semibold flex items-center gap-1 shrink-0"
                  >
                    {copiedCoords ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedCoords ? 'Copié !' : 'Copier'}</span>
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Cliquez sur « Obtenir mes coordonnées GPS » ou renseignez manuellement votre adresse ci-dessous.
                </p>
              )}

              {locationError && (
                <p className="text-xs text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                  {locationError}
                </p>
              )}
            </div>

            {/* Step 2: Reason Selection */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Étape 2 : Motif de l'urgence
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  'Agression / Danger physique',
                  'Violences conjugales en cours',
                  'Cambriolage / Intrusion',
                  'Urgence médicale vitale',
                  'Incendie / Fumée',
                  'Témoin d\'un drame en cours',
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSmsReason(reason)}
                    className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition-all ${
                      smsReason === reason
                        ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Complementary Details */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                Étape 3 : Compléments (étage, code porte, nombre de personnes)
              </label>
              <textarea
                value={smsDetails}
                onChange={(e) => setSmsDetails(e.target.value)}
                placeholder="Ex: 2ème étage droite, code B124, 1 agresseur avec couteau, je suis caché dans la salle de bain..."
                rows={2}
                className="w-full p-3 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-rose-600 bg-slate-50"
              />
            </div>

            {/* Generated SMS Preview & CTAs */}
            <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>Aperçu du SMS prêt à envoyer au 114</span>
                </span>
                <span className="text-slate-400">Numéro destinataire : 114</span>
              </div>

              <div className="p-3 bg-slate-800 rounded-xl font-mono text-xs text-rose-100 border border-slate-700 select-all">
                {generatedSmsBody}
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
                <a
                  href={`sms:114?body=${encodeURIComponent(generatedSmsBody)}`}
                  className="w-full sm:w-auto flex-1 py-3 px-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
                >
                  <MessageSquareWarning className="w-4 h-4" />
                  <span>Envoyer directement le SMS au 114</span>
                </a>

                <button
                  onClick={handleCopySms}
                  className="w-full sm:w-auto py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  {copiedSms ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSms ? 'Texte copié !' : 'Copier le texte'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: GUIDE DE PREMIERS SECOURS HORS-LIGNE                     */}
      {/* ============================================================== */}
      {activeTab === 'secours' && (
        <div className="space-y-6">
          {/* Header & Metronome Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold uppercase mb-1">
                <Check className="w-3 h-3 text-emerald-700" />
                <span>Base médicale locale sans réseau</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Guide Textuel des Gestes qui Sauvent
              </h2>
              <p className="text-xs text-slate-500">
                Fiches pratiques rédigées selon les recommandations de la Fédération Française de Cardiologie et de la Croix-Rouge.
              </p>
            </div>

            {/* CPR Metronome Interactive Widget */}
            <div className="flex items-center gap-3 bg-slate-900 text-white p-3 rounded-2xl shrink-0 w-full md:w-auto justify-between md:justify-start">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-4 h-4 rounded-full transition-transform ${
                    metronomeTick ? 'bg-red-500 scale-125' : 'bg-slate-600 scale-90'
                  }`}
                />
                <div>
                  <span className="text-xs font-bold block">Rythme Massage Cardiaque</span>
                  <span className="text-[10px] text-slate-400">110 BPM (Stayin' Alive)</span>
                </div>
              </div>

              <button
                onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  isMetronomeActive
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {isMetronomeActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                <span>{isMetronomeActive ? 'Arrêter' : 'Démarrer le bip'}</span>
              </button>
            </div>
          </div>

          {/* Protocols List & Reader Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Protocol Menu */}
            <div className="lg:col-span-4 bg-white rounded-3xl p-4 border border-slate-200 shadow-xs space-y-2">
              <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider px-2 block">
                Situations d'urgence ({filteredProtocols.length})
              </span>

              <div className="space-y-1.5">
                {filteredProtocols.map((proto) => {
                  const isSelected = proto.id === selectedProtocol.id;
                  return (
                    <button
                      key={proto.id}
                      onClick={() => setSelectedProtocolId(proto.id)}
                      className={`w-full text-left p-3 rounded-2xl transition-all flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'hover:bg-slate-50 text-slate-800 border border-transparent hover:border-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-xs block leading-snug">
                          {proto.title}
                        </span>
                        <span
                          className={`text-[10px] line-clamp-1 ${
                            isSelected ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {proto.subtitle}
                        </span>
                      </div>

                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          proto.urgencyLevel === 'vitale'
                            ? isSelected
                              ? 'bg-rose-500 text-white'
                              : 'bg-rose-100 text-rose-800'
                            : isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {proto.urgencyLevel}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Detailed Protocol View */}
            <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
              {/* Protocol Header */}
              <div className="border-b border-slate-100 pb-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                        selectedProtocol.urgencyLevel === 'vitale'
                          ? 'bg-red-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      Urgence {selectedProtocol.urgencyLevel}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      Appel recommandé :{' '}
                      <strong className="text-slate-900">{selectedProtocol.emergencyNumber}</strong>
                    </span>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Imprimer cette fiche de premiers secours"
                  >
                    <Printer className="w-4 h-4" />
                    <span className="hidden sm:inline">Imprimer</span>
                  </button>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  {selectedProtocol.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {selectedProtocol.subtitle}
                </p>
              </div>

              {/* Protocol Steps */}
              <div className="space-y-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Protocole d'intervention pas à pas :
                </h4>

                <div className="space-y-4">
                  {selectedProtocol.steps.map((step) => (
                    <div
                      key={step.order}
                      className="p-4 rounded-2xl bg-white border-2 border-slate-100 hover:border-slate-300 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-slate-900 text-white font-black text-xs flex items-center justify-center shrink-0">
                          {step.order}
                        </div>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">
                          {step.title}
                        </h5>
                      </div>

                      <ul className="text-xs text-slate-700 space-y-1.5 pl-9">
                        {step.instructions.map((inst, i) => (
                          <li key={i} className="list-disc leading-relaxed">
                            {inst}
                          </li>
                        ))}
                      </ul>

                      {step.warning && (
                        <div className="ml-9 p-2.5 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span className="font-semibold leading-relaxed">{step.warning}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mistakes to avoid */}
              {selectedProtocol.mistakesToAvoid.length > 0 && (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span>Erreurs graves à ne jamais commettre :</span>
                  </div>
                  <ul className="text-xs text-rose-950 space-y-1 pl-6 list-disc">
                    {selectedProtocol.mistakesToAvoid.map((mistake, i) => (
                      <li key={i} className="leading-relaxed font-medium">
                        {mistake}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
