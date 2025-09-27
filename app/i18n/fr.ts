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
  login: {
    title: "Se connecter",
    subtitle: "Accéder à votre compte",
    email: "Email",
    password: "Mot de passe",
    remember: "Se souvenir de moi",
    forgot: "Mot de passe oublié ?",
    submit: "Connexion",
  },
  footer: {
    copyright: "Tous droits réservés",
    built: "Conçu et développé avec",
    contact: "Contact",
    email: "Email",
    location: "Localisation",
    follow: "Suivre",
  },
  mailing: {
    title: "Historique Mailing",
    subtitle: "Gérez et consultez l'historique de tous vos emails envoyés",
    newEmail: "Nouveau Email",
    export: "Exporter",
    search: "Rechercher par destinataire ou sujet...",
    allStatuses: "Tous les statuts",
    status: {
      sent: "Envoyé",
      delivered: "Livré",
      opened: "Ouvert",
      clicked: "Cliqué",
      bounced: "Rejeté",
      failed: "Échec"
    },
    columns: {
      recipient: "Destinataire",
      subject: "Sujet",
      status: "Statut",
      sentAt: "Envoyé le",
      template: "Template",
      campaign: "Campagne",
      actions: "Actions"
    },
    actions: {
      view: "Voir",
      delete: "Supprimer"
    },
    details: {
      title: "Détails de l'email",
      recipient: "Destinataire",
      subject: "Sujet",
      status: "Statut",
      template: "Template",
      campaign: "Campagne",
      sentAt: "Envoyé le",
      openedAt: "Ouvert le",
      clickedAt: "Cliqué le"
    },
    delete: {
      title: "Supprimer l'email",
      confirm: "Êtes-vous sûr de vouloir supprimer cet email de l'historique ?",
      cancel: "Annuler",
      confirmDelete: "Supprimer"
    },
    empty: "Aucun email trouvé",
    sendForm: {
      title: "Envoyer un nouvel email",
      name: "Nom du destinataire",
      namePlaceholder: "Entrez le nom du destinataire",
      email: "Email de destination",
      emailPlaceholder: "exemple@email.com",
      location: "Lieu",
      locationPlaceholder: "Ville, Pays (optionnel)",
      subject: "Sujet",
      subjectPlaceholder: "Sujet de l'email",
      message: "Message",
      messagePlaceholder: "Tapez votre message ici...",
      template: "Template",
      templateCustom: "Personnalisé",
      templateWelcome: "Bienvenue",
      templateCV: "Mise à jour CV",
      templateJob: "Candidature",
      templateNewsletter: "Newsletter",
      templateCollaboration: "Collaboration",
      cancel: "Annuler",
      send: "Envoyer l'email"
    }
  },
} as const;

export type FrDict = typeof fr;
export default fr;


