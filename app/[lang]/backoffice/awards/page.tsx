"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import Loading from "../../../ux/Loading";
import { useBackofficeAwards, type BackofficeAward } from "../../../hooks/useBackofficeAwards";
import { educationService } from "../../../services/backoffice/educationService";
import type { Education } from "../../../types/models";
import { toast } from "react-toastify";

type AwardType = 'diplome' | 'certification' | 'attestation' | 'brevet' | 'autre';

const TYPE_LABELS: Record<AwardType, string> = {
  diplome: 'Diplôme',
  certification: 'Certification',
  attestation: 'Attestation',
  brevet: 'Brevet',
  autre: 'Autre',
};

export default function AwardsPage() {
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<AwardType | 'all'>('all');
  const { items, loading, setError, create, update, remove } = useBackofficeAwards();
  const [educations, setEducations] = useState<Education[]>([]);
  const [loadingEducations, setLoadingEducations] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState<Omit<BackofficeAward, "id" | "updatedAt" | "education_name">>({
    education_id: null,
    year: "",
    title: "",
    organization: null,
    kind: "diplome",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Charger les educations pour le dropdown
  const loadEducations = useCallback(async () => {
    setLoadingEducations(true);
    try {
      const { data } = await educationService.list();
      const list = Array.isArray(data) ? (data as Education[]) : [];
      setEducations(list);
    } catch (e) {
      console.error("Échec du chargement des formations:", e);
    } finally {
      setLoadingEducations(false);
    }
  }, []);

  useEffect(() => {
    loadEducations();
  }, [loadEducations]);

  const filtered = useMemo(
    () =>
      items.filter((a) => {
        // Filtre par type
        if (typeFilter !== 'all' && a.kind !== typeFilter) return false;
        
        // Filtre par recherche
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          a.title.toLowerCase().includes(q) ||
          (a.organization || "").toLowerCase().includes(q) ||
          a.year.toLowerCase().includes(q) ||
          (a.education_name || "").toLowerCase().includes(q)
        );
      }),
    [items, query, typeFilter]
  );

  const columns: TableColumn<BackofficeAward>[] = [
    { key: "year", header: "Année" },
    { key: "title", header: "Titre" },
    { 
      key: "kind", 
      header: "Type",
      render: (row) => TYPE_LABELS[row.kind] || row.kind
    },
    { 
      key: "organization", 
      header: "Institution",
      render: (row) => row.organization || <span className="text-muted-foreground italic">Non spécifié</span>
    },
    { 
      key: "education_name", 
      header: "Formation",
      render: (row) => row.education_name || <span className="text-muted-foreground italic">Indépendant</span>
    },
  ];

  function resetForm() {
    setForm({ 
      education_id: null,
      year: new Date().getFullYear().toString(), 
      title: "", 
      organization: null, 
      kind: "diplome", 
      description: "" 
    });
    setEditingId(null);
    setIsFormOpen(false);
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      if (editingId) {
        await update(editingId, form);
        toast.success("Diplôme/Certification mis à jour");
      } else {
        await create(form);
        toast.success("Diplôme/Certification ajouté");
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
    const target = items.find((a) => a.id === id);
    if (!target) return;
    const { education_id, year, title, organization, kind, description } = target;
    setForm({ 
      education_id, 
      year, 
      title, 
      organization, 
      kind, 
      description: description || "" 
    });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
      toast.success("Diplôme/Certification supprimé");
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
      {(loading || submitting || deleting || loadingEducations) && <Loading />}
      
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Diplômes & Certifications</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
          />
          <Button
            variant="secondary"
            disabled={loading || submitting || deleting}
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
          >
            Nouveau diplôme
          </Button>
        </div>
      </div>

      {/* Filtres par type */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">Filtrer par type :</span>
        <button
          onClick={() => setTypeFilter('all')}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            typeFilter === 'all'
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          Tous ({items.length})
        </button>
        {Object.entries(TYPE_LABELS).map(([type, label]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type as AwardType)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              typeFilter === type
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            {label} ({items.filter(a => a.kind === type).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="text-sm text-muted-foreground">
          {filtered.length} résultat{filtered.length !== 1 ? 's' : ''} trouvé{filtered.length !== 1 ? 's' : ''}
        </div>
        
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as BackofficeAward).id}
          emptyText="Aucun diplôme ou certification trouvé"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button 
                variant="ghost" 
                className="px-2 py-1 text-sm" 
                disabled={loading || submitting || deleting}
                onClick={() => handleEdit((row as BackofficeAward).id)}
              >
                Éditer
              </Button>
              <Button 
                variant="ghost" 
                className="px-2 py-1 text-sm text-red-600 hover:text-red-700" 
                disabled={loading || submitting || deleting}
                onClick={() => setDeleteId((row as BackofficeAward).id)}
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
        title={editingId ? "Modifier le diplôme/certification" : "Ajouter un diplôme/certification"}
        footer={
          <>
            <Button 
              variant="secondary" 
              onClick={resetForm} 
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={submitting || !form.title}
            >
              {editingId ? "Enregistrer" : "Ajouter"}
            </Button>
          </>
        }
        size="lg"
      >
        <div className="space-y-3">
          {/* Type de diplôme/certification */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={form.kind}
              onChange={(e) => setForm((f) => ({ ...f, kind: e.target.value as AwardType }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {/* Formation parente (optionnelle) */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Formation liée (optionnel)
            </label>
            <select
              value={form.education_id || ""}
              onChange={(e) => setForm((f) => ({ ...f, education_id: e.target.value || null }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">-- Certification indépendante --</option>
              {educations.map((edu) => (
                <option key={edu.id} value={edu.id}>
                  {edu.nom_ecole} - {edu.nom_parcours} ({edu.annee_debut}-{edu.annee_fin})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Laissez vide pour les certifications indépendantes (AWS, Google Cloud, etc.)
            </p>
          </div>

          <Input
            label="Titre"
            placeholder="Ex: Diplôme d'Ingénieur, AWS Solutions Architect"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
          
          <Input
            label="Institution (optionnel)"
            placeholder="Ex: Ministère de l'Éducation, Amazon Web Services"
            value={form.organization || ""}
            onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value || null }))}
          />
          
          <Input
            label="Année d'obtention"
            type="number"
            placeholder="2023"
            value={form.year}
            onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Description (optionnel)
            </label>
            <textarea
              placeholder="Détails du diplôme ou de la certification…"
              value={form.description || ""}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              rows={3}
            />
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
              disabled={deleting}
            >
              Annuler
            </Button>
            <Button 
              onClick={confirmDelete}
              disabled={deleting}
            >
              Supprimer
            </Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer ce diplôme/certification ? Cette action est irréversible.
      </Modal>
    </div>
  );
}
