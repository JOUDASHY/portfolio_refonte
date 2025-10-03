"use client";

import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative h-40 w-40">
        <div className="absolute inset-0 rounded-full border-4 border-white/10" />
        <div className="absolute inset-0 rounded-full border-t-4 border-accent animate-spin" />
        <div className="absolute inset-4 rounded-full bg-accent/10 blur-md" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Image
            src="/logo_nil.png"
            alt="Loading logo"
            width={96}
            height={96}
            className="drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]"
            priority
          />
        </div>
      </div>
    </div>
  );
}
