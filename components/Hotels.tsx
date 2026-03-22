"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";

const hotels = [
  {
    id: 1,
    slug: "rexos-sharm",
    name: "منتجع ريكسوس شرم الشيخ",
    nameEn: "Rixos Sharm El Sheikh Resort",
    city: "شرم الشيخ",
    cityEn: "Sharm El Sheikh",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    description: "منتجع فاخر على شاطئ البحر الأحمر مع خدمة شاملة وإطلالات ساحرة.",
    descriptionEn: "A luxurious resort on the Red Sea coast with all-inclusive service and stunning views.",
    stars: 5,
    price: 120,
    originalPrice: 150,
    discount: "20%",
    filterTag: "most_booked" as const,
    features: ["إطلالة بحرية", "سبا وعافية", "مسبح لا متناهي", "مطاعم عالمية"],
    featuresEn: ["Sea View", "Spa & Wellness", "Infinity Pool", "International Restaurants"],
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
    nameEn: "Stella Di Mare Hurghada Hotel",
    city: "الغردقة",
    cityEn: "Hurghada",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description: "إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة للعائلات والأزواج.",
    descriptionEn: "An upscale stay with a private beach and diverse water activities for families and couples.",
    stars: 4,
    price: 80,
    filterTag: "lowest_price" as const,
    features: ["شاطئ خاص", "أنشطة مائية", "نادي أطفال", "Wi-Fi مجاني"],
    featuresEn: ["Private Beach", "Water Activities", "Kids Club", "Free Wi-Fi"],
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
    nameEn: "Movenpick Ain Sokhna Hotel",
    city: "عين السخنة",
    cityEn: "Ain Sokhna",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    description: "ملاذ هادئ على ساحل البحر الأحمر مع مرافق عصرية وخدمة متميزة.",
    descriptionEn: "A serene retreat on the Red Sea coast with modern facilities and excellent service.",
    stars: 5,
    price: 100,
    originalPrice: 125,
    discount: "20%",
    filterTag: "most_booked" as const,
    features: ["حمام سباحة ساخن", "مركز لياقة", "مطعم بوفيه", "موقف سيارات"],
    featuresEn: ["Heated Pool", "Fitness Center", "Buffet Restaurant", "Parking"],
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
    nameEn: "Kempinski Soma Bay Hotel",
    city: "الغردقة",
    cityEn: "Hurghada",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    description: "تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة.",
    descriptionEn: "An exceptional hotel experience combining luxury and breathtaking nature.",
    stars: 5,
    price: 150,
    filterTag: "highest_rated" as const,
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    featuresEn: ["Diving & Snorkeling", "Golf Course", "Private Pool", "24/7 Room Service"],
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

// Extract unique cities from the hotel list (Arabic keys for filtering)
const cities = Array.from(new Set(hotels.map((h) => h.city)));

type Hotel = typeof hotels[0];

function HotelCard({ hotel, lang, d }: { hotel: Hotel; lang: string; d: ReturnType<typeof useI18nHotels> }) {
  const images = hotel.gallery?.length ? hotel.gallery : [hotel.image];
  const [imgIdx, setImgIdx] = useState(0);
  const isAr = lang === "ar";

  const hotelName = isAr ? hotel.name : hotel.nameEn;
  const hotelCity = isAr ? hotel.city : hotel.cityEn;
  const hotelDesc = isAr ? hotel.description : hotel.descriptionEn;

  const prev = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((i) => (i - 1 + images.length) % images.length);
  };
  const next = (e: React.MouseEvent) => {
    e.preventDefault();
    setImgIdx((i) => (i + 1) % images.length);
  };

  return (
    <div className="group h-full bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col">
      {/* Image Carousel */}
      <div className="relative overflow-hidden aspect-[16/10]">
        {"discount" in hotel && hotel.discount && (
          <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5 bg-red-500/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] border border-white/20">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-bold text-white tracking-wide">
              {d.discount} {hotel.discount}
            </span>
          </div>
        )}
        {images.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${hotelName} - ${i + 1}`}
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
              aria-label={d.prevImage}
              className="absolute start-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/60 transition-all duration-200"
            >
              <svg className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label={d.nextImage}
              className="absolute end-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 hover:bg-black/60 transition-all duration-200"
            >
              <svg className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
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
      <div className="px-5 pt-5 pb-3 flex flex-1 flex-col gap-3">

        {/* Name + Stars */}
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-bold text-[#111] leading-snug">{hotelName}</h3>
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
            <span className="text-xs text-[#94A3B8]">{hotelCity}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#6B7280] leading-relaxed">{hotelDesc}</p>

        {/* Price + CTA */}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-[#F3F4F6]">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#64748B] font-medium mb-1">{d.startsFrom}</span>
            <div className="flex items-baseline gap-2">
              {"originalPrice" in hotel && hotel.originalPrice && (
                <span className="relative inline-flex items-center text-sm font-medium text-[#9CA3AF] leading-none">
                  <span>{hotel.originalPrice.toLocaleString('en-US')}$</span>
                  <span aria-hidden="true" className="absolute start-0 end-0 top-1/2 h-px -translate-y-1/2 bg-[#9CA3AF]" />
                </span>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold text-[#0EA5E9] leading-none">{hotel.price?.toLocaleString('en-US') || "---"}</span>
                <span className="text-2xl font-semibold text-[#0EA5E9] leading-none">$</span>
              </div>
              <span className="text-xs text-[#94A3B8]">{d.perNight}</span>
            </div>
          </div>
          <Link
            href={`/${lang}/hotels/${hotel.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] hover:text-[#0EA5E9] transition-all duration-300"
          >
            {d.detailsAndBook}
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${
                lang === "en" ? "scale-x-[-1] group-hover:translate-x-1" : "group-hover:-translate-x-1"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>

      </div>
    </div>
  );
}

// Helper to get the hotels dict section
function useI18nHotels() {
  const { dict } = useI18n();
  return dict.hotelsPage;
}

export default function Hotels() {
  const { dict, lang } = useI18n();
  const d = dict.hotelsPage;
  const isAr = lang === "ar";

  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("default");
  const [showDiscountsOnly, setShowDiscountsOnly] = useState<boolean>(false);

  // City options for dropdown
  const cityOptions = cities.map((city, i) => ({
    value: city,
    label: isAr ? city : hotels.find(h => h.city === city)?.cityEn || city,
  }));

  // Filter hotels
  const filteredHotels = [...hotels].filter((h) => {
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
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
              {d.title} <span>{d.titleBold}</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
              {d.subtitle}
            </p>

            {/* Filter Bar */}
            <div className="w-full max-w-2xl mx-auto mb-10 flex flex-col gap-4">
              <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-sm px-3 py-3 flex flex-wrap items-end justify-center gap-3">

                {/* Region Filter */}
                <div className="flex-1 min-w-[150px] flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-[#94A3B8] tracking-wide px-1">{d.destinationLabel}</label>
                  <div className="relative">
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full appearance-none bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl pe-4 ps-9 py-2 text-[13px] font-medium text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] cursor-pointer transition-all"
                    >
                      <option value="all">{d.allDestinations}</option>
                      {cityOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <div className="absolute start-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]">
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
                    {d.clearFilters}
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
                  {d.defaultSort}
                </button>

                {/* View Offers Button */}
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
                  {d.discounts}
                </button>

                {[
                  { id: "most_booked", label: d.mostBooked },
                  { id: "highest_rated", label: d.highestRated },
                  { id: "lowest_price", label: d.lowestPrice },
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

            </div>
          </div>

          {/* Hotel Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} lang={lang} d={d} />
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
              <p className="text-sm font-medium">{d.noResults}</p>
            </div>
          )}

        </div>
      </ScrollReveal>

    </section>
  );
}

