"use client";

import { useLanguage } from "../hooks/LanguageProvider";

export default function Hero() {
  const { t } = useLanguage();
  
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-navy to-navy/90">
      <div className="text-center text-white px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6">
          {t("hero.welcome")}
        </h1>
        <p className="text-xl sm:text-2xl lg:text-3xl mb-8">
          {t("hero.im")} <span className="text-accent font-bold">{t("hero.name")}</span>
        </p>
        <p className="text-lg sm:text-xl lg:text-2xl mb-12 text-white/80">
          {t("hero.passion")} <span className="text-accent font-semibold">{t("hero.webdev")}</span>
        </p>
        <a 
          href="#about" 
          className="inline-flex items-center px-8 py-4 bg-accent text-navy font-semibold rounded-full hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
        >
          {t("hero.cta")}
        </a>
      </div>
    </section>
  );
}