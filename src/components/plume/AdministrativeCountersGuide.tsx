import React, { useState } from 'react';
import {
  Building2,
  Clock,
  ShieldCheck,
  Scale,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck,
  Search,
} from 'lucide-react';

interface CounterInfo {
  id: string;
  category: string;
  name: string;
  organ: string;
  firstStep: string;
  delay: string;
  escalation: string;
  onlineLink?: string;
  tips: string;
}

const COUNTERS_LIST: CounterInfo[] = [
  {
    id: 'caf',
    category: 'Aides sociales & Famille',
    name: 'Caisse d’Allocations Familiales (CAF)',
    organ: 'Commission de Recours Amiable (CRA) de votre CAF départementale',
    firstStep:
      'Envoyer un recours gracieux écrit en Recommandé avec AR exposant votre bonne foi, vos justificatifs de revenus et votre situation familiale.',
    delay: '2 mois francs à compter de la notification de la décision contestée.',
    escalation:
      'Si refus ou absence de réponse sous 2 mois : saisine du Médiateur de la CAF, puis recours devant le Pôle Social du Tribunal Judiciaire.',
    onlineLink: 'https://www.caf.fr',
    tips: 'Mentionnez toujours « Recours Gracieux Préalable Obligatoire » dans l’objet de votre courrier.',
  },
  {
    id: 'impots',
    category: 'Fiscalité & DGFIP',
    name: 'Service des Impôts des Particuliers (SIP)',
    organ: 'Conciliateur Fiscal Départemental & Service Contentieux de la DGFIP',
    firstStep:
      'Déposer une réclamation contentieuse ou une demande de remise gracieuse de pénalités via la messagerie sécurisée d’impots.gouv.fr ou par lettre recommandée.',
    delay:
      'Jusqu’au 31 décembre de la 2e année suivant celle de la mise en recouvrement de l’impôt.',
    escalation:
      'En cas de rejet : saisine gratuite du Conciliateur Fiscal Départemental, puis du Médiateur des ministères économiques et financiers.',
    onlineLink: 'https://www.impots.gouv.fr',
    tips: 'Une demande de remise gracieuse n’interrompt pas les poursuites : demandez expressément un sursis de paiement.',
  },
  {
    id: 'cpam',
    category: 'Santé & Sécurité Sociale',
    name: 'Caisse Primaire d’Assurance Maladie (CPAM)',
    organ: 'Commission de Recours Amiable (CRA) de la CPAM',
    firstStep:
      'Formuler une contestation écrite adressée au secrétariat de la CRA par lettre recommandée avec AR en joignant tous les volets médicaux.',
    delay: '2 mois francs à compter de la notification du refus de prise en charge.',
    escalation:
      'Saisine du Médiateur de l’Assurance Maladie sous 1 mois, puis saisine du Pôle Social du Tribunal Judiciaire.',
    onlineLink: 'https://www.ameli.fr',
    tips: 'Pour une contestation d’ordre strictement médical (taux d’incapacité), demandez une expertise médicale plutôt qu’un recours CRA.',
  },
  {
    id: 'antai-fps',
    category: 'Mobilité & Contraventions',
    name: 'Stationnement & Amendes (ANTAI / FPS)',
    organ: 'Recours Administratif Préalable Obligatoire (RAPO) / CCSP',
    firstStep:
      'Pour un forfait post-stationnement (FPS) : déposer un RAPO auprès de la collectivité ou de la société délégataire indiquée au verso de l’avis.',
    delay: '1 mois à compter de la date de notification du titre de paiement FPS.',
    escalation:
      'Si le RAPO est rejeté : recours devant la Commission du Contentieux du Stationnement Payant (CCSP) à Limoges sous 1 mois.',
    onlineLink: 'https://www.antai.gouv.fr',
    tips: 'Fournissez le ticket d’horodateur horodaté ou la capture d’écran de l’application de paiement mobile certifiée.',
  },
  {
    id: 'voisinage-bailleur',
    category: 'Vie quotidienne & Logement',
    name: 'Litiges Locatifs & Troubles de Voisinage',
    organ: 'Le Conciliateur de Justice (Mairie ou Point-Justice)',
    firstStep:
      'Adresser d’abord une mise en demeure formelle en LRAR avec délai d’exécution de 8 jours. Sans accord, saisir le Conciliateur de Justice.',
    delay: 'Obligatoire avant tout procès civil pour les litiges du quotidien inférieurs à 5 000 €.',
    escalation:
      'Séance de conciliation amiable gratuite en mairie. Si échec : procès-verbal de non-conciliation permettant de saisir le Juge des Contentieux de la Protection.',
    onlineLink: 'https://www.conciliateurs.fr',
    tips: 'La conciliation de justice est 100% gratuite, neutre et confidentielle.',
  },
  {
    id: 'defenseur-droits',
    category: 'Recours Suprême Citoyen',
    name: 'Le Défenseur des Droits',
    organ: 'Délégué départemental du Défenseur des Droits (Autorité Constitutionnelle)',
    firstStep:
      'Saisir gratuitement le délégué local si vous estimez que vos droits fondamentaux ne sont pas respectés par une administration ou en cas de discrimination.',
    delay: 'Pas de délai de forclusion strict, mais après avoir tenté une première démarche vaine.',
    escalation:
      'Le Défenseur des Droits peut enjoindre l’administration, émettre des recommandations publiques ou intervenir devant les tribunaux.',
    onlineLink: 'https://www.defenseurdesdroits.fr',
    tips: 'Le délégué tient des permanences gratuites sans avocat en mairie ou sous-préfecture.',
  },
];

