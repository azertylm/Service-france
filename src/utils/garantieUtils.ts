import { ProductWarranty } from '../types/garantie';

export interface WarrantyStatusInfo {
  status: 'active' | 'expiring_soon' | 'expired';
  daysRemaining: number;
  totalDays: number;
  daysElapsed: number;
  percentElapsed: number;
  label: string;
  badgeClass: string;
  colorClass: string;
}

export function computeWarrantyStatus(
  purchaseDateStr: string,
  endDateStr: string
): WarrantyStatusInfo {
  const now = new Date();
  const start = new Date(purchaseDateStr);
  const end = new Date(endDateStr);

  const totalTime = end.getTime() - start.getTime();
  const timeRemaining = end.getTime() - now.getTime();
  const timeElapsed = now.getTime() - start.getTime();

  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));
  const totalDays = Math.max(1, Math.round(totalTime / (1000 * 60 * 60 * 24)));
  const daysElapsed = Math.round(timeElapsed / (1000 * 60 * 60 * 24));

  let percentElapsed = Math.min(100, Math.max(0, Math.round((daysElapsed / totalDays) * 100)));

  if (daysRemaining <= 0) {
    return {
      status: 'expired',
      daysRemaining: 0,
      totalDays,
      daysElapsed,
      percentElapsed: 100,
      label: 'Garantie expirée',
      badgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
      colorClass: 'text-rose-700',
    };
  }

  if (daysRemaining <= 30) {
    return {
      status: 'expiring_soon',
      daysRemaining,
      totalDays,
      daysElapsed,
      percentElapsed,
      label: `Expire dans ${daysRemaining} j`,
      badgeClass: 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse',
      colorClass: 'text-amber-800',
    };
  }

  return {
    status: 'active',
    daysRemaining,
    totalDays,
    daysElapsed,
    percentElapsed,
    label: `${daysRemaining} j restants`,
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    colorClass: 'text-emerald-700',
  };
}

/**
 * Calcule la date de fin de garantie à partir de la date d'achat et du nombre de mois.
 */
export function calculateWarrantyEndDate(purchaseDateStr: string, months: number = 24): string {
  try {
    const date = new Date(purchaseDateStr);
    if (isNaN(date.getTime())) {
      const now = new Date();
      now.setFullYear(now.getFullYear() + 2);
      return now.toISOString().split('T')[0];
    }
    date.setMonth(date.getMonth() + months);
    return date.toISOString().split('T')[0];
  } catch {
    const fallback = new Date();
    fallback.setFullYear(fallback.getFullYear() + 2);
    return fallback.toISOString().split('T')[0];
  }
}

/**
 * Génère un fichier iCalendar (.ics) pour programmer un rappel 30 jours avant la fin de garantie
 */
