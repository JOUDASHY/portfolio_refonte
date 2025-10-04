"use client";

import { useState, useEffect } from "react";
import { emailService } from "../services/backoffice/emailService";
import type { Email } from "../types/backoffice/email";

export const useEmails = () => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await emailService.list();
      console.log("API Response:", response.data);
      
      // Debug: vérifier la structure des données
      if (response.data && Array.isArray(response.data)) {
        response.data.forEach((email, index) => {
          console.log(`Email ${index}:`, {
            id: email.id,
            name: email.name,
            email: email.email,
            message: email.message,
            date: email.date,
            heure: email.heure,
            responses: email.responses
          });
        });
      }
      
      setEmails(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des emails");
      console.error("Error fetching emails:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteEmail = async (id: number) => {
    try {
      await emailService.remove(id);
      setEmails(prev => prev.filter(email => email.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la suppression");
      console.error("Error deleting email:", err);
    }
  };

  const createEmail = async (emailData: Pick<Email, "name" | "email" | "message">) => {
    try {
      const response = await emailService.create(emailData);
      setEmails(prev => [response.data, ...prev]);
      return response.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création");
      console.error("Error creating email:", err);
      throw err;
    }
  };

  const addResponse = async (emailId: number, response: string) => {
    try {
      const responseData = await emailService.createResponse(emailId, { response });
      setEmails(prev => prev.map(email => 
        email.id === emailId 
          ? { ...email, responses: [...email.responses, responseData.data] }
          : email
      ));
      return responseData.data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de l'ajout de la réponse");
      console.error("Error adding response:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  return {
    emails,
    loading,
    error,
    fetchEmails,
    deleteEmail,
    createEmail,
    addResponse
  };
};
