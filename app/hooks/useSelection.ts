"use client";

import { useState } from "react";

export const useSelection = <T extends { id: number }>(items: T[]) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = (id: number) => {
    setSelectedIds((prevSelected) => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter((selectedId) => selectedId !== id);
      } else {
        return [...prevSelected, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.length === items.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map(item => item.id));
    }
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isSelected = (id: number) => selectedIds.includes(id);
  const isAllSelected = items.length > 0 && selectedIds.length === items.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < items.length;

  return {
    selectedIds,
    selectedCount: selectedIds.length,
    handleSelect,
    handleSelectAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected
  };
};
