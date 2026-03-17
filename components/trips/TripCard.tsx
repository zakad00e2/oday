"use client";

import Link from "next/link";
import Image from "next/image";
import { TripDetail } from "@/lib/trips-types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n/dictionary-context";

export default function TripCard({ trip, index, featured = false }: { trip: TripDetail; index: number; featured?: boolean }) {
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const title = isAr ? trip.titleAr : trip.titleEn;
    const tagline = isAr ? trip.taglineAr : trip.taglineEn;
    const cta = isAr ? "عرض التفاصيل والحجز" : "View details and book";

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
            {/* Background Image */}
            <Image
                src={trip.heroImage}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority={index === 0}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-colors duration-500" />

            {/* Bottom Content */}
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

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                    {cta}
                    {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </span>
            </div>
            </Link>
        </div>
    );
}
