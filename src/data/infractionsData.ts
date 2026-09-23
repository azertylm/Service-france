import { InfractionDefinition, PointEvent } from '../types/permisprotect';

export const COMMON_INFRACTIONS: InfractionDefinition[] = [
  {
    id: 'vit_inf_20_sup_50',
    title: 'Excès de vitesse < 20 km/h (zone limitée à > 50 km/h)',
    category: 'vitesse',
    pointsLoss: 1,
    fineClass: 3,
    fineMinoree: 45,
    fineForfaitaire: 68,
    fineMajoree: 180,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 413-14 du Code de la route',
    description: 'Dépassement de moins de 20 km/h sur route nationale, départementale ou autoroute.'
  },
  {
    id: 'vit_inf_20_agglo',
    title: 'Excès de vitesse < 20 km/h en agglomération (zone ≤ 50 km/h)',
    category: 'vitesse',
    pointsLoss: 1,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 413-14 du Code de la route',
    description: 'Dépassement de moins de 20 km/h en ville, zone 30 ou agglomération.'
  },
  {
    id: 'vit_20_29',
    title: 'Excès de vitesse entre 20 km/h et 29 km/h',
    category: 'vitesse',
    pointsLoss: 2,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 413-14 du Code de la route',
    description: 'Vitesse retenue supérieure de 20 à 29 km/h par rapport à la vitesse maximale autorisée.'
  },
  {
    id: 'vit_30_39',
    title: 'Excès de vitesse entre 30 km/h et 39 km/h',
    category: 'vitesse',
    pointsLoss: 3,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 413-14 du Code de la route',
    description: 'Excès constaté par radar fixe, tourelle, mobile ou contrôle avec suspension possible.'
  },
  {
    id: 'vit_40_49',
    title: 'Excès de vitesse entre 40 km/h et 49 km/h',
    category: 'vitesse',
    pointsLoss: 4,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 413-14 du Code de la route',
    description: 'Suspension de permis jusqu’à 3 ans et obligation d’effectuer un stage possible.'
  },
  {
    id: 'feu_rouge_stop',
    title: 'Non-respect d’un feu rouge ou arrêt absolu au Stop',
    category: 'feu_stop',
    pointsLoss: 4,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 60,
    consignationRequiredForContest: true,
    legalArticle: 'Art. R. 412-30 et R. 415-6 du Code de la route',
    description: 'Franchissement de la ligne d’effet des feux ou non-marquage d’arrêt au panneau Stop.'
  },
  {
    id: 'telephone_main',
    title: 'Usage du téléphone tenu en main ou oreillettes/écouteurs',
    category: 'telephone',
    pointsLoss: 3,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 45,
    consignationRequiredForContest: false,
    legalArticle: 'Art. R. 412-6-1 du Code de la route',
    description: 'Téléphone tenu en main, consultation d’écran ou port d’écouteurs intra-auriculaires.'
  },
  {
    id: 'ligne_continue',
    title: 'Franchissement ou chevauchement d’une ligne continue',
    category: 'priorite_ligne',
    pointsLoss: 3,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 45,
    consignationRequiredForContest: false,
    legalArticle: 'Art. R. 412-19 du Code de la route',
    description: 'Franchissement total (3 points) ou chevauchement (1 point).'
  },
  {
    id: 'ceinture_securite',
    title: 'Défaut de port de la ceinture de sécurité',
    category: 'ceinture_casque',
    pointsLoss: 3,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 45,
    consignationRequiredForContest: false,
    legalArticle: 'Art. R. 412-1 du Code de la route',
    description: 'Circulation d’un conducteur non attaché par une ceinture de sécurité homologuée.'
  },
  {
    id: 'stationnement_tres_genant',
    title: 'Stationnement très gênant (trottoir, piste cyclable, passage piéton)',
    category: 'stationnement',
    pointsLoss: 0,
    fineClass: 4,
    fineMinoree: 135, // pas de minoration pour cette infraction
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 15,
    fineForfaitaireDelayDays: 45,
    consignationRequiredForContest: false,
    legalArticle: 'Art. R. 417-11 du Code de la route',
    description: 'Stationnement sur passage piéton, voie de bus, piste cyclable ou trottoir sans perte de point.'
  },
  {
    id: 'priorite_pieton',
    title: 'Refus de priorité à un piéton engagé ou manifestant l’intention',
    category: 'priorite_ligne',
    pointsLoss: 6,
    fineClass: 4,
    fineMinoree: 90,
    fineForfaitaire: 135,
    fineMajoree: 375,
    fineMinoreeInternetDelayDays: 30,
    fineForfaitaireDelayDays: 45,
    consignationRequiredForContest: false,
    legalArticle: 'Art. R. 415-11 du Code de la route',
    description: 'Non-respect de la priorité due aux piétons réguliers sur passage clouté ou abord.'
  }
];

