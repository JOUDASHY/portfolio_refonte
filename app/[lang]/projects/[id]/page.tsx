"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { projetService } from "../../../services/backoffice/projetService";
import type { Projet } from "../../../types/backoffice/projet";
import { useLanguage } from "../../../hooks/LanguageProvider";
import { ratingService } from "../../../services/backoffice/ratingService";

// Star components (decimal-aware)
function StarPartial({ fill, className }: { fill: number; className?: string }) {
  const id = `sp-${Math.random().toString(36).slice(2)}`;
  const pct = Math.round(fill * 100);
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <defs>
        <clipPath id={id}>
          <rect x="0" y="0" width={pct / 5} height="20" />
        </clipPath>
      </defs>
      <path fill="currentColor" className="text-[#000b31]/15"
        d="M10 1.618l2.292 4.628.289.583.644.094 5.109.742-3.695 3.601-.469.457.111.651.869 5.062L10 14.347l-4.75 2.389.869-5.062.111-.651-.469-.457L2.066 7.665l5.109-.742.644-.094.289-.583L10 1.618m0-1.618L6.854 5.091.976 5.944l4.258 4.148L4.07 19.09 10 16.001l5.93 3.089-1.164-6.998 4.258-4.148-5.878-.853L10 0z"
      />
      {pct > 0 && (
        <path fill="#f68c09" clipPath={`url(#${id})`}
          d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.953L10 0l2.951 5.957 6.561.953-4.756 4.635 1.122 6.545z"
        />
      )}
    </svg>
  );
}

