"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import SafeImage from "../../../ux/ui/SafeImage";
import Loading from "../../../ux/Loading";
import { educationService } from "../../../services/backoffice/educationService";
import type { Education as EducationModel } from "../../../types/models";
import { toast } from "react-toastify";

type EducationRow = {
  id: string;
  image: string | null;
  nom_ecole: string;
  nom_parcours: string;
  annee_debut: number;
  annee_fin: number;
  lieu: string;
};

export default function EducationPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<EducationRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<EducationRow, "id" | "image"> & { image?: string | null }>({
    nom_ecole: "",
    nom_parcours: "",
    annee_debut: new Date().getFullYear(),
    annee_fin: new Date().getFullYear(),
    lieu: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await educationService.list();
      const list = Array.isArray(data)
        ? (data as EducationModel[]).map((e) => ({
            id: String(e.id),
            image: e.image || null,
            nom_ecole: String(e.nom_ecole || ""),
            nom_parcours: String(e.nom_parcours || ""),
            annee_debut: Number(e.annee_debut || 0),
            annee_fin: Number(e.annee_fin || 0),
            lieu: String(e.lieu || ""),
          }))
        : [];
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec du chargement");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(
    () =>
      items.filter((e) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          e.nom_ecole.toLowerCase().includes(q) ||
          e.nom_parcours.toLowerCase().includes(q) ||
          String(e.annee_debut).includes(q) ||
          String(e.annee_fin).includes(q) ||
          e.lieu.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<EducationRow>[] = [
    {
      key: "image",
      header: "Image",
      className: "w-[48px]",
      render: (row) => (
        <div className="relative h-8 w-8 overflow-hidden rounded bg-black/5">
          <SafeImage src={row.image || null} alt="" fill sizes="32px" className="object-cover" fallbackSrc="/window.svg" />
        </div>
      ),
    },
    { key: "nom_ecole", header: "École" },
    { key: "nom_parcours", header: "Parcours" },
    { key: "annee_debut", header: "Début" },
    { key: "annee_fin", header: "Fin" },
    { key: "lieu", header: "Lieu" },
  ];

  function resetForm() {
    setForm({ nom_ecole: "", nom_parcours: "", annee_debut: new Date().getFullYear(), annee_fin: new Date().getFullYear(), lieu: "" });
    setEditingId(null);
    setIsFormOpen(false);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setImageFile(null);
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (editingId) {
        await educationService.updateForm(editingId, {
          image: imageFile || undefined,
          nom_ecole: form.nom_ecole,
          nom_parcours: form.nom_parcours,
          annee_debut: form.annee_debut,
          annee_fin: form.annee_fin,
          lieu: form.lieu,
        });
        toast.success("Formation mise à jour");
      } else {
        await educationService.createForm({
          image: imageFile || undefined,
          nom_ecole: form.nom_ecole,
          nom_parcours: form.nom_parcours,
          annee_debut: form.annee_debut,
          annee_fin: form.annee_fin,
          lieu: form.lieu,
        });
        toast.success("Formation ajoutée");
      }
      await refresh();
      resetForm();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Échec de l'enregistrement";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  function handleEdit(id: string) {
    const target = items.find((e) => e.id === id);
    if (!target) return;
    const { nom_ecole, nom_parcours, annee_debut, annee_fin, lieu, image } = target;
    setForm({ nom_ecole, nom_parcours, annee_debut, annee_fin, lieu });
    setEditingId(id);
    setIsFormOpen(true);
    setPreviewUrl(image || null);
    setImageFile(null);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    setError(null);
    try {
      await educationService.remove(deleteId);
      if (editingId === deleteId) resetForm();
      await refresh();
      toast.success("Formation supprimée");
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
    <div className="space-y-6">
      {(loading || submitting || deleting) && <Loading />}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Éducation</h1>
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
              setForm({ nom_ecole: "", nom_parcours: "", annee_debut: new Date().getFullYear(), annee_fin: new Date().getFullYear(), lieu: "" });
              setIsFormOpen(true);
            }}
          >
            Nouvelle formation
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as EducationRow).id}
          emptyText="Aucune formation trouvée"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => handleEdit((row as EducationRow).id)}
              >
                Éditer
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                disabled={loading || submitting || deleting}
                onClick={() => setDeleteId((row as EducationRow).id)}
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
            <Button variant="secondary" onClick={resetForm} disabled={submitting || deleting || loading}>
              Annuler
            </Button>
            <Button onClick={handleSubmit} disabled={submitting || deleting || loading}>
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          <Input
            label="Établissement (nom_ecole)"
            placeholder="ENI"
            value={form.nom_ecole}
            onChange={(e) => setForm((f) => ({ ...f, nom_ecole: e.target.value }))}
          />
          <Input
            label="Parcours (nom_parcours)"
            placeholder="INFORMATIQUE GENERAL"
            value={form.nom_parcours}
            onChange={(e) => setForm((f) => ({ ...f, nom_parcours: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Année début"
              type="number"
              value={form.annee_debut}
              onChange={(e) => setForm((f) => ({ ...f, annee_debut: Number(e.target.value || 0) }))}
            />
            <Input
              label="Année fin"
              type="number"
              value={form.annee_fin}
              onChange={(e) => setForm((f) => ({ ...f, annee_fin: Number(e.target.value || 0) }))}
            />
          </div>
          <Input
            label="Lieu"
            placeholder="Fianarantsoa"
            value={form.lieu}
            onChange={(e) => setForm((f) => ({ ...f, lieu: e.target.value }))}
          />

          {/* Image upload & preview */}
          <div>
            <label className="block text-sm font-medium text-foreground">Image</label>
            <input
              type="file"
              accept="image/*"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground file:text-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring"
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(file ? URL.createObjectURL(file) : null);
              }}
            />
            {previewUrl && (
              <div className="mt-2 inline-flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded bg-black/5">
                  <Image src={previewUrl} alt="Prévisualisation" fill sizes="48px" className="object-cover" />
                </div>
                <button
                  type="button"
                  className="text-xs text-foreground/70 hover:text-foreground"
                  onClick={() => { if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(null); setImageFile(null); }}
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
            <Button variant="secondary" onClick={() => setDeleteId(null)} disabled={deleting || loading || submitting}>
              Annuler
            </Button>
            <Button onClick={confirmDelete} disabled={deleting || loading || submitting}>
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

