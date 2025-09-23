"use client";

import Image from "next/image";
import { useLanguage } from "../hooks/LanguageProvider";

export default function About() {
  const { t } = useLanguage();
  return (
    <section id="about" className="relative bg-white-var py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy">
            {t("about.title")}
          </h2>
          <p className="mt-2 text-lg text-navy/70">{t("about.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white-var p-6 ring-1 ring-black/5 shadow-sm">
              <div className="flex items-center gap-4">
                <span className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-accent/60">
                  <Image src="/logo_nil.png" alt="Profile" fill sizes="80px" className="object-contain p-1" />
                </span>
                <div>
                  <p className="text-navy font-semibold">{t("about.profile.label")}</p>
                  <p className="text-navy/70">{t("about.subtitle")}</p>
                </div>
              </div>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-navy/60">{t("about.profile.location")}</dt>
                  <dd className="text-navy">—</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-navy/60">{t("about.profile.status")}</dt>
                  <dd className="text-navy">—</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-navy/60">{t("about.profile.years")}</dt>
                  <dd className="text-navy">3</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white-var p-8 ring-1 ring-black/5 shadow-sm">
              <p className="text-navy/90 leading-relaxed">{t("about.description")}</p>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Feature title={t("about.stack.title")} items={[
                  t("about.stack.frontend"),
                  t("about.stack.backend"),
                  t("about.stack.database"),
                  t("about.stack.tooling"),
                ]} />
              </div>

              <div className="mt-6">
                <a href="#contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 font-medium text-navy hover:brightness-110">
                  {t("about.ctaContact")}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
      <h3 className="text-navy font-semibold">{title}</h3>
      <ul className="mt-3 space-y-2 text-navy/80 text-sm">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}


