"use client";

import { useLanguage } from "../hooks/LanguageProvider";

type Role = {
  period: string;
  title: string;
  company: string;
  summary?: string;
  stack?: string[];
};

const roles: Role[] = [
  {
    period: "2024 – Présent",
    title: "Développeur Full‑Stack",
    company: "Startup Exemple",
    summary: "Conception et développement d'applications Next.js/Node avec CI/CD.",
    stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
  },
  {
    period: "2022 – 2024",
    title: "Développeur Front‑End",
    company: "Agence Web",
    summary: "Intégration d'interfaces responsives et optimisation performance.",
    stack: ["React", "Tailwind", "Vite"],
  },
  {
    period: "2021 – 2022",
    title: "Stagiaire Développeur",
    company: "Entreprise Logiciels",
    summary: "Contribution aux features et corrections, revue de code.",
    stack: ["React", "Express", "MongoDB"],
  },
];

export default function Experience() {
  const { t } = useLanguage();
  return (
    <section id="experience" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">{t("experience.title")}</h2>
          <p className="mt-2 text-lg text-foreground/70">{t("experience.subtitle")}</p>
        </div>

        <ol className="relative border-s border-white/10">
          {roles.map((r, idx) => (
            <li key={idx} className="mb-10 ms-6">
              <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent ring-4 ring-background" />
              <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <p className="text-sm text-foreground/70">{r.period}</p>
                <h3 className="mt-1 text-foreground font-semibold">{r.title}</h3>
                <p className="text-foreground/80">{r.company}</p>
                {r.summary && <p className="mt-2 text-foreground/80 text-sm">{r.summary}</p>}
                {r.stack && (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {r.stack.map((s) => (
                      <li key={s} className="rounded-full bg-white/10 px-3 py-1 text-xs text-foreground/80 ring-1 ring-white/10">{s}</li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


