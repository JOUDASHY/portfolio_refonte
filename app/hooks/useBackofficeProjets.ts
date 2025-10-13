"use client";

import { useCallback, useEffect, useState } from "react";
import { projetService } from "../services/backoffice/projetService";
import type { Projet as ProjetModel } from "../types/models";

export type BackofficeProjet = {
  id: string;
  name: string; // nom
  description: string;
  techno: string;
  github?: string;
  link?: string;
  updatedAt: string;
  relatedImages?: { id: number; projet: number; image: string }[];
  averageScore?: number | null;
};

function toUi(model: ProjetModel): BackofficeProjet {
  return {
    id: String(model.id),
    name: model.nom,
    description: model.description,
    techno: model.techno,
    github: model.githublink || undefined,
    link: model.projetlink || undefined,
    updatedAt: new Date().toISOString().slice(0, 10),
    relatedImages: Array.isArray(model.related_images) ? model.related_images : [],
    averageScore: model.average_score ?? null,
  };
}

export function useBackofficeProjets() {
  const [items, setItems] = useState<BackofficeProjet[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projetService.list();
      const list = (Array.isArray(data) ? (data as ProjetModel[]) : []).map(toUi);
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

  const create = useCallback(async (form: Omit<BackofficeProjet, "id" | "updatedAt">) => {
    const payload: Partial<ProjetModel> = {
      nom: form.name,
      description: form.description,
      techno: form.techno,
      githublink: form.github || undefined,
      projetlink: form.link || undefined,
    };
    await projetService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeProjet, "id" | "updatedAt">) => {
    const payload: Partial<ProjetModel> = {
      nom: form.name,
      description: form.description,
      techno: form.techno,
      githublink: form.github || undefined,
      projetlink: form.link || undefined,
    };
    await projetService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await projetService.remove(id);
    setItems((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


