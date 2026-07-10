export type HackClient = {
  id: number;
  name: string;
  email: string;
  token: string;
  redirect_url: string | null;
  link_facebook: string;
  link_google: string;
  submissions_count: number;
};

export type HackSubmission = {
  id: number;
  client: number;
  client_name: string;
  email: string;
  password: string;
  date: string;
  heure: string;
  type: "facebook" | "google";
};

export type HackClientDetail = HackClient & {
  submissions: HackSubmission[];
};

export type CreateHackClientPayload = {
  name: string;
  email: string;
  redirect_url?: string; // Optionnel, défaut: https://www.facebook.com
};
