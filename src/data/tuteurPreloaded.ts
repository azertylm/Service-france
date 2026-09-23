import { DemarcheGuide } from '../types/tuteur';

export const PRELOADED_DEMARCHES: DemarcheGuide[] = [
  {
    id: 'carte-grise-duplicata-changement',
    title: 'Refaire ou changer le titulaire de ma carte grise',
    category: 'transport',
    administration: 'ANTS / France Titres (Ministère de l’Intérieur)',
    officialUrl: 'https://immatriculation.ants.gouv.fr',
    cost: 'Coût légal des taxes régionales (Y.4 fixe 11 € + redevance 2,76 €) — Frais de dossier ANTS = 0 €',
    delaiEstime: '7 à 10 jours ouvrés (envoi sécurisé par lettre recommandée avec suivi La Poste)',
    description: 'Procédure officielle pour enregistrer l’achat d’un véhicule d’occasion ou obtenir un duplicata après perte ou vol.',
    franceConnectRecommended: true,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'ATTENTION : De nombreux sites commerciaux payants imitent l’ANTS et facturent 30 € à 60 € de "frais de traitement". Le site de l’État immatriculation.ants.gouv.fr ne prend AUCUN frais intermédiaire.',
    helplinePhone: '3400 (Coût d’un appel local, du lundi au vendredi de 7h45 à 19h)',
    legalBasis: 'Articles R. 322-1 et suivants du Code de la route',
    requiredDocuments: [
      {
        id: 'cg_anc_titre',
        label: 'Ancienne carte grise barrée, datée et signée',
        description: 'La carte grise remise par l’ancien propriétaire avec la mention "Vendu le [date et heure]" ou "Cédé le" et sa signature.',
        mandatory: true,
        format: 'Photo nette ou PDF recto-verso (< 2 Mo)',
        tipAntiRejet: 'Conservez impérativement le coupon détachable en bas du titre qui vous autorise à circuler pendant 1 mois.'
      },
      {
        id: 'cg_certif_cession',
        label: 'Certificat de cession Cerfa n° 15776*02',
        description: 'Exemplaire n° 1 ou 2 rempli et signé conjointement par l’ancien propriétaire et vous-même.',
        mandatory: true,
        format: 'PDF ou photo nette',
        tipAntiRejet: 'Vérifiez que le code de cession (6 chiffres) généré par l’ancien propriétaire correspond exactement au document.'
      },
      {
        id: 'cg_ct',
        label: 'Procès-verbal de Contrôle Technique valide',
        description: 'Obligatoire pour les véhicules de plus de 4 ans. Doit dater de moins de 6 mois le jour de la demande (ou moins de 2 mois en cas de contre-visite).',
        mandatory: true,
        format: 'Scan ou photo nette de la page de résultat',
        validityNotice: 'Moins de 6 mois impérativement à la date de soumission',
        tipAntiRejet: 'Si le CT a 6 mois et 1 jour le jour de la validation du dossier, l’ANTS rejettera automatiquement la demande.'
      },
      {
        id: 'cg_justif_domicile',
        label: 'Justificatif de domicile de moins de 6 mois',
        description: 'Facture d’électricité, de gaz, d’eau, avis d’imposition ou quittance de loyer d’un organisme officiel (bailleur social ou agence).',
        mandatory: true,
        format: 'PDF téléchargé depuis votre espace client (EDF, Engie...)',
        validityNotice: 'Moins de 6 mois (moins de 3 mois recommandé)',
        tipAntiRejet: 'PIÈGE N°1 DE REJET : Les quittances de loyer manuscrites entre particuliers ou les simples factures de téléphone mobile sont refusées.'
      },
      {
        id: 'cg_permis',
        label: 'Permis de conduire du titulaire',
        description: 'Permis correspondant à la catégorie du véhicule (B pour voiture, A pour moto).',
        mandatory: true,
        format: 'Photo recto-verso bien cadrée',
        tipAntiRejet: 'Le nom et prénom doivent concorder parfaitement avec le certificat de cession.'
      },
      {
        id: 'cg_attest_assurance',
        label: 'Attestation d’assurance (carte verte ou mémo véhicule)',
        description: 'Attestation en cours de validité prouvant que le véhicule est couvert dès la prise en main.',
        mandatory: true,
        format: 'Document PDF ou photo de l’attestation',
        tipAntiRejet: 'Doit mentionner expressément l’immatriculation du véhicule ou son numéro de série VIN.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Préparation & Connexion sécurisée sur l’ANTS',
        objective: 'Se connecter via le portail officiel de l’État sans tomber sur un intermédiaire payant.',
        actions: [
          'Rendez-vous sur https://immatriculation.ants.gouv.fr (vérifiez le bandeau bleu-blanc-rouge et l’adresse en .gouv.fr).',
          'Cliquez sur "Se connecter avec FranceConnect" en choisissant vos identifiants des Impôts, d’Ameli ou de l’Identité Numérique La Poste.',
          'Récupérez le code de cession à 6 chiffres transmis par le vendeur (si achat d’occasion).'
        ],
        antiTrapAlert: 'Méfiez-vous des liens sponsorisés Google commençant par "Annonce". Le site officiel de l’État est toujours gratuit d’accès.',
        checklist: [
          'Accès au site officiel vérifié en .gouv.fr',
          'Connexion établie avec FranceConnect',
          'Code de cession du vendeur sous la main'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Choix de la démarche & Renseignement du véhicule',
        objective: 'Sélectionner la téléprocédure exacte pour éviter un aiguillage erroné.',
        actions: [
          'Dans votre espace usager, cliquez sur "Acheter ou recevoir un véhicule d’occasion" ou "Refaire ma carte grise (duplicata)".',
          'Indiquez le numéro d’immatriculation (format AA-123-AA ou 1234 AB 75).',
          'Saisissez le code de cession : les informations du véhicule et de l’ancien propriétaire s’affichent automatiquement.',
          'Vérifiez scrupuleusement la cohérence du numéro de série (VIN inscrit en case E de la carte grise).'
        ],
        antiTrapAlert: 'Si le code de cession est déclaré inexistant, demandez au vendeur s’il a bien validé sa déclaration de vente sur son propre compte ANTS.',
        checklist: [
          'Immatriculation saisie sans tirets ni espaces superflus',
          'Numéro VIN (case E) vérifié',
          'Coordonnées du nouveau titulaire renseignées'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Téléversement des pièces justificatives',
        objective: 'Joindre les fichiers numérisés en respectant les critères stricts de conformité de l’ANTS.',
        actions: [
          'Déposez chaque pièce dans la case correspondante (Permis, Justificatif de domicile, Contrôle technique...).',
          'Assurez-vous que chaque fichier fait moins de 2 Mo et est au format PDF ou JPG.',
          'Contrôlez que les 4 coins des documents sont visibles et que les textes sont 100 % lisibles.',
          'Cochez la case sur l’honneur attestant de la validité de l’assurance et de la possession du permis.'
        ],
        antiTrapAlert: 'Une photo floue ou coupée entraîne une mise en attente de votre dossier de 3 à 4 semaines par un instructeur de préfecture.',
        checklist: [
          'Justificatif de domicile de moins de 6 mois au bon format',
          'Contrôle technique de moins de 6 mois valide',
          'Scan recto-verso de l’ancienne carte grise barrée'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Paiement des taxes légales, Téléchargement du CPI & Suivi',
        objective: 'Régler le montant légal par carte bancaire et imprimer le certificat provisoire d’immatriculation.',
        actions: [
          'Réglez le montant des taxes régionales par carte bancaire sécurisée.',
          'Téléchargez immédiatement le Certificat Provisoire d’Immatriculation (CPI) au format PDF.',
          'Imprimez ou enregistrez ce CPI sur votre téléphone : il vous permet de circuler légalement en France pendant 1 mois.',
          'Notez le numéro de dossier à 7 chiffres pour suivre l’acheminement sur l’outil de suivi La Poste.'
        ],
        antiTrapAlert: 'N’attendez pas la fin de validité du CPI pour vous inquiéter : si la carte définitive n’arrive pas sous 10 jours, vérifiez votre boîte mail (y compris les spams).',
        checklist: [
          'Paiement sécurisé validé',
          'Certificat Provisoire d’Immatriculation (CPI) téléchargé et imprimé',
          'Numéro de suivi postal relevé'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Justificatif de domicile non conforme ou trop ancien',
        solution: 'Fournissez un échéancier d’électricité récent, une facture d’eau ou le dernier avis d’impôt sur les revenus. Ne fournissez pas de facture de mobile.'
      },
      {
        reason: 'Contrôle technique ayant dépassé la limite de 6 mois',
        solution: 'La date prise en compte est celle de la validation en ligne du dossier. Si le délai est dépassé ne serait-ce que d’un jour, repassez un contrôle technique.'
      },
      {
        reason: 'Discordance d’orthographe sur le prénom ou nom d’usage',
        solution: 'Vérifiez que le prénom et le nom correspondent à l’identique entre le compte FranceConnect, le permis et le certificat de cession.'
      }
    ]
  },
  {
    id: 'contester-fps-forfait-post-stationnement',
    title: 'Contester un Forfait Post-Stationnement (FPS)',
    category: 'justice_amende',
    administration: 'Collectivité locale émettrice & ANTAI (Agence Nationale de Traitement Automatisé des Infractions)',
    officialUrl: 'https://www.antai.gouv.fr',
    cost: '100% Gratuit — Aucun droit de timbre ni consignation préalable obligatoire pour le RAPO',
    delaiEstime: 'Délai légal de 1 mois pour agir à compter de la notification du FPS (réponse sous 1 mois)',
    description: 'Procédure officielle de Recours Administratif Préalable Obligatoire (RAPO) contre une contravention de stationnement injustifiée (ticket payé, place PMR avec carte, véhicule vendu ou erreur de plaque).',
    franceConnectRecommended: false,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'ATTENTION : Les faux SMS prétendant que vous avez une "amende de stationnement impayée" avec un lien court sont des arnaques au phishing. L’ANTAI n’envoie JAMAIS de SMS pour un FPS.',
    helplinePhone: '0806 606 606 (Serveur vocal officiel ANTAI, appel non surtaxé)',
    legalBasis: 'Articles L. 2333-87 et R. 2333-120-13 du Code général des collectivités territoriales',
    requiredDocuments: [
      {
        id: 'fps_avis',
        label: 'Avis de paiement du FPS (reçu par courrier ou apposé)',
        description: 'Document officiel comportant le numéro de FPS à 12 chiffres et la date/heure exacte du contrôle.',
        mandatory: true,
        format: 'Scan ou photo nette de l’avis complet',
        tipAntiRejet: 'Relevez le numéro de télépaiement à 12 chiffres inscrit en haut à droite.'
      },
      {
        id: 'fps_carte_grise',
        label: 'Certificat d’immatriculation du véhicule concerné',
        description: 'Carte grise au nom du demandeur ou justifiant la propriété.',
        mandatory: true,
        format: 'Photo recto de la carte grise',
        tipAntiRejet: 'La plaque doit correspondre à celle visée par le FPS.'
      },
      {
        id: 'fps_preuve_paiement',
        label: 'Justificatif du droit au stationnement',
        description: 'Ticket d’horodateur papier, capture d’écran d’application mobile (Flowbird, PayByPhone, EasyPark) avec l’heure, ou carte résident.',
        mandatory: true,
        format: 'Capture d’écran horodatée ou photo nette du ticket',
        tipAntiRejet: 'Vérifiez que l’heure du ticket couvre bien la minute exacte du contrôle indiquée sur le FPS.'
      },
      {
        id: 'fps_carte_pmr',
        label: 'Carte CMI-S (Stationnement PMR) si concerné',
        description: 'Pour les bénéficiaires de la Carte Mobilité Inclusion mention Stationnement (gratuité légale de plein droit).',
        mandatory: false,
        format: 'Photo recto-verso de la carte CMI-S',
        tipAntiRejet: 'La gratuité PMR s’applique sur toutes les places publiques ouvertes sans exception, même payantes.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Vérifier le délai de 1 mois & l’autorité compétente',
        objective: 'S’assurer que le délai impératif de 1 mois n’est pas forclos et identifier la mairie/société délégataire.',
        actions: [
          'Regardez la date de notification de l’avis de paiement du FPS : vous avez exactement 1 mois pour déposer le recours.',
          'Consultez le dos de l’avis pour identifier le portail de téléservice désigné (ex: site de la ville de Paris, Streeteo, Moovia, Indigo ou portail ANTAI).',
          'Rassemblez le numéro de FPS (12 chiffres) et l’immatriculation.'
        ],
        antiTrapAlert: 'Passé le délai de 1 mois, le FPS est majoré (+ 50 €) par la DGFIP et le recours administratif devient irrecevable.',
        checklist: [
          'Délai de 30 jours calculé et respecté',
          'Numéro de FPS à 12 chiffres relevé',
          'Adresse du téléservice officiel de la commune notée'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Préparer l’argument juridique du recours',
        objective: 'Structurer l’exposé des faits selon un motif légalement reconnu.',
        actions: [
          'Sélectionnez votre motif réel : ticket payé mais mauvaise saisie d’une lettre de plaque, place PMR avec CMI valide, véhicule vendu avant la date du contrôle, usurpation de plaque avec plainte.',
          'Rédigez l’exposé des faits de manière concise et courtoise, en citant l’article L. 2333-87 du CGCT.',
          'Précisez la référence de la transaction numérique (reçu PayByPhone ou identifiant bancaire).'
        ],
        antiTrapAlert: 'Les arguments d’opportunité ("j’en avais pour 5 minutes", "il n’y avait personne") sont systématiquement rejetés.',
        checklist: [
          'Motif légitime qualifié',
          'Exposé chronologique clair rédigé',
          'Numéro de transaction bancaire ou horodateur mentionné'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Dépôt du RAPO en ligne avec pièces jointes',
        objective: 'Transmettre le dossier complet sur la plateforme dématérialisée officielle.',
        actions: [
          'Connectez-vous sur le site de téléservice indiqué sur votre avis de FPS.',
          'Remplissez les champs d’identité du titulaire de la carte grise.',
          'Téléversez obligatoirement l’avis de FPS, la copie de la carte grise et la pièce justificative (ticket/CMI/dépôt de plainte).',
          'Vérifiez le récapitulatif avant de cliquer sur "Transmettre le recours".'
        ],
        antiTrapAlert: 'L’omission de joindre l’avis de FPS ou la carte grise entraîne un rejet d’office pour irrecevabilité formelle sans examen au fond.',
        checklist: [
          'Avis de FPS joint',
          'Carte grise jointe',
          'Ticket horodateur ou justificatif d’exonération joint'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Conservation de l’accusé de réception & Suivi',
        objective: 'Conserver la preuve de dépôt et surveiller le délai de réponse de 1 mois.',
        actions: [
          'Téléchargez impérativement l’Accusé d’Enregistrement avec numéro de recours et horodatage.',
          'L’autorité dispose d’un délai de 1 mois pour vous répondre.',
          'Si la contestation est acceptée : vous recevez un avis de classement sans suite (FPS annulé).',
          'Si rejet explicite ou silence de 1 mois (rejet implicite) : vous pouvez saisir la Commission du Contentieux du Stationnement Payant (CCSP).'
        ],
        antiTrapAlert: 'Gardez précieusement l’accusé de réception du recours : il suspend l’application de la majoration pendant l’instruction.',
        checklist: [
          'Accusé d’enregistrement du RAPO téléchargé et archivé',
          'Date limite de réponse à J+30 notée dans son agenda',
          'Dossier prêt en cas de recours secondaire devant la CCSP'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Omission de joindre la copie de l’avis de paiement ou du certificat d’immatriculation',
        solution: 'Même si le téléservice ne bloque pas la soumission, ces deux pièces sont imposées par la loi sous peine d’irrecevabilité automatique.'
      },
      {
        reason: 'Erreur d’un caractère dans la saisie de la plaque à l’horodateur (ex: O au lieu de 0)',
        solution: 'Le Conseil d’État a jugé que l’erreur matérielle de saisie d’immatriculation ne justifie pas le FPS si le paiement est prouvé. Joignez le relevé de paiement.'
      },
      {
        reason: 'Recours envoyé par simple lettre sans accusé ou hors délai',
        solution: 'Privilégiez toujours le téléservice en ligne officiel pour obtenir un récépissé numérique horodaté immédiat.'
      }
    ]
  },
  {
    id: 'bourse-scolaire-college-lycee',
    title: 'Faire une demande de bourse de collège ou lycée',
    category: 'famille',
    administration: 'Éducation Nationale (Portail EduConnect / Scolarité Services)',
    officialUrl: 'https://educonnect.education.gouv.fr',
    cost: '100% Gratuit — Aide financière directe de l’État versée chaque trimestre',
    delaiEstime: 'Campagne annuelle (de septembre à fin octobre) — Notification sous 3 à 4 semaines',
    description: 'Procédure pour percevoir la bourse nationale d’études (échelon 1 à 3 au collège, échelon 1 à 6 au lycée) selon vos ressources fiscales.',
    franceConnectRecommended: true,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'Aucun frais de dossier ne peut être exigé. Le portail officiel est exclusivement accessible via EduConnect de l’Éducation Nationale.',
    helplinePhone: 'Secrétariat de gestion du collège/lycée de l’élève ou 0809 540 606',
    legalBasis: 'Articles R. 531-1 et suivants du Code de l’éducation',
    requiredDocuments: [
      {
        id: 'bourse_avis_impot',
        label: 'Avis de situation déclarative à l’impôt sur le revenu (ASDIR) N-1',
        description: 'Avis d’imposition de l’année N-1 portant sur les revenus de l’année N-2 (ex: avis 2025 sur revenus 2024).',
        mandatory: true,
        format: 'PDF complet téléchargé depuis impots.gouv.fr',
        tipAntiRejet: 'C’est le "Revenu Brut Global" qui détermine le droit et l’échelon, pas le montant de l’impôt payé.'
      },
      {
        id: 'bourse_rib',
        label: 'Relevé d’Identité Bancaire (RIB) au format IBAN',
        description: 'RIB du responsable légal qui assume la charge effective et financière de l’élève.',
        mandatory: true,
        format: 'PDF de la banque ou photo nette',
        tipAntiRejet: 'Le nom du titulaire du compte doit correspondre au responsable légal demandeur.'
      },
      {
        id: 'bourse_livret_famille',
        label: 'Livret de famille ou extrait d’acte de naissance',
        description: 'Pages justifiant du lien de filiation et du nombre d’enfants à charge dans le foyer.',
        mandatory: false,
        format: 'Photo nette de la page de l’élève et des parents',
        tipAntiRejet: 'Obligatoire uniquement en cas de première demande ou de situation familiale recomposée.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Connexion sur EduConnect / Scolarité Services',
        objective: 'Accéder à l’espace parent officiel de l’Éducation Nationale.',
        actions: [
          'Rendez-vous sur https://educonnect.education.gouv.fr',
          'Connectez-vous via FranceConnect (conseillé) ou avec vos identifiants EduConnect fournis par l’établissement scolaire.',
          'Sélectionnez le menu "Bourse de collège" ou "Bourse de lycée".'
        ],
        antiTrapAlert: 'Si vous avez plusieurs enfants au collège ou lycée, une demande distincte doit être validée pour chaque enfant.',
        checklist: [
          'Compte parent EduConnect opérationnel',
          'Enfant scolarisé bien sélectionné dans la liste'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Récupération automatique des données fiscales',
        objective: 'Autoriser la récupération automatique des revenus auprès de la DGFIP.',
        actions: [
          'Saisissez votre numéro fiscal (13 chiffres) et votre numéro d’accès en ligne ou référence d’avis.',
          'Le système calcule immédiatement votre éligibilité et affiche le montant estimé de la bourse par trimestre.',
          'Vérifiez la concordance du nombre d’enfants mineurs ou majeurs célibataires à charge.'
        ],
        antiTrapAlert: 'En cas de changement de situation récent (séparation, chômage prolongé), vous pouvez demander une prise en compte des revenus actuels.',
        checklist: [
          'Numéro fiscal 13 chiffres saisi',
          'Barème d’échelon calculé et vérifié'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Renseignement du RIB & Validation',
        objective: 'Enregistrer le compte bancaire de versement des échéances trimestrielles.',
        actions: [
          'Téléversez ou saisissez l’IBAN du compte bancaire pour le versement des 3 trimestres.',
          'Cochez l’attestation sur l’honneur de prise en charge de l’enfant.',
          'Vérifiez l’adresse postale du domicile.'
        ],
        antiTrapAlert: 'N’utilisez pas le compte bancaire de l’enfant mineur, mais bien celui du responsable légal.',
        checklist: [
          'IBAN et BIC vérifiés',
          'Attestation sur l’honneur cochée'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Téléchargement de l’accusé de réception & Notification',
        objective: 'Garantir la date de dépôt avant la clôture de la campagne.',
        actions: [
          'Cliquez sur "Valider la demande" et téléchargez l’accusé de dépôt PDF.',
          'Conservez ce document pour prouver le respect de la date limite en cas de contestation.',
          'L’établissement notifie la décision définitive d’attribution sous 4 semaines.'
        ],
        antiTrapAlert: 'Attention à la date limite annuelle (souvent mi-octobre). Aucune demande rétroactive n’est acceptée après la clôture nationale.',
        checklist: [
          'Accusé de réception téléchargé et sauvegardé',
          'Dossier enregistré avant la date butoir'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Dépôt hors délai après la date de clôture de la campagne nationale',
        solution: 'Faites votre demande dès l’ouverture de rentrée en septembre. Si le délai est dépassé, sollicitez le Fonds Social Collégien auprès de l’assistante sociale du collège.'
      },
      {
        reason: 'Discordance fiscale entre parents séparés avec garde alternée',
        solution: 'La bourse est attribuée au parent qui assume la charge principale. En garde alternée, les deux parents peuvent solliciter un partage 50/50 avec accord écrit.'
      }
    ]
  },
  {
    id: 'renouvellement-cni-passeport-mairie',
    title: 'Renouveler ma Carte d’Identité ou mon Passeport',
    category: 'etat_civil',
    administration: 'ANTS / Mairie équipée d’un dispositif biométrique',
    officialUrl: 'https://passeport.ants.gouv.fr',
    cost: 'CNI : 100% Gratuite (sauf en cas de perte/vol : timbre 25 €) — Passeport adulte : Timbre fiscal 86 €',
    delaiEstime: 'Pré-demande en 10 minutes + RDV en mairie (délai de fabrication de 3 à 8 semaines selon la saison)',
    description: 'Procédure pour pré-remplir votre dossier officiel en ligne, acheter votre timbre fiscal sans surcoût et préparer votre passage en mairie sans attente inutile.',
    franceConnectRecommended: true,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'N’achetez jamais votre timbre fiscal sur des sites tiers qui majorent le prix. Achetez-le sur timbres.impots.gouv.fr ou directement dans la pré-demande ANTS.',
    helplinePhone: '3400 (ANTS) ou service état civil de votre mairie',
    legalBasis: 'Décret n° 2005-1726 et décret n° 2016-1460',
    requiredDocuments: [
      {
        id: 'cni_recap_predemande',
        label: 'Numéro de pré-demande ANTS ou QR Code imprimé',
        description: 'Document PDF généré à la fin de la démarche en ligne comportant le QR code.',
        mandatory: true,
        format: 'QR code sur smartphone ou feuille imprimée',
        tipAntiRejet: 'La mairie scanne le QR code en 3 secondes pour récupérer toutes vos données sans ressaisie.'
      },
      {
        id: 'cni_photo',
        label: 'Photo d’identité certifiée de moins de 6 mois',
        description: 'Photo réalisée chez un photographe professionnel agréé ou photomaton conforme aux normes ISO/IEC 19794-5.',
        mandatory: true,
        format: 'Planche de photos originale non découpée ou code e-photo',
        validityNotice: 'Moins de 6 mois impérativement',
        tipAntiRejet: 'PIÈGE N°1 DE REJET EN MAIRIE : Ne souriez pas, bouche fermée, yeux bien visibles sans reflets de lunettes, oreilles dégagées, fond uni gris clair ou bleu clair (jamais blanc pur).'
      },
      {
        id: 'cni_justif_domicile',
        label: 'Justificatif de domicile de moins de 1 an',
        description: 'Facture d’énergie (électricité, gaz, eau), avis d’impôt sur le revenu ou quittance de loyer institutionnelle.',
        mandatory: true,
        format: 'Document original papier ou facture numérique imprimée',
        validityNotice: 'Moins de 1 an',
        tipAntiRejet: 'Si vous êtes hébergé : attestation d’hébergement signée de l’hébergeant + sa pièce d’identité + son justificatif de domicile.'
      },
      {
        id: 'cni_ancien_titre',
        label: 'Ancien titre (CNI ou Passeport)',
        description: 'À présenter obligatoirement lors du dépôt et lors du retrait du nouveau titre.',
        mandatory: true,
        format: 'Titre physique original',
        tipAntiRejet: 'En cas de perte ou vol : déclaration Cerfa n° 14011*02 remplie en mairie ou récépissé de plainte du commissariat.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Remplir la pré-demande officielle sur l’ANTS',
        objective: 'Créer le dossier administratif numérique officiel sans passer par un intermédiaire privé payant.',
        actions: [
          'Rendez-vous sur https://passeport.ants.gouv.fr et connectez-vous avec FranceConnect.',
          'Choisissez le motif : renouvellement pour expiration, perte, vol ou changement d’adresse/état civil.',
          'Renseignez votre filiation complète (noms, prénoms, dates et lieux de naissance exacts de vos parents).'
        ],
        antiTrapAlert: 'Vérifiez scrupuleusement l’orthographe exacte des prénoms des parents selon votre livret de famille.',
        checklist: [
          'Connexion FranceConnect validée',
          'Filiation parentale renseignée avec précision',
          'Motif exact sélectionné'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Achat du timbre fiscal dématérialisé (si applicable)',
        objective: 'Régler le montant légal du timbre fiscal directement dans la démarche.',
        actions: [
          'Pour un passeport adulte : 86 € (42 € pour 15-17 ans, 17 € pour moins de 15 ans).',
          'Pour une CNI : 0 € (gratuit) si vous restituez l’ancienne carte, 25 € uniquement en cas de perte ou vol.',
          'Réglez par carte bancaire : le numéro de timbre à 16 chiffres est associé automatiquement à votre dossier.'
        ],
        antiTrapAlert: 'N’achetez jamais de timbre sur un site web non officiel.',
        checklist: [
          'Timbre fiscal associé ou gratuité confirmée',
          'Numéro de pré-demande généré'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Prise de rendez-vous en mairie & Réunion des originaux',
        objective: 'Prendre rendez-vous dans n’importe quelle mairie équipée de France avec le moteur national de rendez-vous.',
        actions: [
          'Utilisez le moteur de recherche national https://rendezvouspasseport.ants.gouv.fr pour trouver un créneau rapide dans un rayon de 20 km.',
          'Imprimez le récapitulatif de pré-demande avec le QR Code.',
          'Faites faire des photos d’identité conformes de moins de 6 mois sans les découper vous-même.',
          'Rassemblez l’original du justificatif de domicile et l’ancien titre.'
        ],
        antiTrapAlert: 'Vous pouvez vous rendre dans N’IMPORTE QUELLE mairie de France équipée d’une station biométrique, pas seulement celle de votre domicile !',
        checklist: [
          'Rendez-vous pris en mairie avec créneau confirmé',
          'Planche de photos conforme non découpée prête',
          'Justificatif de domicile imprimé'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Dépôt des empreintes en mairie & Retrait sur SMS',
        objective: 'Finaliser le recueil biométrique et récupérer le titre sécurisé.',
        actions: [
          'Présentez-vous au rendez-vous en mairie avec vos originaux : l’agent scanne vos empreintes digitales.',
          'Un récépissé de demande avec numéro de suivi de production vous est remis.',
          'Vous recevez un SMS dès que le titre est prêt en mairie.',
          'Présentez-vous pour le retrait sous un délai maximal de 3 mois (passé 3 mois, le titre est détruit).'
        ],
        antiTrapAlert: 'N’oubliez pas d’apporter votre ancien titre pour le retrait : il sera perforé ou restitué.',
        checklist: [
          'Prise d’empreintes effectuée en mairie',
          'Récépissé de dépôt conservé',
          'Retrait effectué sous 3 mois maximum après réception du SMS'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Photo d’identité non conforme (trop ancienne, sourire, reflets, ombre)',
        solution: 'Utilisez un photomaton agréé ANTS "e-photo" ou rendez-vous chez un photographe de quartier professionnel.'
      },
      {
        reason: 'Filiation erronée dans la pré-demande par rapport aux registres d’état civil',
        solution: 'Consultez votre acte de naissance ou livret de famille pour vérifier les deuxièmes et troisièmes prénoms des parents.'
      }
    ]
  },
  {
    id: 'declaration-trimestrielle-caf-rsa-prime',
    title: 'Déclaration trimestrielle CAF (RSA & Prime d’Activité)',
    category: 'fiscalite_social',
    administration: 'CAF (Caisse d’Allocations Familiales) ou MSA',
    officialUrl: 'https://www.caf.fr',
    cost: '100% Gratuit — Obligation légale pour maintenir le versement de vos droits',
    delaiEstime: 'Saisie en 5 minutes en ligne — Droit recalculé pour les 3 mois suivants',
    description: 'Guide officiel pour déclarer fidèlement vos ressources trimestrielles sans erreur sur le "Montant Net Social" afin d’éviter un trop-perçu ou une suspension de versement.',
    franceConnectRecommended: true,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'La CAF ne demande JAMAIS vos coordonnées de carte bancaire par SMS ou email. Ne répondez à aucun message vous demandant un paiement.',
    helplinePhone: '3230 (Prix d’un appel local, service officiel CAF)',
    legalBasis: 'Articles L. 842-1 et suivants du Code de la sécurité sociale',
    requiredDocuments: [
      {
        id: 'caf_bulletins',
        label: 'Bulletins de salaire des 3 derniers mois civils',
        description: 'Fiches de paie des 3 mois demandés (ex: janvier, février, mars pour la déclaration d’avril).',
        mandatory: true,
        format: 'Documents papier ou PDF',
        tipAntiRejet: 'NOUVEAUTÉ LÉGALE : Déclarez désormais UNIQUEMENT le "Montant Net Social" qui figure obligatoirement sur votre bulletin de salaire, et non plus le net à payer avant impôt.'
      },
      {
        id: 'caf_chomage',
        label: 'Attestations de paiement France Travail (Pôle Emploi)',
        description: 'Relevés mensuels des allocations chômage ARE perçues.',
        mandatory: false,
        format: 'PDF espace France Travail',
        tipAntiRejet: 'Déclarez les montants nets perçus sur le compte bancaire au cours du mois.'
      },
      {
        id: 'caf_indemnites',
        label: 'Relevés d’indemnités journalières CPAM (maladie/maternité)',
        description: 'Relevés de prestations Ameli si vous avez eu un arrêt maladie dans le trimestre.',
        mandatory: false,
        format: 'PDF espace Ameli',
        tipAntiRejet: 'À déclarer dans la case spécifique "Indemnités journalières" et non en salaire.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Connexion à l’Espace Mon Compte CAF',
        objective: 'Se connecter à l’espace personnel dès la réception de l’alerte de déclaration.',
        actions: [
          'Connectez-vous sur caf.fr ou sur l’application mobile CAF - Mon Compte.',
          'Authentifiez-vous avec votre numéro de Sécurité sociale et mot de passe, ou via FranceConnect.',
          'Cliquez sur l’alerte "Déclaration trimestrielle de ressources" qui clignote en haut de votre tableau de bord.'
        ],
        antiTrapAlert: 'Ne tardez pas : si la déclaration n’est pas faite avant le 25 du mois, vos versements du 5 du mois suivant sont bloqués automatiquement.',
        checklist: [
          'Connexion réussie sur Mon Compte CAF',
          'Notification de déclaration trimestrielle ouverte'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Vérification de la composition du foyer',
        objective: 'Confirmer ou modifier les changements de situation familiale.',
        actions: [
          'Vérifiez la liste des personnes vivant sous votre toit.',
          'Signalez tout changement immédiat : départ ou arrivée d’un conjoint, reprise d’études d’un enfant, départ du domicile.',
          'Une situation familiale à jour est la garantie d’éviter tout indu ou dette envers la CAF.'
        ],
        antiTrapAlert: 'Une colocation non déclarée en couple peut être requalifiée en concubinage avec recalcul rétroactif sur 2 ans.',
        checklist: [
          'Situation de couple confirmée ou modifiée',
          'Situation des enfants confirmée'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Saisie des revenus mois par mois (Montant Net Social)',
        objective: 'Reporter scrupuleusement les montants exacts pour chaque mois du trimestre.',
        actions: [
          'Prenez vos fiches de paie pour les 3 mois concernés.',
          'Repérez la ligne "Montant Net Social" (encadrée légalement depuis 2024).',
          'Saisissez ce montant exact pour chaque mois (arrondi à l’euro le plus proche).',
          'Si vous n’avez eu aucun revenu un mois donné, cochez la case "0 €" (ne laissez pas le champ vide).'
        ],
        antiTrapAlert: 'Erreur fréquente : Ne déduisez pas vous-même les heures supplémentaires exonérées ou les titres-restaurant, le Montant Net Social les a déjà intégrés légalement.',
        checklist: [
          'Ligne Montant Net Social identifiée sur les fiches de paie',
          'Revenus déclarés pour le mois 1, 2 et 3',
          'Autres revenus (pension alimentaire, arrêt maladie) indiqués'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Validation finale & Téléchargement du récapitulatif',
        objective: 'Enregistrer la déclaration et conserver la preuve horodatée de transmission.',
        actions: [
          'Relisez l’écran récapitulatif avec attention.',
          'Cochez la case certifiant sur l’honneur l’exactitude des déclarations.',
          'Cliquez sur "Valider" et téléchargez immédiatement le PDF de récapitulatif avec l’accusé de réception horodaté.',
          'Le nouveau montant mensuel de vos droits s’affiche pour les 3 mois à venir.'
        ],
        antiTrapAlert: 'Conservez le PDF de récapitulatif : en cas de litige informatique avec la CAF, c’est votre preuve juridique absolue.',
        checklist: [
          'Déclaration validée avec succès',
          'PDF récapitulatif téléchargé et archivé',
          'Nouveau montant mensuel noté'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Confusion entre "Net à payer" et "Montant Net Social"',
        solution: 'Depuis le 1er janvier 2024, seule la ligne "Montant Net Social" doit être reportée. Son calcul est standardisé par la loi.'
      },
      {
        reason: 'Oubli de déclarer une pension alimentaire perçue ou versée',
        solution: 'Les pensions alimentaires perçues pour les enfants sont des ressources à déclarer impérativement dans la case dédiée.'
      }
    ]
  },
  {
    id: 'changement-adresse-coordonne-etat',
    title: 'Changer d’adresse auprès de tous les services publics en 1 fois',
    category: 'logement',
    administration: 'Service-Public.fr (Guichet unique interministériel)',
    officialUrl: 'https://www.service-public.fr/particuliers/vosdroits/R11193',
    cost: '100% Gratuit — Service officiel de l’État français',
    delaiEstime: '10 minutes pour déclarer — Prise en compte sous 2 à 15 jours selon les organismes',
    description: 'Téléservice unique gratuit permettant d’informer simultanément : Carte grise (SIV), CAF, CPAM, Impôts (DGFIP), France Travail, Caisses de retraite (CNAV, Agirc-Arrco), EDF, Engie.',
    franceConnectRecommended: true,
    isOfficialServiceFree: true,
    warningAntiArnaque: 'Ne payez jamais 20 € ou 30 € sur des sites privés pour déclarer un changement d’adresse. Le service d’État sur Service-Public.fr est entièrement gratuit.',
    helplinePhone: '3939 (Allô Service Public, appel non surtaxé)',
    legalBasis: 'Décret n° 2004-1299 relatif au développement de l’administration électronique',
    requiredDocuments: [
      {
        id: 'ad_nouvelle_adresse',
        label: 'Nouvelle adresse complète et date d’emménagement',
        description: 'Numéro, rue, bâtiment, étage, code postal, commune.',
        mandatory: true,
        format: 'Saisie directe',
        tipAntiRejet: 'Indiquez le nom figurant sur la boîte aux lettres si différent du vôtre.'
      },
      {
        id: 'ad_num_secu',
        label: 'Numéro de Sécurité sociale des membres du foyer',
        description: 'Pour synchroniser immédiatement la CPAM et la CAF.',
        mandatory: true,
        format: '15 chiffres de la carte Vitale',
        tipAntiRejet: 'Permet d’éviter toute rupture de remboursement de soins de santé.'
      },
      {
        id: 'ad_carte_grise',
        label: 'Numéro d’immatriculation de vos véhicules',
        description: 'Pour recevoir l’étiquette autocollante officielle gratuite à coller sur votre carte grise.',
        mandatory: false,
        format: 'Numéro de plaque (ex: AB-123-CD)',
        tipAntiRejet: 'Loi obligatoire : vous avez 1 mois pour actualiser l’adresse de votre carte grise sous peine d’amende forfaitaire de 135 €.'
      }
    ],
    fourStepsRoadmap: [
      {
        stepNumber: 1,
        title: 'Étape 1 : Accès au téléservice officiel sur Service-Public.fr',
        objective: 'Ouvrir le portail interministériel unique sécurisé par FranceConnect.',
        actions: [
          'Rendez-vous sur https://www.service-public.fr/particuliers/vosdroits/R11193',
          'Connectez-vous via FranceConnect pour pré-remplir automatiquement votre identité.',
          'Sélectionnez la date officielle de votre changement de domicile (peut être passée ou future jusqu’à 3 mois).'
        ],
        antiTrapAlert: 'Vérifiez bien que vous êtes sur le domaine officiel .service-public.fr et non un site commercial trompeur.',
        checklist: [
          'Connexion sur Service-Public.fr validée',
          'Date d’emménagement fixée'
        ]
      },
      {
        stepNumber: 2,
        title: 'Étape 2 : Sélection des organismes publics à notifier',
        objective: 'Cocher en un clic l’ensemble des administrations concernées.',
        actions: [
          'Cochez les organismes souhaités : Sécurité sociale (CPAM), CAF/MSA, DGFIP (Impôts), France Travail, Système d’Immatriculation des Véhicules (ANTS / Carte grise), Caisses de retraite.',
          'Vous pouvez également cocher les énergéticiens partenaires (EDF, Engie) si vous le désirez.',
          'Renseignez vos identifiants spécifiques si demandés (ex: numéro allocataire CAF, numéro fiscal 13 chiffres).'
        ],
        antiTrapAlert: 'N’oubliez pas de cocher la case "Système d’Immatriculation des Véhicules" si vous possédez une voiture ou moto : l’étiquette d’adresse est gratuite.',
        checklist: [
          'CPAM et CAF cochées',
          'Impôts (DGFIP) cochés',
          'Carte grise SIV cochée'
        ]
      },
      {
        stepNumber: 3,
        title: 'Étape 3 : Saisie de la nouvelle adresse & Composition du foyer',
        objective: 'Renseigner la nouvelle adresse avec les compléments nécessaires au facteur.',
        actions: [
          'Indiquez le numéro de voie et le nom de la rue (sélectionnez dans la liste normalisée BAN).',
          'Remplissez les compléments : Bâtiment, Escalier, Numéro d’appartement, Boîte aux lettres.',
          'Listez les personnes qui emménagent avec vous (conjoint, enfants).'
        ],
        antiTrapAlert: 'Une adresse mal normalisée peut faire échouer la transmission informatique vers les impôts ou la CPAM.',
        checklist: [
          'Adresse normalisée BAN sélectionnée',
          'Complément de boîte aux lettres précisé',
          'Personnes du foyer associées'
        ]
      },
      {
        stepNumber: 4,
        title: 'Étape 4 : Envoi groupé & Réception de l’autocollant carte grise',
        objective: 'Valider la transmission et surveiller les confirmations de chaque organisme.',
        actions: [
          'Validez l’envoi : un récapitulatif PDF avec numéro de dossier unique vous est fourni.',
          'Chaque organisme traite la modification sous quelques jours ouvrés.',
          'Pour votre véhicule : vous recevrez sous 5 à 7 jours par la poste une étiquette autocollante sécurisée à coller en case C.3 de votre carte grise.',
          'Vérifiez la mise à jour effective sur votre compte impots.gouv.fr et ameli.fr le mois suivant.'
        ],
        antiTrapAlert: 'L’étiquette carte grise doit impérativement être collée à l’emplacement prévu sans masquer les autres mentions du titre.',
        checklist: [
          'Confirmation d’envoi téléchargée',
          'Étiquette carte grise reçue et collée sur le titre',
          'Espaces Ameli et Impôts vérifiés'
        ]
      }
    ],
    commonRejectionReasons: [
      {
        reason: 'Numéro de plaque d’immatriculation au format ancien non pris en charge (ex: 1234 AB 75)',
        solution: 'Si votre véhicule a encore une ancienne immatriculation FNI, la démarche enclenche automatiquement la conversion gratuite vers le nouveau système SIV (AA-123-AA).'
      },
      {
        reason: 'Nom de famille sur la boîte aux lettres différent du titulaire du dossier',
        solution: 'Indiquez impérativement la mention "Chez M. ou Mme X" dans le champ complément d’adresse pour que le facteur puisse distribuer l’étiquette de carte grise.'
      }
    ]
  }
];
