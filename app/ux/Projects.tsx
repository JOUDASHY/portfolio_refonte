"use client";

import Image from "next/image";
import { useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";

type Project = {
  id: string;
  title: string;
  image: string;
  href?: string;
  initialStars?: number;
};

const defaultProjects: Project[] = [
  { id: "p1", title: "Dashboard Analytics", image: "/window.svg", href: "#", initialStars: 12 },
  { id: "p2", title: "E‑commerce Store", image: "/globe.svg", href: "#", initialStars: 8 },
  { id: "p3", title: "Portfolio v2", image: "/file.svg", href: "#", initialStars: 15 },
];

export default function Projects() {
  const { t } = useLanguage();
  const [stars, setStars] = useState<Record<string, number>>(
    Object.fromEntries(defaultProjects.map((p) => [p.id, p.initialStars ?? 0]))
  );

  const addStar = (id: string) => {
    setStars((s) => ({ ...s, [id]: (s[id] ?? 0) + 1 }));
  };

  return (
    <section id="projects" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-var-title sm:text-4xl font-extrabold text-foreground">{t("projects.title")}</h2>
          <p className="mt-2 text-var-body sm:text-lg text-foreground/70">{t("projects.subtitle")}</p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {defaultProjects.map((p) => (
            <li
              key={p.id}
              className="group rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            >
              <div className="relative h-32 sm:h-48 w-full">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <Image src={p.image} alt={p.title} fill sizes="400px" className="object-contain p-6" />
                <div className="absolute left-2 top-2 sm:left-4 sm:top-4 rounded-full bg-black/40 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm text-white backdrop-blur">
                  <span className="inline-flex items-center gap-0.5 sm:gap-1"><StarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-accent" /> {stars[p.id] ?? 0}</span>
                </div>
              </div>
              <div className="p-3 sm:p-6">
                <h3 className="text-var-body sm:text-base text-foreground font-semibold tracking-wide">{p.title}</h3>
                <div className="mt-2 sm:mt-4 flex items-center justify-between">
                  <Stars value={stars[p.id] ?? 0} />
                  <button
                    className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-accent px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm font-medium text-navy hover:brightness-110"
                    onClick={() => addStar(p.id)}
                  >
                    <StarIcon className="h-3 w-3 sm:h-4 sm:w-4" /> {t("projects.addStar")}
                  </button>
                </div>
                <div className="mt-3 sm:mt-5">
                  <a href={p.href || "#"} className="text-var-caption sm:text-sm text-foreground/80 hover:text-foreground underline">
                    {t("projects.view")}
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stars({ value = 0, max = 5 }: { value?: number; max?: number }) {
  const filled = Math.min(max, Math.round((value % (max + 1))));
  return (
    <div className="flex items-center gap-0.5 sm:gap-1" aria-label={`${value} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon key={i} className={`h-3 w-3 sm:h-5 sm:w-5 ${i < filled ? "text-accent" : "text-foreground/30"}`} filled={i < filled} />
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


