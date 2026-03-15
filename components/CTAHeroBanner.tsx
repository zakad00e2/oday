"use client";

import ScrollReveal from "./ScrollReveal";

export default function CTAHeroBanner() {
  return (
    <ScrollReveal as="section" className="px-4 md:px-8 py-10 md:py-16 bg-white">
      <div
        className="relative w-full rounded-[28px] md:rounded-[32px] overflow-hidden flex items-center justify-center py-16 md:py-44"
        style={{
          backgroundImage:
            "url('/cover.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 gap-6 md:gap-8">
          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
            اصنع ذكرياتك مع 
            <br />
           Oday Tourism
          </h2>

          {/* Subtitle */}
          {/* <p
            className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed"
            style={{ maxWidth: "580px" }}
          >
            كل رحلة قصة تستحق أن تُروى. دعنا نأخذك إلى أجمل وجهات العالم
            بتجارب لا مثيل لها، مصممة خصيصاً لك.
          </p> */}

          {/* Glassmorphism CTA button */}
          {/* <div
            className="flex items-center gap-3 rounded-full px-5 py-2 cursor-pointer select-none
              transition-all duration-300 hover:brightness-110 active:scale-95"
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.25)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
            }}
          >
            <span className="text-white text-sm md:text-base font-medium pr-1">
              احجز جولتك الآن
            </span>

            <span
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center flex-shrink-0
                shadow-md transition-transform duration-300 group-hover:translate-x-0.5"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#111"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 17L17 7M17 7H7M17 7v10" />
              </svg>
            </span>
          </div> */}
        </div>
      </div>
    </ScrollReveal>
  );
}
