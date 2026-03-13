"use client";

import { useCallback, useEffect, useState } from "react";
import { experienceService } from "../services/backoffice/experienceService";
import { NotificationService } from "../services/notificationService";
import type { Experience as ExperienceModel } from "../types/models";

export type BackofficeExperience = {
  id: string;
  date_debut: string;
  date_fin: string;
  title: string;
  company: string;
  type: "stage" | "professionnel";
  summary?: string;
  stack?: string[];
  updatedAt: string;
};

function toUi(model: ExperienceModel): BackofficeExperience {
  return {
    id: String(model.id),
    date_debut: model.date_debut,
    date_fin: model.date_fin,
    title: model.role,
    company: model.entreprise,
    type: model.type as "stage" | "professionnel",
    summary: model.description || "",
    stack: [],
    updatedAt: new Date().toISOString().slice(0, 10),
  };
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
    const payload: Partial<ExperienceModel> = {
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      entreprise: form.company,
      role: form.title,
      description: form.summary || undefined,
      type: form.type || "professionnel",
    };
    await experienceService.create(payload);
    await NotificationService.showSuccessToast("Expérience ajoutée avec succès");
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeExperience, "id" | "updatedAt">) => {
    const payload: Partial<ExperienceModel> = {
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      entreprise: form.company,
      role: form.title,
      description: form.summary || undefined,
      type: form.type || "professionnel",
    };
    await experienceService.update(id, payload);
    await NotificationService.showSuccessToast("Expérience modifiée avec succès");
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await experienceService.remove(id);
    await NotificationService.showSuccessToast("Expérience supprimée avec succès");
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


