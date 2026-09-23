import React, { useState, useEffect } from 'react';
import {
  PenTool,
  BookOpen,
  Building2,
  FolderArchive,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Trash2,
  Eye,
  Printer,
  Calendar,
} from 'lucide-react';
import { GeneratedLetter, SavedLetter, AdministrativeCategory } from '../../types/plume';
import { LETTER_PRESETS } from '../../data/plumePresets';
import { LetterWriterForm } from './LetterWriterForm';
import { LetterResultView } from './LetterResultView';
import { AdministrativeCountersGuide } from './AdministrativeCountersGuide';

const STORAGE_KEY = 'service_france_plume_saved_letters';

interface PlumeHubProps {
  initialPrompt?: string;
  initialCategory?: AdministrativeCategory;
}

export const PlumeHub: React.FC<PlumeHubProps> = ({
  initialPrompt,
  initialCategory,
}) => {
  const [activeTab, setActiveTab] = useState<'rediger' | 'modeles' | 'guichets' | 'archives'>('rediger');
  const [currentLetter, setCurrentLetter] = useState<GeneratedLetter | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Saved letters in localStorage
  const [savedLetters, setSavedLetters] = useState<SavedLetter[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedLetters));
    } catch (e) {
      console.warn(e);
    }
  }, [savedLetters]);

  const handleGenerateLetter = async (formData: {
    situationText: string;
    category: AdministrativeCategory;
    userFullName?: string;
    userReference?: string;
    urgency?: string;
    tone?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/generate-administrative-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la rédaction administrative.');
      }

      setCurrentLetter(data.letterData);
      setActiveTab('rediger');
    } catch (err: any) {
      console.error(err);
      setErrorMessage(
        err?.message || 'Impossible de joindre le service de rédaction. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveCurrentLetter = () => {
    if (!currentLetter) return;

    const alreadySaved = savedLetters.some(
      (l) => l.letter.letterTitle === currentLetter.letterTitle && l.timestamp > Date.now() - 60000
    );

    if (!alreadySaved) {
      const newSaved: SavedLetter = {
        id: `letter_${Date.now()}`,
        timestamp: Date.now(),
        category: 'CAF & Aides sociales',
        userPromptSummary: currentLetter.letterTitle,
        letter: currentLetter,
      };
      setSavedLetters((prev) => [newSaved, ...prev]);
    }
  };

  const handleDeleteSaved = (id: string) => {
    setSavedLetters((prev) => prev.filter((l) => l.id !== id));
  };

  const isCurrentSaved =
    !!currentLetter &&
    savedLetters.some((l) => l.letter.letterTitle === currentLetter.letterTitle);

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs text-xs font-semibold text-slate-600 print:hidden">
        <button
          onClick={() => setActiveTab('rediger')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
            activeTab === 'rediger'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <PenTool className="w-3.5 h-3.5" />
          <span>Rédiger un courrier</span>
        </button>

        <button
          onClick={() => setActiveTab('modeles')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
            activeTab === 'modeles'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Cas & Modèles fréquents ({LETTER_PRESETS.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('guichets')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
            activeTab === 'guichets'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Guide des guichets & voies de recours</span>
        </button>

        <button
          onClick={() => setActiveTab('archives')}
          className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors ${
            activeTab === 'archives'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderArchive className="w-3.5 h-3.5" />
          <span>Mes courriers sauvegardés ({savedLetters.length})</span>
        </button>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-600 hover:text-rose-950 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Content Rendering based on Tab */}
      {activeTab === 'rediger' ? (
        currentLetter ? (
          <LetterResultView
            letter={currentLetter}
            onReset={() => setCurrentLetter(null)}
            onSave={handleSaveCurrentLetter}
            isSaved={isCurrentSaved}
          />
        ) : (
          <LetterWriterForm
            onGenerate={handleGenerateLetter}
            isLoading={isLoading}
            initialPrompt={initialPrompt}
            initialCategory={initialCategory}
          />
        )
      ) : activeTab === 'modeles' ? (
        /* PRESETS CATALOG */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
              Modèles de situations administratives fréquentes
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Choisissez un cas d'usage type pour charger instantanément les textes de loi et adapter la lettre à votre situation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {LETTER_PRESETS.map((preset) => (
                <div
                  key={preset.id}
                  className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-400 p-5 rounded-2xl transition-all shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                        {preset.category}
                      </span>
                      <span className="text-xl">{preset.icon}</span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900">{preset.label}</h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {preset.situation}
                    </p>

                    <div className="text-[11px] text-slate-500 pt-1">
                      <strong>Destinataire type :</strong> {preset.recipientDescription}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleGenerateLetter({
                        situationText: preset.situation,
                        category: preset.category,
                        userReference: preset.userReferenceExample,
                      });
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Formuler cette lettre immédiatement</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === 'guichets' ? (
        <AdministrativeCountersGuide />
      ) : (
        /* SAVED LETTERS ARCHIVES */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Vos courriers officiels sauvegardés
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Retrouvez vos lettres pour les réimprimer ou vérifier vos références de recours.
              </p>
            </div>
            {savedLetters.length > 0 && (
              <span className="text-xs font-mono bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-bold">
                {savedLetters.length} courrier(s)
              </span>
            )}
          </div>

          {savedLetters.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl p-6">
              <FolderArchive className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun courrier sauvegardé pour l'instant.</p>
              <button
                onClick={() => setActiveTab('rediger')}
                className="mt-3 text-xs text-amber-700 hover:underline font-semibold"
              >
                Rédiger mon premier courrier maintenant
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedLetters.map((saved) => (
                <div
                  key={saved.id}
                  className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        {saved.category}
                      </span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(saved.timestamp).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {saved.letter.letterTitle}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {saved.letter.officialSubject}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setCurrentLetter(saved.letter);
                        setActiveTab('rediger');
                      }}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Consulter & Imprimer</span>
                    </button>
                    <button
                      onClick={() => handleDeleteSaved(saved.id)}
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
      )}
    </div>
  );
};
