"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SVGProps, ReactElement } from "react";
import { useTheme } from "../../components/ThemeProvider";
import { useLanguage } from "../../hooks/LanguageProvider";
import Modal from "./Modal";
import Button from "./Button";

export default function BackofficeNavbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const router = useRouter();
  const { toggle, theme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [logoutOpen, setLogoutOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 border-black/15 bg-white/5 px-4 backdrop-blur shadow-sm">
        <div className="flex items-center gap-2 text-sm text-foreground/80">
          {/* Bouton toggle pour mobile */}
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md text-foreground/80 hover:bg-white/10 hover:text-foreground"
          >
            <IconWrapper size="md">
              <MenuIcon />
            </IconWrapper>
          </button>
          <span className="hidden sm:inline">Backoffice</span>
          <span className="mx-2 hidden text-foreground/30 sm:inline">/</span>
          <div className="flex items-center gap-1">
            <TopLink href="./send-cv" label="Send CV" icon={PaperPlaneIcon} />
          </div>
        </div>
        <TopbarRight onLogout={() => setLogoutOpen(true)} />
      </div>

      {/* Logout Modal */}
      <LogoutModal
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => {
          setLogoutOpen(false);
          router.push("../");
        }}
      />
    </>
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
          <IconWrapper size="xs" className="sm:hidden">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </IconWrapper>
        ) : (
          <IconWrapper size="xs" className="sm:hidden">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.22 19.78l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79zM20 13h3v-2h-3v2zm-2.64 6.19l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM13 1h-2v3h2V1zm6.78 4.22l-1.41-1.41-1.8 1.79 1.41 1.41 1.8-1.79z"/></svg>
          </IconWrapper>
        )}
        {theme === "dark" ? (
          <IconWrapper size="sm" className="hidden sm:block">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
          </IconWrapper>
        ) : (
          <IconWrapper size="sm" className="hidden sm:block">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.8 1.42-1.42zM1 13h3v-2H1v2zm10 10h2v-3h-2v3zM4.22 19.78l1.41 1.41 1.8-1.79-1.41-1.41-1.8 1.79zM20 13h3v-2h-3v2zm-2.64 6.19l1.8 1.79 1.41-1.41-1.79-1.8-1.42 1.42zM13 1h-2v3h2V1zm6.78 4.22l-1.41-1.41-1.8 1.79 1.41 1.41 1.8-1.79z"/></svg>
          </IconWrapper>
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
      {/* <span className="mx-1 text-foreground/20">|</span>
      <Link href="../" className="text-sm text-accent hover:underline">Retour au site</Link> */}
      <button
        onClick={onLogout}
        className="ml-2 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-foreground/80 hover:bg-white/10 hover:text-foreground"
      >
        <IconWrapper size="xs" className="sm:hidden">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h6V3H4c-1.1 0-2 .9-2 2v14a2 2 0 002 2h6v-2H4V5z"/></svg>
        </IconWrapper>
        <IconWrapper size="sm" className="hidden sm:block">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 17l1.41-1.41L8.83 13H21v-2H8.83l2.58-2.59L10 7l-5 5 5 5zM4 5h6V3H4c-1.1 0-2 .9-2 2v14a2 2 0 002 2h6v-2H4V5z"/></svg>
        </IconWrapper>
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
    <Link href={href} className="inline-flex items-center gap-0.5 sm:gap-1.5 rounded-md px-1 sm:px-2 py-0.5 sm:py-1 text-foreground/80 hover:bg-white/10 hover:text-foreground">
       <Icon className="icon-responsive" />
      <span className="hidden sm:inline text-xs sm:text-xs" style={{ fontSize: '0.625rem' }}>{label}</span>
    </Link>
  );
}

// Icons
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

function MenuIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M3 12h18v-2H3v2zm0-5h18V5H3v2zm0 7h18v-2H3v2z" />
    </svg>
  );
}