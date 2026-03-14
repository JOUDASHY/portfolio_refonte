"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import { BASE_URL } from "../../lib/http/base";

export type CVModel = {
  id: number;
  file_url: string;
  uploaded_at: string;
  is_active: boolean;
};

export const cvService = {
  // Get active CV info (public)
  getActive: () => apiNoAuth.get<CVModel>("cv/"),
  
  // View CV in browser (public)
  getViewUrl: () => {
    return `${BASE_URL}cv/`;
  },
  
  // Download CV as PDF (public)
  getDownloadUrl: () => {
    return `${BASE_URL}cv/?download=true`;
  },
  
  // Upload new CV (authenticated)
  upload: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiAuth.post<CVModel>("cv/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  // Update/replace active CV (authenticated)
  update: (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiAuth.put<CVModel>("cv/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  
  // List all CV history (authenticated)
  listAll: () => apiAuth.get<CVModel[]>("cv/list/"),
  
  // Delete a CV (authenticated)
  delete: (id: number | string) => apiAuth.delete(`cv/${id}/`),
};
