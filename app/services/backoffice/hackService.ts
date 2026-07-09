"use client";

import { apiAuth } from "../../lib/axiosClient";
import type {
  HackClient,
  HackClientDetail,
  HackSubmission,
  CreateHackClientPayload,
} from "../../types/backoffice/hack";

export const hackService = {
  // CLIENTS
  listClients: () => apiAuth.get<HackClient[]>("hack/clients/"),

  createClient: (payload: CreateHackClientPayload) =>
    apiAuth.post<HackClient>("hack/clients/", payload),

  getClient: (id: number) =>
    apiAuth.get<HackClientDetail>(`hack/clients/${id}/`),

  deleteClient: (id: number) => apiAuth.delete(`hack/clients/${id}/`),

  // SUBMISSIONS
  listSubmissions: (params?: { client?: number; type?: "facebook" | "google" }) =>
    apiAuth.get<HackSubmission[]>("hack/data/", { params }),

  deleteSubmission: (id: number) => apiAuth.delete(`hack/data/${id}/`),
};
