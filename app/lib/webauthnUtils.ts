/**
 * Convertit un ArrayBuffer en chaîne base64url
 */
export function bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let str = '';
    for (const byte of bytes) {
        str += String.fromCharCode(byte);
    }
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

/**
 * Convertit une chaîne base64url en ArrayBuffer
 */
export function base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url
        .replace(/-/g, '+')
        .replace(/_/g, '/')
        .padEnd(base64url.length + ((4 - (base64url.length % 4)) % 4), '=');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
}

/**
 * Prépare les options de création reçues du backend pour navigator.credentials.create()
 */
export function prepareCreationOptions(options: any): any {
    return {
        ...options,
        challenge: base64urlToBuffer(options.challenge),
        user: {
            ...options.user,
            id: base64urlToBuffer(options.user.id),
        },
        excludeCredentials: (options.excludeCredentials || []).map((cred: any) => ({
            ...cred,
            id: base64urlToBuffer(cred.id),
        })),
    };
}

/**
 * Prépare les options de requête reçues du backend pour navigator.credentials.get()
 */
export function prepareRequestOptions(options: any): any {
    return {
        ...options,
        challenge: base64urlToBuffer(options.challenge),
        allowCredentials: (options.allowCredentials || []).map((cred: any) => ({
            ...cred,
            id: base64urlToBuffer(cred.id),
        })),
    };
}

/**
 * Sérialise la réponse du credential pour l'envoyer au backend
 */
export function serializeCredential(credential: any): any {
    const response = credential.response;
    const serialized: any = {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        response: {},
    };

    // Réponse d'enregistrement
    if (response.attestationObject) {
        serialized.response = {
            clientDataJSON: bufferToBase64url(response.clientDataJSON),
            attestationObject: bufferToBase64url(response.attestationObject),
        };
    }
    // Réponse d'authentification
    else {
        serialized.response = {
            clientDataJSON: bufferToBase64url(response.clientDataJSON),
            authenticatorData: bufferToBase64url(response.authenticatorData),
            signature: bufferToBase64url(response.signature),
            userHandle: response.userHandle
                ? bufferToBase64url(response.userHandle)
                : null,
        };
    }

    return serialized;
}
