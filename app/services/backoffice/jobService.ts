"use client";

import { apiAuth } from "../../lib/axiosClient";
import type {
  JobOffer,
  JobSearchQuery,
  CreateJobQueryPayload,
  RunFetchPayload,
  FetchRecap,
  JobListParams,
  JobStatus,
} from "../../types/backoffice/job";

export const jobService = {
  // Offres
  list: (params?: JobListParams) =>
    apiAuth.get<JobOffer[]>("jobs/offers/", { params }),

  updateStatus: (id: number, status: JobStatus) =>
    apiAuth.patch<JobOffer>(`jobs/offers/${id}/`, { status }),

  remove: (id: number) =>
    apiAuth.delete(`jobs/offers/${id}/`),

  toProspect: (id: number) =>
    apiAuth.post<{ detail: string; prospect_id: number }>(
      `jobs/offers/${id}/to-prospect/`,
      {}
    ),

  // Collecte à la demande
  fetch: (payload: RunFetchPayload) =>
    apiAuth.post<FetchRecap>("jobs/fetch/", payload),

  // Recherches sauvegardées
  listQueries: () =>
    apiAuth.get<JobSearchQuery[]>("jobs/queries/"),

  createQuery: (payload: CreateJobQueryPayload) =>
    apiAuth.post<JobSearchQuery>("jobs/queries/", payload),

  updateQuery: (id: number, payload: Partial<CreateJobQueryPayload>) =>
    apiAuth.patch<JobSearchQuery>(`jobs/queries/${id}/`, payload),

  deleteQuery: (id: number) =>
    apiAuth.delete(`jobs/queries/${id}/`),
};
