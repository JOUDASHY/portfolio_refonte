"use client";

import { useEffect, useMemo, useState } from "react";
import type { Competence } from "../types/models";
import { competenceService } from "../services/backoffice/competenceService";

export type UiSkill = { name: string; level: number; category: string };

export function useSkills() {
  const [items, setItems] = useState<UiSkill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await competenceService.list();
        if (!mounted) return;
        const list: Competence[] = Array.isArray(data) ? (data as Competence[]) : [];
        const mapped: UiSkill[] = list.map((c) => ({
          name: c.name,
          level: c.niveau,
          category: c.categorie || "Autres",
        }));
        setItems(mapped);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || "Failed to load skills");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const grouped = useMemo(() => {
    const g = new Map<string, UiSkill[]>();
    items.forEach((s) => {
      const key = s.category || "Autres";
      if (!g.has(key)) g.set(key, []);
      g.get(key)!.push(s);
    });
    return g;
  }, [items]);

  return { items, grouped, loading, error } as const;
}


