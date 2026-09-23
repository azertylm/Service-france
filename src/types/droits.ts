export type HouseholdStatus = 'single' | 'couple';
export type HousingStatus = 'tenant' | 'owner' | 'free_lodging';

export interface DroitsUserInputs {
  householdStatus: HouseholdStatus;
  childrenCount: number;
  childrenAges: number[]; // ages for ARS (6-18)
  elderlyDependents: number; // +65 ans
  monthlyNetSalary: number; // Salaires nets mensuels du foyer
  monthlyOtherIncome: number; // Revenus de remplacement (chômage, pensions, etc.)
  annualTaxableIncome: number; // RFR annuel (dernière feuille d'impôt)
  housingStatus: HousingStatus;
  monthlyRentOrMortgage: number; // Loyer hors charges si locataire
  postalCode: string;
  cityName: string;
}

export interface AidEligibilityResult {
  id: string;
  name: string;
  organism: 'CAF' | 'CPAM' | 'Ministère Transition Écologique' | 'CCAS & Commune' | 'Département' | 'État & Éducation';
  category: 'Revenus & Activité' | 'Énergie & Factures' | 'Santé' | 'Logement' | 'Famille & Enfance';
  status: 'eligible' | 'likely_eligible' | 'not_eligible';
  estimatedMonthlyAmount: number; // in Euros
  estimatedAnnualAmount: number; // in Euros
  description: string;
  whyEligible: string;
  conditionsSummary: string;
  counterGuichet: string;
  requiredDocuments: string[];
  plumePresetPrompt: string; // To prefill PlumeCitoyenne in 1 click
  officialUrl?: string;
}

export interface DroitsCalculationSummary {
  totalEstimatedMonthly: number;
  totalEstimatedAnnual: number;
  eligibleAidsCount: number;
  aids: AidEligibilityResult[];
}
