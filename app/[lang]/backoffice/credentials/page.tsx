"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import Modal from "../../../ux/ui/Modal";
import SearchBar from "../../../ux/ui/SearchBar";
import { useBackofficeMyLogins, type BackofficeMyLogin } from "../../../hooks/useBackofficeMyLogins";

export default function CredentialsPage() {
  const [query, setQuery] = useState("");
  const { items, setError, create, update, remove } = useBackofficeMyLogins();

  const [form, setForm] = useState<Omit<BackofficeMyLogin, "id" | "updatedAt">>({ site: "", link: "", username: "", password: "" });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const filtered = useMemo(
    () =>
      items.filter((c) => {
        const q = query.trim().toLowerCase();
        if (!q) return true;
        return (
          c.site.toLowerCase().includes(q) ||
          c.username.toLowerCase().includes(q) ||
          c.link.toLowerCase().includes(q)
        );
      }),
    [items, query]
  );

  const columns: TableColumn<BackofficeMyLogin>[] = [
    { key: "site", header: "Site" },
    { key: "username", header: "Nom d'utilisateur" },
    { key: "link", header: "Lien" },
  ];

  function resetForm() {
    setForm({ site: "", link: "", username: "", password: "" });
    setEditingId(null);
    setIsFormOpen(false);
  }

  async function handleSubmit() {
    try {
      if (editingId) {
        await update(editingId, form);
      } else {
        await create(form);
      }
      resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'enregistrement");
    }
  }

  function handleEdit(id: string) {
    const target = items.find((s) => s.id === id);
    if (!target) return;
    const { site, link, username, password } = target;
    setForm({ site, link, username, password });
    setEditingId(id);
    setIsFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await remove(deleteId);
      if (editingId === deleteId) resetForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Identifiants</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button
            variant="secondary"
            onClick={() => {
              setEditingId(null);
              setForm({ site: "", link: "", username: "", password: "" });
              setIsFormOpen(true);
            }}
          >
            Nouvel identifiant
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Table
          columns={columns}
          data={filtered}
          rowKey={(row) => (row as BackofficeMyLogin).id}
          emptyText="Aucun identifiant trouvé"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => handleEdit((row as BackofficeMyLogin).id)}>Éditer</Button>
              <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as BackofficeMyLogin).id)}>Supprimer</Button>
            </div>
          )}
        />
      </div>

      <Modal
        open={isFormOpen}
        onClose={resetForm}
        title={editingId ? "Modifier l'identifiant" : "Ajouter un identifiant"}
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
            label="Site"
            placeholder="ex: Github"
            value={form.site}
            onChange={(e) => setForm((f) => ({ ...f, site: e.target.value }))}
          />
          <Input
            label="Lien"
            placeholder="https://..."
            value={form.link}
            onChange={(e) => setForm((f) => ({ ...f, link: e.target.value }))}
          />
          <Input
            label="Nom d'utilisateur"
            placeholder="john.doe"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-navy/80">Mot de passe</label>
            <div className="mt-1 flex gap-2">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "Masquer" : "Afficher"}
              </Button>
            </div>
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
        Êtes-vous sûr de vouloir supprimer cet identifiant ? Cette action est irréversible.
      </Modal>
    </div>
  );
}



