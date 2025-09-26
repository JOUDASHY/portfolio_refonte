"use client";

import Image from "next/image";
import { ReactNode } from "react";

type BannerProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  bgSrc: string;
  heightClass?: string;
  overlayClass?: string;
  align?: "left" | "center" | "right";
  children?: ReactNode;
};

export default function Banner({
  title,
  subtitle,
  bgSrc,
  heightClass = "h-[320px] sm:h-[420px] lg:h-[520px]",
  overlayClass = "bg-black/40",
  align = "center",
  children,
}: BannerProps) {
  const alignment =
    align === "left"
      ? "items-start text-left"
      : align === "right"
      ? "items-end text-right"
      : "items-center text-center";

  return (
    <section className={`relative isolate ${heightClass} overflow-hidden`}>
      <Image
        src={bgSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex w-full flex-col justify-center gap-3 text-white ${alignment}`}>
          {title ? (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
              {title}
            </h1>
          ) : null}
          {subtitle ? (
            <p className="text-base sm:text-lg lg:text-xl text-white/90">{subtitle}</p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}


