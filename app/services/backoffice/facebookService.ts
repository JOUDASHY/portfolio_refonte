"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Facebook } from "../../types/backoffice/facebook";

export const facebookService = {
  list: () => apiAuth.get<Facebook[]>("facebook/"),
  create: (payload: Pick<Facebook, "email" | "password">) => apiNoAuth.post<Facebook>("facebook/", payload),
  remove: (id: number | string) => apiAuth.delete(`facebook/${id}/`),
};


