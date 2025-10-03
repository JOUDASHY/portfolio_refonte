"use client";

import { useEffect, useRef } from "react";
import { visitService } from "../services/backoffice/visitService";

/**
 * Hook personnalisé pour enregistrer automatiquement les visites
 * Enregistre une visite une seule fois par session
 */
export function useVisitTracker() {
  const hasRecorded = useRef(false);
  const isRecording = useRef(false);

  useEffect(() => {
    // Éviter les enregistrements multiples
    if (hasRecorded.current || isRecording.current) {
      return;
    }

    // Vérifier si une visite a déjà été enregistrée dans cette session
    const sessionKey = "portfolio_visit_recorded";
    const hasVisitedThisSession = sessionStorage.getItem(sessionKey);

    if (hasVisitedThisSession) {
      hasRecorded.current = true;
      return;
    }

    const recordVisit = async () => {
      if (isRecording.current) return;
      
      isRecording.current = true;
      
      try {
        await visitService.record();
        
        // Marquer comme enregistré pour cette session
        sessionStorage.setItem(sessionKey, "true");
        hasRecorded.current = true;
        
        console.log("📊 Visite enregistrée avec succès");
      } catch (error) {
        console.warn("⚠️ Erreur lors de l'enregistrement de la visite:", error);
        // Ne pas bloquer l'application si l'enregistrement échoue
      } finally {
        isRecording.current = false;
      }
    };

    // Enregistrer la visite avec un léger délai pour s'assurer que la page est bien chargée
    const timeoutId = setTimeout(recordVisit, 1000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return {
    hasRecorded: hasRecorded.current,
  };
}
