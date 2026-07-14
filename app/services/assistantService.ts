import { apiAuth } from "../lib/axiosClient";

/* ── Types ────────────────────────────────────────────────── */

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export interface Conversation {
  id: number;
  title: string;
  message_count: number;
  created_at: string;
  updated_at: string;
}

export interface ConversationDetail extends Conversation {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reponse: string;
  conversation_id: number;
}

/* ── Service ──────────────────────────────────────────────── */

export const AssistantService = {
  /**
   * Envoie une question.
   * - Sans conversation_id → crée automatiquement une nouvelle conversation
   * - Avec conversation_id  → continue la conversation existante
   * Le header Authorization: Bearer <token> est injecté par apiAuth.
   */
  chat: async (question: string, conversationId?: number): Promise<ChatResponse> => {
    const body: Record<string, unknown> = { question };
    if (conversationId !== undefined) body.conversation_id = conversationId;
    const res = await apiAuth.post<ChatResponse>("rag/chat/", body);
    return res.data;
  },

  /** Liste toutes les conversations de l'utilisateur. */
  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiAuth.get<Conversation[]>("rag/conversations/");
    return res.data;
  },

  /** Détail d'une conversation avec ses messages. */
  getConversation: async (id: number): Promise<ConversationDetail> => {
    const res = await apiAuth.get<ConversationDetail>(`rag/conversations/${id}/`);
    return res.data;
  },

  /** Crée une conversation vide (optionnel, le chat la crée automatiquement). */
  createConversation: async (title?: string): Promise<Conversation> => {
    const res = await apiAuth.post<Conversation>("rag/conversations/", { title: title ?? "Nouvelle conversation" });
    return res.data;
  },

  /** Supprime une conversation. */
  deleteConversation: async (id: number): Promise<void> => {
    await apiAuth.delete(`rag/conversations/${id}/`);
  },

  /** Renomme une conversation. */
  renameConversation: async (id: number, title: string): Promise<Conversation> => {
    const res = await apiAuth.patch<Conversation>(`rag/conversations/${id}/`, { title });
    return res.data;
  },

  // ── Rétro-compatibilité ──────────────────────────────────
  /** @deprecated Utiliser chat() à la place */
  poserQuestion: async (question: string): Promise<string> => {
    const res = await AssistantService.chat(question);
    return res.reponse;
  },
  /** @deprecated Plus utilisé */
  getHistory: async (): Promise<ChatMessage[]> => [],
};
