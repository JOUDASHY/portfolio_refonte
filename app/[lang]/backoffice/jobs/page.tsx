"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useJobs } from "../../../hooks/useJobs";
import {
  JOB_SOURCE_LABELS,
  JOB_STATUS_LABELS,
  FREE_SOURCES,
  type JobCategory,
  type JobOffer,
  type JobSource,
  type JobStatus,
} from "../../../types/backoffice/job";

const STATUS_FILTERS: { value: JobStatus | "all"; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "new", label: "Nouvelles" },
  { value: "saved", label: "Sauvegardées" },
  { value: "applied", label: "Candidatées" },
  { value: "ignored", label: "Ignorées" },
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

export default function JobsPage() {
  const { items, loading, fetching, error, refresh, updateStatus, remove, toProspect, runFetch } =
    useJobs();

  // Filtres d'affichage (côté client, sur la liste déjà chargée)
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<JobSource | "all">("all");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [search, setSearch] = useState("");

  // Paramètres de collecte
  const [keywords, setKeywords] = useState("développeur web django react");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState<JobCategory>("it");
  const [fetchRemote, setFetchRemote] = useState(false);

  const visible = useMemo(() => {
    return items.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      if (sourceFilter !== "all" && o.source !== sourceFilter) return false;
      if (remoteOnly && !o.is_remote) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = `${o.title} ${o.company} ${o.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [items, statusFilter, sourceFilter, remoteOnly, search]);

  const handleFetch = async () => {
    const recap = await runFetch({
      keywords: keywords.trim(),
      location: location.trim(),
      category,
      remote: fetchRemote,
    });
    if (recap) {
      toast.success(
        `Collecte terminée : ${recap.created} nouvelles, ${recap.updated} mises à jour (${recap.received} reçues).`
      );
    } else {
      toast.error("La collecte a échoué.");
    }
  };

  const handleToProspect = async (offer: JobOffer) => {
    if (offer.prospect) {
      toast.info("Cette offre est déjà convertie en prospect.");
      return;
    }
    const id = await toProspect(offer.id);
    if (id) toast.success("Prospect créé à partir de l'offre.");
    else toast.error("Échec de la conversion.");
  };

  const handleDelete = async (offer: JobOffer) => {
    const res = await Swal.fire({
      title: "Supprimer cette offre ?",
      text: offer.title,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Supprimer",
      cancelButtonText: "Annuler",
      confirmButtonColor: "#dc2626",
    });
    if (res.isConfirmed) {
      const ok = await remove(offer.id);
      if (ok) toast.success("Offre supprimée.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Veille d&apos;offres</h1>
          <p className="text-sm text-foreground/60">
            Offres informatiques collectées automatiquement depuis plusieurs sources.
          </p>
        </div>
        <button
          onClick={() => refresh()}
          className="rounded-lg border border-input px-4 py-2 text-sm font-medium text-foreground hover:bg-foreground/5"
        >
          Rafraîchir
        </button>
      </div>

      {/* Panneau de collecte */}
      <div className="rounded-xl card-border p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-foreground">Lancer une collecte</div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Mots-clés (ex. django react)"
            className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm md:col-span-2"
          />
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Lieu (ex. Paris)"
            className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as JobCategory)}
            className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm"
          >
            <option value="it">Informatique</option>
            <option value="all">Tous secteurs</option>
          </select>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-foreground/80">
            <input
              type="checkbox"
              checked={fetchRemote}
              onChange={(e) => setFetchRemote(e.target.checked)}
            />
            Remote uniquement
          </label>
          <button
            onClick={handleFetch}
            disabled={fetching}
            className="rounded-lg px-4 py-2 text-sm font-medium text-black shadow disabled:opacity-60"
            style={{ backgroundColor: "#f68c09" }}
          >
            {fetching ? "Collecte en cours…" : "Collecter maintenant"}
          </button>
          <span className="text-xs text-foreground/50">
            Sources sans clé : {FREE_SOURCES.map((s) => JOB_SOURCE_LABELS[s]).join(", ")}.
          </span>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as JobStatus | "all")}
          className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm"
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as JobSource | "all")}
          className="rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm"
        >
          <option value="all">Toutes sources</option>
          {(Object.keys(JOB_SOURCE_LABELS) as JobSource[]).map((s) => (
            <option key={s} value={s}>
              {JOB_SOURCE_LABELS[s]}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 text-sm text-foreground/80">
          <input
            type="checkbox"
            checked={remoteOnly}
            onChange={(e) => setRemoteOnly(e.target.checked)}
          />
          Remote
        </label>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="flex-1 min-w-[160px] rounded-lg border border-input bg-background text-foreground px-3 py-2 text-sm"
        />
        <span className="text-sm text-foreground/50">{visible.length} offre(s)</span>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="py-12 text-center text-foreground/50">Chargement…</div>
      ) : visible.length === 0 ? (
        <div className="rounded-xl border border-dashed border-foreground/20 py-12 text-center text-foreground/50">
          Aucune offre. Lance une collecte ci-dessus pour remplir la liste.
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map((offer) => (
            <div
              key={offer.id}
              className="rounded-xl card-border p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-foreground hover:underline"
                    >
                      {offer.title}
                    </a>
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
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {offer.prospect ? (
                    <span className="rounded-lg bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                      Prospect créé
                    </span>
                  ) : (
                    <button
                      onClick={() => handleToProspect(offer)}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-black shadow"
                      style={{ backgroundColor: "#f68c09" }}
                    >
                      → Prospect
                    </button>
                  )}
                  <select
                    value={offer.status}
                    onChange={(e) => updateStatus(offer.id, e.target.value as JobStatus)}
                    className="rounded-lg border border-input bg-background text-foreground px-2 py-1.5 text-xs"
                  >
                    {(Object.keys(JOB_STATUS_LABELS) as JobStatus[]).map((s) => (
                      <option key={s} value={s}>
                        {JOB_STATUS_LABELS[s].fr}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleDelete(offer)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
