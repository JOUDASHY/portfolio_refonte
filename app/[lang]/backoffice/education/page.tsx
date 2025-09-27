"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";

type Education = {
  id: string;
  period: string;
  title: string;
  school: string;
  detail?: string;
  updatedAt: string;
};

export default function EducationPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<Education[]>([
    {
      id: "1",
      period: "2020 – 2023",
      title: "Master en Informatique",
      school: "Université de Fianarantsoa",
      detail: "Spécialisation en développement web",
      updatedAt: "2025-09-20",
    },
    {
      id: "2",
      period: "2018 – 2020",
      title: "Licence en Informatique",
      school: "Université de Fianarantsoa",
      detail: "Formation générale en informatique",
      updatedAt: "2025-09-18",
    },
  ]);

  const [form, setForm] = useState<Omit<Education, "id" | "updatedAt">>({
    period: "",
    title: "",
    school: "",
    detail: "",
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
          e.school.toLowerCase().includes(q) ||
          e.period.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<Education>[] = [
    { key: "period", header: "Période" },
    { key: "title", header: "Diplôme" },
    { key: "school", header: "Établissement" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ period: "", title: "", school: "", detail: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  function handleSubmit() {
    const now = new Date().toISOString().slice(0, 10);
    if (editingId) {
      setItems((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...form, updatedAt: now } : e)));
    } else {
      const id = Math.random().toString(36).slice(2, 9);
      setItems((prev) => [...prev, { id, ...form, updatedAt: now }]);
    }
    resetForm();
  }

  function handleEdit(id: string) {
    const target = items.find((e) => e.id === id);
    if (!target) return;
    const { period, title, school, detail } = target;
    setForm({ period, title, school, detail: detail || "" });
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
        <h1 className="text-xl font-semibold text-foreground">Éducation</h1>
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
              setForm({ period: "", title: "", school: "", detail: "" });
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
          rowKey={(row) => (row as Education).id}
          emptyText="Aucune formation trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as Education).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as Education).id)}>Supprimer</Button>
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
            placeholder="2020 – 2023"
            value={form.period}
            onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
          />
          <Input
            label="Diplôme"
            placeholder="Master en Informatique"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <Input
            label="Établissement"
            placeholder="Université de Fianarantsoa"
            value={form.school}
            onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
          />
          <Input
            label="Détail"
            placeholder="Spécialisation, mention…"
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
