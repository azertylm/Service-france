import React, { useState, useEffect } from 'react';
import {
  Coins,
  ShieldCheck,
  Zap,
  Heart,
  Home,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Printer,
  ChevronDown,
  ChevronUp,
  FileText,
  AlertCircle,
  Building,
  CheckCircle2,
  Lock,
  FileKey,
  Users,
  Briefcase,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { DroitsUserInputs, AidEligibilityResult, DroitsCalculationSummary } from '../../types/droits';
import { calculateSocialRights } from '../../utils/droitsCalculateur';

interface DroitsSociauxHubProps {
  onNavigateToPlumeWithPrompt?: (prompt: string, category: string) => void;
}

const DEFAULT_INPUTS: DroitsUserInputs = {
  householdStatus: 'single',
  childrenCount: 0,
  childrenAges: [],
  elderlyDependents: 0,
  monthlyNetSalary: 1400, // SMIC net approx
  monthlyOtherIncome: 0,
  annualTaxableIncome: 16800,
  housingStatus: 'tenant',
  monthlyRentOrMortgage: 550,
  postalCode: '34280',
  cityName: 'La Grande-Motte',
};

export const DroitsSociauxHub: React.FC<DroitsSociauxHubProps> = ({
  onNavigateToPlumeWithPrompt,
}) => {
  const [inputs, setInputs] = useState<DroitsUserInputs>(() => {
    try {
      const stored = localStorage.getItem('fs_droits_inputs_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn(e);
    }
    return DEFAULT_INPUTS;
  });

  const [expandedAidId, setExpandedAidId] = useState<string | null>('prime_activite');
  const [results, setResults] = useState<DroitsCalculationSummary>(() =>
    calculateSocialRights(DEFAULT_INPUTS)
  );

  // Recalculate immediately in-browser whenever inputs change
  useEffect(() => {
    const calculated = calculateSocialRights(inputs);
    setResults(calculated);
    try {
      localStorage.setItem('fs_droits_inputs_v1', JSON.stringify(inputs));
    } catch (e) {
      console.warn(e);
    }
  }, [inputs]);

  // Handle Keychain prefill
  const handlePrefillFromKeychain = () => {
    try {
      const raw = localStorage.getItem('fs_admin_keychain_v1');
      if (raw) {
        const kc = JSON.parse(raw);
        setInputs((prev) => ({
          ...prev,
          cityName: kc.city || prev.cityName,
          postalCode: kc.postalCode || prev.postalCode,
        }));
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const applyPreset = (presetInputs: DroitsUserInputs) => {
    setInputs(presetInputs);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Republic Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>Décodeur de Droits Sociaux · Lutte contre le non-recours</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Calculez vos aides non-réclamées en 2 minutes,{' '}
            <span className="text-amber-400">100 % confidentiel</span>.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            Chaque année, plus de 30 % des ménages éligibles ne touchent pas la{' '}
            <strong>Prime d'activité</strong>, les <strong>chèques énergie</strong>, la{' '}
            <strong>Complémentaire Santé Solidaire</strong> ou les <strong>secours d'urgence du CCAS</strong> par
            manque d'information ou complexité des formulaires.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-amber-200/90 font-medium">
            <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Calcul 100 % local sur votre machine
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              Zéro donnée transmise sur le web
            </span>
            <span className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              Barèmes officiels CAF, CPAM & État
            </span>
          </div>
        </div>
      </div>

      {/* Quick Test Presets */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Profils types à tester immédiatement
          </span>
          <button
            onClick={handlePrefillFromKeychain}
            className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1 transition-colors"
          >
            <FileKey className="w-3 h-3 text-amber-600" />
            <span>Pré-remplir commune depuis le trousseau</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            onClick={() =>
              applyPreset({
                householdStatus: 'single',
                childrenCount: 0,
                childrenAges: [],
                elderlyDependents: 0,
                monthlyNetSalary: 1420,
                monthlyOtherIncome: 0,
                annualTaxableIncome: 16800,
                housingStatus: 'tenant',
                monthlyRentOrMortgage: 520,
                postalCode: '34280',
                cityName: 'La Grande-Motte',
              })
            }
            className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all group"
          >
            <div className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded w-fit mb-1">
              Célibataire au SMIC
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-950">
              Salarié net 1 420 € · Locataire
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Prime d'activité (~180 €/m) + Chèque énergie + aide locale.
            </p>
          </button>

          <button
            onClick={() =>
              applyPreset({
                householdStatus: 'couple',
                childrenCount: 2,
                childrenAges: [7, 11],
                elderlyDependents: 0,
                monthlyNetSalary: 2100,
                monthlyOtherIncome: 0,
                annualTaxableIncome: 24500,
                housingStatus: 'tenant',
                monthlyRentOrMortgage: 780,
                postalCode: '34000',
                cityName: 'Montpellier',
              })
            }
            className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all group"
          >
            <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded w-fit mb-1">
              Couple avec 2 enfants
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-950">
              1 salaire 2 100 € · 2 enfants (7 & 11 ans)
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              ARS (840 €/an) + Pass'Sport + Chèque énergie + CCAS.
            </p>
          </button>

          <button
            onClick={() =>
              applyPreset({
                householdStatus: 'single',
                childrenCount: 1,
                childrenAges: [5],
                elderlyDependents: 0,
                monthlyNetSalary: 1100,
                monthlyOtherIncome: 0,
                annualTaxableIncome: 12500,
                housingStatus: 'tenant',
                monthlyRentOrMortgage: 590,
                postalCode: '30240',
                cityName: 'Le Grau-du-Roi',
              })
            }
            className="text-left p-3.5 rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/30 transition-all group"
          >
            <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded w-fit mb-1">
              Parent solo temps partiel
            </div>
            <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-950">
              Salaire 1 100 € · 1 enfant · Loyer 590 €
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Forte prime d'activité + APL + Mutuelle CSS gratuite.
            </p>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and Instant Results Dashboard (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ======================================================== */}
        {/* LEFT COLUMN: THE LOCAL QUESTIONNAIRE                     */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-700" />
              <span>Votre situation de foyer</span>
            </h3>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              100% confidentiel
            </span>
          </div>

          {/* 1. Household composition */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Composition de votre foyer
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, householdStatus: 'single' }))}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    inputs.householdStatus === 'single'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Célibataire / Seul(e)
                </button>
                <button
                  type="button"
                  onClick={() => setInputs((p) => ({ ...p, householdStatus: 'couple' }))}
                  className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                    inputs.householdStatus === 'couple'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  En couple / Marié(e)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Enfants à charge
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() =>
                      setInputs((p) => ({
                        ...p,
                        childrenCount: Math.max(0, p.childrenCount - 1),
                      }))
                    }
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-slate-900">
                    {inputs.childrenCount}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setInputs((p) => ({
                        ...p,
                        childrenCount: p.childrenCount + 1,
                      }))
                    }
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Personnes âgées (+65 ans)
                </label>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() =>
                      setInputs((p) => ({
                        ...p,
                        elderlyDependents: Math.max(0, p.elderlyDependents - 1),
                      }))
                    }
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-bold text-sm text-slate-900">
                    {inputs.elderlyDependents}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setInputs((p) => ({
                        ...p,
                        elderlyDependents: p.elderlyDependents + 1,
                      }))
                    }
                    className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Incomes */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>2. Vos revenus mensuels nets (foyer)</span>
            </label>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Salaires nets mensuels du foyer :
                </span>
                <span className="text-sm font-black text-slate-900">
                  {inputs.monthlyNetSalary} € / mois
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="4000"
                step="50"
                value={inputs.monthlyNetSalary}
                onChange={(e) =>
                  setInputs((p) => ({ ...p, monthlyNetSalary: Number(e.target.value) }))
                }
                className="w-full accent-amber-500 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 € (Sans emploi)</span>
                <span>1 420 € (SMIC)</span>
                <span>2 500 €</span>
                <span>4 000 €+</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Autres revenus mensuels (chômage, pensions, RSA) :
                </span>
                <span className="text-xs font-bold text-slate-800">
                  {inputs.monthlyOtherIncome} € / mois
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="50"
                value={inputs.monthlyOtherIncome || ''}
                placeholder="0"
                onChange={(e) =>
                  setInputs((p) => ({ ...p, monthlyOtherIncome: Number(e.target.value) || 0 }))
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-700">
                  Revenu Fiscal de Référence (RFR annuel) :
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {inputs.annualTaxableIncome > 0
                    ? `${inputs.annualTaxableIncome} €/an`
                    : 'Estimé automatiquement'}
                </span>
              </div>
              <input
                type="number"
                min="0"
                step="500"
                value={inputs.annualTaxableIncome || ''}
                placeholder="Ex : 16500 (sur votre avis d'impôt)"
                onChange={(e) =>
                  setInputs((p) => ({ ...p, annualTaxableIncome: Number(e.target.value) || 0 }))
                }
                className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Indiqué sur la 1ère page de votre dernier avis d'imposition sur le revenu.
              </p>
            </div>
          </div>

          {/* 3. Housing and location */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span>3. Logement & Commune</span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, housingStatus: 'tenant' }))}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center transition-all ${
                  inputs.housingStatus === 'tenant'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Locataire
              </button>
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, housingStatus: 'owner' }))}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center transition-all ${
                  inputs.housingStatus === 'owner'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Propriétaire
              </button>
              <button
                type="button"
                onClick={() => setInputs((p) => ({ ...p, housingStatus: 'free_lodging' }))}
                className={`p-2 rounded-xl border text-[11px] font-semibold flex items-center justify-center transition-all ${
                  inputs.housingStatus === 'free_lodging'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Hébergé gratuit
              </button>
            </div>

            {inputs.housingStatus === 'tenant' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Montant de votre loyer mensuel (hors charges) :
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="20"
                    value={inputs.monthlyRentOrMortgage || ''}
                    placeholder="550"
                    onChange={(e) =>
                      setInputs((p) => ({
                        ...p,
                        monthlyRentOrMortgage: Number(e.target.value) || 0,
                      }))
                    }
                    className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-slate-400 font-bold">
                    € / mois
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Code postal
                </label>
                <input
                  type="text"
                  value={inputs.postalCode}
                  placeholder="34280"
                  onChange={(e) => setInputs((p) => ({ ...p, postalCode: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Commune (CCAS)
                </label>
                <input
                  type="text"
                  value={inputs.cityName}
                  placeholder="La Grande-Motte"
                  onChange={(e) => setInputs((p) => ({ ...p, cityName: e.target.value }))}
                  className="w-full border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: THE INSTANT RESULTS DASHBOARD              */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* Summary Box with Total Gains */}
          <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-800">
                Droits théoriques détectés
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight pt-1">
                {results.totalEstimatedAnnual.toLocaleString('fr-FR')} €{' '}
                <span className="text-base sm:text-lg font-bold text-emerald-300">/ an</span>
              </h2>
              <p className="text-xs text-slate-300">
                Soit environ{' '}
                <strong className="text-emerald-300 text-sm">
                  {results.totalEstimatedMonthly} € par mois
                </strong>{' '}
                répartis sur {results.eligibleAidsCount} dispositifs éligibles.
              </p>
            </div>

            <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 transition-all"
              >
                <Printer className="w-3.5 h-3.5 text-slate-300" />
                <span>Imprimer ma fiche récapitulative</span>
              </button>
            </div>
          </div>

          {/* Cards of Eligible Aids */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Détail de vos {results.eligibleAidsCount} aides identifiées
              </h3>
              <span className="text-xs text-slate-500">Cliquez pour déplier les démarches</span>
            </div>

            {results.aids.map((aid) => {
              const isExpanded = expandedAidId === aid.id;
              const isPrime = aid.id === 'prime_activite';
              const isCheque = aid.id === 'cheque_energie';
              const isCSS = aid.id === 'css_sante';
              const isCCAS = aid.id === 'ccas_local';

              return (
                <div
                  key={aid.id}
                  className={`bg-white rounded-2xl border transition-all shadow-xs overflow-hidden ${
                    isExpanded
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {/* Card Header clickable */}
                  <div
                    onClick={() => setExpandedAidId(isExpanded ? null : aid.id)}
                    className="p-5 flex items-start justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-xs ${
                          isPrime
                            ? 'bg-amber-600'
                            : isCheque
                            ? 'bg-emerald-600'
                            : isCSS
                            ? 'bg-teal-600'
                            : isCCAS
                            ? 'bg-indigo-600'
                            : 'bg-slate-800'
                        }`}
                      >
                        {isPrime && <Coins className="w-5 h-5 text-white" />}
                        {isCheque && <Zap className="w-5 h-5 text-white" />}
                        {isCSS && <Heart className="w-5 h-5 text-white" />}
                        {isCCAS && <Building className="w-5 h-5 text-white" />}
                        {!isPrime && !isCheque && !isCSS && !isCCAS && (
                          <GraduationCap className="w-5 h-5 text-white" />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm sm:text-base font-bold text-slate-900">
                            {aid.name}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {aid.organism}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {aid.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-base sm:text-lg font-black text-emerald-700">
                        {aid.estimatedMonthlyAmount > 0
                          ? `~${aid.estimatedMonthlyAmount} € / mois`
                          : `${aid.estimatedAnnualAmount} € / an`}
                      </div>
                      <div className="text-[10px] text-slate-400 font-semibold">
                        ({aid.estimatedAnnualAmount} € / an)
                      </div>
                      <div className="mt-1 flex justify-end text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-700" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content with Actions and Plume Link */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4 bg-slate-50/50">
                      {/* Why eligible explanation */}
                      <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Pourquoi vous êtes éligible selon vos données :</span>
                        </div>
                        <p className="leading-relaxed pl-5">{aid.whyEligible}</p>
                      </div>

                      {/* Counter & required documents */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-1">
                            🏛️ Guichet officiel compétent :
                          </span>
                          <p className="text-slate-600 leading-relaxed">{aid.counterGuichet}</p>
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-200">
                          <span className="font-bold text-slate-700 block mb-1">
                            📋 Pièces justificatives à réunir :
                          </span>
                          <ul className="list-disc list-inside text-slate-600 space-y-0.5 text-[11px]">
                            {aid.requiredDocuments.map((doc, idx) => (
                              <li key={idx}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Direct Bridge to PlumeCitoyenne to draft the official letter */}
                      <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                        {aid.officialUrl && (
                          <a
                            href={aid.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 underline underline-offset-2"
                          >
                            <span>Accéder au portail public officiel</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}

                        {onNavigateToPlumeWithPrompt && (
                          <button
                            onClick={() =>
                              onNavigateToPlumeWithPrompt(
                                aid.plumePresetPrompt,
                                aid.organism === 'CAF' ? 'CAF & Aides sociales' : 'Impôts & Recours financier'
                              )
                            }
                            className="ml-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <FileText className="w-3.5 h-3.5 text-amber-400" />
                            <span>Rédiger ma demande officielle (PlumeCitoyenne)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Social non-recourse note */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-amber-950 text-xs flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Simulateur à valeur indicative :</strong> Ce calcul local applique les barèmes
              nationaux en vigueur. Seule l'instruction finale par l'organisme (CAF, CPAM, CCAS)
              valide l'ouverture définitive des droits. N'hésitez jamais à déposer votre demande :
              c'est un droit citoyen républicain.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
