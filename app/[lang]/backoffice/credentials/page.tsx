"use client";

import { useState } from "react";
import Input from "../../../ux/ui/Input";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";

type CredentialsForm = {
  email: string;
  password: string;
  github?: string;
  linkedin?: string;
};

export default function CredentialsPage() {
  const [form, setForm] = useState<CredentialsForm>({ email: "", password: "", github: "", linkedin: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSave() {
    setConfirmOpen(true);
  }

  function confirmSave() {
    // Here you'd call an API. For now we just close the modal.
    setConfirmOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Mes identifiants</h1>
        <p className="text-sm text-foreground/70">Mettre à jour vos informations de connexion et profils.</p>
      </div>

      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="ex: nilsen@example.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-navy/80">Mot de passe</label>
            <div className="mt-1 flex items-stretch">
              <input
                className="w-full rounded-l-lg border border-black/10 bg-white px-3 py-2 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-r-lg border border-l-0 border-black/10 bg-white px-3 text-navy hover:bg-black/5"
                aria-label={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 6c-4.5 0-8.2 2.5-10 6 1.1 2.2 3 4 5.3 5.1L3 21l1.4 1.4 18-18L21 3l-3.1 3.1C16.6 5.4 14.4 5 12 5zm0 3a4 4 0 013.7 2.6l-5.1 5.1A4 4 0 0112 9z"/></svg>
                )}
              </button>
            </div>
          </div>
          <Input
            label="GitHub"
            placeholder="https://github.com/username"
            value={form.github}
            onChange={(e) => setForm((f) => ({ ...f, github: e.target.value }))}
          />
          <Input
            label="LinkedIn"
            placeholder="https://www.linkedin.com/in/username"
            value={form.linkedin}
            onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
          />
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setForm({ email: "", password: "", github: "", linkedin: "" })}>Réinitialiser</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmer l'enregistrement"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Annuler</Button>
            <Button onClick={confirmSave}>Confirmer</Button>
          </>
        }
        size="sm"
      >
        Vos identifiants seront mis à jour. Confirmez-vous cette action ?
      </Modal>
    </div>
  );
}



