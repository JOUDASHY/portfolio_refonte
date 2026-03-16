"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Button from "@/app/ux/ui/Button";
import SearchBar from "@/app/ux/ui/SearchBar";
import { useProspects } from "@/app/hooks/useProspects";
import { prospectService } from "@/app/services/backoffice/prospectService";
import {
  PROSPECT_STATUS_LABELS,
  PROSPECT_SOURCE_LABELS,
  type ProspectStatus,
} from "@/app/types/backoffice/prospect";
import { useLanguage } from "@/app/hooks/LanguageProvider";
import { useTheme } from "@/app/components/ThemeProvider";

const STATUS_ORDER: ProspectStatus[] = [
  "new",
  "contacted",
  "interested",
  "proposal_sent",
  "negotiation",
  "won",
  "lost",
];

const COLUMN_COLORS: Record<
  ProspectStatus,
  { border: string; headerBg: string; dot: string }
> = {
  new: {
    border: "border-sky-500/40",
    headerBg: "bg-sky-500/10",
    dot: "bg-sky-400",
  },
  contacted: {
    border: "border-blue-500/40",
    headerBg: "bg-blue-500/10",
    dot: "bg-blue-400",
  },
  interested: {
    border: "border-amber-500/40",
    headerBg: "bg-amber-500/10",
    dot: "bg-amber-400",
  },
  proposal_sent: {
    border: "border-violet-500/40",
    headerBg: "bg-violet-500/10",
    dot: "bg-violet-400",
  },
  negotiation: {
    border: "border-orange-500/40",
    headerBg: "bg-orange-500/10",
    dot: "bg-orange-400",
  },
  won: {
    border: "border-emerald-500/40",
    headerBg: "bg-emerald-500/10",
    dot: "bg-emerald-400",
  },
  lost: {
    border: "border-rose-500/40",
    headerBg: "bg-rose-500/10",
    dot: "bg-rose-400",
  },
};

