"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Award } from "../../types/backoffice/award";

export const awardService = {
  list: () => apiNoAuth.get<Award[]>("awards/"),
  create: (payload: Partial<Award>) => apiAuth.post<Award>("awards/", payload),
  detail: (id: number | string) => apiAuth.get<Award>(`awards/${id}/`),
  update: (id: number | string, payload: Partial<Award>) => apiAuth.put<Award>(`awards/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`awards/${id}/`),
};


