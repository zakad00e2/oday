"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

export default function HotelOptionDescription({ description, ar }: { description: string; ar: boolean }) {
  const id = useId();
  const text = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [fullHeight, setFullHeight] = useState<number | null>(null);

  useEffect(() => {
    const paragraph = text.current;
    if (!paragraph) return;

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(paragraph).lineHeight);
      const height = paragraph.getBoundingClientRect().height;
      setFullHeight(height > lineHeight * 2 + 1 ? height : null);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(paragraph);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [description]);

  return (
    <div className="mt-0.5 text-xs leading-4 text-[#64748b]">
      <div
        id={id}
        data-expanded={expanded && fullHeight !== null}
        style={fullHeight === null ? undefined : { "--description-height": `${fullHeight}px` } as CSSProperties}
        className="max-h-[2lh] overflow-hidden transition-[max-height] duration-[240ms] ease-in-out data-[expanded=true]:max-h-(--description-height) motion-reduce:transition-none md:max-h-none md:overflow-visible md:transition-none md:data-[expanded=true]:max-h-none"
      >
        <p ref={text} className="wrap-break-word">{description}</p>
      </div>
      {fullHeight !== null && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded(value => !value)}
          className="relative z-20 mt-0.5 min-h-8 rounded-sm font-semibold text-sky-800 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 md:hidden"
        >
          {expanded ? (ar ? "عرض أقل" : "Show less") : (ar ? "عرض المزيد" : "Show more")}
        </button>
      )}
    </div>
  );
}
