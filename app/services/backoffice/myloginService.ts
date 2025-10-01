"use client";

import { apiAuth } from "../../lib/axiosClient";
import type { MyLogin } from "../../types/backoffice/mylogin";

export const myloginService = {
  list: () => apiAuth.get<MyLogin[]>("all_my_logins/"),
  create: (payload: Omit<MyLogin, "id">) => apiAuth.post<MyLogin>("all_my_logins/", payload),
  detail: (id: number | string) => apiAuth.get<MyLogin>(`all_my_logins/${id}/`),
  update: (id: number | string, payload: Partial<MyLogin>) => apiAuth.put<MyLogin>(`all_my_logins/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`all_my_logins/${id}/`),
};


