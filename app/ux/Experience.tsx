"use client";

import { useLanguage } from "../hooks/LanguageProvider";
import { useExperiences } from "../hooks/useExperiences";

export default function Experience() {
  const { t } = useLanguage();
  const { items, loading, error } = useExperiences();
  return (
    <section id="experience" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">{t("experience.title")}</h2>
          <p className="mt-2 text-lg text-foreground/70">{t("experience.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        )}

        <ol className="relative border-s border-white/10 dark:border-white/10 border-black/10">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent ring-4 ring-background" />
                  <div className="rounded-2xl card-border p-6">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-24 bg-white/10 rounded" />
                      <div className="h-4 w-48 bg-white/10 rounded" />
                      <div className="h-3 w-40 bg-white/10 rounded" />
                    </div>
                  </div>
                </li>
              ))
            : items.map((r, idx) => (
                <li key={idx} className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent ring-4 ring-background" />
                  <div className="rounded-2xl card-border p-6">
                    <p className="text-sm text-foreground/70">{r.period}</p>
                    <h3 className="mt-1 text-foreground font-semibold">{r.title}</h3>
                    <p className="text-foreground/80">{r.company}</p>
                    {r.summary && <p className="mt-2 text-foreground/80 text-sm">{r.summary}</p>}
                  </div>
                </li>
              ))}
        </ol>
      </div>
    </section>
  );
}


