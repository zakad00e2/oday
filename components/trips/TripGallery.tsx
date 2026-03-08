"use client";

import { useState } from "react";
import ScrollReveal from "../ScrollReveal";

export default function TripGallery({ images, tripTitle }: { images: string[]; tripTitle: string }) {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

    return (
        <section id="gallery" className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">معرض الصور</h2>
                </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {images.map((img, i) => (
                    <ScrollReveal key={i} delay={i * 60}>
                        <button
                            onClick={() => setLightboxIdx(i)}
                            className={`relative overflow-hidden rounded-2xl group cursor-pointer ${i === 0 ? "col-span-2 md:col-span-2 row-span-2 aspect-[4/3]" : "aspect-square"
                                }`}
                        >
                            <img
                                src={img}
                                alt={`${tripTitle} - صورة ${i + 1}`}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                </svg>
                            </div>
                        </button>
                    </ScrollReveal>
                ))}
            </div>

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        className="absolute top-6 left-6 text-white/80 hover:text-white transition z-10"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Prev */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Next */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <img
                        src={images[lightboxIdx]}
                        alt={`${tripTitle} - صورة ${lightboxIdx + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {lightboxIdx + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
