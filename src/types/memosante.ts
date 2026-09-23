export type RelationshipType =
  | 'Moi'
  | 'Conjoint(e)'
  | 'Enfant'
  | 'Parent'
  | 'Autre proche';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: RelationshipType;
  birthDate?: string;
  bloodGroup?: string;
  treatingDoctor?: string;
  emergencyContact?: string;
  notes?: string;
}

export interface VaccineRecord {
  id: string;
  memberId: string;
  vaccineName: string;
  targetDisease: string;
  administeredDate?: string;
  boosterDate?: string;
  recommendedAge?: string;
  status: 'up_to_date' | 'booster_due' | 'to_schedule';
  batchNumber?: string;
  notes?: string;
}

export type AllergySeverity = 'Légère' | 'Modérée' | 'Sévère' | 'Urgence Vitale (Choc)';

export interface AllergyRecord {
  id: string;
  memberId: string;
  allergen: string;
  type: 'Médicamenteuse' | 'Alimentaire' | 'Respiratoire / Contact' | 'Autre';
  severity: AllergySeverity;
  reactionDescription: string;
  emergencyAction?: string;
}

export interface PrescriptionRecord {
  id: string;
  memberId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribingDoctor?: string;
  active: boolean;
  renewalAlertDate?: string;
}

export interface MedicalAppointment {
  id: string;
  memberId: string;
  practitionerName: string;
  specialty: string;
  dateTime: string;
  location?: string;
  questionsToAsk: string[];
  notes?: string;
}

export interface DecodedTerm {
  technicalTerm: string;
  plainFrenchTranslation: string;
  biologicalRole: string;
  typicalContext: string;
}

export interface MedicalReportExplanation {
  reportTitle: string;
  reportType: string;
  generalSummary: string;
  decodedTerms: DecodedTerm[];
  keyQuestionsForDoctor: string[];
  criticalNotice: string;
}

export interface SavedReport {
  id: string;
  timestamp: number;
  memberId?: string;
  title: string;
  explanation: MedicalReportExplanation;
}
