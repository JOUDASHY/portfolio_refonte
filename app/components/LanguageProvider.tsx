"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import en from "../i18n/en";
import fr from "../i18n/fr";

export type SupportedLang = "en" | "fr";

type TranslationValue = string | { [key: string]: TranslationValue };
type Dictionary = { [key: string]: TranslationValue };
type Dictionaries = Record<SupportedLang, Dictionary>;

const dictionaries: Dictionaries = { en: en as unknown as Dictionary, fr: fr as unknown as Dictionary };

type LanguageContextValue = {
  lang: SupportedLang;
  setLang: (l: SupportedLang) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

function getFromDict(dict: Dictionary, path: string): string | undefined {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
    return undefined;
  }, dict) as string | undefined;
}

export function LanguageProvider({ children, initialLang }: { children: React.ReactNode; initialLang?: SupportedLang }) {
  const [lang, setLang] = useState<SupportedLang>(initialLang ?? "en");

  useEffect(() => {
    if (initialLang) return; // if routing provided it, skip detection
    const stored = typeof window !== "undefined" ? localStorage.getItem("lang") : null;
    if (stored === "en" || stored === "fr") {
      setLang(stored);
      return;
    }
    const browser = navigator?.language?.toLowerCase() || "en";
    setLang(browser.startsWith("fr") ? "fr" : "en");
  }, [initialLang]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("lang", lang);
      try {
        document.cookie = `lang=${lang};path=/;max-age=${60 * 60 * 24 * 365}`;
      } catch {}
    }
  }, [lang]);

  const value = useMemo<LanguageContextValue>(() => {
    const t = (key: string) => {
      const res = getFromDict(dictionaries[lang], key);
      return typeof res === "string" ? res : key;
    };
    return { lang, setLang, t };
  }, [lang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}


