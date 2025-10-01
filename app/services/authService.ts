"use client";

import { apiAuth, apiNoAuth, clearTokens, setTokens } from "../lib/axiosClient";
import type { LoginResponse, RegisterResponse, ChangePasswordRequest } from "../types/auth";
import type { Profile } from "../types/models";

export const authService = {
  async login(email: string, password: string) {
    const { data } = await apiNoAuth.post<LoginResponse>("login/", { email, password });
    setTokens(data.access, data.refresh);
    return data;
  },

  async register(username: string, email: string, password: string) {
    const { data } = await apiNoAuth.post<RegisterResponse>("register/", { username, email, password });
    setTokens(data.access, data.refresh);
    return data;
  },

  async logout() {
    try {
      await apiAuth.post("logout/");
    } finally {
      clearTokens();
    }
  },

  async me() {
    const { data } = await apiAuth.get<Profile>("profile/");
    return data;
  },

  async updateProfile(payload: Partial<Profile>) {
    const { data } = await apiAuth.put<{ message: string; data: Profile }>("profile/update/", payload);
    return data;
  },

  async changePassword(payload: ChangePasswordRequest) {
    const { data } = await apiAuth.post<{ message: string }>("change-password/", payload);
    return data;
  },
  async passwordReset(payload: { email: string }) {
    const { data } = await apiNoAuth.post<{ message: string }>("password-reset/", payload);
    return data;
  },
  async passwordResetConfirm(payload: { token: string; new_password: string }) {
    const { data } = await apiNoAuth.post<{ message: string }>("password-reset-confirm/", payload);
    return data;
  },
};


