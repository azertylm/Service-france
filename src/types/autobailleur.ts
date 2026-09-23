export interface IRLIndex {
  year: number;
  quarter: 1 | 2 | 3 | 4;
  label: string; // e.g., "T1 2026"
  value: number;
  publishedDate: string; // e.g., "15 avril 2026"
}

export type ChargeCategoryType =
  | 'eau'
  | 'chauffage'
  | 'ascenseur'
  | 'parties_communes'
  | 'espaces_verts'
  | 'taxes'
  | 'syndic_gestion'
  | 'gros_travaux';

export interface ChargeItem {
  id: string;
  name: string;
  category: ChargeCategoryType;
  totalInvoiceAmount: number; // Total facturé pour l'immeuble ou le logement
  tantiemes: number; // ex: 120 sur 1000 tantièmes, ou 100% si logement individuel
  baseTantiemes: number; // default 1000
  recuperablePercentage: number; // 100% si entièrement récupérable, 73% pour ascenseur selon décret, 0% si syndic
  isRecuperable: boolean; // true si récupérable sur le locataire (Décret 87-713)
  legalNote: string;
  notes?: string;
}

export interface AutoBailleurProperty {
  id: string;
  propertyLabel: string; // "Studio Rue Paradis"
  address: string;
  city: string;
  postalCode: string;
  tenantFullName: string;
  tenantEmail: string;
  tenantPhone: string;
  leaseStartDate: string; // e.g. "2023-09-01"
  anniversaryMonth: number; // 1 to 12
  baseRentExcludingCharges: number; // Loyer nu
  monthlyChargesProvision: number; // Provision mensuelle sur charges
  securityDeposit: number; // Dépôt de garantie
  baselineIRLQuarter: string; // e.g. "T2 2023"
  baselineIRLValue: number; // e.g. 140.59
  paymentMethod: 'Virement bancaire' | 'Prélèvement automatique' | 'Chèque' | 'Espèces';
}

export interface RentReceiptData {
  receiptNumber: string;
  periodMonth: number; // 1 to 12
  periodYear: number;
  paymentDate: string;
  paymentMethod: string;
  rentAmount: number;
  chargesProvision: number;
  aplDeduction: number; // Montant CAF tiers payant le cas échéant
  totalPaid: number;
}
