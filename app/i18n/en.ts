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
  login: {
    title: "Sign in",
    subtitle: "Access your account",
    email: "Email",
    password: "Password",
    remember: "Remember me",
    forgot: "Forgot password?",
    submit: "Sign in",
  },
  footer: {
    copyright: "All rights reserved",
    built: "Designed & built with",
    contact: "Contact",
    email: "Email",
    location: "Location",
    follow: "Follow",
  },
  mailing: {
    title: "Mailing History",
    subtitle: "Manage and view the history of all your sent emails",
    newEmail: "New Email",
    export: "Export",
    search: "Search by recipient or subject...",
    allStatuses: "All statuses",
    status: {
      sent: "Sent",
      delivered: "Delivered",
      opened: "Opened",
      clicked: "Clicked",
      bounced: "Bounced",
      failed: "Failed"
    },
    columns: {
      recipient: "Recipient",
      subject: "Subject",
      status: "Status",
      sentAt: "Sent at",
      template: "Template",
      campaign: "Campaign",
      actions: "Actions"
    },
    actions: {
      view: "View",
      delete: "Delete"
    },
    details: {
      title: "Email Details",
      recipient: "Recipient",
      subject: "Subject",
      status: "Status",
      template: "Template",
      campaign: "Campaign",
      sentAt: "Sent at",
      openedAt: "Opened at",
      clickedAt: "Clicked at"
    },
    delete: {
      title: "Delete Email",
      confirm: "Are you sure you want to delete this email from history?",
      cancel: "Cancel",
      confirmDelete: "Delete"
    },
    empty: "No emails found",
    sendForm: {
      title: "Send New Email",
      name: "Recipient Name",
      namePlaceholder: "Enter recipient name",
      email: "Destination Email",
      emailPlaceholder: "example@email.com",
      location: "Location",
      locationPlaceholder: "City, Country (optional)",
      subject: "Subject",
      subjectPlaceholder: "Email subject",
      message: "Message",
      messagePlaceholder: "Type your message here...",
      template: "Template",
      templateCustom: "Custom",
      templateWelcome: "Welcome",
      templateCV: "CV Update",
      templateJob: "Job Application",
      templateNewsletter: "Newsletter",
      templateCollaboration: "Collaboration",
      cancel: "Cancel",
      send: "Send Email"
    }
  },
} as const;

export type EnDict = typeof en;
export default en;


