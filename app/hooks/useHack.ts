"use client";

import { useState, useEffect, useCallback } from "react";
import { hackService } from "../services/backoffice/hackService";
import type {
  HackClient,
  HackClientDetail,
  HackSubmission,
  CreateHackClientPayload,
} from "../types/backoffice/hack";

// ── Hook : liste des clients ──────────────────────────────────────────────────
export function useHackClients() {
  const [items, setItems] = useState<HackClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await hackService.listClients();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(
    async (payload: CreateHackClientPayload) => {
      setLoading(true);
      setError(null);
      try {
        await hackService.createClient(payload);
        await refresh();
        return true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Échec de la création";
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await hackService.deleteClient(id);
        await refresh();
        return true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Échec de la suppression";
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  const getDetail = useCallback(async (id: number): Promise<HackClientDetail | null> => {
    try {
      const { data } = await hackService.getClient(id);
      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement des détails");
      return null;
    }
  }, []);

  return { items, loading, error, setError, refresh, create, remove, getDetail };
}

// ── Hook : toutes les soumissions (avec filtres optionnels) ───────────────────
export function useHackSubmissions(clientId?: number, type?: "facebook" | "google") {
  const [items, setItems] = useState<HackSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params: { client?: number; type?: "facebook" | "google" } = {};
      if (clientId !== undefined) params.client = clientId;
      if (type !== undefined) params.type = type;
      const { data } = await hackService.listSubmissions(params);
      setItems(Array.isArray(data) ? data : []);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, [clientId, type]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);
      try {
        await hackService.deleteSubmission(id);
        await refresh();
        return true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "Échec de la suppression";
        setError(msg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [refresh]
  );

  return { items, loading, error, setError, refresh, remove };
}
