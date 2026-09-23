import React, { useState } from 'react';
import { Calculator, Calendar, ArrowRight, ShieldCheck, Copy, Check } from 'lucide-react';

interface NoticeRule {
  id: string;
  category: string;
  name: string;
  durationMonths: number;
  durationDays?: number;
  legalBasis: string;
  notes: string;
  letterSnippet: string;
}

const NOTICE_RULES: NoticeRule[] = [
  {
    id: 'bail-meuble',
    category: "Bail d'habitation",
    name: "Location meublée (Locataire)",
    durationMonths: 1,
    legalBasis: "Loi du 6 juillet 1989, article 25-8",
    notes: "Le locataire d'un meublé peut donner congé à TOUT moment avec un préavis d'un mois, sans avoir à motiver son départ.",
    letterSnippet: "Je vous notifie par la présente mon congé du logement meublé situé au [Adresse], conformément aux dispositions de l'article 25-8 de la loi n° 89-462 du 6 juillet 1989. Mon préavis de départ est fixé à un mois à compter de la réception de ce courrier.",
  },
  {
    id: 'bail-vide-tendue',
    category: "Bail d'habitation",
    name: "Location vide en « Zone tendue » (Loi ALUR)",
    durationMonths: 1,
    legalBasis: "Loi du 6 juillet 1989, article 15-I (Loi ALUR)",
    notes: "Toutes les grandes agglomérations (Paris, Lyon, Marseille, Bordeaux, Lille, Toulouse, Nice, etc.) sont en zone tendue. Le préavis est réduit à 1 mois de plein droit.",
    letterSnippet: "Je vous informe de ma décision de résilier le bail de location du logement sis [Adresse]. Le logement étant situé en zone tendue au sens du décret n° 2013-392, mon préavis est réduit à un mois conformément à l'article 15-I de la loi du 6 juillet 1989.",
  },
  {
    id: 'bail-vide-classique',
    category: "Bail d'habitation",
    name: "Location vide hors zone tendue (Régime standard)",
    durationMonths: 3,
    legalBasis: "Loi du 6 juillet 1989, article 15",
    notes: "Préavis de 3 mois de principe, sauf motif légitime de réduction à 1 mois (obtention d'un 1er emploi, mutation professionnelle, perte d'emploi, état de santé attesté par médecin, bénéficiaire du RSA).",
    letterSnippet: "Par ce courrier, je vous donne congé pour le logement que j'occupe au [Adresse]. Conformément à l'article 15 de la loi du 6 juillet 1989, le préavis légal de trois mois prendra effet à la date de réception de la présente lettre recommandée.",
  },
  {
    id: 'assurance-hamon',
    category: "Assurance",
    name: "Assurance auto, moto ou habitation de plus d'un an (Loi Hamon)",
    durationMonths: 1,
    legalBasis: "Code des assurances, article L. 113-15-2 (Loi Hamon)",
    notes: "Dès que votre contrat a plus de 12 mois d'ancienneté, vous pouvez résilier à TOUT moment sans frais ni pénalité. La résiliation prend effet un mois après notification.",
    letterSnippet: "Titulaire du contrat d'assurance n° [Numéro de police] souscrit le [Date], je vous informe que je souhaite résilier ce contrat en application de l'article L. 113-15-2 du Code des assurances (Loi Hamon), mon contrat ayant plus d'un an d'ancienneté.",
  },
  {
    id: 'abonnement-chatel',
    category: "Abonnement",
    name: "Abonnement annuel ou service à reconduction (Loi Châtel)",
    durationDays: 20,
    durationMonths: 0,
    legalBasis: "Code de la consommation, article L. 215-1 (Loi Châtel)",
    notes: "Le professionnel doit vous informer par écrit entre 3 mois et 1 mois avant la date limite de résiliation. S'il omet de le faire, vous pouvez résilier gratuitement et immédiatement à tout moment après l'échéance !",
    letterSnippet: "Je vous informe de ma volonté de résilier mon contrat n° [Numéro] en application de l'article L. 215-1 du Code de la consommation (Loi Châtel). Ne m'ayant pas informé par écrit dans les délais légaux de la date limite de résiliation, je résilie ce contrat sans frais avec effet immédiat.",
  },
  {
    id: 'artisan-retard',
    category: "Devis travaux",
    name: "Devis d'artisan avec retard de livraison > 30 jours",
    durationDays: 0,
    durationMonths: 0,
    legalBasis: "Code de la consommation, article L. 216-1 à L. 216-6",
    notes: "Si l'artisan dépasse la date limite promise de plus de 30 jours (ou un délai raisonnable), vous pouvez le mettre en demeure d'exécuter sous 15 jours, puis résoudre le contrat de plein droit et exiger le remboursement immédiat des acomptes.",
    letterSnippet: "Constatant le dépassement du délai de livraison convenu pour le devis n° [Numéro], je vous mets en demeure par la présente d'exécuter l'intégralité des travaux sous un délai impératif de 15 jours, à défaut de quoi le contrat sera résolu de plein droit conformément à l'article L. 216-2 du Code de la consommation.",
  },
];

