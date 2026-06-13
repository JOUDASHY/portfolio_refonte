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
            style={{
              filter: "drop-shadow(2px 0px 0px rgba(246,140,9,0.65)) drop-shadow(-2px 0px 0px rgba(246,140,9,0.65)) drop-shadow(0px 2px 0px rgba(246,140,9,0.65)) drop-shadow(0px -2px 0px rgba(246,140,9,0.65)) drop-shadow(0 0 8px rgba(246,140,9,0.5)) drop-shadow(0 0 24px rgba(246,140,9,0.3))"
            }}
            priority
          />
        </div>
      </div>
    </div>
  );
}
