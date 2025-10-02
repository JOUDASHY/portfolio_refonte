"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import { useBackofficeExperiences } from "../../../hooks/useBackofficeExperiences";

type Experience = {
  id: string;
  period: string;
  title: string;
  company: string;
  summary?: string;
  stack?: string[];
  updatedAt: string;
};

export default function ExperiencePage() {
  const [query, setQuery] = useState("");
  const { items, loading, error, setError, create, update, remove } = useBackofficeExperiences();

  const [form, setForm] = useState<Omit<Experience, "id" | "updatedAt">>({
    period: "",
    title: "",
    company: "",
    summary: "",
    stack: [],
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((e) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          e.title.toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q) ||
          e.period.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<Experience>[] = [
    { key: "period", header: "Période" },
    { key: "title", header: "Titre" },
    { key: "company", header: "Société" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ period: "", title: "", company: "", summary: "", stack: [] });
    setEditingId(null);
    setIsFormOpen(false);
  }


  async function handleSubmit() {
    try {
      if (editingId) {
        await update(editingId, form);
      } else {
        await create(form);
      }
      resetForm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de l'enregistrement");
    }
  }

  function handleEdit(id: string) {
    const target = items.find((e) => e.id === id);
    if (!target) return;
    const { period, title, company, summary, stack } = target;
    setForm({ period, title, company, summary, stack: stack || [] });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Expériences</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ period: "", title: "", company: "", summary: "", stack: [] });
              setIsFormOpen(true);
            }}
          >
            Nouvelle expérience
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={loading ? [] : filtered}
          rowKey={(row) => (row as Experience).id}
          emptyText="Aucune expérience trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as Experience).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as Experience).id)}>Supprimer</Button>
            </div>
          )}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier l'expérience" : "Ajouter une expérience"}
        footer={
          <>
            <Button variant="secondary" onClick={resetForm}>Annuler</Button>
            <Button onClick={handleSubmit}>{editingId ? "Enregistrer" : "Ajouter"}</Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          <Input
            label="Période"
            placeholder="2024 – Présent"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
          />
          <Input
            label="Titre"
            placeholder="Développeur Full‑Stack"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Société"
            placeholder="Startup Exemple"
            value={form.company}
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
          />
          <Input
            label="Résumé"
            placeholder="Description courte…"
            value={form.summary || ""}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
          />
          <Input
            label="Stack (séparée par des virgules)"
            placeholder="Next.js, TypeScript, Node.js"
            value={(form.stack || []).join(", ")}
            onChange={(e) =>
              setForm((f) => ({ ...f, stack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) }))
            }
          />
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Confirmer la suppression"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteId(null)}>Annuler</Button>
            <Button onClick={confirmDelete}>Supprimer</Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer cette expérience ? Cette action est irréversible.
      </Modal>
    </div>
  );
}


