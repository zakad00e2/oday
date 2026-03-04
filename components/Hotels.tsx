"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const hotels = [
  {
    id: 1,
    name: "منتجع ريكسوس شرم الشيخ",
    city: "شرم الشيخ",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    description: "منتجع فاخر على شاطئ البحر الأحمر مع خدمة شاملة وإطلالات ساحرة.",
    stars: 5,
    price: 120,
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
    name: "فندق ستيلا دي ماري الغردقة",
    city: "الغردقة",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description: "إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة للعائلات والأزواج.",
    stars: 4,
    price: 80,
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
    name: "فندق موفنبيك العين السخنة",
    city: "العين السخنة",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    description: "ملاذ هادئ على ساحل البحر الأحمر مع مرافق عصرية وخدمة متميزة.",
    stars: 5,
    price: 100,
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
    name: "فندق كمبينسكي سوما باي",
    city: "سوما باي",
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    description: "تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة.",
    stars: 5,
    price: 150,
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

function HotelCard({ hotel, openGallery }: { hotel: Hotel; openGallery: (id: number) => void }) {
  const [currentIdx, setCurrentIdx] = useState(0);

  // Combine the main image and gallery images, but avoid duplicates if main image is already in gallery.
  // Assuming main image is not in gallery, or they are different.
  const allImages = [hotel.image, ...hotel.gallery];

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIdx((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className="group bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-xl transition-all duration-500">
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[16/10] group/image">
        <img
          src={allImages[currentIdx]}
          alt={hotel.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-105"
        />

        {/* Navigation Arrows */}
        <button
          onClick={prevImage}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/80 hover:text-gray-900 z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button
          onClick={nextImage}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center text-white transition-all hover:bg-white/80 hover:text-gray-900 z-10"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Gradient for dots contrast */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-0" />

        {/* Image Dots Indicator */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10 pointer-events-none">
          {allImages.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentIdx ? "bg-white w-4" : "bg-white/50 w-1.5"}`}
            />
          ))}
        </div>

        {/* City Badge added over the image */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#111] text-[11px] font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 z-10">
          <svg className="w-3.5 h-3.5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {hotel.city}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-lg font-semibold text-[#111] mb-1.5">{hotel.name}</h3>

        {/* Star Rating */}
        <div className="flex items-center gap-0.5 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < hotel.stars ? "text-yellow-400" : "text-gray-200"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-[#6B7280] mr-1.5">{hotel.stars} نجوم</span>
        </div>

        <p className="text-sm text-[#6B7280] leading-relaxed mb-4">{hotel.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          {hotel.features.map((f, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#374151] bg-[#F0F9FF] border border-[#E0F2FE] rounded-full px-3 py-1"
            >
              <FeatureIcon />
              {f}
            </span>
          ))}
        </div>

        {/* CTA and Price */}
        <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6] mt-5">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#64748B] font-medium leading-none mb-1">يبدأ من</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl md:text-3xl font-bold text-[#0EA5E9] leading-none">{hotel.price?.toLocaleString() || "---"}</span>
              <span className="text-2xl md:text-3xl font-semibold text-[#0EA5E9]">$</span>
              <span className="text-[15px] text-[#94A3B8] mr-1">/ ليلة</span>
            </div>
          </div>

          <a
            href="https://wa.me/201032549630"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-[#111] text-white rounded-full px-6 py-2.5 text-[15px] font-medium hover:bg-[#333] active:scale-[0.97] transition-all duration-200 shadow-sm"
          >
            احجز الآن
            <svg className="w-4.5 h-4.5 scale-x-[-1]" style={{ width: '1.125rem', height: '1.125rem' }} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Hotels() {
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [filterStars, setFilterStars] = useState<number>(0);

  const openGallery = (hotelId: number) => {
    setGalleryIdx(0);
    setGalleryOpen(hotelId);
  };

  const currentHotelGallery = hotels.find((h) => h.id === galleryOpen)?.gallery ?? [];

  // Filter hotels based on selected city and stars
  const filteredHotels = hotels.filter((h) => {
    if (selectedCity !== "all" && h.city !== selectedCity) return false;
    if (filterStars > 0 && h.stars < filterStars) return false;
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

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              {["all", ...cities].map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`rounded-full px-5 py-2 text-[13px] font-medium border transition-all duration-200 ${selectedCity === city
                    ? "bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-sm"
                    : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"
                    }`}
                >
                  {city === "all" ? "كل المدن" : city}
                </button>
              ))}

              {/* Divider */}
              <div className="w-px h-8 bg-[#E2E8F0] mx-1 hidden sm:block"></div>

              {/* Star Rating Filter */}
              <div className="relative flex items-center">
                <select
                  value={filterStars}
                  onChange={(e) => setFilterStars(Number(e.target.value))}
                  className="appearance-none rounded-full border border-[#E2E8F0] bg-white pr-4 pl-9 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] cursor-pointer font-medium transition-all hover:border-[#CBD5E1]"
                >
                  <option value={0}>عدد النجوم</option>
                  {starOptions.map((s) => (
                    <option key={s} value={s}>{s} نجوم فأكثر</option>
                  ))}
                </select>
                <div className="absolute left-3 pointer-events-none text-[#64748B]">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Hotel Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} openGallery={openGallery} />
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

      {/* Gallery Lightbox */}
      {galleryOpen !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setGalleryOpen(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setGalleryOpen(null)}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={currentHotelGallery[galleryIdx]}
              alt="صورة الفندق"
              className="w-full rounded-2xl object-cover max-h-[70vh]"
            />

            {/* Nav arrows */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
              <button
                onClick={() => setGalleryIdx((p) => (p + 1) % currentHotelGallery.length)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setGalleryIdx((p) => (p - 1 + currentHotelGallery.length) % currentHotelGallery.length)}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {currentHotelGallery.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === galleryIdx ? "bg-white w-6" : "bg-white/40"
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
