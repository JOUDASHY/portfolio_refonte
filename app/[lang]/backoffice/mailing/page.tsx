"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import { useEmails } from "../../../hooks/useEmails";
import { useSelection } from "../../../hooks/useSelection";
import { useDeletion } from "../../../hooks/useDeletion";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import FilterBar from "../../../ux/ui/FilterBar";
import BulkActions from "../../../ux/ui/BulkActions";
import { getRandomColor } from "../../../lib/avatarUtils";
import { formatSimpleDate } from "../../../lib/dateUtils";
import type { Email } from "../../../types/backoffice/email";

// Type pour les statuts d'email
type EmailStatus = "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed";

// Fonction pour déterminer le statut basé sur les réponses
const getEmailStatus = (email: Email): EmailStatus => {
  if (email.responses.length === 0) return "sent";
  if (email.responses.some(r => r.response.toLowerCase().includes("erreur") || r.response.toLowerCase().includes("error"))) return "failed";
  if (email.responses.some(r => r.response.toLowerCase().includes("bounce") || r.response.toLowerCase().includes("rejeté"))) return "bounced";
  if (email.responses.some(r => r.response.toLowerCase().includes("click") || r.response.toLowerCase().includes("cliqué"))) return "clicked";
  if (email.responses.some(r => r.response.toLowerCase().includes("open") || r.response.toLowerCase().includes("ouvert"))) return "opened";
  return "delivered";
};

const getStatusLabels = (t: (key: string) => string): Record<EmailStatus, string> => ({
  sent: t("mailing.status.sent"),
  delivered: t("mailing.status.delivered"),
  opened: t("mailing.status.opened"),
  clicked: t("mailing.status.clicked"),
  bounced: t("mailing.status.bounced"),
  failed: t("mailing.status.failed")
});

const statusColors: Record<EmailStatus, string> = {
  sent: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  opened: "bg-purple-100 text-purple-800",
  clicked: "bg-orange-100 text-orange-800",
  bounced: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-800"
};

