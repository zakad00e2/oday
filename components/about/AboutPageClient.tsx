"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import Reviews from "@/components/Reviews";
import { listFaqs, type FaqRecord } from "@/lib/faq-service";
import { useI18n } from "@/lib/i18n/dictionary-context";

/* ── FAQ Accordion Component ────────────────────────────── */
function ChevronDownIcon({ className = "" }: { className?: string }) {
    return (
        <svg className={`w-5 h-5 ${className}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
    );
}

function FAQItem({ question, answer, delay, isOpen, onToggle, lang }: { question: string; answer: string; delay: number; isOpen: boolean; onToggle: () => void; lang: "ar" | "en" }) {
    return (
        <ScrollReveal delay={delay}>
            <div className="border-b border-[#e2e8f0]">
                <button
                    onClick={onToggle}
                    className={`w-full py-6 flex items-center justify-between focus:outline-none group ${lang === "ar" ? "text-right" : "text-left"}`}
                    aria-expanded={isOpen}
                >
                    <span className={`text-[18px] md:text-[20px] font-bold transition-colors ${lang === "ar" ? "pl-4" : "pr-4"} ${isOpen ? "text-[#0EA5E9]" : "text-[#0f172a] group-hover:text-[#0EA5E9]"}`}>{question}</span>
                    <div className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-[#0EA5E9]" : "rotate-0 text-[#64748b]"}`}>
                        <ChevronDownIcon />
                    </div>
                </button>
                <div
                    className={`grid  transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                >
                    <div className="overflow-hidden">
                        <div className={`text-[#64748b] pb-4 text-[15px] md:text-[17px] leading-[1.8] ${lang === "ar" ? "text-right" : "text-left"}`}>
                            {answer}
                        </div>
                    </div>
                </div>
            </div>
        </ScrollReveal>
    );
}

function FAQSkeleton() {
    return (
        <div className="border-t border-[#e2e8f0] mt-4 space-y-0">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="border-b border-[#e2e8f0] py-6 animate-pulse">
                    <div className="h-5 w-3/4 rounded bg-[#E5E7EB]" />
                </div>
            ))}
        </div>
    );
}

function FAQList({ faqs, lang }: { faqs: FaqRecord[]; lang: "ar" | "en" }) {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (faqs.length === 0) {
        return (
            <div className="rounded-3xl border border-dashed border-[#D1D5DB] bg-[#F8FAFC] px-6 py-10 text-center text-sm text-[#64748b]">
                {lang === "ar" ? "لا توجد أسئلة منشورة حالياً." : "There are no published FAQs at the moment."}
            </div>
        );
    }

    return (
        <div className="border-t border-[#e2e8f0] flex flex-col mt-4">
            {faqs.map((faq, index) => (
                <FAQItem
                    key={faq.id}
                    question={lang === "ar" ? faq.questionAr : faq.questionEn}
                    answer={lang === "ar" ? faq.answerAr : faq.answerEn}
                    lang={lang}
                    delay={index * 100}
                    isOpen={openIndex === index}
                    onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                />
            ))}
        </div>
    );
}

/* ── FAQ Section Wrapper (fetches from API) ──────────────── */
function FAQSection({ lang }: { lang: "ar" | "en" }) {
    const [faqs, setFaqs] = useState<FaqRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        async function fetchFaqs() {
            try {
                setLoading(true);
                setError(null);
                const result = await listFaqs({ limit: 100, signal: controller.signal });
                setFaqs(result.faqs);
            } catch (err) {
                if (controller.signal.aborted) return;
                setError(err instanceof Error ? err.message : "Failed to load FAQs");
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        fetchFaqs();
        return () => controller.abort();
    }, []);

    return (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
            <div className="max-w-[700px] mx-auto">
                <ScrollReveal className="text-center mb-8">
                    <h2 className="text-4xl md:text-[42px] font-bold text-[#0f172a] mb-5">
                        {lang === "ar" ? "الأسئلة الشائعة" : "Frequently asked questions"}
                    </h2>
                    <p className="text-[17px] md:text-[19px] text-[#64748b] font-medium">
                        {lang === "ar"
                            ? "إجابات على الأسئلة الشائعة حول Oday Tourism"
                            : "Quick answers about bookings, transfers, and what to expect with Oday Tourism."}
                    </p>
                </ScrollReveal>

                {loading ? (
                    <FAQSkeleton />
                ) : error ? (
                    <div className="rounded-3xl border border-dashed border-[#FCA5A5] bg-[#FEF2F2] px-6 py-10 text-center text-sm text-[#DC2626]">
                        {lang === "ar" ? "حدث خطأ أثناء تحميل الأسئلة. حاول مرة أخرى لاحقاً." : "An error occurred while loading FAQs. Please try again later."}
                    </div>
                ) : (
                    <FAQList faqs={faqs} lang={lang} />
                )}
            </div>
        </section>
    );
}

