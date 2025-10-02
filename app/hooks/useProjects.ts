"use client";

import { useEffect, useState } from "react";
import type { Projet } from "../types/models";
import { projetService } from "../services/backoffice/projetService";

export type UiProject = {
  id: number;
  title: string;
  image: string;
  href?: string;
  initialStars: number;
};

export function useProjects() {
  const [items, setItems] = useState<UiProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await projetService.list();
        if (!mounted) return;
        const list: Projet[] = Array.isArray(data) ? (data as Projet[]) : [];
        const mapped: UiProject[] = list.map((p) => ({
          id: p.id,
          title: p.nom,
          image: p.related_images?.[0]?.image || "/window.svg",
          href: p.projetlink || p.githublink || undefined,
          initialStars: Math.max(0, Math.round((p.average_score ?? 0)))
        }));
        setItems(mapped);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { items, loading, error } as const;
}


