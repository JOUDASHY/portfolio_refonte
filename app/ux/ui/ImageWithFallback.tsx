"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = Omit<ImageProps, "src"> & {
  src?: string | null;
  fallbackSrc?: string;
};

export default function ImageWithFallback({ src, fallbackSrc = "/window.svg", alt, ...rest }: Props) {
  const [current, setCurrent] = useState<string>(src || fallbackSrc);

  return (
    <Image
      {...rest}
      alt={alt}
      src={current}
      onError={() => {
        if (current !== fallbackSrc) setCurrent(fallbackSrc);
      }}
    />
  );
}
