"use client";

import { apiAuth, apiNoAuth } from "../../lib/axiosClient";

export interface WebAuthnCredential {
    id: number;
    device_name: string;
    aaguid: string;
    created_at: string;
    last_used_at: string | null;
}

export const webauthnService = {
    // Enregistrement
    async registerBegin() {
        const { data } = await apiAuth.post("webauthn/register/begin/");
        return data;
    },

    async registerComplete(payload: any) {
        const { data } = await apiAuth.post<{ message: string }>("webauthn/register/complete/", payload);
        return data;
    },

    // Authentification
    async loginBegin(email: string) {
        const { data } = await apiNoAuth.post("webauthn/login/begin/", { email });
        return data;
    },

    async loginComplete(payload: any) {
        const { data } = await apiNoAuth.post<{
            access: string;
            refresh: string;
            user: any;
            message: string;
        }>("webauthn/login/complete/", payload);
        return data;
    },

    // Gestion des credentials
    async getCredentials() {
        const { data } = await apiAuth.get<WebAuthnCredential[]>("webauthn/credentials/");
        return data;
    },

    async deleteCredential(id: number) {
        const { data } = await apiAuth.delete<{ message: string }>(`webauthn/credentials/${id}/`);
        return data;
    },
};
