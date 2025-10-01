export type Projet = {
  id: number;
  nom: string;
  description: string;
  techno: string;
  githublink?: string | null;
  projetlink?: string | null;
  related_images: { id: number; projet: number; image: string }[];
  average_score: number | null;
};


