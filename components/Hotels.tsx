"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

const hotels = [
  {
    id: 1,
    name: "منتجع ريكسوس شرم الشيخ",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    description: "منتجع فاخر على شاطئ البحر الأحمر مع خدمة شاملة وإطلالات ساحرة.",
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
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    description: "إقامة راقية مع شاطئ خاص وأنشطة مائية متنوعة للعائلات والأزواج.",
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
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
    description: "ملاذ هادئ على ساحل البحر الأحمر مع مرافق عصرية وخدمة متميزة.",
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
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    description: "تجربة فندقية استثنائية تجمع بين الفخامة والطبيعة الخلابة.",
    features: ["غوص وسنوركل", "ملعب غولف", "مسبح خاص", "خدمة غرف 24/7"],
    gallery: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80",
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80",
    ],
    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

function FeatureIcon() {
  return (
    <svg className="w-3.5 h-3.5 text-[#0EA5E9] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  );
}

export default function Hotels() {
  const [galleryOpen, setGalleryOpen] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState<number | null>(null);
  const [galleryIdx, setGalleryIdx] = useState(0);

  const openGallery = (hotelId: number) => {
    setGalleryIdx(0);
    setGalleryOpen(hotelId);
  };

  const currentHotelGallery = hotels.find((h) => h.id === galleryOpen)?.gallery ?? [];
  const currentHotelVideo = hotels.find((h) => h.id === videoOpen)?.video ?? "";

  return (
    <section id="hotels" className="py-20 bg-[#FAFAFA]">
      <ScrollReveal>
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="text-xs font-medium text-[#111]">فنادق مختارة</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
            أفخم الفنادق <span className="font-semibold">بأفضل الأسعار</span>
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            نختار لك أفضل الفنادق في أشهر الوجهات السياحية المصرية بأسعار تنافسية وخدمة متميزة.
          </p>
        </div>

        {/* Hotel Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="group bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-xl transition-all duration-500"
            >
              {/* Image */}
              <div className="relative overflow-hidden aspect-[16/10]">
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Action buttons overlay */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <button
                    onClick={() => openGallery(hotel.id)}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-[#111] hover:bg-white transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    معرض الصور
                  </button>
                  <button
                    onClick={() => setVideoOpen(hotel.id)}
                    className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-xs font-medium text-[#111] hover:bg-white transition-colors shadow-md"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    فيديو
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-[#111] mb-2">{hotel.name}</h3>
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

                {/* CTA */}
                <a
                  href="https://wa.me/201032549630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#111] text-white rounded-full px-5 py-2.5 text-sm font-medium hover:bg-[#333] active:scale-[0.97] transition-all duration-200 shadow-sm"
                >
                  احجز الآن
                  <svg className="w-4 h-4 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>      </ScrollReveal>
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
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === galleryIdx ? "bg-white w-6" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {videoOpen !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setVideoOpen(null)}
        >
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(null)}
              className="absolute -top-12 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video rounded-2xl overflow-hidden">
              <iframe
                src={currentHotelVideo}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
