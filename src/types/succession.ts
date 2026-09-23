export type SuccessionTimeframe = '48h' | '7j' | '30j' | '6m';

export type OrganismCategory =
  | 'etat_civil'
  | 'employeur_chomage'
  | 'bancaire'
  | 'logement_fournisseurs'
  | 'protection_sociale'
  | 'fiscalite_patrimoine'
  | 'notaire_succession'
  | 'divers';

export interface SuccessionOrganism {
  id: string;
  name: string;
  category: OrganismCategory;
  categoryLabel: string;
  timeframe: SuccessionTimeframe;
  priority: 'URGENT' | 'IMPORTANT' | 'RECOMMANDE';
  description: string;
  legalDeadline: string;
  legalBasis: string;
  whyCrucial: string;
  documentsRequired: string[];
  stopsDirectDebits: boolean;
  defaultRecipientName: string;
  defaultRecipientAddress: string;
  letterSubjectTemplate: string;
  letterBodyTemplate: (data: SuccessionFormData) => string;
  tips: string[];
}

export interface SuccessionFormData {
  // Deceased information
  deceasedFullName: string;
  deceasedGender: 'M' | 'F';
  deceasedBirthDate: string;
  deceasedBirthPlace: string;
  deceasedDeathDate: string;
  deceasedDeathPlace: string;
  deceasedAddress: string;
  deceasedSocialSecurityNumber: string;
  deceasedTaxNumber: string;

  // Declarant / Heir information
  declarantFullName: string;
  declarantRelationship: string; // "Fils", "Fille", "Conjoint survivant", "Frère", etc.
  declarantAddress: string;
  declarantPhone: string;
  declarantEmail: string;

  // Specific contracts info
  bankName: string;
  bankIban: string;
  landlordOrAgencyName: string;
  landlordAddress: string;
  retirementFundNames: string;
  mutualFundName: string;
  employerName: string;
  notaryName: string;
  notaryAddress: string;

  // Custom details
  actNumber?: string;
  additionalComments?: string;
}

export interface SavedSuccessionStep {
  organismId: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
  letterSent?: boolean;
  registeredMailTracking?: string;
}
