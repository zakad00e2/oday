"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripIncludes({ items }: { items: string[] }) {
    return (
        <div>
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">ماذا تشمل الرحلة؟</h2>
                </div>
            </ScrollReveal>

            <div className="space-y-3">
                {items.map((item, i) => (
                    <ScrollReveal key={i} delay={i * 60}>
                        <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-[#f0f0f0] shadow-sm">
                            <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
                                <svg className="w-3.5 h-3.5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <span className="text-sm text-[#334155] font-medium">{item}</span>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
