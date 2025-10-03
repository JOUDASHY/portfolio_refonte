"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Competence } from "../../types/backoffice/competence";

export const competenceService = {
  list: () => apiNoAuth.get<Competence[]>("competences/"),
  create: (payload: Partial<Competence>) => apiAuth.post<Competence>("competences/", payload),
  update: (id: number | string, payload: Partial<Competence>) => apiAuth.put<Competence>(`competences/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`competences/${id}/`),

  // Multipart helpers (for image upload)
  createForm: (payload: { image?: File | null; name: string; description: string; niveau: number; categorie?: string | null; }) => {
    const fd = new FormData();
    if (payload.image) fd.append("image", payload.image);
    fd.append("name", payload.name);
    fd.append("description", payload.description);
    fd.append("niveau", String(payload.niveau));
    if (payload.categorie) fd.append("categorie", payload.categorie);
    return apiAuth.post<Competence>("competences/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  },
  updateForm: (id: number | string, payload: { image?: File | null; name: string; description: string; niveau: number; categorie?: string | null; }) => {
    const fd = new FormData();
    // If image is null or undefined, don't include field to keep existing backend default behavior
    if (payload.image) fd.append("image", payload.image);
    fd.append("name", payload.name);
    fd.append("description", payload.description);
    fd.append("niveau", String(payload.niveau));
    if (payload.categorie) fd.append("categorie", payload.categorie);
    return apiAuth.put<Competence>(`competences/${id}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  },
};