export default function MailingHistoryPage() {
  const { t } = useLanguage();
  const { emails, loading, error, deleteEmail: deleteEmailAPI, createEmail, addResponse } = useEmails();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [responseModalOpen, setResponseModalOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    location: "",
    subject: "",
    message: "",
    template: "custom"
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Hooks personnalisés
  const selection = useSelection(emails);
  const deletion = useDeletion<Email>({
    onDelete: deleteEmailAPI,
    onDeleteMultiple: async (ids) => {
      await Promise.all(ids.map(id => deleteEmailAPI(id)));
      selection.clearSelection();
    }
  });
  
  const statusLabels = getStatusLabels(t);

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = email.email.toLowerCase().includes(search.toLowerCase()) ||
                           email.message.toLowerCase().includes(search.toLowerCase());
      // Note: getEmailStatus est maintenant dans EmailCard
      const matchesStatus = statusFilter === "all" || statusFilter === "sent"; // Simplifié pour l'exemple
      return matchesSearch && matchesStatus;
    });
  }, [emails, search, statusFilter]);

  const handleSendEmail = async () => {
    try {
      await createEmail({
        name: emailForm.name,
        email: emailForm.email,
        message: emailForm.message
      });
    setSendEmailOpen(false);
    setEmailForm({
      name: "",
      email: "",
      location: "",
      subject: "",
      message: "",
      template: "custom"
    });
    } catch (error) {
      console.error("Error creating email:", error);
    }
  };

  const handleSendResponse = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedEmail || !responseMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await addResponse(selectedEmail.id, responseMessage);
      setResponseModalOpen(false);
      setResponseMessage("");
    } catch (error) {
      console.error("Error sending response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFormChange = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto"></div>
          <p className="mt-2 text-foreground/60">{t("mailing.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          {t("mailing.retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <i className="fas fa-envelope"></i>
          {t("mailing.title")}
        </h2>
        <div className="flex items-center gap-3">
          <Button 
            variant="primary" 
            className="text-sm"
            onClick={() => setSendEmailOpen(true)}
          >
            {t("mailing.newEmail")}
          </Button>
          <Button variant="secondary" className="text-sm">
            {t("mailing.export")}
          </Button>
        </div>
      </div>

      <BulkActions
        selectedCount={selection.selectedCount}
        onDeleteSelected={() => deletion.handleDeleteMultiple(selection.selectedIds)}
        deleteLabel={t("mailing.deleteSelected")}
      />

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder={t("mailing.search")}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        statusOptions={[
          { value: "all", label: t("mailing.allStatuses") },
          { value: "sent", label: statusLabels.sent },
          { value: "delivered", label: statusLabels.delivered },
          { value: "opened", label: statusLabels.opened },
          { value: "clicked", label: statusLabels.clicked },
          { value: "bounced", label: statusLabels.bounced },
          { value: "failed", label: statusLabels.failed }
        ]}
      />

      <div className="emails-list space-y-4">
        {filteredEmails.map((email) => {
          const profileColor = getRandomColor(email.name);
          const initial = email.name.charAt(0).toUpperCase();
          const emailStatus: EmailStatus = getEmailStatus(email);
          const latestResponse = email.responses.length > 0 ? email.responses[email.responses.length - 1] : null;

          return (
            <div key={email.id} className="email-item bg-white/5 rounded-lg border border-white/20 p-4 hover:bg-white/10 transition-colors shadow-sm">
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  className="checkbox mt-1 w-4 h-4 text-accent bg-white/10 border-white/30 rounded focus:ring-accent focus:ring-2"
                  checked={selection.isSelected(email.id)}
                  onChange={() => selection.handleSelect(email.id)}
                />
                
                <div
                  className="profile-photo-email w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: profileColor }}
                >
                  {initial}
      </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <b className="text-foreground text-lg">{email.name}</b>
                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${statusColors[emailStatus]}`}>
                          {statusLabels[emailStatus]}
                        </span>
                      </div>
                      <p className="text-foreground/80 text-sm mb-2">{email.email}</p>
                      <p className="text-foreground/90 mb-3 leading-relaxed">{email.message}</p>
                      <small className="text-foreground/60 text-xs">
                        {t("mailing.receivedAt")} : {formatSimpleDate(email.date, email.heure)}
                      </small>
                      
                      {latestResponse && (
                        <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/30 shadow-sm">
                          <div className="flex items-center gap-2 mb-1">
                            <strong className="text-accent text-sm">{t("mailing.latestResponse")}:</strong>
                            <span className="text-xs text-foreground/60">
                              {formatSimpleDate(latestResponse.date, latestResponse.heure)}
                  </span>
                </div>
                          <p className="text-sm text-foreground/90">{latestResponse.response}</p>
                        </div>
                      )}
              </div>
                    
                    <div className="flex items-center gap-2 ml-4">
              <Button 
                variant="ghost" 
                        className="px-3 py-2 text-sm text-accent hover:bg-accent/10"
                onClick={() => {
                          setSelectedEmail(email);
                          setResponseModalOpen(true);
                }}
              >
                        <i className="fas fa-reply mr-2"></i>
                        {t("mailing.actions.reply")}
              </Button>
              <Button 
                variant="ghost" 
                        className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-500/10"
                        onClick={() => deletion.openDeleteModal(email)}
                      >
                        <i className="fas fa-trash mr-2"></i>
                {t("mailing.actions.delete")}
              </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        
        {filteredEmails.length === 0 && (
          <div className="text-center py-12 border border-white/20 rounded-lg bg-white/5">
            <i className="fas fa-envelope-open text-4xl text-foreground/30 mb-4"></i>
            <p className="text-foreground/60 text-lg">{t("mailing.empty")}</p>
            </div>
          )}
      </div>

      {/* Modal de réponse */}
      {responseModalOpen && selectedEmail && (
        <Modal
          open={responseModalOpen}
          onClose={() => {
            setResponseModalOpen(false);
            setResponseMessage("");
          }}
          title={t("mailing.replyModal.title")}
          size="md"
        >
          <form onSubmit={handleSendResponse} className="space-y-4">
              <div>
              <h3 className="text-lg font-medium text-foreground mb-2">
                {t("mailing.replyModal.replyTo")} {selectedEmail.email}
              </h3>
              <div className="bg-white/5 p-3 rounded-lg mb-4">
                <p className="text-sm text-foreground/80">
                  <strong>{t("mailing.replyModal.originalMessage")}:</strong>
                </p>
                <p className="text-sm text-foreground/90 mt-1">{selectedEmail.message}</p>
              </div>
              </div>
            
              <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                {t("mailing.replyModal.response")}
              </label>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder={t("mailing.replyModal.placeholder")}
                rows={6}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground ring-1 ring-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                required
              />
              </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button 
                type="button"
                variant="secondary" 
                onClick={() => {
                  setResponseModalOpen(false);
                  setResponseMessage("");
                }}
              >
                {t("mailing.replyModal.cancel")}
              </Button>
              <Button 
                type="submit"
                variant="primary" 
                disabled={!responseMessage.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("mailing.replyModal.sending")}
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane mr-2"></i>
                    {t("mailing.replyModal.send")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal de confirmation de suppression */}
      {deletion.deleteItem && (
        <Modal
          open={!!deletion.deleteItem}
          onClose={deletion.closeDeleteModal}
          title={t("mailing.delete.title")}
        >
          <div className="space-y-4">
            <p className="text-foreground/80">
              {t("mailing.delete.confirm")}
            </p>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-sm font-medium">{deletion.deleteItem.name}</p>
              <p className="text-xs text-foreground/60">{deletion.deleteItem.email}</p>
              <p className="text-xs text-foreground/60 mt-1">{deletion.deleteItem.message.substring(0, 100)}...</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={deletion.closeDeleteModal}>
                {t("mailing.delete.cancel")}
              </Button>
              <Button variant="primary" onClick={() => deletion.handleDelete(deletion.deleteItem!)} className="bg-red-600 hover:bg-red-700 text-white">
                {t("mailing.delete.confirmDelete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal pour envoyer un nouvel email */}
      {sendEmailOpen && (
        <Modal
          open={sendEmailOpen}
          onClose={() => setSendEmailOpen(false)}
          title={t("mailing.sendForm.title")}
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t("mailing.sendForm.name")} *
                </label>
                <Input
                  value={emailForm.name}
                  onChange={(e) => handleFormChange("name", e.target.value)}
                  placeholder={t("mailing.sendForm.namePlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t("mailing.sendForm.email")} *
                </label>
                <Input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  placeholder={t("mailing.sendForm.emailPlaceholder")}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t("mailing.sendForm.location")}
                </label>
                <Input
                  value={emailForm.location}
                  onChange={(e) => handleFormChange("location", e.target.value)}
                  placeholder={t("mailing.sendForm.locationPlaceholder")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  {t("mailing.sendForm.template")}
                </label>
                <select
                  value={emailForm.template}
                  onChange={(e) => handleFormChange("template", e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground ring-1 ring-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                >
                  <option value="custom">{t("mailing.sendForm.templateCustom")}</option>
                  <option value="welcome">{t("mailing.sendForm.templateWelcome")}</option>
                  <option value="cv_update">{t("mailing.sendForm.templateCV")}</option>
                  <option value="job_application">{t("mailing.sendForm.templateJob")}</option>
                  <option value="newsletter">{t("mailing.sendForm.templateNewsletter")}</option>
                  <option value="collaboration">{t("mailing.sendForm.templateCollaboration")}</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                {t("mailing.sendForm.subject")} *
              </label>
              <Input
                value={emailForm.subject}
                onChange={(e) => handleFormChange("subject", e.target.value)}
                placeholder={t("mailing.sendForm.subjectPlaceholder")}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground/80 mb-2">
                {t("mailing.sendForm.message")} *
              </label>
              <textarea
                value={emailForm.message}
                onChange={(e) => handleFormChange("message", e.target.value)}
                placeholder={t("mailing.sendForm.messagePlaceholder")}
                rows={6}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground ring-1 ring-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 resize-none"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button 
                variant="secondary" 
                onClick={() => setSendEmailOpen(false)}
              >
                {t("mailing.sendForm.cancel")}
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSendEmail}
                disabled={!emailForm.name || !emailForm.email || !emailForm.subject || !emailForm.message}
              >
                {t("mailing.sendForm.send")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
