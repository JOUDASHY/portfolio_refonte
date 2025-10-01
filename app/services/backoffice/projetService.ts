"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Projet } from "../../types/backoffice/projet";

export const projetService = {
  list: () => apiNoAuth.get<Projet[]>("projets/"),
  create: (payload: Partial<Projet>) => apiAuth.post<Projet>("projets/", payload),
  update: (id: number | string, payload: Partial<Projet>) => apiAuth.put<Projet>(`projets/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`projets/${id}/`),
};


