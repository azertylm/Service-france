import React, { useState } from 'react';
import {
  FileText,
  Upload,
  AlertTriangle,
  HelpCircle,
  Stethoscope,
  Sparkles,
  CheckCircle2,
  BookmarkPlus,
  RefreshCw,
  Printer,
  ChevronRight,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { MedicalReportExplanation } from '../../types/memosante';
import { SAMPLE_REPORTS_PRESETS } from '../../data/memosantePresets';

interface MedicalReportDecoderProps {
  onSaveToVault?: (explanation: MedicalReportExplanation) => void;
}

export const MedicalReportDecoder: React.FC<MedicalReportDecoderProps> = ({ onSaveToVault }) => {
  const [reportType, setReportType] = useState('Prise de sang / NFS');
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<{
    data: string;
    mimeType: string;
    name: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<MedicalReportExplanation | null>(null);
  const [hasSaved, setHasSaved] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Le fichier est trop volumineux (maximum 10 Mo).");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile({
        data: reader.result as string,
        mimeType: file.type || 'image/jpeg',
        name: file.name,
      });
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!inputText.trim() && !selectedFile) {
      setErrorMessage("Veuillez saisir le texte de votre analyse ou téléverser une photo / scan.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setHasSaved(false);

    try {
      const response = await fetch('/api/explain-medical-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: inputText.trim() || undefined,
          file: selectedFile || undefined,
          reportType,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible de décoder ce compte-rendu.");
      }

      setExplanation(data.explanation);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Erreur de communication avec le décodeur médical.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPreset = (presetText: string, type: string) => {
    setInputText(presetText);
    setReportType(type);
    setSelectedFile(null);
    setErrorMessage(null);
    setExplanation(null);
  };

  const handleSave = () => {
    if (explanation && onSaveToVault) {
      onSaveToVault(explanation);
      setHasSaved(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Educational Banner & Ethics */}
      <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-2xl p-6 sm:p-7 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pédagogie Citoyenne · Zéro Diagnostic Médical</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
            Traduisez le jargon médical en français clair
          </h2>

          <p className="text-sm text-emerald-100/90 leading-relaxed">
            NFS, CRP, créatinine, épanchement pleural, leucocytes... Ne restez plus dans l'angoisse
            face aux termes barbares de vos bilans de biologie ou d'imagerie. MémoSanté vous donne
            les clés de compréhension pour dialoguer d'égal à égal avec votre médecin.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200/80">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Explication du rôle de chaque molécule
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Questions clés préparées pour votre praticien
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              100 % confidentiel & non commercial
            </span>
          </div>
        </div>
      </div>

      {/* FORMAL ZERO-KNOWLEDGE CERTIFICATE BANNER */}
      <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/80 border-2 border-emerald-600/40 text-emerald-950 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <span className="font-black text-xs uppercase tracking-wide">
              Garantie Solennelle de Confidentialité & Non-Accès
            </span>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            Zero-Knowledge
          </span>
        </div>
        <blockquote className="italic font-medium text-xs sm:text-sm text-slate-900 border-l-3 border-emerald-600 pl-3 leading-relaxed">
          « Vos données ne quittent pas votre appareil de manière lisible. ALPHABETTE SASU n'a aucun moyen technique d'accéder à vos documents, analyses ou courriers. »
        </blockquote>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-emerald-900/80 font-semibold pt-1 border-t border-emerald-200/60">
          <span>ALPHABETTE SASU (La Grande-Motte, fondateur Valentin RICHAUD)</span>
          <span className="text-amber-900 font-bold">Règle éthique : Aucun diagnostic posé · Renvoi exclusif vers votre médecin ou le 15</span>
        </div>
      </div>

      {/* Preset test cases */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            Exemples concrets à tester en 1 clic
          </span>
          <span className="text-[11px] text-slate-400">Comptes-rendus anonymisés</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {SAMPLE_REPORTS_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleApplyPreset(preset.rawText, preset.reportType)}
              className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all group"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  {preset.badge}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-950 line-clamp-1">
                {preset.title}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                {preset.rawText.substring(0, 95)}...
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Votre document médical à expliquer
            </h3>
            <p className="text-xs text-slate-500">
              Copiez-collez les résultats ou téléversez une photo lisible
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Catégorie :</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="text-xs font-medium border border-slate-200 rounded-lg px-3 py-1.5 bg-slate-50 text-slate-800 focus:outline-emerald-600"
            >
              <option value="Prise de sang / Hématologie">Prise de sang / Hématologie</option>
              <option value="Bilan lipidique / Cholestérol">Bilan lipidique / Cholestérol</option>
              <option value="Bilan hépatique ou rénal">Bilan hépatique ou rénal</option>
              <option value="Imagerie (Radio, Scanner, IRM)">Imagerie (Radio, Scanner, IRM)</option>
              <option value="Échographie">Échographie</option>
              <option value="Autre compte-rendu médical">Autre compte-rendu médical</option>
            </select>
          </div>
        </div>

        {/* Text Area */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
            Texte du compte-rendu ou des valeurs biologiques
          </label>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={7}
            placeholder="Ex : Leucocytes 11200 /mm3, Polynucléaires neutrophiles 72%, CRP 18 mg/L..."
            className="w-full text-xs font-mono p-3.5 border border-slate-200 rounded-xl bg-slate-50/70 focus:bg-white focus:outline-emerald-600 focus:border-emerald-600 transition-colors leading-relaxed placeholder:font-sans placeholder:text-slate-400"
          />
        </div>

        {/* Upload Document / Photo */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 shadow-xs">
              <Upload className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                Ou photographiez / téléversez votre feuille d'analyse
              </p>
              <p className="text-[11px] text-slate-500">
                {selectedFile ? (
                  <span className="text-emerald-700 font-semibold">
                    Fichier prêt : {selectedFile.name}
                  </span>
                ) : (
                  "Format PNG, JPG ou PDF (max 10 Mo)"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {selectedFile && (
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1"
              >
                Supprimer
              </button>
            )}
            <label className="cursor-pointer px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-all shadow-xs">
              <span>{selectedFile ? 'Changer de fichier' : 'Parcourir...'}</span>
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          onClick={handleAnalyze}
          disabled={isLoading || (!inputText.trim() && !selectedFile)}
          className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Traduction pédagogique en cours...</span>
            </>
          ) : (
            <>
              <Stethoscope className="w-4 h-4" />
              <span>Expliquer et vulgariser ce compte-rendu</span>
            </>
          )}
        </button>
      </div>

      {/* Explanation Results Display */}
      {explanation && (
        <div className="bg-white rounded-3xl border-2 border-emerald-500/80 p-6 sm:p-8 shadow-lg space-y-7 animate-in fade-in duration-300">
          {/* Header of Report */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {explanation.reportType}
                </span>
                <span className="text-xs text-slate-400">Décryptage citoyen</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                {explanation.reportTitle}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors print:hidden"
              >
                <Printer className="w-3.5 h-3.5 text-slate-500" />
                <span>Imprimer</span>
              </button>

              {onSaveToVault && (
                <button
                  onClick={handleSave}
                  disabled={hasSaved}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all print:hidden ${
                    hasSaved
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <BookmarkPlus className="w-3.5 h-3.5" />
                  <span>{hasSaved ? 'Enregistré dans le carnet' : 'Garder dans mon carnet'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Golden Medical Ethics Banner */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Avertissement Éthique & Déontologique
              </strong>
              <p className="text-xs text-amber-900 leading-relaxed">
                {explanation.criticalNotice}
              </p>
            </div>
          </div>

          {/* General Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              Ce que dit le document en langage simple
            </h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed">
              {explanation.generalSummary}
            </div>
          </div>

          {/* Decoded Terms Grid */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
              Lexique & Traduction des termes scientifiques
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explanation.decodedTerms.map((term, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-emerald-300 transition-all space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">
                      {term.technicalTerm}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                      Vulgarisé
                    </span>
                  </div>

                  <p className="text-xs text-emerald-950 font-medium bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                    💡 <strong>En clair :</strong> {term.plainFrenchTranslation}
                  </p>

                  <div className="space-y-1 text-xs text-slate-600">
                    <p>
                      <strong>À quoi ça sert :</strong> {term.biologicalRole}
                    </p>
                    <p>
                      <strong>Pourquoi on le regarde :</strong> {term.typicalContext}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Questions for the Doctor */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                ?
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-950">
                Vos questions à poser au médecin traitant
              </h4>
            </div>

            <p className="text-xs text-emerald-800">
              Notez ces questions sur un carnet avant votre consultation pour ne rien oublier :
            </p>

            <ul className="space-y-2">
              {explanation.keyQuestionsForDoctor.map((question, qIdx) => (
                <li
                  key={qIdx}
                  className="flex items-start gap-2.5 text-xs text-slate-800 bg-white p-3 rounded-xl border border-emerald-100"
                >
                  <span className="font-bold text-emerald-700 shrink-0">#{qIdx + 1}</span>
                  <span className="leading-relaxed font-medium">{question}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