function AboutPageEn({ loaded, lang }: { loaded: boolean; lang: "ar" | "en" }) {
    return (
        <main className="bg-[#FAFAFA]">
            <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#eff6ff] pt-40 pb-28 md:pt-48 md:pb-28">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#38BDF8] opacity-5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#7DD3FC] opacity-5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className={`space-y-6 order-1 lg:order-2 flex flex-col items-center text-center lg:items-start lg:text-start transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 rounded-full px-4 py-1.5">
                            About us
                        </span>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0f172a] leading-tight">
                            Oday{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0EA5E9] to-[#38BDF8]">
                                Tourism
                            </span>
                        </h1>
                        <p className="text-[#64748b] text-sm md:text-base leading-relaxed max-w-lg">
                            We craft unforgettable travel experiences in Egypt — from the Red Sea to the golden desert. Our team supports you from planning to your safe return.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2 w-full">
                            <a
                                href={`/${lang}/trips`}
                                className="flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition-all text-sm"
                            >
                                View trips
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/201032549630"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 border border-[#cbd5e1] text-[#0f172a] font-semibold px-6 py-3 rounded-full hover:bg-[#f8fafc] transition text-sm"
                            >
                                Contact us
                            </a>
                        </div>

                        <div className="flex items-center justify-between lg:justify-start pt-8 mt-4 border-t border-[#e2e8f0] w-full divide-x divide-[#e2e8f0]">
                            {[
                                { number: "500+", label: "Trips organized" },
                                { number: "10+", label: "Years of experience" },
                                { number: "1000+", label: "Happy customers" },
                            ].map((stat, index) => (
                                <div key={stat.label} className={`flex flex-col items-center lg:items-start flex-1 lg:flex-none px-1 sm:px-5 md:px-8 ${index === 0 ? "lg:pl-0" : ""}`}>
                                    <div className="flex items-baseline gap-1" dir="ltr">
                                        <span className="text-xl sm:text-2xl md:text-4xl font-black text-[#0f172a]">{stat.number.replace("+", "")}</span>
                                        <span className="text-lg md:text-2xl font-bold text-[#0f172a]">+</span>
                                    </div>
                                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-[#64748b] mt-1 text-center lg:text-left whitespace-nowrap">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`order-2 lg:order-1 relative transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] rotate-1">
                            <Image
                                src="/optimized/sharm-activities.webp"
                                alt="Sharm El-Sheikh activities – snorkeling, boat trips and safari experiences"
                                width={1200}
                                height={900}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={62}
                                className="w-full h-[450px] object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                        </div>
                        <div className="absolute -bottom-5 -right-4 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#111]">Trusted experience</p>
                                <p className="text-xs text-gray-500">Sharm El-Sheikh • Egypt</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 px-6 md:px-12">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 order-2 lg:order-1">
                        <ScrollReveal>
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-1 block">
                                Get to know us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#111] leading-tight">
                                Who we are
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal delay={100}>
                            <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                                Oday Tourism is a travel company focused on delivering complete tourism services across Egypt, with a special focus on Sharm El-Sheikh, one of the Red Sea&apos;s top destinations.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                                We believe travel is more than booking a hotel or choosing an excursion. It is a full experience that starts with planning and continues through every detail of the journey.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <p className="text-[#555] text-base md:text-lg leading-[1.9] font-medium border-l-4 border-[#0EA5E9] pl-5 py-1">
                                Our goal is to give every traveler a smooth, safe, and memorable trip from start to finish.
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={150} className="order-1 lg:order-2">
                        <div className="relative">
                            <Image
                                src="/optimized/about-team.avif"
                                alt="Oday Tourism team in Sharm El-Sheikh, Egypt"
                                width={1200}
                                height={900}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={58}
                                className="w-full rounded-3xl shadow-xl object-cover aspect-[4/3]"
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[#0EA5E9]/10 -z-10" />
                            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-[#F5E6D3]/60 -z-10" />
                        </div>
                    </ScrollReveal>
                </div>
            </section>

            <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
                <ScrollReveal className="text-center mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-2 block">
                        What we do
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111]">Our services</h2>
                    <p className="mt-4 text-[#6B7280] text-base md:text-lg max-w-xl mx-auto">
                        A complete set of travel services to match your needs.
                    </p>
                </ScrollReveal>
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: "Hotels & resorts", desc: "Handpicked stays in Sharm El-Sheikh — from luxury hotels to great-value resorts.", icon: <HotelIcon /> },
                        { title: "Boat trips & yachts", desc: "Snorkeling, diving, and Red Sea cruises with reliable organization.", icon: <ShipIcon /> },
                        { title: "Safari & adventures", desc: "Desert safaris, quad biking, and unforgettable outdoor experiences.", icon: <SunIcon /> },
                        { title: "Complete packages", desc: "Bundle accommodation, transfers, and activities for a smooth trip.", icon: <SuitcaseIcon /> },
                    ].map((s, i) => (
                        <ScrollReveal key={s.title} delay={i * 100}>
                            <div className="rounded-3xl border border-[#E5E7EB] p-7 text-center h-full hover:border-[#0EA5E9]/30 hover:shadow-lg transition-all duration-300 group bg-[#FAFAFA] hover:bg-white">
                                <div className="text-[#0EA5E9] mb-5 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                    {renderServiceIcon(s.icon)}
                                </div>
                                <h3 className="text-lg font-bold text-[#111] mb-3">{s.title}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>

            <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <ScrollReveal className="order-2 lg:order-2 relative">
                        <Image
                            src="/optimized/about-activities.avif"
                            alt="Travel activities in Sharm El-Sheikh – boat trips, safaris, and water sports"
                            width={1200}
                            height={1600}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            quality={55}
                            className="w-full h-[400px] lg:h-[600px] object-cover rounded-[2rem] shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-[2rem] bg-[#0EA5E9]/10 -z-10" />
                        <div className="absolute top-12 -left-6 w-24 h-24 rounded-[1.5rem] bg-[#111]/5 -z-10" />
                    </ScrollReveal>

                    <div className="order-1 lg:order-1 space-y-10">
                        <ScrollReveal>
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-2 block">
                                Why us
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">
                                Why choose Oday Tourism?
                            </h2>
                            <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
                                Choosing the right travel company is the first step toward a successful trip. We combine quality, planning, and value to make every journey feel effortless.
                            </p>
                        </ScrollReveal>

                        <div className="space-y-6">
                            {advantagesEn.map((a, i) => (
                                <ScrollReveal key={a.title} delay={100 + i * 50}>
                                    <div className="flex items-start gap-4 group">
                                        <div className="shrink-0 mt-1 w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors duration-300">
                                            {renderAdvantageIcon(a.icon)}
                                        </div>
                                        <div>
                                            <h3 className="text-[17px] font-bold text-[#111] mb-1 group-hover:text-[#0EA5E9] transition-colors">
                                                {a.title}
                                            </h3>
                                            <p className="text-[#6B7280] text-sm leading-relaxed">
                                                {a.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Reviews autoPlay={false} />

            <FAQSection lang="en" />

            <section className="relative overflow-hidden">
                <Image
                    src="/optimized/about-experience.webp"
                    alt="Discover Sharm El-Sheikh – coral reefs and golden desert"
                    width={1600}
                    height={420}
                    sizes="100vw"
                    quality={60}
                    className="w-full h-[340px] md:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <ScrollReveal className="text-center max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Discover the magic of Sharm El-Sheikh
                        </h2>
                        <p className="text-white/85 text-base md:text-lg leading-relaxed">
                            From colorful coral reefs to golden desert landscapes, Sharm El-Sheikh offers endless adventures. Let Oday Tourism turn it into a trip you will always remember.
                        </p>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}

/* ── SVG Icon Components ─────────────────────────────────── */

function HotelIcon() {
    return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3 4.5h.008v.008H18v-.008Zm0 3h.008v.008H18v-.008Zm0 3h.008v.008H18v-.008Z" />
        </svg>
    );
}

function ShipIcon() {
    return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 0a9 9 0 0 1 9 9v.75M12 5.25a9 9 0 0 0-9 9v.75m18 0H3m18 0a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 14.75m9-12.5L8.25 9h7.5L12 2.75Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.75 5.25 21h13.5l1.5-2.25" />
        </svg>
    );
}

function SunIcon() {
    return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
    );
}

function SuitcaseIcon() {
    return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
    );
}

function MapPinIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
        </svg>
    );
}

function ClipboardCheckIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75" />
        </svg>
    );
}

function CurrencyIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
    );
}

function ChatBubbleIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
        </svg>
    );
}

function SparklesIcon() {
    return (
        <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 0 0-2.455 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
        </svg>
    );
}

/* ── Data ─────────────────────────────────────────────── */

type ServiceIconKey = "hotel" | "ship" | "sun" | "suitcase";
type AdvantageIconKey = "map-pin" | "clipboard-check" | "currency" | "chat-bubble" | "sparkles";

function renderServiceIcon(icon: ServiceIconKey | React.ReactNode) {
    if (typeof icon !== "string") {
        return icon;
    }

    switch (icon) {
        case "hotel":
            return <HotelIcon />;
        case "ship":
            return <ShipIcon />;
        case "sun":
            return <SunIcon />;
        case "suitcase":
            return <SuitcaseIcon />;
    }
}

function renderAdvantageIcon(icon: AdvantageIconKey | React.ReactNode) {
    if (typeof icon !== "string") {
        return icon;
    }

    switch (icon) {
        case "map-pin":
            return <MapPinIcon />;
        case "clipboard-check":
            return <ClipboardCheckIcon />;
        case "currency":
            return <CurrencyIcon />;
        case "chat-bubble":
            return <ChatBubbleIcon />;
        case "sparkles":
            return <SparklesIcon />;
    }
}

const services = [
    {
        title: "حجز الفنادق والمنتجعات",
        desc: "نوفر لك أفضل خيارات الإقامة في شرم الشيخ، من الفنادق الفاخرة إلى المنتجعات المميزة بأسعار تنافسية.",
        icon: "hotel" as const,
    },
    {
        title: "الرحلات البحرية واليخوت",
        desc: "استمتع بأجمل الرحلات البحرية والغوص والسنوركلينج في مياه البحر الأحمر الساحرة.",
        icon: "ship" as const,
    },
    {
        title: "سفاري الصحراء والمغامرات",
        desc: "عش تجربة المغامرة في قلب الصحراء مع رحلات السفاري وركوب الدراجات والجمال.",
        icon: "sun" as const,
    },
    {
        title: "باقات سياحية متكاملة",
        desc: "باقات شاملة تجمع بين الإقامة والرحلات والأنشطة لتجربة سفر مريحة ومتكاملة.",
        icon: "suitcase" as const,
    },
];

