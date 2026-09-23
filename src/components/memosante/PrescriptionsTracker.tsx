import React, { useState } from 'react';
import {
  Pill,
  Plus,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  BellRing,
} from 'lucide-react';
import { PrescriptionRecord, FamilyMember } from '../../types/memosante';

interface PrescriptionsTrackerProps {
  prescriptions: PrescriptionRecord[];
  familyMembers: FamilyMember[];
  selectedMemberId: string | 'all';
  onAddPrescription: (newRx: Omit<PrescriptionRecord, 'id'>) => void;
  onDeletePrescription: (id: string) => void;
  onToggleActive: (id: string) => void;
}

export const PrescriptionsTracker: React.FC<PrescriptionsTrackerProps> = ({
  prescriptions,
  familyMembers,
  selectedMemberId,
  onAddPrescription,
  onDeletePrescription,
  onToggleActive,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formMemberId, setFormMemberId] = useState(
    selectedMemberId !== 'all' ? selectedMemberId : familyMembers[0]?.id || ''
  );
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');
  const [prescribingDoctor, setPrescribingDoctor] = useState('');
  const [renewalAlertDate, setRenewalAlertDate] = useState('');

  const filteredPrescriptions = prescriptions.filter((rx) => {
    if (selectedMemberId === 'all') return true;
    return rx.memberId === selectedMemberId;
  });

  const getMemberName = (id: string) => {
    return familyMembers.find((m) => m.id === id)?.name || 'Proche';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationName.trim() || !formMemberId) return;

    onAddPrescription({
      memberId: formMemberId,
      medicationName: medicationName.trim(),
      dosage: dosage.trim() || 'Dose standard',
      frequency: frequency.trim() || 'Selon prescription',
      startDate,
      endDate: endDate || undefined,
      prescribingDoctor: prescribingDoctor.trim() || undefined,
      renewalAlertDate: renewalAlertDate || undefined,
      active: true,
    });

    setMedicationName('');
    setDosage('');
    setFrequency('');
    setEndDate('');
    setRenewalAlertDate('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Pill className="w-5 h-5 text-emerald-600" />
            Traitements & Ordonnances en cours
          </h3>
          <p className="text-xs text-slate-500">
            Suivi des posologies quotidiennes et alertes pour renouveler votre ordonnance à temps
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un traitement</span>
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {filteredPrescriptions.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <Pill className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-700">
              Aucun traitement enregistré actuellement
            </p>
            <p className="text-[11px] text-slate-500">
              Ajoutez vos médicaments réguliers ou ponctuels pour ne plus oublier vos renouvellements.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPrescriptions.map((rx) => (
              <div
                key={rx.id}
                className={`bg-white rounded-2xl border-2 p-5 shadow-xs transition-all flex flex-col justify-between space-y-3 ${
                  rx.active ? 'border-emerald-200 bg-white' : 'border-slate-200 bg-slate-50/70 opacity-70'
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        {getMemberName(rx.memberId)}
                      </span>
                      <h4 className="text-base font-black text-slate-900">{rx.medicationName}</h4>
                      <p className="text-xs font-semibold text-emerald-800">{rx.dosage}</p>
                    </div>

                    <button
                      onClick={() => onToggleActive(rx.id)}
                      className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 transition-colors ${
                        rx.active
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rx.active ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          En cours
                        </>
                      ) : (
                        'Terminé'
                      )}
                    </button>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl space-y-1.5 text-xs text-slate-700">
                    <p>
                      <strong>Fréquence :</strong> {rx.frequency}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Début : {rx.startDate}</span>
                      <span>Fin : {rx.endDate || 'Chronique / Continu'}</span>
                    </div>
                  </div>

                  {rx.renewalAlertDate && rx.active && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 text-amber-900 text-xs border border-amber-200">
                      <BellRing className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>
                        <strong>Rappel renouvellement :</strong> {rx.renewalAlertDate}
                      </span>
                    </div>
                  )}

                  {rx.prescribingDoctor && (
                    <p className="text-[11px] text-slate-400">
                      Prescrit par : {rx.prescribingDoctor}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end pt-2 border-t border-slate-100">
                  <button
                    onClick={() => onDeletePrescription(rx.id)}
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Pill className="w-5 h-5 text-emerald-600" />
                Nouveau traitement ou ordonnance
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
                  <label className="font-bold text-slate-700 block">Nom du médicament</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Doliprane, Levothyrox, Ventoline..."
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Dosage</label>
                  <input
                    type="text"
                    placeholder="Ex: 1000 mg, 50 µg, 1 bouffée..."
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Posologie / Fréquence</label>
                <input
                  type="text"
                  placeholder="Ex: 1 comprimé matin et soir au milieu des repas"
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date de début</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">Date de fin (facultatif)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Médecin prescripteur
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Dr. Martin"
                    value={prescribingDoctor}
                    onChange={(e) => setPrescribingDoctor(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700 block">
                    Alerte renouvellement ordonnance
                  </label>
                  <input
                    type="date"
                    value={renewalAlertDate}
                    onChange={(e) => setRenewalAlertDate(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-800"
                  />
                </div>
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
