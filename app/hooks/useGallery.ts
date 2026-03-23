"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { galleryService } from "../services/backoffice/galleryService";
import type { GalleryCategory, GalleryImage, GalleryFilters } from "../types/backoffice/gallery";

export function useGallery(initialFilters: GalleryFilters = {}) {
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<GalleryFilters>(initialFilters);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [allCategories, allImages] = await Promise.all([
                galleryService.getCategories(),
                galleryService.getImages(filters),
            ]);
            setCategories(allCategories);
            setImages(allImages);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Erreur de chargement de la galerie");
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const imagesByFeatured = useMemo(() => {
        return images.filter(img => img.is_featured);
    }, [images]);

    const updateFilters = (newFilters: Partial<GalleryFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
    };

    return {
        categories,
        images,
        imagesByFeatured,
        loading,
        error,
        filters,
        updateFilters,
        clearFilters,
        refetch: fetchData,
    };
}
