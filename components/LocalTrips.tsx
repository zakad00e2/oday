"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ScrollReveal from "./ScrollReveal";

const trips = [
  {
    id: 1,
    title: "رحلة سفاري الصحراء البيضاء",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
    details: "استكشف جمال الصحراء البيضاء مع تخييم تحت النجوم ورحلة جيب مثيرة.",
    duration: "120 دقيقة",
  },
  {
    id: 2,
    title: "جولة في واحة سيوة",
    image: "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=80",
    details: "اكتشف سحر سيوة: عيون المياه، بحيرة الملح، ومعبد آمون الشهير.",
    duration: "180 دقيقة",
  },
  {
    id: 3,
    title: "رحلة نيلية الأقصر - أسوان",
    image: "https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80",
    details: "أبحر في النيل واستمتع بزيارة المعابد الفرعونية والمشاهد الخلابة.",
    duration: "240 دقيقة",
  },
  {
    id: 4,
    title: "رحلة الفيوم وبحيرة قارون",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=80",
    details: "زيارة وادي الريان وشلالاته، مع جولة في بحيرة قارون والمناطق المحيطة.",
    duration: "300 دقيقة",
  },
  {
    id: 5,
    title: "رحلة إلى جبل موسى وسانت كاترين",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
    details: "تسلق جبل موسى لمشاهدة شروق الشمس وزيارة دير سانت كاترين التاريخي.",
    duration: "150 دقيقة",
  },
  {
    id: 6,
    title: "جولة الإسكندرية الساحلية",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    details: "زيارة قلعة قايتباي، مكتبة الإسكندرية، كورنيش البحر والمطاعم البحرية.",
    duration: "90 دقيقة",
  },
];

export default function LocalTrips() {
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            setVisibleCards((prev) => new Set(prev).add(idx));
          }
        });
      },
      { threshold: 0.15 }
    );
    cardRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="local-trips" className="py-20 bg-[#FAFAFA]">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
              <svg className="w-4 h-4 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs font-medium text-[#111]">رحلات داخلية</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-semibold text-[#111] leading-tight mb-4">
              اكتشف جمال مصر <span className="font-semibold">من الداخل</span>
            </h2>
            <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
              رحلات يومية وأسبوعية لأجمل المناطق السياحية في مصر مع مرشدين محترفين.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip, idx) => (
              <div
                key={trip.id}
                ref={(el) => { cardRefs.current[idx] = el; }}
                data-idx={idx}
                className={`group bg-white rounded-[24px] overflow-hidden border border-[#F3F4F6] shadow-sm hover:shadow-xl transition-all duration-500 ${visibleCards.has(idx) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <Image
                    src={trip.image}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    quality={65}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-base font-bold text-[#111] mb-1.5 leading-snug">{trip.title}</h3>

                  {/* Duration */}
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] mb-3">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {trip.duration}
                  </span>
                  <p className="text-sm text-[#6B7280] leading-relaxed line-clamp-2">{trip.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