function Stars({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${value} étoiles`}>
      {Array.from({ length: max }).map((_, i) => (
        <StarPartial key={i} fill={Math.min(1, Math.max(0, value - i))} className="w-5 h-5 sm:w-6 sm:h-6" />
      ))}
    </div>
  );
}

export default function ProjectDetailPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();
  const { t } = useLanguage();

  const [project, setProject] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);
  const [rating, setRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await projetService.list();
        const list = Array.isArray(data) ? data : [];
        const found = list.find((p) => String(p.id) === String(id));
        if (mounted) {
          setProject(found ?? null);
          setRating(Math.max(0, found?.average_score ?? 0));
          if (found) document.title = `${found.nom} – Projet`;
        }
        // Load rating summary
        if (found) {
          try {
            const { data: summary } = await ratingService.summary(found.id);
            if (mounted) {
              setRating(summary.average_score ?? 0);
              setRatingsCount(summary.ratings_count ?? 0);
            }
          } catch { /* fallback to average_score */ }
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const handleRating = async (score: number) => {
    if (!project) return;
    setSubmitting(true);
    setRatingError(null);
    try {
      await ratingService.create({ project_id: project.id, score });
      // Refresh summary to get updated average + count
      const { data: summary } = await ratingService.summary(project.id);
      setRating(summary.average_score ?? 0);
      setRatingsCount(summary.ratings_count ?? 0);
    } catch (e: unknown) {
      setRatingError(e instanceof Error ? e.message : "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-4 border-[#f68c09] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-foreground/60 text-lg">Projet introuvable.</p>
        <button onClick={() => router.push(`/${lang}`)} className="text-[#f68c09] underline text-sm">
          ← Retour
        </button>
      </div>
    );
  }

  const images = project.related_images?.map((i) => i.image) ?? [];
  const allImages = images.length > 0 ? images : ["/window.svg"];
  const total = allImages.length;
  const technos = project.techno?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  return (
    <main className="min-h-0 bg-white pt-20 pb-8 px-3 sm:px-4">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button
          onClick={() => router.push(`/${lang}#projects`)}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#000b31]/50 hover:text-[#f68c09] transition-colors mb-5 sm:mb-6"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          {t("projects.title")}
        </button>

        {/* Page title */}
        <div className="mb-5 sm:mb-8">
          <p className="text-[10px] sm:text-xs font-semibold text-[#000b31]/40 uppercase tracking-widest mb-1">{t("projects.detail")}</p>
          <h1 className="text-xl sm:text-3xl font-bold text-[#000b31]">{project.nom}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10">
          {/* Gallery */}
          <div className="space-y-3">
            {/* Main image — clic ouvre plein écran */}
            <div
              className="relative w-full overflow-hidden rounded-xl sm:rounded-2xl bg-[#f5f7ff] border border-[#000b31]/10 shadow-md sm:shadow-lg cursor-zoom-in"
              style={{ minHeight: "220px" }}
              onClick={() => setFullscreen(true)}
            >
              <Image
                src={allImages[imgIndex]}
                alt={`${project.nom} ${imgIndex + 1}`}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-3 sm:p-6"
                unoptimized
              />
              {total > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i - 1 + total) % total); }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/80 text-[#000b31] shadow hover:bg-white transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setImgIndex((i) => (i + 1) % total); }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/80 text-[#000b31] shadow hover:bg-white transition-all"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 sm:h-5 sm:w-5"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                  </button>
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs text-[#000b31]/50 bg-white/70 px-2 py-0.5 rounded-full">
                    {imgIndex + 1} / {total}
                  </div>
                </>
              )}
            </div>

            {/* Fullscreen overlay */}
            {fullscreen && (
              <div
                className="fixed inset-0 z-50 bg-[#0a0a0a] flex flex-col items-center justify-center"
                onClick={() => setFullscreen(false)}
              >
                {/* Bouton fermer */}
                <button
                  onClick={() => setFullscreen(false)}
                  className="absolute top-4 right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/30 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
                  </svg>
                </button>

                {/* Image + nav */}
                <div className="relative flex items-center justify-center w-full h-full" onClick={(e) => e.stopPropagation()}>
                  {total > 1 && (
                    <button
                      onClick={() => setImgIndex((i) => (i - 1 + total) % total)}
                      className="absolute left-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                    </button>
                  )}
                  <Image
                    src={allImages[imgIndex]}
                    alt={`${project.nom} ${imgIndex + 1}`}
                    width={1200}
                    height={900}
                    className="object-contain max-h-[85vh] max-w-[95vw] rounded-lg"
                    unoptimized
                  />
                  {total > 1 && (
                    <button
                      onClick={() => setImgIndex((i) => (i + 1) % total)}
                      className="absolute right-4 z-10 h-10 w-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 transition-all"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                    </button>
                  )}
                </div>

                {/* Dots */}
                {total > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIndex(i)}
                        className={`h-2 rounded-full transition-all ${i === imgIndex ? 'w-5 bg-[#f68c09]' : 'w-2 bg-white/30'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Compteur */}
                {total > 1 && (
                  <p className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white/40 text-xs">
                    {imgIndex + 1} / {total}
                  </p>
                )}
              </div>
            )}

            {/* Thumbnails */}
            {total > 1 && (
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {allImages.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className={`relative h-12 w-12 sm:h-16 sm:w-16 overflow-hidden rounded-lg sm:rounded-xl border-2 transition-all ${i === imgIndex ? "border-[#f68c09] shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}
                  >
                    <Image src={src} alt="" fill sizes="64px" className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 sm:gap-6">
            <div>
              {project.is_featured && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] sm:text-xs font-medium text-[#f68c09] bg-[#f68c09]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-2.5 h-2.5 sm:w-3 sm:h-3">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </span>
              )}
            </div>

            {project.description && (
              <p className="text-[#000b31]/70 text-sm sm:text-base leading-relaxed">{project.description}</p>
            )}

            {/* Technos */}
            {technos.length > 0 && (
              <div>
                <p className="text-[10px] sm:text-xs font-semibold text-[#000b31]/40 uppercase tracking-wider mb-1.5 sm:mb-2">Technologies</p>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {technos.map((tech) => (
                    <span key={tech} className="px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-[#000b31]/5 text-[#000b31] border border-[#000b31]/10">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Rating */}
            <div>
              <p className="text-[10px] sm:text-xs font-semibold text-[#000b31]/40 uppercase tracking-wider mb-2">{t("projects.averageRating")}</p>
              {/* Display stars + score */}
              <div className="flex items-center gap-2 mb-3">
                <Stars value={rating} />
                <span className="text-base sm:text-lg font-bold text-[#000b31]">{Number(rating).toFixed(1)}</span>
                <span className="text-xs text-[#000b31]/40">/5</span>
                {ratingsCount > 0 && (
                  <span className="text-[10px] sm:text-xs text-[#000b31]/40 ml-1">
                    ({ratingsCount} {ratingsCount === 1 ? "vote" : "votes"})
                  </span>
                )}
              </div>
              {/* Rate buttons */}
              <p className="text-[10px] sm:text-xs font-semibold text-[#000b31]/40 uppercase tracking-wider mb-1.5">{t("projects.rateProject")}</p>
              <div className="flex items-center gap-1 sm:gap-1.5">
                {[1, 2, 3, 4, 5].map((score) => (
                  <button
                    key={score}
                    disabled={submitting}
                    onClick={() => handleRating(score)}
                    className={`h-7 w-7 sm:h-9 sm:w-9 flex items-center justify-center rounded-lg sm:rounded-xl transition-all ${rating >= score ? "bg-[#f68c09] text-white shadow" : "bg-[#000b31]/5 text-[#000b31]/30 hover:bg-[#f68c09]/20"} ${submitting ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
              {ratingError && <p className="mt-1 text-[10px] sm:text-xs text-red-500">{ratingError}</p>}
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-auto pt-1 sm:pt-2">
              {project.projetlink && (
                <a
                  href={project.projetlink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#f68c09] text-white text-xs sm:text-sm font-semibold hover:brightness-110 transition-all shadow"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
                  {t("projects.view")}
                </a>
              )}
              {project.githublink && (
                <a
                  href={project.githublink}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-[#000b31] text-white text-xs sm:text-sm font-semibold hover:bg-[#000b31]/80 transition-all shadow"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
