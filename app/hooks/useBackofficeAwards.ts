"use client";

import { useCallback, useEffect, useState } from "react";
import { awardService } from "../services/backoffice/awardService";
import type { Award as AwardModel } from "../types/models";

export type BackofficeAward = {
  id: string;
  education_id: string | null; // ID de l'éducation parente (null pour certifications indépendantes)
  education_name: string | null; // Nom affiché de l'éducation
  year: string; // annee
  title: string; // titre
  organization: string | null; // institution (nullable)
  kind: 'diplome' | 'certification' | 'attestation' | 'brevet' | 'autre'; // type
  description?: string; // optional extra description (not in API schema)
  updatedAt: string;
};

function toUi(model: AwardModel): BackofficeAward {
  return {
    id: String(model.id),
    education_id: model.education != null ? String(model.education) : null,
    education_name: model.education_name || null,
    year: String(model.annee ?? ""),
    title: model.titre,
    organization: model.institution || null,
    kind: model.type,
    description: undefined,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function useBackofficeAwards() {
  const [items, setItems] = useState<BackofficeAward[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await awardService.list();
      const list = (Array.isArray(data) ? (data as AwardModel[]) : []).map(toUi);
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

  const create = useCallback(async (form: Omit<BackofficeAward, "id" | "updatedAt" | "education_name">) => {
    const payload: Partial<AwardModel> = {
      education: form.education_id ? Number(form.education_id) : null,
      titre: form.title,
      institution: form.organization || null,
      type: form.kind,
      annee: Number(form.year) || new Date().getFullYear(),
    };
    await awardService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeAward, "id" | "updatedAt" | "education_name">) => {
    const payload: Partial<AwardModel> = {
      education: form.education_id ? Number(form.education_id) : null,
      titre: form.title,
      institution: form.organization || null,
      type: form.kind,
      annee: Number(form.year) || new Date().getFullYear(),
    };
    await awardService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await awardService.remove(id);
    setItems((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


