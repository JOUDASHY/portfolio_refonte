"use client";

import { useEffect, useMemo, useState } from "react";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import SearchBar from "../../../ux/ui/SearchBar";
import { facebookService } from "../../../services/backoffice/facebookService";
import type { Facebook } from "../../../types/models";
import Modal from "../../../ux/ui/Modal";

type UiFacebook = {
  id: string;
  email: string;
  password: string;
  createdAt: string;
};

export default function FacebookPage() {
  const [items, setItems] = useState<UiFacebook[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [revealAll, setRevealAll] = useState<boolean>(false);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const { data } = await facebookService.list();
      const list = (Array.isArray(data) ? (data as Facebook[]) : []).map((f) => ({
        id: String(f.id),
        email: f.email,
        password: f.password,
        createdAt: `${f.date} ${f.heure}`,
      }));
      setItems(list);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((i) => i.email.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query]
  );

  const columns: TableColumn<UiFacebook>[] = [
    { key: "email", header: "Email" },
    { key: "password", header: (
      <button
        type="button"
        className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground"
        onClick={() => setRevealAll((v) => !v)}
        aria-label={revealAll ? "Masquer tous les mots de passe" : "Afficher tous les mots de passe"}
      >
        Mot de passe
        {revealAll ? (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
            <path d="M12 6c-4.5 0-8.2 2.5-10 6 1.1 2.2 3 4 5.3 5.1L3 21l1.4 1.4 18-18L21 3l-3.1 3.1C16.6 5.4 14.4 5 12 5zm0 3a4 4 0 013.7 2.6l-5.1 5.1A4 4 0 0112 9z" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
            <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
          </svg>
        )}
      </button>
    ), render: (row) => {
      const pwd = (row as UiFacebook).password || "";
      const masked = pwd ? "•".repeat(Math.max(8, Math.min(24, pwd.length))) : "";
      return (
        <span className="font-mono text-xs">{revealAll ? pwd : masked}</span>
      );
    } },
    { key: "createdAt", header: "Créé le" },
  ];

  async function confirmDelete() {
    if (!deleteId) return;
    try {
      await facebookService.remove(deleteId);
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Échec de la suppression");
    } finally {
      setDeleteId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Facebook (sensibles)</h1>
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="secondary" onClick={refresh} disabled={loading}>Rafraîchir</Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">{error}</div>
      )}

      <Table
        columns={columns}
        data={filtered}
        rowKey={(row) => (row as UiFacebook).id}
        emptyText="Aucun enregistrement"
        actionsHeader="Actions"
        actions={(row) => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" className="px-2 py-1 text-sm" onClick={() => setDeleteId((row as UiFacebook).id)}>Supprimer</Button>
          </div>
        )}
      />

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
        Êtes-vous sûr de vouloir supprimer cette entrée Facebook ? Cette action est irréversible.
      </Modal>
    </div>
  );
}


