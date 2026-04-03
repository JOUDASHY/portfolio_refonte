"use client";

import { useState } from "react";
import Button from "../../../ux/ui/Button";

const QR_URL = "https://test-back.unityfianar.site/api/qrcode/";

export default function QrCodePage() {
  const [imgError, setImgError] = useState(false);

  const handleDownload = async () => {
    try {
      const res = await fetch(QR_URL);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "qrcode.png";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // noop
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Mon QR Code</h1>
        <p className="text-sm text-foreground/60 mt-1">Scannez ce QR code pour accéder à votre portfolio.</p>
      </div>

      <div className="flex flex-col items-center gap-6 rounded-2xl bg-white/5 ring-1 ring-white/10 p-8 max-w-sm">
        {imgError ? (
          <div className="flex h-64 w-64 items-center justify-center rounded-xl bg-white/10 text-foreground/40 text-sm text-center px-4">
            Impossible de charger le QR code
          </div>
        ) : (
          <div className="rounded-xl overflow-hidden bg-white p-3 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={QR_URL}
              alt="QR Code portfolio"
              width={220}
              height={220}
              className="block"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Button onClick={handleDownload} disabled={imgError}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path d="M5 20h14v-2H5v2zM9 4h6v6h4l-7 7-7-7h4V4z" />
            </svg>
            Télécharger
          </Button>
          <Button variant="secondary" onClick={() => window.open(QR_URL, "_blank")}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
            </svg>
            Ouvrir
          </Button>
        </div>
      </div>
    </div>
  );
}