const advantages = [
    {
        title: "خبرة سياحية احترافية",
        desc: "فريق متخصص بخبرة واسعة في تنظيم الرحلات السياحية وتقديم أفضل التجارب.",
        icon: "map-pin" as const,
    },
    {
        title: "رحلات منظمة بعناية",
        desc: "كل رحلة مخططة بدقة لضمان تجربة آمنة وممتعة من البداية حتى النهاية.",
        icon: "clipboard-check" as const,
    },
    {
        title: "أسعار تنافسية",
        desc: "نقدم أفضل العروض والأسعار مع الحفاظ على مستوى عالٍ من الجودة والخدمة.",
        icon: "currency" as const,
    },
    {
        title: "دعم عملاء مميز",
        desc: "فريقنا متواجد لمساعدتك قبل وأثناء وبعد الرحلة لضمان راحتك التامة.",
        icon: "chat-bubble" as const,
    },
    {
        title: "تجارب فريدة في شرم الشيخ",
        desc: "نعرف أسرار المدينة ونقدم لك تجارب حصرية لا تجدها في أي مكان آخر.",
        icon: "sparkles" as const,
    },
];

const advantagesEn = [
    {
        title: "Professional travel expertise",
        desc: "Our team brings deep destination knowledge and practical experience to every itinerary we organize.",
        icon: "map-pin" as const,
    },
    {
        title: "Carefully planned trips",
        desc: "Every booking is arranged with attention to timing, logistics, and comfort so your trip runs smoothly.",
        icon: "clipboard-check" as const,
    },
    {
        title: "Competitive pricing",
        desc: "We work to deliver strong value without compromising on the quality of service or the overall experience.",
        icon: "currency" as const,
    },
    {
        title: "Reliable customer support",
        desc: "We stay available before, during, and after your trip to help with questions, updates, and peace of mind.",
        icon: "chat-bubble" as const,
    },
    {
        title: "Unique Sharm experiences",
        desc: "We know the destination well and help you enjoy standout experiences that go beyond the usual tourist plan.",
        icon: "sparkles" as const,
    },
];

