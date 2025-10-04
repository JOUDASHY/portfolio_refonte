"use client";

import Image from "next/image";
import { ReactNode, useMemo } from "react";

type BannerProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  bgSrc: string;
  heightClass?: string;
  overlayClass?: string;
  align?: "left" | "center" | "right";
  children?: ReactNode;
};

function normalizeYouTube(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace("www.", "");
    if (host.endsWith("google.com") && u.pathname.startsWith("/url")) {
      const target = u.searchParams.get("url");
      if (target) return normalizeYouTube(target);
    }
    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id || null;
    }
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtube-nocookie.com") {
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/").pop() || null;
      const id = u.searchParams.get("v");
      return id || null;
    }
  } catch {}
  return null;
}

function toYouTubeEmbed(url: string): string | null {
  const id = normalizeYouTube(url);
  if (!id) return null;
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&modestbranding=1&playsinline=1&rel=0`;
}

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

  const embedSrc = useMemo(() => toYouTubeEmbed(bgSrc), [bgSrc]);

  return (
    <section className={`relative isolate ${heightClass} overflow-hidden`}>
      {embedSrc ? (
        <div className="absolute inset-0 -z-10">
          {/* Parallax effect: fixed background video */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
            <iframe
              className="w-full aspect-video fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
              src={embedSrc}
              title="Video background"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder={0}
              style={{
                width: '100vw',
                height: '56.25vw', // 16:9 aspect ratio
                minHeight: '100vh',
                minWidth: '177.78vh' // 16:9 aspect ratio
              }}
            />
          </div>
        </div>
      ) : (
        <div 
          className="absolute inset-0 -z-10 bg-fixed bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bgSrc})`,
            backgroundAttachment: 'fixed'
          }}
        />
      )}

      <div className={`absolute inset-0 ${overlayClass}`} />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`flex w-full flex-col justify-center gap-3 text-white ${alignment}`}>
          {title ? (
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">{title}</h1>
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


