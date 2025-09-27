"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";

type ProfileData = {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location: string;
  bio: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
};

export default function ProfilePage() {
  const [form, setForm] = useState<ProfileData>({
    name: "Nilsen",
    title: "Full Stack Developer",
    email: "alitsiryeddynilsen@gmail.com",
    phone: "+261 34 12 345 67",
    location: "Isada, Fianarantsoa",
    bio: "Passionate full-stack developer and system administrator with a solid foundation in both software development and IT management. I design and build dynamic web applications and responsive websites using modern technologies like Django, Laravel, and React.",
    website: "https://nilsen.dev",
    github: "https://github.com/nilsen",
    linkedin: "https://linkedin.com/in/nilsen",
    twitter: "https://twitter.com/nilsen",
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [, setAvatarFile] = useState<File | null>(null);
  const [, setCoverFile] = useState<File | null>(null);

  function handleSave() {
    setConfirmOpen(true);
  }

  function confirmSave() {
    // Here you'd call an API to save the profile data
    setConfirmOpen(false);
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
    }
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Profil utilisateur</h1>
        <p className="text-sm text-foreground/70">Gérez vos informations personnelles et professionnelles.</p>
      </div>

      {/* Cover Image Section */}
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h2 className="mb-4 text-lg font-medium text-foreground">Image de couverture</h2>
        <div className="relative h-48 w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent/20 to-navy/20">
          <Image
            src="https://s.yimg.com/ny/api/res/1.2/RnGAnxwsXF7tAqYtImzhVA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjAy/https://media.zenfs.com/en/azcentral-the-arizona-republic/3131e8a3a9fb9eb7e01ee94cd62fe3c8"
            alt="Cover"
            fill
            sizes="800px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute bottom-4 right-4">
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
              <Button variant="secondary" className="text-sm">
                Changer l&apos;image
              </Button>
            </label>
          </div>
        </div>
        <p className="mt-2 text-xs text-foreground/60">
          Recommandé: 1200x300px, JPG ou PNG jusqu&apos;à 5MB
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Avatar Section */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="mb-4 text-lg font-medium text-foreground">Photo de profil</h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-32 w-32 overflow-hidden rounded-full ring-4 ring-accent/60">
                <Image
                  src="/logo_nil.png"
                  alt="Profile"
                  fill
                  sizes="128px"
                  className="object-contain p-2"
                />
              </div>
              <div className="text-center">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <Button variant="secondary" className="text-sm">
                    Changer la photo
                  </Button>
                </label>
                <p className="mt-1 text-xs text-foreground/60">
                  JPG, PNG jusqu&apos;à 2MB
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
            <h2 className="mb-4 text-lg font-medium text-foreground">Informations personnelles</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Nom complet"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              <Input
                label="Titre professionnel"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              <Input
                label="Téléphone"
                value={form.phone || ""}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
              <Input
                label="Localisation"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-navy/80">Biographie</label>
              <textarea
                className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Décrivez votre parcours et vos compétences..."
              />
            </div>

            <div className="mt-6">
              <h3 className="mb-3 text-sm font-medium text-foreground">Liens sociaux</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  label="Site web"
                  placeholder="https://votre-site.com"
                  value={form.website || ""}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
                <Input
                  label="GitHub"
                  placeholder="https://github.com/username"
                  value={form.github || ""}
                  onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
                />
                <Input
                  label="LinkedIn"
                  placeholder="https://linkedin.com/in/username"
                  value={form.linkedin || ""}
                  onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
                />
                <Input
                  label="Twitter"
                  placeholder="https://twitter.com/username"
                  value={form.twitter || ""}
                  onChange={(e) => setForm((f) => ({ ...f, twitter: e.target.value }))}
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <Button variant="secondary" onClick={() => window.location.reload()}>
                Annuler
              </Button>
              <Button onClick={handleSave}>Enregistrer</Button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmer la sauvegarde"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Annuler</Button>
            <Button onClick={confirmSave}>Confirmer</Button>
          </>
        }
        size="sm"
      >
        Voulez-vous sauvegarder les modifications de votre profil ?
      </Modal>
    </div>
  );
}
