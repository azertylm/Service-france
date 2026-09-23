export type DemarcheCategory =
  | 'transport'
  | 'etat_civil'
  | 'famille'
  | 'fiscalite_social'
  | 'logement'
  | 'justice_amende';

export interface RequiredDocument {
  id: string;
  label: string;
  description: string;
  mandatory: boolean;
  format: string;
  validityNotice?: string;
  tipAntiRejet: string;
}

export interface RoadmapStep {
  stepNumber: 1 | 2 | 3 | 4;
  title: string;
  objective: string;
  actions: string[];
  antiTrapAlert: string;
  checklist: string[];
}

export interface RejectionReason {
  reason: string;
  solution: string;
}

export interface DemarcheGuide {
  id: string;
  title: string;
  category: DemarcheCategory;
  administration: string;
  officialUrl: string;
  cost: string;
  delaiEstime: string;
  description: string;
  franceConnectRecommended: boolean;
  isOfficialServiceFree: boolean;
  warningAntiArnaque?: string;
  requiredDocuments: RequiredDocument[];
  fourStepsRoadmap: RoadmapStep[];
  commonRejectionReasons: RejectionReason[];
  helplinePhone?: string;
  legalBasis?: string;
}
