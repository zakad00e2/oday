"use client";

import { useEffect, useState } from "react";

const avatars = [
  "https://i.pravatar.cc/80?img=1",
  "https://i.pravatar.cc/80?img=2",
  "https://i.pravatar.cc/80?img=3",
  "https://i.pravatar.cc/80?img=4",
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://cdn.europosters.eu/image/hp/106504.jpg"
          alt="مشهد طبيعي خلاب"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-28">
        <div
          className={`transition-all duration-1000 ${loaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
            }`}
        >
          {/* Small Badge */}
          <div
            className="inline-flex items-center gap-2 text-white/90 rounded-full px-5 py-2 text-sm font-medium my-8 bg-white/10 backdrop-blur-sm backdrop-saturate-150 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
          >

            <span>شركة سياحة وسفر معتمدة</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-white leading-tight mb-6">
            اكتشف سحر مصر مع
            <br />
            <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
              Oday Tourism
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/75 max-w-2xl mx-auto mb-10 leading-relaxed">
            حجوزات فنادق • رحلات سياحية • باكيدجات متكاملة
          </p>

          {/* CTA Buttons */}
          <div className="inline-flex items-center mt-8 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
            <a
              href="/hotels"
              className="px-8 py-3 text-[15px] font-semibold transition-all duration-300 hover:bg-gray-100 bg-white text-[#111]"
            >
              احجز فندقك
            </a>
            <a
              href="/trips"
              className="px-8 py-3 text-[15px] font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white border-r border-white/30 backdrop-blur-sm"
            >
              تصفح الرحلات
            </a>
          </div>
        </div>

        {/* Floating Info Card — old centered card removed */}
      </div>

      {/* ── Bottom-Left Floating Card (matches screenshot) ── */}
      <div
        className={`hidden md:block absolute bottom-8 md:bottom-16 left-4 md:left-20 z-20 w-64 md:w-72 rounded-3xl p-5 transition-all duration-1000 delay-700 animate-float bg-white/10 backdrop-blur-sm backdrop-saturate-150 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.12)] ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
      >
        {/* Avatars + count + label */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex -space-x-3 space-x-reverse">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt="مسافر"
                className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
              />
            ))}
            {/* +50 circle — same size as avatars, inline in the stack */}
            <span className="w-10 h-10 rounded-full border-2 border-white/40 bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
              +50
            </span>
          </div>
          <span className="text-white text-sm font-semibold whitespace-nowrap">
            انضم إلينا
          </span>
        </div>

        {/* Description */}
        <p className="text-white/80 text-sm leading-relaxed mb-5">
          سافر عبر أجمل الوجهات واستكشف تجارب لا تُنسى مع فريق Oday Tourism المتخصص.
        </p>

        {/* Book now button */}
        <a
          href="https://wa.me/201032549630"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 text-white text-[13.5px] font-semibold pr-5 pl-2 py-2 rounded-full transition-all duration-300 hover:scale-105 border border-white/20 bg-white/10 backdrop-blur-sm backdrop-saturate-150 shadow-[0_10px_30px_rgba(0,0,0,0.12)]"
        >
          احجز الآن
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/90 text-[#111] shadow-sm"
          >
            <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
            </svg>
          </span>
        </a>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
}
