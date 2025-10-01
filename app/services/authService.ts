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

  async meNilsen() {
    const { data } = await apiAuth.get<Profile>("NilsenProfile/");
    return data;
  },

  async updateProfile(payload: Partial<Omit<Profile, "image">> & { image?: File | null }) {
    const form = new FormData();
    if (payload.image instanceof File) form.append("image", payload.image);
    if (payload.about != null) form.append("about", String(payload.about));
    if (payload.date_of_birth != null) form.append("date_of_birth", String(payload.date_of_birth));
    if (payload.link_facebook != null) form.append("link_facebook", String(payload.link_facebook));
    if (payload.link_linkedin != null) form.append("link_linkedin", String(payload.link_linkedin));
    if (payload.link_github != null) form.append("link_github", String(payload.link_github));
    if (payload.phone_number != null) form.append("phone_number", String(payload.phone_number));
    if (payload.address != null) form.append("address", String(payload.address));
    const { data } = await apiAuth.put<{ message: string; data: Profile }>("profile/update/", form);
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


