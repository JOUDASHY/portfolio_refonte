"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { jobService } from "../services/backoffice/jobService";
import type {
  JobOffer,
  JobListParams,
  JobStatus,
  RunFetchPayload,
  FetchRecap,
} from "../types/backoffice/job";

export function useJobs(initialParams: JobListParams = {}) {
  const [items, setItems] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const paramsRef = useRef<JobListParams>(initialParams);
  const itemsRef = useRef<JobOffer[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const refresh = useCallback(async (params?: JobListParams) => {
    if (params) paramsRef.current = params;
    setLoading(true);
    setError(null);
    try {
      const { data } = await jobService.list(paramsRef.current);
      setItems(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Mise à jour optimiste du statut
  const updateStatus = useCallback(async (id: number, status: JobStatus) => {
    const previous = itemsRef.current;
    setItems((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try {
      await jobService.updateStatus(id, status);
      return true;
    } catch (e: unknown) {
      setItems(previous); // rollback
      setError(e instanceof Error ? e.message : "Échec de la mise à jour");
      return false;
    }
  }, []);

  const remove = useCallback(async (id: number) => {
    const previous = itemsRef.current;
    setItems((prev) => prev.filter((o) => o.id !== id));
    try {
      await jobService.remove(id);
      return true;
    } catch (e: unknown) {
      setItems(previous);
      setError(e instanceof Error ? e.message : "Échec de la suppression");
      return false;
    }
  }, []);

  const toProspect = useCallback(async (id: number): Promise<number | null> => {
    try {
      const { data } = await jobService.toProspect(id);
      setItems((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, prospect: data.prospect_id, status: "applied" } : o
        )
      );
      return data.prospect_id;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la conversion");
      return null;
    }
  }, []);

  const runFetch = useCallback(
    async (payload: RunFetchPayload): Promise<FetchRecap | null> => {
      setFetching(true);
      setError(null);
      try {
        const { data } = await jobService.fetch(payload);
        await refresh();
        return data;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Échec de la collecte");
        return null;
      } finally {
        setFetching(false);
      }
    },
    [refresh]
  );

  return {
    items,
    loading,
    fetching,
    error,
    refresh,
    updateStatus,
    remove,
    toProspect,
    runFetch,
  };
}
