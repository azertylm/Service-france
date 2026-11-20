import React, { useEffect, useRef, useState } from 'react';
import { Mail, Mic, MicOff, Camera, Sparkles, Printer, Copy, PenTool, AlertTriangle, CalendarClock, ListChecks, X, RefreshCw } from 'lucide-react';
import { sovereignFetch } from '../../utils/apiClient';

/**
 * Décodeur de courrier administratif — collez, dictez (ou photographiez) un courrier :
 * résumé en 3 phrases, date limite, démarches pas à pas, pièces à préparer, point de vigilance.
 * Rien n'est conservé par Service France : le texte part seulement chez le fournisseur IA choisi.
 */
interface Decodage {
  expediteur: string;
  objet: string;
  resume: string[];
  echeance: string;
  urgence: 'faible' | 'moyenne' | 'forte';
  actions: { titre: string; detail: string }[];
  documents: string[];
  vigilance: string;
  reponseEcrite: boolean;
  categorie: string;
}

interface Props {
  onNavigateToPlumeWithPrompt?: (prompt: string, category: string) => void;
}

const URGENCE = {
  faible: { libelle: 'Pas urgent', classe: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
  moyenne: { libelle: 'À traiter bientôt', classe: 'bg-amber-100 text-amber-900 border-amber-300' },
  forte: { libelle: 'Urgent', classe: 'bg-rose-100 text-rose-900 border-rose-300' },
} as const;

export const CourrierDecoderHub: React.FC<Props> = ({ onNavigateToPlumeWithPrompt }) => {
  const [texte, setTexte] = useState('');
  const [provisoire, setProvisoire] = useState('');
  const [photo, setPhoto] = useState<{ data: string; mimeType: string; name: string } | null>(null);
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [resultat, setResultat] = useState<Decodage | null>(null);
  const [copie, setCopie] = useState(false);

  // Dictée vocale (Web Speech API du navigateur) : seuls les résultats définitifs s'ajoutent au texte.
  const [dicteePossible, setDicteePossible] = useState(false);
  const [dictee, setDictee] = useState(false);
  const [erreurDictee, setErreurDictee] = useState<string | null>(null);
  const reco = useRef<any>(null);

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = 'fr-FR';
    r.continuous = true;
    r.interimResults = true;
    r.onresult = (e: any) => {
      let definitif = '';
      let encore = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) definitif += e.results[i][0].transcript;
        else encore += e.results[i][0].transcript;
      }
      if (definitif.trim()) setTexte((t) => (t.trim() ? `${t.trimEnd()} ` : '') + definitif.trim());
      setProvisoire(encore);
    };
    r.onerror = (e: any) => {
      setDictee(false);
      setProvisoire('');
      if (e.error === 'not-allowed' || e.error === 'service-not-allowed') setErreurDictee("Le micro n'est pas autorisé. Vous pouvez coller ou taper le texte.");
      else if (e.error !== 'aborted' && e.error !== 'no-speech') setErreurDictee('La dictée s’est arrêtée. Réessayez ou tapez le texte.');
    };
    r.onend = () => { setDictee(false); setProvisoire(''); };
    reco.current = r;
    setDicteePossible(true);
    return () => { try { r.abort(); } catch { /* rien */ } };
  }, []);

  const basculerDictee = () => {
    if (!reco.current) return;
    setErreurDictee(null);
    if (dictee) { reco.current.stop(); setDictee(false); return; }
    try { reco.current.start(); setDictee(true); } catch { /* déjà en cours */ }
  };

  const choisirPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.size > 8 * 1024 * 1024) { setErreur('Photo trop lourde (8 Mo maximum).'); return; }
    const lecteur = new FileReader();
    lecteur.onload = () => setPhoto({ data: lecteur.result as string, mimeType: f.type || 'image/jpeg', name: f.name });
    lecteur.readAsDataURL(f);
  };

  const decoder = async () => {
    if (!texte.trim() && !photo) { setErreur("Collez, dictez ou photographiez d'abord votre courrier."); return; }
    if (dictee) basculerDictee();
    setEnCours(true);
    setErreur(null);
    setResultat(null);
    try {
      const r = await sovereignFetch('/api/decode-courrier', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: texte.trim() || undefined, file: photo || undefined }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.success) throw new Error(d.error || 'Le courrier n’a pas pu être décodé.');
      setResultat(d.decodage);
      setTimeout(() => document.getElementById('decodage-courrier')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60);
    } catch (e: any) {
      setErreur(e?.message || 'Le courrier n’a pas pu être décodé.');
    } finally {
      setEnCours(false);
    }
  };

  const enTexte = (d: Decodage) => [
    `COURRIER DE : ${d.expediteur}`, d.objet ? `OBJET : ${d.objet}` : '', '',
    'EN 3 PHRASES', ...d.resume.map((p) => `- ${p}`), '',
    `DATE LIMITE : ${d.echeance}`, '',
    'CE QUE VOUS DEVEZ FAIRE', ...d.actions.map((a, i) => `${i + 1}. ${a.titre}${a.detail ? ` — ${a.detail}` : ''}`),
    ...(d.documents.length ? ['', 'À PRÉPARER', ...d.documents.map((x) => `- ${x}`)] : []),
    ...(d.vigilance ? ['', `ATTENTION : ${d.vigilance}`] : []),
    '', 'Décodé avec Service France (Alphabette). Aide à la compréhension, pas un avis juridique.',
  ].filter((l, i, t) => !(l === '' && t[i - 1] === '')).join('\n');

  const copier = async () => {
    if (!resultat) return;
    try { await navigator.clipboard.writeText(enTexte(resultat)); setCopie(true); setTimeout(() => setCopie(false), 2000); } catch { /* sélection manuelle */ }
  };

  const ecrireReponse = () => {
    if (!resultat || !onNavigateToPlumeWithPrompt) return;
    onNavigateToPlumeWithPrompt(
      `J'ai reçu un courrier de ${resultat.expediteur} (${resultat.objet}). En résumé : ${resultat.resume.join(' ')} Date limite : ${resultat.echeance}. Je souhaite y répondre : `,
      resultat.categorie,
    );
  };

  const bouton = 'min-h-[48px] px-4 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #decodage-courrier, #decodage-courrier * { visibility: visible !important; }
          #decodage-courrier { position: absolute; left: 0; top: 0; width: 100%; border: 0 !important; box-shadow: none !important; }
          #decodage-courrier .ecran-seul { display: none !important; }
        }
      `}</style>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-100 text-xs font-semibold border border-white/20">
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Décodeur de courrier administratif</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mt-3">Un courrier que vous ne comprenez pas ?</h2>
        <p className="text-base text-indigo-100 leading-relaxed mt-2">
          Collez-le, dictez-le ou prenez-le en photo. Vous obtenez un résumé en 3 phrases, la date limite et ce qu'il faut faire, étape par étape.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4" aria-labelledby="courrier-saisie">
        <h3 id="courrier-saisie" className="text-lg font-extrabold text-slate-900">Votre courrier</h3>
        <label htmlFor="texte-courrier" className="sr-only">Texte du courrier</label>
        <textarea
          id="texte-courrier"
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          rows={8}
          maxLength={12000}
          placeholder="Collez ici le texte du courrier (ou appuyez sur « Dicter » et lisez-le à voix haute)…"
          className="w-full rounded-xl border-2 border-slate-300 focus:border-indigo-600 focus:outline-none p-4 text-base leading-relaxed text-slate-900 bg-slate-50"
        />
        {provisoire && <p className="text-sm text-slate-600 italic" aria-live="polite">🎙️ {provisoire}</p>}

        <div className="flex flex-wrap gap-2">
          {dicteePossible && (
            <button type="button" onClick={basculerDictee} aria-pressed={dictee} className={`${bouton} ${dictee ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-slate-100 text-slate-900 border-2 border-slate-300 hover:bg-slate-200'}`}>
              {dictee ? <MicOff className="w-5 h-5" aria-hidden="true" /> : <Mic className="w-5 h-5" aria-hidden="true" />}
              {dictee ? 'Arrêter la dictée' : 'Dicter'}
            </button>
          )}
          <label className={`${bouton} bg-slate-100 text-slate-900 border-2 border-slate-300 hover:bg-slate-200`}>
            <Camera className="w-5 h-5" aria-hidden="true" />
            {photo ? 'Changer la photo' : 'Photo du courrier'}
            <input type="file" accept="image/*" capture="environment" onChange={choisirPhoto} className="sr-only" />
          </label>
          {(texte || photo) && (
            <button type="button" onClick={() => { setTexte(''); setPhoto(null); setResultat(null); setErreur(null); }} className={`${bouton} text-slate-700 hover:bg-slate-100`}>
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Effacer
            </button>
          )}
        </div>

        {photo && (
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 border border-slate-200 p-2">
            <img src={photo.data} alt="Aperçu de la photo du courrier" className="w-14 h-14 object-cover rounded-lg" />
            <span className="text-sm text-slate-700 flex-1 truncate">{photo.name}</span>
            <button type="button" onClick={() => setPhoto(null)} className={`${bouton} min-w-[44px] px-2 text-slate-700 hover:bg-slate-200`} aria-label="Retirer la photo">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}

        {erreurDictee && <p className="text-sm text-rose-800" role="alert">{erreurDictee}</p>}
        {dicteePossible && (
          <p className="text-xs text-slate-600">
            La dictée utilise la reconnaissance vocale de votre navigateur (sur Chrome, le son passe par les serveurs de Google). Pour un courrier sensible, préférez le copier-coller.
          </p>
        )}

        <button type="button" onClick={() => void decoder()} disabled={enCours} className={`${bouton} w-full bg-indigo-700 text-white hover:bg-indigo-800 text-base`}>
          <Sparkles className="w-5 h-5" aria-hidden="true" />
          {enCours ? 'Décodage en cours…' : 'Décoder mon courrier'}
        </button>
        <p className="text-xs text-slate-600">
          Service France ne conserve pas votre courrier : le texte part seulement chez le fournisseur d'IA que vous avez choisi (bouton « Ma clé IA »). Pensez à masquer vos numéros (sécurité sociale, compte…) avant d'envoyer.
        </p>
      </section>

      {erreur && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-start gap-3" role="alert">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{erreur}</p>
        </div>
      )}

      {resultat && (
        <article id="decodage-courrier" className="bg-white rounded-2xl border-2 border-indigo-200 p-5 sm:p-7 shadow-sm space-y-5" aria-live="polite">
          <header className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`px-3 py-1 rounded-full border text-sm font-bold ${URGENCE[resultat.urgence].classe}`}>{URGENCE[resultat.urgence].libelle}</span>
              <span className="text-sm text-slate-600">Courrier de <strong className="text-slate-900">{resultat.expediteur}</strong></span>
            </div>
            {resultat.objet && <h3 className="text-xl sm:text-2xl font-black text-slate-900">{resultat.objet}</h3>}
          </header>

          <section>
            <h4 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">En 3 phrases</h4>
            <div className="mt-2 space-y-2 text-base leading-relaxed text-slate-900">
              {resultat.resume.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </section>

          <section className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <CalendarClock className="w-6 h-6 text-amber-700 shrink-0" aria-hidden="true" />
            <div>
              <h4 className="text-base font-extrabold text-amber-950">Date limite</h4>
              <p className="text-base text-amber-950">{resultat.echeance}</p>
            </div>
          </section>

          <section>
            <h4 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide flex items-center gap-2"><ListChecks className="w-5 h-5" aria-hidden="true" /> Ce que vous devez faire</h4>
            <ol className="mt-3 space-y-3">
              {resultat.actions.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <span className="w-8 h-8 shrink-0 rounded-full bg-indigo-700 text-white font-black flex items-center justify-center" aria-hidden="true">{i + 1}</span>
                  <div>
                    <p className="font-bold text-slate-900 text-base">{a.titre}</p>
                    {a.detail && <p className="text-slate-700 text-[15px] leading-relaxed">{a.detail}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {resultat.documents.length > 0 && (
            <section>
              <h4 className="text-base font-extrabold text-indigo-900 uppercase tracking-wide">À préparer</h4>
              <ul className="mt-2 list-disc pl-6 space-y-1 text-base text-slate-900">
                {resultat.documents.map((d, i) => <li key={i}>{d}</li>)}
              </ul>
            </section>
          )}

          {resultat.vigilance && (
            <section className="flex items-start gap-3 rounded-xl bg-rose-50 border border-rose-200 p-4" role="note">
              <AlertTriangle className="w-6 h-6 text-rose-700 shrink-0" aria-hidden="true" />
              <p className="text-base text-rose-950"><strong>Attention : </strong>{resultat.vigilance}</p>
            </section>
          )}

          <p className="text-xs text-slate-600">
            Explication écrite par une IA pour vous aider à comprendre : ce n'est pas un avis juridique. En cas de doute, contactez l'organisme qui vous écrit, ou un espace France services (accompagnement public et gratuit).
          </p>

          <div className="ecran-seul grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button type="button" onClick={copier} className={`${bouton} border-2 border-indigo-700 text-indigo-800 hover:bg-indigo-50`}>
              <Copy className="w-4 h-4" aria-hidden="true" /> {copie ? 'Copié' : 'Copier'}
            </button>
            <button type="button" onClick={() => window.print()} className={`${bouton} border-2 border-indigo-700 text-indigo-800 hover:bg-indigo-50`}>
              <Printer className="w-4 h-4" aria-hidden="true" /> Imprimer / PDF
            </button>
            {onNavigateToPlumeWithPrompt && (
              <button type="button" onClick={ecrireReponse} className={`${bouton} bg-indigo-700 text-white hover:bg-indigo-800`}>
                <PenTool className="w-4 h-4" aria-hidden="true" /> {resultat.reponseEcrite ? 'Écrire la réponse' : 'Écrire un courrier'}
              </button>
            )}
          </div>
        </article>
      )}
    </div>
  );
};
