"use client";

import { useState } from "react";

interface UseDeletionProps {
  onDelete: (id: number) => Promise<void>;
  onDeleteMultiple?: (ids: number[]) => Promise<void>;
}

export const useDeletion = <T extends { id: number }>({
  onDelete,
  onDeleteMultiple
}: UseDeletionProps) => {
  const [deleteItem, setDeleteItem] = useState<T | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (item: T) => {
    setIsDeleting(true);
    try {
      await onDelete(item.id);
      setDeleteItem(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteMultiple = async (ids: number[]) => {
    if (!onDeleteMultiple) return;
    
    setIsDeleting(true);
    try {
      await onDeleteMultiple(ids);
    } catch (error) {
      console.error("Error deleting multiple items:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (item: T) => {
    setDeleteItem(item);
  };

  const closeDeleteModal = () => {
    setDeleteItem(null);
  };

  return {
    deleteItem,
    isDeleting,
    handleDelete,
    handleDeleteMultiple,
    openDeleteModal,
    closeDeleteModal
  };
};
