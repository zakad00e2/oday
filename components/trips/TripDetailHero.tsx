"use client";

import Image from "next/image";
import ScrollReveal from "../ScrollReveal";

export default function TripDetailHero({
    heroImage,
    title,
    kicker,
    tagline,
    duration,
    frequency,
    startingPrice,
    onBookNow,
    isAr,
}: {
    heroImage: string;
    title: string;
    kicker: string;
    tagline: string;
    duration: string;
    frequency: string;
    startingPrice: number;
    onBookNow: () => void;
    isAr: boolean;
}) {
    return (
        <section className="w-full px-3 md:px-5 pt-20 pb-10">
            <div className="relative overflow-hidden rounded-[2rem] h-[75vh] sm:h-[70vh] md:h-[85vh] flex flex-col justify-end mx-auto max-w-[1600px] shadow-2xl">

                {/* Background image */}
                <Image
                    src={heroImage}
                    alt={title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                {/* Content */}
                <div className="relative z-10 w-full max-w-[900px] px-5 md:px-14 pb-8 md:pb-12 pt-32 md:pt-48">

                    <ScrollReveal>
                        <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-widest uppercase text-[#93C5FD] border border-[#93C5FD]/30 bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 sm:px-4 sm:py-1.5 mb-3 sm:mb-5">
                            {kicker}
                        </span>
                    </ScrollReveal>

                    <ScrollReveal delay={100}>
                        <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 sm:mb-4 max-w-3xl" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                            {title}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <p className="text-white/75 text-sm md:text-lg leading-relaxed max-w-2xl mb-5 sm:mb-8">
                            {tagline}
                        </p>
                    </ScrollReveal>

                    <ScrollReveal delay={300}>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={onBookNow}
                                className="group inline-flex items-center gap-2 sm:gap-2.5 ps-5 pe-2 py-2 sm:ps-7 sm:pe-2.5 sm:py-2.5 rounded-full bg-gradient-to-l from-[#0C5B94] via-[#1a7cc4] to-[#2186d4] text-white text-sm sm:text-base font-semibold shadow-[0_0_20px_rgba(29,116,179,0.6)] hover:shadow-[0_0_24px_rgba(29,116,179,0.55)] hover:scale-105 hover:brightness-110 transition-all duration-300 border border-white/20 cursor-pointer"
                            >
                                {isAr ? "ابدأ الحجز" : "Start booking"}
                                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0C5B94] shadow-md shrink-0">
                                    <svg className={`w-3.5 h-3.5 ${isAr ? "scale-x-[-1]" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </span>
                            </button>
                            <a
                                href="#gallery"
                                className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {isAr ? "شاهد الصور" : "View gallery"}
                            </a>
                        </div>
                    </ScrollReveal>

                    {/* Quick meta */}
                    <ScrollReveal delay={400}>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {duration}
                            </div>
                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {frequency}
                            </div>
                            {startingPrice > 0 && (
                                <div className="flex items-center gap-2 text-white/80 text-sm font-semibold">
                                    {isAr ? "يبدأ من" : "From"} <span className="text-[#60A5FA] text-lg font-bold">${startingPrice}</span>
                                </div>
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            </div>
        </section>
    );
}
