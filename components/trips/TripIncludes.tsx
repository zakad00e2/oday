"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripIncludes({ items }: { items: string[] }) {
    return (
        <div>
            <ScrollReveal>
                <div className="flex items-center gap-3 my-5 ">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">ماذا تشمل الرحلة؟</h2>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {items.map((item, i) => (
                    <ScrollReveal key={i} delay={i * 40}>
                        <div className="flex items-center gap-2.5 px-1 py-2">
                            <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-[#374151] font-medium leading-snug">{item}</span>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
