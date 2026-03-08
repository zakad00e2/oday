"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripEssentials({ items }: { items: string[] }) {
    return (
        <div>
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-[#f4f5f7] flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#6b7280]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-[#0F2854]">ماذا تحتاج أن تأخذ معك؟</h2>
                </div>
            </ScrollReveal>

            <div className="space-y-2">
                {items.map((item, i) => (
                    <ScrollReveal key={i} delay={i * 60}>
                        <div className="flex items-center gap-3 px-1 py-2">
                            <svg className="w-4 h-4 text-[#4988C4] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            <span className="text-sm text-[#374151] font-medium">{item}</span>
                        </div>
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
}
