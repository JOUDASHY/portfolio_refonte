"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Competence } from "../../types/backoffice/competence";

export const competenceService = {
  list: () => apiNoAuth.get<Competence[]>("competences/"),
  create: (payload: Partial<Competence>) => apiAuth.post<Competence>("competences/", payload),
  update: (id: number | string, payload: Partial<Competence>) => apiAuth.put<Competence>(`competences/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`competences/${id}/`),
};


