"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function PackagesGallery() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeMobileCard, setActiveMobileCard] = useState<number | null>(null);

  useEffect(() => {
    if (activeMobileCard === null) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;

      if (!(target instanceof Element)) return;

      const activeCard = target.closest(`[data-package-card-id="${activeMobileCard}"]`);

      if (!activeCard) {
        setActiveMobileCard(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activeMobileCard]);

  // High-quality image data to create the premium look
  const galleryPackages = [
    {
      id: 1,
      title: isAr ? "ملاذ جزر المالديف" : "Maldives Escape",
      subtitle: isAr ? "٧ ليالٍ في فيلا مائية" : "7 Nights in a Water Villa",
      image: "/pakg.jpeg",
      label: isAr ? "شهر العسل" : "Honeymoon",
      href: "/trips",
    },
    {
      id: 2,
      title: isAr ? "مغامرة جبال الألب السويسرية" : "Swiss Alps Adventure",
      subtitle: isAr ? "٥ أيام من المشي الجبلي" : "5 Days of Mountain Hiking",
      image: "/pakg.jpeg",
      label: isAr ? "مغامرة" : "Adventure",
      href: "/trips",
    },
    {
      id: 3,
      title: isAr ? "إقامة فاخرة في دبي" : "Dubai Luxury Stay",
      subtitle: isAr ? "استمتع بأسلوب حياة فاخر" : "Experience Premium Lifestyle",
      image: "/pakg.jpeg",
      label: isAr ? "فخامة" : "Luxury",
      href: "/hotels",
    },
    {
      id: 4,
      title: isAr ? "منتجع بالي" : "Bali Retreat",
      subtitle: isAr ? "استرخِ في جنة استوائية" : "Relax in Tropical Paradise",
      image: "/pakg.jpeg",
      label: isAr ? "استرخاء" : "Relaxation",
      href: "/trips",
    }
  ];

  const scrollNext = () => {
    if (scrollContainerRef.current) {
      // In RTL, scroll direction is reversed for 'next'
      const scrollAmount = isAr ? -400 : 400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const scrollPrev = () => {
    if (scrollContainerRef.current) {
      // In RTL, scroll direction is reversed for 'prev'
      const scrollAmount = isAr ? 400 : -400;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 bg-[#FAFAFA]" id="packages-gallery">
      <ScrollReveal>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] tracking-tight mb-4">
              {isAr ? "باقات سياحية مختارة لك" : "Explore Our Packages"}
            </h2>
            <p className="text-[#6B7280] text-base md:text-lg max-w-2xl mx-auto">
              {isAr ? "اختر باقتك المثالية" : "Choose your perfect getaway"}
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scroll-smooth [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {galleryPackages.map((pkg) => (
                <div
                  key={pkg.id}
                  data-package-card-id={pkg.id}
                  className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] group relative block h-[480px] md:h-[520px] rounded-[24px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 cursor-pointer"
                >
                  <a
                    href={`/${lang}${pkg.href}`}
                    className="absolute inset-0 z-10 block w-full h-full"
                    aria-label={`View ${pkg.title} package`}
                    onClick={(event) => {
                      if (window.innerWidth >= 640) return;

                      if (activeMobileCard !== pkg.id) {
                        event.preventDefault();
                        setActiveMobileCard(pkg.id);
                        return;
                      }

                      setActiveMobileCard(null);
                    }}
                  >
                    {/* Background Image */}
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    
                    {/* Gradient Overlay for better contrast when hovered */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${
                        activeMobileCard === pkg.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </a>
                  
                  {/* WhatsApp Button */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(isAr ? `مرحباً، أود الحجز والاستفسار عن: ${pkg.title}` : `Hello, I would like to book: ${pkg.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`absolute bottom-6 left-1/2 z-20 flex w-[85%] -translate-x-1/2 items-center justify-center gap-2 rounded-[16px] bg-white/95 px-4 py-3.5 text-center font-semibold text-[#111] shadow-xl backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] hover:bg-white ${
                      activeMobileCard === pkg.id
                        ? "translate-y-0 opacity-100"
                        : "translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                    }`}
                  >
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.437-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    {isAr ? "احجز الآن" : "Book Now"}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center gap-4 mt-8" dir={isAr ? "rtl" : "ltr"}>
            <button
              onClick={scrollPrev}
              className="p-3 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Previous image"
            >
              {isAr ? <ChevronRight className="w-6 h-6 text-gray-700" /> : <ChevronLeft className="w-6 h-6 text-gray-700" />}
            </button>
            <button
              onClick={scrollNext}
              className="p-3 rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
              aria-label="Next image"
            >
              {isAr ? <ChevronLeft className="w-6 h-6 text-gray-700" /> : <ChevronRight className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
