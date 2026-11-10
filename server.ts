import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { callMistralAI, getMistralConfigFromReq } from './src/server/mistralAi';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Generous body limit for image & document base64 uploads
app.use(express.json({ limit: '35mb' }));

// ==============================================================================
// STATUS & TEST ENDPOINT: MISTRAL AI (Cloud & Local Ollama Mac Metal)
// ==============================================================================
app.post('/api/mistral/status', async (req, res) => {
  try {
    const config = getMistralConfigFromReq(req);

    if (!config.apiKey && !config.isLocalOllama) {
      return res.json({
        success: true,
        configured: false,
        tier: 'trial',
        message:
          "Mode Période d'essai souveraine Alphabette actif (7 jours offerts). Renseignez votre propre clé Mistral pour activer le mode BYOK illimité.",
      });
    }

    // Ping Mistral API endpoint
    const pingEndpoint = `${config.baseUrl}/models`;
    const pingHeaders: Record<string, string> = {};
    if (config.apiKey) {
      pingHeaders['Authorization'] = `Bearer ${config.apiKey}`;
    }

    const testRes = await fetch(pingEndpoint, {
      method: 'GET',
      headers: pingHeaders,
    });

    if (testRes.ok) {
      const data = await testRes.json();
      return res.json({
        success: true,
        configured: true,
        isLocalOllama: config.isLocalOllama,
        baseUrl: config.baseUrl,
        model: config.model,
        message: config.isLocalOllama
          ? `Connexion réussie à votre instance locale Ollama (${config.baseUrl}) !`
          : "Connexion réussie à l'API Cloud officielle de Mistral AI (Souveraineté européenne / RGPD natif) !",
        availableModelsCount: data?.data?.length || 0,
      });
    } else {
      const errText = await testRes.text();
      return res.json({
        success: false,
        configured: false,
        message: `Erreur Mistral (${testRes.status}) : ${errText.slice(0, 150)}`,
      });
    }
  } catch (err: any) {
    return res.json({
      success: false,
      configured: false,
      message:
        "Impossible de joindre le serveur Mistral : " +
        (err?.message || "Vérifiez l'URL de base ou votre connexion."),
    });
  }
});

