"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripOverview({ description }: { description: string }) {
    return (
        <section>
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">تفاصيل الرحلة</h2>
                </div>
            </ScrollReveal>
            <ScrollReveal delay={100}>
                <p className="text-[#444] text-base md:text-lg leading-[2] max-w-3xl whitespace-pre-line">
                    {description}
                </p>
            </ScrollReveal>
        </section>
    );
}
