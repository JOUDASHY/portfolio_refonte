"use client";

import { useLanguage } from "../hooks/LanguageProvider";

type Skill = { name: string; level: number };

const frontend: Skill[] = [
  { name: "React", level: 5 },
  { name: "Next.js", level: 5 },
  { name: "TypeScript", level: 4 },
  { name: "Tailwind CSS", level: 5 },
];

const backend: Skill[] = [
  { name: "Node.js", level: 5 },
  { name: "Express", level: 4 },
  { name: "GraphQL", level: 3 },
  { name: "REST APIs", level: 5 },
];

const tooling: Skill[] = [
  { name: "Git", level: 5 },
  { name: "CI/CD", level: 4 },
  { name: "Testing", level: 4 },
  { name: "Prisma", level: 4 },
];

export default function Skills() {
  const { t } = useLanguage();

  return (
    <section id="skills" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">{t("skills.title")}</h2>
          <p className="mt-2 text-lg text-foreground/70">{t("skills.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <Category title={t("skills.categories.frontend")} skills={frontend} />
          <Category title={t("skills.categories.backend")} skills={backend} />
          <Category title={t("skills.categories.tooling")} skills={tooling} />
        </div>
      </div>
    </section>
  );
}

function Category({ title, skills }: { title: string; skills: Skill[] }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <h3 className="text-white font-semibold">{title}</h3>
      <ul className="mt-4 space-y-3">
        {skills.map((s) => (
          <li key={s.name} className="text-white/90">
            <div className="flex items-center justify-between">
              <span>{s.name}</span>
              <span className="text-sm text-white/70">{s.level}/5</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-accent" style={{ width: `${(s.level / 5) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}


