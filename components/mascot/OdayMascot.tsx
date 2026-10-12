"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Locale } from "@/lib/i18n/config";
import styles from "./OdayMascot.module.css";

type Controller = ReturnType<typeof import("./mascot-scene").mountMascot>;

export default function OdayMascot({ lang }: { lang: Locale }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const controller = useRef<Controller | null>(null);
  const [ready, setReady] = useState(false);
  const label = lang === "ar" ? "لوّح لرفيق رحلتك" : "Wave to your travel buddy";

  useEffect(() => {
    let cancelled = false;
    // Three.js stays out of the initial page bundle; loading cannot delay site content.
    import("./mascot-scene").then(({ mountMascot }) => {
      if (cancelled || !canvas.current) return;
      try {
        controller.current = mountMascot(canvas.current, () => setReady(true), () => setReady(false));
      } catch {
        // Keep the passport visible on devices without WebGL support.
        setReady(false);
      }
    }).catch(() => { if (!cancelled) setReady(false); });
    return () => {
      cancelled = true;
      controller.current?.dispose();
      controller.current = null;
    };
  }, []);

  return (
    <div className={styles.mascot} data-oday-mascot data-renderer={ready ? "webgl" : "poster"}>
      <span className={styles.shadow} aria-hidden="true" />
      <button
        type="button"
        className={styles.button}
        aria-label={label}
        title={label}
        onClick={() => controller.current?.wave()}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          controller.current?.look(((event.clientX - bounds.left) / bounds.width - 0.5) * 2, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2);
        }}
        onPointerLeave={() => controller.current?.look(0, 0)}
        onBlur={() => controller.current?.look(0, 0)}
      >
        {/* Lightweight first paint and fallback, replaced by the actual 3D canvas. */}
        <Image
          className={styles.poster}
          src="/images/mascot/oday-passport.png"
          width={552}
          height={696}
          alt=""
          aria-hidden="true"
          loading="eager"
          unoptimized
        />
        <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      </button>
    </div>
  );
}
