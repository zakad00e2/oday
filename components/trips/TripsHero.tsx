"use client";

import ScrollReveal from "../ScrollReveal";
import Image from "next/image";
import { useI18n } from "@/lib/i18n/dictionary-context";

export default function TripsHero() {
    const { lang } = useI18n();
    const t = (ar: string, en: string) => (lang === "ar" ? ar : en);

    return (
        <section className="w-full px-3 md:px-5 pt-20 pb-10">
            <div className="relative overflow-hidden rounded-[2rem] h-[75vh] sm:h-[70vh] md:h-[85vh] flex flex-col items-center justify-center mx-auto max-w-[1600px] shadow-2xl">

                <Image
                    src="/optimized/clear-hero.avif"
                    alt={t("رحلات سياحية فاخرة", "Luxury trips")}
                    fill
                    priority
                    sizes="100vw"
                    quality={45}
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/75" />

                <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 py-20 max-w-4xl mx-auto">
                    <ScrollReveal delay={100}>
                        <h1
                            className={`text-4xl sm:text-5xl ${lang === "en" ? "md:text-5xl lg:text-6xl font-semibold" : "md:text-5xl lg:text-5xl font-bold"} text-white leading-tight mb-6`}
                            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
                        >
                            {t("اكتشف التجارب السياحية", "Unforgettable")}
                            <br />
                            {t("في شرم الشيخ", "Sharm Experiences")}
                        </h1>
                    </ScrollReveal>

                    <ScrollReveal delay={200}>
                        <p className="text-sm sm:text-base md:text-lg leading-loose max-w-lg mb-10 text-white/80" style={{ textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>
                            {t("نقدم لك أفضل الرحلات والأنشطة السياحية", "We offer the best trips and activities")}
                            <br />
                            {t("بتنظيم احترافي وخدمة موثوقة", "with professional planning and trusted service")}
                        </p>
                    </ScrollReveal>
                </div>

                <a
                    href="#trips"
                    className="absolute bottom-8 left-1/2 z-10 inline-flex -translate-x-1/2 text-sm font-semibold text-[#9CA3AF] transition-all duration-300 hover:text-white group"
                >
                    <span className="inline-flex flex-col items-center gap-2 animate-arrow-nudge-down group-hover:scale-105 transition-transform duration-300">
                        <span>{t("استكشف الرحلات", "Explore Trips")}</span>
                        <svg className="w-6 h-10 animate-bounce" style={{ animationDuration: '2s', animationIterationCount: 3 }} fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 40">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v28" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 26l6 6 6-6" />
                        </svg>
                    </span>
                </a>
            </div>
        </section>
    );
}
