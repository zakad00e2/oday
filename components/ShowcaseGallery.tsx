"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n/dictionary-context";

const cardImages = [
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.18%20PM.jpeg", alt: "gallery-1" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.18%20PM%20(1).jpeg", alt: "gallery-2" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.18%20PM%20(2).jpeg", alt: "gallery-3" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM.jpeg", alt: "gallery-4" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(1).jpeg", alt: "gallery-5" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(2).jpeg", alt: "gallery-6" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(3).jpeg", alt: "gallery-7" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.19%20PM%20(4).jpeg", alt: "gallery-8" },
  { src: "/WhatsApp%20Image%202026-02-27%20at%208.28.20%20PM.jpeg", alt: "gallery-9" },
];

export default function ShowcaseGallery() {
  const { dict, lang } = useI18n();
  const isAr = lang === "ar";
  const d = dict.gallery;
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [thumbWidth, setThumbWidth] = useState(30);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(updateProgress, 300);
    window.addEventListener("resize", updateProgress);
    return () => { clearTimeout(timeout); window.removeEventListener("resize", updateProgress); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scroll = (direction: "prev" | "next") => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isRtl = getComputedStyle(el).direction === "rtl";
    
    // Standard scroll behavior:
    // If RTL: next (left) is negative, prev (right) is positive
    // If LTR: next (right) is positive, prev (left) is negative
    const amount = direction === "next" 
      ? (isRtl ? -350 : 350) 
      : (isRtl ? 350 : -350);
    
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  const updateProgress = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const tw = Math.max(10, Math.min(70, (el.clientWidth / el.scrollWidth) * 100));
    const isRtl = getComputedStyle(el).direction === "rtl";
    const scrolled = isRtl ? max - Math.abs(el.scrollLeft) : el.scrollLeft;
    setThumbWidth(tw);
    setProgress(max > 0 ? (scrolled / max) * (100 - tw) : 0);
  };

  return (
    <section id="showcase" ref={sectionRef} aria-labelledby="showcase-heading" className="bg-white pt-16 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-[#111]">{d.badge}</span>
          <svg className="w-4 h-4 text-[#111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
            </div>
          <h2 id="showcase-heading" className="text-3xl md:text-4xl lg:text-5xl font-semibold text-[#111] leading-tight mb-4">
            {d.title}
            <span className="font-semibold"> {d.titleBold}</span>
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base max-w-2xl mx-auto leading-relaxed">{d.subtitle}</p>
        </div>

        {/* Carousel */}
        <div className={`relative -mx-6 md:mx-0 transition-all duration-1000 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div
            ref={scrollContainerRef}
            onScroll={updateProgress}
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 px-6 md:px-2"
            role="list"
            dir={isAr ? "rtl" : "ltr"}
          >
            {d.cards.map((card, idx) => (
              <div
                key={idx}
                role="listitem"
                className="group relative flex-shrink-0 w-64 md:w-72 snap-center rounded-[20px] overflow-hidden bg-white"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={cardImages[idx]?.src || cardImages[0].src}
                  alt={card.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mt-6 px-2 max-w-sm mx-auto w-full">
            <button
              onClick={() => scroll("prev")}
              className="w-10 h-10 flex-shrink-0 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-xs hover:bg-[#F9FAFB] transition-all"
              aria-label={d.prev}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`transition-transform duration-200 ${!isAr ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="flex-1 h-[3px] bg-[#E5E7EB] rounded-full relative">
              <div className="absolute top-0 h-full bg-[#111] rounded-full transition-all duration-150" style={{ width: `${thumbWidth}%`, left: `${progress}%` }} />
            </div>
            <button
              onClick={() => scroll("next")}
              className="w-10 h-10 flex-shrink-0 bg-white border border-[#E5E7EB] rounded-full flex items-center justify-center shadow-xs hover:bg-[#F9FAFB] transition-all"
              aria-label={d.next}
            >
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`transition-transform duration-200 ${!isAr ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