// ==============================================================================
// MODULE 1 : CLAIRCONTRAT (Analyse documentaire & détection des pièges)
// ==============================================================================
app.post('/api/analyze-contract', async (req, res) => {
  try {
    const { text, file, contractTypeHint } = req.body;

    if (!text && !file) {
      return res.status(400).json({
        error: "Aucun document fourni. Veuillez transmettre un texte, une image ou un PDF.",
      });
    }

    const systemPrompt = `Tu es le moteur d'intelligence artificielle souverain, sécurisé et bienveillant au cœur de l'application « papierpapier.fr », propulsée exclusivement par la technologie française Mistral AI pour ALPHABETTE SASU (fondée par Valentin RICHAUD à La Grande-Motte).
Au sein de CLAIRCONTRAT (Protection juridique et décryptage documentaire), ta mission républicaine est d'analyser instantanément les contrats du quotidien (baux d'habitation, devis d'artisans, conditions générales d'abonnement, contrats de travail, assurances).

Tu dois restituer systématiquement ton analyse avec une rigueur absolue, en utilisant toujours le vouvoiement avec l'usager, sans aucun verbiage superflu ni jargon incompréhensible :
1. Synthèse vulgarisée des engagements pris : ce à quoi le signataire s'engage réellement en termes financiers et temporels.
2. Détection impitoyable des clauses abusives, illégales ou déséquilibrées (selon le Code de la consommation art. L. 212-1 et R. 212-1, Code civil art. 1171, Loi du 6 juillet 1989 pour les baux d'habitation, Code des assurances).
3. Points de vigilance majeurs (délais de préavis légaux, reconductions tacites, pénalités cachées, frais abusifs d'état des lieux ou de résiliation).

Garantis un ton direct, sécurisant, hautement bienveillant et structuré.
Réponds STRICTEMENT sous forme d'un objet JSON valide contenant les clés :
contractTitle, contractType, parties (partyA, partyB), summary, riskLevel (FAIBLE, MODERE, ELEVE ou CRITIQUE), riskJustification, threeVigilancePoints (tableau d'objets avec title, severity, quote, decodedTrap, legalReference, recommendedAction), terminationAndHiddenPenalties (noticePeriod, tacitRenewal, hiddenPenalties, freeCancellationConditions), realCommitments (financialSummary, keyObligations, exclusionsAndBlindSpots), negotiationLetterTemplate (subject, body), checklistBeforeSigning.`;

    let userPrompt = `Analyse ce document contractuel en français simple et décortique tous les pièges. Type pressenti : ${
      contractTypeHint || 'Contrat ou devis'
    }.`;
    if (text) {
      userPrompt += `\n\nTexte du document :\n"""\n${text.slice(0, 15000)}\n"""`;
    }

    const images: Array<{ data: string; mimeType: string }> = [];
    if (file && file.data) {
      images.push({
        data: file.data,
        mimeType: file.mimeType || 'image/jpeg',
      });
      userPrompt += `\nUn document numérisé est joint en image. Analyse précisément les clauses visibles et mentions légales.`;
    }

    const fallbackGenerator = () => {
      const isLease =
        (contractTypeHint && contractTypeHint.toLowerCase().includes('bail')) ||
        (text && /loyer|bail|locataire|bailleur/i.test(text));
      const isQuote =
        (contractTypeHint && contractTypeHint.toLowerCase().includes('devis')) ||
        (text && /devis|acompte|artisan|travaux/i.test(text));

      if (isLease) {
        return {
          contractTitle: "Contrat de bail d'habitation principale (Loi du 6 juillet 1989)",
          contractType: "Bail d'habitation",
          parties: {
            partyA: "Bailleur (Propriétaire bailleur ou mandataire)",
            partyB: "Locataire principal",
          },
          summary:
            "Ce contrat encadre la location d'un logement à titre de résidence principale. Il définit le loyer, le dépôt de garantie et les charges locatives.",
          riskLevel: "MODERE",
          riskJustification:
            "Contrat globalement standard, mais comporte 2 clauses déséquilibrées nécessitant une vigilance particulière avant signature.",
          threeVigilancePoints: [
            {
              title: "Clause pénale de retard de loyer illégale",
              severity: "ILLÉGALE",
              quote: "Tout retard dans le paiement du loyer entraînera une pénalité forfaitaire de 10%...",
              decodedTrap:
                "Cette clause est réputée non écrite par la loi. Le bailleur ne peut pas s'auto-octroyer d'amende privée sur les retards.",
              legalReference: "Loi n° 89-462 du 6 juillet 1989, article 4 alinéa i",
              recommendedAction:
                "Exiger le biffage immédiat de cette clause réputée non écrite avant toute signature.",
            },
            {
              title: "Frais de relance et de quittance facturés",
              severity: "ABUSIVE",
              quote: "Frais d'envoi de quittance papier : 5 € par mois...",
              decodedTrap:
                "La délivrance d'une quittance de loyer est strictement gratuite pour le locataire.",
              legalReference: "Loi n° 89-462 du 6 juillet 1989, article 21",
              recommendedAction:
                "Rappeler la gratuité légale de la quittance et refuser tout prélèvement de frais annexes.",
            },
            {
              title: "Délai de restitution du dépôt de garantie",
              severity: "ATTENTION",
              quote: "Le dépôt de garantie sera restitué dans un délai de 2 mois...",
              decodedTrap:
                "Si l'état des lieux de sortie est conforme à l'entrée, le délai légal maximal est réduit à UN SEUL MOIS.",
              legalReference: "Loi n° 89-462 du 6 juillet 1989, article 22",
              recommendedAction:
                "Vérifier que le délai d'1 mois est bien respecté en cas d'état des lieux conforme.",
            },
          ],
          terminationAndHiddenPenalties: {
            noticePeriod:
              "1 mois en zone tendue ou meublé (3 mois pour logement nu hors zone tendue) par LRAR ou acte de commissaire de justice.",
            tacitRenewal: "Reconduction tacite annuelle pour les baux d'habitation meublés (3 ans en nu).",
            hiddenPenalties: [
              "Frais de rappel de loyer illégaux",
              "Retenues arbitraires sans justificatifs de devis",
            ],
            freeCancellationConditions:
              "Le locataire peut résilier à tout moment sans motif en respectant son préavis légal.",
          },
          realCommitments: {
            financialSummary: "Loyer mensuel charges comprises + 1 à 2 mois de dépôt de garantie.",
            keyObligations: [
              "Paiement ponctuel du loyer et des charges",
              "Souscription obligatoire d'une assurance habitation locataire",
              "Entretien courant et menues réparations",
            ],
            exclusionsAndBlindSpots: [
              "Les grosses réparations (toiture, chaudière vétuste) restent à la charge du bailleur.",
            ],
          },
          negotiationLetterTemplate: {
            subject: "Demande de mise en conformité des clauses du bail avant signature",
            body:
              "Madame, Monsieur,\n\nAprès examen attentif du projet de bail d'habitation, je sollicite la mise en conformité de deux clauses avec l'ordre public de protection de la loi du 6 juillet 1989 :\n- La clause de pénalité de retard de loyer (art. 4 al. i).\n- La gratuité stricte de la délivrance des quittances (art. 21).\n\nDans l'attente de votre retour bienveillant,\nVeuillez agréer mes salutations distinguées.",
          },
          checklistBeforeSigning: [
            "Exiger les diagnostics techniques complets (DPE, amiante, électricité, plomb)",
            "Vérifier l'absence de clause de pénalité de retard",
            "S'assurer que la surface habitable réelle est bien mentionnée",
            "Exiger que l'état des lieux soit réalisé contradictoirement sans frais d'agence à l'entrée",
            "Conserver une copie contresignée immédiatement lors de la remise des clés",
          ],
        };
      }

      return {
        contractTitle: isQuote ? "Devis d'artisan / prestation de services" : "Contrat de prestation / engagement contractuel",
        contractType: isQuote ? "Devis de travaux" : "Conditions Générales de Service",
        parties: {
          partyA: "Prestataire émetteur / Professionnel",
          partyB: "Client signataire",
        },
        summary:
          "Ce document contractualise la réalisation d'une prestation avec fixation des tarifs, délais d'exécution et conditions d'acompte.",
        riskLevel: "MODERE",
        riskJustification:
          "Précisions contractuelles nécessaires sur le calendrier d'exécution et les pénalités de retard applicables au professionnel.",
        threeVigilancePoints: [
          {
            title: "Absence de date d'achèvement ferme",
            severity: "ATTENTION",
            quote: "Délais d'exécution donnés à titre indicatif...",
            decodedTrap:
              "Sans date limite ferme, le professionnel peut étirer le chantier sans pénalité de retard.",
            legalReference: "Code de la consommation art. L. 216-1",
            recommendedAction:
              "Faire inscrire une date calendaire précise d'achèvement et des pénalités journalières de retard.",
          },
          {
            title: "Acompte supérieur à la norme de sécurité",
            severity: "RISQUE_FORT",
            quote: "Acompte de 50% à la commande...",
            decodedTrap:
              "Un acompte trop élevé expose le consommateur en cas de défaillance ou de liquidation de l'entreprise avant le début des travaux.",
            legalReference: "Recommandations DGCCRF & FFB (acompte usuel 20-30%)",
            recommendedAction:
              "Négocier un acompte maximal de 30% à la commande et le solde à la réception sans réserve.",
          },
          {
            title: "Attestation d'assurance décennale / RC Pro manquante",
            severity: "ATTENTION",
            quote: "Garanties légales d'usage...",
            decodedTrap:
              "L'artisan doit obligatoirement joindre son attestation d'assurance décennale en cours de validité.",
            legalReference: "Code des assurances art. L. 241-1",
            recommendedAction:
              "Exiger copie de l'attestation décennale mentionnant la zone géographique et l'activité exacte.",
          },
        ],
        terminationAndHiddenPenalties: {
          noticePeriod: "14 jours de droit de rétractation si contrat conclu hors établissement ou à distance.",
          tacitRenewal: "Non applicable pour un devis ponctuel.",
          hiddenPenalties: [
            "Perte d'acompte en cas d'annulation client non justifiée",
            "Frais de métré ou de déplacement non préalablement chiffrés",
          ],
          freeCancellationConditions:
            "Résiliation de plein droit en cas de retard d'exécution supérieur à 30 jours (Code de la consommation).",
        },
        realCommitments: {
          financialSummary: "Montant total TTC arrêté sur le devis avec calendrier d'échelonnement.",
          keyObligations: [
            "Paiement aux jalons validés",
            "Mise à disposition des lieux et accès",
            "Signature du procès-verbal de réception",
          ],
          exclusionsAndBlindSpots: [
            "Les travaux préparatoires ou imprévus doivent faire l'objet d'un avenant écrit signé avant exécution.",
          ],
        },
        negotiationLetterTemplate: {
          subject: "Demande d'ajustement du calendrier et pièces complémentaires du devis",
          body:
            "Madame, Monsieur,\n\nJe fais suite à votre proposition de devis. Afin de finaliser notre accord en toute sérénité, je vous remercie d'y intégrer la date limite ferme d'achèvement et de m'adresser votre attestation d'assurance décennale à jour.\n\nBien cordialement,",
        },
        checklistBeforeSigning: [
          "Vérifier le numéro SIREN/SIRET de l'artisan sur societe.com ou infogreffe",
          "Exiger l'attestation d'assurance décennale en cours de validité",
          "Refuser tout versement supérieur à 30% avant le début effectif du chantier",
          "S'assurer que la mention « Devis reçu avant exécution des travaux » est présente",
          "Conserver un double original signé des deux parties",
        ],
      };
    };

    const analysis = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({
      success: true,
      analysis,
      sovereignProvider: "Mistral AI (France / Europe RGPD)",
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-contract:", error);
    return res.status(500).json({
      error: error?.message || "Erreur lors de l'analyse du document. Veuillez réessayer.",
    });
  }
});

// ==============================================================================
// CLAIRCONTRAT : Questions/Réponses juridiques interactives
// ==============================================================================
app.post('/api/ask-contract-question', async (req, res) => {
  try {
    const { question, contractTitle, contractSummary, contractType, pointsSummary } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question requise." });
    }

    const systemPrompt = `Tu es l'assistant juridique citoyen de « ClairContrat », propulsé par la technologie souveraine Mistral AI (ALPHABETTE SASU).
Réponds en 2 à 4 paragraphes clairs, bienveillants et rigoureux au regard du droit français (Code civil, Code de la consommation, Loi de 1989).`;

    const userPrompt = `Contexte du contrat :
- Intitulé : ${contractTitle || contractType || 'Contrat'}
- Synthèse : ${contractSummary || 'Non spécifiée'}
- Points critiques : ${JSON.stringify(pointsSummary || [])}

Question de l'usager :
"${question}"

Réponds de manière directe, cite la règle de droit applicable et donne 2 conseils pratiques immédiats.`;

    const fallbackGenerator = () => ({
      answer: `En droit français, la situation concernant votre contrat "${contractTitle || 'analysé'}" est encadrée par des dispositions protectrices du consommateur et du locataire.

1. **Règle applicable :** Toute clause abusive ou manifestement disproportionnée au détriment du particulier est réputée non écrite (article L. 212-1 du Code de la consommation). Le professionnel ou bailleur ne peut pas exiger de prestations ou pénalités contraires aux lois d'ordre public.

2. **Conseils pratiques :** 
- Formulez systématiquement vos demandes par écrit traçable (courrier recommandé avec AR ou e-mail circonstancié).
- En cas de désaccord persistant, saisissez gratuitement le médiateur de la consommation compétent ou la Commission Départementale de Conciliation (CDC).`,
    });

    const result = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      fallbackGenerator,
    });

    return res.json({
      success: true,
      answer: typeof result === 'string' ? result : (result.answer || JSON.stringify(result)),
      sovereignProvider: "Mistral AI",
    });
  } catch (error: any) {
    console.error("Error in /api/ask-contract-question:", error);
    return res.status(500).json({
      error: error?.message || "Erreur lors de la réponse juridique. Veuillez réessayer.",
    });
  }
});

