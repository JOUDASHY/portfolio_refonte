"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import SearchBar from "../../../ux/ui/SearchBar";
import Modal from "../../../ux/ui/Modal";
import { useBackofficeProjets, type BackofficeProjet } from "../../../hooks/useBackofficeProjets";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const { items, setError, create, update, remove } = useBackofficeProjets();

  const [form, setForm] = useState<Omit<BackofficeProjet, "id" | "updatedAt">>({
    name: "",
    description: "",
    techno: "",
    github: "",
    link: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((p) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          p.name.toLowerCase().includes(q) ||
          p.techno.toLowerCase().includes(q) ||
          (p.github || "").toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<BackofficeProjet>[] = [
    { key: "name", header: "Nom" },
    { key: "techno", header: "Techno" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ name: "", description: "", techno: "", github: "", link: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  async function handleSubmit() {
    try {
      if (editingId) await update(editingId, form);
      else await create(form);
      resetForm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de l'enregistrement");
    }
  }

  function handleEdit(id: string) {
    const target = items.find((p) => p.id === id);
    if (!target) return;
    const { name, description, techno, github, link } = target;
    setForm({ name, description, techno, github: github || "", link: link || "" });
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
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Projets</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", description: "", techno: "", github: "", link: "" });
              setIsFormOpen(true);
            }}
          >
            Nouveau projet
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(row) => (row as BackofficeProjet).id}
        emptyText="Aucun projet trouvé"
        actionsHeader="Actions"
        actions={(row) => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as BackofficeProjet).id)}>Éditer</Button>
            <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as BackofficeProjet).id)}>Supprimer</Button>
          </div>
        )}
      />

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier le projet" : "Ajouter un projet"}
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
            label="Nom"
            placeholder="Nom du projet"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Description"
            placeholder="Description du projet"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Technologies"
            placeholder="Ex: React, Node, PostgreSQL"
            value={form.techno}
            onChange={(e) => setForm((f) => ({ ...f, techno: e.target.value }))}
          />
          <Input
            label="Lien GitHub"
            placeholder="https://github.com/..."
            value={form.github}
            onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
          />
          <Input
            label="Lien Projet"
            placeholder="https://..."
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
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
        Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.
      </Modal>
    </div>
  );
}


