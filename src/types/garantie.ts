export type WarrantyCategory =
  | 'electromenager'
  | 'smartphone_tablette'
  | 'informatique'
  | 'tv_son'
  | 'bricolage_jardin'
  | 'mobilier'
  | 'autre';

export interface ProductWarranty {
  id: string;
  productName: string;
  brand: string;
  modelReference?: string;
  category: WarrantyCategory;
  store: string;
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice?: number;
  receiptNumber?: string;
  serialNumber?: string;
  warrantyDurationMonths: number; // Defaut 24 mois (Code conso art. L217-3)
  warrantyEndDate: string; // YYYY-MM-DD
  hasCommercialExtension?: boolean;
  commercialExtensionMonths?: number;
  ticketImageData?: string; // Image base64 optimisée pour sauvegarde anti-effacement
  receiptType: 'ticket_de_caisse' | 'facture' | 'bon_de_livraison';
  notes?: string;
  eligibleBonusReparation?: boolean;
  estimatedBonusAmount?: number;
  createdAt: string;
}

export interface ExtractedWarrantyData {
  productName: string;
  brand: string;
  modelReference: string;
  category: WarrantyCategory;
  store: string;
  purchaseDate: string; // YYYY-MM-DD
  purchasePrice: number;
  receiptNumber: string;
  serialNumber: string;
  warrantyDurationMonths: number;
  hasCommercialExtension: boolean;
  commercialExtensionMonths: number;
  detectedVigilancePoints: string[];
  eligibleBonusReparation: boolean;
  estimatedBonusAmount: number;
}

export interface DisputeLetterDraft {
  subject: string;
  recipientStore: string;
  productDescription: string;
  defectDescription: string;
  legalArticles: string[];
  demandType: 'reparation_gratuite' | 'remplacement_neuf' | 'remboursement_integral';
  generatedDate: string;
  fullLetterText: string;
}
