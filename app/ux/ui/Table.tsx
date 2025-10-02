"use client";

import React, { ReactNode, useState } from "react";
import Checkbox from "./Checkbox";
import Button from "./Button";

export type TableColumn<Row extends Record<string, unknown>> = {
  key: keyof Row | string;
  header: ReactNode;
  className?: string;
  render?: (row: Row) => ReactNode;
};

type DataTableProps<Row extends Record<string, unknown>> = {
  columns: TableColumn<Row>[];
  data: Row[];
  rowKey: (row: Row) => string;
  emptyText?: string;
  actionsHeader?: string;
  actions?: (row: Row) => ReactNode;
  selectable?: boolean;
  onSelectionChange?: (selectedRows: Row[]) => void;
  pageSize?: number;
  showPagination?: boolean;
};

export default function DataTable<Row extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  emptyText = "Aucune donnée",
  actionsHeader = "Actions",
  actions,
  selectable = true,
  onSelectionChange,
  pageSize = 10,
  showPagination = true,
}: DataTableProps<Row>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Pagination logic
  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = data.slice(startIndex, endIndex);

  // Selection logic
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    if (checked) {
      const allKeys = currentData.map(row => rowKey(row));
      setSelectedRows(new Set(allKeys));
      onSelectionChange?.(currentData);
    } else {
      setSelectedRows(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (row: Row) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    const key = rowKey(row);
    const newSelection = new Set(selectedRows);
    
    if (checked) {
      newSelection.add(key);
    } else {
      newSelection.delete(key);
    }
    
    setSelectedRows(newSelection);
    
    const selectedData = data.filter(row => newSelection.has(rowKey(row)));
    onSelectionChange?.(selectedData);
  };

  const isAllSelected = currentData.length > 0 && currentData.every(row => selectedRows.has(rowKey(row)));
  const isIndeterminate = currentData.some(row => selectedRows.has(rowKey(row))) && !isAllSelected;

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto rounded-2xl bg-white/5 ring-1 ring-white/10 border border-black/10 data-[theme=light]:bg-white data-[theme=light]:ring-black/10">
        <table className="min-w-full text-left text-sm">
          <thead className="text-foreground/60">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-12">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((col) => (
                <th key={String(col.key)} className={`px-4 py-3 ${col.className || ""}`}>{col.header}</th>
              ))}
              {actions ? <th className="px-4 py-3 text-right">{actionsHeader}</th> : null}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => (
              <tr key={rowKey(row)} className="border-t border-white/10 text-foreground hover:bg-white/5">
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedRows.has(rowKey(row))}
                      onChange={handleSelectRow(row)}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={String(col.key)} className={`px-4 py-3 ${col.className || ""}`}>
                    {col.render ? col.render(row) : String(row[col.key as keyof Row] ?? "")}
                  </td>
                ))}
                {actions ? (
                  <td className="px-4 py-3 text-right">
                    {actions(row)}
                  </td>
                ) : null}
              </tr>
            ))}
            {currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0) + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-foreground/60">
                  {emptyText}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground/60">
            Affichage de {startIndex + 1} à {Math.min(endIndex, data.length)} sur {data.length} éléments
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Précédent
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "primary" : "secondary"}
                  onClick={() => goToPage(page)}
                  className="w-8 h-8 p-0"
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="secondary"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Suivant
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


