"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import type { Education as EducationModel } from "../types/models";
import { educationService } from "../services/backoffice/educationService";

type Edu = { period: string; title: string; school: string; detail?: string };

export default function Education() {
  const { t } = useLanguage();
  const [items, setItems] = useState<Edu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await educationService.list();
        if (!mounted) return;
        const list = (res.data as unknown as EducationModel[]) || [];
        const mapped: Edu[] = (list as EducationModel[]).map((edu) => ({
          period: `${edu.annee_debut} – ${edu.annee_fin}`,
          title: edu.nom_parcours,
          school: edu.nom_ecole,
          detail: edu.lieu,
        }));
        setItems(mapped);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load education");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section id="education" className="relative bg-white-var py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">{t("education.title")}</h2>
          <p className="mt-2 text-lg text-navy/70">{t("education.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <ol className="relative border-s border-black/10">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="mb-10 ms-6">
                  <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent ring-4 ring-white-var" />
                  <div className="rounded-2xl bg-white-var p-6 ring-1 ring-black/5 shadow-sm">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-24 bg-black/10 rounded" />
                      <div className="h-4 w-48 bg-black/10 rounded" />
                      <div className="h-3 w-40 bg-black/10 rounded" />
                    </div>
                  </div>
                </li>
              ))
            : items.map((e: Edu, idx) => (
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


