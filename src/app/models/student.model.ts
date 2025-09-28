export interface Student {
  nom: string;
  prenom: string;
  dateNaissance: string;
  photo: string; // Base64 string
  signatureType?: 'auto' | 'manual';
  manualSignature?: string; // Base64 canvas data for manual signature
}

export interface StudentCard extends Student {
  validite: string;
  signature: string; // Base64 canvas data
}