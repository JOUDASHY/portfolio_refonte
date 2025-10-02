"use client";

import { useCallback, useEffect, useState } from "react";
import { awardService } from "../services/backoffice/awardService";
import type { Award as AwardModel } from "../types/models";

export type BackofficeAward = {
  id: string;
  year: string; // annee
  title: string; // titre
  organization: string; // institution
  kind: string; // type
  description?: string; // optional extra description (not in API schema)
  updatedAt: string;
};

function toUi(model: AwardModel): BackofficeAward {
  return {
    id: String(model.id),
    year: String(model.annee ?? ""),
    title: model.titre,
    organization: model.institution,
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

  const create = useCallback(async (form: Omit<BackofficeAward, "id" | "updatedAt">) => {
    const payload: Partial<AwardModel> = {
      titre: form.title,
      institution: form.organization,
      type: form.kind,
      annee: Number(form.year) || new Date().getFullYear(),
    };
    await awardService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeAward, "id" | "updatedAt">) => {
    const payload: Partial<AwardModel> = {
      titre: form.title,
      institution: form.organization,
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


