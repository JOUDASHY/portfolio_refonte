import { apiNoAuth } from "../lib/axiosClient";

export const AssistantService = {
  poserQuestion: async (question: string): Promise<string> => {
    try {
      const response = await apiNoAuth.post("/chat/", { question });
      return response.data.reponse;
    } catch (error) {
      console.error("Erreur lors de la communication avec l'assistant", error);
      throw error;
    }
  },
};
