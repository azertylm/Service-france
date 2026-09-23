import React, { useState } from 'react';
import {
  ContractAnalysis,
  VigilancePoint,
} from '../types/contract';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Scale,
  Clock,
  Coins,
  FileCheck,
  Copy,
  Printer,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  HelpCircle,
  Bookmark,
  Share2,
  Check,
  CornerDownRight,
  Sparkles,
} from 'lucide-react';

interface AnalysisViewProps {
  analysis: ContractAnalysis;
  onReset: () => void;
  onSaveToHistory?: () => void;
  isSaved?: boolean;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  analysis,
  onReset,
  onSaveToHistory,
  isSaved = false,
}) => {
  const [copiedLetter, setCopiedLetter] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [showNegotiationLetter, setShowNegotiationLetter] = useState(true);

  // Interactive Question State
  const [questionText, setQuestionText] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaHistory, setQaHistory] = useState<Array<{ q: string; a: string }>>([]);

  const toggleCheck = (index: number) => {
    setCheckedItems((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyLetter = () => {
    const fullText = `Objet : ${analysis.negotiationLetterTemplate.subject}\n\n${analysis.negotiationLetterTemplate.body}`;
    navigator.clipboard.writeText(fullText);
    setCopiedLetter(true);
    setTimeout(() => setCopiedLetter(false), 2000);
  };

  const handleCopySummary = () => {
    const summaryText = `FICHE DE SYNTHÈSE CLAIRCONTRAT\n${analysis.contractTitle} (${analysis.contractType})\nRisque global : ${analysis.riskLevel} - ${analysis.riskJustification}\n\nPOINTS DE VIGILANCE :\n${analysis.threeVigilancePoints
      .map(
        (p, i) =>
          `${i + 1}. ${p.title} [${p.severity}]\nCitation : "${p.quote}"\nPiège : ${p.decodedTrap}\nRègle de droit : ${p.legalReference}\nAction : ${p.recommendedAction}\n`
      )
      .join('\n')}\n\nRÉSILITATION :\nPréavis : ${analysis.terminationAndHiddenPenalties.noticePeriod}\nReconduction : ${analysis.terminationAndHiddenPenalties.tacitRenewal}\nPénalités : ${analysis.terminationAndHiddenPenalties.hiddenPenalties.join(', ')}`;
    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleAskQuestion = async (prefilled?: string) => {
    const q = prefilled || questionText;
    if (!q.trim() || isAsking) return;

    setIsAsking(true);
    setQuestionText('');

    try {
      const res = await fetch('/api/ask-contract-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          contractTitle: analysis.contractTitle,
          contractType: analysis.contractType,
          contractSummary: analysis.summary,
          pointsSummary: analysis.threeVigilancePoints.map((p) => ({
            title: p.title,
            legalRef: p.legalReference,
          })),
        }),
      });

      const data = await res.json();
      if (data.success && data.answer) {
        setQaHistory((prev) => [...prev, { q, a: data.answer }]);
      } else {
        alert(data.error || "Impossible d'obtenir une réponse.");
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la communication avec le serveur.');
    } finally {
      setIsAsking(false);
    }
  };

  // Severity color helpers
  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'CRITIQUE':
        return {
          bg: 'bg-rose-50 text-rose-900 border-rose-300',
          dot: 'bg-rose-600',
          label: 'Risque Critique',
        };
      case 'ELEVE':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
          label: 'Risque Élevé',
        };
      case 'MODERE':
        return {
          bg: 'bg-yellow-50 text-yellow-900 border-yellow-300',
          dot: 'bg-yellow-600',
          label: 'Risque Modéré',
        };
      default:
        return {
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
          dot: 'bg-emerald-600',
          label: 'Risque Faible',
        };
    }
  };

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'ABUSIVE':
      case 'ILLÉGALE':
        return 'bg-rose-100 text-rose-900 border border-rose-200';
      case 'RISQUE_FORT':
        return 'bg-amber-100 text-amber-900 border border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border border-slate-200';
    }
  };

  const riskInfo = getRiskBadge(analysis.riskLevel);

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16 print:p-0">
      {/* Top action toolbar (No print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print bg-white p-3 border border-slate-200 rounded-xl shadow-xs">
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5"
        >
          <span>← Analyser un autre document</span>
        </button>

        <div className="flex items-center gap-2">
          {onSaveToHistory && (
            <button
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                isSaved
                  ? 'bg-slate-100 text-slate-400 cursor-default'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{isSaved ? 'Enregistré' : 'Sauvegarder'}</span>
            </button>
          )}

          <button
            onClick={handleCopySummary}
            className="px-3 py-1.5 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSummary ? 'Copié !' : 'Copier résumé'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>Imprimer / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Diagnostic Summary Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 shadow-xs print:border-none print:shadow-none print:p-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
              <span>{analysis.contractType}</span>
              <span aria-hidden="true">·</span>
              <span>{analysis.parties.partyA} / {analysis.parties.partyB}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight font-serif-title">
              {analysis.contractTitle}
            </h1>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          {/* Risk Level Badge */}
          <div className="sm:text-right shrink-0">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold ${riskInfo.bg}`}
            >
              <span className={`w-2 h-2 rounded-full ${riskInfo.dot}`} />
              <span>{riskInfo.label}</span>
            </div>
            <p className="text-xs text-slate-500 mt-1.5 max-w-xs sm:ml-auto">
              {analysis.riskJustification}
            </p>
          </div>
        </div>

        {/* ========================================================
            SECTION 01: LES 3 POINTS DE VIGILANCE OU CLAUSES ABUSIVES
            ======================================================== */}
        <div className="pt-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
                01. DÉTECTION JURIDIQUE
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5 font-serif-title">
                Les 3 points de vigilance & clauses abusives
              </h2>
            </div>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Conformité Loi 1989 & Code de la consommation
            </span>
          </div>

          <div className="space-y-4">
            {analysis.threeVigilancePoints.map((point: VigilancePoint, idx: number) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-xl p-5 bg-white hover:border-slate-300 transition-colors"
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-md bg-slate-900 text-amber-400 text-xs font-bold font-mono flex items-center justify-center">
                      0{idx + 1}
                    </span>
                    <h3 className="text-base font-semibold text-slate-900">
                      {point.title}
                    </h3>
                  </div>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-md font-medium tracking-wide ${getSeverityBadge(
                      point.severity
                    )}`}
                  >
                    {point.severity === 'ABUSIVE'
                      ? 'Clause abusive (réputée non écrite)'
                      : point.severity === 'ILLÉGALE'
                      ? 'Clause illégale en droit français'
                      : point.severity === 'RISQUE_FORT'
                      ? 'Risque financier élevé'
                      : 'Point de vigilance'}
                  </span>
                </div>

                {/* Quoted text from the contract */}
                <div className="mt-3.5 p-3 rounded-lg bg-slate-50 border-l-3 border-slate-900 text-xs font-serif text-slate-800 italic">
                  « {point.quote} »
                </div>

                {/* The Trap Decoded */}
                <div className="mt-3.5 space-y-2 text-xs leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-900">Le piège décodé : </span>
                    <span className="text-slate-700">{point.decodedTrap}</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-900">Règle de droit français : </span>
                    <span className="text-slate-600 font-mono text-xs">
                      {point.legalReference}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-start gap-1.5 text-slate-900 font-medium">
                    <span className="text-amber-600 font-bold shrink-0">→ Ce que vous devez faire :</span>
                    <span>{point.recommendedAction}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            SECTION 02: DÉLAIS DE RÉSILIATION ET PÉNALITÉS CACHÉES
            ======================================================== */}
        <div className="pt-10 space-y-5 border-t border-slate-100 mt-10">
          <div>
            <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
              02. RÉSILIATION & FRAIS
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5 font-serif-title">
              Délais de résiliation & pénalités cachées
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Notice Period */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <Clock className="w-4 h-4 text-slate-700" />
                <span>Préavis & conditions de forme</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {analysis.terminationAndHiddenPenalties.noticePeriod}
              </p>
            </div>

            {/* Tacit Renewal */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <Scale className="w-4 h-4 text-slate-700" />
                <span>Reconduction tacite & Loi Châtel</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {analysis.terminationAndHiddenPenalties.tacitRenewal}
              </p>
            </div>

            {/* Hidden Penalties */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <Coins className="w-4 h-4 text-rose-600" />
                <span>Pénalités cachées & frais de dossier</span>
              </div>
              <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
                {analysis.terminationAndHiddenPenalties.hiddenPenalties.map((pen, i) => (
                  <li key={i}>{pen}</li>
                ))}
              </ul>
            </div>

            {/* Free Cancellation */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2 text-slate-900 font-semibold text-xs mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Sortie sans frais & cas de force majeure</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {analysis.terminationAndHiddenPenalties.freeCancellationConditions}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            SECTION 03: CE À QUOI LE SIGNATAIRE S'ENGAGE RÉELLEMENT
            ======================================================== */}
        <div className="pt-10 space-y-5 border-t border-slate-100 mt-10">
          <div>
            <div className="text-xs font-mono font-semibold text-slate-400 tracking-wider">
              03. PORTÉE DES ENGAGEMENTS
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-0.5 font-serif-title">
              Ce à quoi vous vous engagez réellement
            </h2>
          </div>

          <div className="space-y-4">
            {/* Financial Commitment breakdown */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-1">
                Engagement financier global estimé
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed font-mono">
                {analysis.realCommitments.financialSummary}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Key Obligations */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                  Vos obligations majeures à respecter :
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysis.realCommitments.keyObligations.map((ob, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-slate-400 font-mono">·</span>
                      <span>{ob}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions and Blind Spots */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                  Ce qui n'est PAS inclus / Vos angles morts :
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {analysis.realCommitments.exclusionsAndBlindSpots.map((ex, i) => (
                    <li key={i} className="flex items-start gap-2 text-slate-600">
                      <span className="text-rose-500 font-mono font-bold">✕</span>
                      <span>{ex}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            CHECKLIST CITOYENNE AVANT SIGNATURE
            ======================================================== */}
        <div className="pt-10 space-y-4 border-t border-slate-100 mt-10">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 font-serif-title">
              Checklist citoyenne avant de parapher
            </h3>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              {Object.values(checkedItems).filter(Boolean).length} / {analysis.checklistBeforeSigning.length} vérifié(s)
            </span>
          </div>

          <div className="space-y-2">
            {analysis.checklistBeforeSigning.map((item, idx) => (
              <label
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <input
                  type="checkbox"
                  checked={!!checkedItems[idx]}
                  onChange={() => toggleCheck(idx)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                />
                <span
                  className={`text-xs leading-relaxed ${
                    checkedItems[idx]
                      ? 'text-slate-400 line-through'
                      : 'text-slate-800 font-medium'
                  }`}
                >
                  {item}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* ========================================================
            COURRIER DE CONTESTATION / NÉGOCIATION PRÉ-RÉDIGÉ
            ======================================================== */}
        <div className="pt-10 border-t border-slate-100 mt-10 no-print">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-serif-title">
                Modèle de courrier de contestation / négociation
              </h3>
              <p className="text-xs text-slate-500">
                Courrier courtois et juridiquement sourcé à adresser pour faire rayer ou adapter les clauses litigieuses.
              </p>
            </div>
            <button
              onClick={() => setShowNegotiationLetter(!showNegotiationLetter)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 p-1 flex items-center gap-1"
            >
              <span>{showNegotiationLetter ? 'Masquer' : 'Afficher'}</span>
              {showNegotiationLetter ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {showNegotiationLetter && (
            <div className="mt-4 border border-slate-200 rounded-xl bg-slate-50 p-5 space-y-4">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200">
                <span className="font-semibold text-slate-900">
                  Objet : {analysis.negotiationLetterTemplate.subject}
                </span>
                <button
                  onClick={handleCopyLetter}
                  className="px-3 py-1 bg-white border border-slate-300 hover:border-slate-400 text-slate-800 rounded-md font-medium flex items-center gap-1.5 transition-colors"
                >
                  {copiedLetter ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLetter ? 'Copié dans le presse-papier' : 'Copier le texte'}</span>
                </button>
              </div>

              <div className="p-4 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed whitespace-pre-wrap select-all">
                {analysis.negotiationLetterTemplate.body}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================
            ASSISTANT DE DISCUSSION JURIDIQUE SUR LE DOCUMENT
            ======================================================== */}
        <div className="pt-10 border-t border-slate-100 mt-10 no-print">
          <div>
            <h3 className="text-base font-bold text-slate-900 font-serif-title flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-slate-700" />
              <span>Une question sur ce document ?</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Posez une question pratique sur votre situation concrète. L'IA vous répond en français direct selon le droit applicable.
            </p>
          </div>

          {/* Quick prompt chips */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => handleAskQuestion('Puis-je refuser de signer une clause abusive sans perdre le contrat ?')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Refuser la clause ?
            </button>
            <button
              onClick={() => handleAskQuestion('Que se passe-t-il si je signe quand même une clause illégale ?')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Effet d'une clause illégale signée ?
            </button>
            <button
              onClick={() => handleAskQuestion('Comment résilier au plus vite sans payer d indemnités ?')}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              Résilier sans pénalité ?
            </button>
          </div>

          {/* Q&A conversation thread */}
          {qaHistory.length > 0 && (
            <div className="mt-4 space-y-3">
              {qaHistory.map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <CornerDownRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>Vous : {item.q}</span>
                  </div>
                  <div className="text-slate-700 leading-relaxed pl-5 whitespace-pre-wrap">
                    {item.a}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Input field */}
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
              placeholder="Ex: Puis-je peindre les murs ? Combien de préavis si je trouve un travail ailleurs ?"
              className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
            <button
              onClick={() => handleAskQuestion()}
              disabled={!questionText.trim() || isAsking}
              className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                questionText.trim() && !isAsking
                  ? 'bg-slate-900 text-white hover:bg-slate-800'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isAsking ? (
                <span>Recherche...</span>
              ) : (
                <>
                  <span>Poser</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
