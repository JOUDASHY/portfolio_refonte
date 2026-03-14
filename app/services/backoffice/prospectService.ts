"use client";

import { apiAuth } from "../../lib/axiosClient";
import type {
  Prospect,
  ProspectDetail,
  ProspectNote,
  ProspectMessage,
  MessageTemplate,
  ProspectStats,
  CreateProspectPayload,
  UpdateProspectPayload,
  CreateNotePayload,
  SendMessagePayload,
  CreateTemplatePayload,
} from "../../types/backoffice/prospect";

export const prospectService = {
  // Prospects
  list: (params?: { status?: string; source?: string; search?: string }) =>
    apiAuth.get<Prospect[]>("prospects/", { params }),

  create: (payload: CreateProspectPayload) =>
    apiAuth.post<ProspectDetail>("prospects/", payload),

  getDetail: (id: number) =>
    apiAuth.get<ProspectDetail>(`prospects/${id}/`),

  update: (id: number, payload: UpdateProspectPayload) =>
    apiAuth.put<ProspectDetail>(`prospects/${id}/`, payload),

  remove: (id: number) =>
    apiAuth.delete(`prospects/${id}/`),

  updateStatus: (id: number, status: string) =>
    apiAuth.patch<{ status: string }>(`prospects/${id}/status/`, { status }),

  stats: () =>
    apiAuth.get<ProspectStats>("prospects/stats/"),

  // Notes
  listNotes: (prospectId: number) =>
    apiAuth.get<ProspectNote[]>(`prospects/${prospectId}/notes/`),

  addNote: (prospectId: number, payload: CreateNotePayload) =>
    apiAuth.post<ProspectNote>(`prospects/${prospectId}/notes/`, payload),

  // Messages
  listMessages: (prospectId: number) =>
    apiAuth.get<ProspectMessage[]>(`prospects/${prospectId}/messages/`),

  sendMessage: (prospectId: number, payload: SendMessagePayload) =>
    apiAuth.post<ProspectMessage>(`prospects/${prospectId}/messages/send/`, payload),

  previewMessage: (prospectId: number, templateId?: number) =>
    apiAuth.post<{ subject: string; body: string }>(
      `prospects/${prospectId}/messages/preview/`,
      { template_id: templateId }
    ),

  // Templates
  listTemplates: (params?: { language?: "fr" | "en"; stage?: string }) =>
    apiAuth.get<MessageTemplate[]>("message-templates/", { params }),

  createTemplate: (payload: CreateTemplatePayload) =>
    apiAuth.post<MessageTemplate>("message-templates/", payload),

  updateTemplate: (id: number, payload: CreateTemplatePayload) =>
    apiAuth.put<MessageTemplate>(`message-templates/${id}/`, payload),

  deleteTemplate: (id: number) =>
    apiAuth.delete(`message-templates/${id}/`),
};
