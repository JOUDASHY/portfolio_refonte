export type ProspectStatus =
  | "new"
  | "contacted"
  | "interested"
  | "proposal_sent"
  | "negotiation"
  | "won"
  | "lost";

export type ProspectSource =
  | "google_maps"
  | "referral"
  | "social"
  | "direct"
  | "other";

export interface Prospect {
  id: number;
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  whatsapp_phone?: string;
  facebook_url?: string;
  address?: string;
  city?: string;
  google_maps_url?: string;
  website_url?: string;
  has_website: boolean;
  has_facebook: boolean;
  status: ProspectStatus;
  status_display: string;
  estimated_value: string;
  source: ProspectSource;
  notes_count: number;
  messages_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProspectDetail extends Omit<Prospect, "notes_count" | "messages_count"> {
  notes: ProspectNote[];
  messages: ProspectMessage[];
}

export interface ProspectNote {
  id: number;
  content: string;
  created_at: string;
}

export type MessageStatus = "draft" | "sent" | "delivered" | "opened";

export interface ProspectMessage {
  id: number;
  prospect: number;
  template?: number;
  channel?: "email" | "whatsapp" | "facebook" | string;
  channel_display?: string;
  subject: string;
  body: string;
  status: MessageStatus;
  sent_at?: string;
  created_at: string;
}

export type TemplateStage =
  | "initial"
  | "follow_up"
  | "proposal"
  | "closing"
  | "thank_you"
  | "acceptance";

export interface MessageTemplate {
  id: number;
  name: string;
  language: "fr" | "en";
  stage: TemplateStage;
  usage_type?: "prospecting" | "internship" | string;
  stage_display?: string;
  usage_type_display?: string;
  subject: string;
  body: string;
  cover_letter_html?: string | null;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProspectStats {
  total_prospects: number;
  new: number;
  contacted: number;
  interested: number;
  proposal_sent: number;
  negotiation: number;
  won: number;
  lost: number;
  conversion_rate: string;
  estimated_revenue: number;
  won_revenue: number;
  average_deal_value: number;
}

export interface CreateProspectPayload {
  company_name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  whatsapp_phone?: string;
  facebook_url?: string;
  address?: string;
  city?: string;
  google_maps_url?: string;
  website_url?: string;
  has_website?: boolean;
  has_facebook?: boolean;
  estimated_value?: number;
  source?: ProspectSource;
  notes?: string;
}

export interface UpdateProspectPayload extends Partial<CreateProspectPayload> {
  status?: ProspectStatus;
}

export interface CreateNotePayload {
  content: string;
}

export interface ProspectRating {
  id: number;
  prospect: number;
  rating: number; // 1-5
  comment?: string | null;
  created_at: string;
  updated_at: string;
}

export interface SendMessagePayload {
  template_id?: number;
  channel?: "email" | "whatsapp" | "facebook" | string;
  subject?: string;
  body?: string;
}

export interface CreateTemplatePayload {
  name: string;
  language: "fr" | "en";
  stage: TemplateStage;
  usage_type: "prospecting" | "internship" | string;
  subject: string;
  body: string;
  cover_letter_html?: string | null;
  is_default?: boolean;
}

export const PROSPECT_STATUS_LABELS: Record<ProspectStatus, { fr: string; en: string; color: string }> = {
  new: { fr: "Nouveau", en: "New", color: "bg-gray-100 text-gray-700" },
  contacted: { fr: "Contacté", en: "Contacted", color: "bg-blue-100 text-blue-700" },
  interested: { fr: "Intéressé", en: "Interested", color: "bg-yellow-100 text-yellow-700" },
  proposal_sent: { fr: "Proposition envoyée", en: "Proposal Sent", color: "bg-purple-100 text-purple-700" },
  negotiation: { fr: "Négociation", en: "Negotiation", color: "bg-orange-100 text-orange-700" },
  won: { fr: "Gagné", en: "Won", color: "bg-green-100 text-green-700" },
  lost: { fr: "Perdu", en: "Lost", color: "bg-red-100 text-red-700" },
};

export const PROSPECT_SOURCE_LABELS: Record<ProspectSource, { fr: string; en: string }> = {
  google_maps: { fr: "Google Maps", en: "Google Maps" },
  referral: { fr: "Recommandation", en: "Referral" },
  social: { fr: "Réseaux sociaux", en: "Social Media" },
  direct: { fr: "Direct", en: "Direct" },
  other: { fr: "Autre", en: "Other" },
};

export const TEMPLATE_STAGE_LABELS: Record<TemplateStage, { fr: string; en: string }> = {
  initial: { fr: "Premier contact", en: "Initial Contact" },
  follow_up: { fr: "Relance", en: "Follow Up" },
  proposal: { fr: "Proposition", en: "Proposal" },
  closing: { fr: "Clôture", en: "Closing" },
  thank_you: { fr: "Remerciement", en: "Thank you" },
  acceptance: { fr: "Acceptation", en: "Acceptance" },
};

export const DEFAULT_TEMPLATES: Omit<MessageTemplate, "id" | "created_at" | "updated_at">[] = [
  {
    name: "Premier contact",
    language: "fr",
    stage: "initial",
    subject: "Création de site web pour {company_name}",
    body: "Bonjour {contact_name || 'Madame, Monsieur'},\n\nJe suis développeur web et je crée des sites internet pour les entreprises locales.\n\nJ'ai remarqué que {company_name} n'a pas encore de site web.\n\nUn site pourrait permettre aux clients de voir vos services, vos horaires et vous trouver facilement sur internet.\n\nSi vous voulez, je peux vous montrer un exemple de site que je pourrais créer pour vous.\n\nCordialement,\nVotre nom",
    is_default: true,
  },
  {
    name: "First Contact",
    language: "en",
    stage: "initial",
    subject: "Website creation for {company_name}",
    body: "Hello {contact_name || 'Sir/Madam'},\n\nI am a web developer and I create websites for local businesses.\n\nI noticed that {company_name} doesn't have a website yet.\n\nA website could help customers see your services, your hours, and find you easily online.\n\nIf you'd like, I can show you an example of a site I could create for you.\n\nBest regards,\nYour name",
    is_default: true,
  },
  {
    name: "Relance",
    language: "fr",
    stage: "follow_up",
    subject: "RE: Création de site web pour {company_name}",
    body: "Bonjour {contact_name || 'Madame, Monsieur'},\n\nJe me permets de relancer mon précédent message concernant la création d'un site web pour {company_name}.\n\nAuriez-vous eu le temps d'y réfléchir ?\n\nJe reste disponible pour en discuter.\n\nCordialement,\nVotre nom",
    is_default: true,
  },
  {
    name: "Follow Up",
    language: "en",
    stage: "follow_up",
    subject: "RE: Website creation for {company_name}",
    body: "Hello {contact_name || 'Sir/Madam'},\n\nI am following up on my previous message about creating a website for {company_name}.\n\nHave you had time to think about it?\n\nI remain available to discuss it.\n\nBest regards,\nYour name",
    is_default: true,
  },
  {
    name: "Proposition commerciale",
    language: "fr",
    stage: "proposal",
    subject: "Proposition - Site web pour {company_name}",
    body: "Bonjour {contact_name || 'Madame, Monsieur'},\n\nSuite à notre conversation, je vous envoie ma proposition pour la création de votre site web.\n\nPour un site comprenant :\n- Page d'accueil\n- Présentation de vos services\n- Page de contact\n- Optimisation mobile\n- Référencement Google\n\nTarif : {estimated_value}€\n\nDélai : 2 semaines\n\nCordialement,\nVotre nom",
    is_default: true,
  },
  {
    name: "Business Proposal",
    language: "en",
    stage: "proposal",
    subject: "Proposal - Website for {company_name}",
    body: "Hello {contact_name || 'Sir/Madam'},\n\nFollowing our conversation, I am sending you my proposal for creating your website.\n\nFor a site including:\n- Home page\n- Services presentation\n- Contact page\n- Mobile optimization\n- Google SEO\n\nPrice: {estimated_value}€\n\nTimeline: 2 weeks\n\nBest regards,\nYour name",
    is_default: true,
  },
];
