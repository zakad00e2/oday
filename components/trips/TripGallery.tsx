"use client";

import { useState } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import ScrollReveal from "../ScrollReveal";

export default function TripGallery({
    images,
    tripTitle,
    youtubeUrl,
    youtubeIsShort = false,
    title,
    videoTitle,
    imageLabel,
}: {
    images: string[];
    tripTitle: string;
    youtubeUrl?: string;
    youtubeIsShort?: boolean;
    title: string;
    videoTitle: string;
    imageLabel: string;
}) {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    const hasGalleryContent = Boolean(youtubeUrl) || images.length > 0;

    return (
        <section id="gallery" className="border-t border-[#e2e8f0] py-10 md:py-14 scroll-mt-24">
            <ScrollReveal>
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F59E0B]/10 text-[#F59E0B]">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">{title}</h2>
                </div>
            </ScrollReveal>

            {hasGalleryContent ? (
                <div className="grid gap-4 md:auto-rows-[280px] md:grid-cols-2 xl:grid-cols-3">
                    {youtubeUrl ? (
                        <ScrollReveal delay={0} className="md:row-span-2">
                            <div
                                className={`h-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-sm ${youtubeIsShort ? "bg-black" : "bg-white"}`}
                            >
                                {youtubeIsShort ? (
                                    <div className="flex min-h-[520px] items-center justify-center p-4 md:h-full md:min-h-0 md:p-0">
                                        <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[20px] md:h-full md:w-auto md:max-w-full md:rounded-none">
                                            <iframe
                                                src={youtubeUrl}
                                                title={videoTitle}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-[4/3] min-h-[260px] md:h-full md:min-h-0 md:aspect-auto">
                                        <iframe
                                            src={youtubeUrl}
                                            title={videoTitle}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ) : null}

                    {images.map((img, i) => (
                        <ScrollReveal key={`${img}-${i}`} delay={i * 40} className="h-full">
                            <button
                                onClick={() => setLightboxIdx(i)}
                                className="block h-full w-full overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-sm"
                            >
                                <div className="relative aspect-[4/3] min-h-[260px] md:h-full md:min-h-0 md:aspect-auto">
                                    <FlexibleImage
                                        src={img}
                                        alt={`${tripTitle} - ${imageLabel} ${i + 1}`}
                                        fill
                                        sizes="(max-width: 1280px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 hover:scale-105"
                                    />
                                </div>
                            </button>
                        </ScrollReveal>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center text-sm text-[#64748b]">
                    {imageLabel}
                </div>
            )}

            {lightboxIdx !== null && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        className="absolute top-6 left-6 z-10 cursor-pointer text-white/80 transition hover:text-white"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    <button
                        className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer p-2 text-white/70 transition hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    <button
                        className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer p-2 text-white/70 transition hover:text-white"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <FlexibleImage
                        src={images[lightboxIdx]}
                        alt={`${tripTitle} - ${imageLabel} ${lightboxIdx + 1}`}
                        width={1600}
                        height={1200}
                        sizes="100vw"
                        className="max-h-[85vh] max-w-full rounded-2xl object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-white/70">
                        {lightboxIdx + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}
