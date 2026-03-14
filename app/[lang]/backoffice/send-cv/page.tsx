"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import Button from "../../../ux/ui/Button";
import Input from "../../../ux/ui/Input";
import Textarea from "../../../ux/ui/Textarea";
import Modal from "../../../ux/ui/Modal";
import { emailService } from "../../../services/backoffice/emailService";
import { cvService } from "../../../services/backoffice/cvService";
import type { MessageTemplate } from "../../../types/backoffice/prospect";
import Image from "next/image";

type EntrepriseMailForm = {
  nomEntreprise: string;
  emailEntreprise: string;
  lieuEntreprise: string;
};

export default function SendCvPage() {
  const { lang } = useLanguage();
  const [form, setForm] = useState<EntrepriseMailForm>({
    nomEntreprise: "",
    emailEntreprise: "",
    lieuEntreprise: "",
  });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [templatesError, setTemplatesError] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [cvUrl, setCvUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadTemplates() {
      setTemplatesLoading(true);
      setTemplatesError(null);
      try {
        const { data } = await emailService.listInternshipTemplates(
          (lang === "fr" ? "fr" : "en") as "fr" | "en"
        );
        setTemplates(data);
      } catch (e: unknown) {
        setTemplatesError(
          e instanceof Error ? e.message : "Échec de chargement des modèles"
        );
      } finally {
        setTemplatesLoading(false);
      }
    }
    loadTemplates();
  }, [lang]);

  useEffect(() => {
    async function loadCv() {
      try {
        const { data } = await cvService.getActive();
        setCvUrl(data.file_url);
      } catch {
        setCvUrl(null);
      }
    }
    loadCv();
  }, []);

  function handleTemplateChange(value: string) {
    if (!value) {
      setSelectedTemplateId("");
      setSubject("");
      setBody("");
      return;
    }
    const id = Number(value);
    setSelectedTemplateId(id);
    const tpl = templates.find((t) => t.id === id);
    if (tpl) {
      setSubject(tpl.subject);
      setBody(tpl.body);
    }
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await emailService.sendMailEntreprise({
        nomEntreprise: form.nomEntreprise,
        emailEntreprise: form.emailEntreprise,
        lieuEntreprise: form.lieuEntreprise,
        template_id: selectedTemplateId ? Number(selectedTemplateId) : undefined,
        custom_subject: subject || undefined,
        custom_body: body || undefined,
      });
      setSuccessOpen(true);
      setForm({ nomEntreprise: "", emailEntreprise: "", lieuEntreprise: "" });
      setSelectedTemplateId("");
      setSubject("");
      setBody("");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  const canSend =
    !!form.nomEntreprise && !!form.emailEntreprise && !!form.lieuEntreprise;

  return (
    <div className="space-y-6 min-h-[calc(100vh-8rem)] flex flex-col">
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {lang === "fr" ? "Envoyer mon CV à une entreprise" : "Send my CV to a company"}
          </h1>
          <p className="mt-1 text-foreground/60 text-sm">
            {lang === "fr"
              ? "Renseignez l'entreprise, choisissez une lettre de motivation et envoyez votre CV automatiquement."
              : "Fill in the company, choose a cover letter and send your CV automatically."}
          </p>
        </div>
        <a
          href={cvUrl ?? "#"}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition-colors button-themed-border bg-white/20 text-foreground ring-1 ring-white/30 dark:ring-white/30 ring-black/30 hover:bg-white/30"
        >
          {lang === "fr" ? "Voir le CV" : "View CV"}
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 flex-1 items-stretch">
        {/* Form column */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 h-full flex flex-col gap-4">
          {error && (
            <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
              {error}
            </div>
          )}

          {/* Company info */}
          <div className="grid grid-cols-1 gap-4">
            <Input
              label={lang === "fr" ? "Nom de l'entreprise" : "Company name"}
              placeholder="Ex: ACME SA"
              value={form.nomEntreprise}
              onChange={(e) =>
                setForm((f) => ({ ...f, nomEntreprise: e.target.value }))
              }
            />
            <Input
              label={lang === "fr" ? "Email de l'entreprise" : "Company email"}
              type="email"
              placeholder="rh@acme.com"
              value={form.emailEntreprise}
              onChange={(e) =>
                setForm((f) => ({ ...f, emailEntreprise: e.target.value }))
              }
            />
            <Input
              label={lang === "fr" ? "Lieu de l'entreprise" : "Location"}
              placeholder="Ex: Paris, France"
              value={form.lieuEntreprise}
              onChange={(e) =>
                setForm((f) => ({ ...f, lieuEntreprise: e.target.value }))
              }
            />
          </div>

          {/* Template + LM */}
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {lang === "fr"
                  ? "Modèle de lettre de motivation"
                  : "Cover letter template"}
              </label>
              <select
                value={selectedTemplateId}
                onChange={(e) => handleTemplateChange(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">
                  {lang === "fr"
                    ? "Sans template (texte par défaut)"
                    : "No template (default text)"}
                </option>
                {templates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
              {templatesLoading && (
                <p className="mt-1 text-xs text-foreground/60">
                  {lang === "fr"
                    ? "Chargement des modèles..."
                    : "Loading templates..."}
                </p>
              )}
              {templatesError && (
                <p className="mt-1 text-xs text-red-400">{templatesError}</p>
              )}
            </div>

            <Input
              label={lang === "fr" ? "Sujet de l'email" : "Email subject"}
              placeholder={
                lang === "fr"
                  ? "Ex: Candidature stage développement web"
                  : "e.g. Internship application - web development"
              }
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <Textarea
              label={lang === "fr" ? "Lettre de motivation" : "Cover letter"}
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={
                lang === "fr"
                  ? "Madame, Monsieur,\n\nJe me permets de vous proposer ma candidature..."
                  : "Dear Sir or Madam,\n\nI would like to apply for..."
              }
            />
          </div>

          <div className="mt-auto pt-4 flex items-center justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setForm({
                  nomEntreprise: "",
                  emailEntreprise: "",
                  lieuEntreprise: "",
                });
                setSelectedTemplateId("");
                setSubject("");
                setBody("");
              }}
            >
              {lang === "fr" ? "Réinitialiser" : "Reset"}
            </Button>
            <Button onClick={handleSubmit} disabled={loading || !canSend}>
              {loading
                ? lang === "fr"
                  ? "Envoi…"
                  : "Sending…"
                : lang === "fr"
                ? "Envoyer"
                : "Send"}
            </Button>
          </div>
        </div>

        {/* Illustration column */}
        <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden h-full min-h-[260px]">
          <Image
            src="https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1200&auto=format&fit=crop"
            alt="Workplace illustration"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      </div>

      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title={lang === "fr" ? "CV envoyé" : "CV sent"}
        size="sm"
        footer={<Button onClick={() => setSuccessOpen(false)}>OK</Button>}
      >
        {lang === "fr"
          ? "Votre CV a été envoyé avec succès à l'entreprise."
          : "Your CV has been successfully sent to the company."}
      </Modal>
    </div>
  );
}

