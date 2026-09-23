import React, { useState } from 'react';
import { BookOpen, ShieldAlert, CheckCircle2, ChevronRight, HelpCircle, AlertCircle } from 'lucide-react';

export const RightsGuide: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'baux' | 'artisans' | 'assurances' | 'clauses_noires'>('baux');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-serif-title">
          Vos droits & boucliers légaux citoyens
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          En droit français, la loi protège expressément le citoyen face aux professionnels et bailleurs. Une clause abusive signée est réputée « non écrite » : elle n'a aucune valeur juridique !
        </p>
      </div>

      {/* Category selector */}
      <div className="flex border-b border-slate-200 gap-4 text-xs font-semibold overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedTopic('baux')}
          className={`py-2 px-1 border-b-2 transition-colors whitespace-nowrap ${
            selectedTopic === 'baux'
              ? 'border-slate-900 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Baux d'habitation (Loi 1989)
        </button>
        <button
          onClick={() => setSelectedTopic('artisans')}
          className={`py-2 px-1 border-b-2 transition-colors whitespace-nowrap ${
            selectedTopic === 'artisans'
              ? 'border-slate-900 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Devis de travaux & Artisans
        </button>
        <button
          onClick={() => setSelectedTopic('assurances')}
          className={`py-2 px-1 border-b-2 transition-colors whitespace-nowrap ${
            selectedTopic === 'assurances'
              ? 'border-slate-900 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Assurances & Abonnements
        </button>
        <button
          onClick={() => setSelectedTopic('clauses_noires')}
          className={`py-2 px-1 border-b-2 transition-colors whitespace-nowrap ${
            selectedTopic === 'clauses_noires'
              ? 'border-slate-900 text-slate-950'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Clauses Noires & Grises (Conso)
        </button>
      </div>

      {/* TOPIC 1: Baux d'habitation */}
      {selectedTopic === 'baux' && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Article 4 de la loi n° 89-462 du 6 juillet 1989</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-title">
            Les clauses strictement interdites dans un bail d'habitation
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Même si vous avez signé le contrat avec ces mentions, la loi prévoit qu'elles sont <strong className="text-slate-900 font-semibold">« réputées non écrites »</strong>. Le propriétaire ne peut jamais vous les imposer en justice :
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">1. Prélèvement automatique obligatoire</span>
              <p className="text-slate-600">
                Le bailleur ne peut pas vous imposer le prélèvement automatique ou la traite bancaire. Vous êtes libre de payer par virement, chèque ou espèces (jusqu'à 1 000 €).
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">2. Pénalités de retard de loyer</span>
              <p className="text-slate-600">
                Toute clause prévoyant une pénalité financière forfaitaire en cas de retard de paiement du loyer est expressément interdite par l'art. 4-i.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">3. Interdiction des animaux de compagnie</span>
              <p className="text-slate-600">
                La détention d'animaux familiers (chiens, chats, NAC ordinaires) ne peut pas être interdite, sauf chiens d'attaque de 1ère catégorie.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">4. Droit de visite les dimanches & jours fériés</span>
              <p className="text-slate-600">
                Le propriétaire ne peut imposer des visites pour vente ou relocation d'une durée supérieure à 2 heures par jour ouvrable, et jamais les dimanches ou jours fériés.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">5. Retenues forfaitaires sur dépôt de garantie</span>
              <p className="text-slate-600">
                Toute retenue sur la caution doit être justifiée par la comparaison entre état des lieux d'entrée et de sortie, appuyée de devis ou factures réelles. Aucune retenue forfaitaire automatique n'est légale.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
              <span className="font-semibold text-slate-900">6. Interdiction d'héberger des proches</span>
              <p className="text-slate-600">
                Le locataire dispose de la jouissance paisible de son logement et est libre d'héberger ses proches ou amis gratuitement sans accord préalable du bailleur.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 2: Devis d'artisans */}
      {selectedTopic === 'artisans' && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Code de la consommation art. L. 111-1 & L. 216-1 / Code civil art. 1792</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-title">
            Vérifications indispensables sur un devis de travaux
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Date ou délai ferme d'exécution obligatoire
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Les mentions vagues du type « selon approvisionnement » ou « fin d'année » sont illégales. Le devis doit comporter une date limite d'achèvement précise. En cas de dépassement supérieur à 30 jours, vous pouvez annuler le contrat et obtenir le remboursement immédiat de vos acomptes.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Attestation d'assurance décennale obligatoire
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Pour tous travaux touchant au gros œuvre, à l'étanchéité ou aux canalisations encastrées, l'artisan DOIT obligatoirement joindre son attestation d'assurance de responsabilité civile décennale avec le nom de l'assureur et la zone géographique couverte.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Plafond d'acompte à la commande
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Il est fortement déconseillé de verser plus de 20% à 30% d'acompte à la signature. Un échelonnement classique comprend : 30% à la commande, 40% à l'avancement, et le solde de 30% à la réception définitive après levée des réserves.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 3: Assurances */}
      {selectedTopic === 'assurances' && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Code des assurances art. L. 113-15-2 & L. 112-4</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-title">
            Assurances : Lois Hamon, Châtel et exclusions cachées
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Loi Hamon : Résiliation libre après 1 an
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Après la première année de contrat, vous pouvez résilier votre contrat d'assurance auto, moto ou habitation à tout moment, sans justification et sans pénalité. La résiliation prend effet un mois après réception de votre demande.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Exclusions de garantie en « caractères très apparents »
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Selon l'article L. 112-4 du Code des assurances, les clauses de déchéance ou d'exclusion doivent obligatoirement figurer en caractères très apparents (gras, encadré distinct ou couleur contrastée). À défaut, l'assureur ne peut pas vous les opposer !
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Délai légal de déclaration de sinistre
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Le délai légal minimum est de 5 jours ouvrés en règle générale (et 10 jours ouvrés pour les catastrophes naturelles). Une clause ramenant ce délai à 48 heures sous peine de déchéance totale est abusive et inopposable.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 4: Clauses Noires et Grises */}
      {selectedTopic === 'clauses_noires' && (
        <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <span>Code de la consommation art. R. 212-1 (Clauses noires) & R. 212-2 (Clauses grises)</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-serif-title">
            Clauses noires et clauses grises : qu'est-ce que c'est ?
          </h2>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-lg border border-rose-200 bg-rose-50/50">
              <h4 className="font-semibold text-rose-950 mb-1">
                Les « Clauses Noires » (Irrémédiablement abusives)
              </h4>
              <p className="text-rose-900 leading-relaxed">
                Ces 12 types de clauses sont interdites de manière absolue. Elles créent un déséquilibre manifeste au détriment du consommateur (ex : supprimer le droit à réparation en cas de faute du professionnel, permettre au professionnel de modifier unilatéralement le prix ou le produit sans accord). Le juge n'a même pas à examiner les circonstances : la clause est nulle de plein droit !
              </p>
            </div>

            <div className="p-4 rounded-lg border border-amber-200 bg-amber-50/50">
              <h4 className="font-semibold text-amber-950 mb-1">
                Les « Clauses Grises » (Présumées abusives)
              </h4>
              <p className="text-amber-900 leading-relaxed">
                Ces 10 types de clauses sont présumées abusives. C'est au professionnel de prouver qu'elles ne créent pas de déséquilibre excessif. Exemples : imposer des indemnités de résiliation disproportionnées, ou prévoir un délai de préavis excessif pour le consommateur.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <h4 className="font-semibold text-slate-900 mb-1">
                Que faire si vous avez déjà signé un contrat avec une clause abusive ?
              </h4>
              <p className="text-slate-600 leading-relaxed">
                Rassurez-vous : la présence d'une clause abusive n'invalide pas l'ensemble de votre contrat (vous ne perdez pas votre logement ou votre prestation). Seule la clause litigieuse est effacée, comme si elle n'avait jamais existé. Le reste du contrat continue de s'appliquer normalement.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
