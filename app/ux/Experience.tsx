"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useExperiences } from "../hooks/useExperiences";
import Image from "next/image";

export default function Experience() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { items, loading, error } = useExperiences();
  const isDark = theme === "dark";

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

  // Briefcase icon
  function BriefcaseIcon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    );
  }

  // Building icon
  function BuildingIcon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
        <path d="M9 9v.01"/>
        <path d="M9 12v.01"/>
        <path d="M9 15v.01"/>
        <path d="M9 18v.01"/>
      </svg>
    );
  }

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
          <div className="absolute -top-8 left-8 w-0.5 h-8 bg-gradient-to-b from-[#f68c09]/30 to-[#f68c09]" />
        )}
        {children}
      </div>
    );
  }

  return (
    <section 
      id="experience" 
      className="relative border-b-2 bg-white overflow-hidden"
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Content - Left side */}
        <div className="w-full lg:flex-1 lg:pr-[520px] px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#f68c09]/30 shadow-sm mb-6">
              <BriefcaseIcon className="w-4 h-4 text-[#f68c09]" />
              <span className="text-sm font-medium text-[#000b31]">{t("experience.subtitle")}</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#000b31] mb-4">
              {t("experience.title")}
            </h2>
          </div>

          {error && (
            <div className="mb-8 rounded-xl bg-[#f68c09]/10 p-4 text-[#000b31] border border-[#f68c09]/30 text-center">
              {error}
            </div>
          )}

          {/* Timeline */}
          <div className="relative">
            {/* Center line - desktop only */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#f68c09] via-[#f68c09]/50 to-[#f68c09]/20 -translate-x-1/2" />
            
            <div className="space-y-8 md:space-y-0">
              {loading
                ? Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className={`md:flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                      <div className="flex-1" />
                      <div className="hidden md:flex w-4 h-4 rounded-full bg-[#f68c09] border-4 border-white shadow-lg z-10" />
                      <div className="flex-1">
                        <div className="bg-white rounded-2xl p-6 border border-[#000b31]/10 shadow-sm">
                          <div className="animate-pulse space-y-3">
                            <div className="h-4 w-24 rounded bg-[#000b31]/10" />
                            <div className="h-6 w-48 rounded bg-[#000b31]/10" />
                            <div className="h-4 w-40 rounded bg-[#000b31]/10" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                : items.map((r, idx) => (
                    <AnimatedCard key={idx} delayMs={idx * 150} index={idx}>
                      <div className={`md:flex ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
                        {/* Content side */}
                        <div className="flex-1 md:text-right">
                          <div className={`bg-white rounded-2xl p-6 border border-[#000b31]/10 shadow-sm hover:shadow-xl hover:border-[#f68c09]/30 transition-all duration-500 group ${idx % 2 !== 0 ? 'md:text-left' : ''}`}>
                            {/* Period badge */}
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f68c09]/10 text-[#f68c09] text-sm font-medium mb-3 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                              <CalendarIcon className="w-4 h-4" />
                              <span>{formatPeriodFr(r.period)}</span>
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-xl font-bold text-[#000b31] mb-2 group-hover:text-[#f68c09] transition-colors">
                              {r.title}
                            </h3>
                            
                            {/* Company */}
                            <div className={`flex items-center gap-2 text-[#000b31]/70 font-medium mb-2 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                              <BuildingIcon className="w-4 h-4" />
                              <span>{r.company}</span>
                            </div>
                            
                            {/* Summary */}
                            {r.summary && (
                              <p className="text-[#000b31]/50 text-sm">
                                {r.summary}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {/* Center dot */}
                        <div className="hidden md:flex flex-col items-center justify-center z-10">
                          <div className="w-5 h-5 rounded-full bg-[#f68c09] border-4 border-white shadow-lg group-hover:scale-125 transition-transform duration-300" />
                        </div>
                        
                        {/* Empty side for alignment */}
                        <div className="flex-1" />
                      </div>
                    </AnimatedCard>
                  ))}
            </div>
          </div>
        </div>

        {/* Image - Stuck to the right side */}
        <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-[500px] border-l-4 border-[#f68c09]">
          <Image
            src="/bann.jpg"
            alt="Experience"
            fill
            className="object-cover"
            sizes="500px"
          />
        </div>
      </div>
    </section>
  );
}


function formatPeriodFr(period: string | null | undefined): string {
  if (!period || typeof period !== "string") return "";
  // Split on en dash or hyphen ranges
  const parts = period.split(/\s+[–-]\s+/);
  const format = (d: string) => {
    // normalize YYYY-MM-DD
    const trimmed = d.trim();
    // Some backends may return only year-month or other; rely on Date parsing
    const date = new Date(trimmed);
    if (isNaN(date.getTime())) return trimmed; // fallback
    // Use French locale with month in letters
    return date.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  };
  if (parts.length === 2) {
    return `${format(parts[0])} – ${format(parts[1])}`;
  }
  // Single date
  return format(period);
}


