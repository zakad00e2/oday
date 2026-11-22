"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function HotelOptionDescription({ description, ar }: { description: string; ar: boolean }) {
  const id = useId();
  const text = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const paragraph = text.current;
    if (!paragraph) return;

    const measure = () => {
      const lineHeight = Number.parseFloat(getComputedStyle(paragraph).lineHeight);
      setHasMore(paragraph.scrollHeight > lineHeight * 2 + 1);
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
    <div className="mt-0.5 text-xs text-[#64748b]">
      <p id={id} ref={text} className={`leading-4 wrap-break-word ${expanded ? "" : "line-clamp-2 md:line-clamp-none"}`}>
        {description}
      </p>
      {hasMore && (
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
