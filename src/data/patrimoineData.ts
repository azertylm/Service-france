import { ArchitecturalSite, CircuitTheme } from '../types/patrimoine';

export const SITES_DATA: ArchitecturalSite[] = [
  // ==========================================
  // LA GRANDE-MOTTE (Modernisme Jean Balladur)
  // ==========================================
  {
    id: 'lgm-point-zero',
    name: 'Le Point Zéro & La Première Dune',
    commune: 'La Grande-Motte',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1967-1968',
    architect: 'Jean Balladur (Grand Prix de Rome)',
    shortTagline: 'L’acte de naissance de la cité des pyramides, posé au cœur des sables mouvants.',
    coordinates: { lat: 43.5574, lng: 4.0838 },
    address: 'Place du 1er Octobre 1974, 34280 La Grande-Motte',
    label: 'Architecture Contemporaine Remarquable',
    historicalContext:
      'En 1963, le gouvernement lance la « Mission Racine » pour endiguer le flux des vacanciers français partant en Espagne. L’architecte-philosophe Jean Balladur est chargé de faire surgir ex-nihilo une ville sur 700 hectares de marécages et de moustiques. Le « Point Zéro » est la première borne géodésique scellée dans le sable à partir de laquelle tous les angles et les axes de la ville ont été tracés.',
    architecturalSecrets: [
      'Pente douce épousant le profil des dunes originelles pour briser le vent thermique du large.',
      'Axe solaire calculé pour que les bâtiments ne projettent jamais d’ombre sur la plage en pleine journée d’été.',
      'Utilisation exclusive de béton blanc architectonique texturé pour réfléchir l’ardeur du soleil méditerranéen.',
    ],
    whatToLookFor: [
      'Le dallage au sol qui indique les directions cardinales et les distances vers les capitales méditerranéennes.',
      'La transition immédiate sans route : on passe directement du parc ombragé à la plage de sable fin sans franchir de bitume.',
    ],
    anecdote:
      'Jean Balladur a dormi sous la tente sur cette plage en 1964 avec un carnet de croquis pour observer la course des vents avant de tracer la moindre ligne !',
    badgeToUnlock: {
      id: 'badge-point-zero',
      name: 'Pionnier du Zéro',
      icon: '🧭',
      description: 'Vous avez foulé la borne d’origine de la plus audacieuse utopie balnéaire du XXe siècle.',
    },
    quiz: {
      question: 'D’où vient le nom « Point Zéro » à La Grande-Motte ?',
      options: [
        'C’est l’altitude exacte par rapport au niveau zéro de la mer.',
        'C’est la borne de repère d’origine à partir de laquelle toute la ville a été mesurée et dessinée.',
        'C’est l’endroit où le premier moustique a été éradiqué en 1965.',
        'C’est la première zone où les voitures ont été totalement interdites.',
      ],
      correctIndex: 1,
      explanation:
        'C’est le point géodésique initial posé par les géomètres de la Mission Racine pour implanter les premiers tracés de Jean Balladur.',
    },
  },
  {
    id: 'lgm-grande-pyramide',
    name: 'La Grande Pyramide (Quartier du Levant)',
    commune: 'La Grande-Motte',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1974',
    architect: 'Jean Balladur & Paul Bossard',
    shortTagline: '15 étages d’inclinaison à 60°, hommage magistral aux temples précolombiens de Teotihuacan.',
    coordinates: { lat: 43.5592, lng: 4.0864 },
    address: 'Quai Georges Pompidou, 34280 La Grande-Motte',
    label: 'Architecture Contemporaine Remarquable',
    historicalContext:
      'Point culminant de la station avec ses 15 étages, La Grande Pyramide forme le pendant monumental du mont Saint-Loup et du pic Saint-Loup dans l’arrière-pays. Balladur a conçu cette forme pour éviter la barre d’immeuble monolithique qui aurait formé un mur opaque étouffant la brise marine.',
    architecturalSecrets: [
      'Angle de façade de 60 degrés : il permet à chaque appartement de bénéficier d’une terrasse en cascade sans vue plongeante des voisins.',
      'Aérodynamisme anti-Mistral : les masses d’air venues du nord glissent sur la pente de la pyramide sans créer d’effet Venturi au sol.',
      'Modénatures trapézoïdales en relief sur les garde-corps qui créent un jeu d’ombres changeant d’heure en heure.',
    ],
    whatToLookFor: [
      'Placez-vous au pied du quai et levez les yeux : la silhouette évoque à la fois une voile de voilier gonflée et une pyramide aztèque.',
      'Les ouvertures asymétriques au sommet qui allègent la masse visuelle de la cime.',
    ],
    anecdote:
      'Lorsque Jean Balladur a visité les ruines de Teotihuacan au Mexique en 1962, il a été frappé par la façon dont les pyramides précolombiennes structuraient un paysage plat infini. Il a importé cette leçon géométrique sur les sables d’Occitanie.',
    badgeToUnlock: {
      id: 'badge-pyramide',
      name: 'Gardien du Soleil Maya',
      icon: '🔺',
      description: 'Vous avez décodé les secrets d’inclinaison de La Grande Pyramide.',
    },
    quiz: {
      question: 'Quel est l’avantage pratique principal de l’inclinaison à 60° des pyramides de La Grande-Motte ?',
      options: [
        'Économiser 40% sur le coût du ciment lors du coffrage.',
        'Offrir à chaque niveau une terrasse plein ciel sans vis-à-vis plongeant du dessus.',
        'Permettre l’atterrissage d’hélicoptères de secours.',
        'Capter l’énergie des ondes telluriques.',
      ],
      correctIndex: 1,
      explanation:
        'La pente graduelle transforme le toit de l’appartement du dessous en terrasse spacieuse et intime pour celui du dessus, inondée de lumière naturelle.',
    },
  },
  {
    id: 'lgm-modenatures-poisson',
    name: 'Résidence Le Grand Pavois & Motifs « Les Poissons »',
    commune: 'La Grande-Motte',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1971',
    architect: 'Jean Balladur',
    shortTagline: 'Quand le béton devient dentelle : l’art des modénatures et des brise-soleil ajourés.',
    coordinates: { lat: 43.5583, lng: 4.0815 },
    address: 'Allée des Parcs, 34280 La Grande-Motte',
    label: 'Architecture Contemporaine Remarquable',
    historicalContext:
      'À La Grande-Motte, aucun crépi n’est peint en couleur criarde. Tout le décor provient de ce que les architectes nomment les « modénatures » : des pièces de béton moulées en usine selon des formes organiques (poissons, masques, yeux, cercles) assemblées en façade.',
    architecturalSecrets: [
      'Fonction thermique passive : les modénatures agissent comme des moucharabiehs méditerranéens, arrêtant 65% du rayonnement direct tout en laissant circuler la brise.',
      'Dessin à la main : Balladur dessinait lui-même les matrices en bois dans lesquelles le béton était coulé.',
      'Poésie marine : les motifs du Couchant sont féminins et sinueux (courbes, vagues, poissons) tandis que le Levant est masculin et anguleux (pyramides franches).',
    ],
    whatToLookFor: [
      'Repérez les motifs en forme d’écailles de poisson et d’yeux stylisés sur les balcons.',
      'Observez l’ombre projetée au sol en milieu d’après-midi : elle dessine une véritable fresque géométrique vivante.',
    ],
    anecdote:
      'Dans les années 1970, les détracteurs appelaient la ville « Sarcelles-sur-Mer ». Aujourd’hui, le ministère de la Culture lui a décerné le label national officiel de chef-d’œuvre du XXe siècle !',
    badgeToUnlock: {
      id: 'badge-modenature',
      name: 'Maître des Modénatures',
      icon: '🐟',
      description: 'Vous savez désormais lire les motifs secrets dissimulés dans le béton de Balladur.',
    },
    quiz: {
      question: 'À quoi servent les motifs ajourés en béton (modénatures) sur les façades de La Grande-Motte ?',
      options: [
        'C’est un isolant phonique contre les cris des mouettes.',
        'Ce sont des brise-soleil thermiques qui évitent la surchauffe estivale tout en ventilant naturellement.',
        'À faire passer les câbles téléphoniques de secours.',
        'À empêcher les parachutistes d’atterrir sur les terrasses.',
      ],
      correctIndex: 1,
      explanation:
        'Inspirées des moucharabiehs d’Orient, ces modénatures filtrent le soleil torride du midi tout en laissant passer les courants d’air bienfaisants.',
    },
  },
  {
    id: 'lgm-passerelles-vegetales',
    name: 'Le Réseau des Passerelles & Allées Vertes',
    commune: 'La Grande-Motte',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1968-1975',
    architect: 'Jean Balladur & Pierre Pillet (Paysagiste)',
    shortTagline: '70% d’espaces verts et 25 km d’allées piétonnes aériennes où l’enfant ne croise jamais une voiture.',
    coordinates: { lat: 43.5605, lng: 4.0842 },
    address: 'Allée du Couchant, 34280 La Grande-Motte',
    label: 'Éco-urbanisme visionnaire',
    historicalContext:
      'Bien avant les concepts de « ville apaisée » ou de « transition écologique », Jean Balladur et son paysagiste Pierre Pillet ont sanctuarisé 70% de la surface communale en espaces verts et planté plus de 50 000 arbres (pins parasols, tamaris, lauriers-roses résistants aux embruns).',
    architecturalSecrets: [
      'Ségrégation des flux : les voitures circulent en contrebas ou en périphérie, tandis que les piétons évoluent sur des passerelles en béton sculpté sans feux rouges ni carrefours.',
      'Courbes sans ligne droite : les allées serpentent volontairement pour inciter à la promenade ralentie et contemplative.',
      'Dunes paysagères artificielles conçues pour canaliser les flux de fraîcheur nocturne depuis les étangs vers le cœur de ville.',
    ],
    whatToLookFor: [
      'Les passerelles en forme d’arche fluide : aucune arête vive, tout est en courbes douces pour souligner l’aspect organique.',
      'L’absence totale de trottoir bordé de voitures le long des grands corridors boisés.',
    ],
    anecdote:
      'La Grande-Motte compte aujourd’hui environ 3 arbres pour chaque habitant à l’année, ce qui en fait l’une des cités balnéaires les plus vertes de toute l’Europe.',
    badgeToUnlock: {
      id: 'badge-passerelle',
      name: 'Passeur Sans Asphalte',
      icon: '🌿',
      description: 'Vous avez franchi la cité des dunes sans traverser la moindre voie automobile.',
    },
    quiz: {
      question: 'Quelle proportion de la surface totale de La Grande-Motte est réservée aux espaces verts et piétons ?',
      options: ['Moins de 20%', 'Environ 40%', 'Près de 70%', '100%'],
      correctIndex: 2,
      explanation:
        'Jean Balladur a imposé que plus de deux tiers de la commune soient entièrement voués aux parcs, dunes plantées et circulations douces ombragées.',
    },
  },
  {
    id: 'lgm-eglise-saint-augustin',
    name: 'Église Saint-Augustin & Les Voiles de Béton',
    commune: 'La Grande-Motte',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1975',
    architect: 'Jean Balladur',
    shortTagline: 'Une nef comme une coque de bateau renversée, baignée d’une lumière zénithale mystique.',
    coordinates: { lat: 43.5621, lng: 4.0851 },
    address: 'Place de la Mairie, 34280 La Grande-Motte',
    label: 'Édifice remarquable',
    historicalContext:
      'Pour le sanctuaire spirituel de la cité, Balladur a refusé le clocher traditionnel. Il a imaginé deux immenses paraboloïdes de béton qui semblent jaillir du sol comme deux mains jointes pour la prière ou deux voiles battant pavillon au vent.',
    architecturalSecrets: [
      'Voile mince en béton armé sans aucun pilier central intérieur : la portée repose sur la courbure hyperbolique de la coque.',
      'Le clocher est une sculpture ajourée de métal et de béton dressée à côté, laissant voir le bleu du ciel à travers les cloches.',
      'Ouvertures zénithales dissimulées qui dirigent le rai de soleil sur l’autel de pierre brute à l’heure de la messe.',
    ],
    whatToLookFor: [
      'Les empreintes de planches de coffrage en bois encore visibles dans le béton : un hommage au travail manuel des ouvriers du chantier.',
      'L’acoustique remarquable engendrée par la double courbure intérieure.',
    ],
    anecdote:
      'Le premier mariage célébré dans l’église a réuni des ouvriers espagnols et italiens du chantier qui s’étaient installés définitivement dans la station.',
    badgeToUnlock: {
      id: 'badge-saint-augustin',
      name: 'Vœu de Béton',
      icon: '⛪',
      description: 'Vous avez découvert le sanctuaire moderniste de Saint-Augustin.',
    },
    quiz: {
      question: 'Quelle forme symbolique évoquent les deux grandes coques de béton de l’église Saint-Augustin ?',
      options: [
        'Deux voiles de bateau ou deux mains jointes tendues vers le ciel.',
        'Deux obus de canon de la Seconde Guerre mondiale.',
        'Deux ailes d’avion de ligne.',
        'Deux coquilles Saint-Jacques géantes.',
      ],
      correctIndex: 0,
      explanation:
        'Balladur a voulu marier l’univers marin (les voiles gonflées) et l’élévation spirituelle (les mains en prière), en communion avec les dunes.',
    },
  },

  // ==========================================
  // AIGUES-MORTES (Forteresse Capétienne XIIIe)
  // ==========================================
  {
    id: 'am-remparts-saint-louis',
    name: 'Les Remparts d’Aigues-Mortes & Le Quadrilatère',
    commune: 'Aigues-Mortes',
    style: 'Gothique militaire rayonnant',
    yearBuilt: '1240-1272',
    architect: 'Guillaume des Barres & Maîtres d’œuvre de Saint-Louis',
    shortTagline: '1 634 mètres de courtines intactes du XIIIe siècle, surgi des marais salants.',
    coordinates: { lat: 43.5677, lng: 4.1916 },
    address: 'Place Saint-Louis, 30220 Aigues-Mortes',
    label: 'Monument Historique & Site National',
    historicalContext:
      'Au XIIIe siècle, le roi de France Louis IX (Saint-Louis) ne possède aucun port sur la Méditerranée : la Provence appartient à son frère et le Roussillon à la couronne d’Aragon. Il choisit cette lagune isolée pour bâtir ex-nihilo le seul débouché maritime direct du royaume et lancer la septième croisade en 1248.',
    architecturalSecrets: [
      'Appareil à bossage régulier taillé dans la pierre calcaire coquillière de Beaucaire, acheminée par barges sur les canaux.',
      'Meurtrières à plongée continue et mâchicoulis sur corbeaux permettant de défendre le pied du mur sans angle mort.',
      'Tracé régulier en rectangle parfait de 567 mètres sur 269 mètres, prototype de la bastide royale médiévale.',
    ],
    whatToLookFor: [
      'Les marques de tâcherons (croix, étoiles, lettres) gravées sur les blocs de pierre par les tailleurs pour être payés à la pièce.',
      'Le contraste saisissant entre la pierre dorée et la couleur rose vif des tables salantes des Salins du Midi en contrebas.',
    ],
    anecdote:
      'À l’époque de Saint-Louis, la mer arrivait presque au pied des remparts par un chenal navigable jusqu’au Grau-du-Roi. L’ensablement progressif a fait reculer la côte de plus de 5 kilomètres !',
    badgeToUnlock: {
      id: 'badge-saint-louis',
      name: 'Chevalier des Sables',
      icon: '🏰',
      description: 'Vous avez arpenté l’enceinte capétienne inviolée de Saint-Louis.',
    },
    quiz: {
      question: 'Pourquoi le roi Saint-Louis a-t-il fondé Aigues-Mortes au milieu des marécages au XIIIe siècle ?',
      options: [
        'Pour y construire sa résidence d’été avec vue sur la mer.',
        'Parce qu’il n’avait aucun autre port royal sur la mer Méditerranée.',
        'Pour surveiller les pirates barbaresques qui attaquaient Paris.',
        'Pour cultiver la fleur de sel pour les boulangeries royales.',
      ],
      correctIndex: 1,
      explanation:
        'Le royaume capétien n’avait aucun débouché maritime direct au sud, la Provence et le Languedoc maritime appartenant alors à d’autres seigneurs.',
    },
  },
  {
    id: 'am-tour-constance',
    name: 'La Tour de Constance & La Mémoire Huguenote',
    commune: 'Aigues-Mortes',
    style: 'Gothique militaire rayonnant',
    yearBuilt: '1242-1248',
    architect: 'Eudes de Montreuil',
    shortTagline: 'Un donjon royal de 30 mètres de haut, forteresse imprenable devenue prison de conscience.',
    coordinates: { lat: 43.5688, lng: 4.1901 },
    address: 'Porte de la Gardette, 30220 Aigues-Mortes',
    label: 'Haut lieu de mémoire de la tolérance',
    historicalContext:
      'Érigée sur l’emplacement de l’ancienne tour Matafère de Charlemagne, cette tour maîtresse possède des murs de 6 mètres d’épaisseur. Après la révocation de l’Édit de Nantes en 1685, elle servit de prison aux femmes protestantes du Midi, dont la célèbre Marie Durand, enfermée pendant 38 ans.',
    architecturalSecrets: [
      'Voutes d’ogives exceptionnelles à liernes et tiercerons dans la salle haute des gardes, dignes des plus grandes cathédrales royales.',
      'Système d’oubliettes et de puits central récupérant l’eau de pluie filtrée par les terrasses pour soutenir un siège de plusieurs mois.',
      'La tourelle de vigie sommitale accueillait autrefois un feu de bois servant de phare pour guider les navires dans la lagune.',
    ],
    whatToLookFor: [
      'Sur la margelle du puits de la salle haute : l’inscription poignante « RESISTER » gravée par les prisonnières protestantes au fil de décennies de réclusion.',
      'L’épaisseur vertigineuse des embrasures de tir (plus de 5 mètres de profondeur).',
    ],
    anecdote:
      'Marie Durand avait 19 ans lorsqu’elle est entrée dans la tour de Constance en 1730 pour avoir refusé d’abjurer sa foi protestante. Elle n’en est ressortie libre qu’à l’âge de 57 ans !',
    badgeToUnlock: {
      id: 'badge-constance',
      name: 'Flamme de Résistance',
      icon: '🛡️',
      description: 'Vous avez rendu hommage à la mémoire de Marie Durand et découvert la voûte royale.',
    },
    quiz: {
      question: 'Quel mot symbole a été gravé sur la margelle du puits par les prisonnières de la Tour de Constance ?',
      options: ['LIBERTÉ', 'RESISTER', 'ESPOIR', 'JUSTICE'],
      correctIndex: 1,
      explanation:
        'Le mot « RESISTER » (ou RECISTER) gravé dans la pierre témoigne du courage indomptable de Marie Durand et de ses compagnes de captivité.',
    },
  },

  // ==========================================
  // LE GRAU-DU-ROI & PORT CAMARGUE
  // ==========================================
  {
    id: 'gdr-phare-espiguette',
    name: 'Le Phare de l’Espiguette & La Pointe Sauvage',
    commune: 'Le Grau-du-Roi',
    style: 'Patrimoine portuaire & maritime',
    yearBuilt: '1869',
    architect: 'Léonce Reynaud (Directeur des Phares et Balises)',
    shortTagline: 'Tour carrée en pierre de 27 mètres érigée sur le plus grand massif dunaire d’Europe.',
    coordinates: { lat: 43.4912, lng: 4.1423 },
    address: 'Pointe de l’Espiguette, 30240 Le Grau-du-Roi',
    label: 'Monument Historique (2012)',
    historicalContext:
      'Construit en 1869 pour guider les navires marchands doublant la pointe dangereuse du golfe d’Aigues-Mortes. À sa construction, le phare était situé à seulement 150 mètres du rivage. Aujourd’hui, en raison de l’engraissement spectaculaire du lido dunaire par les courants du Rhône, il se dresse à plus de 700 mètres à l’intérieur des terres !',
    architecturalSecrets: [
      'Architecture carrée rare pour un phare d’atterrissage en bord de mer, conçu pour résister aux tempêtes de sud-est.',
      'Optique de Fresnel tournante historique toujours en fonction, visible jusqu’à 24 milles marins (environ 44 kilomètres).',
      'Escalier hélicoïdal en fonte de 111 marches suspendu sans pilier central à l’intérieur du fût.',
    ],
    whatToLookFor: [
      'Le contraste entre la géométrie sévère de la pierre de taille calcaire et le désert de dunes vierges tout autour.',
      'La vue panoramique à 360° au sommet embrassant les Cévennes, le mont Ventoux et la baie de La Grande-Motte.',
    ],
    anecdote:
      'C’est le seul phare de Méditerranée continentale française qui s’est éloigné de la mer sans jamais bouger d’un millimètre, le rivage grandissant sous ses pieds !',
    badgeToUnlock: {
      id: 'badge-espiguette',
      name: 'Veilleur du Golfe',
      icon: '💡',
      description: 'Vous avez exploré la sentinelle des dunes de l’Espiguette.',
    },
    quiz: {
      question: 'Pourquoi le phare de l’Espiguette est-il aujourd’hui à plus de 700 mètres de la mer ?',
      options: [
        'Il a été démonté et reculé pierre par pierre en 1950.',
        'La mer s’est retirée à cause du réchauffement climatique.',
        'Les courants marins ont accumulé des millions de tonnes de sable (engraissement dunaire) devant lui.',
        'C’était une erreur de calcul des ingénieurs de 1869.',
      ],
      correctIndex: 2,
      explanation:
        'Contrairement à la majorité des côtes qui s’érodent, la pointe de l’Espiguette accumule le sable charrié par le Rhône, agrandissant la plage de plusieurs mètres par an.',
    },
  },
  {
    id: 'gdr-port-camargue',
    name: 'Port Camargue & Les Quays-Maisons Flottants',
    commune: 'Le Grau-du-Roi',
    style: 'Modernisme XXe (Balladur)',
    yearBuilt: '1969-1980',
    architect: 'Jean Balladur & Bureau d’études de la SODETEG',
    shortTagline: '1er port de plaisance d’Europe : une cité lacustre où votre bateau dort sous vos fenêtres.',
    coordinates: { lat: 43.5225, lng: 4.1311 },
    address: 'Avenue Jean Lasserre, 30240 Port Camargue',
    label: 'Cité lacustre contemporaine',
    historicalContext:
      'Pensé comme l’extension nautique de La Grande-Motte par Jean Balladur, Port Camargue compte près de 5 000 anneaux d’amarrage. L’architecte a inventé le concept de « marinas privées » : des îlots reliés par des ponts où chaque maison de ville possède son ponton privatif directement accessible depuis le séjour.',
    architecturalSecrets: [
      'Creusement hydraulique de bassins en forme de pétales de fleurs pour maximiser le linéaire de quai habitable.',
      'Gabarit bas des constructions (R+1 à R+2) pour préserver la ligne d’horizon et l’esprit village de marins.',
      'Orientation des bassins étudiée pour que les mâts des voiliers ne sifflent pas sous le vent dominant.',
    ],
    whatToLookFor: [
      'Les passerelles piétonnes en bois qui enjambent les passes d’eau entre les îlots.',
      'La Capitainerie futuriste avec sa tour de vigie en forme d’aileron surplombant l’avant-port.',
    ],
    anecdote:
      'Port Camargue est tellement étendu que certains résidents font leurs courses en barque ou en paddle d’une marina à l’autre.',
    badgeToUnlock: {
      id: 'badge-port-camargue',
      name: 'Capitaine de Lagune',
      icon: '⛵',
      description: 'Vous avez navigué dans les méandres de la plus grande marina d’Europe.',
    },
    quiz: {
      question: 'Quel était le concept novateur inventé par Jean Balladur pour les logements de Port Camargue ?',
      options: [
        'Des maisons flottantes montées sur flotteurs insubmersibles.',
        'Les « marinas » avec poste d’amarrage privatif au pied de chaque logement.',
        'Des appartements sans portes ni serrures.',
        'Des toitures en tuiles photovoltaïques dès 1970.',
      ],
      correctIndex: 1,
      explanation:
        'Le concept de marina permet au plaisancier de passer directement de son salon à la barre de son voilier sans passer par des pontons publics éloignés.',
    },
  },

  // ==========================================
  // CARNON & MAUGUIO (Motte Féodale & Années 60)
  // ==========================================
  {
    id: 'mauguio-motte-feodale',
    name: 'Le Jardin de la Motte & Le Castrum Médiéval',
    commune: 'Carnon & Mauguio',
    style: 'Roman fortifié languedocien',
    yearBuilt: 'Vers l’an 960 (Xe siècle)',
    architect: 'Comtes de Melgueil',
    shortTagline: 'La plus grande motte féodale artificielle conservée de tout le Midi méditerranéen.',
    coordinates: { lat: 43.6163, lng: 4.0102 },
    address: 'Rue de la Motte, 34130 Mauguio',
    label: 'Site Classé & Monument Historique',
    historicalContext:
      'Au Xe siècle, les puissants comtes de Melgueil (qui frappaient leur propre monnaie reconnue dans toute l’Occitanie) ont érigé à bras d’homme ce tumulus géant de terre de 20 mètres de haut pour dominer les étangs et se prémunir des incursions maritimes. Au XIXe siècle, elle a été transformée en un jardin belvédère suspendu.',
    architecturalSecrets: [
      'Structure urbaine circulaire en « escargot » : toutes les ruelles du village médiéval s’enroulent concentriquement autour de la motte.',
      'Réservoir d’eau hydraulique sous la motte construit en 1902 pour alimenter la commune en eau douce sous pression gravitaire.',
      'Panorama exceptionnel depuis le sommet : vue d’ensemble sur le mont Ventoux, le pic Saint-Loup et les lagunes littorales.',
    ],
    whatToLookFor: [
      'Le parcours en spirale ombragé d’essences méditerranéennes séculaires (cèdres, cyprès, pins parasols).',
      'Le temple d’amour et la gloriette néoclassique érigée au sommet au tournant du XXe siècle.',
    ],
    anecdote:
      'Les comtes de Melgueil étaient si puissants qu’ils possédaient leur propre atelier monétaire : le « denier melgorien » était l’une des monnaies de référence de tout le sud de la France et des Croisades !',
    badgeToUnlock: {
      id: 'badge-motte',
      name: 'Vicomte de Melgueil',
      icon: '🌱',
      description: 'Vous avez gravi le tertre féodal millénaire de Mauguio.',
    },
    quiz: {
      question: 'Qu’est-ce qui rend la Motte de Mauguio unique dans le Midi de la France ?',
      options: [
        'C’est un volcan éteint sous-marin.',
        'C’est la plus grande motte féodale artificielle de terre préservée du sud de la France.',
        'C’est un ancien temple romain enseveli sous le sable.',
        'C’est un tombeau pharaonique rapporté d’Égypte.',
      ],
      correctIndex: 1,
      explanation:
        'Érigée au Xe siècle par les paysans et serfs des comtes de Melgueil avec des paniers d’osier, cette colline artificielle de 20 mètres est un vestige médiéval exceptionnel.',
    },
  },

  // ==========================================
  // MONTPELLIER LITTORAL & ANTIGONE (Postmodernisme)
  // ==========================================
  {
    id: 'mtp-antigone-bofill',
    name: 'Le Quartier Antigone (Place du Nombre d’Or)',
    commune: 'Montpellier & Littoral',
    style: 'Postmodernisme néoclassique (Bofill)',
    yearBuilt: '1979-1983',
    architect: 'Ricardo Bofill (Taller de Arquitectura)',
    shortTagline: 'Un temple grec habité pour le peuple : la magistrale agora néoclassique de Ricardo Bofill.',
    coordinates: { lat: 43.6083, lng: 3.8894 },
    address: 'Place du Nombre d’Or, 34000 Montpellier',
    label: 'Patrimoine du XXe siècle',
    historicalContext:
      'Dans les années 1980, le maire Georges Frêche et l’architecte catalan Ricardo Bofill veulent reconnecter Montpellier à son fleuve côtier, le Lez, en créant un axe triomphal est-ouest. Bofill conçoit Antigone comme un manifeste du « logement social monumental » réinterprétant les proportions divines de la Grèce antique.',
    architecturalSecrets: [
      'Proportions du Nombre d’Or (1,618) appliquées strictement au diamètre de la place, à la hauteur des colonnades et au rythme des frontons.',
      'Technique industrielle de pointe : du béton teinté de sable ocre coulé dans des moules d’acier poli pour donner l’illusion de blocs de marbre antique taillés.',
      'Place entièrement piétonne en amphithéâtre circulaire, inspirée des places royales françaises du XVIIe siècle.',
    ],
    whatToLookFor: [
      'Les pilastres cannelés monumentaux qui rythment la façade des immeubles de logements HLM sans ostentation coûteuse.',
      'La perspective parfaite qui traverse la place, passe sous l’arche de l’Hôtel de Région et file droit vers la Méditerranée.',
    ],
    anecdote:
      'Bofill voulait prouver qu’on pouvait loger des familles modestes dans un décor de palais antique sans dépenser plus que pour une barre HLM conventionnelle des banlieues.',
    badgeToUnlock: {
      id: 'badge-antigone',
      name: 'Harmonie du Nombre d’Or',
      icon: '🏛️',
      description: 'Vous avez percé les secrets géométriques de la place d’Antigone.',
    },
    quiz: {
      question: 'Quel matériau moderne a été utilisé par Ricardo Bofill pour imiter la pierre calcaire antique à Antigone ?',
      options: [
        'Du plâtre ciré recouvert d’un vernis acrylique.',
        'Du béton architectonique préfabriqué teinté dans la masse avec du sable de carrière local.',
        'Des blocs de marbre importés directement de Carrare en Italie.',
        'Du polystyrène expansé résistant à l’eau.',
      ],
      correctIndex: 1,
      explanation:
        'Bofill a mis au point une formule de béton armé teinté dans la masse avec des agrégats locaux, coulé avec une précision millimétrique dans des coffrages métalliques.',
    },
  },
  {
    id: 'mtp-cathedrale-maguelone',
    name: 'Cathédrale Saint-Pierre de Maguelone (L’Île Fortifiée)',
    commune: 'Montpellier & Littoral',
    style: 'Roman fortifié languedocien',
    yearBuilt: '1178 (XIIe siècle)',
    architect: 'Évêques de Maguelone (Gautier & Arnaud)',
    shortTagline: 'Vaisseau de pierre austère posé sur une île de vignes et de flamants roses entre étang et mer.',
    coordinates: { lat: 43.5117, lng: 3.8836 },
    address: 'Presqu’île de Maguelone, 34250 Palavas-les-Flots',
    label: 'Monument Historique (1840)',
    historicalContext:
      'Ancien siège épiscopal fondé dès le VIe siècle sur un cordon littoral isolé, Maguelone était une véritable forteresse de Dieu. Pour résister aux attaques des pirates sarrasins et génois, les évêques l’ont dotée de créneaux, de courtines massives et de meurtrières.',
    architecturalSecrets: [
      'Tympan roman d’une virtuosité rare représentant le Christ en majesté entouré des quatre symboles des évangélistes (Tétramorphe).',
      'Murs de plus de deux mètres d’épaisseur sans aucune fenêtre latérale basse, conçus comme des boucliers de forteresse.',
      'Sarcophages paléochrétiens en marbre blanc de Carrare découverts lors des fouilles dans le chœur.',
    ],
    whatToLookFor: [
      'Le linteau de marbre au-dessus du portail où figurent deux têtes de paons sculptées, symboles paléochrétiens d’immortalité.',
      'L’ambiance acoustique sous la voûte en berceau : le moindre murmure résonne pendant plus de six secondes.',
    ],
    anecdote:
      'Maguelone accueillait autrefois les papes en exil fuyant Rome, dont Urbain II et Gélase II, qui trouvaient sur cette presqu’île fortifiée un refuge inviolable.',
    badgeToUnlock: {
      id: 'badge-maguelone',
      name: 'Évêque des Lagunes',
      icon: '🪨',
      description: 'Vous avez foulé l’île millénaire de la cathédrale de Maguelone.',
    },
    quiz: {
      question: 'Pourquoi la cathédrale de Maguelone ressemble-t-elle davantage à un château fort qu’à une église classique ?',
      options: [
        'Pour résister aux assauts des pirates sarrasins et des corsaires en Méditerranée.',
        'Parce que le roi de France y cachait son trésor de guerre.',
        'C’était un dépôt de munitions pendant la guerre de Cent Ans.',
        'Pour se protéger des tempêtes de sable venues du Sahara.',
      ],
      correctIndex: 0,
      explanation:
        'Isolée sur sa langue de terre sableuse au milieu de la mer, la cathédrale devait être capable de soutenir un siège maritime à tout moment.',
    },
  },
];

