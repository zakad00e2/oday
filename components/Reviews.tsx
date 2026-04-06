"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { listComments, type CommentRecord } from "@/lib/comment-service";

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={`h-4 w-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Loading Skeleton ──────────────────────────────── */
function ReviewSkeleton() {
  return (
    <div className="w-[300px] flex-shrink-0 snap-center rounded-[20px] border border-[#F3F4F6] bg-white p-6 shadow-sm md:w-[360px] animate-pulse">
      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between gap-3">
          <div className="h-4 w-24 rounded bg-[#E5E7EB]" />
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 w-4 rounded bg-[#E5E7EB]" />
            ))}
          </div>
        </div>
        <div className="h-3 w-32 rounded bg-[#F3F4F6]" />
      </div>
      <div className="mb-2 h-8 w-8 rounded bg-[#F3F4F6]" />
      <div className="space-y-2">
        <div className="h-3 w-full rounded bg-[#F3F4F6]" />
        <div className="h-3 w-4/5 rounded bg-[#F3F4F6]" />
        <div className="h-3 w-3/5 rounded bg-[#F3F4F6]" />
      </div>
    </div>
  );
}

export default function Reviews({ autoPlay = true }: { autoPlay?: boolean }) {
  const { dict, lang, dir } = useI18n();
  const d = dict.reviews;
  const isRtl = dir === "rtl";
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // ── API State ──────────────────────────────────────
  const [reviews, setReviews] = useState<CommentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchComments() {
      try {
        setLoading(true);
        setError(null);
        const result = await listComments({ limit: 100, signal: controller.signal });
        setReviews(result.comments);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err.message : "Failed to load reviews");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchComments();
    return () => controller.abort();
  }, []);

  const totalReviews = reviews.length;
  const currentIdx = totalReviews === 0 ? 0 : Math.min(activeIdx, totalReviews - 1);

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || totalReviews === 0) return;

    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + (containerRect.width / 2);
    let nextIdx = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    Array.from(el.children).forEach((child, idx) => {
      if (!(child instanceof HTMLElement)) return;

      const childRect = child.getBoundingClientRect();
      const childCenter = childRect.left + (childRect.width / 2);
      const distance = Math.abs(childCenter - containerCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        nextIdx = idx;
      }
    });

    setActiveIdx(Math.min(nextIdx, totalReviews - 1));
  }, [totalReviews]);

  const scrollToIdx = useCallback((idx: number) => {
    const targetCard = cardRefs.current[idx];
    if (!targetCard) return;

    targetCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    setActiveIdx(idx);
  }, []);

  const scroll = useCallback((direction: "prev" | "next") => {
    if (totalReviews === 0) return;

    const nextIdx =
      direction === "next"
        ? (currentIdx + 1) % totalReviews
        : (currentIdx - 1 + totalReviews) % totalReviews;

    scrollToIdx(nextIdx);
  }, [currentIdx, totalReviews, scrollToIdx]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(updateActiveFromScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [reviews, lang, updateActiveFromScroll]);

  useEffect(() => {
    if (!autoPlay || totalReviews < 2) {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
      return;
    }

    autoScrollRef.current = setInterval(() => scroll("next"), 4000);

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [autoPlay, scroll, totalReviews]);

  const pauseAuto = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };

  const resumeAuto = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (!autoPlay || totalReviews < 2) return;

    autoScrollRef.current = setInterval(() => scroll("next"), 4000);
  };

  // ── Loading State ──────────────────────────────────
  if (loading) {
    return (
      <section id="reviews" className="overflow-hidden bg-white py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-6xl px-6">
            <div className="mb-14 text-center">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 shadow-sm">
                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-xs font-medium text-[#111]">{d.badge}</span>
              </div>
              <h2 className="mb-4 text-3xl font-semibold leading-tight text-[#111] md:text-5xl">
                {d.title} <span className="font-semibold">{d.titleBold}</span>
              </h2>
              <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#6B7280] md:text-base">{d.subtitle}</p>
            </div>
            <div className="flex gap-6 overflow-hidden px-2 py-4">
              {[...Array(4)].map((_, i) => (
                <ReviewSkeleton key={i} />
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  // ── Error State ────────────────────────────────────
  if (error) {
    return (
      <section id="reviews" className="overflow-hidden bg-white py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 shadow-sm">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">{d.badge}</span>
            </div>
            <h2 className="mb-4 text-3xl font-semibold leading-tight text-[#111] md:text-5xl">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-[#6B7280] md:text-base">{d.subtitle}</p>
            <div className="rounded-[24px] border border-dashed border-[#FCA5A5] bg-[#FEF2F2] p-10 text-sm text-[#DC2626]">
              {lang === "ar" ? "حدث خطأ أثناء تحميل المراجعات. حاول مرة أخرى لاحقاً." : "An error occurred while loading reviews. Please try again later."}
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  // ── Empty State ────────────────────────────────────
  if (totalReviews === 0) {
    return (
      <section id="reviews" className="overflow-hidden bg-white py-20">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 shadow-sm">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">{d.badge}</span>
            </div>
            <h2 className="mb-4 text-3xl font-semibold leading-tight text-[#111] md:text-5xl">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-sm leading-relaxed text-[#6B7280] md:text-base">{d.subtitle}</p>
            <div className="rounded-[24px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-10 text-sm text-[#6B7280]">
              {lang === "ar" ? "لا توجد مراجعات منشورة حالياً." : "No published reviews are available right now."}
            </div>
          </div>
        </ScrollReveal>
      </section>
    );
  }

  return (
    <section id="reviews" className="overflow-hidden bg-white py-20">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-14 text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E5E7EB] bg-white px-4 py-1.5 shadow-sm">
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">{d.badge}</span>
            </div>
            <h2 className="mb-4 text-3xl font-semibold leading-tight text-[#111] md:text-5xl">
              {d.title} <span className="font-semibold">{d.titleBold}</span>
            </h2>
            <p className="mx-auto max-w-lg text-sm leading-relaxed text-[#6B7280] md:text-base">{d.subtitle}</p>
          </div>

          <div className="relative" onMouseEnter={pauseAuto} onMouseLeave={resumeAuto}>
            <div className="pointer-events-none absolute top-0 end-0 z-10 h-full w-16 bg-gradient-to-s from-white to-transparent md:w-24" />
            <div className="pointer-events-none absolute top-0 start-0 z-10 h-full w-16 bg-gradient-to-e from-white to-transparent md:w-24" />
            <div
              ref={scrollRef}
              onScroll={updateActiveFromScroll}
              className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory px-2 py-4"
              dir={dir}
            >
              {reviews.map((review, idx) => {
                const name = lang === "ar" ? review.clientNameAr : review.clientNameEn;
                const text = lang === "ar" ? review.commentAr : review.commentEn;
                const tripName = lang === "ar" ? review.tripNameAr : review.tripNameEn;
                const city = lang === "ar" ? review.cityAr : review.cityEn;
                const meta = [tripName, city].filter(Boolean).join(" - ");

                return (
                  <div
                    key={review.id}
                    ref={(node) => {
                      cardRefs.current[idx] = node;
                    }}
                    className="w-[300px] flex-shrink-0 snap-center rounded-[20px] border border-[#F3F4F6] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg md:w-[360px]"
                  >
                    <div className="mb-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <h4 className="text-sm font-bold text-[#111]">{name}</h4>
                        <Stars count={review.rating} />
                      </div>
                      {meta && <p className="text-[11px] text-[#9CA3AF]">{meta}</p>}
                    </div>
                    <svg className="mb-2 h-8 w-8 text-[#E5E7EB]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-sm leading-relaxed text-[#374151]">{text}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => scroll("prev")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition-all hover:bg-[#F9FAFB] hover:shadow-md"
                aria-label={d.prev}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isRtl ? "" : "rotate-180"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => scroll("next")}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[#E5E7EB] bg-white shadow-sm transition-all hover:bg-[#F9FAFB] hover:shadow-md"
                aria-label={d.next}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isRtl ? "" : "rotate-180"}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
