"use client";

import { useEffect, useState, Fragment } from "react";
import { useI18n } from "@/lib/i18n/dictionary-context";

const avatars = [
  "https://i.pravatar.cc/80?img=1",
  "https://i.pravatar.cc/80?img=2",
  "https://i.pravatar.cc/80?img=3",
  "https://i.pravatar.cc/80?img=4",
];

export default function Hero() {
  const [loaded, setLoaded] = useState(false);
  const { dict, lang } = useI18n();
  const d = dict.hero;

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
          alt={d.heroImageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto -mt-11">
        <div
          className={`transition-all duration-1000 ${loaded
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10"
            }`}
        >
          {/* Small Badge */}
          {/* <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-6">
            <span className="text-xs font-medium text-[#111]">{d.badge}</span>
          <svg className="w-4 h-4 text-[#111]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.93 0 5 1 7 2a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
            </div> */}

          {/* Main Heading */}
          <h1
            className={`text-4xl sm:text-5xl md:text-6xl ${lang === "en" ? "lg:text-6xl" : "lg:text-7xl"} ${lang === "en" ? "font-medium" : "font-semibold"
              } text-white leading-tight mb-6`}
          >
            {d.titleLine1}
            <br />
            <span className="bg-gradient-to-r from-white to-white bg-clip-text text-transparent">
              {d.titleLine2}
            </span>
          </h1>

          {/* Subtitle */}
          <div className={`flex flex-nowrap justify-center items-center md:gap-x-6 sm:text-lg md:text-xl text-white/80 w-full px-1 md:px-0 mx-auto mb-10 leading-relaxed font-medium ${
            lang === "en" ? "gap-x-1.5 text-[13.5px]" : "gap-x-1.5 text-[14.5px]"
          }`}>
            {d.subtitle.split("•").map((part, i, arr) => (
              <Fragment key={i}>
                <span className="whitespace-nowrap">{part.trim()}</span>
                {i < arr.length - 1 ? <span className="opacity-50 text-[10px] md:text-sm">•</span> : null}
              </Fragment>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="inline-flex items-center mt-8 rounded-full overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.25)]">
            <a
              href={`/${lang}/hotels`}
              className="px-8 py-3 text-[15px] font-semibold transition-all duration-300 hover:bg-gray-100 bg-white text-[#111]"
            >
              {d.bookHotel}
            </a>
            <a
              href={`/${lang}/trips`}
              className={`px-8 py-3 text-[15px] font-semibold transition-all duration-300 bg-white/10 hover:bg-white/20 text-white ${lang === "ar" ? "border-r" : "border-l"} border-white/30 backdrop-blur-sm`}
            >
              {d.browseTrips}
            </a>
          </div>
        </div>

        {/* Floating Info Card — old centered card removed */}
      </div>

      {/* Bottom-Left Floating Card (matches screenshot) */}
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
                alt={d.travelerAlt}
                className="w-10 h-10 rounded-full border-2 border-white/40 object-cover"
              />
            ))}
            {/* +50 circle */}
            <span className="w-10 h-10 rounded-full border-2 border-white/40 bg-white/25 backdrop-blur-sm flex items-center justify-center text-white text-xs font-bold">
              +50
            </span>
          </div>
          <span className="text-white text-sm font-semibold whitespace-nowrap">
            {d.joinUs}
          </span>
        </div>

        {/* Description */}
        <p className="text-white/80 text-sm leading-relaxed mb-5">
          {d.floatingDesc}
        </p>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
}
