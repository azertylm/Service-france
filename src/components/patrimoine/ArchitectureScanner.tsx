import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Eye,
  BookOpen,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { DecodedArchitecture } from '../../types/patrimoine';

interface ArchitectureScannerProps {
  onSiteSelected?: (siteId: string) => void;
}

export const ArchitectureScanner: React.FC<ArchitectureScannerProps> = ({ onSiteSelected }) => {
  const [inputText, setInputText] = useState('');
  const [locationHint, setLocationHint] = useState('La Grande-Motte & Littoral');
  const [imageFile, setImageFile] = useState<{ data: string; mimeType: string; preview: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DecodedArchitecture | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = (reader.result as string).split(',')[1];
      setImageFile({
        data: base64Data,
        mimeType: file.type,
        preview: reader.result as string,
      });
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async (overrideText?: string, overrideLocation?: string) => {
    const textToSubmit = overrideText !== undefined ? overrideText : inputText;
    const locationToSubmit = overrideLocation !== undefined ? overrideLocation : locationHint;

    if (!textToSubmit.trim() && !imageFile) {
      setError('Veuillez télécharger une photo ou saisir une description de l’édifice.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze-architecture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: textToSubmit,
          file: imageFile ? { data: imageFile.data, mimeType: imageFile.mimeType } : undefined,
          locationHint: locationToSubmit,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l’analyse.');
      }

      setAnalysisResult(data.analysis);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Impossible d’analyser cet élément. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsePreset = (title: string, desc: string, location: string) => {
    setInputText(desc);
    setLocationHint(location);
    setImageFile(null);
    handleAnalyze(desc, location);
  };

  return (
    <div className="space-y-6">
      {/* Introduction banner */}
      <div className="bg-gradient-to-r from-amber-900/90 to-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-lg border border-amber-800/40">
        <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
          <Camera className="w-4 h-4" />
          <span>Décrypteur d'édifice & modénature par IA</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Photographiez ou décrivez un détail architectural
        </h2>
        <p className="text-sm text-amber-100/90 max-w-2xl leading-relaxed">
          Devant un bâtiment insolite, un brise-soleil en nid d’abeille ou une façade en pyramide ?
          Notre outil culturel citoyen décode les formes, l’architecte et le pourquoi sans jamais vous renvoyer vers des publicités payantes.
        </p>
      </div>

      {/* Input container */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Photo upload zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Photo du monument ou de la façade
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />

            {imageFile ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-300 group">
                <img
                  src={imageFile.preview}
                  alt="Aperçu upload"
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md transition-colors backdrop-blur-sm"
                >
                  Changer la photo
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-50 hover:bg-amber-50/30 h-44 flex flex-col items-center justify-center gap-2"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-semibold text-slate-700">
                  Prendre une photo ou importer un cliché
                </div>
                <span className="text-[11px] text-slate-400">JPG, PNG, WebP (bâtiment, brise-soleil, linteau)</span>
              </div>
            )}
          </div>

          {/* Description & Location */}
          <div className="flex flex-col justify-between space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Territoire / Commune observée
              </label>
              <select
                value={locationHint}
                onChange={(e) => setLocationHint(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              >
                <option value="La Grande-Motte">La Grande-Motte (Modernisme Balladur)</option>
                <option value="Aigues-Mortes">Aigues-Mortes (Remparts médiévaux)</option>
                <option value="Le Grau-du-Roi & Port Camargue">Le Grau-du-Roi & Port Camargue</option>
                <option value="Carnon & Mauguio">Carnon & Mauguio (Motte féodale)</option>
                <option value="Montpellier & Littoral">Montpellier (Antigone / Bofill / Maguelone)</option>
                <option value="Autre commune de France">Autre commune patrimoniale en France</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Description ou question sur ce que vous voyez
              </label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ex : J'observe un immeuble en forme de pyramide avec des motifs de poissons sur les balcons... Pourquoi cette forme inclinée ?"
                rows={3}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <button
              onClick={() => handleAnalyze()}
              disabled={isLoading || (!inputText.trim() && !imageFile)}
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Décodage architectural en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Décoder les secrets de cet édifice</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick presets for immediate demonstration */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Exemples concrets du terrain à tester instantanément :
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() =>
                handleUsePreset(
                  'Modénatures La Grande-Motte',
                  'Je vois des motifs en forme de cercles et de vagues ajourés en béton blanc sur les balcons d’un immeuble au couchant de La Grande-Motte. Quel est leur rôle ?',
                  'La Grande-Motte'
                )
              }
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              🐟 Modénatures & brise-soleil (La Grande-Motte)
            </button>
            <button
              onClick={() =>
                handleUsePreset(
                  'Pyramide du Couchant',
                  'Pourquoi les pyramides de Jean Balladur sont-elles inclinées à 60 degrés et inspirées des temples précolombiens ?',
                  'La Grande-Motte'
                )
              }
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              🔺 Pyramides à 60° (Balladur)
            </button>
            <button
              onClick={() =>
                handleUsePreset(
                  'Tour de Constance',
                  'Je suis devant une grande tour ronde aux murs très épais à Aigues-Mortes avec une voûte d’ogives majestueuse. Pourquoi cette tour était-elle imprenable ?',
                  'Aigues-Mortes'
                )
              }
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
            >
              🏰 Donjon de Constance (Saint-Louis)
            </button>
          </div>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Decoded Architecture Result */}
      {analysisResult && (
        <div className="bg-white rounded-2xl border-2 border-amber-500/40 shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="bg-slate-900 text-white p-5 sm:p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800/80">
                {analysisResult.styleFamily}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-1.5">
                {analysisResult.monumentOrStyleName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
                {analysisResult.architectOrEra} • {analysisResult.locationLikelihood}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-800/60 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Analyse culturelle certifiée sans pub</span>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Short summary */}
            <div className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              « {analysisResult.shortSummary} »
            </div>

            {/* Architectural Key Features */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Eye className="w-4 h-4 text-indigo-600" />
                <span>Ce que révèlent les formes géométriques et matériaux</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {analysisResult.architecturalKeyFeatures.map((feat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical context */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm">
                <BookOpen className="w-4 h-4 text-slate-700" />
                <span>Pourquoi ce monument existe-t-il ici ?</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {analysisResult.historicalContext}
              </p>
            </div>

            {/* Curious detail */}
            <div className="bg-purple-50/70 border border-purple-200 rounded-xl p-4 space-y-1.5">
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wide flex items-center gap-1.5">
                <span>💡</span> Le détail que 90% des passants ne remarquent pas
              </span>
              <p className="text-xs sm:text-sm text-purple-950 leading-relaxed font-medium">
                {analysisResult.curiousDetail}
              </p>
            </div>

            {/* Walking tips */}
            {analysisResult.walkingTips && (
              <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-slate-100 p-3 rounded-lg">
                <Compass className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  <strong>Conseil de visite :</strong> {analysisResult.walkingTips}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
