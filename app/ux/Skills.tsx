"use client";

import { useLanguage } from "../hooks/LanguageProvider";
import { useSkills } from "../hooks/useSkills";

export default function Skills() {
  const { t } = useLanguage();
  const { grouped, loading, error } = useSkills();

  const categories = loading ? ["Frontend", "Backend", "Tooling"] : Array.from(grouped.keys());

  return (
    <section id="skills" className="relative bg-background py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground">{t("skills.title")}</h2>
          <p className="mt-2 text-lg text-foreground/70">{t("skills.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {categories.map((cat) => (
            <Category
              key={cat}
              title={cat}
              skills={loading ? [] : grouped.get(cat) || []}
              loading={loading}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type Skill = { name: string; level: number };

function Category({ title, skills, loading }: { title: string; skills: Skill[]; loading?: boolean }) {
  return (
    <div className="rounded-2xl card-border p-6">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx} className="text-foreground/90">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 w-32 rounded bg-white/10 data-[theme=light]:bg-black/10" />
                  <div className="h-2 w-full rounded bg-white/10 data-[theme=light]:bg-black/10" />
                </div>
              </li>
            ))
          : skills.map((s) => {
              const clamped = Math.max(0, Math.min(10, s.level || 0));
              const width = `${(clamped / 10) * 100}%`;
              return (
                <li key={s.name} className="text-foreground/90">
                  <div className="flex items-center justify-between">
                    <span>{s.name}</span>
                    <span className="text-sm text-foreground/70">{clamped}/10</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 data-[theme=light]:bg-black/10">
                    <div className="h-2 rounded-full bg-accent" style={{ width }} />
                  </div>
                </li>
              );
            })}
      </ul>
    </div>
  );
}


