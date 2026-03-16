"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "@/app/ux/ui/Button";
import Input from "@/app/ux/ui/Input";
import Textarea from "@/app/ux/ui/Textarea";
import Modal from "@/app/ux/ui/Modal";
import { useLanguage } from "@/app/hooks/LanguageProvider";
import { prospectService } from "@/app/services/backoffice/prospectService";
import {
  TEMPLATE_STAGE_LABELS,
  type CreateTemplatePayload,
  type MessageTemplate,
  type TemplateStage,
} from "@/app/types/backoffice/prospect";

type UsageType = "prospecting" | "internship";

const STAGES: TemplateStage[] = [
  "initial",
  "follow_up",
  "proposal",
  "closing",
  "thank_you",
  "acceptance",
];

function isUsageType(value: string): value is UsageType {
  return value === "prospecting" || value === "internship";
}

export default function TemplatesPage() {
  const { lang } = useLanguage();

  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  function cleanTemplateText(text: string | null | undefined): string {
    // Fix common mojibake: checkmarks, euro, quotes, plus generic UTF-8/latin1 issues.
    const fixed = fixMisencodedUtf8(text);
    return fixed
      .replaceAll("\uFFFD", "") // � replacement char
      .replaceAll("âœ…", "✅")
      .replaceAll("âœ”", "✔")
      .replaceAll("â€¢", "•")
      .replaceAll("â‚¬", "€")
      .replaceAll("â€™", "’")
      .replaceAll("â€œ", "“")
      .replaceAll("â€", "”")
      .replaceAll("â€“", "–")
      .replaceAll("â€”", "—")
      .replace(/\s{3,}/g, "  ")
      .normalize("NFC");
  }

  const [filterLanguage, setFilterLanguage] = useState<"" | "fr" | "en">("");
  const [filterStage, setFilterStage] = useState<"" | TemplateStage>("");
  const [filterUsageType, setFilterUsageType] = useState<"" | UsageType>("");
  const [filterIsDefault, setFilterIsDefault] = useState<"" | "true" | "false">("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<MessageTemplate | null>(null);

  const [name, setName] = useState("");
  const [language, setLanguage] = useState<"fr" | "en">("fr");
  const [stage, setStage] = useState<TemplateStage>("initial");
  const [usageType, setUsageType] = useState<UsageType>("prospecting");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [coverLetterHtml, setCoverLetterHtml] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const canEditCoverLetter = usageType === "internship";

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      if (filterLanguage && tpl.language !== filterLanguage) return false;
      if (filterStage && tpl.stage !== filterStage) return false;
      if (filterUsageType && tpl.usage_type !== filterUsageType) return false;
      if (filterIsDefault === "true" && !tpl.is_default) return false;
      if (filterIsDefault === "false" && tpl.is_default) return false;
      return true;
    });
  }, [templates, filterIsDefault, filterLanguage, filterStage, filterUsageType]);

  const listParams = useMemo(() => {
    return {
      language: filterLanguage || undefined,
      stage: filterStage || undefined,
      usage_type: filterUsageType || undefined,
      is_default:
        filterIsDefault === ""
          ? undefined
          : filterIsDefault === "true"
          ? true
          : false,
    };
  }, [filterIsDefault, filterLanguage, filterStage, filterUsageType]);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await prospectService.listTemplates(listParams);
      setTemplates(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listParams]);

  function openCreate() {
    setEditing(null);
    setName("");
    setLanguage(lang === "fr" ? "fr" : "en");
    setStage("initial");
    setUsageType("prospecting");
    setSubject("");
    setBody("");
    setCoverLetterHtml("");
    setIsDefault(false);
    setEditorOpen(true);
  }

  function openEdit(tpl: MessageTemplate) {
    setEditing(tpl);
    setName(cleanTemplateText(tpl.name || ""));
    setLanguage(tpl.language);
    setStage(tpl.stage);
    setUsageType(isUsageType(tpl.usage_type || "") ? (tpl.usage_type as UsageType) : "prospecting");
    setSubject(cleanTemplateText(tpl.subject || ""));
    setBody(cleanTemplateText(tpl.body || ""));
    setCoverLetterHtml(cleanTemplateText(tpl.cover_letter_html?.toString() || ""));
    setIsDefault(!!tpl.is_default);
    setEditorOpen(true);
  }

  async function saveTemplate() {
    setLoading(true);
    setError(null);
    const payload: CreateTemplatePayload = {
      name: name.trim(),
      language,
      stage,
      usage_type: usageType,
      subject: subject,
      body: body,
      cover_letter_html: canEditCoverLetter ? (coverLetterHtml || "") : "",
      is_default: isDefault,
    };

    if (!payload.name) {
      setError(lang === "fr" ? "Le nom est obligatoire" : "Name is required");
      setLoading(false);
      return;
    }

    try {
      if (editing) {
        // Use PATCH to avoid needing full payload compatibility server-side
        await prospectService.patchTemplate(editing.id, payload);
      } else {
        await prospectService.createTemplate(payload);
      }
      setEditorOpen(false);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de sauvegarde");
    } finally {
      setLoading(false);
    }
  }

  async function deleteTemplate(tpl: MessageTemplate) {
    if (tpl.is_default) {
      alert(lang === "fr" ? "Impossible de supprimer un template système" : "Cannot delete system template");
      return;
    }
    if (!confirm(lang === "fr" ? `Supprimer "${tpl.name}" ?` : `Delete "${tpl.name}"?`)) return;
    setLoading(true);
    setError(null);
    try {
      await prospectService.deleteTemplate(tpl.id);
      await refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de suppression");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {lang === "fr" ? "Templates de messages" : "Message templates"}
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            {lang === "fr"
              ? "Créer, modifier et supprimer vos templates (email + stage, et LM PDF pour internship)."
              : "Create, edit and delete templates (email + stage, and PDF cover letter for internship)."}
          </p>
        </div>
        <Button onClick={openCreate}>{lang === "fr" ? "Nouveau" : "New"}</Button>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
          {error}
        </div>
      ) : null}

      <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Langue" : "Language"}
            </label>
            <select
              value={filterLanguage}
              onChange={(e) => setFilterLanguage(e.target.value as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{lang === "fr" ? "Toutes" : "All"}</option>
              <option value="fr">FR</option>
              <option value="en">EN</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Étape" : "Stage"}
            </label>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage((e.target.value || "") as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{lang === "fr" ? "Toutes" : "All"}</option>
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Type" : "Type"}
            </label>
            <select
              value={filterUsageType}
              onChange={(e) => setFilterUsageType((e.target.value || "") as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{lang === "fr" ? "Tous" : "All"}</option>
              <option value="prospecting">{lang === "fr" ? "Prospection" : "Prospecting"}</option>
              <option value="internship">{lang === "fr" ? "Stage" : "Internship"}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Système" : "System"}
            </label>
            <select
              value={filterIsDefault}
              onChange={(e) => setFilterIsDefault((e.target.value || "") as any)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">{lang === "fr" ? "Tous" : "All"}</option>
              <option value="true">{lang === "fr" ? "Système" : "System"}</option>
              <option value="false">{lang === "fr" ? "Perso" : "Custom"}</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-foreground/60">
            {loading
              ? lang === "fr"
                ? "Chargement..."
                : "Loading..."
              : `${templates.length} template(s)`}
          </p>
          <Button variant="secondary" onClick={refresh} disabled={loading}>
            {lang === "fr" ? "Rafraîchir" : "Refresh"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-foreground">{tpl.name}</h2>
                  <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70 ring-1 ring-blue-500/20">
                    {tpl.language.toUpperCase()}
                  </span>
                  {tpl.stage && TEMPLATE_STAGE_LABELS[tpl.stage] && (
                    <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70 ring-1 ring-yellow-500/20">
                      {TEMPLATE_STAGE_LABELS[tpl.stage][lang === "fr" ? "fr" : "en"]}
                    </span>
                  )}
                  {tpl.usage_type && (
                    <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70 ring-1 ring-blue-500/20">
                      {tpl.usage_type}
                    </span>
                  )}
                  {tpl.is_default && (
                    <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70 ring-1 ring-yellow-500/20">
                      {lang === "fr" ? "Par défaut" : "Default"}
                    </span>
                  )}
                  {tpl.usage_type === "internship" && tpl.cover_letter_html && (
                    <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70 ring-1 ring-blue-500/20">
                      {lang === "fr" ? "LM PDF" : "PDF LM"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-foreground/60">
                  {lang === "fr" ? "Sujet :" : "Subject:"} {cleanTemplateText(tpl.subject)}
                </p>
              </div>
            </div>
            <pre className="flex-1 whitespace-pre-wrap text-xs text-foreground/80 bg-black/10 rounded-lg p-2">
              {cleanTemplateText(tpl.body)}
            </pre>
            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="secondary"
                onClick={() => openEdit(tpl)}
                className="text-xs px-3 py-1.5"
              >
                {lang === "fr" ? "Modifier" : "Edit"}
              </Button>
              <Button
                variant="secondary"
                onClick={() => deleteTemplate(tpl)}
                className="text-xs px-3 py-1.5"
                disabled={tpl.is_default}
              >
                {lang === "fr" ? "Supprimer" : "Delete"}
              </Button>
            </div>
          </div>
        ))}

        {!loading && filteredTemplates.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-foreground/60">
            {lang === "fr"
              ? "Aucun template pour ces filtres."
              : "No templates for these filters."}
          </div>
        )}
      </div>

      <Modal
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title={
          editing
            ? lang === "fr"
              ? "Modifier un template"
              : "Edit template"
            : lang === "fr"
            ? "Créer un template"
            : "Create template"
        }
        size="xl"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditorOpen(false)}>
              {lang === "fr" ? "Annuler" : "Cancel"}
            </Button>
            <Button onClick={saveTemplate} disabled={loading}>
              {lang === "fr" ? "Sauvegarder" : "Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label={lang === "fr" ? "Nom" : "Name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                {lang === "fr" ? "Langue" : "Language"}
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="fr">FR</option>
                <option value="en">EN</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                {lang === "fr" ? "Étape" : "Stage"}
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {STAGES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy mb-1">
                {lang === "fr" ? "Type" : "Type"}
              </label>
              <select
                value={usageType}
                onChange={(e) => setUsageType(e.target.value as any)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="prospecting">{lang === "fr" ? "Prospection" : "Prospecting"}</option>
                <option value="internship">{lang === "fr" ? "Stage" : "Internship"}</option>
              </select>
            </div>

            <label className="flex items-center gap-2 text-sm text-navy mt-7">
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
              />
              <span>{lang === "fr" ? "Template système (is_default)" : "System template (is_default)"}</span>
            </label>
          </div>

          <Input
            label={lang === "fr" ? "Sujet" : "Subject"}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          <Textarea
            label={lang === "fr" ? "Message email (body)" : "Email body"}
            rows={8}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />

          {canEditCoverLetter ? (
            <Textarea
              label={lang === "fr" ? "LM PDF (cover_letter_html)" : "PDF cover letter (cover_letter_html)"}
              rows={10}
              value={coverLetterHtml}
              onChange={(e) => setCoverLetterHtml(e.target.value)}
              placeholder="<!DOCTYPE html>..."
            />
          ) : null}

          {!canEditCoverLetter ? (
            <p className="text-xs text-navy/60">
              {lang === "fr"
                ? "La lettre de motivation PDF est disponible uniquement pour usage_type = internship."
                : "PDF cover letter is only available when usage_type = internship."}
            </p>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}

