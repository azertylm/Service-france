import React from 'react';
import {
  Scale,
  Compass,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Building,
  HeartHandshake,
  Heart,
  Stethoscope,
  Lock,
  Smartphone,
  FileKey,
  KeyRound,
  Coins,
  Zap,
  HeartPulse,
  PhoneCall,
  Wrench,
  Camera,
  FileX,
  ShieldAlert,
  Ban,
  Building2,
  Receipt,
} from 'lucide-react';
import { MainService } from './Header';

interface ServiceFranceHomeProps {
  onSelectService: (service: MainService) => void;
  onOpenZeroKnowledge?: () => void;
  onOpenKeychain?: () => void;
}

export const ServiceFranceHome: React.FC<ServiceFranceHomeProps> = ({
  onSelectService,
  onOpenZeroKnowledge,
  onOpenKeychain,
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* Platform Manifesto Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-xs">
          <span className="flex h-2.5 w-3.5 rounded-xs overflow-hidden border border-white/20">
            <span className="w-1.5 bg-[#002654]" />
            <span className="w-1.5 bg-white" />
            <span className="w-1.5 bg-[#CE1126]" />
          </span>
          <span>France Service · Suite Civique & Familiale d'Utilité Publique</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Neuf services citoyens d'intérêt général,{' '}
          <span className="underline decoration-amber-400 decoration-wavy decoration-3">
            zéro publicité
          </span>
          .
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          <strong>France Service</strong> réunit des outils numériques souverains conçus pour vulgariser le droit,
          sécuriser vos états des lieux et cautions, résilier sans frais les abonnements abusifs, guider vos démarches administratives pas-à-pas, détecter vos aides non-réclamées, préserver vos tickets et garanties 2 ans, sécuriser vos données médicales, rédiger vos correspondances officielles et sublimer le patrimoine architectural.
        </p>

        <p className="text-xs text-slate-400">
          Conçue et éditée par <strong>ALPHABETTE SASU</strong> (fondée par Valentin RICHAUD à La Grande-Motte).
        </p>
      </div>

      {/* ZERO-KNOWLEDGE & SOVEREIGNTY GUARANTEE BANNER */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-emerald-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <span className="text-[11px] uppercase tracking-wider font-black text-emerald-300">
              Engagement Solennel Zero-Knowledge
            </span>
          </div>

          <blockquote className="text-sm sm:text-base font-bold text-white leading-relaxed italic border-l-3 border-emerald-500 pl-3">
            « Vos données ne quittent pas votre appareil de manière lisible. ALPHABETTE SASU n'a aucun moyen technique d'accéder à vos documents, analyses ou courriers. »
          </blockquote>

          <p className="text-xs text-slate-300">
            Stockage 100 % local (IndexedDB chiffré) · Synchronisation multi-appareils (E2EE) par clé éphémère · Profils familiaux cloisonnés par code PIN.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
          {onOpenZeroKnowledge && (
            <button
              onClick={onOpenZeroKnowledge}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              <span>Synchro multi-appareils (E2EE)</span>
            </button>
          )}

          {onOpenKeychain && (
            <button
              onClick={onOpenKeychain}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <FileKey className="w-4 h-4 text-amber-400" />
              <span>Mon trousseau administratif</span>
            </button>
          )}
        </div>
      </div>

      {/* QUICK ACCESS EMERGENCY & 114 BANNER */}
      <div className="max-w-5xl mx-auto bg-gradient-to-r from-rose-950 via-rose-900 to-red-950 text-white rounded-3xl p-5 sm:p-6 shadow-lg border-2 border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md shrink-0 animate-pulse">
            <HeartPulse className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-black text-white">
                🚨 Urgences Vitales & Balise SMS 114
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                100% Hors-ligne
              </span>
            </div>
            <p className="text-xs text-rose-200 mt-0.5">
              Accès direct 15, 17, 18, 3919 (violences), 119 (enfance), 3018 (cyberharcèlement) & guide des gestes qui sauvent.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectService('urgence')}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-rose-50 text-rose-950 font-black text-xs flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-md shrink-0"
        >
          <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
          <span>Ouvrir l'Espace Urgence</span>
        </button>
      </div>

      {/* The Five Flagship Services Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto items-stretch">
        {/* ========================================= */}
        {/* SERVICE 1: DROITS SOCIAUX (NOUVEAU)        */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-amber-300 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Anti Non-Recours
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Coins className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                Pouvoir d'Achat & CAF
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Décodeur de Droits Sociaux
              </h2>
              <p className="text-[11px] font-semibold text-amber-700 italic mt-0.5">
                Simulateur d'aides non-réclamées
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-amber-50/70 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-amber-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Beaucoup de familles passent à côté de la prime d'activité, des chèques énergie ou des aides locales du CCAS par complexité administrative.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Court questionnaire local :</strong> Sans envoyer aucune donnée sur le web.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Calcul immédiat :</strong> Prime d'activité, Chèque énergie, CSS, aides CCAS.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Passerelle 1-clic :</strong> Prépare automatiquement votre demande officielle.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-950 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Récupération directe de centaines d'euros d'aides légitimes.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('droits')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-slate-950"
            >
              <span>Calculer mes aides théoriques</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-amber-400" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE 2: CLAIRCONTRAT                   */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5 text-amber-400" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                Protection Juridique
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                ClairContrat
              </h2>
              <p className="text-[11px] font-semibold text-amber-700 italic mt-0.5">
                Le décodeur juridique du quotidien
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-slate-50 border-l-4 border-slate-900 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Personne ne lit les baux de location, contrats d'assurance ou devis d'artisans, bourrés de clauses pièges.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Analyse confidentielle :</strong> PDF / photo sans revente de données.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Vigilance :</strong> Détection des clauses abusives et illicites.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Délais & résiliation :</strong> Préavis et pénalités cachées.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-xs text-amber-950 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Protection juridique sans avocat pour une simple relecture.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('claircontrat')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-slate-950"
            >
              <span>Accéder à ClairContrat</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE: RÉSIL-EXPRESS (NOUVEAU)          */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-rose-300 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-rose-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Pouvoir d'Achat
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <FileX className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-900 bg-rose-100 px-2 py-0.5 rounded-full">
                Désengagement
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Résil-Express
              </h2>
              <p className="text-[11px] font-semibold text-rose-700 italic mt-0.5">
                Le gestionnaire de désengagement et d'économies
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-rose-50/70 border-l-4 border-rose-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-rose-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Salle de sport, abonnements internet, assurances doublons, télésurveillance… Les entreprises multiplient les démarches complexes et préavis stricts pour empêcher de partir.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sélection ou photo :</strong> 40+ grandes enseignes ou scan OCR intelligent de votre facture.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Lois françaises adaptées :</strong> Loi Hamon (&gt; 1 an), loi Chatel (sans préavis), résiliation 3 clics, hausse unilatérale.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Génération LRAR immédiate :</strong> Adresse certifiée du service résiliation, articles exacts et sommation SEPA.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Gain direct pour le foyer :</strong> Économie immédiate de plusieurs dizaines d'euros par mois sur les abonnements oubliés.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('resiliation')}
              className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-rose-800"
            >
              <span>Accéder à Résil-Express</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE: ÉTATDESLIEUX PROTECT (NOUVEAU)   */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-sky-300 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-sky-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Bouclier Logement
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-900 bg-sky-100 px-2 py-0.5 rounded-full">
                Protection Caution
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                ÉtatDesLieux Protect
              </h2>
              <p className="text-[11px] font-semibold text-sky-700 italic mt-0.5">
                Le bouclier locataires et propriétaires
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-sky-50/70 border-l-4 border-sky-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-sky-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Lors du départ d'un logement, les retenues sur caution pour « dégradations » provoquent des litiges constants, souvent par manque de preuves tangibles ou par facturation abusive de l'usure naturelle.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Photos horodatées infalsifiables :</strong> Prise de vue guidée à l’entrée et sortie avec empreinte SHA-256 et relevé des compteurs.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Analyse d’usure IA & Barèmes :</strong> Qualification formelle de la vétusté normale (100% propriétaire, Décret 2016-382) vs dégradation locative.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Mise en demeure automatique :</strong> Génération immédiate de la LRAR avec pénalité légale de 10% du loyer par mois de retard (Art. 22 Loi 1989).
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Protection financière immédiate :</strong> Restitution intégrale du dépôt de garantie (souvent 500 € à 1 500 € indûment confisqués).
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('etatdeslieux')}
              className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-sky-800"
            >
              <span>Accéder à ÉtatDesLieux Protect</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE: AUTOBAILLEUR (NOUVEAU)           */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-emerald-400 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-700 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            0% Commission
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                Gestion Directe
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                AutoBailleur
              </h2>
              <p className="text-[11px] font-semibold text-emerald-700 italic mt-0.5">
                Le gestionnaire locatif transparent et sans commission
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-emerald-50/80 border-l-4 border-emerald-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-emerald-900 font-bold block">
                Le problème :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Beaucoup de particuliers gèrent eux-mêmes leur location pour éviter les 8 % de frais d'agence, mais commettent des erreurs juridiques lourdes sur les quittances, les révisions de loyer ou la régularisation des charges.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait le module :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Calculateur d'indexation IRL INSEE :</strong> Application stricte de l'indice officiel dès publication pour recalculer le loyer à la date anniversaire, sans risque de litige ni perte de délai ALUR.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Générateur de quittances conformes :</strong> Édition en 1 clic d'une quittance au format A4/PDF imprimable avec ventilation obligatoire du loyer nu et des provisions (Art. 21 loi 1989).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Décompte annuel de charges :</strong> Ventilation automatique charges récupérables (TEOM avec déduction 8% frais fiscaux, entretien communs, ascenseur 73%) vs non récupérables (Décret 87-713).
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Sécurité juridique & 0 € de frais :</strong> Protection juridique totale pour le bailleur, clarté pour le locataire et 600 € à 1 200 € d'honoraires d'agence économisés par an.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('autobailleur')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-emerald-800"
            >
              <span>Accéder à AutoBailleur</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE: VIGILANCE SUCCESSION (NOUVEAU)   */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-stone-400 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-stone-800 text-amber-300 font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Soutien Familles
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-stone-800 text-amber-400 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-amber-400/20" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-800 bg-stone-100 px-2 py-0.5 rounded-full">
                Après Obsèques
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Vigilance Succession
              </h2>
              <p className="text-[11px] font-semibold text-stone-600 italic mt-0.5">
                Le guide des démarches après obsèques
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-stone-50/80 border-l-4 border-stone-800 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-stone-900 font-bold block">
                Le problème :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Dans les 30 jours suivant la perte d'un parent, la famille en deuil doit contacter entre 10 et 20 organismes différents (banques, retraites, mutuelle, bailleur, impôts). C'est un calvaire administratif.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait le module :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Parcours chronologique :</strong> Échéances claires selon la date du décès : 48h (mairie, employeur), 7 jours (banques, CPAM), 30 jours (retraites, impôts) et 6 mois (notaire).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Courriers officiels en 1 clic :</strong> Pré-remplissage instantané de l'ensemble des lettres d'information avec fondements juridiques et liste des pièces requises.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Bouclier anti-prélèvements :</strong> Blocage automatique et révocation de plein droit de tout prélèvement indu postérieur à la date du décès (Art. 2003 C. Civ.).
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-xs text-amber-950 flex items-start gap-1.5">
              <Ban className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Protection financière et sérénité :</strong> Stoppe les débits bancaires illégitimes et active immédiatement le déblocage des capitaux décès (3 910 € CPAM) et de réversion.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('succession')}
              className="w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-slate-950"
            >
              <span>Accéder à Vigilance Succession</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE: TUTEUR NUMÉRIQUE                 */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-indigo-300 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Feuilles de Route
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-900 bg-indigo-100 px-2 py-0.5 rounded-full">
                Guichet Unique
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Tuteur Numérique
              </h2>
              <p className="text-[11px] font-semibold text-indigo-700 italic mt-0.5">
                L'assistant pas-à-pas pour les démarches en ligne
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-indigo-50/70 border-l-4 border-indigo-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-indigo-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Même en ayant un courrier, beaucoup d'usagers bloquent face aux interfaces complexes des sites de l'État (FranceConnect, ANTS pour les cartes grises, déclaration d'impôts, CAF).
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Recherche directe :</strong> Décrivez ce que vous devez faire (carte grise, amende FPS, bourse...).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Checklist des pièces :</strong> Liste exacte à réunir avant connexion avec astuces anti-rejet.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Feuille de route en 4 étapes :</strong> Accès officiel, saisie, contrôle et preuve horodatée.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-indigo-50/80 border border-indigo-200 rounded-xl p-2.5 text-xs text-indigo-950 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Zéro blocage, protection contre les faux sites payants et dossier validé du 1er coup.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('tuteur')}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-indigo-800"
            >
              <span>Ouvrir le Tuteur Numérique</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE 3: SCANGARANTIE (NOUVEAU)         */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-blue-300 hover:border-slate-900 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-blue-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-bl-xl tracking-wider">
            Garantie 2 ans
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                Tickets & SAV
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                ScanGarantie
              </h2>
              <p className="text-[11px] font-semibold text-blue-700 italic mt-0.5">
                Coffre-fort de tickets & garanties légales
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-blue-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Les tickets de caisse thermiques s'effacent, on perd les dates de garantie légale de conformité (2 ans) et on oublie de faire jouer le SAV sur l'électroménager.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Scan rapide :</strong> Photo du ticket ou facture avec préservation anti-effacement.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Extraction auto :</strong> Date d'achat, fin de garantie 24 mois, référence appareil.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Rappels & Courrier SAV :</strong> Alerte -30 jours et mise en demeure pré-remplie pour exiger la réparation sans frais.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-2.5 text-xs text-blue-950 flex items-start gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Preuve numérique pérenne et réclamation SAV gratuite sans avocat.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('garantie')}
              className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:bg-blue-800"
            >
              <span>Accéder à ScanGarantie</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE 4: PATRIMOINE EN POCHE            */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-amber-500 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5 text-slate-950" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full">
                Culture & Territoire
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Patrimoine en Poche
              </h2>
              <p className="text-[11px] font-semibold text-indigo-700 italic mt-0.5">
                Guide culturel et architectural
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-amber-50/60 border-l-4 border-amber-500 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-amber-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Les applications touristiques sont saturées de publicités sponsorisées par des commerces.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Modernisme & Histoire :</strong> La Grande-Motte (Balladur), Aigues-Mortes.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Sobriété batterie :</strong> Guidage sans traçage permanent énergivore.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Quiz & Scanner :</strong> Énigmes d'observation et décodage de façades.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-2.5 text-xs text-indigo-950 flex items-start gap-1.5">
              <Building className="w-3.5 h-3.5 text-indigo-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Valorisation architecturale désintéressée sans pub.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('patrimoine')}
              className="w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
            >
              <span>Accéder à Patrimoine</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE 5: PLUME CITOYENNE                */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-600 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full">
                Fracture Numérique
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                PlumeCitoyenne
              </h2>
              <p className="text-[11px] font-semibold text-emerald-700 italic mt-0.5">
                L'écrivain public administratif
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-emerald-50/60 border-l-4 border-emerald-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-emerald-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                La fracture administrative paralyse des millions d'usagers (CAF, impôts, CPAM, litiges).
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Dictée vocale & mots simples :</strong> Décrivez votre situation oralement.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Courrier officiel :</strong> Articles de loi et ton administratif exact.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fiches guichets :</strong> Vers quel service et avec quelles pièces.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-1.5">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Rempart social contre le non-recours aux droits fondamentaux.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('plume')}
              className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
            >
              <span>Accéder à PlumeCitoyenne</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* ========================================= */}
        {/* SERVICE 6: MÉMOSANTÉ                      */}
        {/* ========================================= */}
        <div className="bg-white rounded-3xl border-2 border-slate-200 hover:border-teal-600 transition-all p-6 shadow-sm hover:shadow-xl flex flex-col justify-between group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-11 h-11 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                <Heart className="w-5 h-5 fill-white" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-900 bg-teal-100 px-2 py-0.5 rounded-full">
                Santé 100% Privée
              </span>
            </div>

            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                MémoSanté
              </h2>
              <p className="text-[11px] font-semibold text-teal-800 italic mt-0.5">
                Le carnet médical familial 100 % privé
              </p>
            </div>

            {/* Le constat */}
            <div className="bg-teal-50/60 border-l-4 border-teal-600 p-3 rounded-r-xl space-y-1">
              <strong className="text-[10px] uppercase tracking-wider text-teal-900 font-bold block">
                Le constat :
              </strong>
              <p className="text-xs text-slate-700 leading-relaxed">
                Les citoyens hésitent à confier leurs données de santé aux géants du web par peur du profilage ou piratage.
              </p>
            </div>

            {/* Ce que fait l'application */}
            <div className="space-y-2">
              <strong className="text-xs uppercase tracking-wider text-slate-900 font-bold block">
                Ce que fait l'outil :
              </strong>
              <ul className="space-y-1.5 text-xs text-slate-700">
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Suivi familial :</strong> Ordonnances, vaccins, allergies pour tout le foyer.
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>IA d'explication :</strong> Traduit les termes barbares d'analyses (sans diagnostic).
                  </span>
                </li>
                <li className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Fiche d'urgence :</strong> Carte imprimable pour les secours et l'école.
                  </span>
                </li>
              </ul>
            </div>

            {/* Valeur ajoutée */}
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-2.5 text-xs text-teal-950 flex items-start gap-1.5">
              <Lock className="w-3.5 h-3.5 text-teal-700 shrink-0 mt-0.5" />
              <span>
                <strong>Valeur ajoutée :</strong> Stockage local/chiffré, souveraineté totale sur des données intimes.
              </span>
            </div>
          </div>

          <div className="pt-5">
            <button
              onClick={() => onSelectService('memosante')}
              className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs group-hover:shadow-md"
            >
              <span>Accéder à MémoSanté</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* Citizen Trust & Privacy Guarantees */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 max-w-6xl mx-auto shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center mb-6">
          Les engagements républicains de Service France
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center sm:text-left">
          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              1
            </div>
            <h4 className="font-bold text-sm text-slate-900">Confidentialité intégrale</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vos baux, réclamations CAF et litiges personnels ne sont ni indexés ni vendus. Zéro revente de vos données.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              2
            </div>
            <h4 className="font-bold text-sm text-slate-900">Données de santé souveraines</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              MémoSanté fonctionne en stockage local sur votre appareil. Aucune base de données médicale centrale.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              3
            </div>
            <h4 className="font-bold text-sm text-slate-900">Zéro sponsoring commercial</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aucun restaurant, pharmacie ou commerce ne peut acheter de visibilité ou d'emplacement sponsorisé.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-xs mx-auto sm:mx-0">
              4
            </div>
            <h4 className="font-bold text-sm text-slate-900">Sobriété & Accessibilité</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interface allégée, respect de l'autonomie batterie et explications rédigées sans jargon technique.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
