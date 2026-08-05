import type { Award } from './award';

export type Education = {
  id: number;
  image: string | null;
  nom_ecole: string;
  nom_parcours: string;
  annee_debut: number;
  annee_fin: number;
  lieu: string;
  diplomes?: Award[]; // Nested diplomes/certifications liés (optionnel, retourné par certains endpoints)
};


