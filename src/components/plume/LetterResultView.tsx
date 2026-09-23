import React, { useState } from 'react';
import {
  Printer,
  Copy,
  Check,
  Send,
  Building,
  FileCheck,
  Clock,
  HeartHandshake,
  AlertTriangle,
  ArrowLeft,
  Share2,
  BookmarkCheck,
  Scale,
  ShieldCheck,
} from 'lucide-react';
import { GeneratedLetter } from '../../types/plume';

interface LetterResultViewProps {
  letter: GeneratedLetter;
  onReset: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

export const LetterResultView: React.FC<LetterResultViewProps> = ({
  letter,
  onReset,
  onSave,
  isSaved = false,
}) => {
  const [copied, setCopied] = useState(false);
  const [checkedDocs, setCheckedDocs] = useState<Record<number, boolean>>({});

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(letter.fullLetterContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleDoc = (idx: number) => {
    setCheckedDocs((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top action toolbar (Hidden when printing) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 print:hidden">
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Rédiger un autre courrier</span>
        </button>

        <div className="flex items-center gap-2">
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaved}
              className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border ${
                isSaved
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 cursor-default'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600" />
              <span>{isSaved ? 'Enregistré' : 'Sauvegarder ce courrier'}</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Texte copié !' : 'Copier le texte'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer le courrier officiel (A4)</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Letter Preview on Left, Step-by-Step Counter Guide on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ========================================= */}
        {/* OFFICIAL LETTER SHEET (A4 Simulation)     */}
        {/* ========================================= */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-300 shadow-xl overflow-hidden print:border-none print:shadow-none print:rounded-none">
          {/* Official Letter Header Band */}
          <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xl">✍️</span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Courrier Officiel Formulé par l'Écrivain Public
                </span>
                <h3 className="text-sm font-bold text-white line-clamp-1">{letter.letterTitle}</h3>
              </div>
            </div>

            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800">
              Conforme au droit français
            </span>
          </div>

          {/* Legal references pill box */}
          <div className="bg-amber-50/70 border-b border-amber-200/80 p-4 space-y-1.5 print:hidden">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-amber-700" />
              Articles de loi et textes officiels visés dans ce courrier :
            </span>
            <div className="flex flex-wrap gap-1.5">
              {letter.legalReferences.map((ref, idx) => (
                <span
                  key={idx}
                  className="text-xs bg-white text-slate-800 border border-amber-300 font-mono px-2 py-0.5 rounded shadow-xs"
                >
                  ⚖️ {ref}
                </span>
              ))}
            </div>
          </div>

          {/* The Actual Official Letter Text Body */}
          <div className="p-8 sm:p-12 text-slate-900 font-serif leading-relaxed text-sm sm:text-base space-y-6 print:p-0">
            {/* The pre-formatted complete text */}
            <div className="whitespace-pre-wrap font-sans text-slate-900 text-xs sm:text-sm leading-relaxed border-l-2 border-slate-200 pl-4 sm:pl-6 my-2">
              {letter.fullLetterContent}
            </div>
          </div>

          {/* Letter Footer */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
            <span>Rédigé avec PlumeCitoyenne • Service France</span>
            <button
              onClick={handleCopy}
              className="text-slate-700 hover:text-slate-900 font-medium hover:underline text-xs"
            >
              {copied ? 'Copié !' : 'Copier dans le presse-papier'}
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* COUNTER & PROCEDURE GUIDANCE (Right Col)  */}
        {/* ========================================= */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Target Counter Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/70 px-2 py-0.5 rounded border border-amber-800">
                Guichet de destination
              </span>
              <Building className="w-4 h-4 text-slate-400" />
            </div>

            <div>
              <h4 className="text-base sm:text-lg font-bold text-white">
                {letter.targetCounter.name}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {letter.targetCounter.addressGuidance}
              </p>
            </div>

            {letter.targetCounter.onlineAlternative && (
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-200">
                <strong className="text-amber-300 block mb-0.5">Alternative en ligne :</strong>
                <span>{letter.targetCounter.onlineAlternative}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Mode d'expédition recommandé :</span>
              <strong className="text-emerald-400 font-semibold">
                {letter.recommendedDelivery}
              </strong>
            </div>
          </div>

          {/* Critical Deadlines Warning */}
          <div className="bg-rose-50 border border-rose-300 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase tracking-wide">
              <Clock className="w-4 h-4 text-rose-600" />
              <span>Délais légaux impératifs</span>
            </div>
            <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
              {letter.criticalDeadlines}
            </p>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>Pièces indispensables à joindre (à cocher)</span>
            </div>
            <p className="text-xs text-slate-500">
              N'envoyez jamais vos originaux uniques, mais toujours des photocopies ou scans lisibles.
            </p>

            <div className="space-y-2 pt-1">
              {letter.requiredDocuments.map((doc, idx) => {
                const isChecked = !!checkedDocs[idx];

                return (
                  <label
                    key={idx}
                    onClick={() => toggleDoc(idx)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                      isChecked
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 h-3.5 w-3.5"
                    />
                    <span>{doc}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step-by-Step Procedure */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <h4 className="font-bold text-sm text-slate-900">
              Procédure pas-à-pas pour réussir votre démarche :
            </h4>

            <div className="space-y-3">
              {letter.procedureStepByStep.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-3 text-xs">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                    {step.stepNumber}
                  </span>
                  <div>
                    <strong className="text-slate-900 block">{step.title}</strong>
                    <span className="text-slate-600 leading-relaxed">{step.action}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Advise from Public Writer */}
          <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-xs uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4 text-indigo-700" />
              <span>Le conseil apaisant de l'écrivain public</span>
            </div>
            <p className="text-xs sm:text-sm text-indigo-950 italic leading-relaxed">
              « {letter.citizenAdvise} »
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
