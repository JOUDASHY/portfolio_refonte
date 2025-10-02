"use client";

import { useCallback, useEffect, useState } from "react";
import { experienceService } from "../services/backoffice/experienceService";
import type { Experience as ExperienceModel } from "../types/models";

export type BackofficeExperience = {
  id: string;
  period: string;
  title: string;
  company: string;
  summary?: string;
  stack?: string[];
  updatedAt: string;
};

function toUi(model: ExperienceModel): BackofficeExperience {
  return {
    id: String(model.id),
    period: `${model.date_debut} – ${model.date_fin}`,
    title: model.role,
    company: model.entreprise,
    summary: model.description || "",
    stack: [],
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function parsePeriod(period: string): { date_debut: string; date_fin: string } {
  const norm = period.replace(/\s+–\s+|\s*-\s*/g, "-");
  const [start, end] = norm.split("-");
  const toDate = (v?: string) => (v && v.trim().length >= 4 ? v.trim() : new Date().getFullYear().toString());
  return { date_debut: toDate(start), date_fin: toDate(end) };
}

export function useBackofficeExperiences() {
  const [items, setItems] = useState<BackofficeExperience[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await experienceService.list();
      const list = (Array.isArray(data) ? (data as ExperienceModel[]) : []).map(toUi);
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (form: Omit<BackofficeExperience, "id" | "updatedAt">) => {
    const { date_debut, date_fin } = parsePeriod(form.period);
    const payload: Partial<ExperienceModel> = {
      date_debut,
      date_fin,
      entreprise: form.company,
      role: form.title,
      description: form.summary || undefined,
      type: "professionnel",
    };
    await experienceService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeExperience, "id" | "updatedAt">) => {
    const { date_debut, date_fin } = parsePeriod(form.period);
    const payload: Partial<ExperienceModel> = {
      date_debut,
      date_fin,
      entreprise: form.company,
      role: form.title,
      description: form.summary || undefined,
      type: "professionnel",
    };
    await experienceService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await experienceService.remove(id);
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


