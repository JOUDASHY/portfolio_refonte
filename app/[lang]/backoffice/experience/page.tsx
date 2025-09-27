"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";

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
  const [items, setItems] = useState<Experience[]>([
    {
      id: "1",
      period: "2024 – Présent",
      title: "Développeur Full‑Stack",
      company: "Startup Exemple",
      summary: "Conception et développement d'applications Next.js/Node avec CI/CD.",
      stack: ["Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma"],
      updatedAt: "2025-09-20",
    },
    {
      id: "2",
      period: "2022 – 2024",
      title: "Développeur Front‑End",
      company: "Agence Web",
      summary: "Intégration d'interfaces responsives et optimisation performance.",
      stack: ["React", "Tailwind", "Vite"],
      updatedAt: "2025-09-18",
    },
  ]);

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

  function handleSubmit() {
    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setItems((prev) =>
        prev.map((e) => (e.id === editingId ? { ...e, ...form, updatedAt: now } : e))
      );
    } else {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [...prev, { id, ...form, updatedAt: now }]);
    }
    resetForm();
  }

  function handleEdit(id: string) {
    const target = items.find((e) => e.id === id);
    if (!target) return;
    const { period, title, company, summary, stack } = target;
    setForm({ period, title, company, summary, stack: stack || [] });
    setEditingId(id);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => prev.filter((e) => e.id !== deleteId));
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
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

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
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


