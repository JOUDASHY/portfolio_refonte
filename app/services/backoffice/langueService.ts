"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Langue } from "../../types/backoffice/langue";

export const langueService = {
  list: () => apiNoAuth.get<Langue[]>("langues/"),
  create: (payload: Partial<Langue>) => apiAuth.post<Langue>("langues/", payload),
  detail: (id: number | string) => apiAuth.get<Langue>(`langues/${id}/`),
  update: (id: number | string, payload: Partial<Langue>) => apiAuth.put<Langue>(`langues/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`langues/${id}/`),
};