// ==============================================================================
// MODULE : PATRIMOINE EN POCHE (Guide architectural indépendant sans pub)
// ==============================================================================
app.post('/api/analyze-architecture', async (req, res) => {
  try {
    const { text, file, locationHint } = req.body;

    const systemPrompt = `Tu es le conservateur et guide architectural de « Patrimoine en Poche », un service civique d'Alphabette propulsé par Mistral AI.
RÈGLE D'OR : ZÉRO PUBLICITÉ, ZÉRO SPONSORING. 100% centré sur la qualité de l'architecture, la modénature, le génie civil, les matériaux et la mémoire vivante des lieux.
Spécialités : Modernisme balnéaire de La Grande-Motte (Mission Racine, Jean Balladur 1968, pyramides à 60°), Aigues-Mortes, Le Grau-du-Roi, Occitanie et grands édifices de France.
Réponds STRICTEMENT au format JSON avec les clés :
monumentOrStyleName, architectOrEra, locationLikelihood, styleFamily, shortSummary, architecturalKeyFeatures (liste), historicalContext, curiousDetail, walkingTips.`;

    const userPrompt = `Analyse cet édifice ou cet élément architectural :
Lieu pressenti : ${locationHint || 'La Grande-Motte / Occitanie'}
Description : ${text || 'Photo ci-jointe'}`;

    const images: Array<{ data: string; mimeType: string }> = [];
    if (file && file.data) {
      images.push({ data: file.data, mimeType: file.mimeType || 'image/jpeg' });
    }

    const fallbackGenerator = () => ({
      monumentOrStyleName: "Les Pyramides Modernistes de La Grande-Motte",
      architectOrEra: "Jean Balladur — Mission Racine (1968 - 1975)",
      locationLikelihood: "La Grande-Motte (Hérault, Occitanie)",
      styleFamily: "Modernisme balnéaire & Sculpture urbaine monumentale",
      shortSummary:
        "Création architecturale audacieuse labellisée Patrimoine du XXe siècle, ces pyramides tronquées à 60° domptent le mistral et maximisent l'ensoleillement des terrasses.",
      architecturalKeyFeatures: [
        "Modénatures géométriques et brise-soleil en nid d'abeille préfabriqués en béton blanc",
        "Pente pyramidale à 60 degrés inspirée des temples précolombiens de Teotihuacan",
        "Séparation radicale des circulations piétonnes et automobiles avec réseau de passerelles arborées",
      ],
      historicalContext:
        "Dans le cadre de la Mission Racine initiée par le Général de Gaulle, Jean Balladur a conçu une ville-jardin balnéaire démocratique sur des marécages déserts.",
      curiousDetail:
        "Les façades du Couchant sont pyramidales et géométriques tandis que celles du Levant sont sinueuses et féminines pour symboliser le dialogue entre Yin et Yang.",
      walkingTips:
        "Empruntez la promenade piétonne du port au coucher du soleil pour observer le jeu d'ombres sculpté par les brise-soleil.",
    });

    const analysis = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({ success: true, analysis, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/analyze-architecture:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors du décodage architectural." });
  }
});

app.post('/api/ask-patrimoine-question', async (req, res) => {
  try {
    const { question, siteTitle, city } = req.body;
    const systemPrompt = `Tu es le guide érudit de « Patrimoine en Poche » propulsé par Mistral AI. Réponds avec passion, rigueur et sans aucune publicité.`;
    const userPrompt = `Site : ${siteTitle || 'Édifice architectural'} (${city || 'France'}). Question : "${question}".`;

    const fallbackGenerator = () => ({
      answer: `Cet édifice s'inscrit dans un dialogue remarquable entre fonctionnalité territoriale et geste plastique. L'architecte a privilégié des matériaux durables et une orientation bioclimatique naturelle pour offrir un confort thermique optimal tout en créant une signature visuelle inoubliable.`,
    });

    const result = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      fallbackGenerator,
    });

    return res.json({
      success: true,
      answer: typeof result === 'string' ? result : (result.answer || JSON.stringify(result)),
    });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || "Erreur lors de la réponse patrimoniale." });
  }
});

