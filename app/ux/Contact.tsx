"use client";

import { useState } from "react";
import { useLanguage } from "../hooks/LanguageProvider";

export default function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  return (
    <section id="contact" className="relative bg-background py-24">
      <div className="pointer-events-none absolute inset-0 opacity-50" aria-hidden>
        <div className="absolute left-0 top-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-64 w-64 translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">{t("contact.title")}</h2>
          <p className="mt-2 text-lg text-navy/70">{t("contact.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form
              className="rounded-2xl bg-white-var p-8 ring-1 ring-black/5 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-navy/80" htmlFor="name">{t("contact.name")}</label>
                  <div className="mt-2 relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40">👤</span>
                    <input id="name" name="name" type="text" className="mt-0 w-full rounded-lg border border-black/10 bg-white-var pl-9 pr-4 py-2.5 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="John Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-navy/80" htmlFor="email">{t("contact.email")}</label>
                  <div className="mt-2 relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy/40">✉️</span>
                    <input id="email" name="email" type="email" className="mt-0 w-full rounded-lg border border-black/10 bg-white-var pl-9 pr-4 py-2.5 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="john@example.com" />
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <label className="block text-sm font-medium text-navy/80" htmlFor="message">{t("contact.message")}</label>
                <div className="mt-2 relative">
                  <textarea id="message" name="message" rows={6} className="w-full rounded-lg border border-black/10 bg-white-var px-4 py-3 text-navy placeholder:text-navy/40 focus:outline-none focus:ring-2 focus:ring-accent" placeholder="Hello..." />
                  <span className="pointer-events-none absolute right-3 bottom-3 text-navy/30 text-xs">max 1000</span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 font-medium text-navy hover:brightness-110">
                  {t("contact.send")}
                </button>
                {sent && (
                  <span className="text-sm text-navy/70">{t("contact.success")}</span>
                )}
              </div>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white-var p-6 ring-1 ring-black/5 shadow-sm">
              <div>
                <p className="text-navy font-semibold">Contact direct</p>
                <p className="mt-2 text-navy/80">Email: <a className="underline text-accent" href="mailto:you@example.com">you@example.com</a></p>
              </div>
              <div className="mt-4">
                <p className="text-navy font-semibold">Réseaux</p>
                <div className="mt-2 flex items-center gap-3">
                  <a href="#" className="rounded-full bg-navy text-white px-3 py-1 text-sm hover:opacity-90">LinkedIn</a>
                  <a href="#" className="rounded-full bg-navy text-white px-3 py-1 text-sm hover:opacity-90">GitHub</a>
                  <a href="#" className="rounded-full bg-navy text-white px-3 py-1 text-sm hover:opacity-90">X</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


