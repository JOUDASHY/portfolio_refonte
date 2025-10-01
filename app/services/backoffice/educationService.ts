"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Education } from "../../types/backoffice/education";

export const educationService = {
  list: () => apiNoAuth.get<Education[]>("education/"),
  create: (payload: Partial<Education>) => apiAuth.post<Education>("education/", payload),
  update: (id: number | string, payload: Partial<Education>) => apiAuth.put<Education>(`education/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`education/${id}/`),
};