// ==============================================================================
// MODULE : PLUMECITOYENNE (Écrivain public administratif & recours)
// ==============================================================================
app.post('/api/generate-administrative-letter', async (req, res) => {
  try {
    const { situationText, category, userFullName, userReference, urgency, tone } = req.body;

    if (!situationText || !situationText.trim()) {
      return res.status(400).json({ error: "Veuillez expliquer votre situation en quelques mots." });
    }

    const systemPrompt = `Tu es le moteur d'intelligence artificielle souverain « PlumeCitoyenne » d'Alphabette, propulsé exclusivement par Mistral AI.
Ta mission est de vaincre la fracture administrative numérique et le non-recours aux droits fondamentaux en rédigeant des courriers administratifs parfaits (CAF, CPAM, Impôts / DGFIP, France Travail, litiges locatifs, contestations ANTAI).
Réponds STRICTEMENT au format JSON avec les clés :
letterTitle, officialSubject, legalReferences (liste d'articles de lois réels), fullLetterContent (texte complet prêt à imprimer et signer), procedureStepByStep (liste d'objets stepNumber, title, action), targetCounter (name, addressGuidance, onlineAlternative), requiredDocuments (liste), recommendedDelivery, criticalDeadlines, citizenAdvise.`;

    const userPrompt = `Catégorie : ${category || 'Démarche administrative'}
Situation : ${situationText}
Nom usager : ${userFullName || '[Prénom Nom]'}
Référence dossier : ${userReference || '[Numéro allocataire / dossier]'}
Urgence : ${urgency || 'Normal'}
Tonalité : ${tone || 'Courtoise, ferme et juridiquement motivée'}`;

    const fallbackGenerator = () => ({
      letterTitle: "Recours gracieux préalable & contestation officielle",
      officialSubject: `Objet : Recours gracieux préalable - Demande de réexamen du dossier réf. ${userReference || '[Numéro de dossier]'}`,
      legalReferences: [
        "Code des relations entre le public et l'administration, art. L. 211-2 et L. 411-2",
        "Code de la sécurité sociale, art. L. 262-46 (le cas échéant)",
        "Principes généraux du contradictoire et de motivation des décisions administratives",
      ],
      fullLetterContent: `${userFullName || '[Vos Prénom et Nom]'}\n[Votre Adresse complète]\n[Votre Téléphone & E-mail]\n\nÀ l'attention de la Commission de Recours Amiable (CRA)\n[Adresse de l'organisme destinataire]\n\nFait à [Votre Ville], le ${new Date().toLocaleDateString('fr-FR')}\n\nObjet : Recours gracieux préalable - Demande de réexamen du dossier n° ${userReference || '[Référence]'}\n\nMadame, Monsieur le Directeur,\n\nJe me permets de former par la présente un recours gracieux à l'encontre de la décision notifiée récemment à mon encontre concernant mon dossier référencé ci-dessus.\n\nEn effet, les circonstances réelles de ma situation se résument comme suit :\n${situationText}\n\nConformément aux dispositions de l'article L. 211-2 du Code des relations entre le public et l'administration, je sollicite un réexamen bienveillant et approfondi des éléments matériels justificatifs joints au présent courrier.\n\nJe me tiens à votre entière disposition pour tout entretien ou transmission de pièces complémentaires.\n\nJe vous prie d'agréer, Madame, Monsieur, l'expression de ma considération distinguée.\n\n[Signature manuscrite]`,
      procedureStepByStep: [
        {
          stepNumber: 1,
          title: "Vérification des pièces",
          action: "Réunissez toutes les pièces justificatives listées ci-dessous et datez le courrier.",
        },
        {
          stepNumber: 2,
          title: "Expédition par LRAR",
          action: "Envoyez le dossier complet en Recommandé avec Accusé de Réception (LRAR) pour figer la date légale.",
        },
        {
          stepNumber: 3,
          title: "Suivi du délai de forclusion",
          action: "Conservez le récépissé postal et le bordereau de dépôt pendant une durée minimale de 3 ans.",
        },
      ],
      targetCounter: {
        name: "Commission de Recours Amiable (CRA) / Direction départementale",
        addressGuidance: "Adresse figurant sur le dernier avis ou notification officielle reçue.",
        onlineAlternative: "Téléservice officiel ou espace allocataire sécurisé (FranceConnect).",
      },
      requiredDocuments: [
        "Copie de la décision ou notification contestée",
        "Justificatif d'identité et de domicile de moins de 3 mois",
        "Relevés de situation ou justificatifs matériels étayant votre bonne foi",
      ],
      recommendedDelivery: "Lettre Recommandée avec Accusé de Réception (LRAR)",
      criticalDeadlines: "Délai impératif de deux mois (2 mois) à compter de la notification de la décision.",
      citizenAdvise: "Gardez confiance : plus de 60% des recours gracieux motivés avec courtoisie et pièces à l'appui aboutissent à un réexamen favorable.",
    });

    const letterData = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      fallbackGenerator,
    });

    return res.json({ success: true, letterData, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/generate-administrative-letter:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de la rédaction administrative." });
  }
});

