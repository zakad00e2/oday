"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

const hotels = [
  {
    id: 1,
    slug: "rexos-sharm",
    name: "منتجع ريكسوس شرم الشيخ",
    city: "شرم الشيخ",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    description: "منتجع فاخر على شاطئ البحر الأحمر مع خدمة شاملة وإطلالات ساحرة.",
    stars: 5,
    price: 120,
    originalPrice: 150,
    discount: "20%",
    filterTag: "most_booked" as const,
    features: ["إطلالة بحرية", "سبا وعافية", "مسبح لا متناهي", "مطاعم عالمية"],
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 2,
    slug: "stella-di-mare-hurghada",
    name: "فندق ستيلا دي ماري الغردقة",
    city: "الغردقة",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description: "إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة للعائلات والأزواج.",
    stars: 4,
    price: 80,
    filterTag: "lowest_price" as const,
    features: ["شاطئ خاص", "أنشطة مائية", "نادي أطفال", "Wi-Fi مجاني"],
    gallery: [
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 3,
    slug: "movenpick-ain-sokhna",
    name: "فندق موفنبيك العين السخنة",
    city: "عين السخنة",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    description: "ملاذ هادئ على ساحل البحر الأحمر مع مرافق عصرية وخدمة متميزة.",
    stars: 5,
    price: 100,
    originalPrice: 125,
    discount: "20%",
    filterTag: "most_booked" as const,
    features: ["حمام سباحة ساخن", "مركز لياقة", "مطعم بوفيه", "موقف سيارات"],
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    id: 4,
    slug: "kempinski-soma-bay",
    name: "فندق كمبينسكي سوما باي",
    city: "الغردقة",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    description: "تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة.",
    stars: 5,
    price: 150,
    filterTag: "highest_rated" as const,
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// Extract unique cities from the hotel list
const cities = Array.from(new Set(hotels.map((h) => h.city)));

const starOptions = [3, 4, 5];

function FeatureIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

type Hotel = typeof hotels[0];

function HotelCard({ hotel }: { hotel: Hotel }) {
  const images = hotel.gallery?.length ? hotel.gallery : [hotel.image];
  const [imgIdx, setImgIdx] = useState(0);

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((i) => (i + 1) % images.length);
  };

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image Carousel */}
      <div className="relative overflow-hidden aspect-[16/10]">
        {"discount" in hotel && hotel.discount && (
          <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/20">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-bold text-white tracking-wide">
              خصم {hotel.discount}
            </span>
          </div>
        )}
        {"filterTag" in hotel && hotel.filterTag && (() => {
          const tagConfig = {
            most_booked: { label: "الأكثر حجزاً", bg: "bg-orange-500/90", icon: "🔥" },
            highest_rated: { label: "الأعلى تقييماً", bg: "bg-yellow-500/90", icon: "⭐" },
            lowest_price: { label: "الأقل سعراً", bg: "bg-emerald-500/90", icon: "💰" },
          }[hotel.filterTag as string];
          if (!tagConfig) return null;
          return (
            <div className={`absolute top-4 left-4 z-20 flex items-center gap-1 ${tagConfig.bg} backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/20`}>
              <span className="text-[11px]">{tagConfig.icon}</span>
              <span className="text-[11px] font-bold text-white tracking-wide">{tagConfig.label}</span>
            </div>
          );
        })()}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${hotel.name} - ${i + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className={`object-cover transition-all duration-500 ${i === imgIdx ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            priority={i === 0}
          />
        ))}

        {/* Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="الصورة السابقة"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/60 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="الصورة التالية"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/60 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.preventDefault(); setImgIdx(i); }}
                  className={`rounded-full transition-all duration-300 ${i === imgIdx ? "bg-white w-4 h-1.5" : "bg-white/50 w-1.5 h-1.5"}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3">

        {/* Name + Stars */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[#111] leading-snug">{hotel.name}</h3>
            <div className="flex items-center gap-0.5 flex-shrink-0 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`w-3.5 h-3.5 ${i < hotel.stars ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs text-[#94A3B8]">{hotel.city}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6B7280] leading-relaxed">{hotel.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5">
          {hotel.features.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-1 text-xs font-medium text-[#374151] bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-2.5 py-1">
              <FeatureIcon />
              {f}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#64748B] font-medium mb-1">يبدأ من</span>
            <div className="flex items-baseline gap-2">
              {"originalPrice" in hotel && hotel.originalPrice && (
                <span className="text-sm font-medium text-red-400 line-through">
                  {hotel.originalPrice.toLocaleString('en-US')}$
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-[#0EA5E9] leading-none">{hotel.price?.toLocaleString('en-US') || "---"}</span>
                <span className="text-sm font-semibold text-[#0EA5E9]">$</span>
              </div>
              <span className="text-xs text-[#94A3B8]">/ ليلة</span>
            </div>
          </div>
          <Link
            href={`/hotels/${hotel.slug}`}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] hover:text-[#0EA5E9] hover:gap-3 transition-all duration-300"
          >
            التفاصيل والحجز
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function Hotels() {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showDiscountsOnly, setShowDiscountsOnly] = useState<boolean>(false);

  // Filter hotels
  let filteredHotels = [...hotels].filter((h) => {
    if (selectedCity !== "all" && h.city !== selectedCity) return false;
    if (showDiscountsOnly && !("discount" in h && h.discount)) return false;
    if (sortBy !== "default" && ("filterTag" in h ? h.filterTag : undefined) !== sortBy) return false;
    return true;
  });

  return (
    <section id="hotels" className="py-20 bg-[#FAFAFA]">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-xs font-medium text-[#111]">فنادق مختارة</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
              أفخم الفنادق <span className="font-semibold">بأفضل الأسعار</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              نختار لك أفضل الفنادق في أشهر الوجهات السياحية المصرية بأسعار تنافسية وخدمة متميزة.
            </p>

            {/* Filter Bar */}
            <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-3 py-3 flex flex-wrap items-end justify-center gap-3">

                {/* Region Filter */}
                <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#94A3B8] tracking-wide px-1">الوجهة</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pr-4 pl-9 py-2 text-[13px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] cursor-pointer transition-all"
                    >
                      <option value="all">كل الوجهات</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Reset Button */}
                {selectedCity !== "all" && (
                  <button
                    onClick={() => { setSelectedCity("all"); setSortBy("default"); setShowDiscountsOnly(false); }}
                    className="flex-[0_1_auto] min-w-[100px] h-[36px] px-3 rounded-xl bg-[#FEF2F2] text-[#EF4444] text-[12px] font-semibold border border-[#FECACA] hover:bg-[#FEE2E2] transition-all whitespace-nowrap flex items-center justify-center"
                  >
                    مسح الفلاتر
                  </button>
                )}
              </div>

              {/* Sort Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  key="default"
                  onClick={() => { setSortBy("default"); setShowDiscountsOnly(false); }}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                    sortBy === "default" && !showDiscountsOnly
                      ? "bg-[#111] text-white shadow-md border border-[#111]"
                      : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] shadow-sm"
                  }`}
                >
                  الافتراضي
                </button>

                {/* View Offers Button (placed after default) */}
                <button
                  onClick={() => {
                    const newDiscountsState = !showDiscountsOnly;
                    setShowDiscountsOnly(newDiscountsState);
                    if (newDiscountsState) setSortBy("default");
                  }}
                  className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                    showDiscountsOnly
                      ? "bg-[#111] text-white shadow-md border border-[#111]"
                      : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] shadow-sm"
                  }`}
                >
                  تخفيضات
                </button>

                {[
                                    { id: "most_booked", label: "الأكثر حجزاً" },

                  { id: "highest_rated", label: "الأعلى تقييماً" },
                                    { id: "lowest_price", label: "الأقل سعراً" },

                ].map((sortOption) => (
                  <button
                    key={sortOption.id}
                    onClick={() => { setSortBy(sortOption.id); setShowDiscountsOnly(false); }}
                    className={`px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-300 ${
                      sortBy === sortOption.id && !showDiscountsOnly
                        ? "bg-[#111] text-white shadow-md border border-[#111]"
                        : "bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] shadow-sm"
                    }`}
                  >
                    {sortOption.label}
                  </button>
                ))}
              </div>

              {/* Results count */}
              <p className="text-[12px] text-[#94A3B8] mt-2 text-right px-1">
                {filteredHotels.length} فندق متاح
              </p>
            </div>
          </div>

          {/* Hotel Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          {/* Empty State */}
          {filteredHotels.length === 0 && (
            <div className="text-center py-16 text-[#94A3B8] bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1] mt-8">
              <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <p className="text-sm font-medium">لا توجد فنادق تطابق بحثك</p>
            </div>
          )}

        </div>
      </ScrollReveal>

    </section>
  );
}
