"use client";

import Link from "next/link";
import Image from "next/image";
import { TripDetail } from "@/lib/trips-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/dictionary-context";

export default function TripCard({ trip, index, featured = false }: { trip: TripDetail; index: number; featured?: boolean }) {
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const title = isAr ? trip.titleAr : (trip.titleEn || trip.titleAr);
    const tagline = isAr ? trip.taglineAr : (trip.taglineEn || trip.taglineAr);
    const cta = isAr ? "عرض التفاصيل والحجز" : "View details and book";
    const hasImage = Boolean(trip.heroImage);

    return (
        <div className={`group relative block overflow-hidden rounded-3xl ${
                featured ? "aspect-[4/5] md:aspect-[21/9]" : "aspect-[4/5]"
            }`}
        >
            <Link
                href={`/${lang}/trips/${trip.slug}`}
                className="absolute inset-0"
                aria-label={title}
            >
            {hasImage ? (
                <Image
                    src={trip.heroImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={index === 0}
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0EA5E9] to-[#0369A1] flex items-center justify-center">
                    <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-colors duration-500" />

            <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">

                <h3 className={`font-extrabold text-white leading-snug mb-2 ${isAr ? "font-arabic" : ""} ${
                    featured ? "text-lg md:text-3xl" : "text-lg"
                }`}>
                    {title}
                </h3>

                <p className={`hidden md:block text-white/65 text-sm leading-relaxed ${isAr ? "font-arabic" : ""} mb-4 line-clamp-2 overflow-hidden transition-all duration-500 ease-in-out ${
                    featured
                        ? "max-h-20 opacity-100"
                        : "max-h-0 opacity-0 mb-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mb-4"
                }`}>
                    {tagline}
                </p>

                <span className="inline-flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                    {cta}
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
            </div>
            </Link>
        </div>
    );
}
