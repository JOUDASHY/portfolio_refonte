"use client";

import Image, { ImageProps } from "next/image";
import { useState, useMemo } from "react";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function SafeImage({ src, alt, fallbackSrc = "/window.svg", className = "", ...rest }: Props) {
  const [failed, setFailed] = useState(false);
  const finalSrc = useMemo(() => {
    const s = (src || "").toString().trim();
    if (!s) return fallbackSrc;
    return failed ? fallbackSrc : s;
  }, [src, failed, fallbackSrc]);

  return (
    <Image
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      src={finalSrc}
      {...rest}
    />
  );
}