export function generateWarrantyIcs(warranty: ProductWarranty): string {
  const endDate = new Date(warranty.warrantyEndDate);
  const reminderDate = new Date(endDate);
  reminderDate.setDate(reminderDate.getDate() - 30);

  const formatDate = (d: Date) => {
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const nowFormatted = formatDate(new Date());
  const startEvent = formatDate(reminderDate);
  const endEvent = formatDate(new Date(reminderDate.getTime() + 60 * 60 * 1000)); // 1 hour event

  const title = `🚨 RAPPEL : Fin de garantie dans 30 jours — ${warranty.brand} ${warranty.productName}`;
  const description = `Rappel automatique France Service :\\nLa garantie légale de conformité (2 ans) pour votre ${warranty.brand} ${warranty.productName} acheté chez ${warranty.store} le ${warranty.purchaseDate} arrive à échéance le ${warranty.warrantyEndDate}.\\n\\nVérifiez le bon fonctionnement de l appareil. En cas de panne ou défaut naissant, demandez une prise en charge SAV gratuite sans frais avant cette date.\\nNuméro de ticket/facture : ${warranty.receiptNumber || 'N/A'}`;

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//France Service//ScanGarantie v1.0//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:scangarantie-${warranty.id}@franceservice.local`,
    `DTSTAMP:${nowFormatted}`,
    `DTSTART:${startEvent}`,
    `DTEND:${endEvent}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${warranty.store}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Fin de garantie ${warranty.productName} dans 30 jours`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/**
 * Déclenche le téléchargement d'un fichier dans le navigateur
 */
export function downloadFile(content: string, filename: string, mimeType: string = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Générateur de lettre de mise en demeure SAV (Garantie légale de conformité)
 * Fondé sur les articles L. 217-3 et suivants du Code de la consommation
 */
export function generateWarrantyDisputeLetter(options: {
  warranty: ProductWarranty;
  userFullName?: string;
  userAddress?: string;
  userCity?: string;
  userPhone?: string;
  userEmail?: string;
  defectDescription: string;
  demandType: 'reparation_gratuite' | 'remplacement_neuf' | 'remboursement_integral';
}): string {
  const {
    warranty,
    userFullName = '[Votre Prénom et NOM]',
    userAddress = '[Votre Adresse complète]',
    userCity = '[Code Postal et VILLE]',
    userPhone = '[Votre Numéro de téléphone]',
    userEmail = '[Votre Adresse email]',
    defectDescription,
    demandType,
  } = options;

  const today = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  let demandText = '';
  if (demandType === 'reparation_gratuite') {
    demandText = `la réparation intégrale et gratuite de cet appareil, sans aucun frais de pièces, de main-d'œuvre, de déplacement ou de transport à ma charge (conformément à l'article L. 217-11 du Code de la consommation)`;
  } else if (demandType === 'remplacement_neuf') {
    demandText = `le remplacement de l'appareil par un bien neuf identique ou de caractéristiques équivalentes, sans aucun frais à ma charge (conformément aux articles L. 217-8 et L. 217-11 du Code de la consommation)`;
  } else {
    demandText = `la résolution de la vente et le remboursement intégral du prix d'achat (${warranty.purchasePrice ? warranty.purchasePrice + ' € TTC' : 'prix facturé'}) sous 14 jours, compte tenu de l'impossibilité ou du délai excessif de réparation (conformément aux articles L. 217-14 et L. 217-16 du Code de la consommation)`;
  }

  return `${userFullName}
${userAddress}
${userCity}
Tél. : ${userPhone}
Email : ${userEmail}

À l'attention du Service Après-Vente / Direction Clientèle
${warranty.store}
[Adresse du magasin ou siège social]

Fait le ${today}

LETTRE RECOMMANDÉE AVEC ACCUSÉ DE RÉCEPTION (LRAR)
OU REMISE EN MAIN PROPRE CONTRE DÉCHARGE EN MAGASIN

Objet : Mise en demeure — Mise en œuvre de la garantie légale de conformité
Réf. appareil : ${warranty.brand} ${warranty.productName} ${warranty.modelReference ? `(Réf : ${warranty.modelReference})` : ''}
Date d'achat : ${new Date(warranty.purchaseDate).toLocaleDateString('fr-FR')}
Facture / Ticket n° : ${warranty.receiptNumber || 'Voir copie ci-jointe'}
${warranty.serialNumber ? `Numéro de série : ${warranty.serialNumber}` : ''}

Madame, Monsieur,

En date du ${new Date(warranty.purchaseDate).toLocaleDateString('fr-FR')}, j'ai acheté au sein de votre enseigne ${warranty.store} l'appareil suivant : ${warranty.brand} ${warranty.productName}${warranty.purchasePrice ? ` pour un montant de ${warranty.purchasePrice} € TTC` : ''}.

Or, cet appareil présente actuellement un défaut de conformité majeur empêchant son usage normal, à savoir :
« ${defectDescription || "Dysfonctionnement soudain de l'appareil ne répondant plus à ses fonctions de base"} ».

Je vous rappelle que conformément aux dispositions d'ordre public des articles L. 217-3 et suivants du Code de la consommation :

1. Le vendeur est tenu de livrer un bien conforme au contrat et répond des défauts de conformité existant lors de la délivrance du bien (Art. L. 217-3).
2. Tout défaut qui apparaît dans un délai de vingt-quatre mois à compter de la délivrance du bien est présumé exister au moment de la délivrance, sans que le consommateur n'ait à apporter la moindre preuve d'un vice caché (Art. L. 217-7).
3. La mise en conformité du bien a lieu sans aucun frais pour le consommateur, qu'il s'agisse des frais d'envoi, de transport, de main-d'œuvre ou de pièces détachées (Art. L. 217-11).
4. Cette mise en conformité doit intervenir dans un délai raisonnable qui ne peut être supérieur à trente jours suivant la demande du consommateur (Art. L. 217-10).
5. Tout appareil réparé dans le cadre de la garantie légale de conformité bénéficie en outre d'une prolongation de garantie de six mois (Art. L. 217-13).

Par la présente, je vous mets formellement en demeure d'assurer ${demandText}, dans un délai maximal de 30 jours à compter de la réception de cette lettre.

À défaut de prise en charge sous ce délai, je me réserve le droit de solliciter le remboursement intégral du prix d'achat, des dommages et intérêts pour privation de jouissance, et le cas échéant de saisir le Médiateur de la consommation ou la juridiction de proximité compétente.

Dans l'attente de votre bon de retour ou des instructions pour le dépôt au SAV, veuillez agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Signature : _______________________________

Pièce jointe :
- Copie de la facture / ticket de caisse certifié (Réf : ${warranty.receiptNumber || 'Achat du ' + warranty.purchaseDate})`;
}

/**
 * Compression locale d'image côté client (Canvas) pour préserver le ticket thermique sans saturer le stockage
 */
export async function compressTicketImage(file: File, maxDimension = 1400, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDimension) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        // Amélioration du contraste pour la lisibilité des tickets thermiques
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.onerror = () => reject(new Error('Impossible de charger l image du ticket.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Erreur de lecture du fichier.'));
    reader.readAsDataURL(file);
  });
}
