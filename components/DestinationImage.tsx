"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { getDestinationFallbackImage } from "@/lib/destinations";

export default function DestinationImage({ destination, src, alt = "", ...props }: Omit<ImageProps, "src" | "onError" | "alt"> & {
  destination: string;
  src: string;
  alt?: string;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  return <Image {...props} src={failedSrc === src ? getDestinationFallbackImage(destination) : src} alt={alt} onError={() => setFailedSrc(src)} />;
}
