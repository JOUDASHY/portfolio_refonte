export type Email = {
  id: number;
  name: string;
  email: string;
  message: string;
  date: string;
  heure: string;
  responses: EmailResponse[];
};

export type EmailResponse = {
  id: number;
  email: number;
  date: string;
  heure: string;
  response: string;
};

export type HistoricMail = {
  id: number;
  nom_entreprise: string;
  email_entreprise: string;
  lieu_entreprise: string;
  date_envoi: string;
  heure_envoi: string;
};


