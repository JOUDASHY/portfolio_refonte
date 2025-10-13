"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { RatingSummary, RatingCreateRequest, RatingCreateResponse } from "../../types/backoffice/rating";

export const ratingService = {
  create: (payload: RatingCreateRequest) => apiNoAuth.post<RatingCreateResponse>("rating/", payload),
  summary: (projectId: number | string) => apiNoAuth.get<RatingSummary>(`rating/${projectId}/`),
};


