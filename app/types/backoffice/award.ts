export type Award = {
  id: number;
  education: number | null; // Foreign Key vers Education (nullable pour certifications indépendantes)
  education_name?: string | null; // Nom de l'éducation (retourné par le backend)
  titre: string;
  institution: string | null; // Institution nullable
  institution_name?: string | null; // Nom de l'institution (peut être différent du champ institution)
  type: 'diplome' | 'certification' | 'attestation' | 'brevet' | 'autre'; // Type choices
  type_display?: string; // Display value du type (retourné par le backend)
  annee: number;
};


