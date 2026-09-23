export type EdlPhotoCategory =
  | 'murs_plafonds'
  | 'sols_plinthes'
  | 'sanitaires_robinetterie'
  | 'electromenager'
  | 'portes_fenetres'
  | 'compteurs'
  | 'cles_badges'
  | 'autre';

export type EdlStage = 'entree' | 'sortie';

export type MeterType = 'eau_froide' | 'eau_chaude' | 'electricite' | 'gaz';

export interface MeterReading {
  meterType: MeterType;
  meterNumber?: string;
  indexValue: string;
  unit: 'm3' | 'kWh';
}

export interface EdlPhoto {
  id: string;
  title: string;
  room: string;
  category: EdlPhotoCategory;
  stage: EdlStage;
  photoUrl: string; // base64 data url
  dateTaken: string; // ISO string
  timestampLabel: string;
  sha256Fingerprint: string;
  notes?: string;
  meterReading?: MeterReading;
}

export type WearClassification =
  | 'VETUSTE_NORMALE'
  | 'DEGRADATION_LOCATIVE'
  | 'USAGE_MIXTE'
  | 'NON_IMPUTABLE_AU_LOCATAIRE';

export interface WearAnalysisResult {
  classification: WearClassification;
  confidenceScore: number; // 0-100
  title: string;
  summary: string;
  whoPays: 'PROPRIETAIRE_100' | 'LOCATAIRE_AVEC_VETUSTE' | 'LOCATAIRE_100';
  whoPaysLabel: string;
  legalBasis: string;
  depreciationDetails?: {
    equipmentCategory: string;
    theoreticalLifespanYears: number;
    annualDepreciationRate: number;
    occupancyDurationYears: number;
    calculatedDepreciationRate: number; // in %
    maxResidualRateAllowed: number; // in % (e.g. 10-20%)
    sharePayableByTenantPercent: number; // in %
    explanation: string;
  };
  keyArguments: string[];
  recommendedSteps: string[];
  jurisprudenceReference?: string;
}

export type DisputeReasonType =
  | 'retard_delai_legal'
  | 'retenue_vetuste_illegale'
  | 'retenue_sans_justificatif'
  | 'devis_exorbitant_sans_facture'
  | 'retard_et_retenue_abusive';

export interface DepositDisputeFormData {
  tenantName: string;
  tenantEmail: string;
  tenantPhone: string;
  newAddress: string;
  landlordOrAgencyName: string;
  landlordAddress: string;
  rentalAddress: string;
  leaseStartDate: string;
  leaseEndDate: string; // Date de remise des clés
  depositAmount: number;
  monthlyRentExcludingCharges: number;
  edlConformity: 'conforme' | 'non_conforme' | 'pas_dedl_sortie';
  retainedAmount: number;
  retainedReasonGiven?: string;
  disputeReason: DisputeReasonType;
  additionalDetails?: string;
}

export interface DepositDisputeLetter {
  senderBlock: string;
  recipientBlock: string;
  dateAndCity: string;
  subject: string;
  registeredMailMention: string;
  body: string;
  breakdown: {
    originalDeposit: number;
    amountAlreadyReturned: number;
    undueRetainedAmount: number;
    delayMonths: number;
    penaltyPerMonth: number;
    totalPenalty: number;
    totalClaimed: number;
  };
  legalReferences: string[];
}

export interface VetusteGridItem {
  id: string;
  name: string;
  category: EdlPhotoCategory;
  lifespanYears: number;
  franchiseYears: number;
  annualRatePercent: number;
  residualRatePercent: number; // Max charge to tenant at end of life
  source: string;
  description: string;
  examples: string[];
}
