"use client";

import { useEffect, useState } from "react";
import { notificationService } from "../../../services/backoffice/notificationService";
import type { Notification } from "../../../types/backoffice/notification";

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<boolean>(false);
  const [triggerType, setTriggerType] = useState<"rating" | "view">("rating");
  const [projectId, setProjectId] = useState<string>("");

  async function refresh() {
    try {
      setLoading(true);
      const { data } = await notificationService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec du chargement des notifications");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleMarkRead(id: number) {
    try {
      setBusy(true);
      await notificationService.markRead(id);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
    } catch {
      // noop
    } finally {
      setBusy(false);
    }
  }

  async function handleMarkAll() {
    try {
      setBusy(true);
      await notificationService.markAllRead();
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // noop
    } finally {
      setBusy(false);
    }
  }

  async function handleClearAll() {
    try {
      setBusy(true);
      await notificationService.clearAll();
      setItems([]);
    } catch {
      // noop
    } finally {
      setBusy(false);
    }
  }

  async function handleTrigger(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(true);
      const payload: { event_type: "rating" | "view"; project_id?: number } = { event_type: triggerType };
      if (projectId.trim()) payload.project_id = Number(projectId);
      await notificationService.trigger(payload);
      await refresh();
    } catch {
      // noop
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-foreground">Notifications</h1>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-lg bg-accent/15 px-3 py-1.5 text-sm text-accent ring-1 ring-accent/20 disabled:opacity-50"
            onClick={handleMarkAll}
            disabled={busy || loading || items.length === 0}
          >
            Marquer tout lu
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-500/10 px-3 py-1.5 text-sm text-red-300 ring-1 ring-red-500/20 disabled:opacity-50"
            onClick={handleClearAll}
            disabled={busy || loading || items.length === 0}
          >
            Tout effacer
          </button>
        </div>
      </div>

      <form onSubmit={handleTrigger} className="mb-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-xs text-foreground/60">Type d&apos;événement</label>
          <select
            value={triggerType}
            onChange={(e) => setTriggerType(e.target.value as "rating" | "view")}
            className="w-full rounded-lg bg-white/5 px-2 py-1.5 text-sm text-foreground ring-1 ring-white/10"
          >
            <option value="rating">rating</option>
            <option value="view">view</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-foreground/60">Project ID (optionnel)</label>
          <input
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            placeholder="ex: 12"
            className="w-full rounded-lg bg-white/5 px-2 py-1.5 text-sm text-foreground ring-1 ring-white/10"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-white/10 px-3 py-2 text-sm text-foreground ring-1 ring-white/20 disabled:opacity-50"
            disabled={busy}
          >
            Déclencher
          </button>
        </div>
      </form>

      <div className="rounded-xl bg-white/0 ring-1 ring-white/10">
        {loading ? (
          <div className="p-6 text-sm text-foreground/60">Chargement…</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-foreground/60">Aucune notification</div>
        ) : (
          <ul className="divide-y divide-white/10">
            {items.map((n) => (
              <li key={n.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-foreground/90 flex items-center gap-2">
                    {!n.is_read && <span className="inline-block h-2 w-2 rounded-full bg-accent" />}
                    {n.title}
                  </div>
                  <div className="mt-1 text-xs text-foreground/70">{n.message}</div>
                  <div className="mt-1 text-[10px] text-foreground/50">{formatDate(n.created_at)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {!n.is_read && (
                    <button
                      className="rounded-lg bg-accent/15 px-2 py-1 text-xs text-accent ring-1 ring-accent/20 disabled:opacity-50"
                      onClick={() => handleMarkRead(n.id)}
                      disabled={busy}
                    >
                      Marquer lu
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString("fr-FR");
  } catch {
    return iso;
  }
}


