"use client";

import Button from "./Button";

interface BulkActionsProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  deleteLabel: string;
}

export default function BulkActions({
  selectedCount,
  onDeleteSelected,
  deleteLabel
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="primary" 
        className="bg-red-600 hover:bg-red-700 text-white"
        onClick={onDeleteSelected}
      >
        <i className="fas fa-trash mr-2"></i>
        {deleteLabel} ({selectedCount})
      </Button>
    </div>
  );
}
