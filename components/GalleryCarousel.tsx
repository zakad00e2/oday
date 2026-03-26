"use client";

import Image from "next/image";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const reviews = [
  {
    name: "ليا بطرس",
    rating: 5,
    image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=500&q=80",
    text: "تجربة مذهلة! شروق الشمس والمسارات كانت خلابة تماماً.",
    rotation: "-rotate-[4deg] hover:rotate-[-2deg]",
  },
  {
    name: "أحمد فوزي",
    rating: 5,
    image: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500&q=80",
    text: "شروق الشمس كان رائعاً والمرشدون كانوا متعاونين جداً. أنصح بشدة!",
    rotation: "-rotate-[2deg] hover:rotate-[-1deg]",
  },
  {
    name: "علياء رحمن",
    rating: 5,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
    text: "مناظر خلابة لشروق الشمس ومرشدون رائعون. تجربة لا تُنسى حقاً!",
    rotation: "rotate-0",
  },
  {
    name: "رزقي أديتيا",
    rating: 4,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80",
    text: "مرشدون محترفون ومناظر رائعة. أحببت كل لحظة هناك!",
    rotation: "rotate-[2deg]",
  },
  {
    name: "سيتي نورحليزة",
    rating: 4,
    image: "https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=500&q=80",
    text: "كل لحظة كانت سحرية. وجهة يجب زيارتها!",
    rotation: "rotate-[4deg]",
  },
  {
    name: "علياء رحمن",
    rating: 5,
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80",
    text: "مناظر خلابة لشروق الشمس ومرشدون رائعون. تجربة لا تُنسى حقاً!",
    rotation: "rotate-0",
  },
  {
    name: "رزقي أديتيا",
    rating: 4,
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=500&q=80",
    text: "مرشدون محترفون ومناظر رائعة. أحببت كل لحظة هناك!",
    rotation: "rotate-[2deg]",
  },
  {
    name: "سيتي نورحليزة",
    rating: 4,
    image: "https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=500&q=80",
    text: "كل لحظة كانت سحرية. وجهة يجب زيارتها!",
    rotation: "rotate-[4deg]",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`تقييم ${count} من 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-yellow-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default function GalleryCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <section id="gallery" className="py-20 bg-white overflow-hidden">
      {/* Header */}
      <ScrollReveal>
        <div className="max-w-2xl mx-auto px-6 text-center mb-16">
          {/* <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6 shadow-sm">
          <span className="text-xs font-medium text-[#111]">ذكريات مُخلَّدة</span>
          <span className="w-7 h-7 rounded-full border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
          </span>
        </div> */}

          <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
            خلّد رحلتك مع
            <br />
            <span className="font-semibold">Oday Tourism إلى الأبد</span>
          </h2>

          <p className="text-[#6B7280] text-sm md:text-base leading-relaxed">
            أعِد عيش كل لحظة من رحلتك — مناظر الشروق، والطبيعة الخلابة،
            محفوظة لك بشكل احترافي.
          </p>
        </div>
      </ScrollReveal>

      {/* Carousel wrapper with side fade masks */}
      <div className="relative">
        {/* Right fade */}
        <div className="absolute top-0 right-0 w-32 md:w-48 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        {/* Left fade */}
        <div className="absolute top-0 left-0 w-32 md:w-48 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 pt-8 px-16 md:px-32 items-start [&>*+*]:-ml-1"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              style={{ zIndex: i }}
              className={`relative flex-shrink-0 w-[220px] md:w-[240px] snap-center group cursor-pointer transition-all duration-500 hover:scale-[1.04] hover:z-50 ${review.rotation} hover:rotate-0`}
              >
                {/* Image card */}
                <div className="rounded-t-2xl overflow-hidden shadow-lg" style={{ aspectRatio: "3/4" }}>
                  <div className="relative w-full h-full">
                    <Image
                      src={review.image}
                      alt={`صورة من رحلة ${review.name}`}
                      fill
                      sizes="(max-width: 768px) 220px, 240px"
                      quality={65}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>

              {/* Testimonial box */}
              <div className=" bg-white rounded-b-xl px-4 py-3 shadow-md border border-[#F3F4F6]">
                <Stars count={review.rating} />
                <p className="text-sm font-semibold text-[#111] mt-2 mb-0.5">{review.name}</p>
                <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">{review.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Arrows */}
        <div className="flex justify-center gap-3 mt-2 relative z-20">

          <button
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all"
            aria-label="التالي"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center shadow-sm hover:bg-[#F9FAFB] hover:shadow-md transition-all"
            aria-label="السابق"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
