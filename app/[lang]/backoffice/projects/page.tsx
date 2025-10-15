"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import SafeImage from "../../../ux/ui/SafeImage";
import SearchBar from "../../../ux/ui/SearchBar";
import Modal from "../../../ux/ui/Modal";
import { useBackofficeProjets, type BackofficeProjet } from "../../../hooks/useBackofficeProjets";
import { imageProjetService } from "../../../services/backoffice/imageProjetService";
import { NotificationService } from "../../../services/notificationService";

export default function ProjectsPage() {
  const [query, setQuery] = useState("");
  const { items, setError, create, update, remove, refresh } = useBackofficeProjets();

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
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadProjectId, setUploadProjectId] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);
  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);

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
    {
      key: "relatedImages",
      header: "Images",
      className: "min-w-[200px]",
      render: (row) => {
        const images = (row.relatedImages || []);
        const maxThumbs = 8;
        const shown = images.slice(0, maxThumbs);
        const remaining = Math.max(0, images.length - shown.length);
        function openUploadModal() {
          setUploadProjectId(row.id);
          setUploadFiles([]);
          // cleanup old previews
          setUploadPreviews((prev) => { prev.forEach((u) => URL.revokeObjectURL(u)); return []; });
          setIsUploadOpen(true);
        }

        return (
          <div className="flex items-center gap-2">
            <div className="flex items-center max-w-[260px] overflow-hidden">
              {shown.map((img, i) => (
                <div
                  key={img.id}
                  className={`relative h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20 bg-black/5 ${i > 0 ? '-ml-2' : ''}`}
                  title="Image du projet"
                >
                  <SafeImage src={img.image} alt="" fill sizes="32px" className="object-cover" fallbackSrc="/window.svg" />
                  {/* Delete image button */}
                  <button
                    type="button"
                    aria-label="Supprimer l'image"
                    className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white hover:bg-red-500 shadow ring-1 ring-black/10 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteImageId(img.id);
                    }}
                    title="Supprimer cette image"
                  >
                    <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor" aria-hidden>
                      <path fillRule="evenodd" d="M10 8.586l3.536-3.536a1 1 0 111.414 1.414L11.414 10l3.536 3.536a1 1 0 01-1.414 1.414L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464a1 1 0 111.414-1.414L10 8.586z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
              {/* Upload trigger as circular button */}
              <button
                type="button"
                onClick={openUploadModal}
                className={`relative h-8 w-8 shrink-0 rounded-full border border-dashed border-foreground/20 hover:border-accent/60 flex items-center justify-center text-foreground/60 hover:text-accent transition-colors ${shown.length > 0 ? '-ml-2' : ''}`}
                title="Ajouter des images"
              >
                <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor" aria-hidden>
                  <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
            {remaining > 0 && (
              <span className="ml-1 text-xs text-foreground/60">+{remaining}</span>
            )}
          </div>
        );
      },
    },
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
      await NotificationService.showSuccessToast("Projet supprimé avec succès");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Échec de la suppression";
      setError(msg);
      await NotificationService.showErrorToast(msg);
    } finally {
      setDeleteId(null);
    }
  }

  async function confirmDeleteImage() {
    if (!deleteImageId) return;
    try {
      await imageProjetService.remove(deleteImageId);
      await refresh();
      await NotificationService.showSuccessToast("Image supprimée avec succès");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Échec de la suppression de l'image";
      setError(msg);
      await NotificationService.showErrorToast(msg);
    } finally {
      setDeleteImageId(null);
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

      {/* Modal d'upload multiple d'images */}
      <Modal
        open={isUploadOpen}
        onClose={() => {
          setIsUploadOpen(false);
          setUploadProjectId(null);
          uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
          setUploadPreviews([]);
          setUploadFiles([]);
        }}
        title="Ajouter des images"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsUploadOpen(false);
                setUploadProjectId(null);
                uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
                setUploadPreviews([]);
                setUploadFiles([]);
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={async () => {
                if (!uploadProjectId || uploadFiles.length === 0) return;
                try {
                  for (const f of uploadFiles) {
                    await imageProjetService.createFromFile(uploadProjectId, f);
                  }
                  await refresh();
                  setIsUploadOpen(false);
                  await NotificationService.showSuccessToast("Images téléchargées avec succès");
                } catch (e) {
                  const msg = e instanceof Error ? e.message : "Échec du téléchargement des images";
                  console.error(e);
                  await NotificationService.showErrorToast(msg);
                }
              }}
            >
              Télécharger ({uploadFiles.length})
            </Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-foreground">Fichiers image</label>
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-accent"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
                setUploadPreviews(files.map((f) => URL.createObjectURL(f)));
                setUploadFiles(files);
              }}
            />
          </div>

          {uploadPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadPreviews.map((src, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded bg-black/5">
                  <Image src={src} alt="preview" fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
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

      <Modal
        open={Boolean(deleteImageId)}
        onClose={() => setDeleteImageId(null)}
        title="Supprimer l'image"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteImageId(null)}>Annuler</Button>
            <Button onClick={confirmDeleteImage}>Supprimer</Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.
      </Modal>
    </div>
  );
}


