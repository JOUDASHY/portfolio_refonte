"use client";

import { useState, useEffect } from "react";
import { galleryService } from "../../../services/backoffice/galleryService";
import type { GalleryCategory, GalleryImage } from "../../../types/backoffice/gallery";
import Button from "../../../ux/ui/Button";
import Input from "../../../ux/ui/Input";
import Modal from "../../../ux/ui/Modal";
import Image from "next/image";

export default function GalleryManagement() {
    const [activeTab, setActiveTab] = useState<"images" | "categories">("images");
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    // Modals
    const [isCatModalOpen, setIsCatModalOpen] = useState(false);
    const [isImgModalOpen, setIsImgModalOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<GalleryCategory | null>(null);

    // Form Categories
    const [catName, setCatName] = useState("");
    const [catDesc, setCatDesc] = useState("");

    // Form Images
    const [imgTitle, setImgTitle] = useState("");
    const [imgDesc, setImgDesc] = useState("");
    const [imgCat, setImgCat] = useState<number>(0);
    const [imgTags, setImgTags] = useState("");
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [isFeatured, setIsFeatured] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const [cats, imgs] = await Promise.all([
                galleryService.getCategories(),
                galleryService.getImages(),
            ]);
            setCategories(cats);
            setImages(imgs);
            if (cats.length > 0 && !imgCat) setImgCat(cats[0].id);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    // --- Handlers Categories ---
    async function handleSaveCategory() {
        try {
            if (editingCat) {
                await galleryService.updateCategory(editingCat.id, { name: catName, description: catDesc });
            } else {
                await galleryService.createCategory({ name: catName, description: catDesc });
            }
            setIsCatModalOpen(false);
            setCatName("");
            setCatDesc("");
            setEditingCat(null);
            fetchData();
        } catch (err) { alert("Erreur lors de la sauvegarde"); }
    }

    async function handleDeleteCategory(id: number) {
        if (!confirm("Supprimer cette catégorie et ses images ?")) return;
        await galleryService.deleteCategory(id);
        fetchData();
    }

    // --- Handlers Images ---
    async function handleUploadImage() {
        if (!imgFile) return alert("Veuillez choisir un fichier");
        try {
            const fd = new FormData();
            fd.append("image", imgFile);
            fd.append("title", imgTitle);
            fd.append("description", imgDesc);
            fd.append("category", String(imgCat));
            fd.append("tags", imgTags);
            fd.append("is_featured", String(isFeatured));

            await galleryService.uploadImage(fd);
            setIsImgModalOpen(false);
            resetImgForm();
            fetchData();
        } catch (err) { alert("Erreur lors de l'upload"); }
    }

    function resetImgForm() {
        setImgTitle("");
        setImgDesc("");
        setImgTags("");
        setImgFile(null);
        setIsFeatured(false);
    }

    async function handleDeleteImage(id: number) {
        if (!confirm("Supprimer cette image ?")) return;
        await galleryService.deleteImage(id);
        fetchData();
    }

    async function toggleFeatured(id: number) {
        await galleryService.toggleFeatured(id);
        fetchData();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-foreground">Gestion de la Galerie</h1>
                <div className="flex gap-2">
                    <Button onClick={() => { setEditingCat(null); setCatName(""); setCatDesc(""); setIsCatModalOpen(true); }} variant="secondary">
                        + Catégorie
                    </Button>
                    <Button onClick={() => setIsImgModalOpen(true)}>
                        + Image
                    </Button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-foreground/10">
                <button
                    onClick={() => setActiveTab("images")}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "images" ? "border-b-2 border-accent text-accent" : "text-foreground/60 hover:text-foreground"}`}
                >
                    Images ({images.length})
                </button>
                <button
                    onClick={() => setActiveTab("categories")}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${activeTab === "categories" ? "border-b-2 border-accent text-accent" : "text-foreground/60 hover:text-foreground"}`}
                >
                    Catégories ({categories.length})
                </button>
            </div>

            {loading ? (
                <div className="py-20 text-center text-foreground/40">Chargement...</div>
            ) : (
                <>
                    {activeTab === "images" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {images.map(img => (
                                <div key={img.id} className="group relative aspect-square rounded-xl bg-white/5 ring-1 ring-white/10 overflow-hidden">
                                    <Image src={img.image_url} alt={img.title} fill unoptimized className="object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white font-bold truncate">{img.title}</p>
                                        <p className="text-white/60 text-xs mb-3">{img.category_name}</p>
                                        <div className="flex justify-between">
                                            <button onClick={() => toggleFeatured(img.id)} className={`p-2 rounded-lg ${img.is_featured ? "text-yellow-400" : "text-white/40"}`}>
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2l2.39 4.84L20 8l-3.5 3.41L17.48 18 12 15.6 6.52 18 7.5 11.41 4 8l5.61-1.16L12 2z" /></svg>
                                            </button>
                                            <button onClick={() => handleDeleteImage(img.id)} className="p-2 text-red-400 hover:bg-red-400/20 rounded-lg">
                                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === "categories" && (
                        <div className="grid grid-cols-1 gap-4">
                            {categories.map(cat => (
                                <div key={cat.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl ring-1 ring-white/10">
                                    <div>
                                        <h3 className="font-bold text-foreground">{cat.name}</h3>
                                        <p className="text-sm text-foreground/60">{cat.description || "Pas de description"}</p>
                                        <span className="text-[10px] text-accent uppercase font-bold">{cat.image_count} images</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => { setEditingCat(cat); setCatName(cat.name); setCatDesc(cat.description || ""); setIsCatModalOpen(true); }} className="p-2 text-foreground/40 hover:text-accent">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 000-1.41l-2.34-2.34a.996.996 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" /></svg>
                                        </button>
                                        <button onClick={() => handleDeleteCategory(cat.id)} className="p-2 text-foreground/40 hover:text-red-400">
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Modal Catégorie */}
            <Modal open={isCatModalOpen} onClose={() => setIsCatModalOpen(false)} title={editingCat ? "Modifier la catégorie" : "Nouvelle catégorie"}>
                <div className="space-y-4">
                    <Input label="Nom" value={catName} onChange={e => setCatName(e.target.value)} />
                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
                        <textarea
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-foreground focus:ring-2 focus:ring-accent outline-none"
                            rows={3}
                            value={catDesc}
                            onChange={e => setCatDesc(e.target.value)}
                        />
                    </div>
                    <Button onClick={handleSaveCategory} fullWidth>Enregistrer</Button>
                </div>
            </Modal>

            {/* Modal Image */}
            <Modal open={isImgModalOpen} onClose={() => setIsImgModalOpen(false)} title="Uploader une image">
                <div className="space-y-4">
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center">
                        {imgFile ? (
                            <p className="text-sm text-accent font-medium">{imgFile.name}</p>
                        ) : (
                            <label className="cursor-pointer group">
                                <input type="file" className="hidden" accept="image/*" onChange={e => setImgFile(e.target.files?.[0] || null)} />
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 mx-auto text-foreground/20 group-hover:text-accent transition-colors"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
                                <p className="text-xs text-foreground/40 mt-2">Cliquez pour choisir une photo</p>
                            </label>
                        )}
                    </div>
                    <Input label="Titre" value={imgTitle} onChange={e => setImgTitle(e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-1">Catégorie</label>
                            <select
                                className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-foreground focus:ring-2 focus:ring-accent outline-none"
                                value={imgCat}
                                onChange={e => setImgCat(Number(e.target.value))}
                            >
                                {categories.map(c => <option key={c.id} value={c.id} className="bg-navy">{c.name}</option>)}
                            </select>
                        </div>
                        <Input label="Tags (séparés par ,)" value={imgTags} onChange={e => setImgTags(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-foreground/80 mb-1">Description</label>
                        <textarea
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-foreground focus:ring-2 focus:ring-accent outline-none"
                            rows={2}
                            value={imgDesc}
                            onChange={e => setImgDesc(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} />
                        <label className="text-sm text-foreground/80">Mettre en avant (Favori)</label>
                    </div>
                    <Button onClick={handleUploadImage} fullWidth>Uploader</Button>
                </div>
            </Modal>
        </div>
    );
}
