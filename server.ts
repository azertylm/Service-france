import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Generous body limit for image & document base64 uploads
app.use(express.json({ limit: '35mb' }));

// Server-side Gemini client with recommended user-agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    contractTitle: {
      type: Type.STRING,
      description: "Nom ou type précis du contrat identifié (ex: Bail de location d'appartement meublé, Devis de rénovation de plomberie)",
    },
    contractType: {
      type: Type.STRING,
      description: "Catégorie juridique (Bail d'habitation, Devis de travaux / artisan, Contrat d'assurance, Conditions Générales / Abonnement, Contrat de prestation / Freelance, Autre)",
    },
    parties: {
      type: Type.OBJECT,
      properties: {
        partyA: { type: Type.STRING, description: "Partie émettrice (ex: Bailleur, Artisan, Assureur, Fournisseur)" },
        partyB: { type: Type.STRING, description: "Partie signataire (ex: Locataire, Client particulier, Assuré)" },
      },
      required: ["partyA", "partyB"],
    },
    summary: {
      type: Type.STRING,
      description: "Résumé en 2 phrases simples et limpides de l'objet du contrat pour un citoyen sans compétences juridiques",
    },
    riskLevel: {
      type: Type.STRING,
      description: "Niveau de risque global du contrat: FAIBLE, MODERE, ELEVE ou CRITIQUE",
    },
    riskJustification: {
      type: Type.STRING,
      description: "Explication claire en 1 ou 2 phrases du niveau de risque attribué",
    },
    threeVigilancePoints: {
      type: Type.ARRAY,
      description: "Exactement 3 points de vigilance majeurs ou clauses abusives / illégales repérées dans le document",
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING, description: "Titre court et frappant du piège (ex: Pénalité de retard de loyer illégale)" },
          severity: { type: Type.STRING, description: "Gravité: ABUSIVE, ILLÉGALE, RISQUE_FORT ou ATTENTION" },
          quote: { type: Type.STRING, description: "Extrait exact textuel cité du document entre guillemets" },
          decodedTrap: { type: Type.STRING, description: "Ce que cela signifie concrètement dans la vraie vie et le risque financier ou juridique pour le signataire" },
          legalReference: { type: Type.STRING, description: "Fondement juridique en droit français (ex: Loi du 6 juillet 1989 art. 4, Code de la consommation art. L.212-1 / R.212-1, Code civil art. 1104 ou 1792)" },
          recommendedAction: { type: Type.STRING, description: "Conseil citoyen immédiat (ex: Exiger la suppression de cette clause réputée non écrite avant de signer)" },
        },
        required: ["title", "severity", "quote", "decodedTrap", "legalReference", "recommendedAction"],
      },
    },
    terminationAndHiddenPenalties: {
      type: Type.OBJECT,
      properties: {
        noticePeriod: { type: Type.STRING, description: "Délai de préavis requis pour résilier et forme requise (ex: 1 mois pour bail meublé ou zone tendue par LRAR)" },
        tacitRenewal: { type: Type.STRING, description: "Règles de reconduction tacite et obligations de rappel de l'échéance (ex: Loi Châtel, tacite reconduction annuelle)" },
        hiddenPenalties: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Liste des frais cachés, pénalités de rupture, frais de dossier ou retenues prévues",
        },
        freeCancellationConditions: { type: Type.STRING, description: "Conditions dans lesquelles le signataire peut se désengager sans pénalité (rétractation 14j, cas de force majeure, défaut d'exécution)" },
      },
      required: ["noticePeriod", "tacitRenewal", "hiddenPenalties", "freeCancellationConditions"],
    },
    realCommitments: {
      type: Type.OBJECT,
      properties: {
        financialSummary: { type: Type.STRING, description: "Synthèse des sommes réelles engagées (montant initial, récurrent, cautions, franchises, indexations)" },
        keyObligations: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Les 3 à 4 obligations concrètes les plus lourdes pesant sur le signataire",
        },
        exclusionsAndBlindSpots: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "Ce qui n'est PAS couvert ou les angles morts que le client pourrait croire inclus",
        },
      },
      required: ["financialSummary", "keyObligations", "exclusionsAndBlindSpots"],
    },
    negotiationLetterTemplate: {
      type: Type.OBJECT,
      properties: {
        subject: { type: Type.STRING, description: "Objet du courrier de demande de modification ou contestation" },
        body: { type: Type.STRING, description: "Modèle de lettre personnalisé prêt à envoyer, citant courtoisement les articles de loi et demandant le retrait ou l'ajustement des clauses litigieuses" },
      },
      required: ["subject", "body"],
    },
    checklistBeforeSigning: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "5 vérifications concrètes à cocher avant de signer (ex: Exiger l'attestation d'assurance décennale, Vérifier la mention de la surface Carrez)",
    },
  },
  required: [
    "contractTitle",
    "contractType",
    "parties",
    "summary",
    "riskLevel",
    "riskJustification",
    "threeVigilancePoints",
    "terminationAndHiddenPenalties",
    "realCommitments",
    "negotiationLetterTemplate",
    "checklistBeforeSigning",
  ],
};