// ==============================================================================
// MODULE : MÉMOSANTÉ (Vulgarisation des comptes-rendus médicaux)
// ==============================================================================
app.post('/api/explain-medical-report', async (req, res) => {
  try {
    const { text, file, reportType } = req.body;

    const systemPrompt = `Tu es le moteur souverain de « MémoSanté » d'Alphabette propulsé par Mistral AI.
RÈGLES D'OR ÉTHIQUES STRICTES :
1. AUCUN DIAGNOSTIC MÉDICAL. N'affirme jamais une pathologie.
2. RENVOI SYSTÉMATIQUE VERS LE MÉDECIN TRAITANT.
3. Pédagogie, bienveillance et vulgarisation des acronymes en français courant.
Réponds STRICTEMENT au format JSON avec les clés :
reportTitle, reportType, generalSummary, decodedTerms (liste d'objets technicalTerm, plainFrenchTranslation, biologicalRole, typicalContext), keyQuestionsForDoctor (liste), criticalNotice.`;

    const userPrompt = `Compte-rendu médical à vulgariser. Type : ${reportType || 'Analyses / Bilan'}\n${text || 'Document numérisé joint'}`;
    const images: Array<{ data: string; mimeType: string }> = [];
    if (file && file.data) {
      images.push({ data: file.data, mimeType: file.mimeType || 'image/jpeg' });
    }

    const fallbackGenerator = () => ({
      reportTitle: "Bilan biologique & hématologique courant",
      reportType: reportType || "Prise de sang / NFS",
      generalSummary:
        "Ce compte-rendu présente les résultats des analyses sanguines standard permettant d'évaluer la formule sanguine, les défenses immunitaires et les marqueurs inflammatoires.",
      decodedTerms: [
        {
          technicalTerm: "CRP (Protéine C-Réactive)",
          plainFrenchTranslation: "Le témoin d'inflammation de l'organisme",
          biologicalRole: "Protéine fabriquée par le foie en réaction à une agression (infection, blessure, inflammation).",
          typicalContext: "Le médecin mesure la CRP pour savoir si une réaction inflammatoire est en cours dans le corps.",
        },
        {
          technicalTerm: "Polynucléaires Neutrophiles",
          plainFrenchTranslation: "Les soldats d'intervention rapide contre les bactéries",
          biologicalRole: "Variété de globules blancs chargés d'éliminer les bactéries et débris cellulaires.",
          typicalContext: "Leur proportion permet d'orienter le diagnostic entre une cause bactérienne ou virale.",
        },
        {
          technicalTerm: "Ferritine",
          plainFrenchTranslation: "La réserve de fer du corps",
          biologicalRole: "Molécule de stockage du fer dans les cellules pour alimenter la fabrication de l'hémoglobine.",
          typicalContext: "Utile pour dépister une fatigue liée à un manque de fer ou une anémie.",
        },
      ],
      keyQuestionsForDoctor: [
        "Docteur, comment interprétez-vous mes marqueurs d'inflammation au regard de mes symptômes actuels ?",
        "Y a-t-il lieu de réajuster mon alimentation ou de prévoir un contrôle dans quelques mois ?",
        "Ce résultat nécessite-t-il un bilan complémentaire ?",
      ],
      criticalNotice:
        "AVERTISSEMENT SOLENNEL : Ce décryptage pédagogique est strictement informatif et ne remplace en aucun cas l'examen clinique de votre médecin traitant.",
    });

    const explanation = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({ success: true, explanation, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/explain-medical-report:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors du décodage médical." });
  }
});

// ==============================================================================
// MODULE : SCANGARANTIE (Extraction de tickets de caisse & garantie 2 ans)
// ==============================================================================
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { text, file } = req.body;

    const systemPrompt = `Tu es l'analyste expert en consommation de « ScanGarantie » propulsé par Mistral AI.
Règles :
1. Extrais : productName, brand, modelReference, category, store, purchaseDate (YYYY-MM-DD), purchasePrice (nombre), receiptNumber, serialNumber.
2. Garantie légale de conformité en France : 24 mois obligatoires (Art. L. 217-3 Code de la consommation).
3. Détecte éligibilité au Bonus Réparation QualiRépar (loi AGEC) : eligibleBonusReparation (booléen) et estimatedBonusAmount (nombre en euros).
4. detectedVigilancePoints (liste).
Réponds STRICTEMENT au format JSON avec ces clés.`;

    const userPrompt = `Analyse ce ticket de caisse ou facture :\n${text || 'Photo ci-jointe'}`;
    const images: Array<{ data: string; mimeType: string }> = [];
    if (file && file.data) {
      images.push({ data: file.data, mimeType: file.mimeType || 'image/jpeg' });
    }

    const fallbackGenerator = () => ({
      productName: "Lave-Linge Frontal 9kg Silencieux",
      brand: "Bosch",
      modelReference: "WAN28208FF",
      category: "electromenager",
      store: "Darty / Boulanger",
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: 499.99,
      receiptNumber: "TC-2026-88192",
      serialNumber: "SN88492019",
      warrantyDurationMonths: 24,
      hasCommercialExtension: false,
      commercialExtensionMonths: 0,
      detectedVigilancePoints: [
        "Les tickets thermiques s'effacent en 6 à 12 mois à la lumière : conservez toujours ce double numérique numérisé.",
        "La garantie légale de conformité de 24 mois s'applique sans frais auprès du vendeur, sans avoir à souscrire d'extension payante.",
        "En cas de panne, le vendeur a l'obligation légale de réparer ou remplacer dans un délai maximal de 30 jours.",
      ],
      eligibleBonusReparation: true,
      estimatedBonusAmount: 50,
    });

    const warrantyData = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({ success: true, warrantyData, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/scan-receipt:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors du scan du ticket." });
  }
});

// ==============================================================================
// MODULE : TUTEUR NUMÉRIQUE (Feuille de route pas-à-pas démarches en ligne)
// ==============================================================================
app.post('/api/tuteur-demarche', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Démarche requise." });

    const systemPrompt = `Tu es le « Tuteur Numérique » de papierpapier.fr propulsé par Mistral AI.
Tu guides les citoyens pour réussir leurs démarches en ligne (ANTS, CAF, Ameli, Impôts, etc.).
Réponds STRICTEMENT au format JSON avec les clés :
title, category, administration, officialUrl, cost, delaiEstime, description, franceConnectRecommended (booléen), isOfficialServiceFree (booléen), warningAntiArnaque, helplinePhone, legalBasis, requiredDocuments (liste d'objets id, label, description, mandatory, format, tipAntiRejet), fourStepsRoadmap (liste de 4 objets stepNumber, title, objective, actions, antiTrapAlert, checklist), commonRejectionReasons (liste de reason, solution).`;

    const userPrompt = `Démarche demandée par l'usager : "${query}"`;

    const fallbackGenerator = () => ({
      title: `Démarche officielle : ${query}`,
      category: "famille",
      administration: "Service-Public.fr / Organisme compétent d'État",
      officialUrl: "https://www.service-public.fr",
      cost: "100% Gratuit sur le portail officiel",
      delaiEstime: "2 à 3 semaines",
      description: `Guide d'accompagnement sécurisé pas-à-pas pour finaliser votre démarche : ${query}.`,
      franceConnectRecommended: true,
      isOfficialServiceFree: true,
      warningAntiArnaque:
        "ATTENTION AUX FAUX SITES PAYANTS : Cette démarche est totalement gratuite. Ne payez jamais d'intermédiaire privé pour transmettre un formulaire d'État.",
      helplinePhone: "3939 (Allô Service Public)",
      legalBasis: "Code des relations entre le public et l'administration",
      requiredDocuments: [
        {
          id: "doc-1",
          label: "Pièce d'identité en cours de validité",
          description: "CNI ou passeport biométrique",
          mandatory: true,
          format: "PDF ou JPG lisible < 2 Mo",
          tipAntiRejet: "Photographiez les 4 coins du document sans reflet du flash.",
        },
        {
          id: "doc-2",
          label: "Justificatif de domicile de moins de 3 mois",
          description: "Facture d'énergie, quittance de loyer d'agence ou avis d'imposition",
          mandatory: true,
          format: "PDF original téléchargeable",
          tipAntiRejet: "Les quittances de loyer manuscrites entre particuliers sont fréquemment rejetées.",
        },
      ],
      fourStepsRoadmap: [
        {
          stepNumber: 1,
          title: "Étape 1 : Accès officiel sécurisé",
          objective: "Se connecter via FranceConnect sur le site légitime d'État",
          actions: [
            "Vérifiez que l'URL se termine bien par .gouv.fr ou service-public.fr",
            "Identifiez-vous grâce à vos identifiants Ameli ou Impôts (FranceConnect)",
          ],
          antiTrapAlert: "Fuyez tout résultat de recherche Google portant la mention 'Sponsorisé' ou 'Annonce'.",
          checklist: ["Cadenas HTTPS présent", "Connexion FranceConnect active"],
        },
        {
          stepNumber: 2,
          title: "Étape 2 : Saisie des données du dossier",
          objective: "Renseigner l'ensemble des champs sans omission",
          actions: ["Renseignez votre état-civil conforme", "Vérifiez vos coordonnées de contact"],
          antiTrapAlert: "Ne validez pas avant d'avoir vérifié l'orthographe exacte.",
          checklist: ["Numéro fiscal ou sécurité sociale vérifié"],
        },
        {
          stepNumber: 3,
          title: "Étape 3 : Téléversement des justificatifs",
          objective: "Joindre des fichiers nets et conformes",
          actions: ["Déposez les PDF au format numérique", "Vérifiez la lisibilité des scans"],
          antiTrapAlert: "Les fichiers trop lourds (> 5 Mo) font planter le formulaire.",
          checklist: ["Taille < 2 Mo", "Fichiers bien orientés"],
        },
        {
          stepNumber: 4,
          title: "Étape 4 : Validation & Récépissé d'horodatage",
          objective: "Télécharger la preuve de dépôt légale",
          actions: ["Conservez le numéro d'enregistrement", "Téléchargez le récapitulatif PDF"],
          antiTrapAlert: "Notez la date limite de réponse de l'administration.",
          checklist: ["Récépissé archivé sur votre ordinateur"],
        },
      ],
      commonRejectionReasons: [
        {
          reason: "Justificatif de domicile de plus de 3 mois",
          solution: "Téléchargez immédiatement votre dernière facture d'électricité ou avis d'imposition récent.",
        },
        {
          reason: "Scan flou ou tronqué",
          solution: "Posez le document à plat sur une table bien éclairée et cadrez les quatre bordures.",
        },
      ],
    });

    const guide = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      fallbackGenerator,
    });

    return res.json({
      success: true,
      guide: { id: 'guide-' + Date.now(), ...guide },
      sovereignProvider: "Mistral AI",
    });
  } catch (error: any) {
    console.error("Error in /api/tuteur-demarche:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de la génération du guide." });
  }
});