export default function ProspectsPage() {
  const { t, lang } = useLanguage();
  const { theme } = useTheme();
  const [query, setQuery] = useState("");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const { items, loading, error, remove, updateStatus } = useProspects();
  const [ratings, setRatings] = useState<Record<number, number | null>>({});

  const filtered = useMemo(() => {
    return items.filter((prospect) => {
      const q = query.trim().toLowerCase();
      const matchesSearch =
        !q ||
        prospect.company_name.toLowerCase().includes(q) ||
        (prospect.contact_name?.toLowerCase() || "").includes(q) ||
        (prospect.city?.toLowerCase() || "").includes(q);

      const matchesSource = filterSource === "all" || prospect.source === filterSource;

      return matchesSearch && matchesSource;
    });
  }, [items, query, filterSource]);

  // Optionally fetch ratings and show stars in cards
  useEffect(() => {
    let cancelled = false;
    async function loadRatings() {
      try {
        const uniqueIds = Array.from(new Set(items.map((p) => p.id)));
        const entries: [number, number | null][] = [];
        for (const id of uniqueIds) {
          try {
            const { data } = await prospectService.getRating(id);
            entries.push([id, data.rating]);
          } catch {
            // No rating or error: treat as null
            entries.push([id, null]);
          }
        }
        if (!cancelled) {
          setRatings(Object.fromEntries(entries));
        }
      } catch {
        // ignore global error, ratings are optional
      }
    }
    if (items.length) {
      void loadRatings();
    } else {
      setRatings({});
    }
    return () => {
      cancelled = true;
    };
  }, [items]);

  async function handleDelete(id: number) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce prospect ?")) return;
    await remove(id);
  }

  async function handleDrop(targetStatus: ProspectStatus) {
    if (!draggingId) return;
    await updateStatus(draggingId, targetStatus);
    setDraggingId(null);
  }

  const getStatusLabel = (status: string) => {
    const key = status as keyof typeof PROSPECT_STATUS_LABELS;
    const label = PROSPECT_STATUS_LABELS[key];
    return label ? (lang === "fr" ? label.fr : label.en) : status;
  };

  const getSourceLabel = (source: string) => {
    const key = source as keyof typeof PROSPECT_SOURCE_LABELS;
    const label = PROSPECT_SOURCE_LABELS[key];
    return label ? (lang === "fr" ? label.fr : label.en) : source;
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-6rem)] space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            {lang === "fr" ? "Prospection" : "Prospecting"}
          </h1>
          <p className="text-sm text-foreground/60">
            {lang === "fr"
              ? "Visualisez vos prospects par étape et faites-les avancer dans le pipeline avec un tableau clair."
              : "Visualize prospects by stage and move them through the pipeline in a clear board."}
          </p>
        </div>
        <Link href="/backoffice/prospects/new">
          <Button variant="secondary" className="shadow-sm hover:shadow-md">
            {lang === "fr" ? "Nouveau prospect" : "New Prospect"}
          </Button>
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-cols-[minmax(0,2.5fr)_minmax(0,1fr)] items-center">
        <SearchBar
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === "fr" ? "Rechercher par nom, contact, ville..." : "Search by name, contact, city..."}
        />
        <select
          value={filterSource}
          onChange={(e) => setFilterSource(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">
            {lang === "fr" ? "Toutes les sources" : "All Sources"}
          </option>
          {Object.entries(PROSPECT_SOURCE_LABELS).map(([key, labels]) => (
            <option key={key} value={key}>
              {lang === "fr" ? labels.fr : labels.en}
            </option>
          ))}
        </select>
      </div>

      {/* Stats Summary + mini chart */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-stretch">
        {/* Status cards with donut charts */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
          {STATUS_ORDER.slice(0, 5).map((status) => {
            const count = items.filter((p) => p.status === status).length;
            const label = getStatusLabel(status);

            const total = items.length || 1;
            const percentage = Math.round((count / total) * 100);

            return (
              <div
                key={status}
                className="rounded-lg px-2 py-1.5 bg-black/10 border border-white/10 shadow-sm flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wide opacity-80">
                    {label}
                  </div>
                  <div className="text-xs text-foreground/60">
                    {lang === "fr" ? "Prospects" : "Prospects"} · {count} ({percentage}%)
                  </div>
                </div>
                {/* Donut chart */}
                <div className="relative h-12 w-12 flex-shrink-0">
                  <svg viewBox="0 0 40 40" className="h-12 w-12 -rotate-90">
                      {/* fond */}
                      <circle
                        cx="20"
                        cy="20"
                        r="15"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                      />
                      {/* valeur */}
                      <circle
                        cx="20"
                        cy="20"
                        r="15"
                        fill="none"
                        stroke={`var(${theme === "dark" ? "--jaune" : "--blue"})`}
                        strokeWidth="3"
                        strokeDasharray={`${(percentage / 100) * 100} 100`}
                        strokeLinecap="round"
                      />
                  </svg>
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-foreground">
                    {percentage}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mini line chart */}
        <div className="rounded-lg border border-white/10 bg-black/10 px-4 py-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                {lang === "fr" ? "Vue globale" : "Overview"}
              </div>
              <div className="text-[11px] text-foreground/50">
                {lang === "fr"
                  ? "Répartition de vos prospects par étape"
                  : "Distribution of your prospects by stage"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-foreground/60">
                {lang === "fr" ? "Total" : "Total"}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {items.length}
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {/* Courbe */}
            <div className="h-24 w-full">
              <svg viewBox="0 0 100 40" className="w-full h-full">
                <polyline
                  fill="none"
                  strokeWidth="2"
                  stroke={`var(${theme === "dark" ? "--jaune" : "--blue"})`}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={
                    STATUS_ORDER.map((status, index) => {
                      const count = items.filter((p) => p.status === status).length;
                      const maxCount = Math.max(
                        ...STATUS_ORDER.map((s) => items.filter((p) => p.status === s).length),
                        1
                      );
                      const x = (index / Math.max(STATUS_ORDER.length - 1, 1)) * 100;
                      const normalized = maxCount === 0 ? 0 : count / maxCount;
                      const y = 35 - normalized * 25; // marge haute/basse
                      return `${x},${y}`;
                    }).join(" ")
                  }
                />
                {/* Points */}
                {STATUS_ORDER.map((status, index) => {
                  const count = items.filter((p) => p.status === status).length;
                  const maxCount = Math.max(
                    ...STATUS_ORDER.map((s) => items.filter((p) => p.status === s).length),
                    1
                  );
                  const x = (index / Math.max(STATUS_ORDER.length - 1, 1)) * 100;
                  const normalized = maxCount === 0 ? 0 : count / maxCount;
                  const y = 35 - normalized * 25;
                  return (
                    <circle
                      key={status}
                      cx={x}
                      cy={y}
                      r={1.6}
                      fill={`var(${theme === "dark" ? "--jaune" : "--blue"})`}
                    />
                  );
                })}
              </svg>
            </div>

            {/* Légende statuts */}
            <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-foreground/60">
              {STATUS_ORDER.map((status) => (
                <span key={status} className="truncate max-w-[2.5rem]">
                  {getStatusLabel(status)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kanban Board - fixed height, table-like layout */}
      <div className="h-[70vh] rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/[0.02] p-3 lg:p-4 overflow-x-auto overflow-y-hidden flex flex-col shadow-sm">
        {loading ? (
          <div className="flex gap-4 h-full min-h-[400px]">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-64 flex-shrink-0 rounded-lg border border-white/10 bg-white/5 p-3 space-y-3 animate-pulse"
              >
                <div className="h-4 w-24 bg-white/10 rounded" />
                <div className="h-3 w-16 bg-white/10 rounded" />
                <div className="h-16 w-full bg-white/10 rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center flex-1 min-h-[400px] p-8 text-center text-foreground/60">
            {lang === "fr"
              ? "Aucun prospect pour ces filtres."
              : "No prospects for these filters."}
          </div>
        ) : (
          <div className="flex gap-2 lg:gap-3 min-w-max h-full">
            {STATUS_ORDER.map((status, index) => {
              const columnProspects = filtered.filter((p) => p.status === status);
              const label = getStatusLabel(status);
              const colors = COLUMN_COLORS[status];

              return (
                <div
                  key={status}
                  className="w-72 flex-shrink-0 h-full bg-black/5 flex flex-col min-h-0 rounded-xl backdrop-blur-[1px]"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(status)}
                  style={{
                    borderLeft:
                      index === 0
                        ? undefined
                        : `1px solid var(${theme === "dark" ? "--jaune" : "--blue"})`,
                    borderRight:
                      index === STATUS_ORDER.length - 1
                        ? `1px solid var(${theme === "dark" ? "--jaune" : "--blue"})`
                        : undefined,
                  }}
                >
                  <div
                    className={`flex items-center justify-between px-3 pt-3 pb-2 border-b ${colors.headerBg}`}
                    style={{
                      borderBottom: `1px solid var(${theme === "dark" ? "--jaune" : "--blue"})`,
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                        <span className="text-[11px] font-semibold text-foreground uppercase tracking-wide">
                          {label}
                        </span>
                      </div>
                      <span className="text-[10px] text-foreground/50">
                        {lang === "fr" ? "Prospects" : "Prospects"} · {columnProspects.length}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 overflow-auto p-2 space-y-2">
                    {columnProspects.map((prospect) => (
                      <div
                        key={prospect.id}
                        draggable
                        onDragStart={() => setDraggingId(prospect.id)}
                        onDragEnd={() => setDraggingId(null)}
                        className={`rounded-lg border bg-white/5 p-3 text-xs cursor-move transition-all hover:border-accent hover:bg-accent/10 hover:-translate-y-0.5 ${
                          draggingId === prospect.id ? "opacity-60 ring-2 ring-accent/60" : ""
                        }`}
                        style={{
                          borderColor: `var(${theme === "dark" ? "--jaune" : "--blue"})`,
                        }}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className="font-semibold text-foreground text-sm truncate">
                            {prospect.company_name}
                          </h3>
                          <span className="text-[10px] text-foreground/50">
                            {new Date(prospect.created_at).toLocaleDateString(
                              lang === "fr" ? "fr-FR" : "en-US"
                            )}
                          </span>
                        </div>
                        {prospect.contact_name && (
                          <p className="text-foreground/70 truncate">
                            {prospect.contact_name}
                          </p>
                        )}
                        {prospect.city && (
                          <p className="text-foreground/60 truncate">
                            {prospect.city}
                          </p>
                        )}
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-foreground/70">
                            {getSourceLabel(prospect.source)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Link
                              href={`/backoffice/prospects/${prospect.id}`}
                              className="rounded p-1 text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-3 h-3"
                              >
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDelete(prospect.id)}
                              className="rounded p-1 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="w-3 h-3"
                              >
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        {ratings[prospect.id] != null && (
                          <div className="mt-1 flex items-center gap-0.5 text-[10px]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={
                                  (ratings[prospect.id] || 0) >= star
                                    ? theme === "dark"
                                      ? "text-yellow-300"
                                      : "text-blue-400"
                                    : "text-foreground/30"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}

                    {columnProspects.length === 0 && (
                      <div className="rounded-lg border border-dashed border-white/10 bg-black/5 p-3 text-[11px] text-foreground/50 text-center">
                        {lang === "fr"
                          ? "Déposez un prospect ici pour le mettre à cette étape."
                          : "Drop a prospect here to move it to this stage."}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