/**
 * Calcul des délais stricts de paiement et de contestation :
 * - Date d'émission de l'avis de contravention
 * - Mode de paiement : télépaiement internet ANTAI (+15 jours de délai) vs courrier postal
 */
export function calculatePVDates(
  noticeDateStr: string,
  isRadarAutomatique: boolean,
  isInternetPayment: boolean
) {
  const noticeDate = new Date(noticeDateStr);
  if (isNaN(noticeDate.getTime())) {
    const today = new Date();
    return {
      dateNotice: today,
      dateLimitMinoree: today,
      dateLimitForfaitaire: today,
      dateLimitContest: today,
      daysRemainingMinoree: 0,
      daysRemainingContest: 0,
      isExpired: false
    };
  }

  // Délais légaux (Article 529-1 et 529-2 du Code de Procédure Pénale)
  // Radar automatique télépaiement en ligne : 30 jours pour le tarif minoré, 60 jours pour forfaitaire
  // Courrier classique : 15 jours minoré, 45 jours forfaitaire
  let delayMinoreeDays = 15;
  let delayForfaitaireDays = 45;
  let delayContestationDays = 45;

  if (isRadarAutomatique && isInternetPayment) {
    delayMinoreeDays = 30;
    delayForfaitaireDays = 60;
  } else if (!isRadarAutomatique && isInternetPayment) {
    delayMinoreeDays = 30;
    delayForfaitaireDays = 45;
  }

  // Pour la contestation : délai de 45 jours à compter de la date de l'avis
  delayContestationDays = isRadarAutomatique && isInternetPayment ? 60 : 45;

  const dateLimitMinoree = new Date(noticeDate);
  dateLimitMinoree.setDate(dateLimitMinoree.getDate() + delayMinoreeDays);

  const dateLimitForfaitaire = new Date(noticeDate);
  dateLimitForfaitaire.setDate(dateLimitForfaitaire.getDate() + delayForfaitaireDays);

  const dateLimitContest = new Date(noticeDate);
  dateLimitContest.setDate(dateLimitContest.getDate() + delayContestationDays);

  const now = new Date();
  const diffTimeMinoree = dateLimitMinoree.getTime() - now.getTime();
  const daysRemainingMinoree = Math.ceil(diffTimeMinoree / (1000 * 60 * 60 * 24));

  const diffTimeContest = dateLimitContest.getTime() - now.getTime();
  const daysRemainingContest = Math.ceil(diffTimeContest / (1000 * 60 * 60 * 24));

  return {
    dateNotice: noticeDate,
    dateLimitMinoree,
    dateLimitForfaitaire,
    dateLimitContest,
    daysRemainingMinoree,
    daysRemainingContest,
    isExpired: daysRemainingContest < 0
  };
}

/**
 * Calculateur de date estimée de récupération automatique de points
 * - 1 point : 6 mois sans infraction (Art. L223-6 al. 1)
 * - 2e ou 3e classe : 2 ans sans infraction (Art. L223-6 al. 2)
 * - 4e ou 5e classe : 3 ans sans infraction (Art. L223-6 al. 3)
 * - Règle des 10 ans : Chaque point est réattribué au bout de 10 ans quoi qu'il arrive (Art. L223-6 al. 4)
 */
export function estimatePointRestitutionDate(
  infractionDateStr: string,
  pointsLoss: number,
  fineClass: number
): { expectedDate: Date; ruleLabel: string } {
  const infDate = new Date(infractionDateStr);
  const target = new Date(infDate);

  if (pointsLoss === 1) {
    target.setMonth(target.getMonth() + 6);
    return {
      expectedDate: target,
      ruleLabel: '6 mois sans nouvelle infraction (Règle 1 point - Art. L223-6)'
    };
  } else if (fineClass <= 3) {
    target.setFullYear(target.getFullYear() + 2);
    return {
      expectedDate: target,
      ruleLabel: '2 ans sans nouvelle infraction (Contraventions classe 1 à 3)'
    };
  } else {
    target.setFullYear(target.getFullYear() + 3);
    return {
      expectedDate: target,
      ruleLabel: '3 ans sans nouvelle infraction (Contraventions classe 4 et 5)'
    };
  }
}
