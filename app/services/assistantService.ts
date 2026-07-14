import { apiAuth } from "../lib/axiosClient";

export interface ChatMessage {
  id?: number;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
}

export const AssistantService = {
  /** Envoie une question et retourne la réponse de l'assistant.
   *  Le header Authorization: Bearer <token> est injecté automatiquement
   *  par l'intercepteur apiAuth → la conversation est sauvegardée en BDD. */
  poserQuestion: async (question: string): Promise<string> => {
    const response = await apiAuth.post<{ reponse: string }>("rag/chat/", {
      question,
    });
    return response.data.reponse;
  },

  /** Récupère l'historique des conversations depuis la BDD (requiert JWT). */
  getHistory: async (): Promise<ChatMessage[]> => {
    const response = await apiAuth.get<ChatMessage[]>("rag/history/");
    return response.data;
  },
};
