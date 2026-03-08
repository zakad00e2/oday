"use client";

import ScrollReveal from "../ScrollReveal";

export default function TripVideo({ url }: { url: string }) {
    return (
        <section className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#EF4444]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">فيديو الرحلة</h2>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#f0f0f0] aspect-video">
                    <iframe
                        src={url}
                        title="فيديو الرحلة"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    />
                </div>
            </ScrollReveal>
        </section>
    );
}
