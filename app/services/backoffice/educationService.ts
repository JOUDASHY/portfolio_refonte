"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Education } from "../../types/backoffice/education";

export const educationService = {
  list: () => apiNoAuth.get<Education[]>("education/"),
  create: (payload: Partial<Education>) => apiAuth.post<Education>("education/", payload),
  update: (id: number | string, payload: Partial<Education>) => apiAuth.put<Education>(`education/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`education/${id}/`),

  // Multipart helpers for image upload
  createForm: (payload: { image?: File | null; nom_ecole: string; nom_parcours: string; annee_debut: number; annee_fin: number; lieu: string; }) => {
    const fd = new FormData();
    if (payload.image instanceof File) fd.append("image", payload.image);
    fd.append("nom_ecole", payload.nom_ecole);
    fd.append("nom_parcours", payload.nom_parcours);
    fd.append("annee_debut", String(payload.annee_debut));
    fd.append("annee_fin", String(payload.annee_fin));
    fd.append("lieu", payload.lieu);
    return apiAuth.post<Education>("education/", fd, { headers: { "Content-Type": "multipart/form-data" } });
  },
  updateForm: (id: number | string, payload: { image?: File | null; nom_ecole: string; nom_parcours: string; annee_debut: number; annee_fin: number; lieu: string; }) => {
    const fd = new FormData();
    // Only send image if provided to preserve existing one on backend
    if (payload.image instanceof File) fd.append("image", payload.image);
    fd.append("nom_ecole", payload.nom_ecole);
    fd.append("nom_parcours", payload.nom_parcours);
    fd.append("annee_debut", String(payload.annee_debut));
    fd.append("annee_fin", String(payload.annee_fin));
    fd.append("lieu", payload.lieu);
    return apiAuth.put<Education>(`education/${id}/`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  },
};


