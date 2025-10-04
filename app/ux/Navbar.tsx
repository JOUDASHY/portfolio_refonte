"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";

export default function Navbar() {
  // ULTRA COMPACT BUTTONS - FORCE RELOAD
  const [isOpen, setIsOpen] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#education", label: t("nav.education") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/50 bg-background/80 border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="h-12 sm:h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 sm:gap-3">
            <span className="relative block h-7 w-7 sm:h-9 sm:w-9 overflow-hidden rounded-full bg-accent">
              <Image
                src="/logo_nil.png"
                alt="Nilsen logo"
                fill
                sizes="(max-width: 640px) 28px, 36px"
                className="object-contain p-0.5 sm:p-1"
                priority
              />
            </span>
            <span className="font-semibold tracking-wide text-xs sm:text-base text-foreground">{t("brand")}</span>
          </Link>

          <button
            aria-label="Toggle menu"
            className="inline-flex items-center justify-center rounded-md p-1.5 sm:p-2 text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-accent sm:hidden"
            onClick={() => setIsOpen((v) => !v)}
          >
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M3 6h18M3 12h18M3 18h18"}
              />
            </svg>
          </button>

          <ul className="hidden sm:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground/80 hover:text-foreground transition-colors whitespace-nowrap"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="flex items-center gap-0.5">
              <button
                className="rounded px-0.5 py-0.5 text-xs text-foreground/80 hover:text-foreground ring-1 ring-white/10 hover:ring-white/20 transition-colors min-w-0"
                onClick={() => {
                  const next = lang === "en" ? "fr" : "en";
                  setLang(next);
                  const parts = (pathname || "/en").split("/").filter(Boolean);
                  if (parts.length > 0 && (parts[0] === "en" || parts[0] === "fr")) {
                    parts[0] = next;
                  } else {
                    parts.unshift(next);
                  }
                  router.replace("/" + parts.join("/"));
                }}
              >
                {lang === "en" ? "FR" : "EN"}
              </button>
              <button
                aria-label="Toggle theme"
                onClick={toggle}
                className="relative h-3 w-6 sm:h-4 sm:w-8 rounded-full bg-white/10 ring-1 ring-white/10 hover:ring-white/20 transition-colors flex-shrink-0"
              >
                <span className="pointer-events-none absolute left-0.5 top-0.5 text-xs">🌙</span>
                <span className="pointer-events-none absolute right-0.5 top-0.5 text-xs">☀️</span>
                <span
                  className={`absolute top-0.5 left-0.5 h-2 w-2 sm:h-3 sm:w-3 rounded-full bg-accent transition-transform ${
                    theme === "light" ? "translate-x-2 sm:translate-x-3" : "translate-x-0"
                  }`}
                />
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-white/5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="space-y-1 py-2 sm:py-3 bg-background">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-foreground/90 hover:bg-white/5 hover:text-foreground"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="pt-1 sm:pt-2">
                <button
                  className="w-full rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-foreground/90 ring-1 ring-white/10 hover:bg-white/5 hover:text-foreground transition-colors"
                  onClick={() => setLang(lang === "en" ? "fr" : "en")}
                >
                  {lang === "en" ? "FR" : "EN"}
                </button>
              </li>
              <li>
                <button
                  aria-label="Toggle theme"
                  onClick={toggle}
                  className="mt-1 sm:mt-2 relative w-full rounded-md py-1 sm:py-1.5 ring-1 ring-white/10 hover:bg-white/5 transition-colors"
                >
                  <span className="pointer-events-none absolute left-2 sm:left-3 lg:left-4 top-1.5 sm:top-2 lg:top-2.5 text-xs">🌙</span>
                  <span className="pointer-events-none absolute right-2 sm:right-3 lg:right-4 top-1.5 sm:top-2 lg:top-2.5 text-xs">☀️</span>
                  <span
                    className={`pointer-events-none absolute top-1/2 -mt-2 sm:-mt-2.5 lg:-mt-3 left-1.5 sm:left-2 lg:left-3 h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 rounded-full bg-accent transition-transform ${
                      theme === "light" ? "translate-x-[calc(100%-1rem-0.5rem)] sm:translate-x-[calc(100%-1.25rem-0.5rem)] lg:translate-x-[calc(100%-1.5rem-0.5rem)]" : "translate-x-0"
                    }`}
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}


