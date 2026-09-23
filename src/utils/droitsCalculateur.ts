import { DroitsUserInputs, AidEligibilityResult, DroitsCalculationSummary } from '../types/droits';

/**
 * Moteur de calcul souverain et local des droits sociaux français.
 * Fonctionne à 100% dans le navigateur de l'usager, sans transmission sur internet.
 */
export function calculateSocialRights(inputs: DroitsUserInputs): DroitsCalculationSummary {
  const aids: AidEligibilityResult[] = [];

  const totalMonthlyIncome = inputs.monthlyNetSalary + inputs.monthlyOtherIncome;
  const isCouple = inputs.householdStatus === 'couple';
  const nbPersons = (isCouple ? 2 : 1) + inputs.childrenCount;

  // Calcul des Unités de Consommation (UC) selon l'INSEE :
  // 1er adulte = 1 UC, 2ème personne de 14 ans ou plus = 0.5 UC, enfant de moins de 14 ans = 0.3 UC
  let consumptionUnits = isCouple ? 1.5 : 1.0;
  consumptionUnits += inputs.childrenCount * 0.3;

  // Estimation du RFR si non renseigné (salaire annuel net imposable approx)
  const effectiveRFR = inputs.annualTaxableIncome > 0
    ? inputs.annualTaxableIncome
    : totalMonthlyIncome * 12 * 0.9; // abattement 10% forfaitaire

  const rfrPerUC = effectiveRFR / Math.max(consumptionUnits, 1.0);

  // ========================================================
  // 1. PRIME D'ACTIVITÉ (CAF / MSA)
  // Barème officiel indicatif :
  // Montant forfaitaire de base ~622,63 €
  // Majoration : +50% pour couple ou 1er enfant, +30% par personne supp.
  // Bonification individuelle si salaire net > ~680 €
  // ========================================================
  if (inputs.monthlyNetSalary > 300) {
    let baseForfait = 622.63;
    if (isCouple) baseForfait += 311.31; // +50%
    if (inputs.childrenCount >= 1) {
      baseForfait += isCouple ? 186.78 : 311.31;
      if (inputs.childrenCount >= 2) {
        baseForfait += (inputs.childrenCount - 1) * 186.78;
      }
    }

    // Forfait logement déduit si locataire avec APL ou propriétaire
    let forfaitLogement = 74.72;
    if (nbPersons === 2) forfaitLogement = 149.43;
    if (nbPersons >= 3) forfaitLogement = 184.92;

    // Bonification salariale (max ~181 € si salaire proche SMIC)
    let bonification = 0;
    if (inputs.monthlyNetSalary >= 680) {
      const excess = Math.min(inputs.monthlyNetSalary - 680, 800);
      bonification = Math.min(181, excess * 0.22);
    }

    // Calcul de la prime : (Montant forfaitaire + 61% des revenus professionnels + Bonification) - Ressources totales - Forfait logement
    const theoreticalPrime = (baseForfait + 0.61 * inputs.monthlyNetSalary + bonification) - totalMonthlyIncome - forfaitLogement;

    if (theoreticalPrime > 15) {
      const roundedAmount = Math.round(theoreticalPrime);
      aids.push({
        id: 'prime_activite',
        name: "Prime d'Activité",
        organism: 'CAF',
        category: 'Revenus & Activité',
        status: 'eligible',
        estimatedMonthlyAmount: roundedAmount,
        estimatedAnnualAmount: roundedAmount * 12,
        description: "Complément de revenus versé chaque mois par la CAF pour les salariés, indépendants ou alternants modestes.",
        whyEligible: `Avec un revenu professionnel net de ${inputs.monthlyNetSalary} €/mois et un foyer de ${nbPersons} personne(s), votre barème CAF vous ouvre droit à un complément substantiel.`,
        conditionsSummary: "Être majeur, résider en France, exercer une activité professionnelle procurant des revenus modestes.",
        counterGuichet: "Caisse d'Allocations Familiales (CAF) ou MSA",
        requiredDocuments: [
          "Dernier avis d'imposition",
          "Bulletins de paie des 3 derniers mois",
          "Numéro d'allocataire CAF (ou création de compte)",
          "Relevé d'Identité Bancaire (RIB)",
        ],
        plumePresetPrompt: `Demande officielle d'ouverture des droits à la Prime d'Activité pour un foyer de ${nbPersons} personne(s) avec des revenus d'activité mensuels de ${inputs.monthlyNetSalary} euros.`,
        officialUrl: "https://www.caf.fr",
      });
    }
  }

  // ========================================================
  // 2. CHÈQUE ÉNERGIE (Ministère de la Transition Écologique)
  // RFR par UC inférieur à 11 000 €
  // Montants réels : 48 € à 277 € / an
  // ========================================================
  if (rfrPerUC < 11000) {
    let chequeAmount = 48;
    if (rfrPerUC < 5600) {
      chequeAmount = nbPersons >= 2 ? 277 : 194;
    } else if (rfrPerUC < 6700) {
      chequeAmount = nbPersons >= 2 ? 202 : 146;
    } else if (rfrPerUC < 7700) {
      chequeAmount = nbPersons >= 2 ? 152 : 98;
    } else {
      chequeAmount = nbPersons >= 2 ? 76 : 48;
    }

    aids.push({
      id: 'cheque_energie',
      name: "Chèque Énergie Annuel",
      organism: 'Ministère Transition Écologique',
      category: 'Énergie & Factures',
      status: 'eligible',
      estimatedMonthlyAmount: Math.round(chequeAmount / 12),
      estimatedAnnualAmount: chequeAmount,
      description: "Aide de l'État pour régler vos factures d'électricité, de gaz, de fioul, de bois ou pour financer des travaux d'économie d'énergie.",
      whyEligible: `Votre Revenu Fiscal de Référence par unité de consommation (${Math.round(rfrPerUC)} €/UC) est inférieur au plafond légal de 11 000 €/UC.`,
      conditionsSummary: "Attribué automatiquement sur déclaration fiscale, mais non-réclamé par plus d'un million de ménages lors d'un déménagement ou oubli.",
      counterGuichet: "Portail public du Chèque Énergie (chequeenergie.gouv.fr) ou assistance téléphonique nationale",
      requiredDocuments: [
        "Dernier avis d'impôt sur les revenus (mentionnant le RFR)",
        "Facture récente d'électricité ou de gaz au nom du demandeur",
        "Référence client de votre fournisseur d'énergie",
      ],
      plumePresetPrompt: `Réclamation officielle auprès des services du Chèque Énergie suite à la non-réception de mon chèque d'un montant théorique de ${chequeAmount} euros pour l'année en cours (RFR par UC inférieur au plafond).`,
      officialUrl: "https://www.chequeenergie.gouv.fr",
    });
  }

  // ========================================================
  // 3. COMPLÉMENTAIRE SANTÉ SOLIDAIRE (CSS) (Assurance Maladie)
  // Plafond gratuité personne seule : ~10 166 € / an (~847 €/mois)
  // Plafond participation (< 1€/j) : ~13 724 € / an (~1 143 €/mois)
  // Multiplié selon composition : +50% pour couple, +30% par enfant.
  // ========================================================
  const cssAnnualCoeff = 1 + (isCouple ? 0.5 : 0) + (inputs.childrenCount * 0.3);
  const cssFreeCeiling = 10166 * cssAnnualCoeff;
  const cssPaidCeiling = 13724 * cssAnnualCoeff;
  const totalAnnualResources = totalMonthlyIncome * 12;

  if (totalAnnualResources <= cssPaidCeiling) {
    const isFree = totalAnnualResources <= cssFreeCeiling;
    const estimatedValueMonthly = isFree ? 65 * nbPersons : 45 * nbPersons;

    aids.push({
      id: 'css_sante',
      name: isFree ? "Complémentaire Santé Solidaire (100% Gratuite)" : "Complémentaire Santé Solidaire (Participation modérée < 1€/jour)",
      organism: 'CPAM',
      category: 'Santé',
      status: 'eligible',
      estimatedMonthlyAmount: estimatedValueMonthly,
      estimatedAnnualAmount: estimatedValueMonthly * 12,
      description: "Mutuelle de santé solidaire prenant en charge le médecin, dentiste, optique et pharmacie sans aucun dépassement d'honoraires ni avance de frais.",
      whyEligible: `Les ressources annuelles de votre foyer (${totalAnnualResources} €) se situent sous le plafond légal de ${Math.round(cssPaidCeiling)} €. Vous économisez ainsi le coût d'une mutuelle privée.`,
      conditionsSummary: "Bénéficier de l'Assurance Maladie en France et respecter les plafonds de revenus des 12 derniers mois.",
      counterGuichet: "Caisse Primaire d'Assurance Maladie (CPAM / compte Ameli) ou MSA",
      requiredDocuments: [
        "Formulaire Cerfa n° 12504*09 complété",
        "Avis d'imposition de tous les membres du foyer",
        "Attestation de droits Sécurité Sociale (carte Vitale)",
        "Justificatifs de toutes les ressources des 12 derniers mois",
      ],
      plumePresetPrompt: `Demande officielle d'attribution de la Complémentaire Santé Solidaire (CSS) auprès de la Caisse Primaire d'Assurance Maladie pour un foyer de ${nbPersons} personne(s).`,
      officialUrl: "https://www.ameli.fr",
    });
  }

  // ========================================================
  // 4. AIDES DU CCAS & FONDS SOLIDARITÉ LOGEMENT (Commune)
  // Aides méconnues : secours d'urgence, bons énergies communaux,
  // aide alimentaire, cantine scolaire à 1 €.
  // ========================================================
  if (rfrPerUC < 13500 || totalMonthlyIncome / nbPersons < 1100) {
    const isLaGrandeMotteOrHerault = inputs.postalCode.startsWith('34') || inputs.cityName.toLowerCase().includes('motte');
    const localAidAnnual = inputs.childrenCount > 0 ? 350 : 200;

    aids.push({
      id: 'ccas_local',
      name: isLaGrandeMotteOrHerault
        ? "Aides Locales CCAS (La Grande-Motte / Hérault)"
        : `Aides d'Urgence du CCAS (${inputs.cityName || 'Votre Mairie'})`,
      organism: 'CCAS & Commune',
      category: 'Énergie & Factures',
      status: 'likely_eligible',
      estimatedMonthlyAmount: Math.round(localAidAnnual / 12),
      estimatedAnnualAmount: localAidAnnual,
      description: "Dispositifs sociaux de proximité gérés par votre mairie : aides financières d'urgence, prise en charge partielle de factures d'eau/gaz, secours d'hiver et Fonds Solidarité Logement (FSL).",
      whyEligible: `Votre reste à vivre par personne (${Math.round(totalMonthlyIncome / nbPersons)} €/mois) est éligible aux barèmes d'intervention sociale de votre Centre Communal d'Action Sociale.`,
      conditionsSummary: "Résider de façon stable sur la commune et présenter un dossier social avec justificatifs de charges.",
      counterGuichet: isLaGrandeMotteOrHerault
        ? "CCAS de La Grande-Motte (Hôtel de Ville) ou Maison Départementale des Solidarités"
        : `CCAS de la Mairie de ${inputs.cityName || 'votre commune'}`,
      requiredDocuments: [
        "Justificatif de domicile récent sur la commune (bail ou facture)",
        "Dernier avis d'imposition",
        "Facture impayée ou en retard d'échéance (eau, EDF, loyer)",
        "Relevés de compte bancaire du dernier mois",
      ],
      plumePresetPrompt: `Demande de secours financier exceptionnel et saisine du CCAS de ${inputs.cityName || 'la commune'} suite à des difficultés temporaires de paiement des factures d'énergie et de charges du foyer.`,
    });
  }

  // ========================================================
  // 5. ALLOCATION DE RENTRÉE SCOLAIRE (ARS) (CAF)
  // Enfants âgés de 6 à 18 ans
  // Montant moyen : ~420 € par enfant scolarisé
  // ========================================================
  if (inputs.childrenCount > 0 && rfrPerUC < 17000) {
    const arsChildrenCount = inputs.childrenAges && inputs.childrenAges.length > 0
      ? inputs.childrenAges.filter(age => age >= 6 && age <= 18).length
      : Math.ceil(inputs.childrenCount * 0.7); // estimation

    if (arsChildrenCount > 0) {
      const totalArs = arsChildrenCount * 420;
      aids.push({
        id: 'ars_rentree',
        name: "Allocation de Rentrée Scolaire (ARS)",
        organism: 'CAF',
        category: 'Famille & Enfance',
        status: 'eligible',
        estimatedMonthlyAmount: Math.round(totalArs / 12),
        estimatedAnnualAmount: totalArs,
        description: "Aide versée fin août pour couvrir les frais de fournitures, cartables et matériel pour les enfants scolarisés de 6 à 18 ans.",
        whyEligible: `Vous avez ${arsChildrenCount} enfant(s) dans la tranche d'âge 6-18 ans et votre RFR respecte le plafond de ressources de la CAF.`,
        conditionsSummary: "Avoir des enfants scolarisés de 6 à 18 ans dans un établissement public ou privé sous contrat.",
        counterGuichet: "Caisse d'Allocations Familiales (CAF)",
        requiredDocuments: [
          "Certificat de scolarité (pour les 16-18 ans)",
          "Déclaration de situation CAF à jour",
        ],
        plumePresetPrompt: `Déclaration de scolarité et demande de versement de l'Allocation de Rentrée Scolaire (ARS) pour mes enfants scolarisés.`,
      });
    }
  }

  // ========================================================
  // 6. AIDE PERSONNALISÉE AU LOGEMENT (APL) (CAF)
  // Si locataire avec loyer significatif et revenus modestes
  // ========================================================
  if (inputs.housingStatus === 'tenant' && inputs.monthlyRentOrMortgage > 250) {
    if (totalMonthlyIncome < (1200 + nbPersons * 400)) {
      // Estimation indicative APL
      const baseApl = Math.min(
        Math.max(60, inputs.monthlyRentOrMortgage * 0.45 - (totalMonthlyIncome * 0.18)),
        380
      );
      if (baseApl > 30) {
        const roundedApl = Math.round(baseApl);
        aids.push({
          id: 'apl_logement',
          name: "Aide Personnalisée au Logement (APL)",
          organism: 'CAF',
          category: 'Logement',
          status: 'likely_eligible',
          estimatedMonthlyAmount: roundedApl,
          estimatedAnnualAmount: roundedApl * 12,
          description: "Prise en charge partielle de votre loyer mensuel par la CAF, déduite directement par votre bailleur ou versée sur votre compte.",
          whyEligible: `Votre loyer de ${inputs.monthlyRentOrMortgage} € rapporté aux revenus de votre foyer vous place en zone d'éligibilité pour un allègement de charge locative.`,
          conditionsSummary: "Être locataire d'un logement décent conventionné ou non, être titulaire du bail de location.",
          counterGuichet: "CAF ou MSA de votre département",
          requiredDocuments: [
            "Contrat de bail de location signé",
            "Attestation de loyer complétée par le propriétaire / bailleur",
            "Quittance de loyer du mois précédent",
            "Relevé d'identité bancaire",
          ],
          plumePresetPrompt: `Demande d'ouverture de droits à l'Aide Personnalisée au Logement (APL) suite à mon emménagement et signature du contrat de bail.`,
        });
      }
    }
  }

  // ========================================================
  // 7. PASS'SPORT & TARIFICATION SOLIDAIRE CANTINE
  // ========================================================
  if (inputs.childrenCount > 0 && rfrPerUC < 15000) {
    const sportAide = inputs.childrenCount * 50;
    aids.push({
      id: 'pass_sport',
      name: "Pass'Sport (50 € par enfant) & Cantine à 1 €",
      organism: 'État & Éducation',
      category: 'Famille & Enfance',
      status: 'eligible',
      estimatedMonthlyAmount: Math.round((sportAide + inputs.childrenCount * 60) / 12),
      estimatedAnnualAmount: sportAide + (inputs.childrenCount * 60),
      description: "Déduction immédiate de 50 € par enfant pour l'inscription dans un club sportif partenaire, et accès à la cantine scolaire à 1 € dans les communes éligibles.",
      whyEligible: `Votre foyer respecte les critères d'attribution de l'ARS ou du chèque énergie donnant droit automatique aux codes Pass'Sport de l'État.`,
      conditionsSummary: "Enfants de 6 à 17 ans bénéficiaires de l'ARS ou de l'AEEH.",
      counterGuichet: "Club sportif partenaire (présentation du code Pass'Sport reçu par courriel) et service scolaire de la Mairie",
      requiredDocuments: [
        "Code Pass'Sport transmis par le Ministère des Sports",
        "Attestation de paiement CAF récente",
      ],
      plumePresetPrompt: `Demande d'application du tarif social cantine scolaire à 1 euro auprès du service scolaire de la commune.`,
    });
  }

  // Calculate totals
  const totalEstimatedMonthly = aids.reduce((sum, a) => sum + a.estimatedMonthlyAmount, 0);
  const totalEstimatedAnnual = aids.reduce((sum, a) => sum + a.estimatedAnnualAmount, 0);

  return {
    totalEstimatedMonthly,
    totalEstimatedAnnual,
    eligibleAidsCount: aids.length,
    aids,
  };
}
