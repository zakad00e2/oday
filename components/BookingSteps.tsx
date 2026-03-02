"use client";

import { useRef, useEffect, useState } from "react";

const steps = [
  {
    number: 1,
    title: "اختر الفندق",
    description: "تصفح فنادقنا المختارة بعناية واختر ما يناسب ميزانيتك وذوقك.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "#0EA5E9",
    bgColor: "#F0F9FF",
    borderColor: "#BAE6FD",
  },
  {
    number: 2,
    title: "اختر باقة الرحلة",
    description: "حدد الباقة المناسبة التي تشمل الأنشطة والجولات التي تفضلها.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "#F59E0B",
    bgColor: "#FFFBEB",
    borderColor: "#FDE68A",
  },
  {
    number: 3,
    title: "حدد الطيران",
    description: "اختر رحلة الطيران المناسبة من بين الخيارات المتاحة.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    color: "#8B5CF6",
    bgColor: "#F5F3FF",
    borderColor: "#DDD6FE",
  },
  {
    number: 4,
    title: "ادفع أو تواصل واتساب",
    description: "أكمل الحجز بالدفع الإلكتروني أو تواصل معنا مباشرة عبر واتساب.",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "#10B981",
    bgColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
];

export default function BookingSteps() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="booking-steps"
      ref={sectionRef}
      className="py-20 bg-white"
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
            <svg className="w-4 h-4 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            <span className="text-xs font-medium text-[#111]">خطوات الحجز</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
            احجز رحلتك <span className="font-semibold">في 4 خطوات</span>
          </h2>
          <p className="text-[#6B7280] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            عملية حجز بسيطة وسريعة تأخذك من اختيار الوجهة إلى الاستمتاع بالرحلة.
          </p>
        </div>

        {/* Steps — Desktop Horizontal */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-[52px] right-[calc(12.5%+28px)] left-[calc(12.5%+28px)] h-[2px] bg-[#E5E7EB]">
              <div
                className="h-full bg-gradient-to-l from-[#0EA5E9] via-[#F59E0B] to-[#10B981] transition-all duration-1000 ease-out"
                style={{ width: visible ? "100%" : "0%" }}
              />
            </div>

            <div className="grid grid-cols-4 gap-6 relative z-10">
              {steps.map((step, idx) => (
                <div
                  key={step.number}
                  className={`flex flex-col items-center text-center transition-all duration-700 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
                  }`}
                  style={{ transitionDelay: `${idx * 200}ms` }}
                >
                  {/* Icon circle */}
                  <div
                    className="w-[104px] h-[104px] rounded-full flex items-center justify-center mb-5 border-2 transition-all duration-500 shadow-sm"
                    style={{
                      backgroundColor: step.bgColor,
                      borderColor: step.borderColor,
                      color: step.color,
                    }}
                  >
                    {step.icon}
                  </div>

                  {/* Step number */}
                  <span
                    className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: step.color }}
                  >
                    خطوة {step.number}
                  </span>

                  <h3 className="text-base font-bold text-[#111] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed max-w-[200px]">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Steps — Mobile Vertical */}
        <div className="md:hidden space-y-0">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className={`flex gap-5 transition-all duration-700 ${
                visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              {/* Vertical line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center border-2 flex-shrink-0 shadow-sm"
                  style={{
                    backgroundColor: step.bgColor,
                    borderColor: step.borderColor,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>
                {idx < steps.length - 1 && (
                  <div className="w-[2px] h-16 bg-[#E5E7EB] my-2" />
                )}
              </div>

              {/* Content */}
              <div className="pb-8 pt-1">
                <span
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: step.color }}
                >
                  خطوة {step.number}
                </span>
                <h3 className="text-sm font-bold text-[#111] mt-1 mb-1">{step.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={`text-center mt-14 transition-all duration-700 delay-700 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <a
            href="https://wa.me/201032549630"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-[#111] text-white rounded-full px-8 py-4 text-sm font-bold hover:bg-[#333] hover:shadow-xl active:scale-[0.97] transition-all duration-300 shadow-md"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            ابدأ الحجز عبر واتساب
          </a>
        </div>
      </div>
    </section>
  );
}
