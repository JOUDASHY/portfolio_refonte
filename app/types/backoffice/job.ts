export type JobSource =
  | "remotive"
  | "arbeitnow"
  | "remoteok"
  | "themuse"
  | "france_travail"
  | "adzuna"
  | "jooble";

export type JobStatus = "new" | "seen" | "saved" | "applied" | "ignored";

export type JobCategory = "it" | "all";

export interface JobOffer {
  id: number;
  source: JobSource;
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  contract_type: string;
  description: string;
  url: string;
  salary: string;
  tags: string[];
  match_score: number;
  published_at: string | null;
  fetched_at: string;
  status: JobStatus;
  query: number | null;
  prospect: number | null;
}

export interface JobSearchQuery {
  id: number;
  label: string;
  keywords: string;
  location: string;
  category: JobCategory;
  remote_only: boolean;
  sources: string[];
  is_active: boolean;
  last_run_at: string | null;
  created_at: string;
  offers_count: number;
}

export interface CreateJobQueryPayload {
  label: string;
  keywords?: string;
  location?: string;
  category?: JobCategory;
  remote_only?: boolean;
  sources?: string[];
  is_active?: boolean;
}

export interface RunFetchPayload {
  keywords?: string;
  location?: string;
  remote?: boolean;
  category?: JobCategory;
  sources?: string[];
}

export interface FetchRecap {
  received: number;
  created: number;
  updated: number;
  per_source: Record<string, number>;
}

export interface JobListParams {
  status?: JobStatus;
  source?: JobSource;
  remote?: "true" | "1";
  search?: string;
  prospect?: number;
}

export const JOB_SOURCE_LABELS: Record<JobSource, string> = {
  remotive: "Remotive",
  arbeitnow: "Arbeitnow",
  remoteok: "Remote OK",
  themuse: "The Muse",
  france_travail: "France Travail",
  adzuna: "Adzuna",
  jooble: "Jooble",
};

export const JOB_STATUS_LABELS: Record<JobStatus, { fr: string; color: string }> = {
  new: { fr: "Nouvelle", color: "bg-gray-100 text-gray-700" },
  seen: { fr: "Vue", color: "bg-blue-100 text-blue-700" },
  saved: { fr: "Sauvegardée", color: "bg-yellow-100 text-yellow-700" },
  applied: { fr: "Candidaté", color: "bg-green-100 text-green-700" },
  ignored: { fr: "Ignorée", color: "bg-red-100 text-red-700" },
};

/** Sources utilisables immédiatement sans clé API. */
export const FREE_SOURCES: JobSource[] = ["remotive", "arbeitnow", "remoteok", "themuse"];
