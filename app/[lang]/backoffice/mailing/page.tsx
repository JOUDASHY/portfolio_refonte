"use client";

import { useState, useMemo } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";

interface EmailHistory {
  id: string;
  recipient: string;
  subject: string;
  status: "sent" | "delivered" | "opened" | "clicked" | "bounced" | "failed";
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
  template: string;
  campaign?: string;
}

interface EmailHistoryRow {
  id: string;
  recipient: React.ReactElement;
  subject: string;
  status: React.ReactElement;
  sentAt: string;
  template: React.ReactElement;
  campaign: string;
}

const mockData: EmailHistory[] = [
  {
    id: "1",
    recipient: "john.doe@example.com",
    subject: "Bienvenue sur mon portfolio",
    status: "opened",
    sentAt: "2024-01-15T10:30:00Z",
    openedAt: "2024-01-15T14:22:00Z",
    template: "welcome",
    campaign: "Onboarding"
  },
  {
    id: "2",
    recipient: "jane.smith@company.com",
    subject: "Nouvelle mise à jour de mon CV",
    status: "clicked",
    sentAt: "2024-01-14T09:15:00Z",
    openedAt: "2024-01-14T11:45:00Z",
    clickedAt: "2024-01-14T12:10:00Z",
    template: "cv_update",
    campaign: "Professional Update"
  },
  {
    id: "3",
    recipient: "recruiter@techcorp.com",
    subject: "Candidature pour le poste de Développeur Full Stack",
    status: "delivered",
    sentAt: "2024-01-13T16:20:00Z",
    template: "job_application",
    campaign: "Job Applications"
  },
  {
    id: "4",
    recipient: "invalid@email.com",
    subject: "Newsletter mensuelle",
    status: "bounced",
    sentAt: "2024-01-12T08:00:00Z",
    template: "newsletter",
    campaign: "Monthly Newsletter"
  },
  {
    id: "5",
    recipient: "client@startup.io",
    subject: "Proposition de collaboration",
    status: "sent",
    sentAt: "2024-01-11T13:45:00Z",
    template: "collaboration",
    campaign: "Business Development"
  }
];

const getStatusLabels = (t: (key: string) => string) => ({
  sent: t("mailing.status.sent"),
  delivered: t("mailing.status.delivered"),
  opened: t("mailing.status.opened"),
  clicked: t("mailing.status.clicked"),
  bounced: t("mailing.status.bounced"),
  failed: t("mailing.status.failed")
});

const statusColors = {
  sent: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  opened: "bg-purple-100 text-purple-800",
  clicked: "bg-orange-100 text-orange-800",
  bounced: "bg-red-100 text-red-800",
  failed: "bg-gray-100 text-gray-800"
};