// ==============================================================================
// MODULE : RÉSIL-EXPRESS (Analyse de contrat et résiliation sans frais)
// ==============================================================================
app.post('/api/resil-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType, textInput } = req.body;

    const systemPrompt = `Tu es l'analyste juridique de « Résil-Express » propulsé par Mistral AI.
Règles :
1. Extrais l'enseigne/fournisseur, l'adresse postale officielle certifiée du service résiliation en France.
2. Détermine le motif le plus protecteur (loi_hamon, loi_chatel, resiliation_3_clics, hausse_tarifaire, motif_legitime, retractation_14j, echeance_terme).
Réponds STRICTEMENT au format JSON avec les clés :
providerName, category, monthlyAmount, serviceAddress (recipientName, street, postalCode, city, cedex), recommendedGround, legalJustification, tip, clientNumber, contractNumber, subscriptionDate.`;

    const userPrompt = `Analyse de désengagement :\n${textInput || 'Document scanné joint'}`;
    const images: Array<{ data: string; mimeType: string }> = [];
    if (imageBase64) {
      images.push({ data: imageBase64, mimeType: mimeType || 'image/jpeg' });
    }

    const fallbackGenerator = () => ({
      providerName: "Opérateur Télécom / Salle de Sport",
      category: "telecom_internet",
      monthlyAmount: 29.99,
      clientNumber: "CL-991823",
      contractNumber: "CTR-881920",
      subscriptionDate: "15/01/2024",
      serviceAddress: {
        recipientName: "Service National des Résiliations Clients",
        street: "TSA 91283 - Service Résiliation",
        postalCode: "75008",
        city: "Paris",
        cedex: "Cedex 08",
      },
      recommendedGround: "loi_chatel",
      legalJustification:
        "Absence de notification écrite de l'échéance annuelle au moins 15 jours avant la date limite (Art. L. 215-1 Code conso) ouvrant droit à une résiliation immédiate sans frais.",
      tip: "Révoquez l'autorisation de prélèvement SEPA auprès de votre banque dès confirmation de la réception du recommandé pour éviter tout débit abusif.",
    });

    const data = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({ success: true, data, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/resil-scan:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de l'analyse de résiliation." });
  }
});