export const AdministrativeCountersGuide: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>('caf');

  const filteredCounters = COUNTERS_LIST.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.organ.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Guide des guichets & voies de recours en France
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Sachez exactement à quelle commission, médiateur ou conciliateur gratuit vous adresser sans intermédiaire payant.
          </p>
        </div>

        <div className="relative w-full md:w-72 shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrer (CAF, Impôts, Conciliateur...)"
            className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Counters Accordion Grid */}
      <div className="space-y-3.5">
        {filteredCounters.map((counter) => {
          const isExpanded = expandedId === counter.id;

          return (
            <div
              key={counter.id}
              className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? 'border-slate-900 shadow-md ring-1 ring-slate-900/10' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : counter.id)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold text-base shrink-0">
                    <Building2 className="w-5 h-5 text-slate-800" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {counter.category}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">{counter.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{counter.organ}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 shrink-0">
                  <span className="text-xs font-medium hidden sm:inline">
                    {isExpanded ? 'Masquer le protocole' : 'Voir le protocole'}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-slate-100 space-y-4 text-xs animate-in fade-in duration-200">
                  {/* Step 1 & Deadlines */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                      <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-indigo-600" />
                        1re étape : Recours préalable obligatoire
                      </strong>
                      <p className="text-slate-700 leading-relaxed">{counter.firstStep}</p>
                    </div>

                    <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 space-y-1">
                      <strong className="text-rose-900 font-bold block flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-rose-600" />
                        Délai légal de forclusion
                      </strong>
                      <p className="text-rose-950 font-medium leading-relaxed">{counter.delay}</p>
                    </div>
                  </div>

                  {/* Escalation & Next steps */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                    <strong className="text-slate-900 font-bold block flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-amber-600" />
                      En cas de désaccord persistant (Médiation & Justice)
                    </strong>
                    <p className="text-slate-700 leading-relaxed">{counter.escalation}</p>
                  </div>

                  {/* Tips & Link */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-slate-600 border-t border-slate-100">
                    <span className="italic text-purple-900 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200">
                      💡 <strong>Conseil :</strong> {counter.tips}
                    </span>

                    {counter.onlineLink && (
                      <a
                        href={counter.onlineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 text-xs shrink-0"
                      >
                        <span>Portail officiel</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
