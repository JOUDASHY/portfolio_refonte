"use client";

import { useLanguage } from "../hooks/LanguageProvider";

type Edu = { period: string; title: string; school: string; detail?: string };

const items: Edu[] = [
  { period: "2022 – 2024", title: "Master Informatique", school: "Université Exemple", detail: "Spécialité: Développement web" },
  { period: "2019 – 2022", title: "Licence Informatique", school: "Université Exemple", detail: "Mention Bien" },
  { period: "2016 – 2019", title: "Baccalauréat", school: "Lycée Exemple", detail: "Série Scientifique" },
];

export default function Education() {
  const { t } = useLanguage();

  return (
    <section id="education" className="relative bg-white-var py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">{t("education.title")}</h2>
          <p className="mt-2 text-lg text-navy/70">{t("education.subtitle")}</p>
        </div>

        <ol className="relative border-s border-black/10">
          {items.map((e, idx) => (
            <li key={idx} className="mb-10 ms-6">
              <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent ring-4 ring-white-var" />
              <div className="rounded-2xl bg-white-var p-6 ring-1 ring-black/5 shadow-sm">
                <p className="text-sm text-navy/60">{e.period}</p>
                <h3 className="mt-1 text-navy font-semibold">{e.title}</h3>
                <p className="text-navy/80">{e.school}</p>
                {e.detail && <p className="mt-2 text-navy/70 text-sm">{e.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}


