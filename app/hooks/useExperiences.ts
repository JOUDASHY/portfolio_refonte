"use client";

import { useEffect, useState } from "react";
import type { Experience as ExperienceModel } from "../types/models";
import { experienceService } from "../services/backoffice/experienceService";

export type UiExperience = {
  period: string;
  title: string;
  company: string;
  summary?: string | null;
};

export function useExperiences() {
  const [items, setItems] = useState<UiExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data } = await experienceService.list();
        if (!mounted) return;
        const list: ExperienceModel[] = Array.isArray(data) ? (data as ExperienceModel[]) : [];
        const mapped: UiExperience[] = list.map((e) => ({
          period: `${e.date_debut} – ${e.date_fin}`,
          title: e.role,
          company: e.entreprise,
          summary: e.description ?? null,
        }));
        setItems(mapped);
      } catch (err: unknown) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load experiences");
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


