"use client";

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { createHttp } from "./base";
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from "./tokens";

export const apiNoAuth: AxiosInstance = createHttp();
export const apiAuth: AxiosInstance = createHttp();

let isRefreshing = false;
let pendingQueue: Array<{ resolve: (value: string) => void; reject: (reason?: unknown) => void }> = [];

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => pendingQueue.push({ resolve, reject }));
  }
  isRefreshing = true;
  try {
    const refresh = getRefreshToken();
    if (!refresh) throw new Error("No refresh token");
    const res = await apiNoAuth.post<{ access: string }>("api/token/refresh/", { refresh });
    const newAccess = res.data.access;
    setTokens(newAccess);
    pendingQueue.forEach((p) => p.resolve(newAccess));
    pendingQueue = [];
    return newAccess;
  } catch (err) {
    pendingQueue.forEach((p) => p.reject(err));
    pendingQueue = [];
    clearTokens();
    throw err;
  } finally {
    isRefreshing = false;
  }
}

apiAuth.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    (config.headers as Record<string, string>) = (config.headers as Record<string, string>) || {};
    (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

apiAuth.interceptors.response.use(
  (r: AxiosResponse) => r,
  async (error) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    const status = error.response?.status;
    if (status === 401 && !original._retry) {
      original._retry = true;
      try {
        const newAccess = await refreshAccessToken();
        original.headers = original.headers || {};
        (original.headers as Record<string, string>)["Authorization"] = `Bearer ${newAccess}`;
        return apiAuth(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);


