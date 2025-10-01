"use client";

import { useState } from "react";
import { useLanguage } from "../../../hooks/LanguageProvider";
import Button from "../../../ux/ui/Button";
import Input from "../../../ux/ui/Input";
import Modal from "../../../ux/ui/Modal";
import { emailService } from "../../../services/backoffice/emailService";

type EntrepriseMailForm = {
  nomEntreprise: string;
  emailEntreprise: string;
  lieuEntreprise: string;
};

export default function SendCvPage() {
  const { t } = useLanguage();
  const [form, setForm] = useState<EntrepriseMailForm>({ nomEntreprise: "", emailEntreprise: "", lieuEntreprise: "" });
  const [loading, setLoading] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      await emailService.sendMailEntreprise(form);
      setSuccessOpen(true);
      setForm({ nomEntreprise: "", emailEntreprise: "", lieuEntreprise: "" });
    } catch (e: any) {
      setError(e?.message || "Échec de l'envoi");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
        <h1 className="text-2xl font-bold text-foreground">Envoyer mon CV à une entreprise</h1>
        <p className="mt-1 text-foreground/60">Renseignez les informations de l'entreprise pour envoyer votre CV.</p>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-6 max-w-2xl">
        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 ring-1 ring-red-500/20">
            {error}
          </div>
        )}
        <div className="grid grid-cols-1 gap-4">
          <Input
            label="Nom de l'entreprise"
            placeholder="Ex: ACME SA"
            value={form.nomEntreprise}
            onChange={(e) => setForm((f) => ({ ...f, nomEntreprise: e.target.value }))}
          />
          <Input
            label="Email de l'entreprise"
            type="email"
            placeholder="rh@acme.com"
            value={form.emailEntreprise}
            onChange={(e) => setForm((f) => ({ ...f, emailEntreprise: e.target.value }))}
          />
          <Input
            label="Lieu de l'entreprise"
            placeholder="Ex: Paris, France"
            value={form.lieuEntreprise}
            onChange={(e) => setForm((f) => ({ ...f, lieuEntreprise: e.target.value }))}
          />
        </div>

        <div className="mt-6 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setForm({ nomEntreprise: "", emailEntreprise: "", lieuEntreprise: "" })}>Réinitialiser</Button>
          <Button onClick={handleSubmit} disabled={loading || !form.nomEntreprise || !form.emailEntreprise || !form.lieuEntreprise}>
            {loading ? "Envoi…" : "Envoyer"}
          </Button>
        </div>
      </div>

      <Modal
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        title="CV envoyé"
        size="sm"
        footer={<Button onClick={() => setSuccessOpen(false)}>Fermer</Button>}
      >
        Votre CV a été envoyé avec succès à l'entreprise.
      </Modal>
    </div>
  );
}


