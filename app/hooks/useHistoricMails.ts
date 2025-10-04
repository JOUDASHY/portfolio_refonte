"use client";

import { useState, useEffect } from "react";
import { emailService } from "../services/backoffice/emailService";
import type { HistoricMail } from "../types/backoffice/email";

export const useHistoricMails = () => {
  const [historicMails, setHistoricMails] = useState<HistoricMail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistoricMails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailService.listHistoric();
      console.log("Historic mails API response:", response.data);
      
      // Debug: vérifier la structure des données
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((mail, index) => {
          console.log(`Historic mail ${index}:`, {
            id: mail.id,
            nom_entreprise: mail.nom_entreprise,
            email_entreprise: mail.email_entreprise,
            lieu_entreprise: mail.lieu_entreprise,
            date_envoi: mail.date_envoi,
            heure_envoi: mail.heure_envoi
          });
        });
      }
      
      setHistoricMails(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'historique");
      console.error("Error fetching historic mails:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistoricMail = async (id: number) => {
    try {
      // Note: Il faudrait ajouter cette méthode dans le service si elle n'existe pas
      // await emailService.removeHistoric(id);
      setHistoricMails(prev => prev.filter(mail => mail.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting historic mail:", err);
    }
  };

  useEffect(() => {
    fetchHistoricMails();
  }, []);

  return {
    historicMails,
    loading,
    error,
    fetchHistoricMails,
    deleteHistoricMail
  };
};
