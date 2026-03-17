"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/app/hooks/LanguageProvider";
import { useMessageTemplates } from "@/app/hooks/useProspects";
import {
  TEMPLATE_STAGE_LABELS,
  type TemplateStage,
  type MessageTemplate,
} from "@/app/types/backoffice/prospect";
import Input from "@/app/ux/ui/Input";
import Textarea from "@/app/ux/ui/Textarea";
import Button from "@/app/ux/ui/Button";
import Modal from "@/app/ux/ui/Modal";
import { toast } from "react-toastify";

type FormState = {
  id?: number;
  name: string;
  language: "fr" | "en";
  stage: TemplateStage;
  subject: string;
  body: string;
  is_default: boolean;
};

export default function ProspectTemplatesPage() {
  const { lang } = useLanguage();
  const { templates, loading, error, create, update, remove } = useMessageTemplates();

  const [languageFilter, setLanguageFilter] = useState<"all" | "fr" | "en">("all");
  const [stageFilter, setStageFilter] = useState<"all" | TemplateStage>("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<FormState | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredTemplates = useMemo(() => {
    return templates.filter((tpl) => {
      if (languageFilter !== "all" && tpl.language !== languageFilter) return false;
      if (stageFilter !== "all" && tpl.stage !== stageFilter) return false;
      return true;
    });
  }, [templates, languageFilter, stageFilter]);

  function openCreate() {
    setEditing({
      name: "",
      language: lang === "fr" ? "fr" : "en",
      stage: "initial",
      subject: "",
      body: "",
      is_default: false,
    });
    setModalOpen(true);
  }

  function openEdit(tpl: MessageTemplate) {
    setEditing({
      id: tpl.id,
      name: tpl.name,
      language: tpl.language,
      stage: tpl.stage,
      subject: tpl.subject,
      body: tpl.body,
      is_default: tpl.is_default,
    });
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSubmitting(true);
    const payload = {
      name: editing.name,
      language: editing.language,
      stage: editing.stage,
      subject: editing.subject,
      body: editing.body,
      is_default: editing.is_default,
    };
    const ok = editing.id
      ? await update(editing.id, payload)
      : await create(payload as any);
    setSubmitting(false);
    if (ok) {
      toast.success(
        lang === "fr"
          ? editing.id
            ? "Modèle mis à jour"
            : "Modèle créé"
          : editing.id
          ? "Template updated"
          : "Template created"
      );
      setModalOpen(false);
      setEditing(null);
    } else {
      toast.error(lang === "fr" ? "Échec de l'enregistrement" : "Save failed");
    }
  }

  async function handleDelete(tpl: MessageTemplate) {
    if (
      !confirm(
        lang === "fr"
          ? `Supprimer le modèle "${tpl.name}" ?`
          : `Delete template "${tpl.name}"?`
      )
    ) {
      return;
    }
    try {
      await remove(tpl.id);
      toast.success(lang === "fr" ? "Modèle supprimé" : "Template deleted");
    } catch {
      toast.error(lang === "fr" ? "Échec de la suppression" : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {lang === "fr" ? "Modèles de messages" : "Message templates"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === "fr"
              ? "Centralise tes messages de prospection (premier contact, relance, proposition, clôture)."
              : "Centralise your prospecting messages (initial contact, follow‑up, proposal, closing)."}
          </p>
        </div>
        <Button onClick={openCreate}>
          {lang === "fr" ? "Nouveau modèle" : "New template"}
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex gap-2">
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value as "all" | "fr" | "en")}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">
              {lang === "fr" ? "Toutes les langues" : "All languages"}
            </option>
            <option value="fr">FR</option>
            <option value="en">EN</option>
          </select>
          <select
            value={stageFilter}
            onChange={(e) =>
              setStageFilter((e.target.value || "all") as "all" | TemplateStage)
            }
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">
              {lang === "fr" ? "Toutes les étapes" : "All stages"}
            </option>
            {(Object.keys(TEMPLATE_STAGE_LABELS) as TemplateStage[]).map((stage) => (
              <option key={stage} value={stage}>
                {TEMPLATE_STAGE_LABELS[stage][lang === "fr" ? "fr" : "en"]}
              </option>
            ))}
          </select>
        </div>
        {loading && (
          <span className="text-sm text-foreground/60">
            {lang === "fr" ? "Chargement des modèles..." : "Loading templates..."}
          </span>
        )}
        {error && (
          <span className="text-sm text-red-500">
            {lang === "fr" ? "Erreur :" : "Error:"} {error}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredTemplates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-xl border border-white/10 bg-white/5 p-4 flex flex-col gap-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground">{tpl.name}</h2>
                  <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70">
                    {tpl.language.toUpperCase()}
                  </span>
                  <span className="text-xs rounded-full bg-white/10 px-2 py-0.5 text-foreground/70">
                    {TEMPLATE_STAGE_LABELS[tpl.stage][lang === "fr" ? "fr" : "en"]}
                  </span>
                  {tpl.is_default && (
                    <span className="text-xs rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                      {lang === "fr" ? "Par défaut" : "Default"}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-foreground/60">
                  {lang === "fr" ? "Sujet :" : "Subject:"} {tpl.subject}
                </p>
              </div>
            </div>
            <pre className="flex-1 whitespace-pre-wrap text-xs text-foreground/80 bg-black/10 rounded-lg p-2">
              {tpl.body}
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
                onClick={() => handleDelete(tpl)}
                className="text-xs px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-300"
              >
                {lang === "fr" ? "Supprimer" : "Delete"}
              </Button>
            </div>
          </div>
        ))}

        {!loading && filteredTemplates.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-white/20 bg-white/5 p-8 text-center text-sm text-foreground/60">
            {lang === "fr"
              ? "Aucun modèle pour ces filtres. Crée ton premier modèle de message pour accélérer ta prospection."
              : "No template for these filters. Create your first message template to speed up prospecting."}
          </div>
        )}
      </div>

      {modalOpen && editing && (
        <Modal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditing(null);
          }}
          title={
            editing.id
              ? lang === "fr"
                ? "Modifier le modèle"
                : "Edit template"
              : lang === "fr"
              ? "Nouveau modèle"
              : "New template"
          }
          size="lg"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={lang === "fr" ? "Nom interne du modèle" : "Internal template name"}
              value={editing.name}
              onChange={(e) =>
                setEditing((prev) => (prev ? { ...prev, name: e.target.value } : prev))
              }
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {lang === "fr" ? "Langue" : "Language"}
                </label>
                <select
                  value={editing.language}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, language: e.target.value as "fr" | "en" } : prev
                    )
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="fr">FR</option>
                  <option value="en">EN</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  {lang === "fr" ? "Étape du pipeline" : "Pipeline stage"}
                </label>
                <select
                  value={editing.stage}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, stage: e.target.value as TemplateStage } : prev
                    )
                  }
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {(Object.keys(TEMPLATE_STAGE_LABELS) as TemplateStage[]).map((stage) => (
                    <option key={stage} value={stage}>
                      {TEMPLATE_STAGE_LABELS[stage][lang === "fr" ? "fr" : "en"]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Input
              label={lang === "fr" ? "Sujet" : "Subject"}
              value={editing.subject}
              onChange={(e) =>
                setEditing((prev) =>
                  prev ? { ...prev, subject: e.target.value } : prev
                )
              }
              required
            />

            <Textarea
              label={lang === "fr" ? "Corps du message" : "Message body"}
              rows={10}
              value={editing.body}
              onChange={(e) =>
                setEditing((prev) => (prev ? { ...prev, body: e.target.value } : prev))
              }
              hint={
                lang === "fr"
                  ? "Tu peux utiliser les variables {company_name}, {contact_name}, {estimated_value}, etc."
                  : "You can use variables like {company_name}, {contact_name}, {estimated_value}, etc."
              }
              required
            />

            <label className="inline-flex items-center gap-2 text-sm text-foreground/80">
              <input
                type="checkbox"
                checked={editing.is_default}
                onChange={(e) =>
                  setEditing((prev) =>
                    prev ? { ...prev, is_default: e.target.checked } : prev
                  )
                }
                className="rounded border-gray-300"
              />
              <span>
                {lang === "fr"
                  ? "Utiliser comme modèle par défaut pour cette étape"
                  : "Use as default template for this stage"}
              </span>
            </label>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setModalOpen(false);
                  setEditing(null);
                }}
              >
                {lang === "fr" ? "Annuler" : "Cancel"}
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? lang === "fr"
                    ? "Enregistrement..."
                    : "Saving..."
                  : lang === "fr"
                  ? "Enregistrer"
                  : "Save"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

