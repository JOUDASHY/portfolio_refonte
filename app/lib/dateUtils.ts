/**
 * Utilitaires pour le formatage des dates
 */

export const formatEmailDate = (dateString: string, heureString: string): string => {
  try {
    console.log("Date string:", dateString, "Heure string:", heureString);
    
    if (!dateString || !heureString) {
      return "Date inconnue";
    }
    
    const cleanDate = dateString.trim();
    const cleanHeure = heureString.trim();
    
    // Format 1: YYYY-MM-DD HH:MM:SS
    if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/) && cleanHeure.match(/^\d{2}:\d{2}:\d{2}$/)) {
      const dateTimeString = `${cleanDate}T${cleanHeure}`;
      const date = new Date(dateTimeString);
      
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString("fr-FR", { month: "long" });
        const year = date.getFullYear();
        const time = cleanHeure;
        
        return `${day} ${month} ${year} à ${time}`;
      }
    }
    
    // Format 2: YYYY-MM-DD HH:MM
    if (cleanDate.match(/^\d{4}-\d{2}-\d{2}$/) && cleanHeure.match(/^\d{2}:\d{2}$/)) {
      const dateTimeString = `${cleanDate}T${cleanHeure}:00`;
      const date = new Date(dateTimeString);
      
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString("fr-FR", { month: "long" });
        const year = date.getFullYear();
        const time = `${cleanHeure}:00`;
        
        return `${day} ${month} ${year} à ${time}`;
      }
    }
    
    // Format 3: Parser la date seule
    const dateOnly = new Date(cleanDate);
    if (!isNaN(dateOnly.getTime())) {
      const day = dateOnly.getDate().toString().padStart(2, '0');
      const month = dateOnly.toLocaleDateString("fr-FR", { month: "long" });
      const year = dateOnly.getFullYear();
      
      return `${day} ${month} ${year} à ${cleanHeure}`;
    }
    
    return `${cleanDate} à ${cleanHeure}`;
    
  } catch (error) {
    console.error("Error formatting date:", error, "Date:", dateString, "Heure:", heureString);
    return "Date invalide";
  }
};

export const formatSimpleDate = (dateString: string, heureString: string): string => {
  try {
    if (!dateString || !heureString) {
      return "Date inconnue";
    }
    
    const cleanDate = dateString.trim();
    const cleanHeure = heureString.trim();
    
    // Essayer avec format ISO complet
    if (cleanDate.includes('-') && cleanHeure.includes(':')) {
      const dateTimeString = `${cleanDate}T${cleanHeure}`;
      const date = new Date(dateTimeString);
      
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString("fr-FR", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        });
      }
    }
    
    // Essayer de parser la date seule
    const dateOnly = new Date(cleanDate);
    if (!isNaN(dateOnly.getTime())) {
      return dateOnly.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }) + ` à ${cleanHeure}`;
    }
    
    return `${cleanDate} à ${cleanHeure}`;
    
  } catch (error) {
    console.error("Error formatting simple date:", error);
    return "Date invalide";
  }
};
