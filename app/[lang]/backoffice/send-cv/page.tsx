"use client";

import { useState } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import Button from "../../../ux/ui/Button";
import Input from "../../../ux/ui/Input";
import Modal from "../../../ux/ui/Modal";

interface EmailForm {
  name: string;
  email: string;
  location: string;
  subject: string;
  message: string;
  template: string;
}

export default function SendCvPage() {
  const { t } = useLanguage();
  const [sendEmailOpen, setSendEmailOpen] = useState(false);
  const [emailForm, setEmailForm] = useState<EmailForm>({
    name: "",
    email: "",
    location: "",
    subject: "",
    message: "",
    template: "cv_update"
  });

  const handleSendEmail = () => {
    // Simuler l'envoi d'email
    console.log("Email envoyé:", emailForm);
    setSendEmailOpen(false);
    setEmailForm({
      name: "",
      email: "",
      location: "",
      subject: "",
      message: "",
      template: "cv_update"
    });
  };

  const handleFormChange = (field: string, value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Envoyer un CV</h1>
            <p className="mt-1 text-foreground/60">
              Envoyez votre CV à des recruteurs et contacts professionnels
            </p>
          </div>
          <Button 
            variant="primary" 
            className="text-sm"
            onClick={() => setSendEmailOpen(true)}
          >
            {t("mailing.newEmail")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Templates disponibles</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <h3 className="font-medium text-foreground">Candidature standard</h3>
                <p className="text-sm text-foreground/60">Template pour postuler à un emploi</p>
              </div>
              <Button variant="ghost" className="text-sm px-3 py-1">Utiliser</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <h3 className="font-medium text-foreground">Mise à jour CV</h3>
                <p className="text-sm text-foreground/60">Informer de nouvelles compétences</p>
              </div>
              <Button variant="ghost" className="text-sm px-3 py-1">Utiliser</Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
              <div>
                <h3 className="font-medium text-foreground">Collaboration</h3>
                <p className="text-sm text-foreground/60">Proposer un partenariat</p>
              </div>
              <Button variant="ghost" className="text-sm px-3 py-1">Utiliser</Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Statistiques</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-foreground/60">Emails envoyés</span>
              <span className="font-semibold text-foreground">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Taux d&apos;ouverture</span>
              <span className="font-semibold text-green-600">68%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Réponses reçues</span>
              <span className="font-semibold text-blue-600">12</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/60">Entretiens obtenus</span>
              <span className="font-semibold text-purple-600">8</span>
            </div>
          </div>
        </div>
      </div>

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


