import { SampleContract } from '../types/contract';

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'bail-meuble-paris',
    title: "Bail de location meublé (Appartement T2 Paris 11e)",
    category: "Bail d'habitation",
    shortDesc: "Bail type truffé de clauses abusives fréquentes : visites 7j/7, pénalités journalières de retard et interdiction des animaux.",
    knownTrapsCount: 4,
    text: `CONTRAT DE LOCATION DE LOGEMENT MEUBLÉ
Soumis au titre Ier bis de la loi du 6 juillet 1989 tendant à améliorer les rapports locatifs.

ENTRE LES SOUSSIGNÉS :
M. Robert DE KERVEN, domicilié au 14 rue de la Roquette, 75011 Paris, désigné ci-après « le Bailleur », d'une part,
ET
Mme Julie MERCIER, née le 12/04/1996, désignée ci-après « le Preneur » ou « le Locataire », d'autre part.

ARTICLE 1 - DÉSIGNATION DES LIEUX ET DURÉE
Logement sis 28 rue Oberkampf, 75011 Paris. Appartement 2 pièces de 38 m² meublé.
Le présent bail est consenti pour une durée de 1 an commençant à courir le 1er octobre.

ARTICLE 2 - LOYER ET CHARGES
Le loyer mensuel en principal est fixé à la somme de 1 250 € hors charges, plus une provision mensuelle pour charges de 120 €.
Paiement exigible le 1er de chaque mois d'avance par prélèvement automatique bancaire obligatoire imposé au locataire.
Clause pénale : En cas de retard de paiement supérieur à 5 jours ouvrés, le locataire sera redevable d'une pénalité forfaitaire de 150 euros par semaine de retard entamée, en sus d'intérêts moratoires au taux de 12% l'an.

ARTICLE 3 - DROIT DE VISITE ET D'ACCÈS DU BAILLEUR
Le Bailleur ou son mandataire se réserve expressément le droit de visiter les lieux loués à tout moment pour vérifier le bon état d'entretien, y compris les dimanches et jours fériés, sans obligation de préavis préalable. Le locataire s'interdit d'opposer tout refus d'accès.

ARTICLE 4 - USAGE DES LIEUX ET OBLIGATIONS PARTICULIÈRES
- Le locataire s'engage à ne recevoir aucun animal de compagnie, y compris chiens ou chats nains, sous peine de résiliation immédiate de plein droit.
- L'hébergement de toute personne tierce non mentionnée au contrat (conjoint, famille ou amis) pendant plus de 48 heures consécutives est strictement prohibé sans l'autorisation écrite préalable du Bailleur.
- En cas de départ, le Bailleur déduira automatiquement et forfaitairement 350 € sur le dépôt de garantie pour les frais de remise en peinture et nettoyage complet, indépendamment de l'état des lieux de sortie.

ARTICLE 5 - DÉPÔT DE GARANTIE ET RÉSILIATION
Dépôt de garantie fixé à 2 500 € (deux mois de loyer en principal).
Le locataire peut résilier le bail à tout moment sous réserve de respecter un préavis de 3 mois notifié par lettre recommandée avec accusé de réception. Tout mois commencé reste intégralement dû.

Fait à Paris, le 20 septembre, en deux exemplaires originaux.
Signatures précédées de la mention manuscrite « Bon pour accord »`,
  },
  {
    id: 'devis-artisan-sdb',
    title: "Devis d'artisan - Rénovation salle de bain (9 800 €)",
    category: "Devis de travaux / artisan",
    shortDesc: "Devis de plomberie et carrelage : aucun délai de livraison ferme, acompte abusif de 60% et clause d'exonération totale.",
    knownTrapsCount: 3,
    text: `DEVIS & PROPOSITION TARIFAIRE N° 2026-DEV-084
ENTREPRISE ART & EAU BATIMENT (SARL au capital de 1 000 €)
RCS Créteil - Non assujetti TVA selon mention

Client : M. et Mme Thomas DUPONT
Adresse chantier : 12 avenue des Lilas, 94100 Saint-Maur-des-Fossés
Date d'émission : 15/09/2026 - Validité : 15 jours

DÉSIGNATION DES TRAVAUX :
1. Dépose de l'ancienne baignoire fonte et évacuation des gravats : 1 200,00 €
2. Création douche à l'italienne, receveur 120x80, étanchéité sous carrelage : 3 400,00 €
3. Fourniture et pose carrelage mural grès cérame (24 m²) : 2 800,00 €
4. Reprise plomberie multicouche cuivre et raccordements : 1 600,00 €
5. Nettoyage de fin de chantier : 800,00 €
TOTAL NET À PAYER : 9 800,00 € TTC

CONDITIONS D'EXÉCUTION ET PAIEMENT :
- Acompte à la commande : 60% soit 5 880,00 € exigible à la signature, non remboursable sous aucun prétexte.
- Solde : 40% au premier jour du démarrage des travaux.
- Délais : Les travaux débuteront "au cours du dernier trimestre selon disponibilités des équipes et approvisionnements des fournisseurs". Aucune date butoir ni pénalité de retard ne saurait être opposée à l'entreprise.
- Exonération de responsabilité : L'entreprise décline toute responsabilité en cas de fuite d'eau, dégât des eaux chez le voisin ou détérioration des canalisations existantes pendant la durée des travaux. Le client conserve l'entière charge des recours tiers.
- Annulation par le client : Toute rétractation ou annulation du devis par le client après signature entraînera l'exigibilité immédiate d'une indemnité de dédommagement fixée à 50% du montant total du devis, en sus de l'acompte conservé.

Mention d'assurance décennale : "Assurance professionnelle en cours de renouvellement".
Bon pour accord et commande ferme le :`,
  },
  {
    id: 'assurance-habitation-mr',
    title: "Contrat d'assurance multirisque habitation (Police ProtecLogis)",
    category: "Contrat d'assurance",
    shortDesc: "Conditions particulières d'assurance avec franchise cachée quadruplée, délai de déclaration irréaliste et exclusions opaques.",
    knownTrapsCount: 3,
    text: `POLICE D'ASSURANCE MULTIRISQUE HABITATION « PROTEC-SERENITE »
Conditions Particulières n° POL-78451299-A
Société d'assurance MUTUALIS IARD - Régie par le Code des assurances

SOUSCRIPTEUR : M. Nicolas FONTAINE
Bien assuré : Résidence principale, Maison 4 pièces, 105 m² avec dépendance

COTISATION ANNUELLE : 492,00 € TTC avec prélèvement fractionné mensuel (frais de fractionnement de 9% en sus).

CLAUSES PARTICULIÈRES ET RESTRICTIONS DE GARANTIE :
ARTICLE 7 - DÉCLARATION DE SINISTRE ET DÉCHÉANCE DE GARANTIE
Tout sinistre (vol, dégât des eaux, bris de glace) doit être déclaré à la Compagnie par lettre recommandée exclusivement, sous un délai maximum et strict de 48 heures calendaires à compter de sa survenance. À défaut de respect scrupuleux de ce délai de 48 heures, l'assuré sera frappé de déchéance totale de ses droits à indemnisation pour le sinistre considéré.

ARTICLE 11 - FRANCHISES ET CONDITIONS D'APPLICATION
Franchise générale de base : 150 € par sinistre.
Toutefois, en cas de sinistre survenu en l'absence de l'assuré supérieure à 48 heures sans que l'arrivée générale d'eau n'ait été fermée et les volets métalliques verrouillés, la franchise applicable sera automatiquement portée à 2 500 € par dérogation expresse.

ARTICLE 14 - DURÉE DU CONTRAT ET RÉSILIATION
Le présent contrat est conclu pour une durée initiale ferme de 24 mois. Il se renouvelle ensuite tacitement d'année en année au 1er janvier. L'assuré ne peut demander la résiliation qu'en respectant un préavis minimum de 3 mois avant l'échéance annuelle, exclusivement par acte d'huissier de justice ou lettre recommandée avec AR. Aucune résiliation en cours d'année ne sera acceptée sans versement d'une indemnité de rupture de 180 €.`,
  },
  {
    id: 'salle-de-sport-fitplus',
    title: "Contrat d'adhésion salle de fitness (FitClub Premium)",
    category: "Conditions Générales / Abonnement",
    shortDesc: "Abonnement club de sport avec tacite reconduction opaque, motif médical restreint et frais de dossier abusifs.",
    knownTrapsCount: 3,
    text: `CONTRAT D'ADHÉSION ET CONDITIONS D'ABONNEMENT « FITCLUB INFINITY »
Société ATHLETA SAS au capital de 5 000 € - Établissement de remise en forme

ADHÉRENT : M. Laurent VERDIER
Formule choisie : Pass Illimité 7j/7 - Tarif : 49,99 € / mois pendant 12 mois.

ARTICLE 3 - ENGAGEMENT ET RECONDUCTION TACITE
L'abonnement comporte une période incompressible de 12 mois. À l'issue de cette période, l'abonnement sera reconduit automatiquement pour des périodes successives de 12 mois fermes, sauf dénonciation adressée par l'adhérent au plus tard 60 jours avant la date anniversaire, par courrier recommandé avec AR uniquement. Tout mois entamé est intégralement exigible.

ARTICLE 6 - RÉSILIATION POUR MOTIF MÉDICAL OU PROFESSIONNEL
Aucune suspension ni résiliation anticipée pour cause de maladie ou d'accident ne sera admise, sauf si l'incapacité permanente totale est confirmée par un médecin expert préalablement désigné et mandaté par le club aux frais de l'adhérent. Les certificats de médecins traitants sont réputés irrecevables. En tout état de cause, des frais administratifs forfaitaires de clôture de 120 € seront facturés.

ARTICLE 9 - MODIFICATION UNILATÉRALE DES HORAIRES ET SERVICES
Le club se réserve le droit de modifier à tout moment et sans préavis les horaires d'ouverture, de fermer certains espaces (sauna, cours collectifs) ou de supprimer des équipements sans que l'adhérent ne puisse prétendre à une quelconque indemnité ou réduction tarifaire.`,
  },
];
