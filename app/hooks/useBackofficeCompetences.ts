"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { competenceService } from "../services/backoffice/competenceService";
import type { Competence } from "../types/backoffice/competence";

export type BackofficeCompetence = Omit<Competence, "image"> & { image: string | null };
export type CompetenceForm = {
  imageFile?: File | null;
  name: string;
  description: string;
  niveau: number; // 0-10
  categorie?: string | null;
};

export function useBackofficeCompetences() {
  const [items, setItems] = useState<BackofficeCompetence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await competenceService.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const create = useCallback(async (form: CompetenceForm) => {
    const { imageFile, name, description, niveau, categorie } = form;
    const { data } = await competenceService.createForm({ image: imageFile || undefined, name, description, niveau, categorie });
    setItems((prev) => [data, ...prev]);
    return data;
  }, []);

  const update = useCallback(async (id: number | string, form: CompetenceForm) => {
    const { imageFile, name, description, niveau, categorie } = form;
    const { data } = await competenceService.updateForm(id, { image: imageFile || undefined, name, description, niveau, categorie });
    setItems((prev) => prev.map((c) => (String(c.id) === String(id) ? data : c)));
    return data;
  }, []);

  const remove = useCallback(async (id: number | string) => {
    await competenceService.remove(id);
    setItems((prev) => prev.filter((c) => String(c.id) !== String(id)));
  }, []);

  const grouped = useMemo(() => {
    const map = new Map<string, BackofficeCompetence[]>();
    for (const c of items) {
      const key = c.categorie || "Autre";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(c);
    }
    return map;
  }, [items]);

  return { items, loading, error, grouped, refresh, create, update, remove, setError };
}