// API Route: Analyze contract document
app.post('/api/analyze-contract', async (req, res) => {
  try {
    const { text, file, contractTypeHint } = req.body;

    if (!text && !file) {
      return res.status(400).json({ error: "Aucun document fourni. Veuillez transmettre un texte, une image ou un PDF." });
    }

    const systemPrompt = `Tu es le moteur d'intelligence artificielle souverain, sécurisé et bienveillant au cœur de l'application « France Service », conçue et éditée par ALPHABETTE SASU (fondée par Valentin RICHAUD à La Grande-Motte).
Au sein du MODULE 1 : CLAIRCONTRAT (Protection juridique et décryptage documentaire), ta mission républicaine est d'analyser instantanément les contrats du quotidien (baux d'habitation, devis d'artisans, conditions générales d'abonnement, contrats de travail, assurances).

Tu dois restituer systématiquement ton analyse avec une rigueur absolue, en utilisant toujours le vouvoiement avec l'usager, sans aucun verbiage superflu ni jargon incompréhensible :
1. Synthèse vulgarisée des engagements pris : ce à quoi le signataire s'engage réellement en termes financiers et temporels.
2. Détection impitoyable des clauses abusives, illégales ou déséquilibrées (selon le Code de la consommation art. L. 212-1 et R. 212-1, Code civil art. 1171, Loi du 6 juillet 1989 pour les baux d'habitation, Code des assurances).
3. Points de vigilance majeurs (délais de préavis légaux, reconductions tacites, pénalités cachées, frais abusifs d'état des lieux ou de résiliation).

Garantis un ton direct, sécurisant, hautement bienveillant et structuré.
Réponds STRICTEMENT en respectant le schéma JSON fourni.`;

    const contents: any[] = [];

    let userPromptText = `Analyse ce document contractuel en français simple et décortique tous les pièges.`;
    if (contractTypeHint) {
      userPromptText += ` Type de document pressenti : ${contractTypeHint}.`;
    }

    if (file && file.data && file.mimeType) {
      // Gemini natively accepts PDF and images as inlineData
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        },
      });
      userPromptText += ` Le document complet est fourni en pièce jointe ci-jointe. Examine attentivement chaque clause, les petits caractères et conditions générales.`;
    }

    if (text) {
      userPromptText += `\n\nVoici le texte du contrat ou devis à analyser :\n\"\"\"\n${text}\n\"\"\"`;
    }

    contents.push({ text: userPromptText });

    let responseText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: ANALYSIS_SCHEMA as any,
            temperature: 0.2,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} attempt failed:`, err?.message || err);
        lastError = err;
        // Wait 300ms before fallback model
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Échec de la génération après plusieurs tentatives.");
    }

    const rawOutput = responseText.trim() || '{}';
    const parsedData = JSON.parse(rawOutput);

    return res.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-contract:", error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse du document par l'IA. " + (error?.message || "Vérifiez le format du fichier."),
    });
  }
});

// ==========================================
// PATRIMOINE EN POCHE (Guide architectural indépendant)
// ==========================================

const ARCHITECTURE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    monumentOrStyleName: {
      type: Type.STRING,
      description: "Nom de l'édifice, de l'ouvrage ou du style architectural décodé (ex: Pyramides de La Grande-Motte, Brise-soleil en nid d'abeille, Remparts d'Aigues-Mortes)",
    },
    architectOrEra: {
      type: Type.STRING,
      description: "Architecte, maître d'œuvre ou période historique (ex: Jean Balladur - Mission Racine 1968-1975, XIIIe siècle capétien, etc.)",
    },
    locationLikelihood: {
      type: Type.STRING,
      description: "Commune ou territoire (La Grande-Motte, Aigues-Mortes, Le Grau-du-Roi, Montpellier, Occitanie)",
    },
    styleFamily: {
      type: Type.STRING,
      description: "Famille stylistique : Modernisme balnéaire XXe, Brutalisme, Médiéval gothique militaire, Postmodernisme, Roman languedocien, etc.",
    },
    shortSummary: {
      type: Type.STRING,
      description: "Explication pédagogique et vivante en 2 phrases pour le visiteur curieux, sans publicité ni jargon prétentieux",
    },
    architecturalKeyFeatures: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 à 5 éléments architecturaux ou géométriques remarquables à observer attentivement à l'œil nu",
    },
    historicalContext: {
      type: Type.STRING,
      description: "Contexte historique, politique ou sociologique de la construction (ex: Mission Racine, protection contre les moustiques et le mistral, croisades)",
    },
    curiousDetail: {
      type: Type.STRING,
      description: "Un détail secret ou une anecdote insolite que 90% des touristes ignorent",
    },
    walkingTips: {
      type: Type.STRING,
      description: "Conseil d'observation (orientation de la lumière, meilleur point de vue piéton, ombrage)",
    },
  },
  required: [
    "monumentOrStyleName",
    "architectOrEra",
    "styleFamily",
    "shortSummary",
    "architecturalKeyFeatures",
    "historicalContext",
    "curiousDetail"
  ],
};

// API Route: Interactive legal Q&A on analyzed document
app.post('/api/ask-contract-question', async (req, res) => {
  try {
    const { question, contractTitle, contractSummary, contractType, pointsSummary } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question requise." });
    }

    const prompt = `Tu es l'assistant juridique de « ClairContrat ».
Un citoyen te pose une question pratique sur son contrat (${contractTitle || contractType || 'Contrat'}):
Contexte du contrat :
- Type : ${contractType || 'Non spécifié'}
- Résumé : ${contractSummary || 'Non spécifié'}
- Points critiques identifiés : ${JSON.stringify(pointsSummary || [])}

Question de l'utilisateur :
"${question}"

Réponds en 2 à 4 paragraphes très clairs en français simple :
1. Réponse directe (Oui / Non / Sous conditions)
2. La règle de droit français applicable (articles de loi ou jurisprudence constante)
3. Les conseils pratiques et étapes recommandées pour se protéger.
Reste neutre, rassurant et pratique. Ne crée pas de jargon inutile.`;

    let answerText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.3,
          },
        });
        if (response.text) {
          answerText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for Q&A:`, err?.message || err);
      }
    }

    return res.json({
      success: true,
      answer: answerText || "Impossible d'obtenir une réponse pour le moment.",
    });
  } catch (error: any) {
    console.error("Error in /api/ask-contract-question:", error);
    return res.status(500).json({
      error: "Erreur lors de la réponse à la question juridique.",
    });
  }
});

// API Route: Decode building, facade or architectural motif (Patrimoine en Poche)
app.post('/api/analyze-architecture', async (req, res) => {
  try {
    const { text, file, locationHint } = req.body;

    if (!text && !file) {
      return res.status(400).json({
        error: "Veuillez fournir une photo ou une description de l'élément architectural à analyser.",
      });
    }

    const systemPrompt = `Tu es le guide et conservateur en chef de « Patrimoine en Poche », un service citoyen d'exploration du patrimoine bâti, de l'histoire locale et de l'architecture.
RÈGLE D'OR : ZÉRO PUBLICITÉ, ZÉRO SPONSORING DE RESTAURANTS OU BOUTIQUES. 100% centré sur la qualité de l'architecture, la modénature, le génie civil, les matériaux et la mémoire vivante des lieux.

Domaine d'excellence prioritaire :
- Le modernisme remarquable de La Grande-Motte (œuvre phare de Jean Balladur, Mission Racine 1968, label Patrimoine du XXe siècle / Architecture Contemporaine Remarquable, modénatures, brise-soleil en nid d'abeille, pyramides tronquées à 60° du Couchant, formes sinueuses du Levant, urbanisme sans voiture avec passerelles).
- Les communes littorales et environnantes : Aigues-Mortes (architecture militaire capétienne gothique XIIIe, Tour de Constance, Saint-Louis), Le Grau-du-Roi & Port Camargue (phare de l'Espiguette 1869, architecture balnéaire et portuaire), Mauguio-Carnon (Motte féodale, stations balnéaires 1960), Montpellier (postmodernisme néoclassique d'Antigone par Ricardo Bofill, cathédrale Maguelone romane fortifiée).

Si la photo ou question concerne un autre patrimoine remarquable français, réponds avec la même rigueur et passion architecturale.
Fournis obligatoirement ta réponse au format JSON conforme au schéma.`;

    const contents: any[] = [];

    if (file && file.data && file.mimeType) {
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: file.data,
        },
      });
    }

    const userPrompt = `Analyse cet édifice ou cet élément architectural :
${locationHint ? `Indication de lieu/commune : ${locationHint}` : ''}
${text ? `Description ou question du visiteur : ${text}` : ''}
Identifie le style, l'époque ou l'architecte, décode les détails géométriques visibles, livre l'anecdote historique méconnue et explique ce qu'il faut regarder à l'œil nu.`;

    contents.push({ text: userPrompt });

    let responseText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: ARCHITECTURE_SCHEMA as any,
            temperature: 0.2,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for architecture analysis:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Échec de l'analyse architecturale.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      analysis: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/analyze-architecture:", error);
    return res.status(500).json({
      error: "Erreur lors du décodage architectural : " + (error?.message || "Veuillez réessayer."),
    });
  }
});

