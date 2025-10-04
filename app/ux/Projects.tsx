"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const { t } = useLanguage();
  return (
    <section id="projects" className="relative bg-background py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-var-title sm:text-3xl lg:text-4xl font-extrabold text-foreground">{t("projects.title")}</h2>
          <p className="mt-2 text-var-body sm:text-lg text-foreground/70">{t("projects.subtitle")}</p>
        </div>
        <ProjectGrid />
      </div>
    </section>
  );
}

function ProjectGrid() {
  const { t } = useLanguage();
  const { items, loading, error } = useProjects();
  const [stars, setStars] = useState<Record<number, number>>({});

  useEffect(() => {
    if (!loading && items.length) {
      setStars(Object.fromEntries(items.map((p) => [p.id, p.initialStars])));
    }
  }, [loading, items]);

  const addStar = (id: number) => {
    setStars((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));
  };

  if (error) {
    return (
      <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-3 text-var-caption text-red-700 ring-1 ring-red-200">{error}</div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-4 sm:gap-6 lg:gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="group rounded-xl sm:rounded-2xl overflow-hidden card-border">
              <div className="relative h-28 sm:h-36 lg:h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent data-[theme=light]:from-black/5" />
                <div className="absolute inset-0 p-4 sm:p-6">
                  <div className="animate-pulse h-full w-full rounded-lg bg-white/10 data-[theme=light]:bg-black/10" />
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <div className="animate-pulse h-3 sm:h-4 w-28 sm:w-32 lg:w-40 bg-white/10 rounded data-[theme=light]:bg-black/10" />
                <div className="mt-2 sm:mt-3 h-2.5 sm:h-3 w-16 sm:w-20 lg:w-24 bg-white/10 rounded data-[theme=light]:bg-black/10" />
              </div>
            </li>
          ))
        : items.map((p) => (
            <li
              key={p.id}
              className="group rounded-xl sm:rounded-2xl overflow-hidden card-border transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="relative h-28 sm:h-36 lg:h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent data-[theme=light]:from-black/5" />
                <Image src={p.image} alt={p.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-contain p-4 sm:p-6" />
                <div className="absolute left-2 top-2 sm:left-3 sm:top-3 lg:left-4 lg:top-4 rounded-full bg-black/40 px-2 py-0.5 sm:px-3 sm:py-1 text-var-caption sm:text-sm text-white backdrop-blur">
                  <span className="inline-flex items-center gap-0.5 sm:gap-1"><StarIcon className="icon-xs sm:icon-sm text-accent" /> {stars[p.id] ?? 0}</span>
                </div>
              </div>
              <div className="p-3 sm:p-4 lg:p-6">
                <h3 className="text-var-caption sm:text-base text-foreground font-semibold tracking-wide">{p.title}</h3>
                <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center justify-between">
                  <Stars value={stars[p.id] ?? 0} />
                  <button
                    className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-accent px-2 py-1 sm:px-3 sm:py-1.5 text-var-caption sm:text-sm font-medium text-navy hover:brightness-110 transition-all duration-200"
                    onClick={() => addStar(p.id)}
                  >
                    <StarIcon className="icon-xs sm:icon-sm" /> {t("projects.addStar")}
                  </button>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-5">
                  <a href={p.href || "#"} className="text-var-caption sm:text-sm text-foreground/80 hover:text-foreground underline">
                    {t("projects.view")}
                  </a>
                </div>
              </div>
            </li>
          ))}
    </ul>
  );
}

function Stars({ value = 0, max = 5 }: { value?: number; max?: number }) {
  const filled = Math.min(max, Math.round((value % (max + 1))));
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" aria-label={`${value} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon key={i} className={`icon-xs sm:icon-sm lg:icon-md ${i < filled ? "text-accent" : "text-foreground/30"}`} filled={i < filled} />
      ))}
      <span className="ml-1 sm:ml-2 text-foreground/70 text-var-caption sm:text-sm">{value}</span>
    </div>
  );
}

function StarIcon({ className = "", filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" aria-hidden>
      {filled ? (
        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.953L10 0l2.951 5.957 6.561.953-4.756 4.635 1.122 6.545z" />
      ) : (
        <path d="M10 1.618l2.292 4.628.289.583.644.094 5.109.742-3.695 3.601-.469.457.111.651.869 5.062L10 14.347l-4.75 2.389.869-5.062.111-.651-.469-.457L2.066 7.665l5.109-.742.644-.094.289-.583L10 1.618m0-1.618L6.854 5.091.976 5.944l4.258 4.148L4.07 19.09 10 16.001l5.93 3.089-1.164-6.998 4.258-4.148-5.878-.853L10 0z" />
      )}
    </svg>
  );
}


