"use client";

import { useState } from "react";
import Button from "@/app/ux/ui/Button";
import Input from "@/app/ux/ui/Input";
import { useProspects } from "@/app/hooks/useProspects";
import { PROSPECT_SOURCE_LABELS } from "@/app/types/backoffice/prospect";
import { useLanguage } from "@/app/hooks/LanguageProvider";
import { useRouter } from "next/navigation";

export default function NewProspectPage() {
  const router = useRouter();
  const { t, lang } = useLanguage();
  const { create } = useProspects();
  const [saving, setSaving] = useState(false);
  
  const [form, setForm] = useState({
    company_name: "",
    contact_name: "",
    email: "",
    phone: "",
    whatsapp_phone: "",
    facebook_url: "",
    address: "",
    city: "",
    google_maps_url: "",
    website_url: "",
    has_website: false,
    has_facebook: false,
    estimated_value: 0,
    source: "google_maps" as any,
  });

  async function handleSubmit() {
    setSaving(true);
    try {
      await create(form);
      alert(lang === "fr" ? "Prospect créé avec succès" : "Prospect created successfully");
      router.push("/backoffice/prospects");
    } catch (e) {
      alert(lang === "fr" ? "Échec de la création" : "Creation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {lang === "fr" ? "Nouveau prospect" : "New Prospect"}
          </h1>
          <p className="text-sm text-foreground/60 mt-1">
            {lang === "fr" ? "Ajouter un nouveau prospect" : "Add a new prospect"}
          </p>
        </div>
        <Button variant="secondary" onClick={() => router.push("/backoffice/prospects")}>
          {lang === "fr" ? "Annuler" : "Cancel"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Input
            label={lang === "fr" ? "Entreprise *" : "Company *"}
            value={form.company_name}
            onChange={(e: any) => setForm((f) => ({ ...f, company_name: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Contact" : "Contact Name"}
            value={form.contact_name}
            onChange={(e: any) => setForm((f) => ({ ...f, contact_name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e: any) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Téléphone" : "Phone"}
            value={form.phone}
            onChange={(e: any) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "WhatsApp (optionnel)" : "WhatsApp (optional)"}
            value={form.whatsapp_phone}
            onChange={(e: any) => setForm((f) => ({ ...f, whatsapp_phone: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Adresse" : "Address"}
            value={form.address}
            onChange={(e: any) => setForm((f) => ({ ...f, address: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Ville" : "City"}
            value={form.city}
            onChange={(e: any) => setForm((f) => ({ ...f, city: e.target.value }))}
          />
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-4">
          <Input
            label="Google Maps URL"
            value={form.google_maps_url}
            onChange={(e: any) => setForm((f) => ({ ...f, google_maps_url: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Site web" : "Website"}
            value={form.website_url}
            onChange={(e: any) => setForm((f) => ({ ...f, website_url: e.target.value }))}
          />
          <Input
            label={lang === "fr" ? "Facebook URL (optionnel)" : "Facebook URL (optional)"}
            value={form.facebook_url}
            onChange={(e: any) => setForm((f) => ({ ...f, facebook_url: e.target.value }))}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {lang === "fr" ? "Source" : "Source"}
            </label>
            <select
              value={form.source}
              onChange={(e: any) => setForm((f) => ({ ...f, source: e.target.value }))}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {Object.entries(PROSPECT_SOURCE_LABELS).map(([key, labels]) => (
                <option key={key} value={key}>
                  {labels[lang === "fr" ? "fr" : "en"]}
                </option>
              ))}
            </select>
          </div>

          <Input
            label={lang === "fr" ? "Valeur estimée (€)" : "Estimated Value (€)"}
            type="number"
            value={form.estimated_value}
            onChange={(e: any) => setForm((f) => ({ ...f, estimated_value: parseFloat(e.target.value) || 0 }))}
          />

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.has_website}
                onChange={(e) => setForm((f) => ({ ...f, has_website: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">
                {lang === "fr" ? "A un site web" : "Has website"}
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.has_facebook}
                onChange={(e) => setForm((f) => ({ ...f, has_facebook: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-foreground">
                {lang === "fr" ? "A Facebook" : "Has Facebook"}
              </span>
            </label>
          </div>
        </div>
      </div>

      <Button onClick={handleSubmit} disabled={saving || !form.company_name}>
        {saving ? (lang === "fr" ? "Création..." : "Creating...") : (lang === "fr" ? "Créer" : "Create")}
      </Button>
    </div>
  );
}
