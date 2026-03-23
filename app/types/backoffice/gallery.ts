export type GalleryCategory = {
    id: number;
    name: string;
    description: string | null;
    image_count: number;
    created_at: string;
};

export type GalleryImage = {
    id: number;
    category: number;
    category_name: string;
    title: string;
    description: string | null;
    image: string;
    image_url: string;
    tags: string | null;
    tags_list: string[];
    is_featured: boolean;
    order: number;
    created_at: string;
    updated_at: string;
};

export type GalleryFilters = {
    category?: number;
    featured?: boolean;
    search?: string;
    ordering?: string;
};
