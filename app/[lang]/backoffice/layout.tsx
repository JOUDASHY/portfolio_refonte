"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import type { SVGProps, ReactElement } from "react";
import { useTheme } from "../../components/ThemeProvider";
import { useLanguage } from "../../hooks/LanguageProvider";
import Modal from "../../ux/ui/Modal";
import Button from "../../ux/ui/Button";

export default function BackofficeLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const links = [
    { href: "dashboard", label: "Accueil", icon: HomeIcon, match: "/backoffice/dashboard" },
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
      <div className="fixed inset-y-0 left-0 z-40 w-64 border-r border-white/10 border-black/15 bg-navy">
        <div className="px-4 pt-6">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-accent">
            <Image src="/logo_nil.png" alt="Logo" width={84} height={84} className="object-contain" />
          </div>
          <div className="mt-4 rounded-xl bg-white shadow-sm">
            <div className="flex items-center gap-3 px-4 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/5">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-black/40"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z"/></svg>
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-black text-var-title">Nilsen</div>
                <div className="text-black/60 text-var-caption">Administrator</div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-3">
          <div className="mb-2 mt-4 uppercase tracking-wider text-white/70 text-var-caption">Navigation</div>
          <nav className="space-y-2">
            {links.map(({ href, label, icon: Icon, match }) => (
              <SidebarLink
                key={href}
                href={`./${href}`}
                label={label}
                icon={Icon}
                active={Boolean(pathname && pathname.includes(match))}
              />
            ))}
          </nav>

          <div className="mt-6 rounded-xl bg-white/5 p-3 ring-1 ring-white/10">
            <div className="text-sm font-medium text-foreground">Aide et support</div>
            <p className="mt-1 text-xs text-foreground/60">Besoin d&apos;aide ? Consultez la documentation.</p>
            <Link href="../" className="mt-2 inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-foreground ring-1 ring-white/20 hover:bg-white/15">
              Voir le site public
            </Link>
          </div>
        </div>
      </div>

      <div className="pl-64" style={{ ["--children-bg" as string]: theme === "dark" ? "#000000" : "#ffffff" }}>
        <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 border-black/15 bg-white/5 px-4 backdrop-blur shadow-sm">
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <span className="hidden sm:inline">Backoffice</span>
            <span className="mx-2 hidden text-foreground/30 sm:inline">/</span>
            <div className="flex items-center gap-1">
              <TopLink href="./send-cv" label="Send CV" icon={PaperPlaneIcon} />
            </div>
          </div>
          <TopbarRight onLogout={() => setLogoutOpen(true)} />
        </div>

        <main className="p-6 bg-[var(--children-bg)]">{children}</main>
        <LogoutModal
          open={logoutOpen}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={() => {
            setLogoutOpen(false);
            router.push("../");
          }}
        />
      </div>
    </div>
  );
}

function SidebarLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: (p: SVGProps<SVGSVGElement>) => ReactElement; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-xs ${
        active ? "bg-blue-600 text-white shadow" : "text-white/80 hover:bg-white/10 hover:text-white"
      }`}
    >
      <span className={`flex h-8 w-8 items-center justify-center rounded-md ${active ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="text-var-caption">{label}</span>
    </Link>
  );
}


function HomeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 3l9 8h-3v9H6v-9H3l9-8z" />
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

function TopbarRight({ onLogout }: { onLogout: () => void }) {
  const { toggle, theme } = useTheme();
  const { lang, setLang } = useLanguage();
  return (
    <div className="flex items-center gap-1">
      <TopLink href="./mailing" label="Mailing" icon={MailIcon} />
      <TopLink href="./mailing-history" label="Historique" icon={HistoryIcon} />
      <TopLink href="./profile" label="Profil" icon={UserIcon} />
      <TopLink href="./notifications" label="Notifications" icon={BellIcon} />
      <span className="mx-1 text-foreground/20">|</span>
      <button
        aria-label="Toggle theme"
        onClick={toggle}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground/80 hover:bg-white/10 hover:text-foreground"
      >
        {theme === "dark" ? (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.22 19.78l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79zM20 13h3v-2h-3v2zm-2.64 6.19l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM13 1h-2v3h2V1zm6.78 4.22l-1.41-1.41-1.8 1.79 1.41 1.41 1.8-1.79z"/></svg>
        )}
        <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
      </button>
      <select
        aria-label="Change language"
        value={lang}
        onChange={(e) => setLang((e.target.value as "en" | "fr") || "en")}
        className="rounded-md bg-white/10 px-2 py-1 text-sm text-foreground ring-1 ring-white/20 hover:bg-white/15 focus:outline-none"
      >
        <option value="fr">FR</option>
        <option value="en">EN</option>
      </select>
      <span className="mx-1 text-foreground/20">|</span>
      <Link href="../" className="text-sm text-accent hover:underline">Retour au site</Link>
      <button
        onClick={onLogout}
        className="ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground/80 hover:bg-white/10 hover:text-foreground"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5"><path d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h6V3H4c-1.1 0-2 .9-2 2v14a2 2 0 002 2h6v-2H4V5z"/></svg>
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
}

function LogoutModal({ open, onCancel, onConfirm }: { open: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title="Se déconnecter ?"
      footer={
        <>
          <Button variant="secondary" onClick={onCancel}>Annuler</Button>
          <Button onClick={onConfirm}>Se déconnecter</Button>
        </>
      }
      size="sm"
    >
      Vous êtes sur le point de vous déconnecter. Confirmez-vous cette action ?
    </Modal>
  );
}

function TopLink({ href, label, icon: Icon }: { href: string; label: string; icon: (p: SVGProps<SVGSVGElement>) => ReactElement }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground/80 hover:bg-white/10 hover:text-foreground">
      <Icon className="h-3.5 w-3.5" />
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function HistoryIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13 3a9 9 0 109 9h-2a7 7 0 11-7-7V3zm-1 5h2v6h-5v-2h3V8z" />
    </svg>
  );
}

function PaperPlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
    </svg>
  );
}

function UserIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-5 0-9 2.5-9 5.5V22h18v-2.5C21 16.5 17 14 12 14z" />
    </svg>
  );
}

function BellIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 24a2.5 2.5 0 002.45-2h-4.9A2.5 2.5 0 0012 24zm6-6V11a6 6 0 10-12 0v7l-2 2v1h18v-1l-2-2z" />
    </svg>
  );
}


