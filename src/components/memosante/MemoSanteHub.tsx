import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Syringe,
  Pill,
  AlertOctagon,
  Users,
  Lock,
  Heart,
  Plus,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import {
  FamilyMember,
  VaccineRecord,
  AllergyRecord,
  PrescriptionRecord,
  SavedReport,
  MedicalReportExplanation,
} from '../../types/memosante';
import {
  INITIAL_FAMILY_MEMBERS,
  INITIAL_SAMPLE_VACCINES,
  INITIAL_SAMPLE_ALLERGIES,
} from '../../data/memosantePresets';
import { MedicalReportDecoder } from './MedicalReportDecoder';
import { VaccineTracker } from './VaccineTracker';
import { AllergiesTracker } from './AllergiesTracker';
import { PrescriptionsTracker } from './PrescriptionsTracker';
import { FamilyProfilesManager } from './FamilyProfilesManager';
import { LocalVaultSecurity } from './LocalVaultSecurity';

export type MemoSanteTab =
  | 'decoder'
  | 'vaccines'
  | 'prescriptions'
  | 'allergies'
  | 'profiles'
  | 'security';

const STORAGE_KEY_FAMILY = 'memosante_family_v1';
const STORAGE_KEY_VACCINES = 'memosante_vaccines_v1';
const STORAGE_KEY_ALLERGIES = 'memosante_allergies_v1';
const STORAGE_KEY_RX = 'memosante_prescriptions_v1';
const STORAGE_KEY_REPORTS = 'memosante_reports_v1';