export const NoticeSimulator: React.FC = () => {
  const [selectedRuleId, setSelectedRuleId] = useState<string>('bail-vide-tendue');
  const [targetDepartureDate, setTargetDepartureDate] = useState<string>(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 2);
    return d.toISOString().split('T')[0];
  });
  const [copied, setCopied] = useState(false);

  const selectedRule = NOTICE_RULES.find((r) => r.id === selectedRuleId) || NOTICE_RULES[0];

  // Calculation of deadline
  const departureDateObj = new Date(targetDepartureDate);
  const notificationDeadline = new Date(departureDateObj);
  if (selectedRule.durationMonths > 0) {
    notificationDeadline.setMonth(notificationDeadline.getMonth() - selectedRule.durationMonths);
  } else if (selectedRule.durationDays) {
    notificationDeadline.setDate(notificationDeadline.getDate() - selectedRule.durationDays);
  }

  // Recommended postal date (3-5 business days before deadline)
  const recommendedPostDate = new Date(notificationDeadline);
  recommendedPostDate.setDate(recommendedPostDate.getDate() - 5);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedRule.letterSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif-title">
          Simulateur de préavis & résiliation légale
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Calculez la date limite exacte pour donner congé ou résilier votre contrat sans pénalité selon le droit français en vigueur.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Controls Column */}
        <div className="md:col-span-1 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-2">
              Type de contrat & situation :
            </label>
            <div className="space-y-1.5">
              {NOTICE_RULES.map((rule) => (
                <button
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors ${
                    selectedRuleId === rule.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="text-[10px] opacity-75">{rule.category}</div>
                  <div>{rule.name}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Date souhaitée de fin de contrat :
            </label>
            <input
              type="date"
              value={targetDepartureDate}
              onChange={(e) => setTargetDepartureDate(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
            />
          </div>
        </div>

        {/* Results Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div>
              <div className="text-xs text-slate-500 font-mono">
                Fondement juridique applicable : {selectedRule.legalBasis}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1 font-serif-title">
                {selectedRule.name}
              </h2>
            </div>

            {/* Date Calculation Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-xs font-semibold text-slate-600 mb-1">
                  Date de réception max. requise :
                </div>
                <div className="text-lg font-bold text-slate-900 font-mono">
                  {notificationDeadline.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Le préavis démarre le jour où le destinataire signe l'AR (ou le jour de la remise en main propre).
                </p>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/60">
                <div className="text-xs font-semibold text-amber-900 mb-1">
                  Date d'envoi conseillée (LRAR) :
                </div>
                <div className="text-lg font-bold text-amber-950 font-mono">
                  {recommendedPostDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
                <p className="text-[11px] text-amber-800 mt-1">
                  Prévoyez 3 à 5 jours d'acheminement postal pour garantir la date de première présentation.
                </p>
              </div>
            </div>

            {/* Legal Explanation */}
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50 text-xs text-slate-700 leading-relaxed">
              <span className="font-semibold text-slate-900">Règle légale : </span>
              {selectedRule.notes}
            </div>

            {/* Model letter ready to copy */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-900">
                  Formule légale prête à insérer dans votre courrier :
                </span>
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded font-medium flex items-center gap-1 transition-colors"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copié' : 'Copier'}</span>
                </button>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-800 leading-relaxed">
                {selectedRule.letterSnippet}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
