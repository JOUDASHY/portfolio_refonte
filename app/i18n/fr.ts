const fr = {
  brand: "Portfolio",
  nav: {
    home: "Accueil",
    about: "À propos",
    skills: "Compétences",
    education: "Éducation",
    projects: "Projets",
    experience: "Expérience",
    contact: "Contact",
  },
  hero: {
    welcome: "Bienvenue dans mon univers !",
    im: "Je suis",
    name: "Nilsen",
    passion: "Passionné par",
    webdev: "le développement web",
    cta: "Découvrir plus",
  },
  about: {
    title: "À propos de moi",
    subtitle: "Développeur Full‑Stack",
    description:
      "Je conçois et réalise des applications web modernes, performantes et accessibles, du design à la mise en production.",
    profile: {
      label: "Profil",
      location: "Localisation",
      status: "Disponible pour des missions",
      years: "+ années d'expérience",
    },
    stack: {
      title: "Ce que je fais",
      frontend: "Front‑end: React, Next.js, Tailwind CSS",
      backend: "Back‑end: Node.js, Express, API REST/GraphQL",
      database: "Base de données: PostgreSQL, MongoDB, Prisma",
      tooling: "CI/CD, Tests, Performance et Accessibilité",
    },
    ctaContact: "Me contacter",
  },
  projects: {
    title: "Projets",
    subtitle: "Quelques réalisations récentes",
    stars: "étoiles",
    addStar: "Ajouter une étoile",
    view: "Voir le projet",
  },
  contact: {
    title: "Contact",
    subtitle: "Discutons de votre projet",
    name: "Nom",
    email: "Email",
    message: "Message",
    send: "Envoyer",
    success: "Merci ! Votre message a été préparé.",
  },
  skills: {
    title: "Compétences",
    subtitle: "Expériences techniques et outils",
    categories: {
      frontend: "Front‑end",
      backend: "Back‑end",
      tooling: "Outils",
    },
    level: {
      beginner: "Débutant",
      intermediate: "Intermédiaire",
      advanced: "Avancé",
      expert: "Expert",
    },
  },
  education: {
    title: "Éducation",
    subtitle: "Parcours académique",
  },
  experience: {
    title: "Expérience professionnelle",
    subtitle: "Parcours en tant que développeur",
  },
  footer: {
    copyright: "Tous droits réservés",
    built: "Conçu et développé avec",
  },
} as const;

export type FrDict = typeof fr;
export default fr;


