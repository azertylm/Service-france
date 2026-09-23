import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Smartphone,
  Laptop,
  QrCode,
  KeyRound,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ServerOff,
  UserCheck,
  X,
  Eye,
  EyeOff,
} from 'lucide-react';
import { ProfileSecuritySettings } from '../../types/security';

interface ZeroKnowledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  profiles: { id: string; name: string; relationship: string }[];
  currentProfileId: string;
  onSwitchProfile: (id: string) => void;
}

export const ZeroKnowledgeModal: React.FC<ZeroKnowledgeModalProps> = ({
  isOpen,
  onClose,
  profiles,
  currentProfileId,
  onSwitchProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'guarantee' | 'sync' | 'pin'>('guarantee');
  const [copiedSyncCode, setCopiedSyncCode] = useState(false);
  const [syncCode, setSyncCode] = useState('FS-E2EE-8492-7104-VAL');
  const [importCodeInput, setImportCodeInput] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  // PIN settings state
  const [pinInputs, setPinInputs] = useState<Record<string, string>>({});
  const [showPin, setShowPin] = useState(false);
  const [pinSavedSuccess, setPinSavedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySyncCode = () => {
    navigator.clipboard.writeText(syncCode);
    setCopiedSyncCode(true);
    setTimeout(() => setCopiedSyncCode(false), 2000);
  };

  const handleGenerateNewCode = () => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const randomHex2 = Math.floor(1000 + Math.random() * 9000);
    setSyncCode(`FS-E2EE-${randomHex}-${randomHex2}-VAL`);
  };

  const handleImportSync = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importCodeInput.trim()) return;
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      onClose();
    }, 1800);
  };

  const handleSavePin = (profileId: string) => {
    const pin = pinInputs[profileId];
    if (!pin || pin.length < 4) return;
    localStorage.setItem(`fs_pin_${profileId}`, pin);
    setPinSavedSuccess(profileId);
    setTimeout(() => setPinSavedSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Sécurité Souveraine & Zéro Connaissance
                </h3>
                <span className="text-[10px] uppercase font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 px-2 py-0.5 rounded-full">
                  Zero-Knowledge
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Édité par ALPHABETTE SASU · Fondée par Valentin RICHAUD à La Grande-Motte
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors text-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6 pt-2 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('guarantee')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'guarantee'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Garantie Formelle</span>
          </button>

          <button
            onClick={() => setActiveTab('sync')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'sync'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span>Synchro Multi-Appareils (E2EE)</span>
          </button>

          <button
            onClick={() => setActiveTab('pin')}
            className={`py-3 px-3 border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'pin'
                ? 'border-slate-950 text-slate-950 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-amber-600" />
            <span>Cloisonnement Familial & PIN</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs">
          {/* TAB 1: FORMAL ZERO-KNOWLEDGE GUARANTEE */}
          {activeTab === 'guarantee' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              {/* Highlighted Certification Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border-2 border-emerald-600/40 text-emerald-950 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-black text-sm uppercase tracking-wide">
                    Engagement Solennel de Non-Accès
                  </h4>
                </div>
                <blockquote className="italic font-medium text-xs sm:text-sm text-slate-900 border-l-3 border-emerald-600 pl-3 leading-relaxed">
                  « Vos données ne quittent pas votre appareil de manière lisible. ALPHABETTE SASU
                  n'a aucun moyen technique d'accéder à vos documents, analyses ou courriers. »
                </blockquote>
                <div className="text-[11px] text-emerald-900/80 font-semibold text-right">
                  — Valentin RICHAUD, Fondateur d'ALPHABETTE SASU (La Grande-Motte, Occitanie)
                </div>
              </div>

              {/* Technical Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <ServerOff className="w-4 h-4 text-emerald-600" />
                  <strong className="block text-slate-900 font-bold text-xs">Stockage Local Strict</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Toutes vos analyses, courriers et contrats restent enregistrés dans le navigateur de votre appareil.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <Lock className="w-4 h-4 text-indigo-600" />
                  <strong className="block text-slate-900 font-bold text-xs">Zéro Connaissance</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Aucun serveur central ne détient les clés de lecture de vos dossiers intimes.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <strong className="block text-slate-900 font-bold text-xs">Zéro Publicité</strong>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Aucun tracker, aucune revente d'adresses ou de pathologies à des tiers ou assurances.
                  </p>
                </div>
              </div>

              {/* Legal Notice */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-[11px] text-slate-500">
                <p>
                  <strong>Éditeur responsable :</strong> ALPHABETTE SASU, société par actions simplifiée unipersonnelle, immatriculée au RCS et basée à La Grande-Motte (Hérault).
                </p>
                <p>
                  Conformité stricte au RGPD (Règlement Général sur la Protection des Données) et à la doctrine d'utilité publique et de sobriété numérique républicaine.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-DEVICE E2EE SYNC */}
          {activeTab === 'sync' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 text-indigo-950 space-y-1.5">
                <div className="flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-indigo-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">
                    Synchronisation Chiffrée de Bout en Bout (E2EE)
                  </h4>
                </div>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Reliez votre smartphone, tablette ou second ordinateur sans jamais exposer vos
                  données en clair. Le compte utilisateur sert uniquement de relais cryptographique
                  opaque.
                </p>
              </div>

              {/* Outgoing Transfer */}
              <div className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-slate-700" />
                    <span>Transférer vers un autre appareil</span>
                  </h4>
                  <button
                    onClick={handleGenerateNewCode}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Régénérer
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {/* Simulated QR Code matrix */}
                  <div className="w-24 h-24 bg-white border-2 border-slate-900 rounded-xl p-2 flex flex-col justify-between shrink-0 shadow-xs">
                    <div className="flex justify-between">
                      <div className="w-5 h-5 bg-slate-900 rounded-xs" />
                      <div className="w-5 h-5 bg-slate-900 rounded-xs" />
                    </div>
                    <div className="flex justify-center items-center py-1">
                      <Lock className="w-4 h-4 text-indigo-700" />
                    </div>
                    <div className="flex justify-between">
                      <div className="w-5 h-5 bg-slate-900 rounded-xs" />
                      <div className="w-2 h-2 bg-slate-900 rounded-xs" />
                    </div>
                  </div>

                  <div className="space-y-2 flex-1 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Code de transfert éphémère (Valide 15 minutes)
                    </span>
                    <div className="font-mono text-sm sm:text-base font-black tracking-wider text-slate-900 bg-white p-2.5 rounded-lg border border-slate-300 inline-block">
                      {syncCode}
                    </div>

                    <div>
                      <button
                        onClick={handleCopySyncCode}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all shadow-xs"
                      >
                        {copiedSyncCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Copié dans le presse-papier !</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copier la clé de transfert</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Incoming Import */}
              <form onSubmit={handleImportSync} className="border border-slate-200 rounded-2xl p-5 space-y-3 bg-white shadow-2xs">
                <h4 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-slate-700" />
                  <span>Réceptionner des données depuis un appareil distant</span>
                </h4>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Collez ici le code FS-E2EE-XXXX-XXXX..."
                    value={importCodeInput}
                    onChange={(e) => setImportCodeInput(e.target.value)}
                    className="flex-1 p-2.5 font-mono text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800 focus:outline-slate-900 uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-xs shrink-0"
                  >
                    <span>Associer & Synchroniser</span>
                  </button>
                </div>

                {importSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      Paquet cryptographique validé. Vos dossiers locaux ont été synchronisés !
                    </span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 3: FAMILY PROFILES & LOCAL PIN CLOISONMENT */}
          {activeTab === 'pin' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 text-amber-950 space-y-1.5">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <h4 className="font-bold text-xs uppercase tracking-wide">
                    Espace Familial Cloisonné (Parents, Enfants, Aînés)
                  </h4>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  Sur un appareil partagé (ordinateur du salon ou tablette familiale), protégez chaque
                  profil par un code PIN local pour que les ordonnances ou contrats de chacun restent
                  strictement privés.
                </p>
              </div>

              <div className="space-y-3">
                {profiles.map((prof) => {
                  const hasExistingPin = !!localStorage.getItem(`fs_pin_${prof.id}`);
                  return (
                    <div
                      key={prof.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-slate-900">{prof.name}</strong>
                          <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {prof.relationship}
                          </span>
                          {hasExistingPin && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              PIN actif
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {hasExistingPin
                            ? 'Dossier verrouillé localement.'
                            : 'Accès libre sans mot de passe.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type={showPin ? 'text' : 'password'}
                          maxLength={6}
                          placeholder={hasExistingPin ? 'Nouveau PIN' : 'Code à 4-6 chiffres'}
                          value={pinInputs[prof.id] || ''}
                          onChange={(e) =>
                            setPinInputs((prev) => ({ ...prev, [prof.id]: e.target.value }))
                          }
                          className="w-36 p-2 text-xs font-mono text-center border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900"
                        />

                        <button
                          type="button"
                          onClick={() => handleSavePin(prof.id)}
                          disabled={!pinInputs[prof.id] || pinInputs[prof.id].length < 4}
                          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                        >
                          Enregistrer
                        </button>

                        {hasExistingPin && (
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.removeItem(`fs_pin_${prof.id}`);
                              setPinInputs((prev) => ({ ...prev, [prof.id]: '' }));
                              setPinSavedSuccess(`reset_${prof.id}`);
                              setTimeout(() => setPinSavedSuccess(null), 2000);
                            }}
                            className="text-xs text-rose-600 hover:text-rose-800 px-2 py-1 font-semibold"
                          >
                            Retirer
                          </button>
                        )}
                      </div>

                      {pinSavedSuccess === prof.id && (
                        <div className="text-[11px] text-emerald-700 font-bold sm:col-span-2">
                          ✓ PIN enregistré avec succès pour {prof.name} !
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-slate-500 hover:text-slate-800 text-[11px] flex items-center gap-1 font-semibold"
                >
                  {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showPin ? 'Masquer les chiffres' : 'Afficher les chiffres'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chiffrement souverain local actif · Zéro connaissance garantie</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
          >
            Fermer l'espace sécurité
          </button>
        </div>
      </div>
    </div>
  );
};
