"use client";

import { useState, useEffect, useCallback } from "react";
import { prospectService } from "../services/backoffice/prospectService";
import type {
  Prospect,
  ProspectDetail,
  ProspectStats,
  MessageTemplate,
  CreateProspectPayload,
  UpdateProspectPayload,
} from "../types/backoffice/prospect";

export function useProspects() {
  const [items, setItems] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await prospectService.list();
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

  const create = useCallback(async (form: CreateProspectPayload) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.create(form);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la création");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (id: number, form: UpdateProspectPayload) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.update(id, form);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la modification");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.remove(id);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const updateStatus = useCallback(async (id: number, status: string) => {
    try {
      await prospectService.updateStatus(id, status);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la mise à jour du statut");
      return false;
    }
  }, [refresh]);

  const getDetail = useCallback(async (id: number): Promise<ProspectDetail | null> => {
    try {
      const { data } = await prospectService.getDetail(id);
      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement des détails");
      return null;
    }
  }, []);

  const getStats = useCallback(async (): Promise<ProspectStats | null> => {
    try {
      const { data } = await prospectService.stats();
      return data;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement des statistiques");
      return null;
    }
  }, []);

  return {
    items,
    loading,
    error,
    setError,
    refresh,
    create,
    update,
    remove,
    updateStatus,
    getDetail,
    getStats,
  };
}

export function useMessageTemplates() {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await prospectService.listTemplates();
      setTemplates(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const create = useCallback(async (payload: CreateProspectPayload) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.createTemplate(payload as any);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la création");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (id: number, payload: any) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.updateTemplate(id, payload);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la modification");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await prospectService.deleteTemplate(id);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  return { templates, loading, error, setError, refresh, create, update, remove };
}
