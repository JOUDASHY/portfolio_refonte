"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useProjects } from "../hooks/useProjects";

export default function Projects() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section 
      id="projects" 
      className="relative bg-white py-20 sm:py-24 lg:py-32 border-b-2 overflow-hidden" 
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#f68c09]/30 shadow-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-[#f68c09] animate-pulse" />
            <span className="text-sm font-medium text-[#000b31]">{t("projects.subtitle")}</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#000b31] mb-4">
            {t("projects.title")}
          </h2>
          <p className="text-lg text-[#000b31]/70 max-w-2xl mx-auto">
            Discover my latest work and creative projects
          </p>
        </div>
        <ProjectGrid />
      </div>
    </section>
  );
}

function ProjectGrid() {
  const { t } = useLanguage();
  const { items, loading, error } = useProjects();

  function AnimatedCard({ children, delayMs }: { children: React.ReactNode; delayMs: number }) {
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
        className={`${visible ? "animate-fade-in-up" : "opacity-0 translate-y-8"} 
          group rounded-2xl overflow-hidden bg-white border border-[#000b31]/10 
          shadow-sm hover:shadow-2xl hover:shadow-[#f68c09]/10 
          transition-all duration-500 hover:-translate-y-2`}
        style={visible ? { animationDelay: `${delayMs}ms` } : undefined}
      >
        {children}
      </li>
    );
  }

  if (error) {
    return (
      <div className="mb-8 rounded-xl bg-[#f68c09]/10 p-4 text-[#000b31] border border-[#f68c09]/30 text-center">
        {error}
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="group rounded-2xl overflow-hidden bg-white border border-[#000b31]/10 shadow-sm">
              <div className="relative h-28 sm:h-36 lg:h-44 w-full bg-[#000b31]/5">
                <div className="absolute inset-0 p-4">
                  <div className="animate-pulse h-full w-full rounded-lg bg-[#000b31]/10" />
                </div>
              </div>
              <div className="p-3 sm:p-4">
                <div className="animate-pulse h-4 w-32 rounded bg-[#000b31]/10" />
                <div className="mt-3 h-3 w-20 rounded bg-[#000b31]/10" />
              </div>
            </li>
          ))
        : items.map((p, idx) => (
            <AnimatedCard key={p.id} delayMs={idx * 100}>
              <ProjectCard project={p} />
            </AnimatedCard>
          ))}
    </ul>
  );
}

function ProjectCard({ project }: { project: { id: number; title: string; image: string; href?: string; initialStars: number } }) {
  const { t } = useLanguage();
  const [currentRating, setCurrentRating] = useState(project.initialStars);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleRating = async (score: number) => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch('/api/rating/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          project_id: project.id,
          score: score
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
      
      setCurrentRating(score);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      className="h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-28 sm:h-36 lg:h-44 w-full overflow-hidden bg-gradient-to-br from-[#000b31]/5 to-transparent">
        <div className={`absolute inset-0 bg-[#f68c09]/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        <Image 
          src={project.image} 
          alt={project.title} 
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" 
          className={`object-contain p-3 sm:p-4 transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`} 
        />
        
        {/* Rating Badge */}
        <div className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-[#000b31]/80 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm text-white backdrop-blur-sm border border-[#f68c09]/30">
          <span className="inline-flex items-center gap-1">
            <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-[#f68c09]" filled={true} /> 
            <span className="font-semibold">{currentRating}</span>
          </span>
        </div>
        
        {/* Hover overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-[#000b31]/60 to-transparent transition-opacity duration-300 flex items-end justify-center pb-4 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-white text-sm font-medium px-4 py-2 rounded-full bg-[#f68c09] shadow-lg transform transition-transform duration-300 hover:scale-105">
            {t("projects.view")}
          </span>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-2 sm:p-3 lg:p-4 flex-1 flex flex-col">
        <h3 className="text-sm sm:text-base text-[#000b31] font-bold tracking-tight line-clamp-1">{project.title}</h3>
        
        {/* Rating Section */}
        <div className="mt-2 sm:mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Stars value={currentRating} size="sm" />
          </div>
          <span className="text-xs text-[#000b31]/50 font-medium">{currentRating}/5</span>
        </div>
        
        {/* Rate buttons */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-[#000b31]/40">Rate:</span>
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                className={`inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 rounded transition-all duration-200 ${
                  currentRating >= score
                    ? 'bg-[#f68c09] text-[#000b31]'
                    : 'bg-[#000b31]/10 text-[#000b31]/40 hover:bg-[#f68c09]/30'
                } ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                onClick={() => handleRating(score)}
                disabled={submitting}
                title={`Rate ${score} star${score > 1 ? 's' : ''}`}
              >
                <StarIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" filled={currentRating >= score} />
              </button>
            ))}
          </div>
        </div>
        
        {error && (
          <div className="mt-2 text-xs text-[#f68c09] bg-[#f68c09]/10 px-2 py-1 rounded">{error}</div>
        )}
      </div>
    </div>
  );
}

function Stars({ value = 0, max = 5, size = "md" }: { value?: number; max?: number; size?: "sm" | "md" | "lg" }) {
  const filled = Math.min(max, Math.round((value % (max + 1))));
  const sizeClasses = {
    sm: "w-3 h-3 sm:w-3.5 sm:h-3.5",
    md: "w-4 h-4 sm:w-5 sm:h-5",
    lg: "w-5 h-5 sm:w-6 sm:h-6"
  };
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarIcon 
          key={i} 
          className={`${sizeClasses[size]} ${i < filled ? "text-[#f68c09]" : "text-[#000b31]/20"}`} 
          filled={i < filled} 
        />
      ))}
    </div>
  );
}

function StarIcon({ className = "", filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className} fill="currentColor" aria-hidden>
      {filled ? (
        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.953L10 0l2.951 5.957 6.561.953-4.756 4.635 1.122 6.545z" />
      ) : (
        <path d="M10 1.618l2.292 4.628.289.583.644.094 5.109.742-3.695 3.601-.469.457.111.651.869 5.062L10 14.347l-4.75 2.389.869-5.062.111-.651-.469-.457L2.066 7.665l5.109-.742.644-.094.289-.583L10 1.618m0-1.618L6.854 5.091.976 5.944l4.258 4.148L4.07 19.09 10 16.001l5.93 3.089-1.164-6.998 4.258-4.148-5.878-.853L10 0z" />
      )}
    </svg>
  );
}


