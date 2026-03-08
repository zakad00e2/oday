"use client";

import { allTrips } from "@/lib/trips-data";
import TripCard from "./TripCard";
import ScrollReveal from "../ScrollReveal";

export default function TripsGrid() {
    const [featured, ...rest] = allTrips;

    return (
        <section id="trips" className="py-16 md:py-24 bg-background">
            <div className="max-w-300 mx-auto px-6 md:px-12">
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#2563eb] bg-[#2563eb]/8 rounded-full px-4 py-1.5 mb-4">
                            رحلاتنا المميزة
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-[#0f172a] mb-4 font-arabic">
                            اختر رحلتك{" "}
                            <span className="text-[#2563eb]">المفضلة</span>
                        </h2>
                        <p className="text-[#64748b] text-base max-w-lg mx-auto font-arabic">
                             رحلات وانشطة متنوعة في انتظارك — كل رحلة تجربة لا تُنسى
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
