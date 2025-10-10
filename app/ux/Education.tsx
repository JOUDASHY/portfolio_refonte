"use client";

import { useEffect, useRef, useState } from "react";
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

  function AnimatedListItem({ children, delayMs }: { children: React.ReactNode; delayMs: number }) {
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
    <section id="education" className="relative bg-white-var py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-var-title sm:text-3xl lg:text-4xl font-extrabold text-navy">{t("education.title")}</h2>
          <p className="mt-2 text-var-body sm:text-lg text-navy/70">{t("education.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-3 text-var-caption text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <ol className="relative border-s border-black/10">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="mb-8 sm:mb-10 ms-4 sm:ms-6">
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4 ring-white-var" />
                  <div className="rounded-xl sm:rounded-2xl bg-white-var p-4 sm:p-6 ring-1 ring-black/5 shadow-sm">
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-20 sm:w-24 bg-black/10 rounded" />
                      <div className="h-4 w-36 sm:w-48 bg-black/10 rounded" />
                      <div className="h-3 w-32 sm:w-40 bg-black/10 rounded" />
                    </div>
                  </div>
                </li>
              ))
            : items.map((e: Edu, idx) => (
                <AnimatedListItem key={idx} delayMs={idx * 120}>
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4 ring-white-var" />
                  <div className="rounded-xl sm:rounded-2xl bg-white-var p-4 sm:p-6 ring-1 ring-black/5 shadow-sm">
                    <p className="text-var-caption sm:text-sm text-navy/60">{e.period}</p>
                    <h3 className="mt-1 text-var-caption sm:text-base text-navy font-semibold">{e.title}</h3>
                    <p className="text-var-caption sm:text-base text-navy/80">{e.school}</p>
                    {e.detail && <p className="mt-2 text-var-caption sm:text-sm text-navy/70">{e.detail}</p>}
                  </div>
                </AnimatedListItem>
              ))}
        </ol>
      </div>
    </section>
  );
}