// ==========================================
// CIRCUITS THÉMATIQUES INTERACTIFS
// ==========================================

export const CIRCUITS_DATA: CircuitTheme[] = [
  {
    id: 'circuit-balladur-utopie',
    title: 'L’Utopie Moderniste de Jean Balladur',
    subtitle: 'La Grande-Motte à pied : des dunes primitives au label d’excellence du XXe siècle',
    commune: 'La Grande-Motte',
    duration: '1h45',
    distanceKm: 3.8,
    transportMode: 'À pied',
    recommendedTime: 'Fin d’après-midi (lumière rasante sur les modénatures)',
    description:
      'Un parcours immersif 100% piéton, entièrement à l’ombre des pins et des passerelles sans croiser une seule voiture. Découvrez pourquoi cette ville jadis décriée est aujourd’hui étudiée dans toutes les universités d’architecture du monde.',
    batteryFriendlyNote:
      'Pas de GPS en continu : vous pouvez consulter les étapes d’un simple coup d’œil ou appuyer sur « Ma position » uniquement quand vous avez un doute.',
    siteIds: [
      'lgm-point-zero',
      'lgm-grande-pyramide',
      'lgm-modenatures-poisson',
      'lgm-passerelles-vegetales',
      'lgm-eglise-saint-augustin',
    ],
    highlights: [
      'Vue imprenable sur La Grande Pyramide depuis la capitainerie',
      'Déchiffrage des motifs précolombiens sculptés dans le béton',
      'Traversée des passerelles piétonnes en sous-bois',
      'Intérieur mystique des voiles de béton de Saint-Augustin',
    ],
  },
  {
    id: 'circuit-saint-louis-forteresse',
    title: 'Sur les pas de Saint-Louis & Les Gardiens des Sables',
    subtitle: 'D’Aigues-Mortes au phare sauvage de l’Espiguette',
    commune: 'Aigues-Mortes',
    duration: '2h30',
    distanceKm: 12.5,
    transportMode: 'Mixte piéton/cyclable',
    recommendedTime: 'Matinée ou coucher de soleil sur les salins roses',
    description:
      'Plongez dans le grand large capétien du XIIIe siècle. Parcourez les 1 634 mètres de remparts dressés au milieu des étangs saumâtres, puis suivez le canal jusqu’au mythique phare de l’Espiguette.',
    batteryFriendlyNote:
      'Mode basse consommation optimisé : itinéraire pas à pas hors-ligne avec repères visuels clairs.',
    siteIds: [
      'am-remparts-saint-louis',
      'am-tour-constance',
      'gdr-port-camargue',
      'gdr-phare-espiguette',
    ],
    highlights: [
      'Gravure « RESISTER » de Marie Durand dans la Tour de Constance',
      'Les reflets roses uniques au monde des tables salantes d’Aigues-Mortes',
      'L’étonnante marina lacustre de Port Camargue',
      'La sentinelle carrée de l’Espiguette au milieu des dunes mouvantes',
    ],
  },
  {
    id: 'circuit-mottes-et-monuments',
    title: 'De la Motte Féodale au Postmodernisme Monumental',
    subtitle: '1 000 ans d’audace bâtie : Mauguio, Maguelone et l’agora de Bofill',
    commune: 'Carnon & Mauguio',
    duration: '2h15',
    distanceKm: 16.0,
    transportMode: 'Mixte piéton/cyclable',
    recommendedTime: 'Journée complète ou demi-journée vélo le long des étangs',
    description:
      'De la colline de terre des comtes de l’an 960 à l’agora grecque moderne de Ricardo Bofill à Antigone, traversez les siècles le long des lagunes classées Natura 2000.',
    batteryFriendlyNote:
      'Guidage ponctuel sans traçage : économise plus de 80% de batterie par rapport aux applications GPS commerciales.',
    siteIds: [
      'mauguio-motte-feodale',
      'mtp-cathedrale-maguelone',
      'mtp-antigone-bofill',
    ],
    highlights: [
      'Ascension en spirale de la motte féodale de Mauguio',
      'Cathédrale fortifiée de Maguelone isolée entre étangs et mer',
      'Colonnades et Nombre d’Or sur la place d’Antigone à Montpellier',
    ],
  },
];
