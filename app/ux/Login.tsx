"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "../services/authService";
import { apiAuth, apiNoAuth, clearTokens, setTokens, setTokensWithStorage } from "../lib/axiosClient";
import { useWebAuthn } from "../hooks/useWebAuthn";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const currentLang = pathname?.split("/")[1] || "en";

  // WebAuthn Login
  const { loginWithFaceId, loading: webauthnLoading, error: webauthnError } = useWebAuthn();

  const onFaceIdLogin = async () => {
    if (!email) {
      setError("Veuillez saisir votre email pour utiliser Face ID.");
      return;
    }
    setError(null);
    const res = await loginWithFaceId(email);
    if (res.success) {
      router.push(`/${currentLang}/backoffice/dashboard`);
    } else if (res.error) {
      setError(res.error);
    }
  };

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

            <div className="relative">
              <Input
                label={t("login.password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-[34px] text-navy/40 hover:text-navy/70 transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24M1 1l22 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" fill="none"/>
                  </svg>
                )}
              </button>
            </div>

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

            <Button type="submit" className="mt-2" fullWidth disabled={loading || webauthnLoading}>
              {loading ? t("loading") : t("login.submit")}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-navy/10"></div></div>
              <div className="relative flex justify-center text-sm"><span className="bg-white px-2 text-navy/40">OU</span></div>
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={onFaceIdLogin}
              disabled={loading || webauthnLoading}
              className="group flex items-center justify-center gap-2 border-navy/20 hover:border-accent hover:bg-accent/5 transition-all text-navy/80 hover:text-accent"
            >
              {webauthnLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Scan en cours...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-9h10v2H7z" /></svg>
                  Se connecter avec Face ID
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}


