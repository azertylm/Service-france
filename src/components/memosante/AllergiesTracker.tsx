import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  Trash2,
  Printer,
  ShieldAlert,
  HeartPulse,
  User,
  Phone,
  FileCheck,
} from 'lucide-react';
import { AllergyRecord, AllergySeverity, FamilyMember } from '../../types/memosante';

interface AllergiesTrackerProps {
  allergies: AllergyRecord[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | 'all';
  onAddAllergy: (newAllergy: Omit<AllergyRecord, 'id'>) => void;
  onDeleteAllergy: (id: string) => void;
}

export const AllergiesTracker: React.FC<AllergiesTrackerProps> = ({
  allergies,
  familyMembers,
  selectedMemberId,
  onAddAllergy,
  onDeleteAllergy,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEmergencyCard, setShowEmergencyCard] = useState(false);

  // Form State
  const [formMemberId, setFormMemberId] = useState(
    selectedMemberId !== 'all' ? selectedMemberId : familyMembers[0]?.id || ''
  );
  const [allergen, setAllergen] = useState('');
  const [type, setType] = useState<AllergyRecord['type']>('Médicamenteuse');
  const [severity, setSeverity] = useState<AllergySeverity>('Sévère');
  const [reactionDescription, setReactionDescription] = useState('');
  const [emergencyAction, setEmergencyAction] = useState('');

  const filteredAllergies = allergies.filter((a) => {
    if (selectedMemberId === 'all') return true;
    return a.memberId === selectedMemberId;
  });

  const getMember = (id: string) => {
    return familyMembers.find((m) => m.id === id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allergen.trim() || !formMemberId) return;

    onAddAllergy({
      memberId: formMemberId,
      allergen: allergen.trim(),
      type,
      severity,
      reactionDescription: reactionDescription.trim() || 'Non précisé',
      emergencyAction: emergencyAction.trim() || undefined,
    });

    setAllergen('');
    setReactionDescription('');
    setEmergencyAction('');
    setShowAddModal(false);
  };

  const getSeverityBadge = (sev: AllergySeverity) => {
    switch (sev) {
      case 'Urgence Vitale (Choc)':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white animate-pulse">
            🚨 Urgence Vitale (Choc anaphylactique)
          </span>
        );
      case 'Sévère':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300">
            Sévère
          </span>
        );
      case 'Modérée':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900">
            Modérée
          </span>
        );
      case 'Légère':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
            Légère
          </span>
        );
    }
  };

  // Target member for printable emergency card
  const activeMember =
    selectedMemberId !== 'all'
      ? getMember(selectedMemberId)
      : familyMembers[0] || null;

  const memberAllergies = activeMember
    ? allergies.filter((a) => a.memberId === activeMember.id)
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-rose-600" />
            Registre des Allergies & Fiche d'Urgence
          </h3>
          <p className="text-xs text-slate-500">
            Évitez les erreurs médicales ou les chocs lors d'une hospitalisation ou à l'école
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowEmergencyCard(true)}
            className="px-4 py-2.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Printer className="w-4 h-4 text-rose-700" />
            <span>Fiche d'Urgence Imprimable</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une allergie</span>
          </button>
        </div>
      </div>

      {/* Allergies List */}
      <div className="space-y-3">
        {filteredAllergies.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <HeartPulse className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              Aucune allergie répertoriée pour cette sélection
            </p>
            <p className="text-[11px] text-slate-500">
              Enregistrez vos intolérances médicamenteuses ou alimentaires pour générer votre carte d'urgence.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAllergies.map((alg) => {
              const mem = getMember(alg.memberId);
              return (
                <div
                  key={alg.id}
                  className="bg-white rounded-2xl border-2 border-rose-100 hover:border-rose-300 p-5 shadow-xs transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          {mem ? `${mem.name} (${mem.relationship})` : 'Proche'}
                        </span>
                        <h4 className="text-base font-black text-slate-900">{alg.allergen}</h4>
                        <span className="text-xs font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                          Type : {alg.type}
                        </span>
                      </div>
                      <div>{getSeverityBadge(alg.severity)}</div>
                    </div>

                    <div className="text-xs text-slate-700 space-y-1 pt-1">
                      <p>
                        <strong>Manifestation :</strong> {alg.reactionDescription}
                      </p>
                      {alg.emergencyAction && (
                        <div className="p-2.5 rounded-xl bg-rose-50/80 border border-rose-200 text-rose-950 font-medium">
                          <strong>Conduite à tenir / Médicament :</strong> {alg.emergencyAction}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={() => onDeleteAllergy(alg.id)}
                      className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Emergency Card Modal / Preview */}
      {showEmergencyCard && activeMember && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-rose-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Fiche Citoyenne d'Urgence Médicale
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimer / PDF</span>
                </button>
                <button
                  onClick={() => setShowEmergencyCard(false)}
                  className="text-slate-400 hover:text-slate-700 font-bold px-2 py-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable ID card format */}
            <div className="border-4 border-rose-600 rounded-3xl p-6 bg-white space-y-5 text-slate-900">
              <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-rose-600" />
                  <span className="font-black text-base uppercase tracking-wider">
                    FICHE MÉDICALE D'URGENCE VACCINALE & ALLERGOLOGIQUE
                  </span>
                </div>
                <span className="text-[11px] font-bold text-slate-500">Service France</span>
              </div>

              {/* Patient Identity */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Patient
                  </span>
                  <span className="font-bold text-sm text-slate-900">{activeMember.name}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Date de naissance
                  </span>
                  <span className="font-bold text-xs text-slate-800">
                    {activeMember.birthDate || 'Non renseignée'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Groupe Sanguin
                  </span>
                  <span className="font-black text-sm text-rose-700">
                    {activeMember.bloodGroup || 'Inconnu'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Contact d'Urgence
                  </span>
                  <span className="font-bold text-xs text-slate-900">
                    {activeMember.emergencyContact || '15 (SAMU)'}
                  </span>
                </div>
              </div>

              {/* Allergies list on card */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-rose-800 flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-rose-600" />
                  Allergies et Contre-indications Formelles
                </h4>

                {memberAllergies.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-xl">
                    Aucune allergie majeure déclarée.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {memberAllergies.map((a, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
                      >
                        <div>
                          <strong className="text-rose-950 font-bold">{a.allergen}</strong> (
                          {a.type})
                          <p className="text-[11px] text-slate-600">{a.reactionDescription}</p>
                        </div>
                        {a.emergencyAction && (
                          <div className="font-bold text-rose-800 text-[11px]">
                            {a.emergencyAction}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                <span>Médecin traitant : {activeMember.treatingDoctor || 'Non spécifié'}</span>
                <span>Document 100% privé généré localement sur Service France</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Allergy Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-rose-600" />
                Déclarer une allergie ou intolérance
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Membre concerné</label>
                <select
                  value={formMemberId}
                  onChange={(e) => setFormMemberId(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  {familyMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.relationship})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Allergène</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Pénicilline, Arachide, Pollens, Guêpe..."
                    value={allergen}
                    onChange={(e) => setAllergen(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="Médicamenteuse">Médicamenteuse</option>
                    <option value="Alimentaire">Alimentaire</option>
                    <option value="Respiratoire / Contact">Respiratoire / Contact</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Niveau de sévérité</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="Urgence Vitale (Choc)">🚨 Urgence Vitale (Choc anaphylactique)</option>
                  <option value="Sévère">Sévère (Œdème de Quincke, gêne respiratoire)</option>
                  <option value="Modérée">Modérée (Urticaire vive, troubles digestifs)</option>
                  <option value="Légère">Légère (Démangeaisons locales)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Description des symptômes</label>
                <textarea
                  rows={2}
                  placeholder="Ex : Gonflement des lèvres, éruption cutanée sous 30 min..."
                  value={reactionDescription}
                  onChange={(e) => setReactionDescription(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Action d'urgence / Antidote (facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Stylo auto-injecteur Anapen 300µg, appel immédiat du 15"
                  value={emergencyAction}
                  onChange={(e) => setEmergencyAction(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Enregistrer l'allergie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
