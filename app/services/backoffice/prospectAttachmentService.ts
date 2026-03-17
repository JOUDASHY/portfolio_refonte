import { apiAuth } from "@/app/lib/axiosClient";

export type ProspectAttachment = {
  id: number;
  name: string;
  file_url: string;
  content_type?: string | null;
};

export const prospectAttachmentService = {
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return apiAuth.post<ProspectAttachment>("prospect-attachments/upload/", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  list: () => apiAuth.get<ProspectAttachment[]>("prospect-attachments/"),

  remove: (id: number) => apiAuth.delete<void>(`prospect-attachments/${id}/`),
};