// API Route: Interactive cultural & architectural inquiry
app.post('/api/ask-patrimoine-question', async (req, res) => {
  try {
    const { question, siteTitle, city } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question requise." });
    }

    const prompt = `Tu es le guide érudit et bienveillant de « Patrimoine en Poche ».
Un voyageur ou habitant te pose une question sur un site ou un détail architectural :
Site : ${siteTitle || 'Patrimoine d Occitanie et de France'} (${city || 'Littoral héraultais/gardois'})
Question : ${question}

Règles de réponse :
1. Réponse captivante, vivante et rigoureuse (2 à 3 paragraphes).
2. Explique le geste architectural (pourquoi l'architecte ou le bâtisseur a choisi cette forme ou ce matériau).
3. Donne un conseil concret pour l'observer sur le terrain (recul nécessaire, jeux d'ombres selon l'heure du jour).
4. ABSOLUMENT AUCUNE suggestion de restaurant, boutique ou contenu sponsorisé. 100% culture, histoire et architecture.`;

    let answerText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature: 0.3,
          },
        });
        if (response.text) {
          answerText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for patrimoine Q&A:`, err?.message || err);
      }
    }

    return res.json({
      success: true,
      answer: answerText || "Information momentanément indisponible.",
    });
  } catch (error: any) {
    console.error("Error in /api/ask-patrimoine-question:", error);
    return res.status(500).json({
      error: "Erreur lors de la réponse.",
    });
  }
});

// ==========================================
// PLUME CITOYENNE (L'écrivain public administratif)
// ==========================================

const ADMINISTRATIVE_LETTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    letterTitle: {
      type: Type.STRING,
      description: "Titre clair et descriptif de la démarche (ex: Recours gracieux préalable - Contestation d'indu de RSA)",
    },
    officialSubject: {
      type: Type.STRING,
      description: "Ligne d'objet formelle du courrier (ex: Objet : Recours gracieux préalable - Décision de trop-perçu n°...)",
    },
    legalReferences: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Articles précis du Code administratif, Code civil, Code de la sécurité sociale, jurisprudence constante applicables",
    },
    fullLetterContent: {
      type: Type.STRING,
      description: "Texte complet du courrier prêt à imprimer et signer avec coordonnées [Vos Nom et Prénom], formules de politesse protocolaires, visa des articles de loi et exposé limpide des faits",
    },
    procedureStepByStep: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER },
          title: { type: Type.STRING },
          action: { type: Type.STRING },
        },
        required: ["stepNumber", "title", "action"],
      },
      description: "3 à 5 étapes chronologiques précises pour savoir quoi faire, où poster et comment suivre le dossier",
    },
    targetCounter: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING, description: "Nom exact de l'organe compétent (ex: Commission de Recours Amiable (CRA) de la CAF)" },
        addressGuidance: { type: Type.STRING, description: "Indications pour trouver l'adresse physique ou postale" },
        onlineAlternative: { type: Type.STRING, description: "Lien ou rubrique de téléservice en ligne équivalent" },
      },
      required: ["name", "addressGuidance"],
    },
    requiredDocuments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Liste à cocher des pièces justificatives obligatoires à joindre au dossier",
    },
    recommendedDelivery: {
      type: Type.STRING,
      description: "Mode d'envoi impératif recommandé (Lettre recommandée avec avis de réception - LRAR, dépôt contre récépissé, etc.)",
    },
    criticalDeadlines: {
      type: Type.STRING,
      description: "Délais légaux de forclusion ou de réponse de l'administration (ex: 2 mois francs sous peine d'irrecevabilité)",
    },
    citizenAdvise: {
      type: Type.STRING,
      description: "Conseil humain, bienveillant et apaisant de l'écrivain public pour surmonter l'angoisse administrative",
    },
  },
  required: [
    "letterTitle",
    "officialSubject",
    "legalReferences",
    "fullLetterContent",
    "procedureStepByStep",
    "targetCounter",
    "requiredDocuments",
    "recommendedDelivery",
    "criticalDeadlines",
    "citizenAdvise"
  ],
};

// API Route: Generate administrative letter (Plume Citoyenne)
app.post('/api/generate-administrative-letter', async (req, res) => {
  try {
    const { situationText, category, userFullName, userReference, urgency, tone } = req.body;

    if (!situationText || !situationText.trim()) {
      return res.status(400).json({
        error: "Veuillez expliquer votre situation en quelques mots ou oralement.",
      });
    }

    const systemPrompt = `Tu es le moteur d'intelligence artificielle souverain, sécurisé et bienveillant au cœur de l'application « France Service », conçue et éditée par ALPHABETTE SASU (fondée par Valentin RICHAUD à La Grande-Motte).
Au sein du MODULE 3 : PLUMECITOYENNE (Écrivain public et démarches administratives), ta mission est de vaincre la fracture administrative numérique et le non-recours aux droits fondamentaux.

Tu rédiges sur mesure des correspondances administratives officielles (CAF, CPAM, Impôts / DGFIP, France Travail, litiges bailleurs, contestation d'amendes / ANTAI, réclamations fournisseurs).

RÈGLES D'OR DE RÉDACTION RÉPUBLICAINE :
1. Ton institutionnel impeccable : respect des formules de politesse protocolaires, vouvoiement systématique, exposé factuel chronologique.
2. Citation précise des articles de loi exacts (Code des relations entre le public et l'administration, Code de la sécurité sociale, Code général des impôts, Loi du 6 juillet 1989, Code civil, jurisprudence du Conseil d'État) et mention des délais légaux de recours (forclusion, recours préalable obligatoire).
3. Fournir un guide pas-à-pas pour l'envoi : adresse ou désignation exacte du guichet destinataire compétent, pièces justificatives obligatoires à joindre, et mode d'envoi conseillé (lettre recommandée AR ou téléservice).
4. Conseil citoyen empathique pour rassurer l'usager face à la complexité bureaucratique.
Réponds exclusivement au format JSON conforme au schéma.`;

    const userPrompt = `Catégorie administrative : ${category || 'Démarche administrative générale'}
Situation expliquée par l'usager : ${situationText}
Nom de l'usager (facultatif) : ${userFullName || '[Prénom Nom]'}
Numéro de dossier / référence (facultatif) : ${userReference || '[Numéro de dossier / allocataire]'}
Niveau d'urgence : ${urgency || 'Normal'}
Tonalité souhaitée : ${tone || 'Courtoise, ferme et juridiquement motivée'}

Rédige le courrier officiel complet, cite les articles de loi exacts, et précise les pièces à joindre ainsi que le guichet compétent.`;

    let responseText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: userPrompt,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: ADMINISTRATIVE_LETTER_SCHEMA as any,
            temperature: 0.2,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for letter generation:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible de générer le courrier administratif.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      letterData: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/generate-administrative-letter:", error);
    return res.status(500).json({
      error: "Erreur lors de la rédaction administrative : " + (error?.message || "Veuillez réessayer."),
    });
  }
});

// ==========================================
// MÉMOSANTÉ (Le carnet médical familial 100% privé)
// IA d'explication pédagogique des comptes-rendus & analyses
// ==========================================

const MEDICAL_REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    reportTitle: {
      type: Type.STRING,
      description: "Titre du document analysé (ex: Bilan hématologique et biochimique ou Compte-rendu d'échographie abdominale)",
    },
    reportType: {
      type: Type.STRING,
      description: "Catégorie : Prise de sang / NFS, Imagerie (Radio/Scanner/IRM), Analyse d'urine, Échographie, Autre",
    },
    generalSummary: {
      type: Type.STRING,
      description: "Synthèse générale pédagogique, rassurante et compréhensible en français courant de ce que contient le document, sans jamais poser de diagnostic médical.",
    },
    decodedTerms: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          technicalTerm: { type: Type.STRING, description: "Nom scientifique ou sigle médical exact (ex: Ferritine, CRP, Polynucléaires, L3-L4)" },
          plainFrenchTranslation: { type: Type.STRING, description: "Traduction en français simple et imagé sans jargon" },
          biologicalRole: { type: Type.STRING, description: "Rôle physiologique de cet élément dans le corps humain" },
          typicalContext: { type: Type.STRING, description: "Ce que le médecin cherche habituellement à évaluer avec cette mesure" },
        },
        required: ["technicalTerm", "plainFrenchTranslation", "biologicalRole", "typicalContext"],
      },
      description: "Décryptage vulgarisé des termes scientifiques ou abréviations complexes présents dans le document",
    },
    keyQuestionsForDoctor: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 à 5 questions pertinentes, claires et constructives que le patient peut poser à son médecin traitant lors de la prochaine consultation",
    },
    criticalNotice: {
      type: Type.STRING,
      description: "Avertissement solennel rappelant que ce décryptage est purement éducatif et ne remplace pas une consultation médicale avec son médecin traitant.",
    },
  },
  required: [
    "reportTitle",
    "reportType",
    "generalSummary",
    "decodedTerms",
    "keyQuestionsForDoctor",
    "criticalNotice"
  ],
};

app.post('/api/explain-medical-report', async (req, res) => {
  try {
    const { text, file, reportType } = req.body;

    if (!text && !file) {
      return res.status(400).json({
        error: "Veuillez fournir le texte ou la photo / scan de votre compte-rendu médical.",
      });
    }

    const systemPrompt = `Tu es le moteur d'intelligence artificielle souverain, sécurisé et bienveillant au cœur de l'application « France Service », conçue et éditée par ALPHABETTE SASU (fondée par Valentin RICHAUD à La Grande-Motte).
Au sein du MODULE 2 : MÉMOSANTÉ (Carnet de santé familial souverain & vulgarisation médicale), ta mission est de traduire et vulgariser les termes barbares et acronymes des comptes-rendus d'analyses sanguines (NFS, bilan hépatique, ionogramme, glycémie, cholestérol, CRP), d'imageries (radios, scanners, IRM, échographies) ou d'ordonnances en français limpide, accessible et sans angoisse pour le grand public.

RÈGLES D'OR ABSOLUES & ÉTHIQUE MÉDICALE STRICTE :
1. RÈGLE ÉTHIQUE STRICTE : TU NE POSES AUCUN DIAGNOSTIC MÉDICAL ET NE MODIFIES AUCUNE PRESCRIPTION. N'affirme jamais « Vous êtes atteint de... » ou « Vos résultats sont anormaux / alarmants ».
2. RENVOI SYSTÉMATIQUE VERS LE MÉDECIN TRAITANT : Tu renvoies expressément et sereinement l'usager vers son médecin traitant ou les services d'urgence (15 / 112) pour toute décision clinique ou anomalie perçue.
3. Adopter un ton hautement bienveillant, pédagogique, apaisant et mesuré, toujours en vouvoyant l'usager.
4. Expliquer la fonction et le rôle biologique normal des molécules, cellules ou zones anatomiques dans le corps humain.
5. Fournir une liste de questions claires et constructives à poser lors de la prochaine consultation médicale.
Réponds exclusivement au format JSON conforme au schéma.`;

    const contents: any[] = [];

    if (file?.data && file?.mimeType) {
      const base64Data = file.data.includes('base64,')
        ? file.data.split('base64,')[1]
        : file.data;
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: base64Data,
        },
      });
    }

    let promptText = `Voici un document médical à décoder en langage clair. Type présumé : ${reportType || 'Non spécifié'}.\n`;
    if (text) {
      promptText += `\nContenu textuel du compte-rendu :\n"""\n${text}\n"""\n`;
    }
    promptText += `\nTraduis les termes scientifiques complexes, explique leur fonction dans l'organisme sans porter de diagnostic, et prépare les questions clés pour le médecin.`;
    contents.push(promptText);

    let responseText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: MEDICAL_REPORT_SCHEMA as any,
            temperature: 0.2,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for medical report explanation:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible d'expliquer ce document médical.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      explanation: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/explain-medical-report:", error);
    return res.status(500).json({
      error: "Erreur lors du décodage du document médical : " + (error?.message || "Veuillez réessayer."),
    });
  }
});

