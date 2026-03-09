"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";

const photos = [
  { id: 1, src: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=800&q=80", alt: "رحلة شاطئية", category: "company" },
  { id: 2, src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&q=80", alt: "غروب على البحر", category: "company" },
  { id: 3, src: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", alt: "مناظر طبيعية", category: "customers" },
  { id: 4, src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80", alt: "جبال خلابة", category: "company" },
  { id: 5, src: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80", alt: "رحلة نيلية", category: "customers" },
  { id: 6, src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", alt: "فندق فاخر", category: "company" },
  { id: 7, src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80", alt: "غرفة فندقية", category: "customers" },
  { id: 8, src: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80", alt: "مسبح فندق", category: "company" },
  { id: 9, src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", alt: "قمة الجبل", category: "customers" },
  { id: 10, src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "شاطئ رملي", category: "company" },
  { id: 11, src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80", alt: "لوبي فندق", category: "customers" },
  { id: 12, src: "https://images.unsplash.com/photo-1476900164809-ff19b8ae5968?w=800&q=80", alt: "مغامرة بحرية", category: "company" },
];

export default function TravelGallery() {
  const [filter, setFilter] = useState<"all" | "company" | "customers">("all");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const filtered = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const currentIdx = lightbox !== null ? filtered.findIndex((p) => p.id === lightbox) : -1;

  const navLightbox = (dir: "prev" | "next") => {
    if (currentIdx === -1) return;
    const next = dir === "next"
      ? (currentIdx + 1) % filtered.length
      : (currentIdx - 1 + filtered.length) % filtered.length;
    setImgLoaded(false);
    setLightbox(filtered[next].id);
  };

  // Track image loaded state for fade-in
  const [imgLoaded, setImgLoaded] = useState(false);
  const handleImgLoad = useCallback(() => setImgLoaded(true), []);

  // Preload adjacent images
  const prevIdx = currentIdx > 0 ? currentIdx - 1 : filtered.length - 1;
  const nextIdx = currentIdx < filtered.length - 1 ? currentIdx + 1 : 0;

  return (
    <section
      id="travel-gallery"
      ref={sectionRef}
      className="py-20 bg-[#FAFAFA]"
    >
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-[#EC4899]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">معرض الرحلات</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
              لحظات من <span className="font-semibold">رحلاتنا المميزة</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              صور حقيقية من رحلات عملائنا وفريقنا في أجمل الوجهات السياحية.
            </p>

            {/* Filter */}
            <div className="inline-flex bg-white border border-[#E5E7EB] rounded-full p-1">
              {[
                { key: "all" as const, label: "الكل" },
                { key: "company" as const, label: "صور الشركة" },
                { key: "customers" as const, label: "صور العملاء" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === tab.key ? "bg-[#111] text-white shadow-sm" : "text-[#6B7280] hover:text-[#111]"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Uniform grid */}
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
          >
            {filtered.map((photo, idx) => (
              <div
                key={photo.id}
                className="group cursor-pointer relative rounded-[16px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
                style={{ animationDelay: `${idx * 60}ms` }}
                onClick={() => { setImgLoaded(false); setLightbox(photo.id); }}
              >
                <div className="aspect-[3/4]">
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500">
                    <span className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-md">
                      <svg className="w-5 h-5 text-[#111]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Preload adjacent images */}
            {lightbox !== null && prevIdx >= 0 && (
              <link rel="preload" as="image" href={filtered[prevIdx]?.src} />
            )}
            {lightbox !== null && nextIdx >= 0 && (
              <link rel="preload" as="image" href={filtered[nextIdx]?.src} />
            )}

            {/* Loading spinner */}
            {!imgLoaded && (
              <div className="absolute inset-0 flex items-center justify-center z-0">
                <div className="w-10 h-10 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              </div>
            )}

            <img
              key={lightbox}
              src={filtered.find((p) => p.id === lightbox)?.src}
              alt={filtered.find((p) => p.id === lightbox)?.alt}
              onLoad={handleImgLoad}
              className={`w-full rounded-2xl object-contain max-h-[80vh] transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />

            {/* Nav arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 -left-4 md:-left-16">
              <button
                onClick={() => navLightbox("next")}
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 md:-right-16">
              <button
                onClick={() => navLightbox("prev")}
                className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/25 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <span className="text-white/60 text-sm">
                {currentIdx + 1} / {filtered.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
