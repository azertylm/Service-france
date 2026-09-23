import { VetusteGridItem } from '../types/etatDesLieux';

/**
 * Grille de vétusté de référence fondée sur l'Accord Collectif National
 * (Homologué et couramment admis par la Commission Départementale de Conciliation
 * et les Tribunaux Judiciaires en application du Décret n° 2016-382 du 30 mars 2016).
 */
export const OFFICIAL_VETUSTE_GRIDS: VetusteGridItem[] = [
  {
    id: 'peintures_papiers',
    name: 'Peintures, papiers peints & revêtements muraux',
    category: 'murs_plafonds',
    lifespanYears: 7,
    franchiseYears: 1,
    annualRatePercent: 14,
    residualRatePercent: 10,
    source: 'Accord National OPHLM / Décret 2016-382',
    description: 'Usage normal des murs (jaunissement, traces d\'ombres de tableaux, micro-rayures de frottement). Les trous de chevilles rebouchés proprement sont une usure normale.',
    examples: [
      'Ombres de meubles et cadres au mur',
      'Trous de chevilles rebouchés avec enduit',
      'Léger jaunissement dû à la lumière naturelle',
    ],
  },
  {
    id: 'moquettes_sols_souples',
    name: 'Moquettes, linos & sols PVC souples',
    category: 'sols_plinthes',
    lifespanYears: 7,
    franchiseYears: 1,
    annualRatePercent: 14,
    residualRatePercent: 10,
    source: 'Grille de vétusté FNAIM / Décret 2016-382',
    description: 'Écrasement des fibres, décoloration dans les zones de passage habituel, usure due au frottement répétitif.',
    examples: [
      'Zones de piétinement devant la porte ou le lit',
      'Tassement normal de la moquette sous les meubles',
    ],
  },
  {
    id: 'parquet_flottant_stratifie',
    name: 'Parquet stratifié & parquet flottant',
    category: 'sols_plinthes',
    lifespanYears: 10,
    franchiseYears: 2,
    annualRatePercent: 10,
    residualRatePercent: 10,
    source: 'Accord National / Décret 2016-382',
    description: 'Micro-rayures superficielles, éclaircissement ou assombrissement sous les tapis, usure de la couche de finition.',
    examples: [
      'Micro-rayures sous les pieds de chaises',
      'Décoloration liée aux UV du soleil',
    ],
  },
  {
    id: 'parquet_massif',
    name: 'Parquet massif vitrifié ou ciré',
    category: 'sols_plinthes',
    lifespanYears: 25,
    franchiseYears: 5,
    annualRatePercent: 4.5,
    residualRatePercent: 10,
    source: 'Barème professionnel / CDC',
    description: 'Patinage naturel du bois, usure du vernis en zone de circulation. Le ponçage intégral incombe au propriétaire après un bail de longue durée.',
    examples: [
      'Vernis terni dans le couloir d\'entrée',
      'Légères marques de meubles sur le bois ancien',
    ],
  },
  {
    id: 'carrelage_faience',
    name: 'Carrelages, faïences & dallages',
    category: 'sols_plinthes',
    lifespanYears: 25,
    franchiseYears: 5,
    annualRatePercent: 4.5,
    residualRatePercent: 10,
    source: 'Accord National / Décret 2016-382',
    description: 'Usure normale des joints, dépolissage superficiel du carrelage dans les zones de circulation intense.',
    examples: [
      'Joints de carrelage blanchis ou grisés avec le temps',
      'Éclat mineur superficiel de moins de 2 mm',
    ],
  },
  {
    id: 'sanitaires_ceramique',
    name: 'Appareils sanitaires céramique (lavabo, baignoire, WC)',
    category: 'sanitaires_robinetterie',
    lifespanYears: 20,
    franchiseYears: 2,
    annualRatePercent: 5,
    residualRatePercent: 10,
    source: 'Grille de vétusté CLCV / Accord National',
    description: 'Ternissement de l\'émail, rayures d\'usage, tartre incrusté inévitable avec l\'eau calcaire malgré entretien périodique.',
    examples: [
      'Émail légèrement terni au fond de la baignoire',
      'Marques de calcaire dues à la dureté de l\'eau locale',
    ],
  },
  {
    id: 'robinetterie_mitigeurs',
    name: 'Robinetterie, mitigeurs & colonnes de douche',
    category: 'sanitaires_robinetterie',
    lifespanYears: 10,
    franchiseYears: 1,
    annualRatePercent: 10,
    residualRatePercent: 10,
    source: 'Décret 2016-382 / Usages CDC',
    description: 'Le remplacement des joints et mousseurs relève de l\'entretien locatif, mais l\'usure du mécanisme interne (cartouche céramique, corps de robinet) est une vétusté.',
    examples: [
      'Poignée de mitigeur qui devient dure avec les années',
      'Chrome micro-rayé par le nettoyage régulier',
    ],
  },
  {
    id: 'electromenager_meuble',
    name: 'Gros électroménager fourni (four, plaques, réfrigérateur)',
    category: 'electromenager',
    lifespanYears: 8,
    franchiseYears: 1,
    annualRatePercent: 12.5,
    residualRatePercent: 10,
    source: 'Barème mobilier meublé / Décret 2016-382',
    description: 'Usure normale des résistances, ventilateurs, joints de porte assouplis, rayures sur plaques vitrocéramiques.',
    examples: [
      'Rayures d\'usage sur la table à induction après 3 ans',
      'Joint de réfrigérateur jauni ou détendu avec l\'âge',
    ],
  },
  {
    id: 'menuiseries_volets',
    name: 'Menuiseries, fenêtres, volets roulants & stores',
    category: 'portes_fenetres',
    lifespanYears: 15,
    franchiseYears: 2,
    annualRatePercent: 7,
    residualRatePercent: 10,
    source: 'Accord National / Décret 2016-382',
    description: 'Décoloration des lames PVC au soleil, sangle de volet effilochée par l\'usage quotidien, jeu normal dans les gonds.',
    examples: [
      'Sangle de volet manuel usée par les ouvertures quotidiennes',
      'Joint d\'isolation de fenêtre ayant perdu en souplesse',
    ],
  },
  {
    id: 'chauffe_eau_cumulus',
    name: 'Chauffe-eau électrique / Cumulus / Chaudière',
    category: 'sanitaires_robinetterie',
    lifespanYears: 10,
    franchiseYears: 1,
    annualRatePercent: 10,
    residualRatePercent: 10,
    source: 'Barème professionnel / CDC',
    description: 'Le locataire doit l\'entretien annuel (chaudière), mais le détartrage lourd de cuve et le remplacement du corps de chauffe ou groupe de sécurité vétuste incombent au bailleur.',
    examples: [
      'Panne de résistance blindée due au calcaire après 6 ans',
      'Cuve de cumulus percée par corrosion interne',
    ],
  },
];

