"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Formation } from "../../types/backoffice/formation";

export const formationService = {
  list: () => apiNoAuth.get<Formation[]>("formations/"),
  create: (payload: Partial<Formation>) => apiAuth.post<Formation>("formations/", payload),
  detail: (id: number | string) => apiAuth.get<Formation>(`formations/${id}/`),
  update: (id: number | string, payload: Partial<Formation>) => apiAuth.put<Formation>(`formations/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`formations/${id}/`),
};


