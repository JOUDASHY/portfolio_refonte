const en = {
  brand: "Portfolio",
  nav: {
    home: "Home",
    about: "About",
    skills: "Skills",
    education: "Education",
    projects: "Projects",
    experience: "Experience",
    contact: "Contact",
  },
  hero: {
    welcome: "Welcome to my world!",
    im: "I'm",
    name: "Nilsen",
    passion: "Passionate about",
    webdev: "web development",
    cta: "Discover More",
  },
  about: {
    title: "About Me",
    subtitle: "Full‑Stack Developer",
    description:
      "I design and build modern, high‑performance and accessible web apps, from UX to production.",
    profile: {
      label: "Profile",
      location: "Location",
      status: "Open to work",
      years: "+ years of experience",
    },
    stack: {
      title: "What I do",
      frontend: "Front‑end: React, Next.js, Tailwind CSS",
      backend: "Back‑end: Node.js, Express, REST/GraphQL APIs",
      database: "Databases: PostgreSQL, MongoDB, Prisma",
      tooling: "CI/CD, Testing, Performance & Accessibility",
    },
    ctaContact: "Contact Me",
  },
  projects: {
    title: "Projects",
    subtitle: "A few recent works",
    stars: "stars",
    addStar: "Add a star",
    view: "View project",
  },
  contact: {
    title: "Contact",
    subtitle: "Let’s talk about your project",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send",
    success: "Thanks! Your message is prepared.",
  },
  skills: {
    title: "Skills",
    subtitle: "Technical experience and tools",
    categories: {
      frontend: "Front‑end",
      backend: "Back‑end",
      tooling: "Tooling",
    },
    level: {
      beginner: "Beginner",
      intermediate: "Intermediate",
      advanced: "Advanced",
      expert: "Expert",
    },
  },
  education: {
    title: "Education",
    subtitle: "Academic journey",
  },
  experience: {
    title: "Professional Experience",
    subtitle: "Developer roles and journey",
  },
  footer: {
    copyright: "All rights reserved",
    built: "Designed & built with",
  },
} as const;

export type EnDict = typeof en;
export default en;


