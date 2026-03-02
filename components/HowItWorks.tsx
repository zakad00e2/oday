"use client";

import ScrollReveal from "./ScrollReveal";

const categories = [
  "استكشاف",
  "رحلات",
  "فنادق",
  "مغامرات",
  "شهر عسل",
  "جولات خاصة",
];

const steps = [
  {
    number: "1",
    title: "اختر الوجهة أو الباقة",
    description: "تصفح وجهاتنا المميزة واختر ما يناسب ذوقك وميزانيتك.",
  },
  {
    number: "2",
    title: "تحقق من التوفر والتواريخ",
    description: "تأكد من توفر الحجوزات في التواريخ التي تناسبك.",
  },
  {
    number: "3",
    title: "أكد الحجز عبر واتساب",
    description: "تواصل معنا مباشرة عبر واتساب لتأكيد حجزك بسهولة.",
  },
  {
    number: "4",
    title: "استلم خطتك واستمتع بالرحلة",
    description: "نرسل لك خطة سفر كاملة جاهزة للتنفيذ والاستمتاع.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <ScrollReveal>
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-semibold text-[#111] mb-8 tracking-tight">
            كيف تحجز رحلتك؟
          </h2>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-12 gap-y-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[#6B7280] text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
                <span>{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-0 items-center mt-12">
          {/* Right: Image (RTL so it's on the right visually, but in DOM it's first) */}
          <div className="relative rounded-[28px] overflow-hidden aspect-[4/4.5] w-full shadow-sm max-w-md mx-auto lg:max-w-none">
            <img
              src="/WhatsApp Image 2026-02-27 at 8.28.18 PM (1).jpeg"
              alt="رحلة سياحية"
              className="w-full h-full object-cover"
            />
            
            {/* Glassmorphism Card inside Image */}
            {/* <div className="absolute bottom-5 left-5 right-5">
              <div 
                className="rounded-2xl p-3.5 flex items-center justify-between gap-3"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <p className="text-white text-xs leading-relaxed max-w-[180px]">
                  خطط لمغامرتك القادمة في دقائق مع نظامنا البسيط والآمن
                </p>
                <button className="flex items-center gap-2 bg-[#8B9D77] hover:bg-[#7A8A68] transition-colors text-white text-xs font-medium py-1.5 pl-1.5 pr-3 rounded-full">
                  احجز الآن
                  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-[#111]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </span>
                </button>
              </div>
            </div> */}
          </div>

          {/* Left: Steps */}
          <div className="lg:pr-6">
            <p className="text-[#6B7280] text-sm mb-2">كيف نعمل</p>
            <h3 className="text-2xl md:text-3xl font-semibold text-[#111] mb-8">
              احجز رحلتك في 4 خطوات سهلة
            </h3>

            <div className="space-y-2">
              {steps.map((step, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-[#f5f5f5] bg-transparent"
                >
                  <span className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-medium transition-all duration-300 bg-[#F9FAFB] text-[#111] group-hover:bg-white ">
                    {step.number}
                  </span>
                  <div className="pt-1">
                    <h4 className="text-lg font-medium text-[#111] mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </ScrollReveal>
    </section>
  );
}
