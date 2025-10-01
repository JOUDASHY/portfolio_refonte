"use client";

const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(ACCESS_KEY) || window.localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(REFRESH_KEY) || window.localStorage.getItem(REFRESH_KEY);
}

export function setTokensWithStorage(access: string, refresh: string | undefined, storage: "session" | "local") {
  if (typeof window === "undefined") return;
  const target = storage === "session" ? window.sessionStorage : window.localStorage;
  target.setItem(ACCESS_KEY, access);
  if (refresh) target.setItem(REFRESH_KEY, refresh);
  setAuthCookie(access);
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(ACCESS_KEY);
  window.sessionStorage.removeItem(REFRESH_KEY);
  window.localStorage.removeItem(ACCESS_KEY);
  window.localStorage.removeItem(REFRESH_KEY);
  clearAuthCookie();
}

export function setTokens(access: string, refresh?: string) {
  setTokensWithStorage(access, refresh, "local");
}

function setAuthCookie(token: string) {
  if (typeof document === "undefined") return;
  document.cookie = `access_token=${encodeURIComponent(token)}; Path=/; SameSite=Lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = "access_token=; Path=/; Max-Age=0; SameSite=Lax";
}


