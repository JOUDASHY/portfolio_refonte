"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/app/ux/ui/Button";
import Input from "@/app/ux/ui/Input";
import Textarea from "@/app/ux/ui/Textarea";
import { useProspects, useMessageTemplates } from "@/app/hooks/useProspects";
import { prospectService } from "@/app/services/backoffice/prospectService";
import {
  PROSPECT_STATUS_LABELS,
  PROSPECT_SOURCE_LABELS,
  TEMPLATE_STAGE_LABELS,
  type TemplateStage,
  type ProspectMessage,
} from "@/app/types/backoffice/prospect";
import { useLanguage } from "@/app/hooks/LanguageProvider";

export default function ProspectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { t, lang } = useLanguage();
  const prospectId = parseInt(params.id as string);
  
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    google_maps_url: "",
    website_url: "",
    has_website: false,
    has_facebook: false,
    estimated_value: 0,
    source: "google_maps" as any,
    status: "new" as any,
    notes: "",
  });

  const { getDetail, update, remove } = useProspects();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [messages, setMessages] = useState<ProspectMessage[]>([]);
  const [selectedStage, setSelectedStage] = useState<TemplateStage>("initial");
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | "">("");
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
  } = useMessageTemplates();

  useEffect(() => {
    async function load() {
      const data = await getDetail(prospectId);
      if (data) {
        setForm({
          company_name: data.company_name || "",
          contact_name: data.contact_name || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || "",
          city: data.city || "",
          google_maps_url: data.google_maps_url || "",
          website_url: data.website_url || "",
          has_website: data.has_website || false,
          has_facebook: data.has_facebook || false,
          estimated_value: parseFloat(data.estimated_value) || 0,
          source: data.source,
          status: data.status,
          notes: data.notes?.map((n) => n.content).join("\n") || "",
        });
        setMessages(data.messages || []);
      }
      setLoading(false);
    }
    load();
  }, [prospectId, getDetail]);

  async function handlePreview() {
    if (!selectedTemplateId) {
      return;
    }
    setPreviewLoading(true);
    try {
      const { data } = await prospectService.previewMessage(prospectId, Number(selectedTemplateId));
      setMessageSubject(data.subject);
      setMessageBody(data.body);
    } catch {
      // laisser les champs tels quels en cas d'erreur
    } finally {
      setPreviewLoading(false);
    }
  }

  async function handleSendMessage() {
    if (!messageSubject.trim() || !messageBody.trim()) {
      alert(lang === "fr" ? "Sujet et message obligatoires" : "Subject and message are required");
      return;
    }
    setSending(true);
    try {
      const { data } = await prospectService.sendMessage(prospectId, {
        template_id: selectedTemplateId ? Number(selectedTemplateId) : undefined,
        subject: messageSubject,
        body: messageBody,
      });
      setMessages((prev) => [data, ...prev]);
      setMessageSubject("");
      setMessageBody("");
      alert(lang === "fr" ? "Message enregistré dans l'historique" : "Message logged for this prospect");
    } catch {
      alert(lang === "fr" ? "Échec de l'envoi du message" : "Failed to send message");
    } finally {
      setSending(false);
    }
  }

  async function handleSubmit() {
    setSaving(true);
    try {
      await update(prospectId, form);
      alert(lang === "fr" ? "Prospect mis à jour avec succès" : "Prospect updated successfully");
    } catch (e) {
      alert(lang === "fr" ? "Échec de la mise à jour" : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm(lang === "fr" ? "Êtes-vous sûr ?" : "Are you sure?")) return;
    try {
      await remove(prospectId);
      router.push("/backoffice/prospects");
    } catch (e) {
      alert(lang === "fr" ? "Échec de la suppression" : "Delete failed");
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-white/10 rounded"></div>
          <div className="h-4 w-full bg-white/10 rounded"></div>
          <div className="h-4 w-3/4 bg-white/10 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">{form.company_name}</h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === "fr" ? "Modifier les informations" : "Edit information"}
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/backoffice/prospects")}>
          {lang === "fr" ? "Retour" : "Back"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Main Info */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Input
            label={lang === "fr" ? "Entreprise" : "Company"}
            value={form.company_name}
            onChange={(e) => setForm((f) => ({ ...f, company_name: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Contact" : "Contact Name"}
            value={form.contact_name}
            onChange={(e) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Téléphone" : "Phone"}
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Adresse" : "Address"}
            value={form.address}
            onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Ville" : "City"}
            value={form.city}
            onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </div>

        {/* Additional Info */}
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Input
            label="Google Maps URL"
            value={form.google_maps_url}
            onChange={(e) => setForm((f) => ({ ...f, google_maps_url: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Site web" : "Website"}
            value={form.website_url}
            onChange={(e) => setForm((f) => ({ ...f, website_url: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Statut" : "Status"}
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {(Object.keys(PROSPECT_STATUS_LABELS) as Array<keyof typeof PROSPECT_STATUS_LABELS>).map((status) => (
                <option key={status} value={status}>
                  {PROSPECT_STATUS_LABELS[status][lang === "fr" ? "fr" : "en"]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Source" : "Source"}
            </label>
            <select
              value={form.source}
              onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(PROSPECT_SOURCE_LABELS).map(([key, labels]) => (
                <option key={key} value={key}>
                  {labels[lang === "fr" ? "fr" : "en"]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={lang === "fr" ? "Valeur estimée (€)" : "Estimated Value (€)"}
            type="number"
            value={form.estimated_value}
            onChange={(e) => setForm((f) => ({ ...f, estimated_value: parseFloat(e.target.value) || 0 }))}
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.has_website}
                onChange={(e) => setForm((f) => ({ ...f, has_website: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">
                {lang === "fr" ? "A un site web" : "Has website"}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.has_facebook}
                onChange={(e) => setForm((f) => ({ ...f, has_facebook: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">
                {lang === "fr" ? "A Facebook" : "Has Facebook"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleSubmit} disabled={saving}>
          {saving
            ? lang === "fr"
              ? "Enregistrement..."
              : "Saving..."
            : lang === "fr"
            ? "Enregistrer"
            : "Save"}
        </Button>
        <Button variant="secondary" onClick={handleDelete}>
          {lang === "fr" ? "Supprimer" : "Delete"}
        </Button>
      </div>

      {/* Communication & messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {lang === "fr" ? "Contacter ce prospect" : "Contact this prospect"}
          </h2>
          <p className="text-sm text-foreground/60">
            {lang === "fr"
              ? "Utilise un modèle de message pour envoyer un email, une proposition ou une relance. Le système enregistre surtout l'historique de tes messages."
              : "Use a message template to send an email, proposal or follow‑up. The system mainly logs your communication history."}
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {lang === "fr" ? "Étape du pipeline" : "Pipeline stage"}
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => {
                    const stage = e.target.value as TemplateStage;
                    setSelectedStage(stage);
                    // réinitialiser le template choisi si il ne correspond plus
                    setSelectedTemplateId("");
                  }}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(Object.keys(TEMPLATE_STAGE_LABELS) as TemplateStage[]).map((stage) => (
                    <option key={stage} value={stage}>
                      {TEMPLATE_STAGE_LABELS[stage][lang === "fr" ? "fr" : "en"]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {lang === "fr" ? "Modèle de message" : "Message template"}
                </label>
                <select
                  value={selectedTemplateId}
                  onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">
                    {lang === "fr" ? "Sans modèle (message libre)" : "No template (custom message)"}
                  </option>
                  {templates
                    .filter(
                      (tpl) =>
                        tpl.stage === selectedStage &&
                        tpl.language === (lang === "fr" ? "fr" : "en")
                    )
                    .map((tpl) => (
                      <option key={tpl.id} value={tpl.id}>
                        {tpl.name} — {tpl.language.toUpperCase()}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {templatesLoading && (
              <p className="text-xs text-foreground/60">
                {lang === "fr" ? "Chargement des modèles..." : "Loading templates..."}
              </p>
            )}
            {templatesError && (
              <p className="text-xs text-red-500">
                {lang === "fr" ? "Erreur de chargement des modèles" : "Failed to load templates"}
              </p>
            )}

            <div className="flex gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={handlePreview}
                disabled={!selectedTemplateId || previewLoading}
              >
                {previewLoading
                  ? lang === "fr"
                    ? "Prévisualisation..."
                    : "Previewing..."
                  : lang === "fr"
                  ? "Prévisualiser avec les données du prospect"
                  : "Preview with prospect data"}
              </Button>
            </div>

            <Input
              label={lang === "fr" ? "Sujet du message" : "Message subject"}
              value={messageSubject}
              onChange={(e) => setMessageSubject(e.target.value)}
              placeholder={
                lang === "fr"
                  ? "Ex: Création de site web pour Restaurant Chez Mario"
                  : "E.g. Website creation for Restaurant Chez Mario"
              }
            />

            <Textarea
              label={lang === "fr" ? "Contenu du message" : "Message content"}
              rows={8}
              value={messageBody}
              onChange={(e) => setMessageBody(e.target.value)}
              placeholder={
                lang === "fr"
                  ? "Bonjour {contact_name}..."
                  : "Hello {contact_name}..."
              }
            />

            <div className="flex justify-end">
              <Button type="button" onClick={handleSendMessage} disabled={sending}>
                {sending
                  ? lang === "fr"
                    ? "Envoi..."
                    : "Sending..."
                  : lang === "fr"
                  ? "Enregistrer ce message"
                  : "Log this message"}
              </Button>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">
            {lang === "fr" ? "Historique des messages" : "Message history"}
          </h2>
          {messages.length === 0 ? (
            <p className="text-sm text-foreground/60">
              {lang === "fr"
                ? "Aucun message enregistré pour ce prospect pour l’instant."
                : "No messages have been logged for this prospect yet."}
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-auto">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="rounded-lg border border-white/10 bg-black/10 p-3 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-medium">{m.subject}</div>
                    <span className="text-xs text-foreground/60">
                      {new Date(m.created_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
                    </span>
                  </div>
                  <div className="text-xs text-foreground/60">
                    {lang === "fr" ? "Statut :" : "Status:"} {m.status}
                    {m.sent_at && (
                      <>
                        {" "}
                        •{" "}
                        {lang === "fr" ? "envoyé le" : "sent on"}{" "}
                        {new Date(m.sent_at).toLocaleString(lang === "fr" ? "fr-FR" : "en-US")}
                      </>
                    )}
                  </div>
                  <pre className="mt-1 whitespace-pre-wrap text-foreground/80 text-xs">
                    {m.body}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
