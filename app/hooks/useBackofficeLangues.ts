"use client";

import { useCallback, useEffect, useState } from "react";
import { langueService } from "../services/backoffice/langueService";
import type { Langue as LangueModel } from "../types/models";

export type BackofficeLangue = {
  id: string;
  titre: string;
  niveau: string;
  updatedAt: string;
};

function toUi(model: LangueModel): BackofficeLangue {
  return {
    id: String(model.id),
    titre: model.titre,
    niveau: model.niveau,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function useBackofficeLangues() {
  const [items, setItems] = useState<BackofficeLangue[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await langueService.list();
      const list = (Array.isArray(data) ? (data as LangueModel[]) : []).map(toUi);
      setItems(list);
    } catch (e: any) {
      setError(e?.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (form: Omit<BackofficeLangue, "id" | "updatedAt">) => {
    const payload: Partial<LangueModel> = {
      titre: form.titre,
      niveau: form.niveau,
    };
    await langueService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeLangue, "id" | "updatedAt">) => {
    const payload: Partial<LangueModel> = {
      titre: form.titre,
      niveau: form.niveau,
    };
    await langueService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await langueService.remove(id);
    setItems((prev) => prev.filter((l) => l.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


