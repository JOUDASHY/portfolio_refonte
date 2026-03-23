import { apiAuth, apiNoAuth } from "../../lib/axiosClient";
import type { GalleryCategory, GalleryImage, GalleryFilters } from "../../types/backoffice/gallery";

export const galleryService = {
    // Categories
    async getCategories() {
        const { data } = await apiNoAuth.get<GalleryCategory[]>("gallery/categories/");
        return data;
    },

    async getCategoryDetail(id: number) {
        const { data } = await apiNoAuth.get<GalleryCategory>(`gallery/categories/${id}/`);
        return data;
    },

    async getImagesByCategory(id: number) {
        const { data } = await apiNoAuth.get<GalleryImage[]>(`gallery/categories/${id}/images/`);
        return data;
    },

    // Images
    async getImages(filters: GalleryFilters = {}) {
        const { data } = await apiNoAuth.get<GalleryImage[]>("gallery/images/", { params: filters });
        return data;
    },

    async getImageDetail(id: number) {
        const { data } = await apiNoAuth.get<GalleryImage>(`gallery/images/${id}/`);
        return data;
    },

    async getFeaturedImages() {
        const { data } = await apiNoAuth.get<GalleryImage[]>("gallery/images/featured/");
        return data;
    },

    // Auth required methods
    async createCategory(payload: Partial<GalleryCategory>) {
        const { data } = await apiAuth.post<GalleryCategory>("gallery/categories/", payload);
        return data;
    },

    async updateCategory(id: number, payload: Partial<GalleryCategory>) {
        const { data } = await apiAuth.put<GalleryCategory>(`gallery/categories/${id}/`, payload);
        return data;
    },

    async deleteCategory(id: number) {
        const { data } = await apiAuth.delete(`gallery/categories/${id}/`);
        return data;
    },

    async uploadImage(formData: FormData) {
        const { data } = await apiAuth.post<GalleryImage>("gallery/images/", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return data;
    },

    async deleteImage(id: number) {
        const { data } = await apiAuth.delete(`gallery/images/${id}/`);
        return data;
    },

    async toggleFeatured(id: number) {
        const { data } = await apiAuth.patch(`gallery/images/${id}/toggle_featured/`);
        return data;
    },

    async reorderImage(id: number, order: number) {
        const { data } = await apiAuth.patch(`gallery/images/${id}/reorder/`, { order });
        return data;
    },
};
