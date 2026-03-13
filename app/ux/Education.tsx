"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import type { Education as EducationModel } from "../types/models";
import { educationService } from "../services/backoffice/educationService";

type Edu = { period: string; title: string; school: string; detail?: string };

// Graduation cap icon
function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
    </svg>
  );
}

// Calendar icon
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

// Location icon
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

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

  function AnimatedCard({ children, delayMs, index }: { children: React.ReactNode; delayMs: number; index: number }) {
    const ref = useRef<HTMLDivElement | null>(null);
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
      <div
        ref={ref}
        className={`relative ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700`}
        style={visible ? { transitionDelay: `${delayMs}ms` } : undefined}
      >
        {/* Timeline connector */}
        {index !== 0 && (
          <div className="absolute -top-3 left-6 sm:left-8 w-0.5 h-3 sm:h-4 bg-gradient-to-b from-[#f68c09]/30 to-[#f68c09]" />
        )}
        {children}
      </div>
    );
  }

  return (
    <section 
      id="education" 
      className="relative py-20 sm:py-24 lg:py-32 border-b-2 bg-white overflow-hidden"
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-radial from-[#f68c09]/5 to-transparent rounded-full" />
      </div>

      <div className="relative mx-auto max-w-5xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-2 rounded-full bg-white border border-[#f68c09]/30 shadow-sm mb-3 sm:mb-6">
            <GraduationIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#f68c09]" />
            <span className="text-xs sm:text-sm font-medium text-[#000b31]">{t("education.subtitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#000b31] mb-2 sm:mb-4">
            {t("education.title")}
          </h2>
          <p className="text-sm sm:text-lg text-[#000b31]/70 max-w-2xl mx-auto">
            {t("education.description")}
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-8 rounded-lg sm:rounded-xl bg-[#f68c09]/10 p-2 sm:p-4 text-[#000b31] border border-[#f68c09]/30 text-center text-xs sm:text-base">
            {error}
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Center line - desktop only */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f68c09] via-[#f68c09]/50 to-[#f68c09]/20 -translate-x-1/2" />
          
          <div className="space-y-4 sm:space-y-8 md:space-y-0">
            {loading
              ? Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className={`md:flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-4 sm:gap-8`}>
                    <div className="flex-1" />
                    <div className="hidden md:flex w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-[#f68c09] border-2 sm:border-4 border-white shadow-lg z-10" />
                    <div className="flex-1">
                      <div className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-[#000b31]/10 shadow-sm">
                        <div className="animate-pulse space-y-2 sm:space-y-3">
                          <div className="h-3 w-20 sm:h-4 sm:w-24 rounded bg-[#000b31]/10" />
                          <div className="h-4 w-32 sm:h-6 sm:w-48 rounded bg-[#000b31]/10" />
                          <div className="h-3 w-28 sm:h-4 sm:w-40 rounded bg-[#000b31]/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : items.map((edu, idx) => (
                  <AnimatedCard key={idx} delayMs={idx * 100} index={idx}>
                    <div className={`md:flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-4 sm:gap-8`}>
                      {/* Content side */}
                      <div className="flex-1 md:text-right">
                        <div className={`bg-white rounded-xl sm:rounded-2xl p-3 sm:p-6 border border-[#000b31]/10 shadow-sm hover:shadow-lg sm:hover:shadow-xl hover:border-[#f68c09]/30 transition-all duration-300 sm:duration-500 group ${idx % 2 !== 0 ? 'md:text-left' : ''}`}>
                          {/* Period badge */}
                          <div className={`inline-flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[#f68c09]/10 text-[#f68c09] text-xs sm:text-sm font-medium mb-2 sm:mb-3 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                            <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{edu.period}</span>
                          </div>
                          
                          {/* Title */}
                          <h3 className="text-sm sm:text-xl font-bold text-[#000b31] mb-1 sm:mb-2 group-hover:text-[#f68c09] transition-colors">
                            {edu.title}
                          </h3>
                          
                          {/* School */}
                          <p className="text-[#000b31]/70 font-medium text-xs sm:text-base mb-1 sm:mb-2">
                            {edu.school}
                          </p>
                          
                          {/* Location */}
                          {edu.detail && (
                            <div className="flex items-center gap-1 sm:gap-2 text-[#000b31]/50 text-xs sm:text-sm">
                              <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span>{edu.detail}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Center dot */}
                      <div className="hidden md:flex flex-col items-center justify-center z-10">
                        <div className="w-3 h-3 sm:w-5 sm:h-5 rounded-full bg-[#f68c09] border-2 sm:border-4 border-white shadow-lg group-hover:scale-125 transition-transform duration-300" />
                      </div>
                      
                      {/* Empty side for alignment */}
                      <div className="flex-1" />
                    </div>
                  </AnimatedCard>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}


