"use client";

import { useState } from "react";
import { webauthnService } from "../services/backoffice/webauthnService";
import {
    prepareCreationOptions,
    prepareRequestOptions,
    serializeCredential
} from "../lib/webauthnUtils";
import { setTokens } from "../lib/axiosClient";

export function useWebAuthn() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Enregistrer un nouveau Face ID (JWT requis)
    const registerFaceId = async (deviceName: string = "Mon appareil") => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtenir les options du backend
            const options = await webauthnService.registerBegin();

            // 2. Déclencher le scan biométrique
            const publicKeyOptions = { publicKey: prepareCreationOptions(options) };
            const credential = await navigator.credentials.create(publicKeyOptions);

            if (!credential) throw new Error("Enregistrement annulé.");

            // 3. Envoyer la réponse au backend
            const serialized = serializeCredential(credential);
            const result = await webauthnService.registerComplete({
                ...serialized,
                device_name: deviceName,
            });

            return { success: true, message: result.message };
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || "Erreur d'enregistrement";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    // Se connecter via Face ID (Public)
    const loginWithFaceId = async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Obtenir le challenge
            const options = await webauthnService.loginBegin(email);

            // 2. Scan biométrique
            const publicKeyOptions = { publicKey: prepareRequestOptions(options) };
            const credential = await navigator.credentials.get(publicKeyOptions);

            if (!credential) throw new Error("Authentification annulée.");

            // 3. Vérifier la signature
            const serialized = serializeCredential(credential);
            const result = await webauthnService.loginComplete({
                email,
                ...serialized,
            });

            // 4. Sauvegarder les tokens
            setTokens(result.access, result.refresh);

            return { success: true, user: result.user };
        } catch (err: any) {
            const msg = err.response?.data?.error || err.message || "Authentification échouée";
            setError(msg);
            return { success: false, error: msg };
        } finally {
            setLoading(false);
        }
    };

    return { registerFaceId, loginWithFaceId, loading, error };
}
