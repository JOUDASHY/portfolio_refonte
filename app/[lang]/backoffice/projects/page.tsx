"use client";

import { useMemo, useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Table, { TableColumn } from "../../../ux/ui/Table";
import SearchBar from "../../../ux/ui/SearchBar";

type Project = {
  id: string;
  name: string;
  stars: number;
  status: "draft" | "published" | "archived";
  updatedAt: string;
};

export default function ProjectsPage() {
  const [query, setQuery] = useState("");

  const projects = useMemo<Project[]>(
    () => [
      { id: "1", name: "Portfolio v2", stars: 42, status: "published", updatedAt: "2025-09-20" },
      { id: "2", name: "E‑commerce UI", stars: 18, status: "draft", updatedAt: "2025-09-18" },
      { id: "3", name: "Dashboard Admin", stars: 27, status: "published", updatedAt: "2025-09-10" },
      { id: "4", name: "Design System", stars: 35, status: "archived", updatedAt: "2025-08-29" },
    ],
    []
  );

  const filtered = useMemo(
    () =>
      projects.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase())),
    [projects, query]
  );

  const columns: TableColumn<Project>[] = [
    { key: "name", header: "Nom" },
    { key: "stars", header: "Étoiles" },
    { key: "status", header: "Statut", render: (row) => <StatusBadge status={row.status as Project["status"]} /> },
    { key: "updatedAt", header: "Mis à jour" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h1 className="text-xl font-semibold text-foreground">Projects</h1>
        <div className="flex items-center gap-2">
          <SearchBar
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button variant="secondary">Nouveau projet</Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={filtered}
        rowKey={(row) => (row as Project).id}
        emptyText="Aucun projet trouvé"
        actionsHeader="Actions"
        actions={() => (
          <div className="inline-flex items-center gap-2">
            <Button variant="ghost" className="px-2 py-1 text-sm">Éditer</Button>
            <Button variant="ghost" className="px-2 py-1 text-sm">Archiver</Button>
          </div>
        )}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: Project["status"] }) {
  const map: Record<Project["status"], string> = {
    draft: "bg-yellow-500/20 text-yellow-300",
    published: "bg-emerald-500/20 text-emerald-300",
    archived: "bg-gray-500/20 text-gray-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs ${map[status]}`}>
      {status}
    </span>
  );
}


