"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { Email, EmailResponse, HistoricMail } from "../../types/backoffice/email";

export const emailService = {
  list: () => apiAuth.get<Email[]>("emails/"),
  create: (payload: Pick<Email, "name" | "email" | "message">) => apiNoAuth.post<Email>("emails/", payload),
  detail: (id: number | string) => apiAuth.get<Email>(`emails/${id}/`),
  update: (id: number | string, payload: Partial<Email>) => apiAuth.put<Email>(`emails/${id}/`, payload),
  remove: (id: number | string) => apiAuth.delete(`emails/${id}/`),

  createResponse: (emailId: number | string, payload: Pick<EmailResponse, "response">) => apiAuth.post<EmailResponse>(`emails/${emailId}/responses/`, payload),
  listResponses: (emailId: number | string) => apiAuth.get<EmailResponse[]>(`emails/${emailId}/responses/`),
  responseDetail: (id: number | string) => apiAuth.get<EmailResponse>(`email-responses/${id}/`),
  responseUpdate: (id: number | string, payload: Partial<EmailResponse>) => apiAuth.put<EmailResponse>(`email-responses/${id}/`, payload),
  responseRemove: (id: number | string) => apiAuth.delete(`email-responses/${id}/`),

  sendMailEntreprise: (payload: { nomEntreprise: string; emailEntreprise: string; lieuEntreprise: string }) => apiAuth.post<{ message: string }>("mail_entreprise/", payload),
  listHistoric: () => apiAuth.get<HistoricMail[]>("historic-mails/"),
};


