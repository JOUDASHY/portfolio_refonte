"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";

type Training = {
  id: string;
  period: string; // ex: 2023 – 2024
  title: string; // ex: Formation React Avancée
  provider: string; // ex: OpenClassrooms
  detail?: string; // ex: Certificat, contenu
  updatedAt: string;
};

export default function TrainingPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Training[]>([
    { id: "1", period: "2024", title: "Next.js Performance", provider: "Vercel", detail: "Workshop avancé", updatedAt: "2025-09-20" },
    { id: "2", period: "2023 – 2024", title: "React & TypeScript", provider: "OpenClassrooms", detail: "Parcours certifiant", updatedAt: "2025-09-18" },
  ]);

  const [form, setForm] = useState<Omit<Training, "id" | "updatedAt">>({ period: "", title: "", provider: "", detail: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((t) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          t.provider.toLowerCase().includes(q) ||
          t.period.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<Training>[] = [
    { key: "period", header: "Période" },
    { key: "title", header: "Intitulé" },
    { key: "provider", header: "Organisme" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ period: "", title: "", provider: "", detail: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleSubmit() {
    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setItems((prev) => prev.map((t) => (t.id === editingId ? { ...t, ...form, updatedAt: now } : t)));
    } else {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [...prev, { id, ...form, updatedAt: now }]);
    }
    resetForm();
  }

  function handleEdit(id: string) {
    const target = items.find((t) => t.id === id);
    if (!target) return;
    const { period, title, provider, detail } = target;
    setForm({ period, title, provider, detail: detail || "" });
    setEditingId(id);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => prev.filter((t) => t.id !== deleteId));
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Formations</h1>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Rechercher…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56"
          />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ period: "", title: "", provider: "", detail: "" });
              setIsFormOpen(true);
            }}
          >
            Nouvelle formation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as Training).id}
          emptyText="Aucune formation trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as Training).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as Training).id)}>Supprimer</Button>
            </div>
          )}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier la formation" : "Ajouter une formation"}
        footer={
          <>
            {editingId ? (
              <Button variant="secondary" onClick={resetForm}>Annuler</Button>
            ) : null}
            <Button onClick={handleSubmit}>{editingId ? "Enregistrer" : "Ajouter"}</Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          <Input
            label="Période"
            placeholder="2023 – 2024"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
          />
          <Input
            label="Intitulé"
            placeholder="Formation React Avancée"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Organisme"
            placeholder="OpenClassrooms"
            value={form.provider}
            onChange={(e) => setForm((f) => ({ ...f, provider: e.target.value }))}
          />
          <Input
            label="Détail"
            placeholder="Certificat, contenu…"
            value={form.detail || ""}
            onChange={(e) => setForm((f) => ({ ...f, detail: e.target.value }))}
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
        Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



