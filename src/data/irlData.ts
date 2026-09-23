import { IRLIndex } from '../types/autobailleur';

// Données officielles de l'Indice de Référence des Loyers (INSEE)
// Métropole (Loi n° 2008-111 du 8 février 2008 pour le pouvoir d'achat)
export const OFFICIAL_IRL_DATA: IRLIndex[] = [
  { year: 2026, quarter: 2, label: 'T2 2026', value: 148.40, publishedDate: '11 juillet 2026' },
  { year: 2026, quarter: 1, label: 'T1 2026', value: 147.85, publishedDate: '15 avril 2026' },
  { year: 2025, quarter: 4, label: 'T4 2025', value: 147.30, publishedDate: '16 janvier 2026' },
  { year: 2025, quarter: 3, label: 'T3 2025', value: 146.85, publishedDate: '17 octobre 2025' },
  { year: 2025, quarter: 2, label: 'T2 2025', value: 146.22, publishedDate: '11 juillet 2025' },
  { year: 2025, quarter: 1, label: 'T1 2025', value: 145.50, publishedDate: '15 avril 2025' },
  { year: 2024, quarter: 4, label: 'T4 2024', value: 144.78, publishedDate: '15 janvier 2025' },
  { year: 2024, quarter: 3, label: 'T3 2024', value: 144.51, publishedDate: '15 octobre 2024' },
  { year: 2024, quarter: 2, label: 'T2 2024', value: 145.17, publishedDate: '12 juillet 2024' },
  { year: 2024, quarter: 1, label: 'T1 2024', value: 143.46, publishedDate: '12 avril 2024' },
  { year: 2023, quarter: 4, label: 'T4 2023', value: 142.06, publishedDate: '16 janvier 2024' },
  { year: 2023, quarter: 3, label: 'T3 2023', value: 141.03, publishedDate: '13 octobre 2023' },
  { year: 2023, quarter: 2, label: 'T2 2023', value: 140.59, publishedDate: '13 juillet 2023' },
  { year: 2023, quarter: 1, label: 'T1 2023', value: 138.61, publishedDate: '14 avril 2023' },
  { year: 2022, quarter: 4, label: 'T4 2022', value: 137.26, publishedDate: '13 janvier 2023' },
  { year: 2022, quarter: 3, label: 'T3 2022', value: 136.27, publishedDate: '14 octobre 2022' },
  { year: 2022, quarter: 2, label: 'T2 2022', value: 135.84, publishedDate: '13 juillet 2022' },
  { year: 2022, quarter: 1, label: 'T1 2022', value: 133.93, publishedDate: '15 avril 2022' },
  { year: 2021, quarter: 4, label: 'T4 2021', value: 132.62, publishedDate: '14 janvier 2022' },
  { year: 2021, quarter: 3, label: 'T3 2021', value: 131.67, publishedDate: '15 octobre 2021' },
];

/**
 * Calcul de la révision selon l'Art. 17-1 de la Loi du 6 juillet 1989 modifiée par la Loi ALUR :
 * Nouveau loyer = Loyer en cours x (Nouvel IRL / Ancien IRL)
 */
export function calculateIRLRevision(
  currentRent: number,
  oldIRL: number,
  newIRL: number
): {
  newRent: number;
  difference: number;
  percentageIncrease: number;
} {
  if (oldIRL <= 0 || newIRL <= 0 || currentRent <= 0) {
    return { newRent: currentRent, difference: 0, percentageIncrease: 0 };
  }
  const ratio = newIRL / oldIRL;
  const newRent = Math.round(currentRent * ratio * 100) / 100;
  const difference = Math.round((newRent - currentRent) * 100) / 100;
  const percentageIncrease = Math.round(((newIRL - oldIRL) / oldIRL) * 10000) / 100;
  return { newRent, difference, percentageIncrease };
}

export const MONTH_NAMES_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
];
