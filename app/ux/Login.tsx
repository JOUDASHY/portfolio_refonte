"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../hooks/LanguageProvider";
import Input from "./ui/Input";
import Checkbox from "./ui/Checkbox";
import Button from "./ui/Button";

export default function Login() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = new URLSearchParams({ email }).toString();
    window.location.href = `mailto:you@example.com?subject=Login&body=${query}`;
  };

  return (
    <section className="bg-white-var py-24">
      <div className="mx-auto max-w-md px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white-var p-6 ring-1 ring-black/5 shadow-sm">
          <div className="flex justify-center">
            <Image
              src="/logo_nil.png"
              alt="Logo"
              width={72}
              height={72}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-extrabold text-navy">{t("login.title")}</h1>
          <p className="mt-1 text-navy/70">{t("login.subtitle")}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <Input
              label={t("login.email")}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label={t("login.password")}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="flex items-center justify-between">
              <Checkbox
                label={t("login.remember")}
                checked={remember}
                onChange={(e) => setRemember((e.target as HTMLInputElement).checked)}
              />
              <a href="#" className="text-sm text-accent hover:underline">
                {t("login.forgot")}
              </a>
            </div>

            <Button type="submit" className="mt-2" fullWidth>
              {t("login.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}


