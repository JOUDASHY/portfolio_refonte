export type User = {
  id: number;
  username: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  profile: {
    id: number;
    image: string | null;
    about: string | null;
    date_of_birth: string | null;
    link_facebook: string | null;
    link_linkedin: string | null;
    link_github: string | null;
    phone_number: string | null;
    address: string | null;
  };
};


