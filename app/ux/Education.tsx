"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import type { Education as EducationModel } from "../types/models";
import { educationService } from "../services/backoffice/educationService";

type Edu = { period: string; title: string; school: string; detail?: string };

export default function Education() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [items, setItems] = useState<Edu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDark = theme === "dark";

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
    <section id="education" className="relative py-16 sm:py-20 lg:py-24 border-b-2" style={{ background: 'var(--background)', borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-var-title sm:text-3xl lg:text-4xl font-extrabold" style={{ color: 'var(--foreground)' }}>{t("education.title")}</h2>
          <p className="mt-2 text-var-body sm:text-lg" style={{ color: 'var(--foreground)' }}>{t("education.subtitle")}</p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-3 text-var-caption text-red-700 ring-1 ring-red-200">
            {error}
          </div>
        )}

        <ol className="relative border-s" style={{ borderColor: 'var(--foreground)' }}>
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
                <li key={idx} className="mb-8 sm:mb-10 ms-4 sm:ms-6">
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4" style={{ '--tw-ring-color': 'var(--background)' } as React.CSSProperties} />
                  <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 ring-1 shadow-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--foreground)' }}>
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 w-20 sm:w-24 rounded" style={{ backgroundColor: 'var(--foreground)' }} />
                      <div className="h-4 w-36 sm:w-48 rounded" style={{ backgroundColor: 'var(--foreground)' }} />
                      <div className="h-3 w-32 sm:w-40 rounded" style={{ backgroundColor: 'var(--foreground)' }} />
                    </div>
                  </div>
                </li>
              ))
            : items.map((e: Edu, idx) => (
                <AnimatedListItem key={idx} delayMs={idx * 120}>
                  <span className="absolute -start-2 sm:-start-3 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-accent ring-2 sm:ring-4" style={{ '--tw-ring-color': 'var(--background)' } as React.CSSProperties} />
                  <div className="rounded-xl sm:rounded-2xl p-4 sm:p-6 ring-1 shadow-sm" style={{ backgroundColor: 'var(--background)', borderColor: 'var(--foreground)' }}>
                    <p className="text-var-caption sm:text-sm" style={{ color: 'var(--foreground)' }}>{e.period}</p>
                    <h3 className="mt-1 text-var-caption sm:text-base font-semibold" style={{ color: 'var(--foreground)' }}>{e.title}</h3>
                    <p className="text-var-caption sm:text-base" style={{ color: 'var(--foreground)' }}>{e.school}</p>
                    {e.detail && <p className="mt-2 text-var-caption sm:text-sm" style={{ color: 'var(--foreground)' }}>{e.detail}</p>}
                  </div>
                </AnimatedListItem>
              ))}
        </ol>
      </div>
    </section>
  );
}


