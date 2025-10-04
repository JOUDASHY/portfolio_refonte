"use client";

import { useLanguage } from "../hooks/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-12 sm:mt-16 border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-3 items-start">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <p className="text-foreground font-semibold text-var-caption sm:text-base">Nilsen</p>
            <p className="text-foreground/70 text-var-caption sm:text-sm">
              {t("footer.email")}:
              {" "}
              <a className="underline text-accent" href="mailto:you@example.com">you@example.com</a>
            </p>
            <p className="text-foreground/70 text-var-caption sm:text-sm">{t("footer.location")}: —</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <span className="text-foreground/80 text-var-caption sm:text-sm">{t("footer.follow")}</span>
            <div className="flex items-center gap-2 sm:gap-3">
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="rounded-full bg-white/5 p-1.5 sm:p-2 text-foreground/80 ring-1 ring-white/10 hover:text-foreground hover:bg-white/10">
                <LinkedInIcon className="icon-xs sm:icon-sm" />
              </a>
              <a href="https://github.com/" target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="rounded-full bg-white/5 p-1.5 sm:p-2 text-foreground/80 ring-1 ring-white/10 hover:text-foreground hover:bg-white/10">
                <GitHubIcon className="icon-xs sm:icon-sm" />
              </a>
              <a href="https://x.com/" target="_blank" rel="noreferrer noopener" aria-label="X" className="rounded-full bg-white/5 p-1.5 sm:p-2 text-foreground/80 ring-1 ring-white/10 hover:text-foreground hover:bg-white/10">
                <XIcon className="icon-xs sm:icon-sm" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end gap-1">
            <p className="text-foreground/70 text-var-caption sm:text-sm">© {year} Nilsen. {t("footer.copyright")}</p>
            <p className="text-foreground/70 text-var-caption sm:text-sm">
              {t("footer.built")} <span className="text-accent">Next.js</span> & <span className="text-accent">Tailwind</span>
            </p>
          </div>
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


