"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";

type Skill = {
  id: string;
  name: string;
  level: number; // 1-5
  category: "Front-end" | "Back-end" | "Tooling" | "Autre";
  updatedAt: string;
};

export default function SkillsPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Skill[]>([
    { id: "1", name: "React", level: 5, category: "Front-end", updatedAt: "2025-09-20" },
    { id: "2", name: "TypeScript", level: 5, category: "Front-end", updatedAt: "2025-09-18" },
    { id: "3", name: "Node.js", level: 4, category: "Back-end", updatedAt: "2025-09-10" },
    { id: "4", name: "Tailwind CSS", level: 4, category: "Front-end", updatedAt: "2025-09-08" },
  ]);

  const [form, setForm] = useState<Omit<Skill, "id" | "updatedAt">>({ name: "", level: 3, category: "Front-end" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((s) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return s.name.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
      }),
    [items, query]
  );

  const columns: TableColumn<Skill>[] = [
    { key: "name", header: "Nom" },
    { key: "level", header: "Niveau", render: (row) => "★".repeat((row as Skill).level) },
    { key: "category", header: "Catégorie" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ name: "", level: 3, category: "Front-end" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleSubmit() {
    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setItems((prev) => prev.map((s) => (s.id === editingId ? { ...s, ...form, updatedAt: now } : s)));
    } else {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [...prev, { id, ...form, updatedAt: now }]);
    }
    resetForm();
  }

  function handleEdit(id: string) {
    const target = items.find((s) => s.id === id);
    if (!target) return;
    const { name, level, category } = target;
    setForm({ name, level, category });
    setEditingId(id);
    setIsFormOpen(true);
  }

  function confirmDelete() {
    if (!deleteId) return;
    setItems((prev) => prev.filter((s) => s.id !== deleteId));
    if (editingId === deleteId) resetForm();
    setDeleteId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Compétences</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ name: "", level: 3, category: "Front-end" });
              setIsFormOpen(true);
            }}
          >
            Nouvelle compétence
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as Skill).id}
          emptyText="Aucune compétence trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as Skill).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as Skill).id)}>Supprimer</Button>
            </div>
          )}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier la compétence" : "Ajouter une compétence"}
        footer={
          <>
            <Button variant="secondary" onClick={resetForm}>Annuler</Button>
            <Button onClick={handleSubmit}>{editingId ? "Enregistrer" : "Ajouter"}</Button>
          </>
        }
        size="md"
      >
        <div className="space-y-3">
          <Input
            label="Nom"
            placeholder="ex: React"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Niveau (1-5)"
            type="number"
            min={1}
            max={5}
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: Math.min(5, Math.max(1, Number(e.target.value || 1))) }))}
          />
          <div>
            <label className="block text-sm font-medium text-navy/80">Catégorie</label>
            <select
              className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-accent"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as Skill["category"] }))}
            >
              <option value="Front-end">Front-end</option>
              <option value="Back-end">Back-end</option>
              <option value="Tooling">Tooling</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
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
        Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



