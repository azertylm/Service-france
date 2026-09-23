import React, { useState } from 'react';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  Heart,
  Phone,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { FamilyMember, RelationshipType } from '../../types/memosante';

interface FamilyProfilesManagerProps {
  familyMembers: FamilyMember[];
  onAddMember: (newMem: Omit<FamilyMember, 'id'>) => void;
  onDeleteMember: (id: string) => void;
}

export const FamilyProfilesManager: React.FC<FamilyProfilesManagerProps> = ({
  familyMembers,
  onAddMember,
  onDeleteMember,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Enfant');
  const [birthDate, setBirthDate] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [treatingDoctor, setTreatingDoctor] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddMember({
      name: name.trim(),
      relationship,
      birthDate: birthDate || undefined,
      bloodGroup: bloodGroup || undefined,
      treatingDoctor: treatingDoctor.trim() || undefined,
      emergencyContact: emergencyContact.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setBirthDate('');
    setBloodGroup('');
    setTreatingDoctor('');
    setEmergencyContact('');
    setNotes('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Membres du Foyer & Profils Médicaux
          </h3>
          <p className="text-xs text-slate-500">
            Regroupez les carnets de vos proches (enfants, conjoint, parents âgés) sous un seul espace souverain
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un proche</span>
        </button>
      </div>

      {/* Profiles Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 p-6 shadow-xs transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full">
                  {member.relationship}
                </span>

                {member.bloodGroup && (
                  <span className="text-xs font-black text-rose-700 bg-rose-50 border border-rose-200 px-2.5 py-0.5 rounded-md">
                    {member.bloodGroup}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-900">{member.name}</h4>
                {member.birthDate && (
                  <p className="text-xs text-slate-500 mt-0.5">Né(e) le {member.birthDate}</p>
                )}
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl space-y-2 text-xs text-slate-700">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">
                    Médecin traitant
                  </span>
                  <span className="font-semibold text-slate-900">
                    {member.treatingDoctor || 'Non renseigné'}
                  </span>
                </div>

                {member.emergencyContact && (
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">
                      Contact d'urgence
                    </span>
                    <span className="font-medium text-slate-800">{member.emergencyContact}</span>
                  </div>
                )}

                {member.notes && (
                  <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
                    {member.notes}
                  </p>
                )}
              </div>
            </div>

            {member.relationship !== 'Moi' && (
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  onClick={() => onDeleteMember(member.id)}
                  className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Retirer ce profil</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                Nouveau profil familial
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Prénom ou Nom</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Emma, Lucas, Papa..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Lien de parenté</label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="Enfant">Enfant</option>
                    <option value="Conjoint(e)">Conjoint(e)</option>
                    <option value="Parent">Parent âgé</option>
                    <option value="Autre proche">Autre proche</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date de naissance</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Groupe Sanguin (facultatif)
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  >
                    <option value="">Non renseigné</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Médecin traitant</label>
                  <input
                    type="text"
                    placeholder="Ex: Dr. Martin"
                    value={treatingDoctor}
                    onChange={(e) => setTreatingDoctor(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Téléphone d'urgence</label>
                  <input
                    type="tel"
                    placeholder="Ex: 06 12 34 56 78"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Remarques ou antécédents</label>
                <input
                  type="text"
                  placeholder="Ex: Asthme d'effort, lentilles de contact..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Créer ce profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
