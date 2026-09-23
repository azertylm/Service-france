import { LetterPreset } from '../types/plume';

export const LETTER_PRESETS: LetterPreset[] = [
  {
    id: 'caf-indu-apl',
    category: 'CAF & Aides sociales',
    label: 'CAF — Contestation d’indu (trop-perçu APL / RSA)',
    icon: '🏛️',
    situation:
      'La CAF me réclame le remboursement d’un trop-perçu de 850 € pour mes allocations de logement sur les six derniers mois. Or, j’ai toujours déclaré mes revenus scrupuleusement à temps sur mon espace en ligne et je suis actuellement dans une situation financière très précaire qui m’empêche totalement d’assumer une telle dette imprévue. Je demande un recours gracieux avec remise totale ou échelonnement.',
    userReferenceExample: 'Numéro Allocataire : 4589210 / Dossier n° TRP-2024-89',
    recipientDescription: 'Commission de Recours Amiable (CRA) de votre CAF départementale',
  },
  {
    id: 'impots-remise-gracieuse',
    category: 'Impôts & DGFIP',
    label: 'Impôts — Demande de remise gracieuse de pénalités',
    icon: '💶',
    situation:
      'J’ai reçu un avis de majoration de 10% pour retard de paiement de ma taxe foncière. Ce retard est dû à une hospitalisation d’urgence et à une perte temporaire de revenus le mois dernier. C’est mon premier retard de paiement en 8 ans. Je sollicite la bienveillance de l’administration fiscale pour obtenir la remise gracieuse de ces pénalités de retard.',
    userReferenceExample: 'Numéro fiscal : 18 56 94 321 004 / Avis n° 24 34 0098 71',
    recipientDescription: 'Service des Impôts des Particuliers (SIP) de votre domicile',
  },
  {
    id: 'cpam-refus-ij',
    category: 'CPAM & Santé',
    label: 'CPAM — Recours pour refus d’indemnités journalières',
    icon: '🩺',
    situation:
      'La CPAM refuse de me verser mes indemnités journalières suite à un arrêt maladie du 10 au 28 février, sous prétexte d’un prétendu retard d’envoi de mon volet 3 à mon employeur ou à la caisse. Or, j’ai la preuve de l’envoi postal dans les 48 heures prescrites par le médecin traitant. Je conteste formellement ce refus injustifié.',
    userReferenceExample: 'Numéro de Sécurité Sociale : 1 89 04 34 123 456 / 78',
    recipientDescription: 'Commission de Recours Amiable (CRA) de votre CPAM de rattachement',
  },
  {
    id: 'amende-fps-injuste',
    category: 'Amendes & Mobilité (ANTAI)',
    label: 'Amende / ANTAI — Contestation de forfait post-stationnement (FPS)',
    icon: '🚗',
    situation:
      'J’ai reçu un avis de paiement de forfait post-stationnement (FPS) de 35 € majoré alors que j’avais payé mon stationnement via l’application municipale (ticket dématérialisé à l’appui avec horodatage certifié). L’agent de contrôle ou la voiture scanneuse a visiblement commis une erreur de lecture de plaque d’immatriculation.',
    userReferenceExample: 'Numéro d’avis de paiement FPS : 34098231456 / Immatriculation : AB-123-CD',
    recipientDescription: 'Service du Recours Administratif Préalable Obligatoire (RAPO) de la Ville',
  },
  {
    id: 'bailleur-restitution-caution',
    category: 'Logement & Bailleur',
    label: 'Bailleur — Mise en demeure pour caution / dépôt de garantie',
    icon: '🔑',
    situation:
      'J’ai quitté mon appartement en location le 15 décembre dernier avec un état des lieux de sortie parfaitement conforme et sans aucune dégradation constatée. Le délai légal de restitution (un mois en cas de conformité) est largement dépassé, et mon propriétaire refuse de me répondre et retient mes 650 € de dépôt de garantie sans aucun devis ni justification.',
    userReferenceExample: 'Bail du logement : 12 rue des Pins, 34280 / État des lieux du 15/12/2024',
    recipientDescription: 'Propriétaire bailleur ou agence gestionnaire',
  },
  {
    id: 'voisinage-nuisances-sonores',
    category: 'Litiges de voisinage',
    label: 'Voisinage — Courrier amiable pour nuisances sonores répétées',
    icon: '📢',
    situation:
      'Mon voisin du dessus organise des fêtes musicales récurrentes jusqu’à 4h du matin plusieurs soirs par semaine et fait claquer des objets lourds au sol. Les démarches verbales et cordiales sont restées sans effet. J’envoie un courrier officiel de mise en garde amiable avant de saisir le conciliateur de justice ou le syndic de copropriété.',
    userReferenceExample: 'Copropriété Les Tamaris, Appartement 302 / Main courante n° 2024/491',
    recipientDescription: 'Voisin occupant ou propriétaire de l’appartement concerné',
  },
  {
    id: 'france-travail-radiation',
    category: 'France Travail & Emploi',
    label: 'France Travail — Recours suite à avertissement ou radiation',
    icon: '💼',
    situation:
      'France Travail m’a adressé un avertissement de radiation pour une prétendue absence à un entretien de suivi le 12 janvier. Or, je n’ai jamais reçu de convocation par voie postale ni notification par courriel, et j’étais d’ailleurs en entretien d’embauche réel ce même jour avec attestation écrite du recruteur.',
    userReferenceExample: 'Identifiant France Travail : 8945201-Z / Décision n° FT-2024-019',
    recipientDescription: 'Monsieur le Directeur de l’agence France Travail locale',
  },
];
