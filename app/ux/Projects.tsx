"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { getAdaptiveShadow, getAdaptiveBorderColor } from "../lib/shadowUtils";
import { useProjects } from "../hooks/useProjects";
import { ratingService } from "../services/backoffice/ratingService";
import Modal from "./ui/Modal";

export default function Projects() {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <section
      id="projects"
      className="relative bg-white pb-20 sm:pb-24 lg:pb-32 border-b-2 overflow-hidden"
      style={{ borderColor: getAdaptiveBorderColor(isDark), boxShadow: getAdaptiveShadow(isDark) }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-40 -right-40 w-80 h-80 bg-[#f68c09]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-40 w-80 h-80 bg-[#000b31]/5 rounded-full blur-3xl" />
      </div>

      {/* Brand blue wavy header for the title only */}
      <div
        className="relative pt-20 sm:pt-24 lg:pt-32 pb-32 sm:pb-40 mb-16 z-10 w-full"
        style={{ backgroundColor: 'var(--blue)' }}
      >
        <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 shadow-sm mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#f68c09] animate-pulse" />
            <span className="text-sm font-medium" style={{ color: 'var(--jaune)' }}>{t("projects.subtitle")}</span>
          </div>
          <h2
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4"
            style={{ color: 'var(--jaune)' }}
          >
            {t("projects.title")}
          </h2>
          <p
            className="text-lg max-w-2xl mx-auto"
            style={{ color: 'var(--jaune)', opacity: 0.9 }}
          >
            {t("projects.tagline")}
          </p>
        </div>

        {/* Wavy bottom limit */}
        <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[60px] sm:h-[100px] lg:h-[140px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L48,138.7C96,149,192,171,288,165.3C384,160,480,128,576,133.3C672,139,768,181,864,181.3C960,181,1056,139,1152,117.3C1248,96,1344,96,1392,96L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
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
          group rounded-xl overflow-hidden bg-white border border-[#000b31]/10 
          shadow-sm hover:shadow-2xl hover:shadow-[#f68c09]/10 
          transition-all duration-500 hover:-translate-y-1`}
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
    <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
      {loading
        ? Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="group rounded-xl overflow-hidden bg-white border border-[#000b31]/10 shadow-sm">
            <div className="relative h-20 sm:h-28 lg:h-36 w-full bg-[#000b31]/5">
              <div className="absolute inset-0 p-2 sm:p-3">
                <div className="animate-pulse h-full w-full rounded-lg bg-[#000b31]/10" />
              </div>
            </div>
            <div className="p-2 sm:p-3">
              <div className="animate-pulse h-3 w-20 rounded bg-[#000b31]/10" />
              <div className="mt-2 h-2 w-16 rounded bg-[#000b31]/10" />
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

function ProjectCard({ project }: { project: { id: number; title: string; image: string; images: string[]; href?: string; initialStars: number } }) {
  const { t } = useLanguage();
  const [currentRating, setCurrentRating] = useState(project.initialStars);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const allImages = project.images.length > 0 ? project.images : [project.image];
  const total = allImages.length;

  const prev = (e: React.MouseEvent) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + total) % total); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % total); };

  const handleRating = async (score: number) => {
    setSubmitting(true);
    setError(null);
    try {
      const { data } = await ratingService.create({
        project_id: project.id,
        score,
      });
      setCurrentRating(data.score);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Lightbox Modal */}
      <Modal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        size="xl"
        className="!p-0 !bg-[#0a0a0a] overflow-hidden"
      >
        <div className="relative flex flex-col items-center justify-center p-6 pt-10">
          {/* Bouton X fermer */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-3 right-3 z-20 h-9 w-9 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-all"
            aria-label="Fermer"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </button>

          {/* Image + nav */}
          <div className="relative flex items-center justify-center w-full">
            {total > 1 && (
              <button onClick={prev} className="absolute left-0 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              </button>
            )}
            <Image
              src={allImages[imgIndex]}
              alt={`${project.title} ${imgIndex + 1}`}
              width={900}
              height={700}
              className="object-contain max-h-[65vh] w-auto rounded-lg mx-12"
              unoptimized
            />
            {total > 1 && (
              <button onClick={next} className="absolute right-0 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
              </button>
            )}
          </div>

          {/* Dots */}
          {total > 1 && (
            <div className="flex gap-1.5 mt-3">
              {allImages.map((_, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className={`h-2 rounded-full transition-all ${i === imgIndex ? 'w-5 bg-[#f68c09]' : 'w-2 bg-white/30'}`}
                />
              ))}
            </div>
          )}

          <p className="mt-3 text-white font-bold text-lg text-center">{project.title}</p>
          {total > 1 && <p className="text-white/40 text-xs mt-1">{imgIndex + 1} / {total}</p>}

          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 mb-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#f68c09] text-white text-sm font-semibold hover:brightness-110 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
              {t("projects.view")}
            </a>
          )}
        </div>
      </Modal>

      <div
        className="h-full flex flex-col"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Image Container — clic ouvre lightbox */}
        <div
          className="relative h-20 sm:h-28 lg:h-36 w-full overflow-hidden bg-gradient-to-br from-[#000b31]/5 to-transparent cursor-zoom-in"
          onClick={() => setLightboxOpen(true)}
        >
          <div className={`absolute inset-0 bg-[#f68c09]/10 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-contain p-2 sm:p-3 transition-transform duration-500 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {/* Rating Badge */}
          <div className="absolute left-1 top-1 sm:left-2 sm:top-2 rounded-full bg-[#000b31]/80 px-1.5 py-0.5 sm:px-2 sm:py-0.5 text-[10px] sm:text-xs text-white backdrop-blur-sm border border-[#f68c09]/30">
            <span className="inline-flex items-center gap-0.5">
              <StarIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#f68c09]" filled={true} />
              <span className="font-semibold">{Number(currentRating).toFixed(1)}</span>
            </span>
          </div>

          {/* Hover overlay — zoom icon */}
          <div className={`absolute inset-0 bg-gradient-to-t from-[#000b31]/60 to-transparent transition-opacity duration-300 flex items-center justify-center ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white/80"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zm2.5-4h-2v2H9v-2H7V9h2V7h1v2h2v1z" /></svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-1.5 sm:p-2 lg:p-3 flex-1 flex flex-col">
          <h3 className="text-[10px] sm:text-sm text-[#000b31] font-bold tracking-tight line-clamp-1">{project.title}</h3>

          {/* Rating Section */}
          <div className="mt-1 sm:mt-2 flex items-center justify-between">
            <div className="flex items-center gap-0.5">
              <Stars value={currentRating} size="sm" />
            </div>
            <span className="text-[8px] sm:text-xs text-[#000b31]/50 font-medium">{Number(currentRating).toFixed(1)}/5</span>
          </div>

          {/* Rate buttons */}
          <div className="mt-1 sm:mt-2 flex items-center justify-between">
            <span className="text-[8px] sm:text-xs text-[#000b31]/40">{t("projects.rateProject")}:</span>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((score) => (
                <button
                  key={score}
                  className={`inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded transition-all duration-200 ${currentRating >= score
                    ? 'bg-[#f68c09] text-[#000b31]'
                    : 'bg-[#000b31]/10 text-[#000b31]/40 hover:bg-[#f68c09]/30'
                    } ${submitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
                  onClick={() => handleRating(score)}
                  disabled={submitting}
                  title={`Rate ${score} star${score > 1 ? 's' : ''}`}
                >
                  <StarIcon className="w-2 h-2 sm:w-3 sm:h-3" filled={currentRating >= score} />
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mt-1 text-[8px] text-[#f68c09] bg-[#f68c09]/10 px-1 py-0.5 rounded">{error}</div>
          )}

          {/* Voir projet button */}
          {project.href && (
            <a
              href={project.href}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-2 inline-flex items-center justify-center gap-1 w-full py-1 sm:py-1.5 rounded-lg bg-[#000b31] text-white text-[9px] sm:text-xs font-semibold hover:bg-[#f68c09] transition-colors duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
              {t("projects.view")}
            </a>
          )}
        </div>
      </div>
    </>
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


