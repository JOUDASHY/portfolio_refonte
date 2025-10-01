export type Experience = {
  id: number;
  date_debut: string;
  date_fin: string;
  entreprise: string;
  type: "stage" | "professionnel" | string;
  role: string;
  description?: string | null;
};


