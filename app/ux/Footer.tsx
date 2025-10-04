"use client";

import { useLanguage } from "../hooks/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16 border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-3 items-start">
          {/* Column 1: Portfolio Info */}
          <div className="flex flex-col items-center sm:items-start gap-2">
            <h3 className="text-foreground font-bold text-sm sm:text-base">Nilsen's Portfolio</h3>
            <p className="text-foreground/70 text-xs sm:text-sm text-center sm:text-left">
              Développeur Web & Administrateur Système
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col items-center gap-3">
            <h3 className="text-foreground font-bold text-sm sm:text-base">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {[
                { href: "#home", label: "Home" },
                { href: "#about", label: "About" },
                { href: "#skills", label: "Skills" },
                { href: "#projects", label: "Projects" },
                { href: "#education", label: "Education" },
                { href: "#experience", label: "Experience" }
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors text-xs sm:text-sm"
                >
                  <span className="text-accent">{'>'}</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Column 3: Contact Info */}
          <div className="flex flex-col items-center sm:items-end gap-3">
            <h3 className="text-foreground font-bold text-sm sm:text-base">Contact Info</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-foreground/70 text-xs sm:text-sm">
                <PhoneIcon className="w-4 h-4" />
                <span>+261 348655523</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70 text-xs sm:text-sm">
                <EmailIcon className="w-4 h-4" />
                <span>alitsiryeddynilsen@gmail.com</span>
              </div>
              <div className="flex items-center gap-2 text-foreground/70 text-xs sm:text-sm">
                <LocationIcon className="w-4 h-4" />
                <span>Isada, Fianarantsoa</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="rounded-full bg-accent p-2 text-white hover:bg-accent/80 transition-colors">
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer noopener" aria-label="Facebook" className="rounded-full bg-accent p-2 text-white hover:bg-accent/80 transition-colors">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="mailto:alitsiryeddynilsen@gmail.com" aria-label="Email" className="rounded-full bg-accent p-2 text-white hover:bg-accent/80 transition-colors">
                <EmailIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-center text-foreground/70 text-xs sm:text-sm">
            Designed by <span className="text-accent font-semibold">Nilsen</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function LinkedInIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4V8zm7 0h3.8v2.2h.1c.5-1 1.8-2.2 3.7-2.2 4 0 4.7 2.6 4.7 6V24h-4v-7.5c0-1.8 0-4.1-2.5-4.1-2.5 0-2.9 2-2.9 4V24h-4V8z" />
    </svg>
  );
}

function GitHubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 .5C5.73.5.9 5.33.9 11.6c0 4.87 3.16 9 7.55 10.45.55.1.76-.24.76-.53 0-.26-.01-1.13-.02-2.05-3.07.67-3.72-1.3-3.72-1.3-.5-1.27-1.22-1.6-1.22-1.6-1-.69.08-.68.08-.68 1.1.08 1.68 1.13 1.68 1.13.98 1.67 2.56 1.19 3.18.9.1-.71.38-1.19.68-1.46-2.45-.28-5.02-1.23-5.02-5.47 0-1.21.43-2.21 1.13-2.99-.12-.28-.48-1.42.1-2.95 0 0 .93-.3 3.05 1.14.88-.25 1.82-.38 2.76-.38.94 0 1.88.13 2.76.38 2.12-1.44 3.05-1.14 3.05-1.14.58 1.53.22 2.67.1 2.95.7.78 1.13 1.78 1.13 2.99 0 4.25-2.58 5.18-5.04 5.46.39.33.73.98.73 1.98 0 1.43-.01 2.58-.01 2.93 0 .29.2.63.76.52A10.74 10.74 0 0 0 23.1 11.6C23.1 5.33 18.27.5 12 .5z" />
    </svg>
  );
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.146 2H21l-7.5 8.565L22 22h-6.146l-4.86-5.76L5.5 22H3l8.08-9.213L2 2h6.227l4.44 5.273L18.146 2zM16.74 20h1.74L8.02 4H6.22l10.52 16z" />
    </svg>
  );
}

function PhoneIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function EmailIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function LocationIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}


