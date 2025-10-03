"use client";

import { useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";
import VisitStats from "./VisitStats";
import { useSendEmail } from "../hooks/useSendEmail";
import Input from "./ui/Input";
import Textarea from "./ui/Textarea";

export default function Contact() {
  const { t } = useLanguage();
  const { loading, error, success, send } = useSendEmail();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [invalid, setInvalid] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setInvalid(false);

    const isEmail = /.+@.+\..+/.test(email.trim());
    if (!name.trim() || !isEmail || !message.trim()) {
      setInvalid(true);
      return;
    }

    try {
      await send({ name: name.trim(), email: email.trim(), message: message.trim() });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      // handled by hook
    }
  }

  return (
    <section id="contact" className="relative bg-background py-24">
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
        <div className="absolute left-0 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-navy">{t("contact.title")}</h2>
          <p className="mt-2 text-sm sm:text-lg text-navy/70">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form
              className="rounded-2xl bg-white-var p-4 sm:p-8 ring-1 ring-black/5 shadow-sm"
              onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                <Input
                  label={t("contact.name")}
                  name="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
                <Input
                  label={t("contact.email")}
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="mt-4 sm:mt-6">
                <Textarea
                  label={t("contact.message")}
                  name="message"
                  rows={4}
                  placeholder="Hello..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>

              {invalid && (
                <div className="mt-3 rounded-lg bg-yellow-500/10 px-3 py-2 text-xs text-yellow-600 ring-1 ring-yellow-500/20">
                  Merci de renseigner un nom, un email valide et un message.
                </div>
              )}
              {error && (
                <div className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-600 ring-1 ring-red-500/20">
                  Échec de l&apos;envoi{error ? `: ${error}` : "."}
                </div>
              )}
              {success && (
                <div className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-xs text-green-600 ring-1 ring-green-500/20">
                  Merci ! Votre message a bien été envoyé.
                </div>
              )}

              <div className="mt-4 sm:mt-6 flex items-center gap-2 sm:gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-accent px-4 sm:px-6 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-navy hover:brightness-110 disabled:opacity-60"
                  disabled={loading}
                >
                  {loading ? "Envoi…" : t("contact.send")}
                </button>
                {success && (
                  <span className="text-xs sm:text-sm text-navy/70">{t("contact.success")}</span>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white-var p-4 sm:p-6 ring-1 ring-black/5 shadow-sm">
              <div>
                <p className="text-sm sm:text-base text-navy font-semibold">Contact direct</p>
                <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-navy/80">Email: <a className="underline text-accent" href="mailto:you@example.com">you@example.com</a></p>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-sm sm:text-base text-navy font-semibold">Réseaux</p>
                <div className="mt-1 sm:mt-2 flex items-center gap-2 sm:gap-3">
                  <a href="#" className="rounded-full bg-navy text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm hover:opacity-90">LinkedIn</a>
                  <a href="#" className="rounded-full bg-navy text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm hover:opacity-90">GitHub</a>
                  <a href="#" className="rounded-full bg-navy text-white px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-sm hover:opacity-90">X</a>
                </div>
              </div>
              
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-black/10">
                <p className="text-sm sm:text-base text-navy font-semibold mb-2">Statistiques</p>
                <VisitStats className="text-navy/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


