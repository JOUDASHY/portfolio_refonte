"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import type { Education as EducationModel } from "../types/models";
import { educationService } from "../services/backoffice/educationService";

type Edu = { 
  period: string; 
  title: string; 
  school: string; 
  detail?: string; 
  image?: string | null;
  diplomes?: Array<{
    id: number;
    titre: string;
    institution: string | null;
    type: string;
    type_display?: string;
    annee: number;
  }>;
};

// Award/Certificate icon
function AwardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
    </svg>
  );
}

// Graduation cap icon
function GraduationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
    </svg>
  );
}

// Calendar icon
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

// Location icon
function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function Education() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const [items, setItems] = useState<Edu[]>([]);
  const [independentAwards, setIndependentAwards] = useState<Array<{
    id: number;
    titre: string;
    institution: string | null;
    type: string;
    type_display?: string;
    annee: number;
  }>>([]);
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
          image: edu.image,
          diplomes: edu.diplomes || [],
        }));
        setItems(mapped);

        // Charger aussi les awards indépendants (GET /api/awards/ avec filter education=null)
        try {
          const { awardService } = await import("../services/backoffice/awardService");
          const awardsRes = await awardService.list();
          const allAwards = (awardsRes.data as any[]) || [];
          // Filtrer ceux sans education (indépendants)
          const independent = allAwards.filter((award: any) => !award.education);
          setIndependentAwards(independent);
        } catch (awardsErr) {
          console.error("Failed to load independent awards:", awardsErr);
        }
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

  function AnimatedCard({ children, delayMs }: { children: React.ReactNode; delayMs: number }) {
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
        className={`${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700`}
        style={visible ? { transitionDelay: `${delayMs}ms` } : undefined}
      >
        {children}
      </div>
    );
  }

  return (
    <section
      id="education"
      className="relative border-b-2 bg-white overflow-hidden"
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-gradient-radial from-[#f68c09]/5 to-transparent rounded-full" />
      </div>

      <div className="w-full px-3 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-2 rounded-full bg-white border border-[#f68c09]/30 shadow-sm mb-3 sm:mb-6">
            <GraduationIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#f68c09]" />
            <span className="text-xs sm:text-sm font-medium text-[#000b31]">{t("education.subtitle")}</span>
          </div>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-[#000b31] mb-2 sm:mb-4">
            {t("education.title")}
          </h2>
          <p className="text-sm sm:text-lg text-[#000b31]/70 max-w-3xl mx-auto">
            {t("education.description")}
          </p>
        </div>

        {error && (
          <div className="mb-6 sm:mb-8 rounded-lg sm:rounded-xl bg-[#f68c09]/10 p-3 sm:p-4 text-[#000b31] border border-[#f68c09]/30 text-center text-xs sm:text-base max-w-4xl mx-auto">
            {error}
          </div>
        )}

        {/* Two Column Layout: Education | Diplômes */}
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 max-w-7xl mx-auto">
          {loading
            ? Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Education skeleton */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#000b31]/10 shadow-sm">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 w-24 rounded bg-[#000b31]/10" />
                    <div className="h-6 w-48 rounded bg-[#000b31]/10" />
                    <div className="h-4 w-40 rounded bg-[#000b31]/10" />
                  </div>
                </div>
                {/* Diplômes skeleton */}
                <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#000b31]/10 shadow-sm">
                  <div className="animate-pulse space-y-2">
                    <div className="h-4 w-32 rounded bg-[#000b31]/10" />
                    <div className="h-3 w-full rounded bg-[#000b31]/10" />
                    <div className="h-3 w-full rounded bg-[#000b31]/10" />
                  </div>
                </div>
              </div>
            ))
            : items.map((edu, idx) => (
              <AnimatedCard key={idx} delayMs={idx * 150}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* LEFT: Education Card */}
                  <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-[#000b31]/10 shadow-md hover:shadow-lg hover:border-[#f68c09]/30 transition-all duration-300 group">
                    {/* Period badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f68c09]/10 text-[#f68c09] text-xs sm:text-sm font-semibold mb-4">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{edu.period}</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg sm:text-xl font-bold text-[#000b31] mb-4 group-hover:text-[#f68c09] transition-colors leading-tight">
                      {edu.title}
                    </h3>

                    {/* School and Image */}
                    <div className="flex items-center gap-3 mb-3">
                      {edu.image && (
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-[#000b31]/10 flex-shrink-0 bg-white shadow-sm">
                          <Image src={edu.image} alt={edu.school} fill className="object-contain p-1.5" />
                        </div>
                      )}
                      <p className="text-[#000b31]/80 font-semibold text-sm sm:text-base">{edu.school}</p>
                    </div>

                    {/* Location */}
                    {edu.detail && (
                      <div className="flex items-center gap-1.5 text-[#000b31]/60 text-xs sm:text-sm">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{edu.detail}</span>
                      </div>
                    )}
                  </div>

                  {/* RIGHT: Diplômes Card */}
                  <div className="bg-gradient-to-br from-white via-white to-[#f68c09]/5 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-[#f68c09]/20 shadow-md hover:shadow-lg hover:border-[#f68c09]/40 transition-all duration-300">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#f68c09]/10 flex items-center justify-center">
                        <AwardIcon className="w-5 h-5 text-[#f68c09]" />
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-[#000b31]">
                        Diplômes obtenus
                      </h4>
                    </div>

                    {edu.diplomes && edu.diplomes.length > 0 ? (
                      <ul className="space-y-4">
                        {edu.diplomes.map((diplome) => (
                          <li key={diplome.id} className="flex items-start gap-2.5">
                            <span className="text-[#f68c09] text-xl font-bold leading-none mt-0.5">•</span>
                            <div className="flex-1">
                              <div className="font-bold text-[#000b31] text-sm sm:text-base mb-1.5 leading-tight">
                                {diplome.titre}
                              </div>
                              {diplome.institution && (
                                <div className="text-[#000b31]/60 text-xs sm:text-sm mb-2">
                                  {diplome.institution}
                                </div>
                              )}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#f68c09] text-white text-xs font-semibold">
                                  {diplome.annee}
                                </span>
                                {diplome.type_display && (
                                  <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#000b31]/10 text-[#000b31]/70 text-xs font-medium">
                                    {diplome.type_display}
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="flex items-center justify-center h-24 text-[#000b31]/30 italic text-sm">
                        Aucun diplôme enregistré
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
        </div>

        {/* Certifications indépendantes */}
        {!loading && independentAwards.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20 max-w-7xl mx-auto">
            <div className="flex items-center justify-center gap-2.5 mb-6 sm:mb-8">
              <div className="w-10 h-10 rounded-lg bg-[#f68c09]/10 flex items-center justify-center">
                <AwardIcon className="w-6 h-6 text-[#f68c09]" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#000b31]">
                Certifications Professionnelles
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {independentAwards.map((award, idx) => (
                <AnimatedCard key={award.id} delayMs={items.length * 150 + idx * 100}>
                  <div className="bg-gradient-to-br from-white to-[#f68c09]/5 rounded-xl sm:rounded-2xl p-4 sm:p-5 border-2 border-[#f68c09]/20 shadow-md hover:shadow-lg hover:border-[#f68c09]/50 transition-all duration-300 group h-full">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#f68c09]/10 flex items-center justify-center group-hover:bg-[#f68c09]/20 transition-colors">
                        <AwardIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#f68c09]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm sm:text-base font-bold text-[#000b31] group-hover:text-[#f68c09] transition-colors leading-tight flex-1">
                            {award.titre}
                          </h4>
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-[#f68c09] text-white text-xs font-bold flex-shrink-0">
                            {award.annee}
                          </span>
                        </div>
                        {award.institution && (
                          <p className="text-xs sm:text-sm text-[#000b31]/60 mb-2">
                            {award.institution}
                          </p>
                        )}
                        {award.type_display && (
                          <span className="inline-block px-2.5 py-1 rounded-full bg-[#000b31]/10 text-[#000b31]/70 text-xs font-medium">
                            {award.type_display}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
