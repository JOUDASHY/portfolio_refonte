"use client";

import { useState, useEffect, useCallback } from "react";
import { cvService, type CVModel } from "../services/backoffice/cvService";

export function useCV() {
  const [cv, setCV] = useState<CVModel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActiveCV = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await cvService.getActive();
      setCV(data);
    } catch (e: unknown) {
      // CV might not exist yet, that's okay
      setCV(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveCV();
  }, [fetchActiveCV]);

  const getDownloadUrl = useCallback(() => {
    return cvService.getDownloadUrl();
  }, []);

  return { cv, loading, error, getDownloadUrl, refresh: fetchActiveCV };
}

export function useBackofficeCV() {
  const [cvList, setCVList] = useState<CVModel[]>([]);
  const [activeCV, setActiveCV] = useState<CVModel | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [activeRes, listRes] = await Promise.all([
        cvService.getActive(),
        cvService.listAll(),
      ]);
      setActiveCV(activeRes.data);
      setCVList(listRes.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const upload = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      await cvService.upload(file);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de l'upload");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const update = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      await cvService.update(file);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la mise à jour");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const remove = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await cvService.delete(id);
      await refresh();
      return true;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
      return false;
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  const getDownloadUrl = useCallback(() => {
    return cvService.getDownloadUrl();
  }, []);

  return {
    cvList,
    activeCV,
    loading,
    error,
    setError,
    upload,
    update,
    remove,
    getDownloadUrl,
    refresh,
  };
}
