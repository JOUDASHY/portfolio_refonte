"use client";

import { useState } from "react";
import Button from "../../../ux/ui/Button";
import Modal from "../../../ux/ui/Modal";
import { useLanguage } from "../../../hooks/LanguageProvider";

export default function LanguageSettingsPage() {
  const { lang, setLang } = useLanguage();
  const [tempLang, setTempLang] = useState<string>(lang);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleSave() {
    setConfirmOpen(true);
  }

  function confirmSave() {
    setLang(tempLang as "en" | "fr");
    setConfirmOpen(false);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Langue</h1>
        <p className="text-sm text-foreground/70">Choisissez la langue par défaut du backoffice et du site.</p>
      </div>

      <div className="rounded-2xl bg-white/5 p-5 ring-1 ring-white/10">
        <label className="block text-sm font-medium text-navy/80">Langue par défaut</label>
        <select
          className="mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-navy focus:outline-none focus:ring-2 focus:ring-accent"
          value={tempLang}
          onChange={(e) => setTempLang(e.target.value)}
        >
          <option value="fr">Français (fr)</option>
          <option value="en">English (en)</option>
        </select>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={() => setTempLang(lang)}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      </div>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirmer la langue"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Annuler</Button>
            <Button onClick={confirmSave}>Confirmer</Button>
          </>
        }
        size="sm"
      >
        La langue par défaut sera changée en &quot;{tempLang}&quot;. Continuer ?
      </Modal>
    </div>
  );
}



