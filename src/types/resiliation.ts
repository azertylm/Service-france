export type ResilCategory =
  | 'sport_loisirs'
  | 'telecom_internet'
  | 'assurance'
  | 'telesurveillance_habitat'
  | 'energie'
  | 'presse_streaming'
  | 'autre';

export type LegalGround =
  | 'loi_hamon' // Assurances > 1 an (Art. L. 113-15-2 Code des assurances)
  | 'loi_chatel' // Absence d'avis d'échéance ou avis tardif (Art. L. 215-1 Code de la conso)
  | 'resiliation_3_clics' // Loi n° 2022-1158 (Art. L. 215-1-1 Code de la conso)
  | 'hausse_tarifaire' // Hausse unilatérale sans accord (Art. L. 224-33 Code de la conso)
  | 'motif_legitime' // Déménagement / chômage / santé / inaptitude
  | 'retractation_14j' // Délai légal de rétractation (Art. L. 221-18 Code de la conso)
  | 'echeance_terme'; // Résiliation à échéance normale

export interface ResilProvider {
  id: string;
  name: string;
  category: ResilCategory;
  logoText?: string;
  serviceAddress: {
    recipientName: string;
    street: string;
    postalCode: string;
    city: string;
    cedex?: string;
  };
  supportedGrounds: LegalGround[];
  defaultGround: LegalGround;
  noticePeriodDays: number; // e.g. 30 days
  threeClicksUrl?: string; // Direct link to 3-clicks unsubscribe button if known
  tip: string;
  typicalMonthlyCost: number; // in Euros (e.g. 29.99)
}

export interface GeneratedLRAR {
  providerName: string;
  recipientAddress: string;
  senderInfo: {
    fullName: string;
    address: string;
    postalCode: string;
    city: string;
    phone: string;
    email: string;
    clientNumber: string;
    contractNumber: string;
  };
  legalGround: LegalGround;
  subject: string;
  body: string;
  dateStr: string;
  monthlySavings: number;
}

export interface SavedCancellation {
  id: string;
  providerName: string;
  category: ResilCategory;
  monthlyAmount: number;
  cancellationDate: string;
  legalGround: LegalGround;
  status: 'lettre_generee' | 'envoyee' | 'resiliation_confirmee';
}
