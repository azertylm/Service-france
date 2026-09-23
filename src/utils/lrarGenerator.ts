import { LegalGround, GeneratedLRAR, ResilProvider } from '../types/resiliation';

interface GenerateParams {
  provider: ResilProvider | {
    name: string;
    serviceAddress: {
      recipientName: string;
      street: string;
      postalCode: string;
      city: string;
      cedex?: string;
    };
  };
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
  customReasonDetail?: string; // e.g. "Déménagement à l'étranger" or "Certificat médical joint"
  monthlySavings: number;
}

export function generateCancellationLetter(params: GenerateParams): GeneratedLRAR {
  const { provider, senderInfo, legalGround, customReasonDetail, monthlySavings } = params;

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const fullRecipientAddress = [
    provider.serviceAddress.recipientName,
    provider.serviceAddress.street,
    `${provider.serviceAddress.postalCode} ${provider.serviceAddress.city}${
      provider.serviceAddress.cedex ? ' ' + provider.serviceAddress.cedex : ''
    }`,
  ]
    .filter(Boolean)
    .join('\n');

  let subject = '';
  let legalArticleCitation = '';
  let bodyContent = '';

  switch (legalGround) {
    case 'loi_hamon':
      subject = `Objet : Résiliation de contrat d'assurance à échéance passée d'un an (Loi Hamon - Article L. 113-15-2 du Code des assurances)`;
      legalArticleCitation = 'Article L. 113-15-2 du Code des assurances';
      bodyContent = `Par la présente, je vous notifie ma décision de résilier mon contrat d'assurance susmentionné, souscrit auprès de votre compagnie il y a plus d'une année.

Conformément aux dispositions de l'article L. 113-15-2 du Code des assurances (issu de la loi n° 2014-344 dite « Loi Hamon »), tout assuré dispose du droit de résilier sans frais ni pénalités son contrat à l'expiration d'un délai d'un an à compter de la première souscription.

La présente résiliation prendra effet de plein droit à l'expiration d'un délai d'un mois à compter de la date de réception de cette lettre recommandée avec accusé de réception.

Je vous rappelle que conformément à la loi, vous êtes tenus de me rembourser le solde de la prime ou de la cotisation afférent à la période non couverte dans un délai maximal de trente (30) jours à compter de la date d'effet de la résiliation.`;
      break;

    case 'loi_chatel':
      subject = `Objet : Résiliation immédiate pour manquement à l'obligation d'information préalable (Loi Chatel - Article L. 215-1 du Code de la consommation)`;
      legalArticleCitation = 'Article L. 215-1 du Code de la consommation';
      bodyContent = `Par la présente, je vous informe de ma volonté de mettre un terme immédiat à mon abonnement / contrat référencé ci-dessus, sur le fondement de la loi n° 2005-67 dite « Loi Chatel ».

En application de l'article L. 215-1 du Code de la consommation, le professionnel prestataire de services doit informer le consommateur par écrit, au plus tôt trois mois et au plus tard un mois avant le terme de la période autorisant le rejet de la reconduction, de la possibilité de ne pas reconduire le contrat.

Or, à ce jour, je n'ai reçu aucun avis d'échéance m'informant de cette faculté dans les délais légaux impartis (ou cet avis m'a été communiqué moins de quinze jours avant l'échéance).

En conséquence, et conformément aux dispositions expresses de l'article L. 215-1 alinéa 3 du Code de la consommation, je suis fondé(e) à mettre fin à ce contrat gratuitement, à tout moment à compter de la date de reconduction, sans préavis ni indemnité.

Je vous somme de procéder à l'arrêt immédiat des prélèvements bancaires sur mon compte. Tout prélèvement indu effectué postérieurement à la présente fera l'objet d'une contestation pour opération non autorisée auprès de mon établissement bancaire.`;
      break;

    case 'resiliation_3_clics':
      subject = `Objet : Résiliation simplifiée par voie électronique (Loi n° 2022-1158 - Article L. 215-1-1 du Code de la consommation)`;
      legalArticleCitation = 'Article L. 215-1-1 du Code de la consommation';
      bodyContent = `Par la présente, je vous notifie la résiliation définitive de mon contrat d'abonnement n° ${
        senderInfo.contractNumber || 'susvisé'
      }.

Conformément à l'article L. 215-1-1 du Code de la consommation (issu de la loi n° 2022-1158 du 16 août 2022 portant mesures d'urgence pour la protection du pouvoir d'achat), lorsqu'un contrat a été conclu par voie électronique ou que le professionnel offre cette faculté, la résiliation doit pouvoir être effectuée sans obstacle et sans démarche superflue.

Je vous remercie de prendre acte de cette résiliation dès réception de la présente, d'interrompre tout prélèvement automatique SEPA et de m'adresser sous 10 jours ouvrés une confirmation écrite de résiliation mentionnant la date effective de clôture.`;
      break;

    case 'hausse_tarifaire':
      subject = `Objet : Résiliation sans frais pour modification unilatérale des conditions contractuelles (Article L. 224-33 du Code de la consommation)`;
      legalArticleCitation = 'Article L. 224-33 du Code de la consommation';
      bodyContent = `J'ai été informé(e) d'une modification unilatérale des conditions contractuelles / d'une hausse tarifaire appliquée à mon contrat, sans mon accord préalable exprès.

En vertu des dispositions de l'article L. 224-33 du Code de la consommation, tout consommateur peut, tant qu'il n'a pas expressément accepté les nouvelles conditions, résilier son contrat sans aucune pénalité de résiliation et sans droit à dédommagement, jusque dans un délai de quatre mois après l'entrée en vigueur de la modification.

Je refuse formellement cette hausse tarifaire unilatérale et vous informe de la résiliation immédiate de mon engagement, sans application d'aucun frais de rupture anticipée.`;
      break;

    case 'motif_legitime':
      subject = `Objet : Résiliation anticipée pour motif légitime et force majeure`;
      legalArticleCitation = 'Recommandations de la Commission des clauses abusives et Jurisprudence constante';
      bodyContent = `Par la présente lettre recommandée, je vous sollicite pour procéder à la résiliation anticipée de mon contrat, pour un motif légitime indépendant de ma volonté :
${customReasonDetail ? `Motif invoqué : ${customReasonDetail}` : 'Motif invoqué : Inaptitude physique définitive / Déménagement en zone non desservie / Perte involontaire d\'emploi'}.

Vous trouverez ci-joint la pièce justificative officielle attestant de cette situation (certificat médical, nouveau bail / justificatif de domicile, attestation France Travail).

Conformément à la jurisprudence constante de la Cour de cassation et aux recommandations de la Commission des clauses abusives, la survenance d'un motif légitime exonère l'usager de tout paiement des mensualités restant à courir et emporte résiliation de plein droit sans indemnités.`;
      break;

    case 'retractation_14j':
      subject = `Objet : Exercice du droit légal de rétractation (Article L. 221-18 du Code de la consommation)`;
      legalArticleCitation = 'Article L. 221-18 du Code de la consommation';
      bodyContent = `J'ai souscrit à distance / par démarchage le contrat n° ${
        senderInfo.contractNumber || 'susvisé'
      } en date du ${dateFormatted}.

Conformément à l'article L. 221-18 du Code de la consommation, le consommateur dispose d'un délai de quatorze (14) jours francs pour exercer son droit de rétractation d'un contrat conclu à distance ou hors établissement, sans avoir à motiver sa décision ni à supporter de pénalités.

Par la présente, je vous notifie l'exercice de ce droit légal de rétractation. Je vous mets en demeure de me rembourser l'ensemble des sommes éventuellement perçues dans un délai maximal de quatorze jours, conformément à l'article L. 221-24 du même Code.`;
      break;

    case 'echeance_terme':
    default:
      subject = `Objet : Demande de résiliation de contrat à échéance`;
      legalArticleCitation = 'Code de la consommation et conditions générales du contrat';
      bodyContent = `Par la présente lettre recommandée avec avis de réception, je vous informe de ma décision de ne pas renouveler mon abonnement / contrat référencé ci-dessus et d'y mettre fin à son terme contractuel le plus proche.

Je vous remercie de bien vouloir m'adresser, dès réception de ce courrier, une attestation écrite confirmant la prise en compte de ma demande et précisant la date effective d'interruption de service et des prélèvements bancaires associés.`;
      break;
  }

  const fullLetter = `EXPÉDITEUR :
${senderInfo.fullName}
${senderInfo.address}
${senderInfo.postalCode} ${senderInfo.city}
Tél. : ${senderInfo.phone || 'Non renseigné'}
Email : ${senderInfo.email || 'Non renseigné'}
${senderInfo.clientNumber ? `Numéro client : ${senderInfo.clientNumber}` : ''}
${senderInfo.contractNumber ? `Numéro de contrat : ${senderInfo.contractNumber}` : ''}

DESTINATAIRE :
${fullRecipientAddress}

Fait à ${senderInfo.city || '................'}, le ${dateFormatted}

LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION (LRAR)

${subject}

Madame, Monsieur,

${bodyContent}

Dans l'attente de votre confirmation écrite sous quinzaine et de la facture de clôture définitive, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.


${senderInfo.fullName}
(Signature)
`;

  return {
    providerName: provider.name,
    recipientAddress: fullRecipientAddress,
    senderInfo,
    legalGround,
    subject,
    body: fullLetter,
    dateStr: dateFormatted,
    monthlySavings,
  };
}
