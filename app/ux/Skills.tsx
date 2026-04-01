"use client";

import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { useSkills } from "../hooks/useSkills";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useEffect, useRef, useState } from "react";

// Category icons mapping
const categoryIcons: Record<string, string> = {
  "Frontend": "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  "Backend": "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01",
  "Tooling": "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
  "Database": "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4",
  "DevOps": "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
  "Mobile": "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z",
  "Design": "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01",
};

// Skill level colors - using solid base accent color
const getLevelColor = (level: number) => {
  // All levels use the same accent color
  return "bg-accent";
};

const getLevelLabel = (level: number) => {
  if (level >= 9) return "Expert";
  if (level >= 7) return "Advanced";
  if (level >= 5) return "Intermediate";
  return "Beginner";
};

// Animated counter hook
function useCountUp(end: number, duration: number = 1000) {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      countRef.current = Math.floor(easeOutQuart * end);
      setCount(countRef.current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration]);

  return count;
}

// Animated skill bar
function SkillBar({ name, level, delay }: { name: string; level: number; delay: number }) {
  const [isVisible, setIsVisible] = useState(false);
  const barRef = useRef<HTMLLIElement>(null);
  const animatedLevel = useCountUp(isVisible ? level : 0, 1500);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (barRef.current) {
      observer.observe(barRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const clamped = Math.max(0, Math.min(10, level || 0));
  const width = isVisible ? `${(clamped / 10) * 100}%` : "0%";

  return (
    <li ref={barRef} className="group">
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xs sm:text-sm font-medium text-[#000b31] group-hover:text-[#f68c09] transition-colors">{name}</span>
          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full bg-[#f68c09]/10 text-[#f68c09] opacity-0 group-hover:opacity-100 transition-opacity">
            {getLevelLabel(level)}
          </span>
        </div>
        <span className="text-xs sm:text-sm font-bold text-[#000b31]">{animatedLevel}/10</span>
      </div>
      <div className="h-2 sm:h-2.5 rounded-full bg-[#000b31]/10 overflow-hidden">
        <div
          className={`h-full rounded-full ${getLevelColor(level)} transition-all duration-1000 ease-out relative`}
          style={{ width }}
        >
          <div className="absolute inset-0 bg-white/30 animate-shimmer" />
        </div>
      </div>
    </li>
  );
}

// Category card with animations
function Category({ title, skills, loading, index, t }: { title: string; skills: Skill[]; loading?: boolean; index: number; t: (key: string) => string }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const iconPath = categoryIcons[title] || categoryIcons["Tooling"];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), index * 100);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-xl sm:rounded-2xl bg-white border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden
        ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {/* Decorative gradient blob */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#f68c09]/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
      
      {/* Header */}
      <div className="relative flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[#000b31] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
          <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#f68c09]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
          </svg>
        </div>
        <div>
          <h3 className="text-sm sm:text-lg font-bold text-[#000b31]">{title}</h3>
          <p className="text-xs sm:text-sm text-[#000b31]/50">{loading ? "..." : `${skills.length} skills`}</p>
        </div>
      </div>

      {/* Skills list */}
      <ul className="space-y-3 sm:space-y-4 relative">
        {loading
          ? Array.from({ length: 4 }).map((_, idx) => (
              <li key={idx}>
                <div className="animate-pulse space-y-1.5 sm:space-y-2">
                  <div className="h-3 w-24 sm:h-4 sm:w-32 rounded bg-[#000b31]/10" />
                  <div className="h-2 sm:h-2.5 w-full rounded bg-[#000b31]/10" />
                </div>
              </li>
            ))
          : skills.map((s, idx) => (
              <SkillBar key={s.name} name={s.name} level={s.level} delay={idx * 100} />
            ))}
      </ul>

      {/* Bottom decoration */}
      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-[#f68c09]/20 flex items-center justify-between text-[10px] sm:text-xs text-[#000b31]/50">
        <span>{t("skills.proficiency")}</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((dot) => (
            <div
              key={dot}
              className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full transition-all duration-300 ${
                !loading && skills.length > 0 && dot <= Math.ceil(skills.reduce((a, s) => a + s.level, 0) / skills.length / 2)
                  ? "bg-[#f68c09] scale-110"
                  : "bg-[#000b31]/20"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Skills() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { grouped, loading, error } = useSkills();
  const isDark = theme === "dark";

  const categories = loading ? ["Frontend", "Backend", "Tooling", "Database"] : Array.from(grouped.keys());

  return (
    <section 
      id="skills" 
      className="relative py-20 sm:py-24 lg:py-32 border-b-2 overflow-hidden bg-white"
      style={{ 
        borderColor: getAdaptiveBorderColor(isDark), 
        boxShadow: getAdaptiveShadow(isDark)
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-[#f68c09]/10 to-transparent rounded-full" />
      </div>

      <div className="relative mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-4 sm:py-2 rounded-full bg-white border border-[#f68c09]/30 shadow-sm mb-3 sm:mb-6">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#f68c09] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-[#000b31]">{t("skills.subtitle")}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-[#000b31] mb-2 sm:mb-4">
            {t("skills.title")}
          </h2>
          <p className="text-sm sm:text-lg text-[#000b31]/70 max-w-2xl mx-auto">
            {t("skills.description")}
          </p>
        </div>

        {error && (
          <div className="mb-4 sm:mb-8 rounded-lg sm:rounded-xl bg-[#f68c09]/10 p-2 sm:p-4 text-[#000b31] border border-[#f68c09]/30 text-center text-xs sm:text-base">
            {error}
          </div>
        )}

        {/* Skills grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-8 md:grid-cols-2 xl:grid-cols-4">
          {categories.map((cat, idx) => (
            <Category
              key={cat}
              title={cat}
              skills={loading ? [] : grouped.get(cat) || []}
              loading={loading}
              index={idx}
              t={t}
            />
          ))}
        </div>

        {/* Bottom stats */}
        {!loading && (
          <div className="mt-8 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {[
              { label: t("skills.stats.totalSkills"), value: Array.from(grouped.values()).flat().length },
              { label: t("skills.stats.categories"), value: grouped.size },
              { label: t("skills.stats.expertLevel"), value: Array.from(grouped.values()).flat().filter(s => s.level >= 8).length },
              { label: t("skills.stats.yearsExp"), value: "2" },
            ].map((stat, idx) => (
              <div 
                key={stat.label}
                className="text-center p-3 sm:p-6 rounded-lg sm:rounded-xl bg-white border border-[#f68c09]/20 backdrop-blur-sm"
              >
                <div className="text-xl sm:text-3xl font-bold text-[#f68c09]">{stat.value}</div>
                <div className="text-xs sm:text-sm text-[#000b31]/60 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

type Skill = { name: string; level: number };


