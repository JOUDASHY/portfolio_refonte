"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { projetService } from "../../../../services/backoffice/projetService";
import { imageProjetService } from "../../../../services/backoffice/imageProjetService";
import type { Projet } from "../../../../types/backoffice/projet";
import { NotificationService } from "../../../../services/notificationService";
import Button from "../../../../ux/ui/Button";
import Modal from "../../../../ux/ui/Modal";
import SafeImage from "../../../../ux/ui/SafeImage";

export default function BackofficeProjectDetailPage() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Projet | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  const [deleteImageId, setDeleteImageId] = useState<number | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadPreviews, setUploadPreviews] = useState<string[]>([]);

  const fetchProject = async () => {
    try {
      const { data } = await projetService.list();
      const list = Array.isArray(data) ? data : [];
      const found = list.find((p) => String(p.id) === String(id));
      setProject(found ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const images = project?.related_images ?? [];
  const allImages = images.length > 0 ? images.map((i) => i.image) : ["/window.svg"];
  const total = allImages.length;
  const technos = project?.techno?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];

  async function confirmDeleteImage() {
    if (!deleteImageId) return;
    try {
      await imageProjetService.remove(deleteImageId);
      await fetchProject();
      await NotificationService.showSuccessToast("Image supprimée");
    } catch (e: unknown) {
      await NotificationService.showErrorToast(e instanceof Error ? e.message : "Erreur");
    } finally {
      setDeleteImageId(null);
    }
  }

  async function handleUpload() {
    if (!project || uploadFiles.length === 0) return;
    try {
      for (const f of uploadFiles) {
        await imageProjetService.createFromFile(String(project.id), f);
      }
      await fetchProject();
      setIsUploadOpen(false);
      uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
      setUploadPreviews([]);
      setUploadFiles([]);
      await NotificationService.showSuccessToast("Images ajoutées");
    } catch (e: unknown) {
      await NotificationService.showErrorToast(e instanceof Error ? e.message : "Erreur upload");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 rounded-full border-4 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-foreground/60">Projet introuvable.</p>
        <Button variant="secondary" onClick={() => router.push(`/${lang}/backoffice/projects`)}>← Retour</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/${lang}/backoffice/projects`)}
          className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-accent transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
          Projets
        </button>
        <div className="flex items-center gap-2">
          {project.is_featured && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#f68c09] bg-[#f68c09]/10 px-2 py-0.5 rounded-full ring-1 ring-[#f68c09]/30">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Modèle
            </span>
          )}
          <span className="text-xs text-foreground/40 bg-foreground/5 px-2 py-0.5 rounded-full ring-1 ring-foreground/10">
            ★ {Number(project.average_score ?? 0).toFixed(1)}/5
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-foreground/5 ring-1 ring-foreground/10">
            <SafeImage
              src={allImages[imgIndex]}
              alt={`${project.nom} ${imgIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4"
              fallbackSrc="/window.svg"
            />
            {total > 1 && (
              <>
                <button
                  onClick={() => setImgIndex((i) => (i - 1 + total) % total)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" /></svg>
                </button>
                <button
                  onClick={() => setImgIndex((i) => (i + 1) % total)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" /></svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnails grid */}
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={img.id} className="relative group">
                <button
                  onClick={() => setImgIndex(i)}
                  className={`relative h-14 w-14 overflow-hidden rounded-lg ring-2 transition-all ${i === imgIndex ? "ring-accent" : "ring-transparent opacity-60 hover:opacity-100"}`}
                >
                  <SafeImage src={img.image} alt="" fill sizes="56px" className="object-cover" fallbackSrc="/window.svg" />
                </button>
                <button
                  onClick={() => setDeleteImageId(img.id)}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                  title="Supprimer"
                >
                  <svg viewBox="0 0 20 20" className="h-3 w-3" fill="currentColor">
                    <path fillRule="evenodd" d="M10 8.586l3.536-3.536a1 1 0 111.414 1.414L11.414 10l3.536 3.536a1 1 0 01-1.414 1.414L10 11.414l-3.536 3.536a1 1 0 01-1.414-1.414L8.586 10 5.05 6.464a1 1 0 111.414-1.414L10 8.586z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => setIsUploadOpen(true)}
              className="h-14 w-14 rounded-lg border-2 border-dashed border-foreground/20 hover:border-accent/60 flex items-center justify-center text-foreground/40 hover:text-accent transition-colors"
              title="Ajouter des images"
            >
              <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor">
                <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-5">
          <div>
            <h1 className="text-xl font-bold text-foreground">{project.nom}</h1>
          </div>

          {project.description && (
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-1">Description</p>
              <p className="text-sm text-foreground/70 leading-relaxed">{project.description}</p>
            </div>
          )}

          {technos.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">Technologies</p>
              <div className="flex flex-wrap gap-2">
                {technos.map((tech) => (
                  <span key={tech} className="px-2.5 py-1 rounded-full text-xs font-medium bg-foreground/5 text-foreground/70 ring-1 ring-foreground/10">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">Liens</p>
            {project.githublink ? (
              <a href={project.githublink} target="_blank" rel="noreferrer noopener"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent transition-colors truncate">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" /></svg>
                {project.githublink}
              </a>
            ) : <span className="text-xs text-foreground/30">Aucun lien GitHub</span>}

            {project.projetlink ? (
              <a href={project.projetlink} target="_blank" rel="noreferrer noopener"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-accent transition-colors truncate">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0"><path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" /></svg>
                {project.projetlink}
              </a>
            ) : <span className="text-xs text-foreground/30">Aucun lien projet</span>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => router.push(`/${lang}/backoffice/projects`)}>
              ← Retour à la liste
            </Button>
          </div>
        </div>
      </div>

      {/* Delete image modal */}
      <Modal
        open={Boolean(deleteImageId)}
        onClose={() => setDeleteImageId(null)}
        title="Supprimer l'image"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteImageId(null)}>Annuler</Button>
            <Button onClick={confirmDeleteImage}>Supprimer</Button>
          </>
        }
      >
        Êtes-vous sûr de vouloir supprimer cette image ?
      </Modal>

      {/* Upload modal */}
      <Modal
        open={isUploadOpen}
        onClose={() => { setIsUploadOpen(false); uploadPreviews.forEach((u) => URL.revokeObjectURL(u)); setUploadPreviews([]); setUploadFiles([]); }}
        title="Ajouter des images"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => { setIsUploadOpen(false); uploadPreviews.forEach((u) => URL.revokeObjectURL(u)); setUploadPreviews([]); setUploadFiles([]); }}>Annuler</Button>
            <Button onClick={handleUpload}>Télécharger ({uploadFiles.length})</Button>
          </>
        }
      >
        <div className="space-y-3">
          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full rounded-lg border border-foreground/10 bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              uploadPreviews.forEach((u) => URL.revokeObjectURL(u));
              setUploadPreviews(files.map((f) => URL.createObjectURL(f)));
              setUploadFiles(files);
            }}
          />
          {uploadPreviews.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {uploadPreviews.map((src, i) => (
                <div key={i} className="relative h-16 w-16 overflow-hidden rounded bg-foreground/5">
                  <Image src={src} alt="preview" fill sizes="64px" className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