// ScanGarantie : Schema d'extraction de tickets de caisse & factures
const RECEIPT_SCAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: {
      type: Type.STRING,
      description: "Nom précis de l'appareil ou de l'article principal acheté (ex: Lave-linge Supreme Silence 9kg, Téléviseur OLED 55', Smartphone Galaxy S23, Perceuse sans fil)",
    },
    brand: {
      type: Type.STRING,
      description: "Marque de l'appareil (ex: Bosch, Samsung, Whirlpool, Apple, Sony, Makita, De'Longhi, Moulinex, LG, Philips)",
    },
    modelReference: {
      type: Type.STRING,
      description: "Référence modèle / code produit si repéré (ex: WAN28208FF, OLED55C3), sinon chaîne vide",
    },
    category: {
      type: Type.STRING,
      description: "Catégorie : electromenager, smartphone_tablette, informatique, tv_son, bricolage_jardin, mobilier, autre",
    },
    store: {
      type: Type.STRING,
      description: "Enseigne ou magasin vendeur (ex: Darty, Fnac, Boulanger, Leroy Merlin, Carrefour, E.Leclerc, Amazon, Cdiscount, Apple Store)",
    },
    purchaseDate: {
      type: Type.STRING,
      description: "Date d'achat au format YYYY-MM-DD (ex: 2025-04-12)",
    },
    purchasePrice: {
      type: Type.NUMBER,
      description: "Prix total payé TTC en euros pour l'appareil (ex: 499.99)",
    },
    receiptNumber: {
      type: Type.STRING,
      description: "Numéro de ticket, de facture ou de transaction identifié sur le reçu",
    },
    serialNumber: {
      type: Type.STRING,
      description: "Numéro de série / IMEI / S/N si présent sur le document, sinon chaîne vide",
    },
    warrantyDurationMonths: {
      type: Type.NUMBER,
      description: "Durée légale de garantie en mois (par défaut 24 mois selon l'art. L. 217-3 du Code de la consommation)",
    },
    hasCommercialExtension: {
      type: Type.BOOLEAN,
      description: "Vrai si une garantie commerciale payante ou offerte apparaît sur le ticket (ex: extension 3 ans ou 5 ans), faux sinon",
    },
    commercialExtensionMonths: {
      type: Type.NUMBER,
      description: "Mois supplémentaires de garantie commerciale si mentionnés, 0 sinon",
    },
    detectedVigilancePoints: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "2 à 3 points de vigilance ou conseils SAV pratiques pour le consommateur",
    },
    eligibleBonusReparation: {
      type: Type.BOOLEAN,
      description: "Vrai si l'appareil est éligible au Bonus Réparation QualiRépar (loi AGEC), faux sinon",
    },
    estimatedBonusAmount: {
      type: Type.NUMBER,
      description: "Montant estimé en euros de la déduction Bonus Réparation (entre 15 et 50 euros selon catégorie), ou 0",
    },
  },
  required: [
    "productName",
    "brand",
    "modelReference",
    "category",
    "store",
    "purchaseDate",
    "purchasePrice",
    "receiptNumber",
    "serialNumber",
    "warrantyDurationMonths",
    "hasCommercialExtension",
    "commercialExtensionMonths",
    "detectedVigilancePoints",
    "eligibleBonusReparation",
    "estimatedBonusAmount",
  ],
};

