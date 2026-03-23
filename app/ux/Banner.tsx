"use client";

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

type SplitBannerProps = {
  title?: ReactNode;
  subtitle?: ReactNode;
  imageSrc: string;
  imageAlt?: string;
  reverse?: boolean;
  heightClass?: string;
  overlayClass?: string;
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
  } catch { }
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
  heightClass = "h-[160px] xs:h-[200px] sm:h-[260px] lg:h-[320px]",
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
        <div className={`flex w-full flex-col justify-center gap-2 sm:gap-3 text-white ${alignment}`}>
          {title ? (
            <h1 className="text-var-title xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">{title}</h1>
          ) : null}
          {subtitle ? (
            <p className="text-var-caption xs:text-base sm:text-lg lg:text-xl text-white/90">{subtitle}</p>
          ) : null}
          {children}
        </div>
      </div>
    </section>
  );
}

export function SplitBanner({
  title,
  subtitle,
  imageSrc,
  imageAlt,
  reverse = false,
  heightClass = "h-[260px] sm:h-[320px] lg:h-[380px]",
  overlayClass = "bg-black/5",
  children,
}: SplitBannerProps) {
  return (
    <section className={`relative isolate ${heightClass} overflow-hidden`}>
      <div className={`absolute inset-0 ${overlayClass}`} />
      <div className="relative z-10 mx-auto flex h-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`grid w-full grid-cols-1 gap-4 sm:grid-cols-2 items-center ${reverse ? "sm:flex-row-reverse" : ""
            }`}
        >
          <div className="hidden sm:block h-full">
            <div className="relative h-full w-full rounded-2xl overflow-hidden bg-black/10">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageSrc})` }}
                aria-hidden="true"
              />
              <span className="sr-only">{imageAlt || ""}</span>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-2 sm:gap-3 text-[#000b31]">
            {title ? (
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-[#f68c09]">
                {title}
              </h2>
            ) : null}
            {subtitle ? (
              <p className="text-sm sm:text-base lg:text-lg text-[#000b31]/70">
                {subtitle}
              </p>
            ) : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}



