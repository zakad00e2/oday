"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { ABOUT_CONTENT_UPDATED_EVENT, cloneAboutContent, readAboutContent, type AboutReview } from "@/lib/about-content";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`w-4 h-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const { dict, lang } = useI18n();
  const d = dict.reviews;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [reviews, setReviews] = useState<AboutReview[]>(() => cloneAboutContent().reviews.filter((review) => review.isPublished));
  const totalReviews = reviews.length;
  const currentIdx = totalReviews === 0 ? 0 : Math.min(activeIdx, totalReviews - 1);

  useEffect(() => {
    const syncReviews = () => {
      setReviews(readAboutContent().reviews.filter((review) => review.isPublished));
    };

    syncReviews();
    window.addEventListener("storage", syncReviews);
    window.addEventListener(ABOUT_CONTENT_UPDATED_EVENT, syncReviews);

    return () => {
      window.removeEventListener("storage", syncReviews);
      window.removeEventListener(ABOUT_CONTENT_UPDATED_EVENT, syncReviews);
    };
  }, []);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || totalReviews === 0) return;
    const cardWidth = el.children[0]?.getBoundingClientRect().width ?? 320;
    const gap = 24;
    const idx = Math.round(el.scrollLeft / (cardWidth + gap));
    setActiveIdx(Math.min(idx, totalReviews - 1));
  }, [totalReviews]);

  const scrollToIdx = useCallback((idx: number) => {
    const el = scrollRef.current;
    if (!el || !el.children[0]) return;
    const cardWidth = el.children[0].getBoundingClientRect().width;
    const gap = 24;
    el.scrollTo({ left: idx * (cardWidth + gap), behavior: "smooth" });
    setActiveIdx(idx);
  }, []);

  const scroll = useCallback((dir: "prev" | "next") => {
    const next = dir === "next" ? (activeIdx + 1) % totalReviews : (activeIdx - 1 + totalReviews) % totalReviews;
    scrollToIdx(next);
  }, [activeIdx, totalReviews, scrollToIdx]);

  useEffect(() => {
    if (totalReviews < 2) {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      return;
    }

    autoScrollRef.current = setInterval(() => scroll("next"), 4000);
    return () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  }, [scroll, totalReviews]);

  const pauseAuto = () => { if (autoScrollRef.current) clearInterval(autoScrollRef.current); };
  const resumeAuto = () => {
    if (totalReviews < 2) return;
    autoScrollRef.current = setInterval(() => scroll("next"), 4000);
  };

  if (totalReviews === 0) {
    return (
      <section id="reviews" className="py-20 bg-white overflow-hidden">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">{d.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed mb-8">{d.subtitle}</p>
            <div className="rounded-[24px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-10 text-sm text-[#6B7280]">
              {lang === "ar" ? "لا توجد مراجعات منشورة حالياً." : "No published reviews are available right now."}
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section id="reviews" className="py-20 bg-white overflow-hidden">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">{d.badge}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">{d.subtitle}</p>
          </div>

          <div className="relative" onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
            <div className="absolute top-0 end-0 w-16 md:w-24 h-full bg-gradient-to-s from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 start-0 w-16 md:w-24 h-full bg-gradient-to-e from-white to-transparent z-10 pointer-events-none" />
            <div ref={scrollRef} onScroll={updateActiveFromScroll} className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-2">
              {reviews.map((review) => {
                const name = lang === "ar" ? review.nameAr : review.nameEn;
                const text = lang === "ar" ? review.textAr : review.textEn;
                const meta = lang === "ar"
                  ? [review.serviceAr, review.locationAr].filter(Boolean).join(" - ")
                  : [review.serviceEn, review.locationEn].filter(Boolean).join(" - ");

                return (
                <div key={review.id} className="flex-shrink-0 w-[300px] md:w-[360px] snap-center bg-white rounded-[20px] border border-[#F3F4F6] p-6 shadow-sm hover:shadow-lg transition-all duration-400">
                  <div className="mb-4">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <h4 className="text-sm font-bold text-[#111]">{name}</h4>
                      <Stars count={review.rating} />
                    </div>
                    {meta && <p className="text-[11px] text-[#9CA3AF]">{meta}</p>}
                  </div>
                  <svg className="w-8 h-8 text-[#E5E7EB] mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-sm text-[#374151] leading-relaxed">{text}</p>
                </div>
              )})}
            </div>
            <div className="flex items-center justify-center gap-4 mt-8">
              <button onClick={() => scroll("prev")} className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all" aria-label={d.prev}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button key={i} onClick={() => scrollToIdx(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentIdx ? "w-6 bg-[#111]" : "w-2 bg-[#D1D5DB]"}`} />
                ))}
              </div>
              <button onClick={() => scroll("next")} className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all" aria-label={d.next}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
