"use client";

import { useCallback, useEffect, useState } from "react";
import { myloginService } from "../services/backoffice/myloginService";
import type { MyLogin as MyLoginModel } from "../types/models";

export type BackofficeMyLogin = {
  id: string;
  site: string;
  link: string;
  username: string;
  password: string;
  updatedAt: string;
};

function toUi(model: MyLoginModel): BackofficeMyLogin {
  return {
    id: String(model.id),
    site: model.site,
    link: model.link,
    username: model.username,
    password: model.password,
    updatedAt: new Date().toISOString().slice(0, 10),
  };
}

export function useBackofficeMyLogins() {
  const [items, setItems] = useState<BackofficeMyLogin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await myloginService.list();
      const list = (Array.isArray(data) ? (data as MyLoginModel[]) : []).map(toUi);
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

  const create = useCallback(async (form: Omit<BackofficeMyLogin, "id" | "updatedAt">) => {
    const payload: Omit<MyLoginModel, "id"> = {
      site: form.site,
      link: form.link,
      username: form.username,
      password: form.password,
    };
    await myloginService.create(payload);
    await refresh();
  }, [refresh]);

  const update = useCallback(async (id: string, form: Omit<BackofficeMyLogin, "id" | "updatedAt">) => {
    const payload: Partial<MyLoginModel> = {
      site: form.site,
      link: form.link,
      username: form.username,
      password: form.password,
    };
    await myloginService.update(id, payload);
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await myloginService.remove(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { items, loading, error, setError, refresh, create, update, remove } as const;
}