// API Route: Scan receipt / invoice for warranty tracking
app.post('/api/scan-receipt', async (req, res) => {
  try {
    const { text, file } = req.body;

    if (!text && !file) {
      return res.status(400).json({
        error: "Veuillez fournir une photo de ticket de caisse, une facture ou du texte.",
      });
    }

    const systemPrompt = `Tu es le moteur souverain et expert en protection du consommateur au cœur du module « ScanGarantie » de « France Service », édité par ALPHABETTE SASU (La Grande-Motte).
Ta mission est d'analyser les tickets de caisse thermiques, factures d'achat ou bons de commande d'appareils (électroménager, TV, informatique, téléphonie, outillage).

RÈGLES D'EXTRACTION JURIDIQUE ET TECHNIQUE :
1. Extrais avec une précision chirurgicale : le nom de l'appareil, sa marque, la référence modèle, l'enseigne vendeuse, la date exacte d'achat (format YYYY-MM-DD), le prix TTC, et le numéro de ticket/facture.
2. Si le reçu comporte plusieurs articles (ex: courses de supermarché avec une cafetière), cible l'appareil le plus durable / électroménager sujet à garantie.
3. En droit français, la Garantie Légale de Conformité (Code de la consommation art. L. 217-3) est d'ordre public et dure VINGT-QUATRE MOIS (24 mois / 2 ans) pour les biens neufs.
4. Identifie si l'appareil est éligible au Bonus Réparation QualiRépar (loi AGEC) : lave-linge (50€), lave-vaisselle (50€), TV (60€), aspirateur (40€), smartphone/tablette (25€), outillage électrique (20€-25€).
5. Fournis 2 ou 3 points de vigilance concrets (ex: avertissement sur l'effacement chimique des tickets thermiques sous la lumière/chaleur, conseil de conservation numérique, délai de signalement de panne).
Réponds STRICTEMENT au format JSON conforme au schéma.`;

    const contents: any[] = [];

    if (file?.data && file?.mimeType) {
      const base64Data = file.data.includes('base64,')
        ? file.data.split('base64,')[1]
        : file.data;
      contents.push({
        inlineData: {
          mimeType: file.mimeType,
          data: base64Data,
        },
      });
    }

    let promptText = `Analyse ce ticket de caisse / facture pour extraire les informations de garantie légale et d'appareil.\n`;
    if (text) {
      promptText += `\nTexte du ticket ou de la facture :\n"""\n${text}\n"""\n`;
    }
    contents.push(promptText);

    let responseText: string | undefined;
    const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    let lastError: any = null;

    for (const model of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: 'application/json',
            responseSchema: RECEIPT_SCAN_SCHEMA as any,
            temperature: 0.1,
          },
        });
        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for receipt scan:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible d'extraire les données du ticket.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      warrantyData: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/scan-receipt:", error);
    return res.status(500).json({
      error: "Erreur lors de la lecture du ticket : " + (error?.message || "Veuillez réessayer ou vérifier l'image."),
    });
  }
});

