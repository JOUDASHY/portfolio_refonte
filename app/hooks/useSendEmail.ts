"use client";

import { useState, useCallback } from "react";
import { emailService } from "../services/backoffice/emailService";
import type { Email } from "../types/backoffice/email";

export type SendEmailPayload = Pick<Email, "name" | "email" | "message">;

export function useSendEmail() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const send = useCallback(async (payload: SendEmailPayload) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const { data } = await emailService.create(payload);
      setSuccess(true);
      return data;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to send email";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, success, send };
}
