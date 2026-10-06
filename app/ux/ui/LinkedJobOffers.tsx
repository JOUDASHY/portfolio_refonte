"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { jobService } from "../../services/backoffice/jobService";
import {
  JOB_SOURCE_LABELS,
  JOB_STATUS_LABELS,
  type JobOffer,
} from "../../types/backoffice/job";

const TARGET_LANGS: { code: string; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "en", label: "Anglais" },
  { code: "es", label: "Espagnol" },
  { code: "de", label: "Allemand" },
];

function formatDate(value: string | null): string {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

function OfferCard({ offer }: { offer: JobOffer }) {
  const [targetLang, setTargetLang] = useState("fr");
  const [translated, setTranslated] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleTranslate = async () => {
    setTranslating(true);
    try {
      const { data } = await jobService.translate(offer.description, targetLang);
      setTranslated(data.translated);
      setShowOriginal(false);
    } catch {
      toast.error("La traduction a échoué (service IA indisponible ?).");
    } finally {
      setTranslating(false);
    }
  };

  const bodyHtml = translated && !showOriginal ? translated : offer.description;

  return (
    <div className="rounded-lg border border-input p-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground hover:underline"
        >
          {offer.title}
        </a>
        <div className="flex items-center gap-2">
          {offer.is_remote && (
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Remote
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${JOB_STATUS_LABELS[offer.status].color}`}
          >
            {JOB_STATUS_LABELS[offer.status].fr}
          </span>
        </div>
      </div>

      <div className="mt-1 text-sm text-foreground/70">
        {offer.company || "—"}
        {offer.location ? ` · ${offer.location}` : ""}
        {offer.salary ? ` · ${offer.salary}` : ""}
      </div>

      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground/50">
        <span>{JOB_SOURCE_LABELS[offer.source]}</span>
        <span>·</span>
        <span>Publiée {formatDate(offer.published_at)}</span>
        <span>·</span>
        <span>Score {offer.match_score}</span>
      </div>

      {offer.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {offer.tags.slice(0, 8).map((tag, i) => (
            <span
              key={`${offer.id}-${i}`}
              className="rounded-full border border-input px-2 py-0.5 text-[11px] text-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {offer.description && (
        <div className="mt-3">
          {/* Barre de traduction */}
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <select
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="rounded-lg border border-input bg-background text-foreground px-2 py-1 text-xs"
            >
              {TARGET_LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={translating}
              className="rounded-lg border border-input px-3 py-1 text-xs font-medium text-foreground hover:bg-foreground/5 disabled:opacity-60"
            >
              {translating ? "Traduction…" : "Traduire"}
            </button>
            {translated && (
              <button
                type="button"
                onClick={() => setShowOriginal((v) => !v)}
                className="text-xs font-medium text-foreground/70 hover:text-foreground underline"
              >
                {showOriginal ? "Voir la traduction" : "Voir l'original"}
              </button>
            )}
          </div>

          <details className="group" open={Boolean(translated)}>
            <summary className="cursor-pointer text-sm font-medium text-foreground/80 hover:text-foreground">
              {translated && !showOriginal
                ? "Description traduite"
                : "Voir la description de l'offre"}
            </summary>
            <div
              className="mt-2 max-h-72 overflow-auto rounded-lg border border-input p-3 text-sm text-foreground/80"
              // HTML léger renvoyé par les APIs d'offres (p, ul, br…).
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />
          </details>
        </div>
      )}

      <div className="mt-3">
        <a
          href={offer.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg px-3 py-1.5 text-xs font-medium text-black shadow"
          style={{ backgroundColor: "#f68c09" }}
        >
          Ouvrir l&apos;offre d&apos;origine
        </a>
      </div>
    </div>
  );
}

/**
 * Affiche la ou les offres d'emploi scrapées rattachées à un prospect.
 * Rendu uniquement si au moins une offre est liée.
 */
export default function LinkedJobOffers({ prospectId }: { prospectId: number }) {
  const [offers, setOffers] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data } = await jobService.list({ prospect: prospectId });
        if (active) setOffers(data);
      } catch {
        if (active) setOffers([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [prospectId]);

  if (loading || offers.length === 0) return null;

  return (
    <div className="rounded-xl card-border p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-foreground">
        Offre{offers.length > 1 ? "s" : ""} d&apos;emploi liée{offers.length > 1 ? "s" : ""}
      </h2>
      <div className="space-y-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  );
}