/**
 * Calcul mathématique et légal de l'abattement pour vétusté
 */
export function calculateLegalDepreciation(
  item: VetusteGridItem,
  occupancyYears: number,
  initialCostOrQuote: number
) {
  // If still in franchise period, no depreciation applied
  if (occupancyYears <= item.franchiseYears) {
    return {
      yearsAfterFranchise: 0,
      depreciationRatePercent: 0,
      sharePaidByOwnerPercent: 0,
      sharePaidByTenantPercent: 100,
      amountDeductedForOwner: 0,
      maxAmountPayableByTenant: Math.round(initialCostOrQuote * 100) / 100,
      isFullyDepreciated: false,
    };
  }

  const yearsAfterFranchise = occupancyYears - item.franchiseYears;
  const rawDepreciationPercent = yearsAfterFranchise * item.annualRatePercent;

  // Max depreciation caps at (100 - residualRatePercent)
  const maxDepreciationPercent = 100 - item.residualRatePercent;
  const depreciationRatePercent = Math.min(rawDepreciationPercent, maxDepreciationPercent);

  const sharePaidByOwnerPercent = depreciationRatePercent;
  const sharePaidByTenantPercent = Math.max(100 - depreciationRatePercent, item.residualRatePercent);

  const amountDeductedForOwner = Math.round((initialCostOrQuote * (sharePaidByOwnerPercent / 100)) * 100) / 100;
  const maxAmountPayableByTenant = Math.round((initialCostOrQuote * (sharePaidByTenantPercent / 100)) * 100) / 100;

  return {
    yearsAfterFranchise,
    depreciationRatePercent,
    sharePaidByOwnerPercent,
    sharePaidByTenantPercent,
    amountDeductedForOwner,
    maxAmountPayableByTenant,
    isFullyDepreciated: rawDepreciationPercent >= maxDepreciationPercent,
  };
}

/**
 * Articles de loi de référence pour la location en France
 */
export const FRENCH_HOUSING_LEGAL_REFERENCES = [
  {
    title: 'Article 22 de la Loi n° 89-462 du 6 juillet 1989 (modifiée Loi ALUR)',
    topic: 'Restitution du dépôt de garantie et pénalités de retard',
    summary:
      'Le dépôt de garantie doit être restitué sous 1 mois si l\'état des lieux de sortie est conforme, ou 2 mois s\'il y a des dégradations. À défaut de restitution dans ces délais, le solde dû est majoré de 10% du loyer mensuel hors charges pour chaque mois de retard commencé.',
  },
  {
    title: 'Article 7 alinéa d de la Loi n° 89-462 du 6 juillet 1989',
    topic: 'Obligation d\'entretien et exclusion de la vétusté',
    summary:
      'Le locataire est obligé de prendre à sa charge l\'entretien courant du logement et des équipements ainsi que les menues réparations, sauf si celles-ci sont occasionnées par vétusté, malfaçon, vice de construction, cas fortuit ou force majeure.',
  },
  {
    title: 'Décret n° 2016-382 du 30 mars 2016',
    topic: 'Définition légale de la vétusté et états des lieux',
    summary:
      'La vétusté est définie comme l\'état d\'usure ou de détérioration résultant du seul usage normal de la chose louée ou des effets du temps. L\'application d\'une grille de vétusté s\'impose pour évaluer la part imputable.',
  },
  {
    title: 'Article 3-2 de la Loi du 6 juillet 1989',
    topic: 'Caractère contradictoire de l\'état des lieux',
    summary:
      'L\'état des lieux doit être établi contradictoirement et amiablement par les parties ou par un commissaire de justice (huissier). Les dégradations doivent être expressément constatées par comparaison directe avec l\'entrée.',
  },
  {
    title: 'Cour de Cassation, 3e Chambre Civile (Jurisprudence constante)',
    topic: 'Obligation de justification des retenues',
    summary:
      'Le propriétaire bailleur a la charge de prouver la réalité des dégradations et leur montant au moyen de devis d\'artisans ou de factures acquittées. Aucune retenue forfaitaire ou arbitraire n\'est recevable.',
  },
];
