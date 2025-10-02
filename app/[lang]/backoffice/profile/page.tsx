"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import { authService } from "../../../services/authService";
import type { Profile } from "../../../types/models";

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
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    website: "",
    github: "",
    linkedin: "",
    twitter: "",
  });
  const [profile, setProfile] = useState<Profile | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [changePwdOpen, setChangePwdOpen] = useState<boolean>(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [, setCoverFile] = useState<File | null>(null);

  function handleSave() {
    setConfirmOpen(true);
  }

  async function confirmSave() {
    try {
      setConfirmOpen(false);
      await authService.updateProfile({
        image: avatarFile || undefined,
        about: form.bio,
        link_github: form.github || null,
        link_linkedin: form.linkedin || null,
        link_facebook: form.website || null,
        phone_number: form.phone || null,
        address: form.location || null,
      });
      await loadProfile();
    } catch {
      // noop
    }
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

  async function loadProfile() {
    try {
      setLoading(true);
      const me = await authService.me();
      setProfile(me);
      setForm((f) => ({
        name: me.username || "",
        title: f.title,
        email: me.email || "",
        phone: me.phone_number || "",
        location: me.address || "",
        bio: me.about || "",
        website: me.link_facebook || "",
        github: me.link_github || "",
        linkedin: me.link_linkedin || "",
        twitter: "",
      }));
    } catch {
      // noop
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-foreground">Profil utilisateur</h1>
          <p className="text-sm text-foreground/70">Gérez vos informations personnelles et professionnelles.</p>
        </div>
        <Button
          variant="secondary"
          onClick={async () => {
            await authService.logout();
            window.location.href = "/login";
          }}
        >
          Se déconnecter
        </Button>
      </div>

      {/* Profile quick header card */}
      <div className="mt-8 rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
        <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <div className="text-lg font-semibold text-foreground">{form.name || profile?.username || "Utilisateur"}</div>
            <div className="mt-0.5 text-sm text-foreground/70">{form.title || "—"}</div>
            <div className="mt-2 inline-flex flex-wrap gap-2">
              {form.email && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-foreground ring-1 ring-white/15">{form.email}</span>}
              {form.phone && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-foreground ring-1 ring-white/15">{form.phone}</span>}
              {form.location && <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-foreground ring-1 ring-white/15">{form.location}</span>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {form.github && (
              <a href={form.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-foreground/80 hover:bg-white/10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2C6.48 2 2 6.58 2 12.26c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.36-1.37-3.36-1.37-.45-1.18-1.11-1.49-1.11-1.49-.9-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.9.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.09 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.36 9.36 0 012.5-.35c.85 0 1.7.12 2.5.35 1.9-1.32 2.74-1.05 2.74-1.05.55 1.42.2 2.47.1 2.73.64.72 1.03 1.64 1.03 2.76 0 3.96-2.34 4.83-4.57 5.08.36.31.67.92.67 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.59.69.49A10.06 10.06 0 0022 12.26C22 6.58 17.52 2 12 2z"/></svg>
                GitHub
              </a>
            )}
            {form.linkedin && (
              <a href={form.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-foreground/80 hover:bg-white/10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M6.94 6.5A2.44 2.44 0 114.5 4.06 2.44 2.44 0 016.94 6.5zM4.75 8.75H9v10.69H4.75zM13.06 8.75H9.88v10.69h3.18v-5.77c0-1.52.29-2.99 2.17-2.99 1.85 0 1.88 1.72 1.88 3.08v5.68h3.18v-6.4c0-3.16-.68-5.6-4.37-5.6-1.77 0-2.96.97-3.47 1.9h-.05z"/></svg>
                LinkedIn
              </a>
            )}
            {form.website && (
              <a href={form.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-foreground/80 hover:bg-white/10">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 17.93A8 8 0 1120 12a8 8 0 01-7 7.93z"/></svg>
                Site
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image Section */}
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h2 className="mb-4 text-lg font-medium text-foreground">Image de couverture</h2>
        <div className="relative h-64 w-full overflow-hidden rounded-xl bg-gradient-to-r from-accent/20 to-navy/20">
          <Image
            src="https://s.yimg.com/ny/api/res/1.2/RnGAnxwsXF7tAqYtImzhVA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjAy/https://media.zenfs.com/en/azcentral-the-arizona-republic/3131e8a3a9fb9eb7e01ee94cd62fe3c8"
            alt="Cover"
            fill
            sizes="800px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          {/* Avatar overlay on cover */}
          <div className="absolute -bottom-8 left-6">
            <div className="relative h-24 w-24 overflow-hidden rounded-full ring-4 ring-accent/60 bg-white">
              <Image
                src={profile?.image || "/logo_nil.png"}
                alt="Avatar"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="mt-2">
              <label className="cursor-pointer text-xs text-foreground/80">
                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                Changer la photo
              </label>
            </div>
          </div>
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
        {/* Profile Form full width */}
        <div className="lg:col-span-3 pt-12">
        <Button onClick={() => setChangePwdOpen(true)}>Changer le mot de passe</Button>

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

      <Modal
        open={changePwdOpen}
        onClose={() => setChangePwdOpen(false)}
        title="Changer le mot de passe"
        footer={null}
        size="sm"
      >
        <ChangePasswordForm onDone={() => setChangePwdOpen(false)} />
      </Modal>
    </div>
  );
}

function ChangePasswordForm({ onDone }: { onDone?: () => void }) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(true);
      setMsg(null);
      await authService.changePassword({
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMsg("Mot de passe mis à jour.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        onDone?.();
      }, 500);
    } catch (e: unknown) {
      setMsg(e instanceof Error ? e.message : "Échec de la mise à jour");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid grid-cols-1 gap-3">
      <Input label="Ancien" type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
      <Input label="Nouveau" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
      <Input label="Confirmer" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
      <div className="flex items-center justify-end gap-2">
        {msg && <span className="text-xs text-foreground/60">{msg}</span>}
        <Button type="submit" disabled={busy}>Mettre à jour</Button>
      </div>
    </form>
  );
}
