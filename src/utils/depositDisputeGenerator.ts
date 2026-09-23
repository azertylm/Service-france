import { DepositDisputeFormData, DepositDisputeLetter } from '../types/etatDesLieux';

/**
 * Calcule les délais légaux de restitution et les pénalités de retard
 * selon l'article 22 de la Loi n° 89-462 du 6 juillet 1989 modifiée par la Loi ALUR.
 */
export function calculateDepositTimeline(
  leaseEndDateStr: string,
  edlConformity: 'conforme' | 'non_conforme' | 'pas_dedl_sortie',
  monthlyRent: number
) {
  const endDate = new Date(leaseEndDateStr);
  const now = new Date();

  // 1 mois si conforme, 2 mois si dégradations notées
  const legalDelayMonths = edlConformity === 'conforme' ? 1 : 2;

  const maxRestitutionDate = new Date(endDate);
  maxRestitutionDate.setMonth(maxRestitutionDate.getMonth() + legalDelayMonths);

  const isOverdue = now > maxRestitutionDate;

  let lateMonthsCount = 0;
  if (isOverdue) {
    // Calcul précis du nombre de mois entamés
    const diffTime = Math.max(0, now.getTime() - maxRestitutionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Chaque mois commencé compte comme 1 mois plein pour la pénalité de 10%
    lateMonthsCount = Math.max(1, Math.ceil(diffDays / 30.4375));
  }

  // Pénalité légale = 10% du loyer mensuel hors charges par mois de retard commencé
  const penaltyPerMonth = Math.round(monthlyRent * 0.1 * 100) / 100;
  const totalPenalty = Math.round(lateMonthsCount * penaltyPerMonth * 100) / 100;

  return {
    legalDelayMonths,
    maxRestitutionDate,
    maxRestitutionDateFormatted: maxRestitutionDate.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    isOverdue,
    lateMonthsCount,
    penaltyPerMonth,
    totalPenalty,
  };
}

/**
 * Générateur officiel du courrier recommandé de mise en demeure
 * pour restitution du dépôt de garantie et contestation de retenues abusives.
 */
export function generateDepositDisputeLetter(data: DepositDisputeFormData): DepositDisputeLetter {
  const timeline = calculateDepositTimeline(
    data.leaseEndDate,
    data.edlConformity,
    data.monthlyRentExcludingCharges
  );

  const todayStr = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const leaseStartDateFormatted = new Date(data.leaseStartDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const leaseEndDateFormatted = new Date(data.leaseEndDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const senderBlock = `${data.tenantName.trim()}
${data.newAddress.trim()}
${data.tenantEmail ? `Courriel : ${data.tenantEmail.trim()}` : ''}
${data.tenantPhone ? `Tél. : ${data.tenantPhone.trim()}` : ''}`.trim();

  const recipientBlock = `${data.landlordOrAgencyName.trim()}
${data.landlordAddress.trim()}`.trim();

  const registeredMailMention = 'LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION (LRAR)';

  let subject = `MISE EN DEMEURE — Restitution du dépôt de garantie`;
  if (data.disputeReason === 'retenue_vetuste_illegale' || data.disputeReason === 'retenue_sans_justificatif') {
    subject += ` et contestation formelle de retenues indues`;
  }
  subject += ` (Logement sis : ${data.rentalAddress.trim()})`;

  const amountAlreadyReturned = Math.max(0, data.depositAmount - data.retainedAmount);
  const undueRetainedAmount = data.retainedAmount > 0 ? data.retainedAmount : data.depositAmount;
  const totalClaimed = Math.round((undueRetainedAmount + timeline.totalPenalty) * 100) / 100;

  // Construct legal body paragraphs
  let body = `Madame, Monsieur,\n\n`;

  body += `J'occupais en qualité de locataire le logement situé à l'adresse suivante :\n`;
  body += `👉 ${data.rentalAddress.trim()},\n`;
  body += `en vertu d'un bail conclu le ${leaseStartDateFormatted}.\n\n`;

  body += `Le bail a pris fin le ${leaseEndDateFormatted}, date à laquelle a été contradictoirement établi l'état des lieux de sortie et où je vous ai restitué l'intégralité des clés du logement contre émargement.\n\n`;

  // Section 1: Délais et retard
  if (timeline.isOverdue) {
    body += `1. DÉPASSEMENT DU DÉLAI LÉGAL DE RESTITUTION (ART. 22 LOI DU 6 JUILLET 1989)\n`;
    body += `Conformément à l'article 22 de la loi n° 89-462 du 6 juillet 1989 (modifiée par la loi ALUR), le dépôt de garantie d'un montant initial de ${data.depositAmount.toLocaleString('fr-FR')} € devait m'être restitué au plus tard le ${timeline.maxRestitutionDateFormatted} (délai impératif de ${timeline.legalDelayMonths} mois à compter de la remise des clés).\n\n`;
    body += `À ce jour, le délai légal est largement forclos. La loi dispose expressément que :\n`;
    body += `« À défaut de restitution dans les délais prévus, le dépôt de garantie restant dû au locataire est majoré d'une somme égale à 10 % du loyer mensuel en principal, pour chaque mois de retard commencé. »\n\n`;
    body += `Sur la base d'un loyer mensuel hors charges de ${data.monthlyRentExcludingCharges.toLocaleString('fr-FR')} €, la pénalité s'élève à ${timeline.penaltyPerMonth.toLocaleString('fr-FR')} € par mois de retard commencé.\n`;
    body += `Avec un retard constaté de ${timeline.lateMonthsCount} mois commencé(s), la pénalité légale due de plein droit s'élève à :\n`;
    body += `👉 ${timeline.totalPenalty.toLocaleString('fr-FR')} €.\n\n`;
  }

  // Section 2: Contestation des retenues
  if (data.retainedAmount > 0) {
    body += `2. CONTESTATION FORMELLE DES RETENUES APPLIQUÉES\n`;
    body += `Vous avez opéré une retenue de ${data.retainedAmount.toLocaleString('fr-FR')} € sur le dépôt de garantie${data.retainedReasonGiven ? ` au motif de : « ${data.retainedReasonGiven} »` : ''}.\n\n`;

    if (data.disputeReason === 'retenue_vetuste_illegale') {
      body += `Je conteste formellement le bien-fondé de cette déduction. Les altérations reprochées relèvent manifestement de la VÉTUSTÉ NORMALE et de l'usure du temps, et nullement d'une dégradation locative.\n\n`;
      body += `En application de l'article 7 alinéa d de la loi du 6 juillet 1989 et du décret n° 2016-382 du 30 mars 2016, le locataire est déchargé de toute remise en état liée à la vétusté ou à l'usage normal de la chose louée. En outre, aucune grille de vétusté n'a été appliquée pour tenir compte de la durée de mon occupation (${timeline.legalDelayMonths > 1 ? 'plusieurs années' : 'durée du bail'}). Les frais de réfection intégrale incombent exclusivement au bailleur.\n\n`;
    } else if (data.disputeReason === 'retenue_sans_justificatif') {
      body += `Or, la Cour de cassation (3e Chambre Civile, jurisprudence constante) impose que toute retenue sur caution soit rigoureusement étayée par des pièces justificatives tangibles (factures acquittées ou devis détaillés émanant d'entreprises du bâtiment tierces) ET découle directement de dégradations expressément mentionnées sur l'état des lieux contradictoire de sortie par comparaison avec l'entrée.\n\n`;
      body += `Vous ne m'avez produit aucun justificatif probant ni facture détaillée justifiant la réalité et le coût des réparations alléguées.\n\n`;
    } else if (data.disputeReason === 'devis_exorbitant_sans_facture') {
      body += `Le devis produit est manifestement disproportionné et facture à neuf des éléments ayant subi une usure normale, sans appliquer le moindre abattement pour vétusté en contravention flagrante du décret n° 2016-382.\n\n`;
    }
  }

  // Section 3: Sommation & Décompte
  body += `3. DÉCOMPTE DES SOMMES EXIGIBLES IMMÉDIATEMENT\n`;
  body += `- Montant du dépôt de garantie indûment retenu : ${undueRetainedAmount.toLocaleString('fr-FR')} €\n`;
  if (timeline.totalPenalty > 0) {
    body += `- Pénalité légale de retard (10 % du loyer par mois x ${timeline.lateMonthsCount} mois) : ${timeline.totalPenalty.toLocaleString('fr-FR')} €\n`;
  }
  body += `SOIT UN TOTAL DE : ${totalClaimed.toLocaleString('fr-FR')} €.\n\n`;

  // Section 4: Mise en demeure et voies de droit
  body += `En conséquence, la présente lettre vaut MISE EN DEMEURE au sens des articles 1344 et suivants du Code civil.\n\n`;
  body += `Je vous somme de me verser la somme totale de ${totalClaimed.toLocaleString('fr-FR')} € par virement bancaire ou chèque sous un délai impératif de HUIT (8) JOURS à compter de la réception de ce courrier.\n\n`;
  body += `À défaut d'un règlement intégral dans ce délai, je saisirai sans autre avis :\n`;
  body += `1. La Commission Départementale de Conciliation (CDC) de notre département, procédure préalable gratuite ;\n`;
  body += `2. Le Juge des contentieux de la protection près le Tribunal Judiciaire compétent, afin d'obtenir la condamnation au paiement des sommes principales, des pénalités de retard d'ordre public, des intérêts au taux légal et d'une indemnité sur le fondement de l'article 700 du Code de procédure civile.\n\n`;

  body += `Comptant sur votre respect scrupuleux du cadre légal républicain pour régler ce différend à l'amiable,\n\n`;
  body += `Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.\n\n`;
  body += `${data.tenantName.trim()}`;

  return {
    senderBlock,
    recipientBlock,
    dateAndCity: `Fait le ${todayStr}`,
    subject,
    registeredMailMention,
    body,
    breakdown: {
      originalDeposit: data.depositAmount,
      amountAlreadyReturned,
      undueRetainedAmount,
      delayMonths: timeline.lateMonthsCount,
      penaltyPerMonth: timeline.penaltyPerMonth,
      totalPenalty: timeline.totalPenalty,
      totalClaimed,
    },
    legalReferences: [
      'Loi n° 89-462 du 6 juillet 1989 (art. 7-d et art. 22 modifiée Loi ALUR)',
      'Décret n° 2016-382 du 30 mars 2016 (vétusté et états des lieux)',
      'Articles 1344 et suivants du Code civil (Mise en demeure)',
      'Cour de Cassation, 3e Civ., arrêt de principe sur la charge de la preuve des retenues',
    ],
  };
}
