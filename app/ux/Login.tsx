"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/authService";
import { setTokensWithStorage } from "../lib/axiosClient";
import Loading from "../[lang]/loading";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname?.split("/")[1] || "en";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      // Persist tokens according to remember choice
      setTokensWithStorage(res.access, res.refresh, remember ? "local" : "session");
      router.push(`/${currentLang}/backoffice/dashboard`);
    } catch (err: unknown) {
      const message = (err && typeof err === 'object' && 'response' in err && 
                      err.response && typeof err.response === 'object' && 'data' in err.response &&
                      err.response.data && typeof err.response.data === 'object' && 'detail' in err.response.data)
                      ? String(err.response.data.detail)
                      : (err instanceof Error ? err.message : "Login failed");
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section 
      className="py-8 sm:py-12 relative min-h-screen flex items-center bg-cover bg-center"
      style={{ backgroundImage: 'url(https://wallpapercave.com/wp/wp10027554.jpg)' }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black/50" />
      
      {loading && <Loading />}
      <div className={`relative mx-auto w-full max-w-2xl px-4 sm:px-8 lg:px-12 ${loading ? "pointer-events-none select-none" : ""}`}>
        <div className="rounded-2xl bg-white-var p-10 sm:p-12 ring-1 ring-black/5 shadow-lg">
          <div className="flex justify-center">
            <Image
              src="/logo_nil.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy text-center">{t("login.title")}</h1>
          <p className="mt-2 text-lg text-navy/70 text-center">{t("login.subtitle")}</p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}
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

            <Button type="submit" className="mt-2" fullWidth disabled={loading}>
              {loading ? t("loading") : t("login.submit")}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}


