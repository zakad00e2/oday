"use client";

import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

export default function HotelsHero() {
    return (
        <section id="hero" className="w-full px-3 md:px-5 pt-20 pb-10">
            <div className="relative overflow-hidden rounded-[2rem] h-[75vh] sm:h-[70vh] md:h-[85vh] flex flex-col items-center justify-center mx-auto max-w-[1600px] shadow-2xl">

                {/* Background image */}
                <Image
                    src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920&q=80"
                    alt="فنادق فاخرة في شرم الشيخ"
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/75" />

                {/* Main content — centered */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 py-20 max-w-4xl mx-auto">

                    {/* Badge */}
                    <ScrollReveal>
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold tracking-wider text-[#93C5FD] border border-white/40 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-5 sm:py-2 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block animate-pulse" />
                            إقامة فاخرة لا تُنسى
                        </span>
                    </ScrollReveal>

                    {/* Heading */}
                    <ScrollReveal delay={100}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                         اختر اقامتك بارقى الوجهات السياحية
                        </h1>
                    </ScrollReveal>

                    {/* Description */}
                    <ScrollReveal delay={200}>
                        <p className="text-sm sm:text-base md:text-lg leading-loose max-w-lg mb-10 text-white/80" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
                            نقدم لك أفضل الفنادق والمنتجعات السياحية
                            <br />
                            بأسعار تنافسية وخدمة استثنائية
                        </p>
                    </ScrollReveal>

                    {/* CTA */}
                    <ScrollReveal delay={300}>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#hotels"
                                className="group inline-flex items-center gap-2 sm:gap-2.5 pr-5 pl-2 py-2 sm:pr-7 sm:pl-2.5 sm:py-2.5 rounded-full bg-gradient-to-l from-[#0C5B94] via-[#1a7cc4] to-[#2186d4] text-white text-sm sm:text-base font-semibold shadow-[0_0_20px_rgba(29,116,179,0.6)] hover:shadow-[0_0_24px_rgba(29,116,179,0.55)] hover:scale-105 hover:brightness-110 transition-all duration-300 border border-white/20"
                            >
                                استكشف الفنادق
                                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0C5B94] shadow-md">
                                    <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </ScrollReveal>
                </div>

            </div>
        </section>
    );
}
