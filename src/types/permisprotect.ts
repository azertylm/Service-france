export type InfractionCategory =
  | 'vitesse'
  | 'feu_stop'
  | 'telephone'
  | 'stationnement'
  | 'ceinture_casque'
  | 'priorite_ligne'
  | 'alcool_stupefiant'
  | 'autre';

export interface InfractionDefinition {
  id: string;
  codeNatinf?: string;
  title: string;
  category: InfractionCategory;
  pointsLoss: number; // 0 à 6
  fineClass: 1 | 2 | 3 | 4 | 5;
  fineMinoree: number; // ex: 90€ (4e classe) ou 45€ (3e classe)
  fineForfaitaire: number; // ex: 135€ (4e classe) ou 68€ (3e classe)
  fineMajoree: number; // ex: 375€
  fineMinoreeInternetDelayDays: number; // 30 jours pour télépaiement radar auto (sinon 15 jours)
  fineForfaitaireDelayDays: number; // 45 jours (ou 60 jours si télépaiement radar auto)
  consignationRequiredForContest: boolean; // 135€ de consignation obligatoire dans certains cas (radar auto cas n°3)
  legalArticle: string; // ex: "Art. R. 413-14 du Code de la route"
  description: string;
}

export type ContestationReason =
  | 'cas_1_usurpation_vol' // Cas 1 ANTAI : Véhicule volé, détruit, ou usurpation de plaque d'immatriculation (doublette)
  | 'cas_2_designation_conducteur' // Cas 2 ANTAI : Véhicule prêté, loué, ou vendu / cession
  | 'cas_3_photo_non_probante' // Cas 3 ANTAI : Flash par l'arrière, cliché flou / conducteur non identifiable (Art. L121-3)
  | 'cas_3_signalisation_panneau' // Cas 3 ANTAI : Panneau masqué, zone de travaux mal délimitée, incohérence signalisation
  | 'cas_3_urgence_force_majeure' // Cas 3 ANTAI : Nécessité vitale / urgence médicale justifiée
  | 'stationnement_injustifie'; // Pour FPS ou stationnement payant / PMR régulier

export interface PointEvent {
  id: string;
  date: string;
  infractionTitle: string;
  pointsDeducted: number;
  fineClass: number;
  restituted: boolean;
  expectedRestitutionDate: string; // calculé selon délai légal (6 mois, 2 ans, 3 ans, 10 ans)
  restitutionRule: string; // "6 mois (1 pt sans récidive)", "2 ans", "3 ans", "10 ans (terme légal)"
  notes?: string;
}

export interface PVAnalysisInput {
  noticeNumber: string; // 10 chiffres (avis ANTAI)
  noticeDate: string; // Date de l'avis
  infractionDate: string; // Date de l'infraction constatée
  infractionTime?: string;
  location?: string;
  vehiclePlate: string;
  selectedInfractionId: string;
  isRadarAutomatique: boolean;
  paymentMethod: 'internet' | 'courrier_bancaire';
}
