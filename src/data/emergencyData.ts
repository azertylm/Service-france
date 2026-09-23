export interface EmergencyNumber {
  id: string;
  number: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  category: 'vital' | 'protection' | 'prevention' | 'social';
  isSms?: boolean;
  smsNumber?: string;
  iconName: string;
  colorClass: string;
  hours: string;
  isDiscreet?: boolean; // ex: 3919 does not show on phone bill
  whenToCall: string[];
  whatToSay: string[];
}

export interface FirstAidTopic {
  id: string;
  title: string;
  subtitle: string;
  emergencyNumber: string;
  urgencyLevel: 'vitale' | 'urgente' | 'conseil';
  steps: {
    order: number;
    title: string;
    instructions: string[];
    warning?: string;
  }[];
  mistakesToAvoid: string[];
  keywords: string[];
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  {
    id: '114',
    number: '114',
    name: 'Balise 114 — Urgence par SMS & Appel silencieux',
    shortDesc: 'Pour les personnes sourdes, malentendantes, aphasiques ou en danger silencieux (agression, séquestration).',
    fullDesc: 'Numéro national d\'urgence unique accessible par SMS ou visioconférence. Traité 24h/24 par des opérateurs formés qui alertent directement le SAMU, les pompiers ou la police.',
    badge: 'SMS & Silencieux',
    category: 'vital',
    isSms: true,
    smsNumber: '114',
    iconName: 'MessageSquareWarning',
    colorClass: 'bg-rose-600 text-white border-rose-700',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Impossible de parler à voix haute sans se mettre en danger immédiat (cambriolage, violences conjugales en cours, prise d\'otage)',
      'Personne sourde, malentendante, aphasique ou dans l\'incapacité physique d\'émettre un son',
      'Environnement très bruyant ou réseau voix défaillant mais SMS fonctionnel'
    ],
    whatToSay: [
      '1. Lieu exact : Ville, adresse complète, étage, code porte ou coordonnées GPS',
      '2. Qui a besoin d\'aide : Âge, nombre de victimes, état apparent',
      '3. Nature de l\'urgence : Médicale, incendie, agression physique en cours'
    ]
  },
  {
    id: '15',
    number: '15',
    name: '15 — SAMU (Urgence Médicale Vitale)',
    shortDesc: 'Détresse vitale, malaise cardiaque, AVC, inconscience, accident grave.',
    fullDesc: 'Service d\'Aide Médicale Urgente. Met en relation directe avec un médecin régulateur qui évalue la gravité, conseille les gestes de secours et envoie les équipes médicales (SMUR / ambulance).',
    badge: 'Urgence Vitale',
    category: 'vital',
    iconName: 'HeartPulse',
    colorClass: 'bg-red-600 text-white border-red-700',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Douleur aiguë et persistante dans la poitrine irradiant vers le bras ou la mâchoire',
      'Suspicion d\'AVC : visage paralysé, faiblesse d\'un membre, trouble soudain de l\'élocution',
      'Perte de connaissance soudaine, arrêt respiratoire, coma',
      'Hémorragie importante et incontrôlable, étouffement'
    ],
    whatToSay: [
      'Ne pas raccrocher en premier : attendez les instructions du médecin',
      'Indiquez clairement le lieu, l\'état de conscience et la respiration',
      'Mentionnez les antécédents médicaux et traitements connus'
    ]
  },
  {
    id: '17',
    number: '17',
    name: '17 — Police Secours & Gendarmerie',
    shortDesc: 'Danger immédiat pour les personnes ou les biens, agression, vol en cours.',
    fullDesc: 'Permet d\'obtenir l\'intervention immédiate d\'une patrouille de Police Nationale ou de la Gendarmerie en cas d\'infraction, de trouble grave à l\'ordre public ou de péril.',
    badge: 'Sécurité & Secours',
    category: 'vital',
    iconName: 'ShieldAlert',
    colorClass: 'bg-blue-700 text-white border-blue-800',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Agression physique, vol à main armée ou tentative de cambriolage en flagrant délit',
      'Violences physiques ou verbales graves menaçant l\'intégrité d\'une personne',
      'Accident de la circulation avec blessés ou délit de fuite',
      'Disparition inquiétante d\'un mineur ou d\'une personne vulnérable'
    ],
    whatToSay: [
      'Votre localisation exacte et point de repère visible',
      'Description précise des suspects (vêtements, signes distinctifs, véhicule, direction de fuite)',
      'Présence d\'armes visibles ou de personnes blessées'
    ]
  },
  {
    id: '18',
    number: '18',
    name: '18 — Sapeurs-Pompiers',
    shortDesc: 'Incendie, accident de la route, fuite de gaz, noyade, secours d\'urgence aux personnes.',
    fullDesc: 'Corps d\'intervention rapide pour les feux, les effondrements, les inondations, les secours en milieu périlleux et les premiers secours d\'urgence.',
    badge: 'Incendie & Sauvetage',
    category: 'vital',
    iconName: 'Flame',
    colorClass: 'bg-amber-600 text-white border-amber-700',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Départ de feu, fumée suspecte, odeur forte de gaz ou de produit toxique',
      'Accident de la route avec personnes incarcérées ou blessées',
      'Noyade, sauvetage nautique, personne coincée en hauteur ou dans un puits',
      'Inondation majeure menaçant une habitation'
    ],
    whatToSay: [
      'Nature du sinistre (feu d\'appartement, fuite de gaz, carambolage)',
      'Y a-t-il des personnes prises au piège ou intoxiquées ?',
      'Préciser l\'accès pour les engins de pompiers (code portail, hauteur sous pont)'
    ]
  },
  {
    id: '112',
    number: '112',
    name: '112 — Numéro d\'Urgence Européen',
    shortDesc: 'Valable dans toute l\'Union Européenne, fonctionne sans carte SIM et sur tout réseau disponible.',
    fullDesc: 'Numéro d\'urgence universel européen. Recommandé aux voyageurs, aux frontaliers et utilisable même avec un téléphone bloqué ou sans solde de forfait.',
    badge: 'Universel UE',
    category: 'vital',
    iconName: 'Globe2',
    colorClass: 'bg-indigo-700 text-white border-indigo-800',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Voyage dans n\'importe quel pays de l\'Union Européenne',
      'Téléphone sans réseau de votre opérateur principal (le 112 bascule sur n\'importe quel relais disponible)',
      'Étranger présent en France nécessitant une prise en charge multilingue'
    ],
    whatToSay: [
      'Les opérateurs du 112 sont formés pour répondre dans les principales langues européennes',
      'Indiquez le pays et la ville d\'appel dès le début'
    ]
  },
  {
    id: '3919',
    number: '3919',
    name: '3919 — Violences Femmes Info',
    shortDesc: 'Numéro d\'écoute national pour les femmes victimes de violences conjugales, sexistes ou sexuelles.',
    fullDesc: 'Ligne d\'écoute, de soutien, d\'information et d\'orientation gérée par la Fédération Nationale Solidarité Femmes. Totalement anonyme, gratuit, et invisible sur les factures téléphoniques.',
    badge: 'Invisible sur Facture',
    category: 'protection',
    iconName: 'HeartHandshake',
    colorClass: 'bg-purple-700 text-white border-purple-800',
    hours: '24h/24 · 7j/7 · Anonyme & Gratuit',
    isDiscreet: true,
    whenToCall: [
      'Victime de violences physiques, psychologiques, verbales, économiques ou sexuelles au sein du couple ou de la famille',
      'Témoin ou proche inquiet pour une personne de son entourage',
      'Besoin d\'un hébergement d\'urgence sécurisé ou de conseils juridiques pour quitter le domicile conjugal'
    ],
    whatToSay: [
      'L\'appel est strictement anonyme. Vous parlez à votre rythme sans jugement.',
      'Si vous êtes en danger immédiat imminent, composez le 17 ou envoyez un SMS au 114.'
    ]
  },
  {
    id: '119',
    number: '119',
    name: '119 — Enfance en Danger',
    shortDesc: 'Alerte pour tout enfant maltraité, négligé ou en risque de danger immédiat.',
    fullDesc: 'Service National d\'Accueil Téléphonique pour l\'Enfance en Danger (SNATED). Destiné aux mineurs en détresse et aux adultes confrontés à une situation d\'enfant maltraité (violences physiques, psychologiques, abus sexuels).',
    badge: 'Protection Mineurs',
    category: 'protection',
    iconName: 'Baby',
    colorClass: 'bg-emerald-700 text-white border-emerald-800',
    hours: '24h/24 · 7j/7 · Gratuit & Invisible sur facture',
    isDiscreet: true,
    whenToCall: [
      'Mineur témoin ou victime de coups, de violences morales, de délaissement ou de violences sexuelles',
      'Voisin, proche ou enseignant alerté par des hématomes répétés, des cris constants ou un repli anormal',
      'Problématique de conflit parental aigu mettant en péril l\'équilibre d\'un enfant'
    ],
    whatToSay: [
      'Identité de l\'enfant ou lieu où il peut être localisé (école, domicile)',
      'Faits observés précis (dates, comportements, blessures constatées)'
    ]
  },
  {
    id: '3018',
    number: '3018',
    name: '3018 — Cyberharcèlement & Violences Numériques',
    shortDesc: 'Aide aux jeunes victimes de harcèlement en ligne, revenge porn, chantage ou piratage.',
    fullDesc: 'Ligne nationale d\'aide pour les jeunes, les parents et les professionnels. Équipe agréée par les plateformes (TikTok, Instagram, Snapchat) pour demander la suppression rapide de comptes et contenus diffamatoires ou intimes.',
    badge: 'Harcèlement Numérique',
    category: 'protection',
    iconName: 'SmartphoneNfc',
    colorClass: 'bg-cyan-700 text-white border-cyan-800',
    hours: '7j/7 · 9h à 23h · Gratuit & Confidentiel',
    whenToCall: [
      'Diffusion non consentie de photos ou vidéos intimes (revenge porn)',
      'Harcèlement répété sur les réseaux sociaux, insultes collectives, lynchage en ligne',
      'Usurpation d\'identité, chantage à la webcam, doxxing'
    ],
    whatToSay: [
      'Conservez impérativement des captures d\'écran de tous les messages et profils incriminés',
      'Les équipes du 3018 peuvent déclencher une procédure prioritaire de retrait auprès des réseaux sociaux'
    ]
  },
  {
    id: '3114',
    number: '3114',
    name: '3114 — Prévention du Suicide',
    shortDesc: 'Écoute professionnelle pour toute personne en détresse psychique ou idées noires.',
    fullDesc: 'Numéro national de prévention du suicide. Équipe de professionnels de santé mentale (infirmiers et psychologues hospitaliers) formée à l\'intervention de crise.',
    badge: 'Santé Mentale',
    category: 'prevention',
    iconName: 'LifeBuoy',
    colorClass: 'bg-teal-700 text-white border-teal-800',
    hours: '24h/24 · 7j/7 · Gratuit & Confidentiel',
    whenToCall: [
      'Idées noires récurrentes, souffrance morale intense, désespoir, envie d\'en finir',
      'Inquiétude pour un proche dont le comportement change ou qui évoque le suicide',
      'Professionnel confronté à une situation de crise suicidaire'
    ],
    whatToSay: [
      'Vous pouvez vous exprimer librement sans tabou.',
      'L\'équipe évalue le niveau de souffrance et vous oriente avec bienveillance.'
    ]
  },
  {
    id: '196',
    number: '196',
    name: '196 — Secours en Mer (CROSS)',
    shortDesc: 'Urgence maritime, personne tombée à la mer, baigneur ou embarcation en détresse.',
    fullDesc: 'Numéro d\'urgence pour joindre directement le Centre Régional Opérationnel de Surveillance et de Sauvetage (CROSS) depuis un téléphone portable du littoral.',
    badge: 'Mer & Littoral',
    category: 'vital',
    iconName: 'Anchor',
    colorClass: 'bg-sky-700 text-white border-sky-800',
    hours: '24h/24 · 7j/7 · Gratuit',
    whenToCall: [
      'Personne en difficulté de nage ou disparue dans l\'eau',
      'Bateau à la dérive, avarie de moteur par vent de terre, kitesurf ou paddle en détresse',
      'Fusée de détresse aperçue en mer'
    ],
    whatToSay: [
      'Point de repère sur la plage ou coordonnées GPS',
      'Couleur de l\'embarcation, de la voile ou des vêtements du nageur'
    ]
  },
  {
    id: '115',
    number: '115',
    name: '115 — SAMU Social (Hébergement d\'Urgence)',
    shortDesc: 'Personnes sans abri ou en grande précarité sans solution d\'hébergement pour la nuit.',
    fullDesc: 'Géré par les préfectures et associations locales, le 115 évalue la détresse sociale et oriente vers des places d\'hébergement d\'urgence ou des maraudes.',
    badge: 'Social & Précarité',
    category: 'social',
    iconName: 'Home',
    colorClass: 'bg-stone-700 text-white border-stone-800',
    hours: '24h/24 · Gratuit',
    whenToCall: [
      'Personne ou famille avec enfants à la rue sans toit pour la nuit',
      'Grand froid ou canicule mettant en péril une personne sans abri aperçue sur la voie publique'
    ],
    whatToSay: [
      'Localisation exacte de la personne',
      'Présence d\'enfants en bas âge, femmes enceintes ou problèmes de santé apparents'
    ]
  }
];