/* ── Page ─────────────────────────────────────────────── */
export default function AboutPageClient() {
    const loaded = true;
    const { lang } = useI18n();

    if (lang === "en") {
        return <AboutPageEn loaded={loaded} lang={lang} />;
    }

    return (
        <main className="bg-[#FAFAFA]">

            {/* ── 1. HERO ── */}
            <section id="hero" className="relative overflow-hidden bg-gradient-to-br from-[#ffffff] via-[#f8fafc] to-[#eff6ff] pt-40 pb-36 md:pt-48 md:pb-36">
                <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-[#38BDF8] opacity-5 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-[350px] h-[350px] bg-[#7DD3FC] opacity-5 rounded-full blur-[100px] pointer-events-none" />

                <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <div className={`space-y-6 order-1 lg:order-2 flex flex-col items-center text-center lg:items-start lg:text-start transition-all duration-1000 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] border border-[#0EA5E9]/20 bg-[#0EA5E9]/5 rounded-full px-4 py-1.5">
                            من نحن
                        </span>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#0f172a] leading-tight">
                            Oday{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#0EA5E9] to-[#38BDF8]">
                                Tourism
                            </span>
                        </h1>
                        <p className="text-[#64748b] text-base md:text-lg leading-relaxed max-w-lg">
                            نصنع لك تجارب سفر لا تُنسى في قلب مصر — من البحر الأحمر إلى الصحراء الذهبية. فريقنا يرافقك من التخطيط حتى العودة.
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2 w-full">
                            <a
                                href={`/${lang}/trips`}
                                className="flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-full shadow-lg  hover:scale-105 transition-all text-sm"
                            >
                                احجز رحلتك الآن
                                <svg className="w-4 h-4 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                            </a>
                            <a
                                href="https://wa.me/201032549630"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 border border-[#cbd5e1] text-[#0f172a] font-semibold px-6 py-3 rounded-full hover:bg-[#f8fafc] transition text-sm"
                            >
                                تواصل معنا
                            </a>
                        </div>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start pt-8 mt-4 border-t border-[#e2e8f0] w-full">
                            {[
                                { number: "500+", label: "رحلة سياحية" },
                                { number: "10+", label: "سنوات خبرة" },
                                { number: "1000+", label: "عميل سعيد" },
                            ].map((stat, index) => (
                                <div key={stat.label} className={`flex flex-col items-center lg:items-start px-4 sm:px-6 md:px-8 ${index !== 2 ? "border-l border-[#e2e8f0]" : ""} ${index === 0 ? "lg:pr-0 pl-4 sm:pl-6 md:pl-8" : ""}`}>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-3xl md:text-4xl font-black text-[#0f172a]">{stat.number.replace('+', '')}</span>
                                        <span className="text-xl md:text-2xl font-bold text-[#0f172a]">+</span>
                                    </div>
                                    <p className="text-xs sm:text-sm font-medium text-[#64748b] mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={`order-2 lg:order-1 relative transition-all duration-1000 delay-200 ${loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)] rotate-1">
                            <Image
                                src="/optimized/sharm-activities.webp"
                                alt="أنشطة شرم الشيخ - رحلات بحرية وسفاري وألعاب مائية"
                                width={1200}
                                height={900}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={62}
                                className="w-full h-[450px] object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/60 to-transparent" />
                        </div>
                        <div className="absolute -bottom-5 -right-4 bg-white rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center">
                                <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-[#111]">خبرة موثوقة</p>
                                <p className="text-xs text-gray-500">شرم الشيخ • مصر</p>
                            </div>
                        </div>
                    </div>

                </div>
            </section>


            {/* ── 2. WHO WE ARE ── */}
            <section className="py-16 md:py-24 px-6 md:px-12">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6 order-2 lg:order-1 ">
                        <ScrollReveal>
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-1 block">
                                تعرّف علينا
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#111] leading-tight">
                                من نحن
                            </h2>
                        </ScrollReveal>

                        <ScrollReveal delay={100}>
                            <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                                عدي توريزم (Oday Tourism) شركة سياحية متخصصة في تقديم خدمات سياحية متكاملة داخل مصر، وبشكل خاص في شرم الشيخ، إحدى أبرز وجهات البحر الأحمر.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                                نقدم خدمات حجز الفنادق، وتنظيم الرحلات الداخلية مثل اليخوت والسفاري والأنشطة البحرية، بالإضافة إلى إعداد برامج سياحية تناسب مختلف الاحتياجات، مع الحرص على الجودة، التنظيم، والأسعار المناسبة.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <p className="text-[#444] text-base md:text-lg leading-[1.9]">
                                نهدف إلى تقديم تجربة سفر مريحة وآمنة ومميزة، تبدأ من التخطيط وحتى نهاية الرحلة، مع اهتمام كامل بالتفاصيل ورضا العملاء.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal delay={400}>
                            <p className="text-[#555] text-base md:text-lg leading-[1.9] font-medium border-r-4 border-[#0EA5E9] pr-5 py-2">
                                عدي توريزم شركة مرخصة رسميًا داخل جمهورية مصر العربية، وتعمل وفق الأنظمة والقوانين المنظمة للعمل السياحي، بما يضمن المصداقية والموثوقية.
                                <span className="block mt-3 text-sm flex flex-col gap-1">
                                    <span>📄 السجل التجاري: 260221</span>
                                    <span>🧾 الرقم الضريبي: 771-779-046</span>
                                </span>
                            </p>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={150} className="order-1 lg:order-2 lg:mr-8">
                        <div className="relative scale-105 lg:scale-110 mt-4 lg:mt-0">
                            <Image
                                src="/image.png"
                                alt="فريق عدي توريزم في شرم الشيخ، مصر"
                                width={1200}
                                height={900}
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                quality={58}
                                className="w-full rounded-3xl shadow-xl object-cover object-bottom min-h-[400px] sm:min-h-[470px] aspect-[5/4]"
                            />
                            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-[#0EA5E9]/10 -z-10" />
                            <div className="absolute -top-4 -left-4 w-20 h-20 rounded-2xl bg-[#F5E6D3]/60 -z-10" />
                        </div>
                    </ScrollReveal>
                </div>
            </section>


            {/* ── 3. OUR SERVICES ── */}
            <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
                <ScrollReveal className="text-center mb-14">
                    <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-2 block">
                        ماذا نقدم
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-[#111]">خدماتنا</h2>
                    <p className="mt-4 text-[#6B7280] text-base md:text-lg max-w-xl mx-auto">
                        نقدم مجموعة متكاملة من الخدمات السياحية لتلبية جميع احتياجاتك
                    </p>
                </ScrollReveal>

                <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((s, i) => (
                        <ScrollReveal key={s.title} delay={i * 100}>
                            <div className="rounded-3xl border border-[#E5E7EB] p-7 text-center h-full hover:border-[#0EA5E9]/30 hover:shadow-lg transition-all duration-300 group bg-[#FAFAFA] hover:bg-white">
                                <div className="text-[#0EA5E9] mb-5 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                    {renderServiceIcon(s.icon)}
                                </div>
                                <h3 className="text-lg font-bold text-[#111] mb-3">{s.title}</h3>
                                <p className="text-[#6B7280] text-sm leading-relaxed">{s.desc}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </section>


            {/* ── 4. WHY CHOOSE US ── */}
            <section className="py-16 md:py-24 px-6 md:px-12 bg-white">
                <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    <ScrollReveal className="order-2 lg:order-2 relative">
                        <Image
                            src="/optimized/about-activities.avif"
                            alt="الأنشطة السياحية في شرم الشيخ - رحلات بحرية وسفاري"
                            width={1200}
                            height={1600}
                            sizes="(max-width: 1024px) 100vw, 50vw"
                            quality={55}
                            className="w-full h-[400px] lg:h-[600px] object-cover rounded-[2rem] shadow-2xl"
                        />
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-[2rem] bg-[#0EA5E9]/10 -z-10" />
                        <div className="absolute top-12 -left-6 w-24 h-24 rounded-[1.5rem] bg-[#111]/5 -z-10" />
                    </ScrollReveal>

                    <div className="order-1 lg:order-1 space-y-10">
                        <ScrollReveal>
                            <span className="text-xs font-semibold tracking-widest uppercase text-[#0EA5E9] mb-2 block">
                                لماذا نحن
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[#111] mb-4">
                                لماذا تختار Oday Tourism؟
                            </h2>
                            <p className="text-[#6B7280] text-base md:text-lg leading-relaxed">
                                اختيار شركة السياحة المناسبة هو الخطوة الأولى لرحلة ناجحة. نحن نجمع بين الجودة والسعر لتقديم تجربة مثالية.
                            </p>
                        </ScrollReveal>

                        <div className="space-y-6">
                            {advantages.map((a, i) => (
                                <ScrollReveal key={a.title} delay={100 + i * 50}>
                                    <div className="flex items-start gap-4 group">
                                        <div className="shrink-0 mt-1 w-12 h-12 rounded-xl bg-[#FAFAFA] border border-[#E5E7EB] flex items-center justify-center text-[#0EA5E9] group-hover:bg-[#0EA5E9] group-hover:text-white transition-colors duration-300">
                                            {renderAdvantageIcon(a.icon)}
                                        </div>
                                        <div>
                                            <h3 className="text-[17px] font-bold text-[#111] mb-1 group-hover:text-[#0EA5E9] transition-colors">
                                                {a.title}
                                            </h3>
                                            <p className="text-[#6B7280] text-sm leading-relaxed">
                                                {a.desc}
                                            </p>
                                        </div>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <Reviews autoPlay={false} />

            <FAQSection lang="ar" />

            <section className="relative overflow-hidden">
                <Image
                    src="/optimized/about-experience.webp"
                    alt="اكتشف شرم الشيخ - شعاب مرجانية وصحراء ذهبية"
                    width={1600}
                    height={420}
                    sizes="100vw"
                    quality={60}
                    className="w-full h-[340px] md:h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />

                <div className="absolute inset-0 flex items-center justify-center px-6">
                    <ScrollReveal className="text-center max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            اكتشف سحر شرم الشيخ
                        </h2>
                        <p className="text-white/85 text-base md:text-lg leading-relaxed">
                            من الشعاب المرجانية الساحرة إلى الصحراء الذهبية، شرم الشيخ تقدم مغامرات لا حدود لها.
                            دعنا نأخذك في رحلة لا تُنسى مع Oday Tourism.
                        </p>
                    </ScrollReveal>
                </div>
            </section>
        </main>
    );
}