// ============================================================================
// TUTEUR NUMÉRIQUE : Guide Pas-à-Pas pour Démarches en Ligne Françaises
// ============================================================================
const TUTEUR_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Nom officiel précis et clair de la démarche administrative" },
    category: { type: Type.STRING, description: "Catégorie parmi: transport, etat_civil, famille, fiscalite_social, logement ou justice_amende" },
    administration: { type: Type.STRING, description: "Nom exact de l'administration ou organisme public officiel compétent (ex: ANTS / France Titres, CAF, DGFIP, Ameli, Mairie, etc.)" },
    officialUrl: { type: Type.STRING, description: "URL officielle directe exacte sur service-public.fr ou le site officiel d'État en .gouv.fr" },
    cost: { type: Type.STRING, description: "Coût légal officiel (ex: 100% Gratuit, ou montant exact du timbre fiscal / taxe légale)" },
    delaiEstime: { type: Type.STRING, description: "Délai moyen d'instruction ou de traitement constaté" },
    description: { type: Type.STRING, description: "Résumé simple en 2 phrases de l'objet de la démarche pour un citoyen" },
    franceConnectRecommended: { type: Type.BOOLEAN, description: "Indique si la connexion FranceConnect est recommandée ou requise" },
    isOfficialServiceFree: { type: Type.BOOLEAN, description: "Indique si l'accès au téléservice est légalement gratuit" },
    warningAntiArnaque: { type: Type.STRING, description: "Mise en garde expresse contre les arnaques, faux sites payants ou intermédiaires trompeurs" },
    helplinePhone: { type: Type.STRING, description: "Numéro de téléphone d'assistance officiel gratuit ou non surtaxé (ex: 3939, 3400, etc.)" },
    legalBasis: { type: Type.STRING, description: "Référence légale (Code, décret ou circulaire)" },
    requiredDocuments: {
      type: Type.ARRAY,
      description: "Liste complète des pièces justificatives indispensables à réunir avant de commencer",
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          label: { type: Type.STRING, description: "Nom clair de la pièce (ex: Justificatif de domicile de moins de 3 mois)" },
          description: { type: Type.STRING, description: "Précision sur la nature exacte du document accepté" },
          mandatory: { type: Type.BOOLEAN, description: "True si obligatoire, False si facultatif ou selon situation" },
          format: { type: Type.STRING, description: "Format et poids recommandés (ex: PDF ou JPG < 2 Mo)" },
          validityNotice: { type: Type.STRING, description: "Délai de validité maximal si applicable (ex: Moins de 3 mois)" },
          tipAntiRejet: { type: Type.STRING, description: "Astuce essentielle pour éviter le rejet immédiat de la pièce par l'instructeur" },
        },
        required: ["id", "label", "description", "mandatory", "format", "tipAntiRejet"],
      },
    },
    fourStepsRoadmap: {
      type: Type.ARRAY,
      description: "Feuille de route chronologique en exactement quatre étapes claires et sans jargon",
      items: {
        type: Type.OBJECT,
        properties: {
          stepNumber: { type: Type.INTEGER, description: "Numéro de l'étape: 1, 2, 3 ou 4" },
          title: { type: Type.STRING, description: "Titre clair de l'étape (ex: Étape 1 : Préparation & Accès sécurisé)" },
          objective: { type: Type.STRING, description: "Objectif opérationnel de cette étape" },
          actions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Actions concrètes et chronologiques à effectuer"
          },
          antiTrapAlert: { type: Type.STRING, description: "Piège classique ou erreur fréquente à éviter absolument à cette étape" },
          checklist: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Checklist de 2 à 3 points de contrôle pour valider cette étape"
          }
        },
        required: ["stepNumber", "title", "objective", "actions", "antiTrapAlert", "checklist"],
      },
    },
    commonRejectionReasons: {
      type: Type.ARRAY,
      description: "Les 2 à 3 motifs les plus fréquents de rejet ou de blocage du dossier et comment les résoudre",
      items: {
        type: Type.OBJECT,
        properties: {
          reason: { type: Type.STRING, description: "Motif fréquent de rejet" },
          solution: { type: Type.STRING, description: "Solution concrète immédiate pour débloquer" },
        },
        required: ["reason", "solution"],
      },
    },
  },
  required: [
    "title",
    "category",
    "administration",
    "officialUrl",
    "cost",
    "delaiEstime",
    "description",
    "franceConnectRecommended",
    "isOfficialServiceFree",
    "requiredDocuments",
    "fourStepsRoadmap",
    "commonRejectionReasons",
  ],
};

app.post('/api/tuteur-demarche', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || !query.trim()) {
      return res.status(400).json({ error: "La description de la démarche est requise." });
    }

    const systemPrompt = `Tu es le "Tuteur Numérique" du portail d'utilité publique "France Service".
Tu aides les citoyens français, les familles et les personnes en difficulté avec l'informatique à réussir leurs démarches administratives en ligne (ANTS, CAF, Ameli, Impôts DGFIP, ANTAI, Éducation Nationale, Service-Public.fr, Préfectures, etc.).

Pour la démarche demandée par l'usager : "${query.trim()}" :
1. Identifie l'administration officielle exacte et l'URL officielle réelle (.gouv.fr ou .service-public.fr). Avertis expressément contre les faux sites privés payants qui facturent indûment des frais de dossier.
2. Établis la liste exhaustive des pièces justificatives à réunir AVANT de commencer, avec pour chaque pièce :
   - Son statut (obligatoire ou selon situation)
   - Le format recommandé (PDF/JPG < 2 Mo)
   - Une astuce concrète "Anti-Rejet" (ex: quittance de loyer manuscrite refusée, contrôle technique de plus de 6 mois refusé, etc.).
3. Fournis une feuille de route rigoureusement structurée en QUATRE étapes chronologiques :
   - Étape 1 : Préparation & Accès sécurisé (FranceConnect, site officiel vérifié)
   - Étape 2 : Saisie des données clés & Renseignement des formulaires
   - Étape 3 : Contrôle de cohérence & Téléversement des justificatifs
   - Étape 4 : Validation, Horodatage & Suivi du délai légal d'instruction
4. Liste les 2 à 3 motifs de rejet les plus fréquents et la solution immédiate pour chacun.

Sois rassurant, très précis, sans jargon technocratique, 100% conforme au droit public français en vigueur.`;

    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];
    let responseText = '';
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: TUTEUR_SCHEMA,
            temperature: 0.1,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for tuteur demarche:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible de générer le guide pour cette démarche.");
    }

    const parsedData = JSON.parse(responseText.trim());
    // Generate deterministic id if not present
    const id = 'custom-' + Math.random().toString(36).substring(2, 9);
    const guide = {
      id,
      ...parsedData,
    };

    return res.json({
      success: true,
      guide,
    });
  } catch (error: any) {
    console.error("Error in /api/tuteur-demarche:", error);
    return res.status(500).json({
      error: "Erreur lors de la génération du guide pas-à-pas : " + (error?.message || "Veuillez réessayer."),
    });
  }
});

