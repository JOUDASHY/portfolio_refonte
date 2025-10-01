"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import { useBackofficeAwards, type BackofficeAward } from "../../../hooks/useBackofficeAwards";

export default function AwardsPage() {
  const [query, setQuery] = useState("");
  const { items, loading, error, setError, create, update, remove } = useBackofficeAwards();

  const [form, setForm] = useState<Omit<BackofficeAward, "id" | "updatedAt">>({
    year: "",
    title: "",
    organization: "",
    kind: "",
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
          a.year.toLowerCase().includes(q) ||
          (a.kind || "").toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<BackofficeAward>[] = [
    { key: "year", header: "Année" },
    { key: "title", header: "Titre" },
    { key: "organization", header: "Organisation" },
    { key: "kind", header: "Type" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ year: "", title: "", organization: "", kind: "", description: "" });
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
    } catch (e: any) {
      setError(e?.message || "Échec de l'enregistrement");
    }
  }

  function handleEdit(id: string) {
    const target = items.find((a) => a.id === id);
    if (!target) return;
    const { year, title, organization, kind, description } = target;
    setForm({ year, title, organization, kind, description: description || "" });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
    } catch (e: any) {
      setError(e?.message || "Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Récompenses</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ year: "", title: "", organization: "", kind: "", description: "" });
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
          rowKey={(row) => (row as BackofficeAward).id}
          emptyText="Aucune récompense trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as BackofficeAward).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as BackofficeAward).id)}>Supprimer</Button>
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
            <Button variant="secondary" onClick={resetForm}>Annuler</Button>
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
            label="Type"
            placeholder="Ex: Certification, Prix"
            value={form.kind}
            onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value }))}
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
