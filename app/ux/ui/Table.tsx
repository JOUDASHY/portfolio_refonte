"use client";

import { ReactNode } from "react";

export type TableColumn<Row extends Record<string, unknown>> = {
  key: keyof Row | string;
  header: string;
  className?: string;
  render?: (row: Row) => ReactNode;
};

type TableProps<Row extends Record<string, unknown>> = {
  columns: TableColumn<Row>[];
  data: Row[];
  rowKey: (row: Row) => string;
  emptyText?: string;
  actionsHeader?: string;
  actions?: (row: Row) => ReactNode;
};

export default function Table<Row extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  emptyText = "Aucune donnée",
  actionsHeader = "Actions",
  actions,
}: TableProps<Row>) {
  return (
    <div className="overflow-x-auto rounded-2xl bg-white/5 ring-1 ring-white/10">
      <table className="min-w-full text-left text-sm">
        <thead className="text-foreground/60">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className={`px-4 py-3 ${col.className || ""}`}>{col.header}</th>
            ))}
            {actions ? <th className="px-4 py-3 text-right">{actionsHeader}</th> : null}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={rowKey(row)} className="border-t border-white/10 text-foreground">
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
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-8 text-center text-foreground/60">
                {emptyText}
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </div>
  );
}


