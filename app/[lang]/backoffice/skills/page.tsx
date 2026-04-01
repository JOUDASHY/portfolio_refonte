"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import { useBackofficeCompetences, type CompetenceForm } from "../../../hooks/useBackofficeCompetences";
import Loading from "../../../ux/Loading";
import SafeImage from "../../../ux/ui/SafeImage";
import { toast } from "react-toastify";

export default function SkillsPage() {
  const { items, loading, error, create, update, remove, setError } = useBackofficeCompetences();
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<CompetenceForm>({ name: "", description: "", niveau: 5, categorie: "Front-end", imageFile: null });
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filtered = useMemo(
    () => items.filter((s) => {
      const q = query.trim().toLowerCase();
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || (s.categorie || "").toLowerCase().includes(q);
    }),
    [items, query]
  );

  const columns: TableColumn<typeof items[number]>[] = [
    { key: "image", header: "Image", render: (row) => (
      <div className="relative h-8 w-8">
        <SafeImage src={row.image || null} alt="" fill sizes="32px" className="rounded object-cover" fallbackSrc="/window.svg" />
      </div>
    ) },
    { key: "name", header: "Nom" },
    { key: "description", header: "Description", className: "max-w-[320px] truncate" },
    { key: "niveau", header: "Niveau", render: (row) => <span>{Math.max(0, Math.min(10, row.niveau))}/10</span> },
    { key: "categorie", header: "Catégorie" },
  ];

  function resetForm() {
    setForm({ name: "", description: "", niveau: 5, categorie: "Front-end", imageFile: null });
    setEditingId(null);
    setIsFormOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await update(editingId, form);
        toast.success("Compétence mise à jour");
      } else {
        await create(form);
        toast.success("Compétence ajoutée");
      }
      resetForm();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Échec de l'enregistrement";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(id: number | string) {
    const target = items.find((s) => String(s.id) === String(id));
    if (!target) return;
    setForm({ name: target.name, description: target.description, niveau: target.niveau, categorie: target.categorie || "", imageFile: null });
    setEditingId(id);
    setIsFormOpen(true);
    setPreviewUrl(target.image || null);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setError(null);
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
      toast.success("Compétence supprimée");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Échec de la suppression";
      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  return (
    <div className="relative space-y-6">
      {(loading || submitting || deleting) && <Loading />}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Compétences</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button
            variant="secondary"
            disabled={loading || submitting || deleting}
            onClick={() => { setEditingId(null); setForm({ name: "", description: "", niveau: 5, categorie: "Front-end", imageFile: null }); setIsFormOpen(true); }}
          >
            Nouvelle compétence
          </Button>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">{error}</div>
      ) : null}

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => String(row.id)}
          emptyText={loading ? "Chargement..." : "Aucune compétence trouvée"}
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => handleEdit(row.id)}
              >
                Éditer
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => setDeleteId(row.id)}
              >
                Supprimer
              </Button>
            </div>
          )}
          selectable={false}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier la compétence" : "Ajouter une compétence"}
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
            label="Description"
            placeholder="Courte description"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          />
          <Input
            label="Niveau (0-10)"
            type="number"
            min={0}
            max={10}
            value={form.niveau}
            onChange={(e) => setForm((f) => ({ ...f, niveau: Math.max(0, Math.min(10, Number(e.target.value || 0))) }))}
          />
          <div>
            <label className="block text-sm font-medium text-foreground">Catégorie</label>
            <select
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.categorie || ""}
              onChange={(e) => setForm((f) => ({ ...f, categorie: e.target.value }))}
            >
              <option value="Front-end">Front-end</option>
              <option value="Framework">Framework</option>
              <option value="Langage de programmation">Langage de programmation</option>
              <option value="Langage de modélisation">Langage de modélisation</option>
              <option value="Base de données">Base de données</option>
              <option value="DevOps">DevOps</option>
              <option value="Système d'exploitation">Système d&apos;exploitation</option>
              <option value="Back-end">Back-end</option>
              <option value="Tooling">Tooling</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setForm((f) => ({ ...f, imageFile: file }));
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
            {previewUrl && (
              <div className="mt-2 inline-flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded bg-black/5">
                  <img src={previewUrl} alt="Prévisualisation" className="h-full w-full object-cover" />
                </div>
                <button
                  type="button"
                  className="text-xs text-foreground/70 hover:text-foreground"
                  onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setForm((f) => ({ ...f, imageFile: null })); }}
                >
                  Retirer l&apos;image
                </button>
              </div>
            )}
          </div>
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
        Êtes-vous sûr de vouloir supprimer cette compétence ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



