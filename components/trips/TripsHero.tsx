"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripsHero() {
    const whatsappUrl = `https://wa.me/201032549630?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن الرحلات المتاحة")}`;

    const stats = [
        { num: "+9", label: "رحلات مميزة" },
        { num: "+500", label: "عميل سعيد" },
        { num: "يومياً", label: "رحلات متاحة" },
    ];

    return (
        <section className="w-full px-3 md:px-5 pt-20 pb-10">
            <div className="relative overflow-hidden rounded-[2rem] h-[60vh] sm:h-[70vh] md:h-[85vh] flex flex-col items-center justify-center mx-auto max-w-[1600px] shadow-2xl">

                {/* Background image */}
                <img
                    src="/clear.png"
                    alt="رحلات سياحية فاخرة"
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/75" />

                {/* Main content — centered */}
                <div className="relative z-10 flex flex-col items-center text-center px-6 md:px-16 py-20 max-w-4xl mx-auto">

                    {/* Badge */}
                    <ScrollReveal>
                        <span className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-semibold tracking-wider text-[#93C5FD] border border-white/40 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 sm:px-5 sm:py-2 mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] inline-block animate-pulse" />
                            الخيار الأمثل لرحلتك القادمة
                        </span>
                    </ScrollReveal>

                    {/* Heading */}
                    <ScrollReveal delay={100}>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.4)' }}>
                            اكتشف  التجارب السياحية
                            <br />
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-l from-[#93C5FD] to-white pb-2">
                                في شرم الشيخ
                            </span>
                        </h1>
                    </ScrollReveal>

                    {/* Description */}
                    <ScrollReveal delay={200}>
                        <p className="text-sm sm:text-base md:text-lg leading-loose max-w-lg mb-10 text-white/80" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.3)' }}>
                            نقدم لك أفضل الرحلات والأنشطة السياحية
                            <br />
                            بتنظيم احترافي وخدمة موثوقة
                        </p>
                    </ScrollReveal>

                    {/* CTA */}
                    <ScrollReveal delay={300}>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <a
                                href="#trips"
                                className="group inline-flex items-center gap-2 sm:gap-2.5 pr-5 pl-2 py-2 sm:pr-7 sm:pl-2.5 sm:py-2.5 rounded-full bg-gradient-to-l from-[#0C5B94] to-[#1D74B3] text-white text-sm sm:text-base font-semibold shadow-md hover:scale-105 transition-all duration-300"
                            >

                                استكشف الرحلات
                                <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#111] shadow-sm">
                                    <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                    </svg>
                                </span>
                            </a>
                            {/* <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 border border-white/35 bg-white/10 backdrop-blur-md text-white font-semibold px-7 py-4 rounded-full hover:bg-white/20 hover:border-white/55 hover:scale-105 transition-all duration-300 text-sm md:text-base"
                            >
                                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.438C7.869 23.456 9.895 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.76-.514-5.352-1.442l-.384-.228-3.644.854.893-3.546-.252-.399A9.773 9.773 0 012.18 12c0-5.423 4.397-9.82 9.82-9.82 5.423 0 9.82 4.397 9.82 9.82 0 5.423-4.397 9.82-9.82 9.82z" />
                                </svg>
                                تواصل واتساب
                            </a> */}
                        </div>
                    </ScrollReveal>
                </div>

                {/* Stats bar — pinned to bottom of container */}
                {/* <ScrollReveal delay={400}>
                    <div className="absolute bottom-0 left-0 right-0 flex items-stretch justify-center divide-x divide-white/10 rtl:divide-x-reverse bg-black/35 backdrop-blur-md border-t border-white/10 rounded-b-[2.5rem] overflow-hidden">
                        {stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center justify-center py-5 px-8 md:px-16 gap-1">
                                <p className="text-white font-extrabold text-xl md:text-2xl leading-none">{stat.num}</p>
                                <p className="text-white/50 text-xs">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </ScrollReveal> */}

            </div>
        </section>
    );
}
