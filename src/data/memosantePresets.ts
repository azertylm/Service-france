import { FamilyMember, VaccineRecord, AllergyRecord, PrescriptionRecord, MedicalAppointment } from '../types/memosante';

export interface SampleReportPreset {
  id: string;
  title: string;
  reportType: string;
  badge: string;
  rawText: string;
}

export const SAMPLE_REPORTS_PRESETS: SampleReportPreset[] = [
  {
    id: 'bilan-nfs-crp',
    title: 'NFS & Marqueurs de l’inflammation (NFS + CRP)',
    reportType: 'Prise de sang / Hématologie',
    badge: 'Analyse fréquente',
    rawText: `LABORATOIRE DE BIOLOGIE MÉDICALE
BILAN HÉMATOLOGIQUE & INFLAMMATOIRE
Patient : Adulte (42 ans)

NUMÉRATION FORMULE SANGUINE (NFS) :
- Leucocytes : 11 200 /mm3 (VR : 4 000 - 10 000)
- Polynucléaires neutrophiles : 72 % soit 8 064 /mm3 (VR : 2 000 - 7 500)
- Polynucléaires éosinophiles : 2 % soit 224 /mm3 (VR : 40 - 500)
- Lymphocytes : 21 % soit 2 352 /mm3 (VR : 1 000 - 4 000)
- Monocytes : 5 % soit 560 /mm3 (VR : 200 - 1 000)
- Hématies (Globules rouges) : 4,85 M/mm3 (VR : 4,2 - 5,7)
- Hémoglobine : 14,3 g/dL (VR : 13,0 - 17,0)
- Hématocrite : 42,8 % (VR : 40 - 52)
- VGM (Volume Globulaire Moyen) : 88,2 fL (VR : 80 - 100)
- Plaquettes : 340 000 /mm3 (VR : 150 000 - 400 000)

BIOCHIMIE & INFLAMMATION :
- Protéine C-Réactive (CRP ultra-sensible) : 18,4 mg/L (VR : < 5,0)
- Vitesse de sédimentation (VS à la 1re heure) : 22 mm (VR : < 15)

CONCLUSION BIOLOGIQUE :
Modeste hyperleucocytose à prédominance de polynucléaires neutrophiles associée à une élévation modérée de la protéine C-réactive. Absence d'anémie ni de thrombopénie.`,
  },
  {
    id: 'bilan-lipidique-glycemie',
    title: 'Bilan Métabolique & Cholestérol (Lipides + Glycémie à jeun)',
    reportType: 'Prise de sang / Biochimie',
    badge: 'Contrôle de routine',
    rawText: `EXPLORATION D'UNE ANOMALIE LIPIDIQUE (EAL)
Prélèvement effectué après 12 heures de jeûne strict

BILAN LIPIDIQUE :
- Cholestérol total : 2,34 g/L soit 6,05 mmol/L (VR : < 2,00 g/L)
- Cholestérol HDL ("bon cholestérol") : 0,58 g/L (VR : > 0,40 g/L)
- Triglycérides : 1,45 g/L (VR : < 1,50 g/L)
- Cholestérol LDL calculé (Formule de Friedewald) : 1,47 g/L (Cible thérapeutique individuelle selon score cardiovasculaire)
- Rapport Cholestérol Total / HDL : 4,03 (Valeur souhaitable < 4,5)

MÉTABOLISME GLUCIDIQUE :
- Glycémie veineuse à jeun : 1,06 g/L soit 5,88 mmol/L (VR : 0,70 - 1,10 g/L)
- Hémoglobine glyquée (HbA1c) : 5,6 % (VR : < 6,0 %)

FONCTION RÉNALE :
- Créatininémie : 8,4 mg/L (74 µmol/L)
- Débit de Filtration Glomérulaire estimé (DFG selon CKD-EPI) : > 90 mL/min/1,73m² (Fonction rénale normale préservée).`,
  },
  {
    id: 'radio-scanner-thoracique',
    title: 'Compte-rendu Radiographie Pulmonaire Thoracique',
    reportType: 'Imagerie Médicale (Radiologie)',
    badge: 'Imagerie',
    rawText: `CENTRE D'IMAGERIE MÉDICALE ET DE RADIOLOGIE
EXAMEN : Radiographie du thorax face et profil droit
Indication : Toux persistante depuis 3 semaines sans fièvre

RÉSULTATS :
- Trame broncho-vasculaire péribronchique sans foyer de condensation parenchymateuse pulmonaire systématisée suspect d'infection aiguë.
- Pas de distension thoracique ni de syndrome alvéolaire décelable.
- Absence d'épanchement pleural visible dans les culs-de-sac costo-diaphragmatiques qui sont libres et aigus.
- Silhouette cardio-médiastinale d'indice cardiothoracique dans les limites normales (ICT < 0,50).
- Pas d'élargissement hilaire suspect.
- Structures osseuses thoraciques (arcs costaux, clavicules) sans anomalie traumatique ou lytique visible.

CONCLUSION :
Absence de foyer infectieux pleuropulmonaire évolutif visible sur ces clichés. Pas de signe de stase vasculaire.`,
  },
];

