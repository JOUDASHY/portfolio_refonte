"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../hooks/LanguageProvider";
import { useTheme } from "../components/ThemeProvider";
import { useGallery } from "../hooks/useGallery";
import type { GalleryImage } from "../types/backoffice/gallery";
import Modal from "./ui/Modal";
import Button from "./ui/Button";

export default function Gallery() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const isDark = theme === "dark";
    const { categories, images, loading, filters, updateFilters } = useGallery();

    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    if (loading && images.length === 0) {
        return (
            <section id="gallery" className="py-20 bg-[#000b31]">
                <div className="mx-auto max-w-7xl px-4 text-center">
                    <div className="animate-pulse">
                        <div className="mx-auto h-8 w-48 rounded bg-gray-200 dark:bg-gray-800 mb-4" />
                        <div className="mx-auto h-4 w-64 rounded bg-gray-200 dark:bg-gray-800 mb-12" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="aspect-square rounded-2xl bg-gray-200 dark:bg-gray-800" />
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="gallery" className="relative overflow-hidden py-10 sm:py-28 bg-[#000b31]">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8 sm:mb-16">
                    <h2 className="text-2xl sm:text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
                        {t("gallery.title")} <span className="text-accent">{t("gallery.titleHighlight")}</span> {t("gallery.titleSuffix")}
                    </h2>
                    <p className="mt-2 text-sm sm:text-lg text-white/60 max-w-2xl mx-auto px-4">
                        {t("gallery.subtitle")}
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap justify-center gap-2 mb-10">
                    <button
                        onClick={() => updateFilters({ category: undefined })}
                        className={`px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-responsive-xs sm:text-sm font-medium transition-all ${filters.category === undefined
                            ? "bg-accent text-white shadow-lg shadow-accent/25"
                            : "bg-white/10 text-accent hover:bg-white/20"
                            }`}
                    >
                        {t("gallery.all")}
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateFilters({ category: cat.id })}
                            className={`px-3 py-1.5 sm:px-5 sm:py-2 rounded-full text-responsive-xs sm:text-sm font-medium transition-all ${filters.category === cat.id
                                ? "bg-accent text-white shadow-lg shadow-accent/25"
                                : "bg-white/10 text-accent hover:bg-white/20"
                                }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Masonry-like Grid */}
                <div className="columns-2 sm:columns-2 lg:columns-3 gap-2 sm:gap-6 space-y-2 sm:space-y-6">
                    {images.map((img) => (
                        <div
                            key={img.id}
                            className="relative group cursor-pointer break-inside-avoid rounded-2xl overflow-hidden bg-white/5 ring-1 ring-white/10 hover:ring-accent/50 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20"
                            onMouseEnter={() => setHoveredId(img.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedImage(img)}
                        >
                            <div className="relative overflow-hidden aspect-auto">
                                <Image
                                    src={img.image_url}
                                    alt={img.title}
                                    width={500}
                                    height={800}
                                    unoptimized
                                    className={`w-full h-auto object-cover transition-transform duration-700 ease-out ${hoveredId === img.id ? "scale-110 blur-[2px]" : "scale-100"
                                        }`}
                                    loading="lazy"
                                />

                                {/* Glass Overlay */}
                                <div
                                    className={`absolute inset-0 flex flex-col justify-end p-3 sm:p-6 bg-black/60 transition-opacity duration-500 ${hoveredId === img.id ? "opacity-100" : "opacity-0"
                                        }`}
                                >
                                    <span className="text-responsive-xs font-bold text-accent uppercase tracking-widest mb-1 sm:mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                        {img.category_name}
                                    </span>
                                    <h3 className="text-responsive-sm sm:text-xl font-bold text-white mb-1 sm:mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
                                        {img.title}
                                    </h3>
                                    <p className="hidden sm:block text-xs sm:text-sm text-white/70 line-clamp-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-150">
                                        {img.description}
                                    </p>

                                    <div className="mt-2 sm:mt-4 flex flex-wrap gap-1 sm:gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-200">
                                        {img.tags_list.slice(0, 2).map(tag => (
                                            <span key={tag} className="px-1 sm:px-2 py-0.5 rounded-md bg-white/10 text-[8px] sm:text-[10px] text-white/80 ring-1 ring-white/20">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Icon View */}
                                    <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-accent/90 text-white flex items-center justify-center scale-0 group-hover:scale-100 transition-all duration-300 delay-300 shadow-lg">
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                                    </div>
                                </div>

                                {/* Badge Featured */}
                                {img.is_featured && (
                                    <div className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent/20 backdrop-blur-md text-accent text-responsive-xs font-bold uppercase tracking-wider ring-1 ring-accent/30 z-20">
                                        {t("gallery.featured")}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {images.length === 0 && !loading && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/20">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-16 w-16 mx-auto text-accent/20 mb-4 font-light"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
                        <p className="text-accent/60 font-medium">{t("gallery.noImages")}</p>
                    </div>
                )}
            </div>

            {/* Lightbox Modal */}
            <Modal
                open={!!selectedImage}
                onClose={() => setSelectedImage(null)}
                size="xl"
                className="!p-0 !bg-black/90 !overflow-hidden border-none ring-0 shadow-2xl"
            >
                {selectedImage && (
                    <div className="relative flex flex-col md:flex-row h-full max-h-[90vh] overflow-hidden">
                        {/* Image section */}
                        <div className="relative flex-1 bg-black flex items-center justify-center p-2">
                            <Image
                                src={selectedImage.image_url}
                                alt={selectedImage.title}
                                width={1200}
                                height={1200}
                                unoptimized
                                className="max-w-full max-h-full object-contain"
                            />
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-all z-50 md:hidden"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                            </button>
                        </div>

                        {/* Content section */}
                        <div className="w-full md:w-80 bg-white dark:bg-navy p-6 flex flex-col">
                            <div className="hidden md:flex justify-end mb-4">
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-foreground/60 hover:text-foreground transition-all"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" /></svg>
                                </button>
                            </div>

                            <span className="text-[10px] font-bold text-accent uppercase tracking-widest mb-1">
                                {selectedImage.category_name}
                            </span>
                            <h2 className="text-2xl font-bold text-foreground leading-tight mb-4">
                                {selectedImage.title}
                            </h2>
                            <p className="text-sm text-foreground/70 leading-relaxed mb-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {selectedImage.description || t("gallery.noDescription")}
                            </p>

                            <div className="mt-auto space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {selectedImage.tags_list.map(tag => (
                                        <span key={tag} className="px-2 py-1 rounded-md bg-foreground/5 text-xs text-foreground/60 ring-1 ring-foreground/10">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="pt-4 border-t border-foreground/10 flex items-center justify-between text-[10px] text-foreground/40 font-medium">
                                    <span>{t("gallery.updatedAt")} {new Date(selectedImage.updated_at).toLocaleDateString()}</span>
                                    <span>ID: #{selectedImage.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(var(--accent-rgb), 0.2);
          border-radius: 10px;
        }
      `}</style>
        </section>
    );
}
