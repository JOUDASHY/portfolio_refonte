"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { RatingSummary, RatingCreateRequest } from "../../types/backoffice/rating";

export const ratingService = {
  create: (payload: RatingCreateRequest) => apiNoAuth.post("rating/", payload),
  summary: (projectId: number | string) => apiAuth.get<RatingSummary>(`rating/${projectId}/`),
};


