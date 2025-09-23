"use client";

import { useLanguage } from "../hooks/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-16 border-t border-white/10 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-foreground/70 text-sm">© {year} Nilsen. {t("footer.copyright")}</p>
          <p className="text-foreground/70 text-sm">
            {t("footer.built")} <span className="text-accent">Next.js</span> & <span className="text-accent">Tailwind</span>
          </p>
        </div>
      </div>
    </footer>
  );
}


