"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useExperiences } from "../hooks/useExperiences";

export default function Experience() {
  const { t } = useLanguage();
  const { items, loading, error } = useExperiences();
  function AnimatedItem({ children, delayMs }: { children: React.ReactNode; delayMs: number }) {
    const ref = useRef<HTMLLIElement | null>(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setVisible(true);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, []);
    return (
      <li
        ref={ref}
        className={`${visible ? "animate-fade-in-up" : "opacity-0 translate-y-3"} mb-8 sm:mb-10 ms-4 sm:ms-6`}
        style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
      >
        {children}
      </li>
    );
  }
  return (
    <section id="experience" className="relative bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-var-title sm:text-3xl lg:text-4xl font-extrabold text-foreground">{t("experience.title")}</h2>
          <p className="mt-2 text-var-body sm:text-lg text-foreground/70">{t("experience.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        )}

        <ol className="relative border-s border-white/10 dark:border-white/10 border-black/10">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="mb-8 sm:mb-10 ms-4 sm:ms-6">
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4 ring-background" />
                  <div className="rounded-xl sm:rounded-2xl card-border p-4 sm:p-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-20 sm:w-24 bg-white/10 rounded" />
                      <div className="h-4 w-36 sm:w-48 bg-white/10 rounded" />
                      <div className="h-3 w-32 sm:w-40 bg-white/10 rounded" />
                    </div>
                  </div>
                </li>
              ))
            : items.map((r, idx) => (
                <AnimatedItem key={idx} delayMs={idx * 120}>
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4 ring-background" />
                  <div className="rounded-xl sm:rounded-2xl card-border p-4 sm:p-6">
                    <p className="text-var-caption sm:text-sm text-foreground/70">{r.period}</p>
                    <h3 className="mt-1 text-var-caption sm:text-base text-foreground font-semibold">{r.title}</h3>
                    <p className="text-var-caption sm:text-base text-foreground/80">{r.company}</p>
                    {r.summary && <p className="mt-2 text-var-caption sm:text-sm text-foreground/80">{r.summary}</p>}
                  </div>
                </AnimatedItem>
              ))}
        </ol>
      </div>
    </section>
  );
}


