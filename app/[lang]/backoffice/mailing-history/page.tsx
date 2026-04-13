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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg sm:text-2xl font-bold text-foreground">
          {t("mailingHistory.title")}
        </h2>
        <Button variant="secondary" className="text-xs sm:text-sm px-2 sm:px-4">
          {t("mailingHistory.export")}
        </Button>
      </div>

      {selectedMails.length > 0 && (
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm"
            onClick={handleDeleteSelected}
          >
            {t("mailingHistory.deleteSelected")} ({selectedMails.length})
          </Button>
        </div>
      )}

      <SearchBar
        placeholder={t("mailingHistory.search")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <div className="space-y-3">
        {filteredMails.map((mail) => {
          const profileColor = getRandomColor(mail.nom_entreprise);
          const initial = mail.nom_entreprise.charAt(0).toUpperCase();

          return (
            <div key={mail.id} className="bg-white/5 rounded-lg border border-white/20 p-3 sm:p-4 hover:bg-white/10 transition-colors shadow-sm">
              <div className="flex items-start gap-2 sm:gap-4">
                <input
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-accent bg-white/10 border-white/30 rounded focus:ring-accent focus:ring-2 shrink-0"
                  checked={selectedMails.includes(mail.id)}
                  onChange={() => handleSelectMail(mail.id)}
                />

                <div
                  className="w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg shrink-0"
                  style={{ backgroundColor: profileColor }}
                >
                  {initial}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Mobile: stacked layout */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {/* Compact info on mobile */}
                      <div className="mb-2">
                        <p className="font-semibold text-foreground text-sm truncate">{mail.nom_entreprise}</p>
                        <p className="text-accent text-xs truncate">{mail.email_entreprise}</p>
                        <p className="text-foreground/50 text-xs truncate">{mail.lieu_entreprise}</p>
                      </div>
                      {/* Full sentence on sm+ */}
                      <p className="hidden sm:block text-foreground/80 text-sm leading-relaxed mb-2">
                        L&apos;email <span className="font-semibold text-accent">{mail.email_entreprise}</span>,
                        destiné à <span className="font-semibold text-foreground">{mail.nom_entreprise}</span>,
                        situé à <span className="font-semibold text-foreground">{mail.lieu_entreprise}</span>,
                        envoyé le <span className="font-semibold text-foreground">{formatDate(mail.date_envoi, mail.heure_envoi)}</span>.
                      </p>
                      {/* Date on mobile */}
                      <p className="sm:hidden text-foreground/50 text-[10px] mb-2">{formatDate(mail.date_envoi, mail.heure_envoi)}</p>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] sm:text-xs font-medium bg-green-100 text-green-800">
                          {t("mailingHistory.status.sent")}
                        </span>
                        <span className="text-[10px] sm:text-xs text-foreground/40">ID: {mail.id}</span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      className="self-start sm:ml-4 px-2 py-1 text-xs text-red-500 hover:text-red-600 hover:bg-red-500/10 shrink-0"
                      onClick={() => setDeleteMail(mail)}
                    >
                      {t("mailingHistory.actions.delete")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filteredMails.length === 0 && (
          <div className="text-center py-10 border border-white/20 rounded-lg bg-white/5">
            <p className="text-foreground/60 text-sm sm:text-lg">{t("mailingHistory.empty")}</p>
          </div>
        )}
      </div>

      {deleteMail && (
        <Modal
          open={!!deleteMail}
          onClose={() => setDeleteMail(null)}
          title={t("mailingHistory.delete.title")}
        >
          <div className="space-y-4">
            <p className="text-foreground/80 text-sm">
              {t("mailingHistory.delete.confirm")}
            </p>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-xs sm:text-sm text-foreground/90">
                <span className="font-semibold text-accent">{deleteMail.email_entreprise}</span> —{" "}
                <span className="font-semibold text-foreground">{deleteMail.nom_entreprise}</span>,{" "}
                <span className="text-foreground/60">{deleteMail.lieu_entreprise}</span>
              </p>
            </div>
            <div className="flex justify-end gap-2 sm:gap-3">
              <Button variant="secondary" onClick={() => setDeleteMail(null)} className="text-xs sm:text-sm">
                {t("mailingHistory.delete.cancel")}
              </Button>
              <Button variant="primary" onClick={() => handleDelete(deleteMail)} className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm">
                {t("mailingHistory.delete.confirmDelete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}


