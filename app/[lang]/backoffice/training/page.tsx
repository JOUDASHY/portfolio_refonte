"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import { useBackofficeFormations } from "../../../hooks/useBackofficeFormations";
import Loading from "../../../ux/Loading";
import { toast } from "react-toastify";

type Training = {
  id: string;
  debut: string; // YYYY-MM-DD
  fin: string; // YYYY-MM-DD
  title: string; // ex: Formation React Avancée
  provider: string; // ex: OpenClassrooms
  detail?: string; // ex: Certificat, contenu
  updatedAt: string;
};

export default function TrainingPage() {
  const [query, setQuery] = useState("");
  const { items, loading, error, setError, create, update, remove } = useBackofficeFormations();
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<Omit<Training, "id" | "updatedAt">>({
    debut: "",
    fin: "",
    title: "",
    provider: "",
    detail: "",
  });
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
          t.debut.toLowerCase().includes(q) ||
          t.fin.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<Training>[] = [
    { key: "debut", header: "Début" },
    { key: "fin", header: "Fin" },
    { key: "title", header: "Intitulé" },
    { key: "provider", header: "Organisme" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ debut: "", fin: "", title: "", provider: "", detail: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await update(editingId, form);
        toast.success("Formation mise à jour");
      } else {
        await create(form);
        toast.success("Formation ajoutée");
      }
      resetForm();
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Échec de l'enregistrement";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(id: string) {
    const target = items.find((t) => t.id === id);
    if (!target) return;
    const { debut, fin, title, provider, detail } = target;
    setForm({ debut, fin, title, provider, detail: detail || "" });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setError(null);
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
      toast.success("Formation supprimée");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Échec de la suppression";
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      {(loading || submitting || deleting) && <Loading />}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Formations</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="secondary"
            disabled={loading || submitting || deleting}
            onClick={() => {
              setEditingId(null);
              setForm({ debut: "", fin: "", title: "", provider: "", detail: "" });
              setIsFormOpen(true);
            }}
          >
            Nouvelle formation
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
          rowKey={(row) => (row as Training).id}
          emptyText="Aucune formation trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => handleEdit((row as Training).id)}
              >
                Éditer
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => setDeleteId((row as Training).id)}
              >
                Supprimer
              </Button>
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
            <Button
              variant="secondary"
              onClick={resetForm}
              disabled={loading || submitting || deleting}
            >
              Annuler
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || submitting || deleting}
            >
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Début"
              type="date"
              value={form.debut}
              onChange={(e) => setForm((f) => ({ ...f, debut: e.target.value }))}
            />
            <Input
              label="Fin"
              type="date"
              value={form.fin}
              onChange={(e) => setForm((f) => ({ ...f, fin: e.target.value }))}
            />
          </div>
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
            <Button
              variant="secondary"
              onClick={() => setDeleteId(null)}
              disabled={loading || submitting || deleting}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={loading || submitting || deleting}
            >
              Supprimer
            </Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