export default function MailingHistoryPage() {
  const { t } = useLanguage();
  const [emails, setEmails] = useState<EmailHistory[]>(mockData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedEmail, setSelectedEmail] = useState<EmailHistory | null>(null);
  const [deleteEmail, setDeleteEmail] = useState<EmailHistory | null>(null);
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState({
    name: "",
    email: "",
    location: "",
    subject: "",
    message: "",
    template: "custom"
  });
  
  const statusLabels = getStatusLabels(t);

  const filteredEmails = useMemo(() => {
    return emails.filter(email => {
      const matchesSearch = email.recipient.toLowerCase().includes(search.toLowerCase()) ||
                           email.subject.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || email.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [emails, search, statusFilter]);

  const handleDelete = (email: EmailHistory) => {
    setEmails(prev => prev.filter(e => e.id !== email.id));
    setDeleteEmail(null);
  };

  const handleSendEmail = () => {
    // Simuler l'envoi d'email
    const newEmail: EmailHistory = {
      id: Date.now().toString(),
      recipient: emailForm.email,
      subject: emailForm.subject,
      status: "sent",
      sentAt: new Date().toISOString(),
      template: emailForm.template,
      campaign: "Manual Send"
    };
    
    setEmails(prev => [newEmail, ...prev]);
    setSendEmailOpen(false);
    setEmailForm({
      name: "",
      email: "",
      location: "",
      subject: "",
      message: "",
      template: "custom"
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const columns = [
    { key: "recipient", header: t("mailing.columns.recipient") },
    { key: "subject", header: t("mailing.columns.subject") },
    { key: "status", header: t("mailing.columns.status") },
    { key: "sentAt", header: t("mailing.columns.sentAt") },
    { key: "template", header: t("mailing.columns.template") },
    { key: "campaign", header: t("mailing.columns.campaign") }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t("mailing.title")}</h1>
          <p className="mt-1 text-foreground/60">
            {t("mailing.subtitle")}
          </p>
        </div>
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

      <div className="flex flex-col gap-4 sm:flex-row">
        <SearchBar
          placeholder={t("mailing.search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-foreground ring-1 ring-white/20 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
        >
          <option value="all">{t("mailing.allStatuses")}</option>
          <option value="sent">{statusLabels.sent}</option>
          <option value="delivered">{statusLabels.delivered}</option>
          <option value="opened">{statusLabels.opened}</option>
          <option value="clicked">{statusLabels.clicked}</option>
          <option value="bounced">{statusLabels.bounced}</option>
          <option value="failed">{statusLabels.failed}</option>
        </select>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5">
        <Table
          columns={columns}
          data={filteredEmails.map(email => ({
            ...email,
            recipient: (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-xs font-medium text-accent">
                    {email.recipient.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium">{email.recipient}</span>
              </div>
            ),
            status: (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[email.status]}`}>
                {statusLabels[email.status]}
              </span>
            ),
            sentAt: formatDate(email.sentAt),
            template: (
              <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-medium">
                {email.template}
              </span>
            ),
            campaign: email.campaign || "-"
          }))}
          rowKey={(row) => (row as EmailHistoryRow).id}
          emptyText={t("mailing.empty")}
          actionsHeader={t("mailing.columns.actions")}
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="px-2 py-1 text-sm"
                onClick={() => {
                  // Trouver l'email original par ID
                  const originalEmail = emails.find(e => e.id === (row as EmailHistoryRow).id);
                  if (originalEmail) setSelectedEmail(originalEmail);
                }}
              >
                {t("mailing.actions.view")}
              </Button>
              <Button 
                variant="ghost" 
                className="px-2 py-1 text-sm text-red-600 hover:text-red-700"
                onClick={() => {
                  // Trouver l'email original par ID
                  const originalEmail = emails.find(e => e.id === (row as EmailHistoryRow).id);
                  if (originalEmail) setDeleteEmail(originalEmail);
                }}
              >
                {t("mailing.actions.delete")}
              </Button>
            </div>
          )}
        />
      </div>

      {/* Modal pour voir les détails d'un email */}
      {selectedEmail && (
        <Modal
          open={!!selectedEmail}
          onClose={() => setSelectedEmail(null)}
          title={t("mailing.details.title")}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.recipient")}</label>
                <p className="text-sm">{selectedEmail.recipient}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.status")}</label>
                <p className="text-sm">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[selectedEmail.status]}`}>
                    {statusLabels[selectedEmail.status]}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.subject")}</label>
                <p className="text-sm">{selectedEmail.subject}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.template")}</label>
                <p className="text-sm">{selectedEmail.template}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.campaign")}</label>
                <p className="text-sm">{selectedEmail.campaign || "-"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground/60">{t("mailing.details.sentAt")}</label>
                <p className="text-sm">{formatDate(selectedEmail.sentAt)}</p>
              </div>
              {selectedEmail.openedAt && (
                <div>
                  <label className="text-sm font-medium text-foreground/60">{t("mailing.details.openedAt")}</label>
                  <p className="text-sm">{formatDate(selectedEmail.openedAt)}</p>
                </div>
              )}
              {selectedEmail.clickedAt && (
                <div>
                  <label className="text-sm font-medium text-foreground/60">{t("mailing.details.clickedAt")}</label>
                  <p className="text-sm">{formatDate(selectedEmail.clickedAt)}</p>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de confirmation de suppression */}
      {deleteEmail && (
        <Modal
          open={!!deleteEmail}
          onClose={() => setDeleteEmail(null)}
          title={t("mailing.delete.title")}
        >
          <div className="space-y-4">
            <p className="text-foreground/80">
              {t("mailing.delete.confirm")}
            </p>
            <div className="rounded-lg bg-white/5 p-3">
              <p className="text-sm font-medium">{deleteEmail.subject}</p>
              <p className="text-xs text-foreground/60">{deleteEmail.recipient}</p>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleteEmail(null)}>
                {t("mailing.delete.cancel")}
              </Button>
              <Button variant="primary" onClick={() => handleDelete(deleteEmail)} className="bg-red-600 hover:bg-red-700 text-white">
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
