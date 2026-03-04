"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";

const reviews = [
  {
    id: 1,
    name: "محمد أحمد",
    image: "https://i.pravatar.cc/120?img=11",
    rating: 5,
    text: "تجربة ممتازة من البداية للنهاية! الفندق كان فوق التوقعات والمرشد السياحي كان محترف جداً. أنصح الجميع بالتعامل مع Oday Tourism.",
  },
  {
    id: 2,
    name: "سارة عبدالله",
    image: "https://i.pravatar.cc/120?img=5",
    rating: 5,
    text: "رحلة شرم الشيخ كانت لا تُنسى! كل شيء منظم بشكل مذهل من الحجز للإقامة. شكراً لفريق عدي للسياحة.",
  },
  {
    id: 3,
    name: "أحمد فوزي",
    image: "https://i.pravatar.cc/120?img=12",
    rating: 4,
    text: "خدمة عملاء ممتازة وأسعار تنافسية جداً. الرحلة النيلية كانت تجربة رائعة لي ولعائلتي.",
  },
  {
    id: 4,
    name: "نورا حسين",
    image: "https://i.pravatar.cc/120?img=9",
    rating: 5,
    text: "أفضل شركة سياحة تعاملت معها. الاهتمام بالتفاصيل والمرونة في التعديلات كانت مذهلة.",
  },
  {
    id: 5,
    name: "علي محمود",
    image: "https://i.pravatar.cc/120?img=33",
    rating: 5,
    text: "حجزنا رحلة الغردقة وكانت من أجمل الرحلات. الفندق ممتاز والأنشطة البحرية رائعة!",
  },
  {
    id: 6,
    name: "ريم خالد",
    image: "https://i.pravatar.cc/120?img=25",
    rating: 4,
    text: "تعامل راقي وخدمة سريعة عبر الواتساب. الرحلة كانت منظمة بشكل احترافي من الألف للياء.",
  },
  {
    id: 7,
    name: "كريم ياسر",
    image: "https://i.pravatar.cc/120?img=15",
    rating: 5,
    text: "رحلة سيوة مع Oday Tourism غيرت نظرتي للسياحة الداخلية. تنظيم ممتاز ومرشد رائع!",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const autoScrollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalReviews = reviews.length;

  const updateActiveFromScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
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
    const next = dir === "next"
      ? (activeIdx + 1) % totalReviews
      : (activeIdx - 1 + totalReviews) % totalReviews;
    scrollToIdx(next);
  }, [activeIdx, totalReviews, scrollToIdx]);

  // Auto-scroll
  useEffect(() => {
    autoScrollRef.current = setInterval(() => {
      scroll("next");
    }, 4000);
    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [scroll]);

  // Pause on hover
  const pauseAuto = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
  };
  const resumeAuto = () => {
    autoScrollRef.current = setInterval(() => scroll("next"), 4000);
  };

  return (
    <section id="reviews" className="py-20 bg-white overflow-hidden">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">آراء العملاء</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
              ماذا يقول <span className="font-semibold">عملاؤنا عنا</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
              نفخر بثقة عملائنا ونسعى دائماً لتقديم أفضل تجربة سفر ممكنة.
            </p>
          </div>

          {/* Carousel */}
          <div
            className="relative"
            onMouseEnter={pauseAuto}
            onMouseLeave={resumeAuto}
          >
            {/* Right fade */}
            <div className="absolute top-0 right-0 w-16 md:w-24 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
            {/* Left fade */}
            <div className="absolute top-0 left-0 w-16 md:w-24 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

            <div
              ref={scrollRef}
              onScroll={updateActiveFromScroll}
              className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory py-4 px-2"
            >
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-[300px] md:w-[360px] snap-center bg-white rounded-[20px] border border-[#F3F4F6] p-6 shadow-sm hover:shadow-lg transition-all duration-400"
                >
                  {/* Profile */}
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      loading="lazy"
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#F3F4F6]"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-[#111]">{review.name}</h4>
                      <Stars count={review.rating} />
                    </div>
                  </div>

                  {/* Quote icon */}
                  <svg className="w-8 h-8 text-[#E5E7EB] mb-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  <p className="text-sm text-[#374151] leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <button
                onClick={() => scroll("prev")}
                className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all"
                aria-label="السابق"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots */}
              <div className="flex gap-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIdx(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${i === activeIdx ? "w-6 bg-[#111]" : "w-2 bg-[#D1D5DB]"
                      }`}
                  />
                ))}
              </div>

              <button
                onClick={() => scroll("next")}
                className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all"
                aria-label="التالي"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
