import { ChargeItem } from '../types/autobailleur';

export const OFFICIAL_LEGAL_CHARGES_RULE = {
  decree: 'Décret n° 87-713 du 26 août 1987',
  decreeTitle: 'Liste des charges récupérables sur le locataire',
  lawReference: 'Article 23 de la Loi n° 89-462 du 6 juillet 1989',
  regularisationDelay: 'Au moins 1 fois par an, avec communication du décompte 1 mois avant la régularisation effective.',
  piecesJustificatives: 'Les pièces justificatives (factures, contrats, relevés de charges du syndic) doivent être tenues à disposition du locataire pendant 6 mois.'
};

export const DEFAULT_SAMPLE_CHARGES: ChargeItem[] = [
  {
    id: 'ch_teom',
    name: "Taxe d'Enlèvement des Ordures Ménagères (TEOM)",
    category: 'taxes',
    totalInvoiceAmount: 245.0,
    tantiemes: 1000,
    baseTantiemes: 1000,
    recuperablePercentage: 92, // Déduction impérative des ~8% de frais de gestion fiscale de l'État (Cass. 3e civ. 19/12/2012)
    isRecuperable: true,
    legalNote: 'Récupérable hors frais de rôle et de gestion (déduction légale de 8% sur le montant de l’avis de taxe foncière).',
    notes: 'Avis de taxe foncière du propriétaire bailleur'
  },
  {
    id: 'ch_eau_froide',
    name: 'Consommation Eau Froide (compteur divisionnaire)',
    category: 'eau',
    totalInvoiceAmount: 185.40,
    tantiemes: 1000,
    baseTantiemes: 1000,
    recuperablePercentage: 100,
    isRecuperable: true,
    legalNote: 'Récupérable à 100% sur relevé d’index du compteur divisionnaire du lot.',
    notes: 'Index relevé : 42 m³'
  },
  {
    id: 'ch_electricite_communs',
    name: 'Électricité des parties communes (minuterie & éclairage)',
    category: 'parties_communes',
    totalInvoiceAmount: 320.0,
    tantiemes: 95, // 95/1000e pour l'appartement
    baseTantiemes: 1000,
    recuperablePercentage: 100,
    isRecuperable: true,
    legalNote: 'Récupérable au prorata des tantièmes généraux des parties communes.',
    notes: 'Relevé annuel de charges du syndic'
  },
  {
    id: 'ch_entretien_communs',
    name: 'Nettoyage des parties communes & sortie des poubelles',
    category: 'parties_communes',
    totalInvoiceAmount: 1250.0,
    tantiemes: 95,
    baseTantiemes: 1000,
    recuperablePercentage: 100,
    isRecuperable: true,
    legalNote: 'Récupérable à 100% si effectué par une entreprise extérieure prestataire.',
    notes: 'Contrat d’entretien prestataire'
  },
  {
    id: 'ch_ascenseur',
    name: 'Contrat d’entretien de l’ascenseur',
    category: 'ascenseur',
    totalInvoiceAmount: 680.0,
    tantiemes: 110, // tantièmes ascenseur
    baseTantiemes: 1000,
    recuperablePercentage: 73, // Décret 87-713 : 73% maintenance courante récupérable, 27% grosses réparations à charge bailleur
    isRecuperable: true,
    legalNote: 'Plafonné à 73% du contrat complet d’entretien (27% pour gros composants à charge du propriétaire).',
    notes: 'Ascenseur étage 3'
  },
  {
    id: 'ch_chaudiere_entretien',
    name: 'Contrat d’entretien annuel de la chaudière individuelle gaz',
    category: 'chauffage',
    totalInvoiceAmount: 130.0,
    tantiemes: 1000,
    baseTantiemes: 1000,
    recuperablePercentage: 100,
    isRecuperable: true,
    legalNote: 'À la charge exclusive du locataire occupant (attestation d’entretien obligatoire).',
    notes: 'Facture chauffagiste certifié'
  },
  // NON RÉCUPÉRABLES (À charge du bailleur)
  {
    id: 'ch_syndic_gestion',
    name: 'Honoraires du syndic de copropriété',
    category: 'syndic_gestion',
    totalInvoiceAmount: 420.0,
    tantiemes: 95,
    baseTantiemes: 1000,
    recuperablePercentage: 0,
    isRecuperable: false,
    legalNote: 'STRICTEMENT NON RÉCUPÉRABLE : 100% à la charge du propriétaire bailleur (Art. 23 Loi 1989).',
    notes: 'Gestion administrative copro'
  },
  {
    id: 'ch_assurance_immeuble',
    name: 'Assurance multirisque de l’immeuble (copropriété)',
    category: 'syndic_gestion',
    totalInvoiceAmount: 210.0,
    tantiemes: 95,
    baseTantiemes: 1000,
    recuperablePercentage: 0,
    isRecuperable: false,
    legalNote: 'STRICTEMENT NON RÉCUPÉRABLE : Prime d’assurance à la charge exclusive du copropriétaire bailleur.',
    notes: 'Police copro'
  },
  {
    id: 'ch_travaux_ravalement',
    name: 'Travaux de ravalement de façade ou étanchéité toiture',
    category: 'gros_travaux',
    totalInvoiceAmount: 1800.0,
    tantiemes: 95,
    baseTantiemes: 1000,
    recuperablePercentage: 0,
    isRecuperable: false,
    legalNote: 'STRICTEMENT NON RÉCUPÉRABLE : Gros travaux de conservation et vétusté du bâtiment (Art. 606 C. Civ.).',
    notes: 'Travaux votés en AG'
  }
];
