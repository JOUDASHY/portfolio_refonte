"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import Particles from "./Particles";
import SocialDock from "./SocialDock";

export default function Hero() {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      className="relative isolate flex items-center min-h-[calc(100vh-4rem)] pt-16 overflow-hidden bg-background"
    >
      <Particles />

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
        <div className="flex flex-col justify-center py-12">
          <p className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight">
            {t("hero.welcome")}
          </p>
          <p className="mt-4 text-3xl sm:text-4xl font-semibold text-foreground">
            {t("hero.im")} <span className="text-cyan-300">{t("hero.name")}</span>
          </p>
          <p className="mt-6 text-xl sm:text-2xl text-foreground/90">
            {t("hero.passion")} <TypingText className="text-accent" text={t("hero.webdev")} />
          </p>

          <div className="mt-10">
            <a
              href="#about"
              className="inline-flex items-center gap-3 rounded-full bg-white/10 px-6 py-3 text-foreground hover:bg-white/15 ring-1 ring-white/20"
            >
              <span className="font-medium">{t("hero.cta")}</span>
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.293 3.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 11-1.414-1.414L14.586 9H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="relative mx-auto flex h-[380px] w-[380px] sm:h-[440px] sm:w-[440px] items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent" />
          <div className="relative z-10 h-[92%] w-[92%]">
            <Image
              src="/logo_nil.png"
              alt="Nilsen eagle logo"
              fill
              sizes="(max-width: 768px) 360px, 440px"
              className="object-contain drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
              priority
            />
          </div>
        </div>
      </div>

      <SocialDock />
    </section>
  );
}

// old BackgroundNetwork SVG removed; replaced by Particles

function TypingText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));
      if (index >= text.length) {
        clearInterval(interval);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={className}>
      {displayed}
      <span className="ml-1 inline-block w-[1ch] animate-pulse">|</span>
    </span>
  );
}