// ============================================================================
// RÉSIL-EXPRESS : Analyse OCR de Contrat & Gestionnaire de Désengagement
// ============================================================================
const RESIL_SCAN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    providerName: { type: Type.STRING, description: "Nom exact de l'organisme, opérateur, salle ou assureur identifié (ex: Basic-Fit, Free, MAIF, Verisure, Canal+)" },
    category: { type: Type.STRING, description: "Catégorie parmi: sport_loisirs, telecom_internet, assurance, telesurveillance_habitat, energie, presse_streaming, autre" },
    clientNumber: { type: Type.STRING, description: "Numéro de client ou d'abonné détecté, ou chaîne vide si non trouvé" },
    contractNumber: { type: Type.STRING, description: "Numéro de contrat ou police détecté, ou chaîne vide" },
    subscriptionDate: { type: Type.STRING, description: "Date de souscription ou date d'échéance si lisible (ex: 15/09/2023)" },
    monthlyAmount: { type: Type.NUMBER, description: "Montant estimé ou réel de la mensualité en euros (ex: 29.99)" },
    serviceAddress: {
      type: Type.OBJECT,
      properties: {
        recipientName: { type: Type.STRING, description: "Raison sociale et service résiliation officiel" },
        street: { type: Type.STRING, description: "Rue, TSA ou boîte postale" },
        postalCode: { type: Type.STRING, description: "Code postal" },
        city: { type: Type.STRING, description: "Ville" },
        cedex: { type: Type.STRING, description: "Cedex si applicable" },
      },
      required: ["recipientName", "street", "postalCode", "city"],
    },
    recommendedGround: {
      type: Type.STRING,
      description: "Le motif juridique le plus protecteur: loi_hamon (assurance > 1 an), loi_chatel (avis échéance non reçu), resiliation_3_clics (abonnement souscrit en ligne), hausse_tarifaire, motif_legitime, retractation_14j ou echeance_terme"
    },
    legalJustification: { type: Type.STRING, description: "Justification en 1 phrase du motif choisi" },
    tip: { type: Type.STRING, description: "Conseil concret pour éviter les frais cachés de cet organisme" },
  },
  required: [
    "providerName",
    "category",
    "monthlyAmount",
    "serviceAddress",
    "recommendedGround",
    "legalJustification",
    "tip",
  ],
};

app.post('/api/resil-scan', async (req, res) => {
  try {
    const { imageBase64, mimeType, textInput } = req.body;

    if (!imageBase64 && (!textInput || !textInput.trim())) {
      return res.status(400).json({ error: "Veuillez fournir une image de contrat/facture ou une description textuelle." });
    }

    const systemPrompt = `Tu es l'analyste juridique expert du module « Résil-Express » de France Service.
Ton rôle est d'analyser le document (facture, contrat, avis d'échéance, capture de compte) ou la saisie de l'usager pour préparer sa lettre de résiliation officielle sans frais.

1. Identifie l'enseigne ou l'organisme (ex: Basic-Fit, Fitness Park, Free, SFR, Orange, Bouygues, AXA, MAIF, MACIF, Verisure, Canal+, etc.).
2. Retrouve l'adresse postale EXACTE certifiée du siège ou service résiliation officiel en France (TSA, Cedex...).
3. Extrais le numéro client, numéro de contrat, montant mensuel payé et date d'engagement si visibles.
4. Détermine le FONDEMENT JURIDIQUE français le plus avantageux pour le citoyen :
   - 'loi_hamon' : pour toute assurance auto, moto, habitation ou affinitaire souscrite il y a plus d'1 an (Art. L. 113-15-2 Code des assurances) -> résiliation à tout moment sans motif et sans pénalité.
   - 'loi_chatel' : si contrat à reconduction tacite et que l'usager n'a pas reçu d'avis d'échéance 15j avant la date limite (Art. L. 215-1 Code conso) -> résiliation immédiate sans préavis.
   - 'resiliation_3_clics' : pour tout abonnement ayant une souscription en ligne (Loi n° 2022-1158 / Art. L. 215-1-1).
   - 'hausse_tarifaire' : si modification unilatérale de forfait (Art. L. 224-33).
   - 'motif_legitime' : déménagement, inaptitude physique, etc.
   - 'retractation_14j' : souscription de moins de 14 jours (Art. L. 221-18).
   - 'echeance_terme' : résiliation à échéance normale.
5. Donne une astuce anti-piège pour ce fournisseur (ex: bon de retour matériel, révocation SEPA).`;

    const parts: any[] = [{ text: systemPrompt }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, ''),
        },
      });
    }

    if (textInput) {
      parts.push({
        text: `Données complémentaires ou saisie de l'usager : ${textInput}`,
      });
    }

    const modelsToTry = ['gemini-3.8-flash', 'gemini-2.5-flash'];
    let responseText = '';
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: RESIL_SCAN_SCHEMA,
            temperature: 0.1,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for resil scan:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible d'extraire les données de résiliation du document.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/resil-scan:", error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse du document de résiliation : " + (error?.message || "Veuillez vérifier le fichier ou saisir le nom de l'organisme."),
    });
  }
});

