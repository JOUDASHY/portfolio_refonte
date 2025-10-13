"use client";

import { apiAuth } from "../../lib/axiosClient";
import type { ImageProjet } from "../../types/backoffice/imageProjet";

export const imageProjetService = {
  list: () => apiAuth.get<ImageProjet[]>("images/"),
  create: (payload: FormData) => apiAuth.post<ImageProjet>("images/", payload, { headers: { "Content-Type": "multipart/form-data" } }),
  detail: (id: number | string) => apiAuth.get<ImageProjet>(`images/${id}/`),
  update: (id: number | string, payload: FormData) => apiAuth.put<ImageProjet>(`images/${id}/`, payload, { headers: { "Content-Type": "multipart/form-data" } }),
  remove: (id: number | string) => apiAuth.delete(`images/${id}/`),

  // Convenient helpers for simple usage with File
  createFromFile: (projet: number | string, file: File) => {
    const fd = new FormData();
    fd.append("projet", String(projet));
    fd.append("image", file);
    return imageProjetService.create(fd);
  },
  updateFromFile: (id: number | string, file: File, projet?: number | string) => {
    const fd = new FormData();
    if (projet != null) fd.append("projet", String(projet));
    fd.append("image", file);
    return imageProjetService.update(id, fd);
  },
};


