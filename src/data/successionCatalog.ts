import { SuccessionOrganism } from '../types/succession';

export const TIMEFRAME_LABELS: Record<string, { label: string; badge: string; sub: string; color: string }> = {
  '48h': {
    label: 'Sous 48h (Urgence absolue)',
    badge: '48 Heures',
    sub: 'Constat médical, mairie, autorisations funéraires et employeur',
    color: 'border-rose-500 bg-rose-50 text-rose-800'
  },
  '7j': {
    label: 'Sous 7 jours (Blocage financier & Sécurité)',
    badge: '7 Jours',
    sub: 'Banques (blocage comptes), employeur/France Travail, bailleur et CPAM',
    color: 'border-amber-500 bg-amber-50 text-amber-800'
  },
  '30j': {
    label: 'Sous 30 jours (Clôtures & Droits sociaux)',
    badge: '30 Jours',
    sub: 'Caisses de retraite, mutuelle, impôts, résiliation abonnements et aides veuvage',
    color: 'border-sky-500 bg-sky-50 text-sky-800'
  },
  '6m': {
    label: 'Sous 6 mois (Règlement notarié & Fiscal)',
    badge: '6 Mois',
    sub: 'Notaire, déclaration de succession fiscale n° 2705 et transfert de carte grise',
    color: 'border-indigo-500 bg-indigo-50 text-indigo-800'
  }
};

