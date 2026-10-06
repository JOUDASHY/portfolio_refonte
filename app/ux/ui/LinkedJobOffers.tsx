"use client";

import { useEffect, useState } from "react";
import { jobService } from "../../services/backoffice/jobService";
import {
  JOB_SOURCE_LABELS,
  JOB_STATUS_LABELS,
  type JobOffer,
} from "../../types/backoffice/job";

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
          <div
            key={offer.id}
            className="rounded-lg border border-input p-4"
          >
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
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-medium text-foreground/80 hover:text-foreground">
                  Voir la description de l&apos;offre
                </summary>
                <div
                  className="mt-2 max-h-72 overflow-auto rounded-lg border border-input p-3 text-sm text-foreground/80"
                  // Les descriptions des APIs contiennent du HTML léger (p, ul, br…).
                  dangerouslySetInnerHTML={{ __html: offer.description }}
                />
              </details>
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
        ))}
      </div>
    </div>
  );
}
