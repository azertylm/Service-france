export type AdministrativeCategory =
  | 'CAF & Aides sociales'
  | 'Impôts & DGFIP'
  | 'CPAM & Santé'
  | 'Amendes & Mobilité (ANTAI)'
  | 'Logement & Bailleur'
  | 'Litiges de voisinage'
  | 'France Travail & Emploi'
  | 'Autre démarche';

export interface ProcedureStep {
  stepNumber: number;
  title: string;
  action: string;
}

export interface TargetCounter {
  name: string;
  addressGuidance: string;
  onlineAlternative?: string;
}

export interface GeneratedLetter {
  letterTitle: string;
  officialSubject: string;
  legalReferences: string[];
  fullLetterContent: string;
  procedureStepByStep: ProcedureStep[];
  targetCounter: TargetCounter;
  requiredDocuments: string[];
  recommendedDelivery: string;
  criticalDeadlines: string;
  citizenAdvise: string;
}

export interface SavedLetter {
  id: string;
  timestamp: number;
  category: AdministrativeCategory;
  userPromptSummary: string;
  letter: GeneratedLetter;
}

export interface LetterPreset {
  id: string;
  category: AdministrativeCategory;
  label: string;
  icon: string;
  situation: string;
  userReferenceExample: string;
  recipientDescription: string;
}
