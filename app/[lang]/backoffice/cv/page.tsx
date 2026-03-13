"use client";

import { useState, useRef } from "react";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import { useBackofficeCV } from "../../../hooks/useCV";
import { NotificationService } from "../../../services/notificationService";

export default function CVManagementPage() {
  const { cvList, activeCV, loading, error, setError, upload, update, remove, getDownloadUrl, refresh } = useBackofficeCV();
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload() {
    if (!selectedFile) return;
    
    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Seuls les fichiers PDF sont acceptés");
      return;
    }

    setUploading(true);
    try {
      let success: boolean;
      if (activeCV) {
        success = await update(selectedFile);
        if (success) {
          await NotificationService.showSuccessToast("CV mis à jour avec succès");
        }
      } else {
        success = await upload(selectedFile);
        if (success) {
          await NotificationService.showSuccessToast("CV ajouté avec succès");
        }
      }
      if (success) {
        setIsUploadOpen(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } finally {
      setUploading(false);
    }
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      const success = await remove(deleteId);
      if (success) {
        await NotificationService.showSuccessToast("CV supprimé avec succès");
      }
    } finally {
      setDeleteId(null);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        setError("Seuls les fichiers PDF sont acceptés");
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  }

  function openUploadModal() {
    setSelectedFile(null);
    setError(null);
    setIsUploadOpen(true);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Gestion du CV</h1>
          <p className="text-sm text-foreground/60 mt-1">Gérez votre CV en ligne</p>
        </div>
        <div className="flex items-center gap-2">
          {activeCV && (
            <a
              href={getDownloadUrl()}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-md bg-accent/10 px-4 py-2 text-sm font-medium text-accent ring-1 ring-accent/20 hover:bg-accent/20 transition-all"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M5 20h14v-2H5v2zM9 4h6v6h4l-7 7-7-7h4V4z"/>
              </svg>
              Télécharger le CV actif
            </a>
          )}
          <Button variant="secondary" onClick={openUploadModal}>
            {activeCV ? "Remplacer le CV" : "Ajouter un CV"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">{error}</div>
      )}

      {/* Active CV Card */}
      {activeCV && (
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-accent">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">CV Actif</h3>
                <p className="text-sm text-foreground/60">Mis en ligne le {formatDate(activeCV.uploaded_at)}</p>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-green-200">
              Actif
            </span>
          </div>
        </div>
      )}

      {/* CV History */}
      <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Historique des CV</h2>
        
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-3 rounded-lg bg-white/5">
                <div className="h-10 w-10 rounded-lg bg-white/10"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-white/10 rounded mb-2"></div>
                  <div className="h-3 w-48 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : cvList.length === 0 ? (
          <div className="text-center py-8 text-foreground/60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 mx-auto mb-3 opacity-50">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
            </svg>
            <p>Aucun CV trouvé</p>
            <p className="text-sm mt-1">Téléversez votre premier CV pour commencer</p>
          </div>
        ) : (
          <div className="space-y-2">
            {cvList.map((cv) => (
              <div
                key={cv.id}
                className={`flex items-center justify-between gap-4 p-3 rounded-lg transition-colors ${
                  cv.is_active ? "bg-accent/5 ring-1 ring-accent/20" : "bg-white/5 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    cv.is_active ? "bg-accent/10" : "bg-white/10"
                  }`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className={`w-5 h-5 ${cv.is_active ? "text-accent" : "text-foreground/60"}`}>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      CV #{cv.id}
                      {cv.is_active && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                          Actif
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-foreground/50">{formatDate(cv.uploaded_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={cv.file_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="rounded p-2 text-foreground/60 hover:text-foreground hover:bg-white/10 transition-all"
                    title="Voir"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                    </svg>
                  </a>
                  {!cv.is_active && (
                    <button
                      onClick={() => setDeleteId(cv.id)}
                      className="rounded p-2 text-red-400/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
                      title="Supprimer"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        open={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title={activeCV ? "Remplacer le CV" : "Ajouter un CV"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsUploadOpen(false)}>Annuler</Button>
            <Button onClick={handleUpload} disabled={!selectedFile || uploading}>
              {uploading ? "Envoi..." : "Téléverser"}
            </Button>
          </>
        }
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-foreground/60">
            Seuls les fichiers PDF sont acceptés. Le nouveau CV remplacera automatiquement l&apos;ancien.
          </p>
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 p-8 hover:border-white/30 transition-colors">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-foreground/40 mb-3">
              <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z"/>
            </svg>
            <label className="cursor-pointer">
              <span className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:brightness-110 transition-all">
                Choisir un fichier
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            {selectedFile && (
              <p className="mt-3 text-sm text-foreground/80">
                Fichier sélectionné: <span className="font-medium">{selectedFile.name}</span>
              </p>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
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
        Êtes-vous sûr de vouloir supprimer ce CV ? Cette action est irréversible.
      </Modal>
    </div>
  );
}
