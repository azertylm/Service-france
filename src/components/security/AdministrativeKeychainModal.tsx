import React, { useState, useEffect } from 'react';
import {
  FileKey,
  ShieldCheck,
  Save,
  Check,
  X,
  User,
  MapPin,
  Phone,
  Mail,
  Building,
  CreditCard,
  Lock,
} from 'lucide-react';
import { AdministrativeKeychain } from '../../types/security';

interface AdministrativeKeychainModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveKeychain?: (keychain: AdministrativeKeychain) => void;
}

const STORAGE_KEY_KEYCHAIN = 'fs_admin_keychain_v1';

export const AdministrativeKeychainModal: React.FC<AdministrativeKeychainModalProps> = ({
  isOpen,
  onClose,
  onSaveKeychain,
}) => {
  const [formData, setFormData] = useState<AdministrativeKeychain>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_KEYCHAIN);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      fullName: '',
      birthDate: '',
      birthPlace: '',
      address: '',
      postalCode: '',
      city: '',
      phoneNumber: '',
      email: '',
      cafNumber: '',
      socialSecurityNumber: '',
      taxNumber: '',
      franceTravailId: '',
      notes: '',
      updatedAt: new Date().toISOString(),
    };
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AdministrativeKeychain = {
      ...formData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY_KEYCHAIN, JSON.stringify(updated));
    if (onSaveKeychain) onSaveKeychain(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-start justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-400/30 flex items-center justify-center font-bold">
              <FileKey className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Trousseau d'Identité Administrative
                </h3>
                <span className="text-[10px] uppercase font-bold bg-amber-950 text-amber-300 border border-amber-700/60 px-2 py-0.5 rounded-full">
                  100% Local
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pré-remplissage instantané de vos démarches et courriers sans ressaisie manuelle
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

        {/* Informative notice */}
        <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 text-xs text-emerald-950 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            <strong>Garantie ALPHABETTE SASU :</strong> Ces identifiants sont conservés
            strictement dans le stockage chiffré de votre appareil.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Identity */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <User className="w-3.5 h-3.5 text-slate-600" />
              État Civil du Titulaire
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Nom et Prénom</label>
                <input
                  type="text"
                  placeholder="Ex : Jeanne DUPONT"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Date de naissance</label>
                <input
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Lieu de naissance</label>
              <input
                type="text"
                placeholder="Ex : Montpellier (34)"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-600" />
              Coordonnées postales & Contact
            </h4>

            <div className="space-y-1">
              <label className="font-bold text-slate-700 block">Adresse postale complète</label>
              <input
                type="text"
                placeholder="Ex : 12 Avenue des Prés Salés"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Code Postal</label>
                <input
                  type="text"
                  placeholder="34280"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Ville</label>
                <input
                  type="text"
                  placeholder="La Grande-Motte"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Téléphone mobile</label>
                <input
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Adresse courriel</label>
                <input
                  type="email"
                  placeholder="citoyen@exemple.fr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Official Administrative Numbers */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5 border-b border-slate-100 pb-1.5">
              <Building className="w-3.5 h-3.5 text-slate-600" />
              Numéros Administratifs Clés
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Numéro d'allocataire CAF</label>
                <input
                  type="text"
                  placeholder="Ex : 1234567"
                  value={formData.cafNumber}
                  onChange={(e) => setFormData({ ...formData, cafNumber: e.target.value })}
                  className="w-full p-2.5 font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Sécurité Sociale (NIR)</label>
                <input
                  type="text"
                  placeholder="1 85 06 34 123 456 78"
                  value={formData.socialSecurityNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, socialSecurityNumber: e.target.value })
                  }
                  className="w-full p-2.5 font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Numéro Fiscal (Impôts)</label>
                <input
                  type="text"
                  placeholder="Ex : 01 23 45 67 89 012"
                  value={formData.taxNumber}
                  onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                  className="w-full p-2.5 font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 block">Identifiant France Travail</label>
                <input
                  type="text"
                  placeholder="Ex : 7654321A"
                  value={formData.franceTravailId}
                  onChange={(e) => setFormData({ ...formData, franceTravailId: e.target.value })}
                  className="w-full p-2.5 font-mono border border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-slate-900 focus:outline-slate-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-900 font-semibold"
            >
              Annuler
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center gap-2 transition-all shadow-xs"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Enregistré en local !</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer dans mon trousseau</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