// ==============================================================================
// MODULE : ÉTATDESLIEUX PROTECT (Grille de vétusté Décret 2016-382)
// ==============================================================================
app.post('/api/etatdeslieux-analyze', async (req, res) => {
  try {
    const { imageBase64, mimeType, room, category, occupancyYears = 3, contextNotes = '', initialCondition = "bon état d'usage" } = req.body;

    const systemPrompt = `Tu es un juriste expert spécialisé en baux d'habitation (Décret n° 2016-382 du 30 mars 2016 fixant les modalités de l'état des lieux et l'application d'une grille de vétusté) au cœur de « ÉtatDesLieux Protect », propulsé par Mistral AI.
Règles :
1. Vétusté normale = 100% à la charge du propriétaire (0 € pour le locataire).
2. Même en cas de dégradation locative, obligation stricte d'appliquer le coefficient d'abattement pour vétusté.
Réponds STRICTEMENT au format JSON avec les clés :
classification (VETUSTE_NORMALE, DEGRADATION_LOCATIVE, USAGE_MIXTE, NON_IMPUTABLE_AU_LOCATAIRE), confidenceScore, title, summary, whoPays (PROPRIETAIRE_100, LOCATAIRE_AVEC_VETUSTE, LOCATAIRE_100), whoPaysLabel, legalBasis, depreciationDetails (equipmentCategory, theoreticalLifespanYears, annualDepreciationRate, occupancyDurationYears, calculatedDepreciationRate, maxResidualRateAllowed, sharePayableByTenantPercent, explanation), keyArguments (liste), recommendedSteps (liste), jurisprudenceReference.`;

    const userPrompt = `Analyse d'état des lieux :
Pièce : ${room || 'Générale'}
Élément : ${category || 'Peinture / Revêtement'}
Durée d'occupation : ${occupancyYears} an(s)
État d'entrée : ${initialCondition}
Constat : ${contextNotes || 'Traces d\'usage régulier au fil du temps'}`;

    const images: Array<{ data: string; mimeType: string }> = [];
    if (imageBase64) {
      images.push({ data: imageBase64, mimeType: mimeType || 'image/jpeg' });
    }

    const fallbackGenerator = () => ({
      classification: "VETUSTE_NORMALE",
      confidenceScore: 92,
      title: "Traces d'usure courante et vieillissement naturel : Vétusté normale",
      summary:
        "Après 3 années d'occupation paisible, les légères marques constatées résultent du seul usage normal de la chose louée et de l'effet du temps. La loi interdit formellement au propriétaire d'imputer ces frais sur le dépôt de garantie.",
      whoPays: "PROPRIETAIRE_100",
      whoPaysLabel: "À la charge exclusive du propriétaire (0 € imputable au locataire)",
      legalBasis:
        "Décret n° 2016-382 du 30 mars 2016 (art. 1er) et Article 7 alinéa d de la Loi n° 89-462 du 6 juillet 1989",
      depreciationDetails: {
        equipmentCategory: category || "Peintures et revêtements muraux",
        theoreticalLifespanYears: 7,
        annualDepreciationRate: 14,
        occupancyDurationYears: Number(occupancyYears) || 3,
        calculatedDepreciationRate: Math.min(100, 14 * (Number(occupancyYears) || 3)),
        maxResidualRateAllowed: 10,
        sharePayableByTenantPercent: 0,
        explanation:
          "Les accords collectifs nationaux de location prévoient un amortissement de 14% par an après 1 an de franchise. L'usure constatée étant conforme à l'effet du temps, aucune retenue n'est légalement justifiable.",
      },
      keyArguments: [
        "L'article 7 alinéa d de la loi du 6 juillet 1989 dispose expressément que le locataire n'est pas tenu des dégradations dues à la vétusté normale.",
        "Le propriétaire ne peut facturer une remise à neuf complète sans appliquer la grille de vétusté obligatoire.",
        "Les trous de chevilles usuels rebouchés ou les ombres laissées par des meubles constituent un usage normal du logement.",
      ],
      recommendedSteps: [
        "Mentionnez formellement sur l'exemplaire d'état des lieux : « Traces conformes à une usure normale de 3 ans - Vétusté non imputable ».",
        "Prenez des photographies contradictoires horodatées en présence de la personne effectuant l'état des lieux.",
        "En cas de retenue abusive, mettez en demeure le bailleur par LRAR en citant le décret 2016-382 sous astreinte de 10% du loyer par mois de retard.",
      ],
      jurisprudenceReference:
        "Cour de cassation, 3e Chambre Civile, jurisprudence constante (la vétusté exclut toute indemnité au profit du bailleur).",
    });

    const data = await callMistralAI(req, {
      systemPrompt,
      userPrompt,
      images,
      fallbackGenerator,
    });

    return res.json({ success: true, data, sovereignProvider: "Mistral AI" });
  } catch (error: any) {
    console.error("Error in /api/etatdeslieux-analyze:", error);
    return res.status(500).json({ error: error?.message || "Erreur lors de l'analyse d'usure." });
  }
});

// ==============================================================================
// VITE OR STATIC SERVER MOUNT
// ==============================================================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Alphabette] papierpapier.fr running on http://0.0.0.0:${PORT} (Mistral AI Sovereign Engine)`);
  });
}

startServer();