export const SUCCESSION_ORGANISMS: SuccessionOrganism[] = [
  // ==========================================
  // SOUS 48H
  // ==========================================
  {
    id: 'mairie_etat_civil',
    name: "Mairie du lieu de décès (Déclaration d'état civil)",
    category: 'etat_civil',
    categoryLabel: 'État Civil & Obsèques',
    timeframe: '48h',
    priority: 'URGENT',
    description: "Déclaration obligatoire du décès auprès de l'officier d'état civil de la commune où le décès est survenu.",
    legalDeadline: 'Dans les 24h à 48h ouvrées',
    legalBasis: 'Article 78 du Code Civil',
    whyCrucial: "Permet d'obtenir l'acte de décès officiel en au moins 20 exemplaires originaux, indispensables pour toutes les démarches ultérieures.",
    documentsRequired: [
      'Certificat de décès bleu délivré par le médecin',
      'Livret de famille du défunt ou sa pièce d’identité',
      'Pièce d’identité de la personne qui déclare'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Monsieur le Maire - Service de l'État Civil",
    defaultRecipientAddress: "Mairie de la commune du décès",
    letterSubjectTemplate: "Déclaration de décès et demande d'extraits d'acte de décès",
    letterBodyTemplate: (data) => `Madame, Monsieur l'Officier de l'État Civil,

Je vous informe par la présente du décès survenu le ${data.deceasedDeathDate || '[Date du décès]'} à ${data.deceasedDeathPlace || '[Lieu du décès]'} de :

Nom et Prénom : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'} à ${data.deceasedBirthPlace || '[Lieu de naissance]'}
Demeurant de son vivant au : ${data.deceasedAddress || '[Dernière adresse du défunt]'}

Agissant en qualité de ${data.declarantRelationship || 'ayant droit / proche parent'}, je sollicite la délivrance de 20 copies intégrales d'acte de décès certifiées conformes afin de procéder à l'accomplissement des formalités administratives et successorales obligatoires.

Vous trouverez ci-joint la copie du certificat médical de décès ainsi que les pièces d'identité requises.

Je vous remercie par avance pour votre diligence et vous prie d'agréer mes salutations distinguées.`,
    tips: [
      "Demandez TOUJOURS au moins 15 à 20 extraits d'acte de décès originaux : les banques, notaires et caisses exigent des originaux certifiés.",
      "L'entreprise de pompes funèbres mandatée peut effectuer cette déclaration pour votre compte si vous le souhaitez."
    ]
  },
  {
    id: 'employeur_defunt',
    name: "Employeur du défunt (ou France Travail)",
    category: 'employeur_chomage',
    categoryLabel: 'Emploi & Activité',
    timeframe: '48h',
    priority: 'URGENT',
    description: "Notification immédiate du décès à l'employeur pour suspendre le contrat de travail, débloquer le dernier salaire et les indemnités de décès.",
    legalDeadline: 'Au plus tôt sous 48h à 72h',
    legalBasis: 'Article L1231-1 du Code du Travail',
    whyCrucial: "Le décès met fin immédiatement au contrat de travail. L'employeur doit verser le solde de tout compte aux héritiers et actionner la prévoyance d'entreprise (capital décès).",
    documentsRequired: [
      'Copie de l’acte de décès',
      'Certificat d’hérédité ou acte de notoriété (ultérieurement)',
      'RIB du compte de succession ou des ayants droit'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Direction des Ressources Humaines",
    defaultRecipientAddress: "Adresse de l'employeur du défunt",
    letterSubjectTemplate: "Notification de décès - Rupture de contrat et déblocage des droits",
    letterBodyTemplate: (data) => `Madame, Monsieur le Directeur des Ressources Humaines,

C'est avec une profonde tristesse que je vous informe du décès de votre salarié(e) :

${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'}
Numéro de Sécurité Sociale : ${data.deceasedSocialSecurityNumber || '[N° Sécu]'}
Survenu le : ${data.deceasedDeathDate || '[Date du décès]'} à ${data.deceasedDeathPlace || '[Lieu du décès]'}

En ma qualité de ${data.declarantRelationship || 'ayant droit'}, je vous sollicite afin de :
1. Établir le reçu pour solde de tout compte (salaires résiduels, indemnité compensatrice de congés payés, primes acquises) ;
2. Me délivrer le dernier bulletin de salaire ainsi que le certificat de travail ;
3. Enclencher auprès de l'organisme de prévoyance de votre entreprise le versement du capital décès au profit des bénéficiaires désignés.

Vous trouverez ci-joint la copie intégrale de l'acte de décès.

Restant à votre entière disposition pour tout renseignement complémentaire, je vous prie d'agréer, Madame, Monsieur, mes salutations distinguées.`,
    tips: [
      "Vérifiez impérativement si l'entreprise dispose d'un contrat de prévoyance collective obligatoire (indemnités de 1 à 3 ans de salaire pour les proches).",
      "Si le défunt était inscrit à France Travail, informez-les également afin d'éviter tout versement d'indemnités indues qui seraient ultérieurement réclamées."
    ]
  },

  // ==========================================
  // SOUS 7 JOURS
  // ==========================================
  {
    id: 'banque_blocage',
    name: "Établissements Bancaires & Postaux (Blocage des comptes & Opposition prélèvements)",
    category: 'bancaire',
    categoryLabel: 'Banques & Épargne',
    timeframe: '7j',
    priority: 'URGENT',
    description: "Notification formelle de décès pour figer les avoirs, clôturer les procurations, bloquer les prélèvements automatiques et autoriser le paiement des frais d'obsèques.",
    legalDeadline: 'Sous 7 jours maximum',
    legalBasis: 'Article L312-1-4 du Code Monétaire et Financier & Arrêté du 25 octobre 2013 (Plafond 5 000 €)',
    whyCrucial: "Stoppe net les prélèvements bancaires indus après la date du décès. Permet à la banque de régler directement les pompes funèbres dans la limite légale de 5 000 € sur le solde disponible.",
    documentsRequired: [
      'Acte de décès original',
      'Relevé d’Identité Bancaire (IBAN) ou numéros de comptes du défunt',
      'Facture acquittée ou bon de commande des pompes funèbres (pour déblocage 5 000 €)',
      'Pièce d’identité du déclarant'
    ],
    stopsDirectDebits: true,
    defaultRecipientName: "Direction de l'Agence Bancaire / Service Successions",
    defaultRecipientAddress: "Adresse de l'agence bancaire du défunt",
    letterSubjectTemplate: "Notification de décès - Blocage des comptes, révocation des procurations et arrêt des prélèvements",
    letterBodyTemplate: (data) => `Madame, Monsieur le Directeur d'Agence,

Je vous informe par la présente du décès de votre client(e) :

Titulaire : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'} à ${data.deceasedBirthPlace || '[Lieu]'}
Demeurant de son vivant au : ${data.deceasedAddress || '[Adresse du défunt]'}
Numéro de compte / IBAN : ${data.bankIban || '[Numéro de compte ou IBAN]'}
Date du décès : ${data.deceasedDeathDate || '[Date du décès]'}

En ma qualité de ${data.declarantRelationship || 'héritier / ayant droit'}, je vous demande de :

1. Enregistrer le décès et bloquer immédiatement les comptes individuels du défunt (Comptes courants, Livrets A/LDD, PEL, CEL, etc.) ;
2. Révoquer de plein droit l'ensemble des procurations bancaires antérieures (Art. 2003 du Code civil) ;
3. REJETER ET BLOQUER SYSTÉMATIQUEMENT tout prélèvement automatique ou virement récurrent se présentant pour des échéances postérieures à la date du décès (${data.deceasedDeathDate || '[Date du décès]'}) ;
4. Prélever sur les avoirs disponibles, en application de l'article L. 312-1-4 du Code monétaire et financier, la somme due au titre des frais d'obsèques (dans la limite du plafond légal de 5 000 €), au vu de la facture des pompes funèbres jointe ;
5. Adresser à l'office notarial chargé de la succession l'état exhaustif de la situation patrimoniale et fiscale au jour du décès.

Pièces jointes : Acte de décès certifié conforme, facture des obsèques, copie de ma pièce d'identité.

Comptant sur votre diligence immédiate, je vous prie d'agréer mes salutations distinguées.`,
    tips: [
      "Les procurations bancaires s'éteignent AUTOMATIQUEMENT au décès : nul ne peut continuer à utiliser les cartes ou chéquiers du défunt.",
      "Le conjoint ou héritier a le droit légal d'exiger le débit jusqu'à 5 000 € sur le compte du défunt pour régler l'opérateur de pompes funèbres, sans attendre le notaire."
    ]
  },
  {
    id: 'bailleur_logement',
    name: "Bailleur ou Propriétaire du logement loué",
    category: 'logement_fournisseurs',
    categoryLabel: 'Logement & Bail',
    timeframe: '7j',
    priority: 'URGENT',
    description: "Information du bailleur du décès du locataire et organisation de la résiliation du bail ou du transfert de contrat.",
    legalDeadline: 'Sous 7 jours recommandés',
    legalBasis: 'Article 14 de la Loi n° 89-462 du 6 juillet 1989',
    whyCrucial: "Le contrat de location est résilié de plein droit par le décès du locataire isolé. Si le logement n'est pas libéré rapidement, des indemnités d'occupation continuent d'être dues.",
    documentsRequired: [
      'Copie de l’acte de décès',
      'Courrier recommandé avec accusé de réception (LRAR)'
    ],
    stopsDirectDebits: true,
    defaultRecipientName: "Monsieur le Bailleur / Cabinet de Gestion Immobilière",
    defaultRecipientAddress: "Adresse du propriétaire ou de l'agence de location",
    letterSubjectTemplate: "Notification de décès du locataire - Résiliation de plein droit du bail d'habitation",
    letterBodyTemplate: (data) => `Madame, Monsieur le Bailleur,

Je vous informe par la présente du décès de votre locataire :

${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Logement situé au : ${data.deceasedAddress || '[Adresse exacte du logement loué]'}
Décédé(e) le : ${data.deceasedDeathDate || '[Date du décès]'}

En application de l'article 14 de la loi n° 89-462 du 6 juillet 1989, le décès du locataire entraîne la résiliation de plein droit du contrat de bail lorsqu'aucun conjoint, partenaire pacsé ou ascendant/descendant ne remplit les conditions légales de transfert.

En ma qualité de ${data.declarantRelationship || 'héritier'}, je vous propose de convenir d'une date dans les meilleurs délais pour procéder :
- À la libération des lieux et au déménagement des meubles ;
- À l'état des lieux contradictoire de sortie et à la restitution formelle des clés.

Les loyers et charges cessent d'être dus au jour de la remise définitive des clés et de la fin de jouissance.

Dans l'attente de votre contact pour fixer ce rendez-vous, je vous prie d'agréer mes salutations distinguées.`,
    tips: [
      "Si le défunt vivait en couple marié ou pacsé, le conjoint survivant bénéficie d'un droit exclusif de poursuite du bail sans surcoût.",
      "Bloquez immédiatement tout prélèvement automatique de loyer auprès de la banque : les héritiers ne paient que jusqu'à la remise effective des clés."
    ]
  },
  {
    id: 'cpam_securite_sociale',
    name: "Assurance Maladie / CPAM (Capital Décès de la Sécurité Sociale)",
    category: 'protection_sociale',
    categoryLabel: 'Santé & Sécurité Sociale',
    timeframe: '7j',
    priority: 'IMPORTANT',
    description: "Déclaration de décès pour clôturer les droits de l'assuré et réclamer le versement du « Capital Décès » de la Sécurité Sociale (3 910 € forfaitaires en 2024-2026).",
    legalDeadline: 'Sous 1 mois (priorité ayants droit 1 mois, délai absolu 2 ans)',
    legalBasis: 'Articles L361-1 et R361-1 du Code de la Sécurité Sociale',
    whyCrucial: "Le capital décès de la CPAM s'élève à 3 910 € (forfait garanti exonéré d'impôt et de droits de succession). Les ayants droit à charge disposent d'un délai prioritaire de 1 mois pour le revendiquer.",
    documentsRequired: [
      'Acte de décès certifié conforme',
      'Formulaire officiel Cerfa S3180 « Demande de capital décès »',
      'Livret de famille ou certificat de concubinage/pacs',
      'Relevé d’Identité Bancaire (RIB) du demandeur',
      '3 derniers bulletins de salaire ou avis de pension du défunt'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Caisse Primaire d'Assurance Maladie - Service Prestations Décès",
    defaultRecipientAddress: "CPAM du département de résidence du défunt",
    letterSubjectTemplate: "Notification de décès et demande formelle de versement du Capital Décès (Art. L361-1 CSS)",
    letterBodyTemplate: (data) => `Madame, Monsieur le Médecin Conseil / Directeur de la CPAM,

Je vous informe par la présente du décès de votre assuré(e) :

Nom : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Numéro d'immatriculation Sécurité Sociale : ${data.deceasedSocialSecurityNumber || '[Numéro de Sécu]'}
Date de naissance : ${data.deceasedBirthDate || '[Date de naissance]'}
Date du décès : ${data.deceasedDeathDate || '[Date du décès]'} à ${data.deceasedDeathPlace || '[Lieu]'}

En ma qualité de ${data.declarantRelationship || 'bénéficiaire / ayant droit'}, je vous transmets sous ce pli :
1. Une copie intégrale de l'acte de décès ;
2. Le formulaire de demande de capital décès dûment rempli et signé ;
3. Mon relevé d'identité bancaire pour le versement du capital forfaitaire prévu à l'article L. 361-1 du Code de la Sécurité Sociale ;
4. La copie de mon livret de famille attestant du lien de parenté.

Je vous remercie de bien vouloir clôturer son dossier d'assurance maladie et procéder au règlement des droits dus.

Veuillez agréer mes salutations respectueuses.`,
    tips: [
      "Le Capital Décès de la Sécurité Sociale n'est PAS assujetti aux droits de succession ni à l'impôt sur le revenu.",
      "Pensez à retourner la carte Vitale du défunt ou à la détruire après validation des derniers remboursements de soins."
    ]
  },

  // ==========================================
  // SOUS 30 JOURS
  // ==========================================
  {
    id: 'caisses_retraite',
    name: "Caisses de Retraite (CNAV / Agirc-Arrco / Régimes Spéciaux - Pension de Réversion)",
    category: 'protection_sociale',
    categoryLabel: 'Retraite & Réversion',
    timeframe: '30j',
    priority: 'URGENT',
    description: "Notification du décès pour stopper les pensions (tout mois commencé est dû, mais les versements suivants doivent être immédiatement bloqués) et instruire la pension de réversion.",
    legalDeadline: 'Sous 30 jours',
    legalBasis: 'Articles L353-1 et suivants du Code de la Sécurité Sociale',
    whyCrucial: "La CNAV et l'Agirc-Arrco récupèrent systématiquement les trop-perçus directement sur les comptes bancaires. Le conjoint survivant peut toucher jusqu'à 54% (régime de base) et 60% (Agirc-Arrco) de la pension du défunt.",
    documentsRequired: [
      'Acte de décès',
      'Dernier titre de pension ou numéro de Sécurité Sociale',
      'RIB du conjoint pour la demande de réversion',
      'Déclaration de ressources pour la réversion de base'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Caisse Nationale d'Assurance Vieillesse & Agirc-Arrco",
    defaultRecipientAddress: "Adresse de la caisse de retraite du défunt",
    letterSubjectTemplate: "Notification de décès de l'allocataire et demande de dossier de Pension de Réversion",
    letterBodyTemplate: (data) => `Madame, Monsieur le Directeur de la Caisse de Retraite,

Je vous informe par la présente du décès de votre allocataire :

${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Numéro de Sécurité Sociale : ${data.deceasedSocialSecurityNumber || '[Numéro de Sécu]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'}
Décédé(e) le : ${data.deceasedDeathDate || '[Date du décès]'}

Caisses concernées : ${data.retirementFundNames || 'CNAV / Carsat et Agirc-Arrco'}

Je vous demande de bien vouloir enregistrer ce décès et procéder au calcul définitif des arrérages dus pour le mois du décès.

Par ailleurs, agissant en qualité de ${data.declarantRelationship || 'conjoint survivant'}, je sollicite l'ouverture immédiate et l'envoi du dossier d'instruction pour la PENSION DE RÉVERSION (régime de base et régime complémentaire), ainsi que l'allocation de veuvage le cas échéant.

Pièces jointes : Copie de l'acte de décès certifiée conforme, copie du livret de famille.

Avec mes remerciements, je vous prie d'agréer mes salutations distinguées.`,
    tips: [
      "Règle d'or : le mois du décès est payé en totalité par la retraite de base (Carsat). Si le décès survient le 2 du mois, la pension complète de ce mois reste acquise.",
      "La pension de réversion n'est JAMAIS automatique : elle doit être impérativement demandée par formulaire écrit."
    ]
  },
  {
    id: 'fournisseurs_energie_internet',
    name: "Fournisseurs d'Énergie, Eau, Téléphone & Box Internet",
    category: 'logement_fournisseurs',
    categoryLabel: 'Abonnements & Énergie',
    timeframe: '30j',
    priority: 'IMPORTANT',
    description: "Résiliation sans frais pour motif légitime de décès de l'ensemble des contrats de fourniture (EDF, Engie, Free, Orange, SFR, etc.).",
    legalDeadline: 'Sous 30 jours',
    legalBasis: 'Article L224-38 du Code de la Consommation (Motif légitime sans frais)',
    whyCrucial: "Empêche l'accumulation de factures d'abonnements inertes. La résiliation pour décès est légalement SANS FRAIS ni préavis contractuel.",
    documentsRequired: [
      'Acte de décès',
      'Numéro de contrat ou de client',
      'Relevé de compteur de départ (pour le gaz/électricité/eau)'
    ],
    stopsDirectDebits: true,
    defaultRecipientName: "Service Résiliation Clients",
    defaultRecipientAddress: "Adresse du fournisseur de services",
    letterSubjectTemplate: "Résiliation de plein droit et sans frais pour cause de décès du titulaire",
    letterBodyTemplate: (data) => `Madame, Monsieur le Responsable du Service Résiliation,

Je vous informe par la présente du décès de votre abonné(e) :

Nom : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Adresse de fourniture : ${data.deceasedAddress || '[Adresse du logement]'}
Survenu le : ${data.deceasedDeathDate || '[Date du décès]'}

En ma qualité de ${data.declarantRelationship || 'héritier / ayant droit'}, je vous notifie la RÉSILIATION IMMÉDIATE ET DE PLEIN DROIT de l'ensemble de ses contrats souscrits auprès de votre enseigne.

Le décès du titulaire constituant un motif légitime d'exonération de plein droit (Art. L. 224-38 du Code de la Consommation), cette résiliation prend effet immédiatement sans frais ni pénalité.

Je vous demande :
1. De cesser tout prélèvement bancaire automatique sur le compte du défunt ;
2. De m'adresser la facture de clôture définitive à mon adresse (${data.declarantAddress || '[Mon adresse]'}) ;
3. De me faire parvenir les étiquettes de retour gratuites pour la restitution des équipements (box, décodeurs) le cas échéant.

Ci-joint : copie de l'acte de décès.

Veuillez agréer mes salutations distinguées.`,
    tips: [
      "Aucun fournisseur ne peut vous imposer de frais de clôture ou d'engagement restant dû : le décès casse tout engagement.",
      "Conservez précieusement les récépissés de retour de box internet ou décodeurs pour éviter toute facturation de non-restitution."
    ]
  },
  {
    id: 'mutuelle_complementaire_sante',
    name: "Mutuelle & Complémentaire Santé",
    category: 'protection_sociale',
    categoryLabel: 'Mutuelle & Prévoyance',
    timeframe: '30j',
    priority: 'IMPORTANT',
    description: "Résiliation de la complémentaire santé, arrêt des cotisations et réclamation d'un éventuel forfait obsèques ou rente décès souscrit au contrat.",
    legalDeadline: 'Sous 30 jours',
    legalBasis: 'Article L221-17 du Code de la Mutualité & Code des Assurances',
    whyCrucial: "De nombreuses mutuelles intègrent une garantie obsèques forfaitaire (ex: 500 € à 2 000 €) versée immédiatement sur présentation de la facture des pompes funèbres.",
    documentsRequired: [
      'Acte de décès',
      'Numéro d’adhérent mutuelle',
      'Facture acquittée des frais funéraires'
    ],
    stopsDirectDebits: true,
    defaultRecipientName: "Service Adhérents / Prestations Décès",
    defaultRecipientAddress: "Adresse de la mutuelle complémentaire santé",
    letterSubjectTemplate: "Notification de décès - Résiliation contrat et demande du forfait obsèques / prévoyance",
    letterBodyTemplate: (data) => `Madame, Monsieur le Responsable des Adhésions,

Je vous informe par la présente du décès de votre adhérent(e) :

Nom et Prénom : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Numéro d'adhérent : ${data.mutualFundName || '[Numéro de contrat/adhérent]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'}
Décédé(e) le : ${data.deceasedDeathDate || '[Date du décès]'}

En ma qualité de ${data.declarantRelationship || 'ayant droit'}, je vous sollicite pour :
1. Clôturer l'adhésion et résilier les garanties à la date du décès ;
2. Me rembourser le trop-perçu éventuel de cotisations prélevées d'avance ;
3. Vérifier et verser le forfait d'aide aux frais d'obsèques ou le capital prévoyance prévu au contrat d'adhésion.

Pièces jointes : Acte de décès certifié conforme, facture d'obsèques, mon relevé d'identité bancaire.

Comptant sur votre efficacité, je vous prie d'agréer mes salutations distinguées.`,
    tips: [
      "Exigez le remboursement prorata temporis des cotisations de mutuelle payées pour la fin du mois après la date du décès.",
      "Vérifiez si les autres membres de la famille bénéficiaient de cette mutuelle pour organiser la continuité de leur couverture santé."
    ]
  },
  {
    id: 'impots_dgfip',
    name: "Direction Générale des Finances Publiques (DGFiP / Centre des Impôts)",
    category: 'fiscalite_patrimoine',
    categoryLabel: 'Impôts & Fiscalité',
    timeframe: '30j',
    priority: 'IMPORTANT',
    description: "Signalement du décès dans l'espace fiscal particulier afin d'adapter le taux de prélèvement à la source du conjoint et préparer la déclaration fiscale de succession.",
    legalDeadline: 'Sous 60 jours au plus tard',
    legalBasis: 'Article 204 du Code Général des Impôts',
    whyCrucial: "Permet de recalculer immédiatement le taux de prélèvement à la source du conjoint survivant pour éviter un écrasement fiscal indu.",
    documentsRequired: [
      'Acte de décès',
      'Dernier avis d’impôt sur le revenu du défunt (Numéro fiscal à 13 chiffres)'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Service des Impôts des Particuliers (SIP)",
    defaultRecipientAddress: "Centre des finances publiques gestionnaire",
    letterSubjectTemplate: "Déclaration de changement de situation familiale : Décès du déclarant fiscal",
    letterBodyTemplate: (data) => `Madame, Monsieur l'Inspecteur des Finances Publiques,

Je vous informe par la présente du décès de votre contribuable :

${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Numéro fiscal : ${data.deceasedTaxNumber || '[Numéro fiscal à 13 chiffres]'}
Adresse de domiciliation fiscale : ${data.deceasedAddress || '[Adresse du défunt]'}
Date du décès : ${data.deceasedDeathDate || '[Date du décès]'}

En ma qualité de ${data.declarantRelationship || 'déclarant / ayant droit'}, je vous transmets sous ce pli l'acte de décès afin de procéder à la mise à jour de son dossier fiscal.

Pour le conjoint survivant (le cas échéant), je sollicite la réévaluation immédiate du taux de prélèvement à la source et des acomptes contemporains.

Le notaire chargé de la succession vous transmettra en temps voulu la déclaration de succession n° 2705.

Ci-joint : Acte de décès officiel.

Veuillez agréer mes salutations distinguées.`,
    tips: [
      "Vous pouvez également déclarer le décès directement en ligne via l'espace Particulier impots.gouv.fr > rubrique 'Gérer mon prélèvement à la source' > 'Signaler un changement'.",
      "L'année suivant le décès, deux déclarations de revenus devront être déposées si le couple était marié ou pacsé."
    ]
  },
  {
    id: 'assurances_vehicule_habitation',
    name: "Compagnies d'Assurance (Automobile, Habitation, Responsabilité Civile)",
    category: 'logement_fournisseurs',
    categoryLabel: 'Assurances',
    timeframe: '30j',
    priority: 'IMPORTANT',
    description: "Notification pour transférer ou résilier les contrats d'assurance habitation et automobile.",
    legalDeadline: 'Sous 3 mois (recommandé 30 jours)',
    legalBasis: 'Article L121-10 du Code des Assurances',
    whyCrucial: "En vertu de l'article L121-10, les contrats d'assurance continuent automatiquement au profit de l'héritier à moins qu'une résiliation explicite ne soit notifiée par écrit.",
    documentsRequired: [
      'Acte de décès',
      'Numéro de police d’assurance'
    ],
    stopsDirectDebits: true,
    defaultRecipientName: "Direction du Service Sinistres & Contrats",
    defaultRecipientAddress: "Siège de la compagnie d'assurance",
    letterSubjectTemplate: "Notification de décès - Résiliation du contrat d'assurance (Art. L121-10 Code des Assurances)",
    letterBodyTemplate: (data) => `Madame, Monsieur le Directeur,

Je vous informe par la présente du décès de votre assuré(e) :

Nom : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Police d'assurance numéro : [Numéro de contrat]
Date du décès : ${data.deceasedDeathDate || '[Date du décès]'}

Faisant application de la faculté de résiliation prévue à l'article L. 121-10 du Code des Assurances suite au décès de l'assuré, je vous notifie la résiliation formelle de ce contrat.

Je vous demande de bien vouloir procéder à l'arrêt immédiat des prélèvements et au remboursement du prorata de cotisation perçu d'avance au-delà de la date du décès.

Pièces jointes : Copie intégrale de l'acte de décès.

Veuillez agréer mes salutations distinguées.`,
    tips: [
      "Attention : un véhicule appartenant au défunt doit obligatoirement rester assuré (au minimum au tiers) tant qu'il n'est pas vendu ou cédé, même s'il est garé dans un garage fermé.",
      "Le logement doit également rester assuré contre le risque incendie et dégât des eaux jusqu'à la fin de la succession ou la vente."
    ]
  },

  // ==========================================
  // SOUS 6 MOIS
  // ==========================================
  {
    id: 'notaire_succession',
    name: "Étude Notariale (Règlement de la succession, Notoriété & Déclaration 2705)",
    category: 'notaire_succession',
    categoryLabel: 'Notaire & Succession',
    timeframe: '6m',
    priority: 'URGENT',
    description: "Choix de l'office notarial pour ouvrir le dossier de succession, interroger le Fichier Central des Dernières Volontés (FCDDV - testaments), établir l'acte de notoriété et la déclaration fiscale.",
    legalDeadline: 'Sous 6 mois (délai fiscal strict avant intérêts de retard de 0,20%/mois)',
    legalBasis: 'Article 641 du Code Général des Impôts (Dépôt déclaration 6 mois)',
    whyCrucial: "Le notaire est OBLIGATOIRE si le défunt possédait un bien immobilier, si le montant de la succession dépasse 5 000 €, ou en présence d'un testament ou donation entre époux. La déclaration fiscale n° 2705 doit être déposée sous 6 mois pile sous peine de pénalités fiscales.",
    documentsRequired: [
      'Acte de décès et livret de famille complet',
      'Toutes pièces d’identité des héritiers et livrets de famille',
      'Contrat de mariage ou convention de PACS le cas échéant',
      'Titres de propriété immobilière, baux, factures de travaux',
      'Relevés de comptes bancaires au jour du décès et contrats d’assurance-vie',
      'Derniers avis d’imposition'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Maître [Nom du Notaire] - Notaire",
    defaultRecipientAddress: "Office notarial",
    letterSubjectTemplate: "Ouverture du dossier de succession de M./Mme [Nom du défunt] et interrogation du FCDDV",
    letterBodyTemplate: (data) => `Maître,

Je sollicite votre office notarial afin d'assurer l'ouverture et le règlement de la succession de :

Défunt(e) : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'} à ${data.deceasedBirthPlace || '[Lieu]'}
Demeurant de son vivant au : ${data.deceasedAddress || '[Adresse du défunt]'}
Décédé(e) le : ${data.deceasedDeathDate || '[Date du décès]'} à ${data.deceasedDeathPlace || '[Lieu du décès]'}

En ma qualité de ${data.declarantRelationship || 'héritier légal'}, je vous confie le règlement de la succession et vous prie de bien vouloir :
1. Interroger le Fichier Central des Dernières Volontés (FCDDV - Venelles) afin de vérifier l'existence éventuelle d'un testament ou d'une donation entre époux ;
2. Établir l'acte de notoriété constatant la dévolution successorale et l'identité des ayants droit ;
3. Recueillir les états de situation auprès des établissements financiers ;
4. Préparer le bilan patrimonial et la déclaration de succession n° 2705 à déposer auprès de la recette des impôts dans le délai légal de 6 mois.

Notaire pressenti : ${data.notaryName || 'Étude Notariale'}

Vous trouverez sous ce pli les premiers documents civils et fiscaux disponibles.

Dans l'attente de votre premier rendez-vous, je vous prie d'agréer, Maître, mes salutations respectueuses.`,
    tips: [
      "Le délai de 6 mois pour payer les droits de succession est un délai de rigueur fiscale : au-delà, le fisc applique un intérêt de retard de 0,20% par mois + une majoration de 5% à 10%.",
      "Le choix du notaire est totalement libre pour les héritiers. En cas de désaccord entre eux, le notaire du conjoint survivant prime généralement."
    ]
  },
  {
    id: 'banque_assurance_vie_ficovie',
    name: "Assurances-Vie & Recherche de contrats en déshérence (AGIRA & FICOVIE)",
    category: 'bancaire',
    categoryLabel: 'Assurance-Vie',
    timeframe: '6m',
    priority: 'IMPORTANT',
    description: "Saisine de l'AGIRA (Association pour la Gestion des Informations sur le Risque en Assurance) pour identifier tous les contrats d'assurance-vie et prévoyance souscrits par le défunt dont vous seriez bénéficiaire.",
    legalDeadline: 'Sous 6 mois (gratuit)',
    legalBasis: 'Loi Eckert n° 2014-617 du 13 juin 2014 & Code des Assurances art. L132-9-3',
    whyCrucial: "Des milliards d'euros dorment en déshérence. L'assurance-vie est transmise HORS SUCCESSION civile et bénéficie d'un abattement fiscal exceptionnel de 152 500 € par bénéficiaire pour les versements effectués avant 70 ans.",
    documentsRequired: [
      'Copie de l’acte de décès du souscripteur',
      'Pièce d’identité du demandeur'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "AGIRA - Recherche des Bénéficiaires de Contrats d'Assurance-Vie",
    defaultRecipientAddress: "1 rue Jules Lefebvre, 75431 Paris Cedex 09",
    letterSubjectTemplate: "Demande de recherche de contrats d'assurance-vie souscrits par le défunt (Saisine AGIRA)",
    letterBodyTemplate: (data) => `Madame, Monsieur le Responsable du service AGIRA,

Je sollicite par la présente votre organisme afin qu'il procède à la recherche des éventuels contrats d'assurance-vie ou de capitalisation souscrits par la personne décédée suivante :

Nom et Prénom du défunt : ${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Nom de jeune fille le cas échéant : [Nom de jeune fille]
Né(e) le : ${data.deceasedBirthDate || '[Date de naissance]'} à ${data.deceasedBirthPlace || '[Lieu de naissance]'}
Dernière adresse : ${data.deceasedAddress || '[Dernière adresse du défunt]'}
Date et lieu du décès : ${data.deceasedDeathDate || '[Date du décès]'} à ${data.deceasedDeathPlace || '[Lieu]'}

Agissant en qualité de ${data.declarantRelationship || 'proche / héritier'}, je vous remercie de transmettre cette demande à l'ensemble des compagnies d'assurance adhérentes afin que celles détentrices d'un contrat dont je serais bénéficiaire puissent me contacter sous le délai légal d'un mois.

Ci-joint : Acte de décès officiel et copie de ma pièce d'identité.

Veuillez agréer mes salutations distinguées.`,
    tips: [
      "La saisine de l'AGIRA est 100% GRATUITE. Les assureurs ont ensuite l'obligation légale de répondre sous 1 mois s'ils trouvent un contrat.",
      "Le notaire peut également interroger le fichier national FICOVIE (Fichier des Contrats d'Assurance-Vie et de Capitalisation) géré par la DGFiP."
    ]
  },
  {
    id: 'ants_carte_grise',
    name: "ANTS / Préfecture (Transfert ou cession de la Carte Grise du véhicule)",
    category: 'divers',
    categoryLabel: 'Véhicule & Transport',
    timeframe: '6m',
    priority: 'RECOMMANDE',
    description: "Régularisation du certificat d'immatriculation du ou des véhicules du défunt (conservation par le conjoint, attribution à un héritier ou vente).",
    legalDeadline: 'Sous 3 mois après la succession (délai toléré 6 mois)',
    legalBasis: 'Arrêté du 9 février 2009 relatif aux modalités d’immatriculation des véhicules',
    whyCrucial: "Rouler avec la carte grise d'une personne décédée au-delà du délai légal est passible d'une amende de 135 €. En cas d'infraction radar, les avis continuent d'être émis au nom du défunt.",
    documentsRequired: [
      'Certificat d’immatriculation original barré',
      'Certificat d’hérédité ou attestation notariée de dévolution',
      'Lettre de désistement des autres héritiers si attribution à un seul'
    ],
    stopsDirectDebits: false,
    defaultRecipientName: "Agence Nationale des Titres Sécurisés (ANTS)",
    defaultRecipientAddress: "Téléservice officiel ANTS Immatriculation",
    letterSubjectTemplate: "Demande de mise à jour du certificat d'immatriculation suite à succession",
    letterBodyTemplate: (data) => `Madame, Monsieur le Responsable des Titres Sécurisés,

Je vous informe du décès du titulaire du certificat d'immatriculation :

${data.deceasedFullName || '[Nom et Prénom du défunt]'}
Véhicule immatriculé : [Numéro d'immatriculation]
Date du décès : ${data.deceasedDeathDate || '[Date du décès]'}

En ma qualité de ${data.declarantRelationship || 'ayant droit et attributaire du véhicule'}, je sollicite la modification de la carte grise à mon nom, conformément à l'attestation notariée ci-jointe.

Veuillez agréer mes salutations distinguées.`,
    tips: [
      "Si le conjoint survivant était co-titulaire marié sous le régime de la communauté, le changement de carte grise ne coûte que la taxe fixe d'acheminement (environ 13,76 €), sans taxe régionale sur les chevaux fiscaux.",
      "Si les héritiers décident de vendre le véhicule immédiatement sans rouler avec, ils n'ont pas besoin de refaire la carte grise à leur nom si la vente intervient dans les 3 mois."
    ]
  }
];

export const DIRECT_DEBIT_BLOCKING_INSTRUCTIONS = [
  {
    title: "1. Notifier la banque du blocage immédiat",
    detail: "Dès réception de l'acte de décès, la banque doit bloquer tous les comptes individuels. Aucune facture émise après la date du décès ne peut être prélevée sans l'accord exprès de la succession."
  },
  {
    title: "2. Opposition légale pour tout prélèvement abusif (Art. 2003 du Code Civil)",
    detail: "Le mandat de prélèvement SEPA consenti par le défunt s'éteint de plein droit au décès. Tout débit intervenant après la notification est juridiquement indu et doit être remboursé par la banque sous 10 jours ouvrés."
  },
  {
    title: "3. Seuls les frais funéraires (plafond 5 000 €) et impôts restent prioritaires",
    detail: "La banque a l'obligation légale de régler la facture des pompes funèbres directement depuis le compte du défunt dans la limite de 5 000 €, ainsi que les dettes fiscales antérieures exigibles."
  }
];