export const OFFICIAL_VACCINE_RECOMMENDATIONS = [
  {
    targetDisease: 'DTP (Diphtérie, Tétanos, Poliomyélite)',
    frequency: 'Rappels adultes à 25 ans, 45 ans, 65 ans, puis tous les 10 ans (75, 85 ans)',
    mandatory: true,
    importance: 'Protection indispensable contre le tétanos tellurique et réémergences.',
  },
  {
    targetDisease: 'Coqueluche',
    frequency: 'Rappel à 25 ans et stratégie de « cocooning » pour les futurs parents',
    mandatory: true,
    importance: 'Protection des nourrissons avant leur propre schéma vaccinal complet.',
  },
  {
    targetDisease: 'ROR (Rougeole, Oreillons, Rubéole)',
    frequency: '2 doses totales dans l’enfance (12 et 16-18 mois) ou rattrapage né après 1980',
    mandatory: true,
    importance: 'Évite les complications pulmonaires et neurologiques sévères de la rougeole.',
  },
  {
    targetDisease: 'Papillomavirus humains (HPV)',
    frequency: '2 doses entre 11 et 14 ans (filles et garçons) ou rattrapage jusqu’à 19 ans',
    mandatory: false,
    importance: 'Prévention majeure contre les cancers du col de l’utérus, de la gorge et de l’anus.',
  },
  {
    targetDisease: 'Méningocoques (B et ACWY)',
    frequency: 'Recommandé dès les premiers mois et chez les adolescents / jeunes adultes',
    mandatory: true,
    importance: 'Prévention des méningites bactériennes foudroyantes.',
  },
  {
    targetDisease: 'Hépatite B',
    frequency: 'Schéma classique nourrisson (dès 2 mois) ou rattrapage adolescent/adulte exposé',
    mandatory: true,
    importance: 'Protection à vie contre la cirrhose et le cancer primitif du foie.',
  },
  {
    targetDisease: 'Grippe saisonnière & Covid-19',
    frequency: 'Chaque automne pour les 65 ans et plus, femmes enceintes et personnes à risque',
    mandatory: false,
    importance: 'Réduction spectaculaire des hospitalisations hivernales et formes graves.',
  },
];

export const INITIAL_FAMILY_MEMBERS: FamilyMember[] = [
  {
    id: 'member_moi',
    name: 'Moi (Titulaire)',
    relationship: 'Moi',
    birthDate: '1988-06-14',
    bloodGroup: 'A+',
    treatingDoctor: 'Dr. Valérie Martin (Généraliste)',
    emergencyContact: '06 12 34 56 78',
    notes: 'Suivi annuel de prévention.',
  },
  {
    id: 'member_conjoint',
    name: 'Alexandre',
    relationship: 'Conjoint(e)',
    birthDate: '1986-11-23',
    bloodGroup: 'O+',
    treatingDoctor: 'Dr. Valérie Martin',
    emergencyContact: '06 98 76 54 32',
  },
  {
    id: 'member_enfant1',
    name: 'Léo',
    relationship: 'Enfant',
    birthDate: '2019-04-12',
    treatingDoctor: 'Dr. Philippe Dumas (Pédiatre)',
    notes: 'Entrée en école élémentaire.',
  },
];

export const INITIAL_SAMPLE_VACCINES: VaccineRecord[] = [
  {
    id: 'vac_1',
    memberId: 'member_moi',
    vaccineName: 'Repevax (DTP + Coqueluche)',
    targetDisease: 'Diphtérie, Tétanos, Poliomyélite, Coqueluche',
    administeredDate: '2023-05-10',
    boosterDate: '2033-05-10',
    status: 'up_to_date',
    notes: 'Rappel des 35 ans effectué au cabinet médical.',
  },
  {
    id: 'vac_2',
    memberId: 'member_enfant1',
    vaccineName: 'Priorix (ROR)',
    targetDisease: 'Rougeole, Oreillons, Rubéole',
    administeredDate: '2020-09-15',
    status: 'up_to_date',
  },
];

export const INITIAL_SAMPLE_ALLERGIES: AllergyRecord[] = [
  {
    id: 'alg_1',
    memberId: 'member_moi',
    allergen: 'Pénicilline / Amoxicilline',
    type: 'Médicamenteuse',
    severity: 'Sévère',
    reactionDescription: 'Éruption cutanée généralisée et œdème de Quincke en 2017.',
    emergencyAction: 'Contre-indication absolue. Préférer macrolides ou céphalosporines sous avis médical.',
  },
  {
    id: 'alg_2',
    memberId: 'member_enfant1',
    allergen: 'Arachide & Fruits à coque',
    type: 'Alimentaire',
    severity: 'Urgence Vitale (Choc)',
    reactionDescription: 'Difficulté respiratoire et urticaire aiguë après ingestion de cacahuète.',
    emergencyAction: 'Stylos auto-injecteur d’adrénaline (Anapen / Jext) toujours dans le cartable.',
  },
];
