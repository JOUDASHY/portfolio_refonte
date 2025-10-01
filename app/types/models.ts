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

export { Education } from "./backoffice/education";
export { Experience } from "./backoffice/experience";
export { Competence } from "./backoffice/competence";
export { Projet } from "./backoffice/projet";
export { Notification } from "./backoffice/notification";
export { ImageProjet } from "./backoffice/imageProjet";
export { Formation } from "./backoffice/formation";
export { Award } from "./backoffice/award";
export { RatingSummary, RatingCreateRequest } from "./backoffice/rating";
export { Email, EmailResponse, HistoricMail } from "./backoffice/email";
export { Langue } from "./backoffice/langue";
export { User } from "./backoffice/user";
export { Visit, MonthlyVisit } from "./backoffice/visit";
export { Facebook } from "./backoffice/facebook";
export { MyLogin } from "./backoffice/mylogin";


