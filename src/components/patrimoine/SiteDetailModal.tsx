import React, { useState, useEffect } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  Compass,
  Sparkles,
  HelpCircle,
  Eye,
  BookOpen,
  Award,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  User,
  Share2,
} from 'lucide-react';
import { ArchitecturalSite } from '../../types/patrimoine';
import { BatteryFriendlyCompass } from './BatteryFriendlyCompass';

interface SiteDetailModalProps {
  site: ArchitecturalSite | null;
  onClose: () => void;
  onQuizCompleted?: (siteId: string, score: number) => void;
  isQuizCompleted?: boolean;
}

export const SiteDetailModal: React.FC<SiteDetailModalProps> = ({
  site,
  onClose,
  onQuizCompleted,
  isQuizCompleted = false,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(isQuizCompleted);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(isQuizCompleted);
    stopAudio();
    return () => {
      stopAudio();
    };
  }, [site, isQuizCompleted]);

  if (!site) return null;

  const stopAudio = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  };

  const handleToggleAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
      return;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const narrativeText = `${site.name}. Commune de ${site.commune}. Réalisé par ${site.architect} en ${site.yearBuilt}. ${site.shortTagline}. ${site.historicalContext}. Les secrets d'architecture : ${site.architecturalSecrets.join('. ')}. Ce qu'il faut regarder : ${site.whatToLookFor.join('. ')}. Anecdote : ${site.anecdote}`;

      const utterance = new SpeechSynthesisUtterance(narrativeText);
      utterance.lang = 'fr-FR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onend = () => {
        setIsPlayingAudio(false);
      };
      utterance.onerror = () => {
        setIsPlayingAudio(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleAnswerSubmit = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(index);
    setIsAnswerSubmitted(true);
    const score = index === site.quiz.correctIndex ? 1 : 0;
    if (onQuizCompleted) {
      onQuizCompleted(site.id, score);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${site.name} — ${site.shortTagline} (Guide Patrimoine en Poche - Service France)`);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                {site.commune} • {site.style}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white line-clamp-1">{site.name}</h2>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleAudio}
              className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
              }`}
              title="Guide vocal mains libres"
            >
              {isPlayingAudio ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Écouter</span>
                </>
              )}
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              title="Partager"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                stopAudio();
                onClose();
              }}
              className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {copiedLink && (
          <div className="bg-emerald-600 text-white text-xs text-center py-1.5 font-medium">
            Référence copiée dans le presse-papier !
          </div>
        )}

        {/* Modal content body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Tagline & Badges */}
          <div className="space-y-2">
            <p className="text-base sm:text-lg text-slate-700 font-medium italic leading-relaxed">
              « {site.shortTagline} »
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              {site.label && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 font-semibold px-2.5 py-1 rounded-full">
                  <Award className="w-3.5 h-3.5" />
                  {site.label}
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                Édifié en {site.yearBuilt}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                <User className="w-3.5 h-3.5 text-slate-500" />
                {site.architect}
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {site.address}
              </span>
            </div>
          </div>

          {/* Historical context */}
          <div className="bg-amber-50/60 border border-amber-200/70 rounded-xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-semibold text-sm">
              <BookOpen className="w-4 h-4 text-amber-700" />
              <span>Contexte historique & Genèse</span>
            </div>
            <p className="text-sm text-slate-700 leading-relaxed">{site.historicalContext}</p>
          </div>

          {/* Secrets of Architecture */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Les clés de lecture architecturale & génie des formes</span>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-1">
              {site.architecturalSecrets.map((secret, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 border border-slate-200 p-3.5 rounded-lg flex items-start gap-3"
                >
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{secret}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What to look for with your bare eyes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Ce qu'il faut regarder à l'œil nu sur place</span>
            </div>
            <ul className="space-y-2 bg-emerald-50/50 border border-emerald-200 p-4 rounded-xl">
              {site.whatToLookFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* The secret anecdote */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-xl p-4 space-y-1.5">
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
              <span>💡</span> Anecdote méconnue
            </span>
            <p className="text-xs sm:text-sm text-purple-950 leading-relaxed">{site.anecdote}</p>
          </div>

          {/* Battery-Friendly Compass */}
          <div>
            <BatteryFriendlyCompass targetCoords={site.coordinates} targetName={site.name} />
          </div>

          {/* Interactive Field Quiz */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-5 bg-slate-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-amber-600" />
                <span>Quiz de terrain : testez votre sens de l'observation</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">Badge : {site.badgeToUnlock.icon}</span>
            </div>

            <p className="text-sm font-medium text-slate-800">{site.quiz.question}</p>

            <div className="grid gap-2">
              {site.quiz.options.map((opt, idx) => {
                const isCorrect = idx === site.quiz.correctIndex;
                const isSelected = selectedAnswer === idx;

                let btnStyle = 'bg-white hover:bg-slate-100 border-slate-300 text-slate-700';

                if (isAnswerSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-semibold';
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 line-through';
                  } else {
                    btnStyle = 'bg-white/60 border-slate-200 text-slate-400';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSubmit(idx)}
                    disabled={isAnswerSubmitted}
                    className={`text-left p-3 rounded-lg border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isAnswerSubmitted && isCorrect && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 ml-2" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-rose-500 shrink-0 ml-2" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswerSubmitted && (
              <div className="p-3 rounded-lg bg-indigo-50 border border-indigo-200 text-xs text-indigo-950 space-y-1 animate-in fade-in">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>🎓 Explication :</span>
                </div>
                <p>{site.quiz.explanation}</p>
                <div className="pt-1 font-semibold text-emerald-700 flex items-center gap-1">
                  <span>Badge débloqué :</span>
                  <span>{site.badgeToUnlock.icon} {site.badgeToUnlock.name}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Patrimoine en Poche • Service France (0% publicité)</span>
          <button
            onClick={() => {
              stopAudio();
              onClose();
            }}
            className="px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 rounded-lg font-medium text-xs transition-colors"
          >
            Fermer la fiche
          </button>
        </div>
      </div>
    </div>
  );
};
