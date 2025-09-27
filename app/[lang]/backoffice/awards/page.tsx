"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";

type Award = {
  id: string;
  year: string;
  title: string;
  organization: string;
  description?: string;
  updatedAt: string;
};

export default function AwardsPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Award[]>([
    {
      id: "1",
      year: "2023",
      title: "Meilleur Projet Web",
      organization: "Tech Conference Madagascar",
      description: "Récompense pour l'innovation en développement web",
      updatedAt: "2025-09-20",
    },
    {
      id: "2",
      year: "2022",
      title: "Certification AWS",
      organization: "Amazon Web Services",
      description: "Solutions Architect Associate",
      updatedAt: "2025-09-18",
    },
  ]);

  const [form, setForm] = useState<Omit<Award, "id" | "updatedAt">>({
    year: "",
    title: "",
    organization: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((a) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          a.organization.toLowerCase().includes(q) ||
          a.year.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<Award>[] = [
    { key: "year", header: "Année" },
    { key: "title", header: "Titre" },
    { key: "organization", header: "Organisation" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ year: "", title: "", organization: "", description: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleSubmit() {
    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setItems((prev) => prev.map((a) => (a.id === editingId ? { ...a, ...form, updatedAt: now } : a)));
    } else {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [...prev, { id, ...form, updatedAt: now }]);
    }
    resetForm();
  }

  function handleEdit(id: string) {
    const target = items.find((a) => a.id === id);
    if (!target) return;
    const { year, title, organization, description } = target;
    setForm({ year, title, organization, description: description || "" });
    setEditingId(id);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => prev.filter((a) => a.id !== deleteId));
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Récompenses</h1>
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
              setForm({ year: "", title: "", organization: "", description: "" });
              setIsFormOpen(true);
            }}
          >
            Nouvelle récompense
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as Award).id}
          emptyText="Aucune récompense trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as Award).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as Award).id)}>Supprimer</Button>
            </div>
          )}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier la récompense" : "Ajouter une récompense"}
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
            label="Année"
            placeholder="2023"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
          />
          <Input
            label="Titre"
            placeholder="Meilleur Projet Web"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Organisation"
            placeholder="Tech Conference Madagascar"
            value={form.organization}
            onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
          />
          <Input
            label="Description"
            placeholder="Détails de la récompense…"
            value={form.description || ""}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
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
        Êtes-vous sûr de vouloir supprimer cette récompense ? Cette action est irréversible.
      </Modal>
    </div>
  );
}
