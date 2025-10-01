"use client";

import { apiAuth } from "../../lib/axiosClient";
import type { ImageProjet } from "../../types/backoffice/imageProjet";

export const imageProjetService = {
  list: () => apiAuth.get<ImageProjet[]>("images/"),
  create: (payload: FormData) => apiAuth.post<ImageProjet>("images/", payload),
  detail: (id: number | string) => apiAuth.get<ImageProjet>(`images/${id}/`),
  update: (id: number | string, payload: FormData) => apiAuth.put<ImageProjet>(`images/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`images/${id}/`),
};


