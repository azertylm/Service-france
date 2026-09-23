export type CommuneTag =
  | 'La Grande-Motte'
  | 'Aigues-Mortes'
  | 'Le Grau-du-Roi'
  | 'Carnon & Mauguio'
  | 'Montpellier & Littoral';

export type ArchitecturalStyle =
  | 'Modernisme XXe (Balladur)'
  | 'Gothique militaire rayonnant'
  | 'Postmodernisme néoclassique (Bofill)'
  | 'Art Déco & Balnéaire'
  | 'Roman fortifié languedocien'
  | 'Patrimoine portuaire & maritime';

export interface GeoCoordinate {
  lat: number;
  lng: number;
}

export interface ArchitecturalSite {
  id: string;
  name: string;
  commune: CommuneTag;
  style: ArchitecturalStyle;
  yearBuilt: string;
  architect: string;
  shortTagline: string;
  coordinates: GeoCoordinate;
  address: string;
  historicalContext: string;
  architecturalSecrets: string[];
  whatToLookFor: string[];
  anecdote: string;
  label?: string; // e.g. "Patrimoine du XXe siècle", "Monument Historique", "Site Classé"
  badgeToUnlock: {
    id: string;
    name: string;
    icon: string;
    description: string;
  };
  quiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface CircuitTheme {
  id: string;
  title: string;
  subtitle: string;
  commune: CommuneTag;
  duration: string;
  distanceKm: number;
  transportMode: 'À pied' | 'À vélo' | 'Mixte piéton/cyclable';
  recommendedTime: string;
  description: string;
  batteryFriendlyNote: string;
  siteIds: string[];
  highlights: string[];
}

export interface DecodedArchitecture {
  monumentOrStyleName: string;
  architectOrEra: string;
  locationLikelihood?: string;
  styleFamily: string;
  shortSummary: string;
  architecturalKeyFeatures: string[];
  historicalContext: string;
  curiousDetail: string;
  walkingTips?: string;
}

export interface ExplorerProgress {
  visitedSiteIds: string[];
  completedQuizIds: Record<string, number>; // siteId -> score
  unlockedBadgeIds: string[];
  lastVisitedTimestamp?: number;
}
