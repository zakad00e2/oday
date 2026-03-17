"use client";

import { allTrips } from "@/lib/trips-data";
import TripCard from "./TripCard";
import ScrollReveal from "../ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";
import type { ReactNode } from "react";

export default function TripsGrid() {
    const { lang } = useI18n();
    const t = (ar: ReactNode, en: ReactNode) => (lang === "ar" ? ar : en);
    const [featured, ...rest] = allTrips;

    return (
        <section id="trips" className="py-16 md:py-24 bg-background">
            <div className="max-w-300 mx-auto px-6 md:px-12">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#2563eb] bg-[#2563eb]/8 rounded-full px-4 py-1.5 mb-4">
                            {t("رحلاتنا المميزة", "Featured trips")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4">
                            {t(
                                <>
                                    اختر رحلتك <span className="text-[#2563eb]">المفضلة</span>
                                </>,
                                <>
                                    Pick your <span className="text-[#2563eb]">favorite</span> trip
                                </>
                            )}
                        </h2>
                        <p className="text-[#64748b] text-base max-w-lg mx-auto">
                            {t(
                                "رحلات وانشطة متنوعة في انتظارك — كل رحلة تجربة لا تُنسى",
                                "A variety of trips and activities await you — every trip is unforgettable"
                            )}
                        </p>
                    </div>
                </ScrollReveal>

                {/* Featured card — full width */}
                {featured && (
                    <ScrollReveal>
                        <div className="mb-4 md:mb-5">
                            <TripCard trip={featured} index={0} featured />
                        </div>
                    </ScrollReveal>
                )}

                {/* Rest — 3-column grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                    {rest.map((trip, index) => (
                        <ScrollReveal key={trip.slug} delay={index * 70}>
                            <TripCard trip={trip} index={index + 1} />
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
