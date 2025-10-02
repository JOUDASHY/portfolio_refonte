"use client";

import { useMemo, useState } from "react";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Input from "../../../ux/ui/Input";
import SearchBar from "../../../ux/ui/SearchBar";
import { useLanguage } from "../../../hooks/LanguageProvider";
import { useBackofficeLangues, type BackofficeLangue } from "../../../hooks/useBackofficeLangues";

export default function LanguageSettingsPage() {
  const { lang, setLang } = useLanguage();
  const [tempLang, setTempLang] = useState<string>(lang);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { items, setError, create, update, remove } = useBackofficeLangues();
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<Omit<BackofficeLangue, "id" | "updatedAt">>({ titre: "", niveau: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  function handleSave() {
    setConfirmOpen(true);
  }

  function confirmSave() {
    setLang(tempLang as "en" | "fr");
    setConfirmOpen(false);
  }

  const filtered = useMemo(
    () =>
      items.filter((l) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return l.titre.toLowerCase().includes(q) || l.niveau.toLowerCase().includes(q);
      }),
    [items, query]
  );

  const columns: TableColumn<BackofficeLangue>[] = [
    { key: "titre", header: "Langue" },
    { key: "niveau", header: "Niveau" },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  function resetForm() {
    setForm({ titre: "", niveau: "" });
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
    const target = items.find((l) => l.id === id);
    if (!target) return;
    const { titre, niveau } = target;
    setForm({ titre, niveau });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDeleteLang() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Langue</h1>
          <p className="text-sm text-foreground/70">Choisissez la langue par défaut du backoffice et du site.</p>
        </div>

        <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
          <label className="block text-sm font-medium text-navy/80">Langue par défaut</label>
          <select
            className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-accent"
            value={tempLang}
            onChange={(e) => setTempLang(e.target.value)}
          >
            <option value="fr">Français (fr)</option>
            <option value="en">English (en)</option>
          </select>

          <div className="mt-5 flex items-center justify-end gap-2">
            <Button variant="secondary" onClick={() => setTempLang(lang)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        </div>

        <Modal
          open={confirmOpen}
          onClose={() => setConfirmOpen(false)}
          title="Confirmer la langue"
          footer={
            <>
              <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Annuler</Button>
              <Button onClick={confirmSave}>Confirmer</Button>
            </>
          }
          size="sm"
        >
          La langue par défaut sera changée en &quot;{tempLang}&quot;. Continuer ?
        </Modal>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-foreground">CRUD Langues</h2>
          <div className="flex items-center gap-2">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
            <Button
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm({ titre: "", niveau: "" });
                setIsFormOpen(true);
              }}
            >
              Nouvelle langue
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Table
            columns={columns}
            data={filtered}
            rowKey={(row) => (row as BackofficeLangue).id}
            emptyText="Aucune langue trouvée"
            actionsHeader="Actions"
            actions={(row) => (
              <div className="inline-flex items-center gap-2">
                <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as BackofficeLangue).id)}>Éditer</Button>
                <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as BackofficeLangue).id)}>Supprimer</Button>
              </div>
            )}
          />
        </div>
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier la langue" : "Ajouter une langue"}
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
            label="Langue"
            placeholder="Ex: Français"
            value={form.titre}
            onChange={(e) => setForm((f) => ({ ...f, titre: e.target.value }))}
          />
          <Input
            label="Niveau"
            placeholder="Ex: Courant, Bilingue, Professionnel"
            value={form.niveau}
            onChange={(e) => setForm((f) => ({ ...f, niveau: e.target.value }))}
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
            <Button onClick={confirmDeleteLang}>Supprimer</Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer cette langue ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



