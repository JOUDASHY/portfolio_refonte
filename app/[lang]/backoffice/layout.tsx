"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import BackofficeSidebar from "../../ux/ui/BackofficeSidebar";
import BackofficeNavbar from "../../ux/ui/BackofficeNavbar";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = [
    { href: "dashboard", label: "Accueil", icon: HomeIcon, match: "/backoffice/dashboard" },
    { href: "prospects", label: "Prospection", icon: ProspectIcon, match: "/backoffice/prospects" },
    { href: "templates", label: "Templates", icon: TemplateIcon, match: "/backoffice/templates" },
    { href: "projects", label: "Projet", icon: ProjectIcon, match: "/backoffice/projects" },
    { href: "experience", label: "Expérience", icon: ExperienceIcon, match: "/backoffice/experience" },
    { href: "education", label: "Éducation", icon: EducationIcon, match: "/backoffice/education" },
    { href: "awards", label: "Award", icon: AwardIcon, match: "/backoffice/awards" },
    { href: "skills", label: "Compétences", icon: SkillsIcon, match: "/backoffice/skills" },
    { href: "send-cv", label: "Voir CV", icon: EyeIcon, match: "/backoffice/send-cv" },
    { href: "assistant", label: "Assistant IA", icon: AiIcon, match: "/backoffice/assistant" },
    { href: "language", label: "Langue", icon: LanguageIcon, match: "/backoffice/language" },
    { href: "training", label: "Formation", icon: TrainingIcon, match: "/backoffice/training" },
    { href: "credentials", label: "Mes Identifiants", icon: CredentialsIcon, match: "/backoffice/credentials" },
    { href: "facebook", label: "Facebook", icon: FacebookIcon, match: "/backoffice/facebook" },
  ];
  
  return (
    <div className="min-h-screen bg-background">
      <BackofficeSidebar 
        links={links} 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
      <div className="lg:pl-64">
        <BackofficeNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}



function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3l9 8h-3v9H6v-9H3l9-8z" />
    </svg>
  );
}

function ProspectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 12a3 3 0 110-6 3 3 0 010 6zm0 2c-3.33 0-6 1.34-6 3v1h12v-1c0-1.66-2.67-3-6-3zm7-9h-3V3h3a2 2 0 012 2v3h-2V5zm-14 0h3V3H5a2 2 0 00-2 2v3h2V5zm0 14v-2H3v2a2 2 0 002 2h3v-2H5zm14 0v-2h-2v2h-3v2h3a2 2 0 002-2z" />
    </svg>
  );
}

function ProjectIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4h16v4H4V4zm0 6h10v10H4V10zm12 0h4v10h-4V10z" />
    </svg>
  );
}

function ExperienceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 7h16v10H4V7zm6-4h4v3h-4V3z" />
    </svg>
  );
}

function EducationIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3l10 5-10 5-10-5 10-5zm0 7l6.5-3.25V14L12 17l-6.5-3V6.75L12 10z" />
    </svg>
  );
}

function AwardIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z" />
    </svg>
  );
}

function SkillsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 7l5 5-5 5-5-5 5-5z" />
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 11a4 4 0 110-8 4 4 0 010 8z" />
    </svg>
  );
}

function AiIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 4h16v16H4V4zm5 6h2v6H9v-6zm4 0h2v2h-2v-2z" />
    </svg>
  );
}

function LanguageIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11 7h2l-1 2h3l-4 8h-2l1-2H6l1-2h2l2-4H8l1-2h2zM17 3h4v4h-4V3z" />
    </svg>
  );
}

function TrainingIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4 5h16v2H4V5zm2 4h12v10H6V9z" />
    </svg>
  );
}

function CredentialsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 2h12v4H6V2zm-2 6h16v14H4V8zm3 3h10v2H7v-2z" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.16 1.8.16v2h-1c-1 0-1.3.62-1.3 1.26V12h2.3l-.37 3h-1.93v7A10 10 0 0022 12z" />
    </svg>
  );
}

function TemplateIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm8 1.5V8h4.5L14 3.5zM8 12h8v2H8v-2zm0 4h8v2H8v-2z" />
    </svg>
  );
}



