"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Experience } from "../../types/backoffice/experience";

export const experienceService = {
  list: () => apiNoAuth.get<Experience[]>("experience/"),
  create: (payload: Partial<Experience>) => apiAuth.post<Experience>("experience/", payload),
  update: (id: number | string, payload: Partial<Experience>) => apiAuth.put<Experience>(`experience/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`experience/${id}/`),
};


