export type Profile = {
  id: number;
  image: string | null;
  about: string | null;
  date_of_birth: string | null;
  link_facebook: string | null;
  link_linkedin: string | null;
  link_github: string | null;
  phone_number: string | null;
  address: string | null;
  username?: string;
  email?: string;
};

export type { Education } from "./backoffice/education";
export type { Experience } from "./backoffice/experience";
export type { Competence } from "./backoffice/competence";
export type { Projet } from "./backoffice/projet";
export type { Notification } from "./backoffice/notification";
export type { ImageProjet } from "./backoffice/imageProjet";
export type { Formation } from "./backoffice/formation";
export type { Award } from "./backoffice/award";
export type { RatingSummary, RatingCreateRequest } from "./backoffice/rating";
export type { Email, EmailResponse, HistoricMail } from "./backoffice/email";
export type { Langue } from "./backoffice/langue";
export type { User } from "./backoffice/user";
export type { Visit, MonthlyVisit } from "./backoffice/visit";
export type { Facebook } from "./backoffice/facebook";
export type { MyLogin } from "./backoffice/mylogin";


