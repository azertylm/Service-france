export interface VigilancePoint {
  title: string;
  severity: 'ABUSIVE' | 'ILLÉGALE' | 'RISQUE_FORT' | 'ATTENTION';
  quote: string;
  decodedTrap: string;
  legalReference: string;
  recommendedAction: string;
}

export interface TerminationAndPenalties {
  noticePeriod: string;
  tacitRenewal: string;
  hiddenPenalties: string[];
  freeCancellationConditions: string;
}

export interface RealCommitments {
  financialSummary: string;
  keyObligations: string[];
  exclusionsAndBlindSpots: string[];
}

export interface NegotiationLetter {
  subject: string;
  body: string;
}

export interface ContractAnalysis {
  contractTitle: string;
  contractType: string;
  parties: {
    partyA: string;
    partyB: string;
  };
  summary: string;
  riskLevel: 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE';
  riskJustification: string;
  threeVigilancePoints: VigilancePoint[];
  terminationAndHiddenPenalties: TerminationAndPenalties;
  realCommitments: RealCommitments;
  negotiationLetterTemplate: NegotiationLetter;
  checklistBeforeSigning: string[];
}

export interface SavedContract {
  id: string;
  timestamp: number;
  title: string;
  type: string;
  riskLevel: 'FAIBLE' | 'MODERE' | 'ELEVE' | 'CRITIQUE';
  analysis: ContractAnalysis;
}

export interface SampleContract {
  id: string;
  title: string;
  category: string;
  shortDesc: string;
  knownTrapsCount: number;
  text: string;
}
