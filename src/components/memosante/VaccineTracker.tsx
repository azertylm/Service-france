import React, { useState } from 'react';
import {
  Syringe,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Trash2,
  Info,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from 'lucide-react';
import { VaccineRecord, FamilyMember } from '../../types/memosante';
import { OFFICIAL_VACCINE_RECOMMENDATIONS } from '../../data/memosantePresets';

interface VaccineTrackerProps {
  vaccines: VaccineRecord[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | 'all';
  onAddVaccine: (newVac: Omit<VaccineRecord, 'id'>) => void;
  onDeleteVaccine: (id: string) => void;
}

export const VaccineTracker: React.FC<VaccineTrackerProps> = ({
  vaccines,
  familyMembers,
  selectedMemberId,
  onAddVaccine,
  onDeleteVaccine,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOfficialSchedule, setShowOfficialSchedule] = useState(true);

  // Form State
  const [formMemberId, setFormMemberId] = useState(
    selectedMemberId !== 'all' ? selectedMemberId : familyMembers[0]?.id || ''
  );
  const [vaccineName, setVaccineName] = useState('');
  const [targetDisease, setTargetDisease] = useState('');
  const [administeredDate, setAdministeredDate] = useState('');
  const [boosterDate, setBoosterDate] = useState('');
  const [status, setStatus] = useState<'up_to_date' | 'booster_due' | 'to_schedule'>('up_to_date');
  const [notes, setNotes] = useState('');

  const filteredVaccines = vaccines.filter((v) => {
    if (selectedMemberId === 'all') return true;
    return v.memberId === selectedMemberId;
  });

  const getMemberName = (id: string) => {
    return familyMembers.find((m) => m.id === id)?.name || 'Proche inconnu';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vaccineName.trim() || !formMemberId) return;

    onAddVaccine({
      memberId: formMemberId,
      vaccineName: vaccineName.trim(),
      targetDisease: targetDisease.trim() || 'Non spécifié',
      administeredDate: administeredDate || undefined,
      boosterDate: boosterDate || undefined,
      status,
      notes: notes.trim() || undefined,
    });

    // Reset & close
    setVaccineName('');
    setTargetDisease('');
    setAdministeredDate('');
    setBoosterDate('');
    setNotes('');
    setShowAddModal(false);
  };

  const getStatusBadge = (st: VaccineRecord['status']) => {
    switch (st) {
      case 'up_to_date':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            À jour
          </span>
        );
      case 'booster_due':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-700" />
            Rappel à prévoir
          </span>
        );
      case 'to_schedule':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            À planifier
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header action bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Syringe className="w-5 h-5 text-emerald-600" />
            Suivi des Vaccinations & Rappels
          </h3>
          <p className="text-xs text-slate-500">
            Gardez l'historique complet des vaccins pour chaque membre du foyer sans dépendre d'un carnet papier égaré
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un vaccin / rappel</span>
        </button>
      </div>

      {/* Vaccines list */}
      <div className="space-y-3">
        {filteredVaccines.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <Syringe className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              Aucun vaccin enregistré pour cette sélection
            </p>
            <p className="text-[11px] text-slate-500">
              Cliquez sur « Ajouter un vaccin » pour renseigner vos dates de rappels ou injections.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredVaccines.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {getMemberName(v.memberId)}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900">{v.vaccineName}</h4>
                      <p className="text-xs text-slate-600">{v.targetDisease}</p>
                    </div>
                    {getStatusBadge(v.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Dernière injection
                      </span>
                      <span className="font-medium text-slate-800">
                        {v.administeredDate || 'Non renseignée'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Prochain rappel
                      </span>
                      <span className="font-bold text-emerald-800">
                        {v.boosterDate || 'À définir'}
                      </span>
                    </div>
                  </div>

                  {v.notes && (
                    <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                      « {v.notes} »
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onDeleteVaccine(v.id)}
                    className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Official French Vaccine Schedule Guidelines (Haute Autorité de Santé) */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <button
          onClick={() => setShowOfficialSchedule((prev) => !prev)}
          className="w-full p-4 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Repères officiels du Calendrier Vaccinal Français
              </h4>
              <p className="text-[11px] text-slate-500">
                Recommandations en vigueur de la Haute Autorité de Santé (HAS) et du Ministère de la Santé
              </p>
            </div>
          </div>
          {showOfficialSchedule ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showOfficialSchedule && (
          <div className="p-4 sm:p-5 space-y-3 divide-y divide-slate-100">
            {OFFICIAL_VACCINE_RECOMMENDATIONS.map((rec, idx) => (
              <div key={idx} className="pt-3 first:pt-0 space-y-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rec.targetDisease}</span>
                    {rec.mandatory ? (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        Obligatoire / Essentiel
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        Recommandé
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {rec.frequency}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{rec.importance}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Vaccine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Syringe className="w-5 h-5 text-emerald-600" />
                Nouveau vaccin ou rappel
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
                <label className="font-bold text-slate-700 block">Membre du foyer concerné</label>
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
                  <label className="font-bold text-slate-700 block">Nom du vaccin</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Repevax, Boostrix, Priorix..."
                    value={vaccineName}
                    onChange={(e) => setVaccineName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Maladie(s) ciblée(s)</label>
                  <input
                    type="text"
                    placeholder="Ex: DTP, Coqueluche, ROR..."
                    value={targetDisease}
                    onChange={(e) => setTargetDisease(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date de l'injection</label>
                  <input
                    type="date"
                    value={administeredDate}
                    onChange={(e) => setAdministeredDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date du prochain rappel</label>
                  <input
                    type="date"
                    value={boosterDate}
                    onChange={(e) => setBoosterDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Statut</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                >
                  <option value="up_to_date">À jour</option>
                  <option value="booster_due">Rappel à prévoir prochainement</option>
                  <option value="to_schedule">À planifier</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">
                  Notes ou médecin (facultatif)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fait au cabinet du Dr Martin, tolérance parfaite"
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