export const MemoSanteHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MemoSanteTab>('decoder');
  const [selectedMemberId, setSelectedMemberId] = useState<string | 'all'>('all');

  // Persistence: Family Members
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAMILY);
      return saved ? JSON.parse(saved) : INITIAL_FAMILY_MEMBERS;
    } catch {
      return INITIAL_FAMILY_MEMBERS;
    }
  });

  // Persistence: Vaccines
  const [vaccines, setVaccines] = useState<VaccineRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_VACCINES);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_VACCINES;
    } catch {
      return INITIAL_SAMPLE_VACCINES;
    }
  });

  // Persistence: Allergies
  const [allergies, setAllergies] = useState<AllergyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALLERGIES);
      return saved ? JSON.parse(saved) : INITIAL_SAMPLE_ALLERGIES;
    } catch {
      return INITIAL_SAMPLE_ALLERGIES;
    }
  });

  // Persistence: Prescriptions
  const [prescriptions, setPrescriptions] = useState<PrescriptionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RX);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persistence: Saved Reports
  const [savedReports, setSavedReports] = useState<SavedReport[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REPORTS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_FAMILY, JSON.stringify(familyMembers));
    } catch (e) {
      console.warn(e);
    }
  }, [familyMembers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VACCINES, JSON.stringify(vaccines));
    } catch (e) {
      console.warn(e);
    }
  }, [vaccines]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ALLERGIES, JSON.stringify(allergies));
    } catch (e) {
      console.warn(e);
    }
  }, [allergies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RX, JSON.stringify(prescriptions));
    } catch (e) {
      console.warn(e);
    }
  }, [prescriptions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REPORTS, JSON.stringify(savedReports));
    } catch (e) {
      console.warn(e);
    }
  }, [savedReports]);

  // Handlers
  const handleAddMember = (newMem: Omit<FamilyMember, 'id'>) => {
    const created: FamilyMember = {
      ...newMem,
      id: `member_${Date.now()}`,
    };
    setFamilyMembers((prev) => [...prev, created]);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm("Supprimer ce profil familial et toutes les données associées ?")) {
      setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
      setVaccines((prev) => prev.filter((v) => v.memberId !== id));
      setAllergies((prev) => prev.filter((a) => a.memberId !== id));
      setPrescriptions((prev) => prev.filter((p) => p.memberId !== id));
      if (selectedMemberId === id) setSelectedMemberId('all');
    }
  };

  const handleAddVaccine = (newVac: Omit<VaccineRecord, 'id'>) => {
    const created: VaccineRecord = {
      ...newVac,
      id: `vac_${Date.now()}`,
    };
    setVaccines((prev) => [created, ...prev]);
  };

  const handleDeleteVaccine = (id: string) => {
    setVaccines((prev) => prev.filter((v) => v.id !== id));
  };

  const handleAddAllergy = (newAllergy: Omit<AllergyRecord, 'id'>) => {
    const created: AllergyRecord = {
      ...newAllergy,
      id: `alg_${Date.now()}`,
    };
    setAllergies((prev) => [created, ...prev]);
  };

  const handleDeleteAllergy = (id: string) => {
    setAllergies((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddPrescription = (newRx: Omit<PrescriptionRecord, 'id'>) => {
    const created: PrescriptionRecord = {
      ...newRx,
      id: `rx_${Date.now()}`,
    };
    setPrescriptions((prev) => [created, ...prev]);
  };

  const handleDeletePrescription = (id: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== id));
  };

  const handleToggleActivePrescription = (id: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleSaveReport = (explanation: MedicalReportExplanation) => {
    const newReport: SavedReport = {
      id: `report_${Date.now()}`,
      timestamp: Date.now(),
      title: explanation.reportTitle,
      explanation,
    };
    setSavedReports((prev) => [newReport, ...prev]);
  };

  const handleImportData = (imported: any) => {
    if (imported.familyMembers) setFamilyMembers(imported.familyMembers);
    if (imported.vaccines) setVaccines(imported.vaccines);
    if (imported.allergies) setAllergies(imported.allergies);
    if (imported.prescriptions) setPrescriptions(imported.prescriptions);
    if (imported.savedReports) setSavedReports(imported.savedReports);
  };

  const handleClearAllData = () => {
    if (
      confirm(
        "Êtes-vous absolument certain de vouloir effacer l'intégralité de vos dossiers médicaux ? Cette action est irréversible."
      )
    ) {
      setFamilyMembers(INITIAL_FAMILY_MEMBERS);
      setVaccines([]);
      setAllergies([]);
      setPrescriptions([]);
      setSavedReports([]);
      localStorage.removeItem(STORAGE_KEY_FAMILY);
      localStorage.removeItem(STORAGE_KEY_VACCINES);
      localStorage.removeItem(STORAGE_KEY_ALLERGIES);
      localStorage.removeItem(STORAGE_KEY_RX);
      localStorage.removeItem(STORAGE_KEY_REPORTS);
      alert('Toutes vos données locales ont été purgées avec succès.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Brand & Sub-navigation Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shrink-0">
              <Heart className="w-6 h-6 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  MémoSanté
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                  100 % Privé & Local
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Le carnet médical familial souverain · Décrypteur d'analyses sans diagnostic
              </p>
            </div>
          </div>

          {/* Family Member Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-400 mr-1 shrink-0">Profil :</span>
            <button
              onClick={() => setSelectedMemberId('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedMemberId === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Toute la famille
            </button>
            {familyMembers.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMemberId(m.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedMemberId === m.id
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-3 text-xs">
          <button
            onClick={() => setActiveTab('decoder')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'decoder'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-4 h-4 text-teal-600" />
            <span>Décrypteur d'Analyses & Radios</span>
          </button>

          <button
            onClick={() => setActiveTab('vaccines')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'vaccines'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Syringe className="w-4 h-4 text-teal-600" />
            <span>Vaccins & Rappels</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-semibold">
              {vaccines.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'prescriptions'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Pill className="w-4 h-4 text-teal-600" />
            <span>Ordonnances & Traitements</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-semibold">
              {prescriptions.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('allergies')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'allergies'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <AlertOctagon className="w-4 h-4 text-rose-600" />
            <span>Allergies & Fiche d'Urgence</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-semibold">
              {allergies.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('profiles')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'profiles'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>Membres du Foyer</span>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full font-semibold">
              {familyMembers.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
              activeTab === 'security'
                ? 'bg-teal-50 text-teal-900 border border-teal-300 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Lock className="w-4 h-4 text-slate-700" />
            <span>Coffre-fort & Souveraineté</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === 'decoder' && (
        <MedicalReportDecoder onSaveToVault={handleSaveReport} />
      )}

      {activeTab === 'vaccines' && (
        <VaccineTracker
          vaccines={vaccines}
          familyMembers={familyMembers}
          selectedMemberId={selectedMemberId}
          onAddVaccine={handleAddVaccine}
          onDeleteVaccine={handleDeleteVaccine}
        />
      )}

      {activeTab === 'prescriptions' && (
        <PrescriptionsTracker
          prescriptions={prescriptions}
          familyMembers={familyMembers}
          selectedMemberId={selectedMemberId}
          onAddPrescription={handleAddPrescription}
          onDeletePrescription={handleDeletePrescription}
          onToggleActive={handleToggleActivePrescription}
        />
      )}

      {activeTab === 'allergies' && (
        <AllergiesTracker
          allergies={allergies}
          familyMembers={familyMembers}
          selectedMemberId={selectedMemberId}
          onAddAllergy={handleAddAllergy}
          onDeleteAllergy={handleDeleteAllergy}
        />
      )}

      {activeTab === 'profiles' && (
        <FamilyProfilesManager
          familyMembers={familyMembers}
          onAddMember={handleAddMember}
          onDeleteMember={handleDeleteMember}
        />
      )}

      {activeTab === 'security' && (
        <LocalVaultSecurity
          familyMembers={familyMembers}
          vaccines={vaccines}
          allergies={allergies}
          prescriptions={prescriptions}
          savedReports={savedReports}
          onImportData={handleImportData}
          onClearAllData={handleClearAllData}
        />
      )}
    </div>
  );
};
