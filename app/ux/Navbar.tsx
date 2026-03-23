"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "../hooks/LanguageProvider";

// Flag SVG components for better cross-platform display
const UKFlag = () => (
  <svg viewBox="0 0 60 30" className="w-6 h-4 rounded-sm">
    <clipPath id="s">
      <path d="M0,0 v30 h60 v-30 z" />
    </clipPath>
    <clipPath id="t">
      <path d="M30,15 h30 v15 z v-15 h-30 z h-30 v-15 z v15 h30 z" />
    </clipPath>
    <g clipPath="url(#s)">
      <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </g>
  </svg>
);

const FRFlag = () => (
  <svg viewBox="0 0 60 30" className="w-6 h-4 rounded-sm">
    <path d="M0,0 h20 v30 h-20 z" fill="#002395" />
    <path d="M20,0 h20 v30 h-20 z" fill="#fff" />
    <path d="M40,0 h20 v30 h-20 z" fill="#ED2939" />
  </svg>
);

export default function Navbar() {
  // ULTRA COMPACT BUTTONS - FORCE RELOAD
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, lang, setLang } = useLanguage();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#home", label: t("nav.home") },
    { href: "#about", label: t("nav.about") },
    { href: "#skills", label: t("nav.skills") },
    { href: "#education", label: t("nav.education") },
    { href: "#projects", label: t("nav.projects") },
    { href: "#gallery", label: t("nav.gallery") },
    { href: "#experience", label: t("nav.experience") },
    { href: "#contact", label: t("nav.contact") },
  ];

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled
      ? "backdrop-blur-md bg-[#000b31]/50 border-b border-white/10"
      : "bg-transparent border-b-0"
      }`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="h-12 sm:h-16 flex items-center justify-between">
          <Link href="#home" className="flex items-center gap-2 sm:gap-3">
            <span className="relative block h-7 w-7 sm:h-9 sm:w-9 overflow-hidden rounded-full bg-[#f68c09]">
              <Image
                src="/logo_nil.png"
                alt="Nilsen logo"
                fill
                sizes="(max-width: 640px) 28px, 36px"
                className="object-contain p-0.5 sm:p-1"
                priority
              />
            </span>
            <span className="font-semibold tracking-wide text-xs sm:text-base text-white">{t("brand")}</span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            {/* Lang Switcher - Always visible */}
            <button
              className="flex items-center gap-2 rounded px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-white/80 hover:text-white ring-1 ring-white/10 hover:ring-white/20 transition-colors bg-white/5"
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
              title={lang === "en" ? "Switch to French" : "Switch to English"}
            >
              {lang === "en" ? <UKFlag /> : <FRFlag />}
              <span className="text-xs sm:text-sm font-medium">{lang === "en" ? "EN" : "FR"}</span>
            </button>

            {/* Desktop Menu */}
            <ul className="hidden sm:flex items-center gap-4 lg:gap-6 text-xs sm:text-sm">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white/80 hover:text-white transition-colors whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Mobile Toggle */}
            <button
              aria-label="Toggle menu"
              className="inline-flex items-center justify-center rounded-md p-1.5 sm:p-2 text-white/90 hover:text-white focus:outline-none focus:ring-2 ring-[#f68c09] sm:hidden"
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
          </div>
        </nav>
      </div>

      {isOpen && (
        <div className="sm:hidden border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ul className="space-y-1 py-2 sm:py-3 bg-[#000b31]">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block rounded-md px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-white/90 hover:bg-white/5 hover:text-white"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}


