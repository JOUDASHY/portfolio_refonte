"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { MonthlyVisit } from "../../types/backoffice/visit";

export const visitService = {
  record: () => apiNoAuth.post<{ message: string }>("record-visit/"),
  total: () => apiAuth.get<{ total_visits: number }>("total-visits/"),
  monthlyStats: () => apiAuth.get<MonthlyVisit[]>("monthly-visit-stats/"),
};


