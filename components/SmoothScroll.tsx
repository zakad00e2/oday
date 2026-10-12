"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { createSmoothScroll } from "@/lib/smooth-scroll";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const smoothScroll = createSmoothScroll({
      Lenis,
      requestFrame: window.requestAnimationFrame,
      cancelFrame: window.cancelAnimationFrame,
    });

    return () => smoothScroll.destroy();
  }, []);

  return children;
}