const WEAR_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    classification: {
      type: Type.STRING,
      description: "VETUSTE_NORMALE, DEGRADATION_LOCATIVE, USAGE_MIXTE ou NON_IMPUTABLE_AU_LOCATAIRE",
    },
    confidenceScore: {
      type: Type.INTEGER,
      description: "Score de confiance de 0 à 100",
    },
    title: {
      type: Type.STRING,
      description: "Titre clair et percutant de la qualification juridique (ex: Traces de frottement et jaunissement : Vétusté normale)",
    },
    summary: {
      type: Type.STRING,
      description: "Synthèse en 2 ou 3 phrases pour le locataire et le propriétaire",
    },
    whoPays: {
      type: Type.STRING,
      description: "PROPRIETAIRE_100, LOCATAIRE_AVEC_VETUSTE ou LOCATAIRE_100",
    },
    whoPaysLabel: {
      type: Type.STRING,
      description: "Libellé explicite : À la charge exclusive du propriétaire (0 € retenu) OU À la charge du locataire avec abattement obligatoire pour vétusté",
    },
    legalBasis: {
      type: Type.STRING,
      description: "Fondements juridiques précis en droit français (ex: Décret n° 2016-382 du 30 mars 2016, article 7 alinéa d loi n° 89-462 du 6 juillet 1989)",
    },
    depreciationDetails: {
      type: Type.OBJECT,
      properties: {
        equipmentCategory: { type: Type.STRING },
        theoreticalLifespanYears: { type: Type.INTEGER },
        annualDepreciationRate: { type: Type.INTEGER },
        occupancyDurationYears: { type: Type.INTEGER },
        calculatedDepreciationRate: { type: Type.INTEGER },
        maxResidualRateAllowed: { type: Type.INTEGER },
        sharePayableByTenantPercent: { type: Type.INTEGER },
        explanation: { type: Type.STRING },
      },
      required: [
        "equipmentCategory",
        "theoreticalLifespanYears",
        "annualDepreciationRate",
        "occupancyDurationYears",
        "calculatedDepreciationRate",
        "maxResidualRateAllowed",
        "sharePayableByTenantPercent",
        "explanation",
      ],
    },
    keyArguments: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 ou 4 arguments juridiques et factuels imparables que le locataire peut opposer au propriétaire ou à l'agence",
    },
    recommendedSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 étapes concrètes recommandées pour sauvegarder ses droits",
    },
    jurisprudenceReference: {
      type: Type.STRING,
      description: "Jurisprudence ou règle de la Cour de cassation ou de la Commission Départementale de Conciliation",
    },
  },
  required: [
    "classification",
    "confidenceScore",
    "title",
    "summary",
    "whoPays",
    "whoPaysLabel",
    "legalBasis",
    "depreciationDetails",
    "keyArguments",
    "recommendedSteps",
  ],
};

app.post('/api/etatdeslieux-analyze', async (req, res) => {
  try {
    const {
      imageBase64,
      mimeType,
      room,
      category,
      occupancyYears = 3,
      contextNotes = '',
      initialCondition = "bon état d'usage",
    } = req.body;

    const systemPrompt = `Tu es un expert juriste français assermenté spécialisé dans le droit du logement locatif (Loi du 6 juillet 1989 modifiée par la loi ALUR, Décret n° 2016-382 du 30 mars 2016 fixant les modalités de l'état des lieux et l'application d'une grille de vétusté, jurisprudence constante de la 3e Chambre Civile de la Cour de cassation).

L'usager te soumet une photo d'un élément du logement ou une description précise lors de l'état des lieux de sortie pour savoir si une retenue sur caution est légale.

Contexte fourni :
- Pièce : ${room || 'Non spécifiée'}
- Catégorie : ${category || 'Élément du logement'}
- Durée d'occupation du locataire : ${occupancyYears} an(s)
- État mentionné à l'entrée dans les lieux : ${initialCondition}
- Précisions de l'usager : ${contextNotes || 'Aucune'}

Directives juridiques strictes :
1. DÉFINITION LÉGALE DE LA VÉTUSTÉ (Décret 2016-382) :
   « L'état d'usure ou de détérioration résultant du seul usage normal de la chose louée ou des effets du temps ».
   La vétusté normale est À LA CHARGE EXCLUSIVE DU PROPRIÉTAIRE (0 € à payer par le locataire).
   Exemples typiques de vétusté normale :
   - Murs / Peintures : ombres laissées par des meubles ou cadres, jaunissement naturel au soleil, micro-rayures de frottement, trous de chevilles pour fixer des éléments usuels dès lors qu'ils sont rebouchés proprement.
   - Sols / Parquets : traces d'usure superficielles aux zones de passage fréquent, tassement des fibres de moquette, légères rayures de chaises.
   - Sanitaires : ternissement de l'émail, traces de calcaire inévitables malgré entretien courant, usure du mécanisme de chasse ou cartouche de mitigeur.
   - Électroménager meublé : rayures d'usage sur plaques, vieillissement naturel du compresseur ou joint de frigo.

2. DÉGRADATION LOCATIVE :
   Négligence manifeste, trou béant non rebouché, brûlure, fêlure de faïence par choc violent, meuble ou équipement brisé, vitre cassée, moquette tachée de vin/brûlée.
   IMPORTANT : Même en cas de dégradation locative avérée, le bailleur N'A PAS LE DROIT de facturer le remplacement à neuf ! Il DOIT obligatoirement appliquer le coefficient d'abattement pour vétusté selon l'âge de l'équipement (ex: si une peinture a 5 ans et durée de vie 7 ans, le propriétaire ne peut réclamer qu'une fraction résiduelle et jamais 100%).

3. Calcule l'abattement mathématique selon les grilles types d'accord collectif national :
   - Peintures : franchise 1 an, durée 7 ans, abattement 14%/an.
   - Parquet stratifié : franchise 2 ans, durée 10 ans, abattement 10%/an.
   - Sanitaires : franchise 2 ans, durée 20 ans, abattement 5%/an.
   - Électroménager : franchise 1 an, durée 8 ans, abattement 12.5%/an.

Sois impartial, rigoureux, protecteur des droits des citoyens conformément à la législation française.`;

    const parts: any[] = [{ text: systemPrompt }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64.replace(/^data:image\/[a-zA-Z0-9+.-]+;base64,/, ''),
        },
      });
    }

    if (contextNotes) {
      parts.push({
        text: `Détails constatés sur place : ${contextNotes}`,
      });
    }

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
    let responseText = '';
    let lastError: any = null;

    for (const model of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: [{ role: 'user', parts }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: WEAR_ANALYSIS_SCHEMA,
            temperature: 0.1,
          },
        });

        if (response.text) {
          responseText = response.text;
          break;
        }
      } catch (err: any) {
        console.warn(`Model ${model} failed for wear analysis:`, err?.message || err);
        lastError = err;
        await new Promise((resolve) => setTimeout(resolve, 300));
      }
    }

    if (!responseText) {
      throw lastError || new Error("Impossible d'analyser l'état de l'élément.");
    }

    const parsedData = JSON.parse(responseText.trim());

    return res.json({
      success: true,
      data: parsedData,
    });
  } catch (error: any) {
    console.error("Error in /api/etatdeslieux-analyze:", error);
    return res.status(500).json({
      error: "Erreur lors de l'analyse d'usure : " + (error?.message || "Veuillez réessayer."),
    });
  }
});




// Mount Vite or static server
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
    console.log(`ClairContrat server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
