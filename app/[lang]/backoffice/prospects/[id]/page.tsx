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

  function fixMisencodedUtf8(text: string | null | undefined): string {
    if (!text) return "";
    if (!/[ÃÂ]/.test(text)) return text;
    try {
      const bytes = Uint8Array.from(Array.from(text, (ch) => ch.charCodeAt(0)));
      return new TextDecoder("utf-8").decode(bytes);
    } catch {
      return text;
    }
  }

  function cleanMessageText(text: string | null | undefined): string {
    const fixed = fixMisencodedUtf8(text);
    // Replace common "unknown character" replacement symbol and mojibake bullets
    // NOTE: If the original bytes were already lost and replaced by �, we can't recover them.
    return fixed
      .replaceAll("\uFFFD", "") // � replacement char
      .replaceAll("�S&", "•")
      .replaceAll("�", "")
      .replace(/\s{3,}/g, "  ")
      .normalize("NFC");
  }

  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    whatsapp_phone: "",
    facebook_url: "",
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
  const [contactChannels, setContactChannels] = useState<{
    email: boolean;
    whatsapp: boolean;
    facebook: boolean;
  }>({ email: true, whatsapp: false, facebook: false });

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
          whatsapp_phone: (data as any).whatsapp_phone || "",
          facebook_url: (data as any).facebook_url || "",
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
        setMessages(
          (data.messages || []).map((m) => ({
            ...m,
            subject: cleanMessageText(m.subject),
            body: cleanMessageText(m.body),
          }))
        );
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
      setMessageSubject(cleanMessageText(data.subject));
      setMessageBody(cleanMessageText(data.body));
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
    const selected = Object.entries(contactChannels)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length === 0) {
      alert(lang === "fr" ? "Choisis au moins un canal" : "Select at least one channel");
      return;
    }

    const subject = cleanMessageText(messageSubject).trim();
    const body = cleanMessageText(messageBody).trim();

    // 1) Email = backend send/log
    if (contactChannels.email) {
      setSending(true);
      try {
        const { data } = await prospectService.sendMessage(prospectId, {
          template_id: selectedTemplateId ? Number(selectedTemplateId) : undefined,
          channel: "email",
          subject,
          body,
        });
        setMessages((prev) => [
          {
            ...data,
            subject: cleanMessageText(data.subject),
            body: cleanMessageText(data.body),
          },
          ...prev,
        ]);
      } catch {
        alert(lang === "fr" ? "Échec de l'envoi email" : "Failed to send email");
      } finally {
        setSending(false);
      }
    }

    // 2) WhatsApp = redirect (manual)
    if (contactChannels.whatsapp) {
      const phone = normalizePhoneForWaMe(form.whatsapp_phone || form.phone || "");
      if (!phone) {
        alert(lang === "fr" ? "Téléphone/WhatsApp manquant" : "Phone/WhatsApp is missing");
      } else {
        const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`;
        window.open(wa, "_blank", "noopener,noreferrer");
      }
    }

    // 3) Facebook = redirect (manual)
    if (contactChannels.facebook) {
      const fbUrl =
        form.facebook_url?.trim() ||
        extractFacebookUrl(form.google_maps_url, form.website_url, form.notes);
      if (!fbUrl) {
        alert(
          lang === "fr"
            ? "Lien Facebook introuvable (mets-le dans Google Maps URL / Site web / Notes)"
            : "Facebook link not found (put it in Google Maps URL / Website / Notes)"
        );
      } else {
        const messengerUrl = getMessengerUrlFromFacebookUrl(fbUrl);
        void copyToClipboardWithFallback(`${subject}\n\n${body}`).then(() => {
          alert(
            lang === "fr"
              ? "Message copié. Ouveture de Messenger: collez avec Ctrl+V."
              : "Message copied. Opening Messenger: paste with Ctrl+V."
          );
          window.open(messengerUrl, "_blank", "noopener,noreferrer");
        });
      }
    }

    // Clear editor (we keep history intact)
    setMessageSubject("");
    setMessageBody("");
    if (contactChannels.email) {
      alert(lang === "fr" ? "Email envoyé (si coché) + redirections ouvertes" : "Email sent (if checked) + redirects opened");
    }
  }

  function extractFacebookUrl(...candidates: Array<string | null | undefined>): string | null {
    for (const raw of candidates) {
      if (!raw) continue;
      const match = raw.match(/https?:\/\/(?:www\.)?(facebook\.com|fb\.watch)\/[^\s)"]+/i);
      if (match) return match[0];
      if (/facebook\.com|fb\.watch/i.test(raw) && raw.startsWith("http")) return raw;
    }
    return null;
  }

  function normalizePhoneForWaMe(phone: string): string {
    // Keep digits only. wa.me expects international format without "+" or spaces.
    return phone.replace(/[^\d]/g, "");
  }

  function getMessengerUrlFromFacebookUrl(fbUrl: string): string {
    try {
      const url = new URL(fbUrl);
      const host = url.hostname.replace(/^www\./, "").toLowerCase();
      if (host === "facebook.com") {
        const path = url.pathname.replace(/^\/+/, "");
        const username = path.split("/")[0];
        if (username && !["pages", "profile.php"].includes(username)) {
          return `https://m.me/${username}`;
        }
      }
      return fbUrl;
    } catch {
      return fbUrl;
    }
  }

  async function copyToClipboardWithFallback(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt(
        lang === "fr"
          ? "Copiez ce message (Ctrl+C), puis collez-le dans Messenger (Ctrl+V) :"
          : "Copy this message (Ctrl+C), then paste it in Messenger (Ctrl+V):",
        text
      );
    }
  }

  function openContactRedirects() {
    const subject = cleanMessageText(messageSubject).trim();
    const body = cleanMessageText(messageBody).trim();

    if (!subject || !body) {
      alert(lang === "fr" ? "Sujet et message obligatoires" : "Subject and message are required");
      return;
    }

    const selected = Object.entries(contactChannels)
      .filter(([, v]) => v)
      .map(([k]) => k);

    if (selected.length === 0) {
      alert(lang === "fr" ? "Choisis au moins un canal" : "Select at least one channel");
      return;
    }

    if (contactChannels.email) {
      if (!form.email?.trim()) {
        alert(lang === "fr" ? "Email du prospect manquant" : "Prospect email is missing");
      } else {
        const mailto = `mailto:${encodeURIComponent(form.email.trim())}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        window.open(mailto, "_blank", "noopener,noreferrer");
      }
    }

    if (contactChannels.whatsapp) {
      const phone = normalizePhoneForWaMe(form.whatsapp_phone || form.phone || "");
      if (!phone) {
        alert(lang === "fr" ? "Téléphone/WhatsApp manquant" : "Phone/WhatsApp is missing");
      } else {
        const wa = `https://wa.me/${phone}?text=${encodeURIComponent(`${subject}\n\n${body}`)}`;
        window.open(wa, "_blank", "noopener,noreferrer");
      }
    }

    if (contactChannels.facebook) {
      const fbUrl =
        form.facebook_url?.trim() ||
        extractFacebookUrl(form.google_maps_url, form.website_url, form.notes);
      if (!fbUrl) {
        alert(
          lang === "fr"
            ? "Lien Facebook introuvable (mets-le dans Google Maps URL / Site web / Notes)"
            : "Facebook link not found (put it in Google Maps URL / Website / Notes)"
        );
      } else {
        const messengerUrl = getMessengerUrlFromFacebookUrl(fbUrl);
        void copyToClipboardWithFallback(`${subject}\n\n${body}`).then(() => {
          alert(
            lang === "fr"
              ? "Message copié. Ouveture de Messenger: collez avec Ctrl+V."
              : "Message copied. Opening Messenger: paste with Ctrl+V."
          );
          window.open(messengerUrl, "_blank", "noopener,noreferrer");
        });
      }
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
            label={lang === "fr" ? "WhatsApp (optionnel)" : "WhatsApp (optional)"}
            placeholder={lang === "fr" ? "Ex: +261 34 12 345 67" : "e.g. +261 34 12 345 67"}
            value={form.whatsapp_phone}
            onChange={(e) => setForm((f) => ({ ...f, whatsapp_phone: e.target.value }))}
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
            label={lang === "fr" ? "Facebook URL (optionnel)" : "Facebook URL (optional)"}
            placeholder="https://facebook.com/..."
            value={form.facebook_url}
            onChange={(e) => setForm((f) => ({ ...f, facebook_url: e.target.value }))}
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

            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap gap-3 text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactChannels.email}
                    onChange={(e) =>
                      setContactChannels((c) => ({ ...c, email: e.target.checked }))
                    }
                  />
                  <span>{lang === "fr" ? "Email" : "Email"}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactChannels.whatsapp}
                    onChange={(e) =>
                      setContactChannels((c) => ({ ...c, whatsapp: e.target.checked }))
                    }
                  />
                  <span>{lang === "fr" ? "WhatsApp" : "WhatsApp"}</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={contactChannels.facebook}
                    onChange={(e) =>
                      setContactChannels((c) => ({ ...c, facebook: e.target.checked }))
                    }
                  />
                  <span>{lang === "fr" ? "Facebook" : "Facebook"}</span>
                </label>
              </div>

              <div className="text-xs text-foreground/60">
                {lang === "fr"
                  ? "Email = envoi automatique. WhatsApp/Facebook = redirection manuelle."
                  : "Email = automatic send. WhatsApp/Facebook = manual redirect."}
              </div>

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
                    <div className="font-medium">{cleanMessageText(m.subject)}</div>
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
                    {cleanMessageText(m.body)}
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
