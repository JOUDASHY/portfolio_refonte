"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import { useHistoricMails } from "../../../hooks/useHistoricMails";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import type { HistoricMail } from "../../../types/backoffice/email";

// Fonction pour générer une couleur aléatoire basée sur le nom de l'entreprise
const getRandomColor = (seed: string) => {
  const hash = [...seed].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A8", "#A833FF", "#33FFA8",
    "#FFA833", "#57FF33", "#5733FF", "#FF5733", "#33FF57", "#33A8FF"
  ];
  return colors[hash % colors.length];
};

export default function MailingHistoryPage() {
  const { t } = useLanguage();
  const { historicMails, loading, error, deleteHistoricMail } = useHistoricMails();
  const [search, setSearch] = useState("");
  const [selectedMails, setSelectedMails] = useState<number[]>([]);
  const [deleteMail, setDeleteMail] = useState<HistoricMail | null>(null);

  const filteredMails = useMemo(() => {
    return historicMails.filter(mail => {
      const matchesSearch = mail.nom_entreprise.toLowerCase().includes(search.toLowerCase()) ||
                           mail.email_entreprise.toLowerCase().includes(search.toLowerCase()) ||
                           mail.lieu_entreprise.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [historicMails, search]);

  // Sélectionner ou désélectionner un mail
  const handleSelectMail = (mailId: number) => {
    setSelectedMails((prevSelected) => {
      if (prevSelected.includes(mailId)) {
        return prevSelected.filter((id) => id !== mailId);
      } else {
        return [...prevSelected, mailId];
      }
    });
  };

  // Supprimer les mails sélectionnés
  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedMails.map(async (mailId) => {
        try {
          await deleteHistoricMail(mailId);
          return mailId;
        } catch (error) {
          console.error(`Erreur lors de la suppression du mail avec l'ID: ${mailId}`, error);
          return null;
        }
      });

      await Promise.all(deletePromises);
      setSelectedMails([]);
    } catch (error) {
      console.error("Error deleting selected mails:", error);
    }
  };

  const handleDelete = async (mail: HistoricMail) => {
    try {
      await deleteHistoricMail(mail.id);
      setDeleteMail(null);
    } catch (error) {
      console.error("Error deleting mail:", error);
    }
  };

  const formatDate = (dateString: string, heureString: string) => {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-foreground/60">{t("mailingHistory.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          {t("mailingHistory.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <i className="fas fa-history"></i>
          {t("mailingHistory.title")}
        </h2>
        <div className="flex items-center gap-3">
          <Button variant="secondary" className="text-sm">
            {t("mailingHistory.export")}
          </Button>
        </div>
      </div>

      {selectedMails.length > 0 && (
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDeleteSelected}
          >
            <i className="fas fa-trash mr-2"></i>
            {t("mailingHistory.deleteSelected")} ({selectedMails.length})
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar
          placeholder={t("mailingHistory.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="historic-mails-list space-y-4">
        {filteredMails.map((mail) => {
          const profileColor = getRandomColor(mail.nom_entreprise);
          const initial = mail.nom_entreprise.charAt(0).toUpperCase();

          return (
            <div key={mail.id} className="historic-mail-item bg-white/5 rounded-lg border border-white/20 p-4 hover:bg-white/10 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox mt-1 w-4 h-4 text-accent bg-white/10 border-white/30 rounded focus:ring-accent focus:ring-2"
                  checked={selectedMails.includes(mail.id)}
                  onChange={() => handleSelectMail(mail.id)}
                />
                
                <div
                  className="profile-photo-mail w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: profileColor }}
                >
                  {initial}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-foreground/90 text-sm leading-relaxed">
                        L&apos;email <span className="font-semibold text-accent">{mail.email_entreprise}</span>, 
                        destiné à l&apos;entreprise <span className="font-semibold text-foreground">{mail.nom_entreprise}</span>,
                          située à <span className="font-semibold text-foreground">{mail.lieu_entreprise}</span>, 
                          a été envoyé avec succès le <span className="font-semibold text-foreground">{formatDate(mail.date_envoi, mail.heure_envoi)}</span>.
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-800">
                          <i className="fas fa-check-circle mr-1"></i>
                          {t("mailingHistory.status.sent")}
                        </span>
                        <span className="text-xs text-foreground/60">
                          ID: {mail.id}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button 
                        variant="ghost" 
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-500/10"
                        onClick={() => setDeleteMail(mail)}
                      >
                        <i className="fas fa-trash mr-2"></i>
                        {t("mailingHistory.actions.delete")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredMails.length === 0 && (
          <div className="text-center py-12 border border-white/20 rounded-lg bg-white/5">
            <i className="fas fa-history text-4xl text-foreground/30 mb-4"></i>
            <p className="text-foreground/60 text-lg">{t("mailingHistory.empty")}</p>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {deleteMail && (
        <Modal
          open={!!deleteMail}
          onClose={() => setDeleteMail(null)}
          title={t("mailingHistory.delete.title")}
        >
          <div className="space-y-4">
            <p className="text-foreground/80">
              {t("mailingHistory.delete.confirm")}
            </p>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-sm text-foreground/90">
                L&apos;email <span className="font-semibold text-accent">{deleteMail.email_entreprise}</span>, 
                destiné à l&apos;entreprise <span className="font-semibold text-foreground">{deleteMail.nom_entreprise}</span>, 
                située à <span className="font-semibold text-foreground">{deleteMail.lieu_entreprise}</span>, 
                a été envoyé avec succès le <span className="font-semibold text-foreground">{formatDate(deleteMail.date_envoi, deleteMail.heure_envoi)}</span>.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteMail(null)}>
                {t("mailingHistory.delete.cancel")}
              </Button>
              <Button variant="primary" onClick={() => handleDelete(deleteMail)} className="bg-red-600 hover:bg-red-700 text-white">
                {t("mailingHistory.delete.confirmDelete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


