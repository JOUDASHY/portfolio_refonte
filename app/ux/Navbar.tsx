"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";

export default function Navbar() {
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
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="#home" className="flex items-center gap-3">
          <span className="relative block h-9 w-9 overflow-hidden rounded-full bg-accent">
            <Image
              src="/logo_nil.png"
              alt="Nilsen logo"
              fill
              sizes="36px"
              className="object-contain p-1"
              priority
            />
          </span>
          <span className="font-semibold tracking-wide text-foreground">{t("brand")}</span>
        </Link>

        <button
          aria-label="Toggle menu"
          className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-accent sm:hidden"
          onClick={() => setIsOpen((v) => !v)}
        >
          <svg
            className="h-6 w-6"
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

        <ul className="hidden sm:flex items-center gap-8 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <button
              className="rounded-md px-2 py-1 text-foreground/80 hover:text-foreground ring-1 ring-white/10 hover:ring-white/20"
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
          </li>
          <li>
            <button
              aria-label="Toggle theme"
              onClick={toggle}
              className="relative h-8 w-14 rounded-full bg-white/10 ring-1 ring-white/10 hover:ring-white/20 transition-colors"
            >
              <span className="pointer-events-none absolute left-2 top-1.5 text-xs">🌙</span>
              <span className="pointer-events-none absolute right-2 top-1.5 text-xs">☀️</span>
              <span
                className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-accent transition-transform ${
                  theme === "light" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </li>
        </ul>
      </nav>

      {isOpen && (
        <div className="sm:hidden border-t border-white/5">
          <ul className="space-y-1 px-4 py-3 bg-background">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-md px-3 py-2 text-foreground/90 hover:bg-white/5 hover:text-foreground"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <button
                className="w-full rounded-md px-3 py-2 text-foreground/90 ring-1 ring-white/10 hover:bg-white/5 hover:text-foreground"
                onClick={() => setLang(lang === "en" ? "fr" : "en")}
              >
                {lang === "en" ? "FR" : "EN"}
              </button>
            </li>
            <li>
              <button
                aria-label="Toggle theme"
                onClick={toggle}
                className="mt-2 relative w-full rounded-md py-2 ring-1 ring-white/10 hover:bg-white/5"
              >
                <span className="pointer-events-none absolute left-4 top-2.5">🌙</span>
                <span className="pointer-events-none absolute right-4 top-2.5">☀️</span>
                <span
                  className={`pointer-events-none absolute top-1/2 -mt-3 left-3 h-6 w-6 rounded-full bg-accent transition-transform ${
                    theme === "light" ? "translate-x-[calc(100%-1.5rem-0.5rem)]" : "translate-x-0"
                  }`}
                />
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}


