export type RatingSummary = {
  project_id: number;
  average_score: number;
  ratings_count: number;
  ratings_details: { score: number; ip_address: string }[];
};

export type RatingCreateRequest = { project_id: number; score: number };


