import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Sparkles,
  Loader2,
  FileText,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  User,
  Hash,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { AdministrativeCategory, LetterPreset } from '../../types/plume';
import { LETTER_PRESETS } from '../../data/plumePresets';

interface LetterWriterFormProps {
  onGenerate: (data: {
    situationText: string;
    category: AdministrativeCategory;
    userFullName?: string;
    userReference?: string;
    urgency?: string;
    tone?: string;
  }) => Promise<void>;
  isLoading: boolean;
  initialPrompt?: string;
  initialCategory?: AdministrativeCategory;
}

export const LetterWriterForm: React.FC<LetterWriterFormProps> = ({
  onGenerate,
  isLoading,
  initialPrompt = '',
  initialCategory = 'CAF & Aides sociales',
}) => {
  const [situationText, setSituationText] = useState(initialPrompt);
  const [category, setCategory] = useState<AdministrativeCategory>(initialCategory);

  useEffect(() => {
    if (initialPrompt) {
      setSituationText(initialPrompt);
    }
  }, [initialPrompt]);

  useEffect(() => {
    if (initialCategory) {
      setCategory(initialCategory);
    }
  }, [initialCategory]);
  const [userFullName, setUserFullName] = useState('');
  const [userReference, setUserReference] = useState('');
  const [tone, setTone] = useState('Courtoise, ferme et juridiquement motivée');
  const [urgency, setUrgency] = useState('Important (délai de recours en cours)');

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check Web Speech Recognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        setSpeechSupported(true);
        const recog = new SpeechRecognition();
        recog.continuous = true;
        recog.interimResults = true;
        recog.lang = 'fr-FR';

        recog.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setSituationText((prev) => {
              const separator = prev.trim() ? ' ' : '';
              return prev + separator + currentTranscript.trim();
            });
          }
        };

        recog.onerror = (event: any) => {
          console.warn('Speech recognition error:', event.error);
          setIsRecording(false);
          if (event.error === 'not-allowed') {
            setSpeechError('Accès au microphone refusé. Vous pouvez taper votre texte au clavier.');
          }
        };

        recog.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recog;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!speechSupported || !recognitionRef.current) return;

    setSpeechError(null);
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Recognition start failed:', err);
      }
    }
  };

  const handleApplyPreset = (preset: LetterPreset) => {
    setCategory(preset.category);
    setSituationText(preset.situation);
    setUserReference(preset.userReferenceExample);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situationText.trim()) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    onGenerate({
      situationText,
      category,
      userFullName: userFullName.trim() || undefined,
      userReference: userReference.trim() || undefined,
      urgency,
      tone,
    });
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 px-2.5 py-1 rounded border border-amber-800/80">
            L'écrivain public administratif citoyen
          </span>
          <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/80 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Rempart contre le non-recours aux droits
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Expliquez votre problème simplement, l'IA rédige votre courrier officiel.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mt-2 leading-relaxed">
          Face à la CAF, aux impôts, à la CPAM ou à un litige locatif, la barrière des formules juridiques ne doit plus vous priver de vos droits.
          Parlez oralement ou écrivez deux phrases en français ordinaire : nous formulons la lettre parfaite avec les articles de loi applicables.
        </p>
      </div>

      {/* Main Interactive Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
        {/* Category & Tone Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Administration ou organisme concerné
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AdministrativeCategory)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
            >
              <option value="CAF & Aides sociales">CAF (Allocations familiales, APL, RSA, prime d'activité)</option>
              <option value="Impôts & DGFIP">Impôts / DGFIP (Taxe foncière, impôt sur le revenu, pénalités)</option>
              <option value="CPAM & Santé">CPAM & Sécurité Sociale (Indemnités journalières, refus de soins)</option>
              <option value="Amendes & Mobilité (ANTAI)">Amendes routières & Stationnement (ANTAI, FPS, radars)</option>
              <option value="Logement & Bailleur">Logement & Bailleur (Dépôt de garantie, charges indues, préavis)</option>
              <option value="Litiges de voisinage">Litiges de voisinage (Nuisances sonores, mitoyenneté)</option>
              <option value="France Travail & Emploi">France Travail (Avertissement, radiation, allocation chômage)</option>
              <option value="Autre démarche">Autre démarche administrative ou réclamation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              2. Tonalité administrative souhaitée
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden font-medium"
            >
              <option value="Courtoise, ferme et juridiquement motivée">
                Courtoise, ferme et motivée en droit (Standard recommandé)
              </option>
              <option value="Sollicitation bienveillante de remise gracieuse">
                Sollicitation de bienveillance / remise gracieuse (Difficultés financières)
              </option>
              <option value="Mise en demeure formelle avant action contentieuse">
                Mise en demeure formelle avec sommation d'agir sous 8 jours
              </option>
            </select>
          </div>
        </div>

        {/* Situation Input Zone (With Voice Dictation Button) */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              3. Racontez votre situation avec vos mots (ou dictez au micro)
            </label>

            {speechSupported && (
              <button
                type="button"
                onClick={toggleRecording}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isRecording
                    ? 'bg-rose-600 text-white animate-pulse shadow-md'
                    : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                }`}
                title="Dicter à voix haute avec votre microphone"
              >
                {isRecording ? (
                  <>
                    <MicOff className="w-3.5 h-3.5" />
                    <span>Arrêter la dictée</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-3.5 h-3.5" />
                    <span>Dicter oralement</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="relative">
            <textarea
              value={situationText}
              onChange={(e) => setSituationText(e.target.value)}
              placeholder="Ex : La CAF m'envoie une lettre disant que je dois rembourser 600 euros de trop-perçu alors que j'ai toujours déclaré mes salaires à temps. Je ne peux pas payer car je suis au SMIC et j'élève seul mes deux enfants..."
              rows={5}
              required
              className="w-full border border-slate-300 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden leading-relaxed shadow-inner"
            />

            {isRecording && (
              <div className="absolute bottom-3 left-4 right-4 bg-rose-50/95 border border-rose-200 text-rose-800 text-xs px-3 py-1.5 rounded-lg flex items-center justify-between backdrop-blur-xs">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                  Dictée vocale en cours : parlez calmement dans votre micro...
                </span>
                <button
                  type="button"
                  onClick={toggleRecording}
                  className="text-xs font-bold underline"
                >
                  OK
                </button>
              </div>
            )}
          </div>

          {speechError && (
            <p className="mt-1 text-xs text-rose-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{speechError}</span>
            </p>
          )}
        </div>

        {/* Optional citizen references */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Coordonnées de l'usager
            </span>
            <button
              type="button"
              onClick={() => {
                try {
                  const saved = localStorage.getItem('fs_admin_keychain_v1');
                  if (saved) {
                    const kc = JSON.parse(saved);
                    if (kc.fullName) setUserFullName(kc.fullName);
                    if (category.includes('CAF') && kc.cafNumber) {
                      setUserReference(`Allocataire CAF n° ${kc.cafNumber}`);
                    } else if (category.includes('CPAM') && kc.socialSecurityNumber) {
                      setUserReference(`NIR Sécurité Sociale : ${kc.socialSecurityNumber}`);
                    } else if (category.includes('Impôts') && kc.taxNumber) {
                      setUserReference(`Numéro Fiscal : ${kc.taxNumber}`);
                    } else if (category.includes('Travail') && kc.franceTravailId) {
                      setUserReference(`Identifiant France Travail : ${kc.franceTravailId}`);
                    } else if (kc.cafNumber) {
                      setUserReference(`Réf : ${kc.cafNumber}`);
                    }
                  } else {
                    alert("Votre trousseau est vide. Remplissez-le d'abord via le bouton 'Trousseau Local' en haut à droite !");
                  }
                } catch (e) {
                  console.warn(e);
                }
              }}
              className="text-[11px] font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <span>⚡ Pré-remplir depuis mon trousseau</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Vos nom et prénom (facultatif)</span>
              </label>
              <input
                type="text"
                value={userFullName}
                onChange={(e) => setUserFullName(e.target.value)}
                placeholder="Ex : Marie Dupont"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1 flex items-center gap-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" />
                <span>Numéro de dossier ou référence (facultatif)</span>
              </label>
              <input
                type="text"
                value={userReference}
                onChange={(e) => setUserReference(e.target.value)}
                placeholder="Ex : Allocataire n° 1234567 / Avis n° 24-0012"
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Submit button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !situationText.trim()}
            className="w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Recherche des articles de loi et rédaction formelle...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-400" />
                <span>Rédiger mon courrier officiel avec les bons articles de loi</span>
              </>
            )}
          </button>
        </div>

        {/* Common situation presets */}
        <div className="pt-4 border-t border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2.5">
            Ou chargez un cas fréquent en 1 clic :
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {LETTER_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="text-left p-3 rounded-xl border border-slate-200 hover:border-slate-400 bg-slate-50/70 hover:bg-white text-xs transition-colors flex items-center gap-2.5 group"
              >
                <span className="text-lg shrink-0">{preset.icon}</span>
                <span className="text-slate-800 font-medium line-clamp-1 group-hover:text-slate-950">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </form>
    </div>
  );
};