export const FIRST_AID_PROTOCOLS: FirstAidTopic[] = [
  {
    id: 'arret_cardiaque',
    title: 'Arrêt Cardio-Respiratoire (Massez, Défibrillez !)',
    subtitle: 'La victime est inconsciente et ne respire pas (ou respiration anormale "gasp"). Chaque minute perdue réduit les chances de survie de 10%.',
    emergencyNumber: '15 ou 112',
    urgencyLevel: 'vitale',
    keywords: ['massage cardiaque', 'coeur', 'inconscient', 'défibrillateur', 'dae', 'respiration', 'pouls'],
    steps: [
      {
        order: 1,
        title: 'Vérifier la conscience et la respiration (10 secondes max)',
        instructions: [
          'Prenez-lui la main, serrez-la fort : « Vous m\'entendez ? Ouvrez les yeux ! »',
          'Basculez délicatement la tête en arrière en soulevant le menton pour ouvrir les voies aériennes.',
          'Penchez votre joue au-dessus de sa bouche : observez si la poitrine se soulève et écoutez le souffle d\'air pendant 10 secondes.',
          'Si la personne ne réagit pas et ne respire pas (ou pousse des râles espacés "gasps") : elle est en arrêt cardiaque.'
        ],
        warning: 'Ne perdez pas de temps à chercher un pouls si vous n\'êtes pas médecin ! L\'absence de réaction + absence de respiration normale = DÉCLENCHEZ LE MASSAGE IMMÉDIATEMENT.'
      },
      {
        order: 2,
        title: 'Faire alerter les secours (15 ou 112) et réclamer un DAE',
        instructions: [
          'Désignez une personne précise : « Vous avec la veste rouge, appelez le 15, mettez le haut-parleur et trouvez un défibrillateur (DAE) ! »',
          'Si vous êtes seul : appelez le 15, mettez le haut-parleur sur votre téléphone et commencez à masser sans attendre.'
        ]
      },
      {
        order: 3,
        title: 'Masser au centre de la poitrine (100 à 120 compressions / minute)',
        instructions: [
          'Allongez la victime sur le dos, impérativement sur un sol dur (pas sur un matelas). Dénudez sa poitrine.',
          'Placez le talon d\'une main au centre exact du thorax (sur la moitié inférieure du sternum). Placez l\'autre main par-dessus en entrecroisant les doigts.',
          'Bras tendus, épaules bien à la verticale au-dessus de la poitrine : appuyez de tout votre poids.',
          'Enfoncez le sternum de 5 à 6 cm, puis relâchez complètement la pression sans décoller vos mains.',
          'Rythme régulier : 100 à 120 compressions par minute (tempo de la chanson "Stayin\' Alive" des Bee Gees).'
        ],
        warning: 'N\'interrompez jamais le massage plus de 5 secondes, sauf pour allumer le défibrillateur.'
      },
      {
        order: 4,
        title: 'Défibrillateur (DAE) : Poser les électrodes dès son arrivée',
        instructions: [
          'Allumez le défibrillateur (bouton vert ou ouverture du capot). L\'appareil parle à voix haute.',
          'Collez les 2 électrodes autocollantes sur la peau nue et sèche de la poitrine, en suivant exactement les dessins gravés dessus (une sous la clavicule droite, une sur le flanc gauche sous l\'aisselle).',
          'Écoutez attentivement la voix : « Analyse du rythme en cours, NE PAS TOUCHER LA VICTIME » -> écartez tout le monde.',
          'Si l\'appareil annonce « Choc recommandé » : assurez-vous que personne ne touche le corps et appuyez sur le bouton de choc clignotant.',
          'Reprenez immédiatement le massage cardiaque dès que le choc a été délivré.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne pas masser sur un lit ou un canapé mou (la force est absorbée sans comprimer le cœur).',
      'Ne pas s\'arrêter sous prétexte d\'avoir entendu un craquement de côte : c\'est fréquent et secondaire, continuez de masser.',
      'Ne pas retirer les électrodes du DAE même si la victime recommence à bouger.'
    ]
  },
  {
    id: 'etouffement',
    title: 'Étouffement Total (Obstruction des Voies Aériennes)',
    subtitle: 'La victime porte les mains à sa gorge, a la bouche ouverte, ne peut plus parler, ni tousser, ni émettre le moindre son. Elle commence à bleuir.',
    emergencyNumber: '15 ou 18',
    urgencyLevel: 'vitale',
    keywords: ['étouffement', 'fausse route', 'heimlich', 'claques dos', 'corps étranger', 'respiration'],
    steps: [
      {
        order: 1,
        title: 'Vérifier s\'il s\'agit d\'un étouffement total ou partiel',
        instructions: [
          'Posez la question : « Est-ce que tu t\'étouffes ? »',
          'Si la personne peut parler, tousser ou émettre un bruit : C\'EST UNE OBSTRUCTION PARTIELLE. Ne tapez pas dans le dos ! Encouragez-la simplement à tousser vigoureusement en restant à ses côtés.',
          'Si la personne ne peut émettre AUCUN son, hoche la tête avec angoisse et ne respire plus : C\'EST UNE OBSTRUCTION TOTALE. Agissez immédiatement !'
        ]
      },
      {
        order: 2,
        title: 'Donner 1 à 5 claques vigoureuses entre les omoplates',
        instructions: [
          'Placez-vous sur le côté et légèrement en arrière de la victime.',
          'Soutenez son thorax avec une main et penchez-la bien en avant pour que l\'objet expulsé sorte de la bouche au lieu de retomber.',
          'Avec le plat de l\'autre main, donnez une claque sèche et vigoureuse entre les deux omoplates.',
          'Après chaque claque, vérifiez si le corps étranger a été expulsé. Arrêtez dès que la personne recommence à respirer ou tousser (maximum 5 claques).'
        ]
      },
      {
        order: 3,
        title: 'Si échec : Réaliser 1 à 5 compressions abdominales (Méthode de Heimlich)',
        instructions: [
          'Placez-vous derrière la victime, passez vos bras sous ses aisselles et collez votre corps au sien.',
          'Formez un poing avec une main et placez-le au creux de l\'estomac (entre le nombril et le bas du sternum).',
          'Saisissez votre poing avec l\'autre main.',
          'Enfoncez vigoureusement vers l\'arrière et vers le haut (comme pour soulever la personne).',
          'Répétez jusqu\'à 5 fois. Alternez ensuite : 5 claques dans le dos / 5 compressions de Heimlich jusqu\'à déblocage.'
        ],
        warning: 'Chez la femme enceinte ou la personne obèse : placez vos mains au milieu de la poitrine (comme un massage cardiaque debout).'
      },
      {
        order: 4,
        title: 'Si la victime perd connaissance',
        instructions: [
          'Accompagnez doucement sa chute au sol pour éviter un traumatisme crânien.',
          'Alertez le 15 immédiatement.',
          'Démarrez sans attendre le massage cardiaque (les compressions thoraciques chassent souvent le corps étranger).'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne tapez jamais dans le dos si la personne arrive encore à tousser (risque d\'enfoncer l\'objet).',
      'N\'enfoncez jamais vos doigts à l\'aveugle dans la gorge (risque d\'enfoncer le morceau d\'aliment).'
    ]
  },
  {
    id: 'hemorragie',
    title: 'Hémorragie Externe Grave (Saignement Abondant)',
    subtitle: 'Le sang gicle ou s\'écoule abondamment en nappe continue d\'une plaie. Sans arrêt rapide, le choc hémorragique peut survenir en quelques minutes.',
    emergencyNumber: '15 ou 18',
    urgencyLevel: 'vitale',
    keywords: ['saignement', 'sang', 'garrot', 'plaie', 'hémorragie', 'coupure', 'artère'],
    steps: [
      {
        order: 1,
        title: 'Comprimer la plaie immédiatement et fortement',
        instructions: [
          'Appuyez directement sur l\'endroit précis qui saigne avec la paume de la main ou les doigts protégés par un gant, un sac plastique propre ou un tissu épais.',
          'Maintenez une pression ferme, continue et sans relâcher pendant plusieurs minutes.',
          'Allongez la victime à plat sur le dos pour éviter le choc et faciliter la circulation sanguine vers le cerveau.'
        ]
      },
      {
        order: 2,
        title: 'Faire un pansement compressif si vous devez libérer vos mains',
        instructions: [
          'Appliquez un tissu propre plié en tampon sur la plaie.',
          'Enroulez fermement une bande élastique ou une écharpe autour du membre en serrant assez fort pour stopper le sang sans couper la circulation périphérique.',
          'Si le pansement se gorge de sang, ne le retirez pas : rajoutez une épaisseur par-dessus et continuez à appuyer.'
        ]
      },
      {
        order: 3,
        title: 'Pose d\'un garrot (en cas d\'échec de compression ou membre arraché)',
        instructions: [
          'Le garrot est réservé aux blessures des membres (bras ou cuisse) lorsque la compression directe est impossible (nombreuses victimes, membre écrasé, plaie inaccessible).',
          'Placez un lien large (ceinture, cravate, tissu solide, pas de fil de fer) quelques centimètres au-dessus de la plaie (entre la plaie et le cœur).',
          'Serrez jusqu\'à l\'arrêt complet du saignement.',
          'NOTEZ SUR LE FRONT DE LA VICTIME L\'HEURE EXACTE DE POSE DU GARROT (ex: "G 14h25").'
        ],
        warning: 'Une fois posé, NE DESSERREZ JAMAIS LE GARROT sans ordre exprès d\'un médecin du SAMU.'
      }
    ],
    mistakesToAvoid: [
      'Ne donnez rien à boire ni à manger à la victime (en prévision d\'une intervention chirurgicale d\'urgence).',
      'Ne relâchez pas la pression pour "regarder si ça saigne encore".'
    ]
  },
  {
    id: 'perte_connaissance',
    title: 'Victime Inconsciente qui Respire (Position Latérale de Sécurité - PLS)',
    subtitle: 'La victime ne répond pas, ne bouge pas, mais sa poitrine se soulève régulièrement. Il faut impérativement empêcher sa langue d\'obstruer sa trachée.',
    emergencyNumber: '15 ou 18',
    urgencyLevel: 'urgente',
    keywords: ['pls', 'inconscient', 'coma', 'étourdissement', 'malaise', 'vomissement'],
    steps: [
      {
        order: 1,
        title: 'Libérer les voies aériennes',
        instructions: [
          'Desserrez le col, la cravate et la ceinture de la victime.',
          'Basculez délicatement la tête en arrière en soulevant le menton avec deux doigts pour décoller la langue du fond de la gorge.',
          'Ouvrez sa bouche pour vérifier l\'absence d\'aliments visibles.'
        ]
      },
      {
        order: 2,
        title: 'Tourner la victime en Position Latérale de Sécurité (PLS)',
        instructions: [
          'Placez-vous à genoux sur le côté de la victime.',
          'Bras côté sauveteur : placez-le à angle droit (90°) par rapport au corps, coude plié, paume vers le haut.',
          'Bras opposé : amenez le dos de la main opposée contre la joue de la victime côté sauveteur. Maintenez cette main en place.',
          'Avec votre autre main, attrapez la jambe opposée derrière le genou et remontez-la en pliant le genou (le pied reste au sol).',
          'Tirez délicatement sur le genou pour faire rouler la victime vers vous, d\'un seul bloc sans torsion de la colonne.',
          'Ajustez la jambe du dessus à 90° pour stabiliser le corps. Ouvrez la bouche de la victime tournée vers le sol (pour permettre l\'écoulement des sécrétions ou vomissements).'
        ]
      },
      {
        order: 3,
        title: 'Alerter le 15 et surveiller en continu',
        instructions: [
          'Couvrez la victime avec un manteau ou une couverture de survie pour éviter l\'hypothermie.',
          'Gardez en permanence votre main sur son ventre ou observez son souffle jusqu\'à l\'arrivée des secours.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne laissez jamais une personne inconsciente sur le dos : elle risque de s\'étouffer avec sa propre langue ou ses vomissements.',
      'Ne donnez pas de gifles et n\'aspergez pas d\'eau froide.'
    ]
  },
  {
    id: 'avc',
    title: 'AVC (Accident Vasculaire Cérébral) — Test VITE',
    subtitle: 'Chaque minute compte. 1 million de neurones meurent chaque minute lors d\'une ischémie cérébrale non traitée. Agir dans les 4 premières heures sauve la vie.',
    emergencyNumber: '15 immédiatement',
    urgencyLevel: 'vitale',
    keywords: ['avc', 'cerveau', 'paralysie', 'aphasie', 'élocution', 'bras', 'visage'],
    steps: [
      {
        order: 1,
        title: 'Le test VITE (ou FAST)',
        instructions: [
          'V — VISAGE : Demandez à la personne de sourire ou de montrer les dents. Une moitié du visage ou de la bouche s\'affaisse-t-elle ?',
          'I — INCAPACITÉ : Demandez-lui de lever les deux bras devant elle à l\'horizontale. L\'un des bras retombe-t-il ou reste-t-il immobile ?',
          'T — TROUBLE DE LA PAROLE : Faites-lui répéter une phrase simple (« Le ciel est bleu »). A-t-elle du mal à articuler, à trouver ses mots ou ses propos sont-ils incompréhensibles ?',
          'E — EXIGE D\'APPELER LE 15 : Même si un seul de ces signes est présent, ou même s\'il a disparu spontanément au bout de 5 minutes (AIT) !'
        ]
      },
      {
        order: 2,
        title: 'Relever l\'heure exacte de début des symptômes',
        instructions: [
          'Regardez votre montre et notez l\'heure précise à laquelle les signes sont apparus. C\'est l\'information capitale que demandera le médecin pour décider d\'une thrombolyse.',
          'Allongez la personne confortablement, la tête légèrement surélevée (30°).'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne lui donnez aucun médicament, PAS D\'ASPIRINE (si c\'est un AVC hémorragique, l\'aspirine aggraverait mortellement le saignement).',
      'Ne lui donnez rien à boire ni à manger.',
      'N\'attendez pas le lendemain pour voir si ça passe.'
    ]
  },
  {
    id: 'brulures',
    title: 'Brûlures Thermiques ou Chimiques',
    subtitle: 'Règle impérative des 3x15 : Refroidir immédiatement pour stopper la propagation de la chaleur dans les couches profondes de la peau.',
    emergencyNumber: '15 ou 18',
    urgencyLevel: 'urgente',
    keywords: ['brûlure', 'feu', 'eau chaude', 'chimique', 'peau', 'cloque'],
    steps: [
      {
        order: 1,
        title: 'La règle des 3x15 pour les brûlures thermiques (chaleur)',
        instructions: [
          'Faites couler de l\'eau du robinet tempérée (environ 15°C, jamais d\'eau glacée ni de glaçons).',
          'Faites ruisseler l\'eau à environ 15 cm au-dessus de la brûlure, sans pression directe sur la plaie.',
          'Poursuivez le refroidissement pendant au moins 15 minutes (ou jusqu\'à disparition complète de la sensation de cuisson).'
        ]
      },
      {
        order: 2,
        title: 'Retirer les vêtements non adhérents et protéger',
        instructions: [
          'Retirez immédiatement les bagues, montres et vêtements amples avant que la zone n\'enfle.',
          'Si le tissu a fondu et colle à la peau : NE TIREZ PAS DESSUS, découpez autour.',
          'Après refroidissement, recouvrez la brûlure d\'un linge propre en coton ou d\'un film alimentaire transparent (sans serrer) pour la protéger de l\'air et des microbes.'
        ]
      },
      {
        order: 3,
        title: 'Brûlure chimique (acide, soude, solvants)',
        instructions: [
          'Rincez abondamment à l\'eau courante tiède pendant AU MOINS 20 À 30 MINUTES.',
          'Protégez-vous pour ne pas être contaminé à votre tour.',
          'Conservez le flacon ou le nom du produit chimique pour le transmettre au SAMU ou au centre antipoison.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne percez jamais les cloques (ce sont des pansements naturels anti-infection).',
      'N\'appliquez JAMAIS de beurre, de dentifrice, d\'huile ou de pommade de grand-mère sur une brûlure vive.'
    ]
  },
  {
    id: 'malaise_cardiaque',
    title: 'Malaise Cardiaque (Suspicion d\'Infarctus)',
    subtitle: 'Sensation de serrement écrasant ou d\'étau dans la poitrine qui ne cède pas au repos.',
    emergencyNumber: '15',
    urgencyLevel: 'vitale',
    keywords: ['infarctus', 'douleur poitrine', 'crise cardiaque', 'bras gauche', 'mâchoire'],
    steps: [
      {
        order: 1,
        title: 'Identifier les signes d\'alerte',
        instructions: [
          'Douleur brutale, sensation d\'oppression ou de poids lourd derrière le sternum.',
          'Irradiation fréquente vers le bras gauche, le dos, les épaules ou la mâchoire.',
          'Pâleur, sueurs froides, essoufflement anormal, angoisse de mort imminente.',
          'Chez la femme, les signes sont parfois atypiques : grande fatigue brutale, nausées, douleurs gastriques sans serrement thoracique.'
        ]
      },
      {
        order: 2,
        title: 'Mettre immédiatement au repos absolu',
        instructions: [
          'Asseyez ou demi-asseyez la victime (dos calé contre un mur ou des coussins). Ne l\'allongez pas complètement si elle a du mal à respirer.',
          'Desserrez col, ceinture et vêtements serrés.',
          'Interdisez tout effort physique (ne pas la faire marcher jusqu\'à la voiture).'
        ]
      },
      {
        order: 3,
        title: 'Composer le 15 sans délai',
        instructions: [
          'Précisez l\'heure de début et la localisation précise de la douleur.',
          'Préparez les ordonnances habituelles et la carte de groupe sanguin si disponibles.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne prenez pas le volant pour conduire la victime aux urgences vous-même : l\'arrêt cardiaque peut survenir sur la route.',
      'Ne minimisez pas la douleur en pensant à une simple digestion difficile.'
    ]
  },
  {
    id: 'panique_angoisse',
    title: 'Crise de Panique & Angoisse Aiguë (Spasmophilie)',
    subtitle: 'Hyperventilation, sensation d\'étouffer, palpitations fortes, tremblements, peur intense de mourir ou de devenir fou.',
    emergencyNumber: '15 si doute sur un problème cardiaque',
    urgencyLevel: 'conseil',
    keywords: ['angoisse', 'panique', 'tétanie', 'hyperventilation', 'cohérence cardiaque', 'spasmophilie'],
    steps: [
      {
        order: 1,
        title: 'Isoler et rassurer d\'une voix calme et ferme',
        instructions: [
          'Emmenez la personne dans un endroit calme, à l\'abri des regards et du bruit.',
          'Asseyez-la confortablement et dites-lui calmement : « Tu fais une crise d\'angoisse, ton cœur s\'emballe mais tu n\'es pas en danger de mort, ça va passer d\'ici quelques minutes. Je reste avec toi. »',
          'Prenez-lui doucement la main pour ancrer sa présence.'
        ]
      },
      {
        order: 2,
        title: 'Guider la respiration (Exercice 4-4 ou sac en papier)',
        instructions: [
          'Ralentissez la respiration pour stopper l\'alcalose respiratoire due à l\'hyperventilation.',
          'Faites avec elle l\'exercice en respirant ensemble : Inspirez par le nez en comptant jusqu\'à 4... Expirez lentement par la bouche en comptant jusqu\'à 4.',
          'Si la personne respire trop vite, faites-la respirer dans ses mains réunies en coupe devant le nez et la bouche.'
        ]
      }
    ],
    mistakesToAvoid: [
      'Ne lui dites pas « Calme-toi, ce n\'est rien » (cela augmente son sentiment d\'incompréhension et de solitude).',
      'Ne la laissez jamais seule pendant la crise.'
    ]
  }
];
