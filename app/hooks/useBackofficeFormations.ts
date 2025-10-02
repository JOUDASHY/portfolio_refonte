"use client";

import { useCallback, useEffect, useState } from "react";
import { formationService } from "../services/backoffice/formationService";
import type { Formation } from "../types/models";

export type BackofficeFormation = {
  id: string;
  period: string; // ex: 2023 – 2024
  title: string; // titre
  provider: string; // formateur
  detail?: string; // description
  updatedAt: string;
};

function toUi(model: Formation): BackofficeFormation {
  return {
    id: String(model.id),
    period: `${model.debut} – ${model.fin}`,
    title: model.titre,
    provider: model.formateur,
    detail: model.description,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

function parsePeriod(period: string): { debut: string; fin: string } {
  const norm = period.replace(/\s+–\s+|\s*-\s*/g, "-");
  const [start, end] = norm.split("-");
  const toDate = (v?: string) => (v && v.trim().length >= 4 ? v.trim() : new Date().getFullYear().toString());
  return { debut: toDate(start), fin: toDate(end) };
}

export function useBackofficeFormations() {
  const [items, setItems] = useState<BackofficeFormation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await formationService.list();
      const list = (Array.isArray(data) ? (data as Formation[]) : []).map(toUi);
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

  const create = useCallback(async (form: Omit<BackofficeFormation, "id" | "updatedAt">) => {
    const { debut, fin } = parsePeriod(form.period);
    const payload: Partial<Formation> = {
      titre: form.title,
      formateur: form.provider,
      description: form.detail || undefined,
      debut,
      fin,
    };
    await formationService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeFormation, "id" | "updatedAt">) => {
    const { debut, fin } = parsePeriod(form.period);
    const payload: Partial<Formation> = {
      titre: form.title,
      formateur: form.provider,
      description: form.detail || undefined,
      debut,
      fin,
    };
    await formationService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await formationService.remove(id);
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


