export interface AdministrativeKeychain {
  fullName: string;
  birthDate: string;
  birthPlace: string;
  address: string;
  postalCode: string;
  city: string;
  phoneNumber: string;
  email: string;
  cafNumber?: string;
  socialSecurityNumber?: string; // NIR
  taxNumber?: string; // Numéro fiscal de référence
  franceTravailId?: string;
  notes?: string;
  updatedAt: string;
}

export interface ProfileSecuritySettings {
  profileId: string;
  isPinProtected: boolean;
  pinHash?: string; // Stocké en SHA-256 local
  role: 'Parent' | 'Enfant' | 'Aîné' | 'Titulaire';
}

export interface SyncPacketPayload {
  version: string;
  timestamp: number;
  encryptedData: string;
  checksum: string;
  sourceDevice: string;
}
