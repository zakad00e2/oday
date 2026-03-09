"use client";

import { useState } from "react";
import Link from "next/link";
import { TripDetail } from "@/lib/trips-types";
import { ChevronLeft } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import TripQuickAddModal from "./TripQuickAddModal";

export default function TripCard({ trip, index, featured = false }: { trip: TripDetail; index: number; featured?: boolean }) {
    const { removeTrip, cart } = useCart();
    const isInCart = cart.trips.some((t) => t.slug === trip.slug);
    const [showModal, setShowModal] = useState(false);

    return (
        <div className={`group relative block overflow-hidden rounded-3xl ${
                featured ? "aspect-[4/5] md:aspect-[21/9]" : "aspect-[4/5]"
            }`}
        >
            {/* Add to cart button */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    if (isInCart) {
                        removeTrip(trip.slug);
                    } else {
                        setShowModal(true);
                    }
                }}
                aria-label={isInCart ? "إزالة من السلة" : "إضافة للسلة"}
                className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center font-bold text-lg shadow-md transition-all duration-200 ${
                    isInCart
                        ? "bg-[#0EA5E9] text-white scale-110"
                        : "bg-white/90 text-[#0F172A] hover:bg-[#0EA5E9] hover:text-white"
                }`}
            >
                {isInCart ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                )}
            </button>

            <Link
                href={`/trips/${trip.slug}`}
                className="absolute inset-0"
                aria-label={trip.titleAr}
            >
            {/* Background Image */}
            <img
                src={trip.heroImage}
                alt={trip.titleAr}
                loading={index === 0 ? "eager" : "lazy"}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10 group-hover:from-black/90 transition-colors duration-500" />

            {/* Bottom Content */}
            <div className="absolute bottom-0 inset-x-0 p-5 md:p-6">

                {/* Arabic title */}
                <h3 className={`font-extrabold text-white leading-snug mb-2 font-arabic ${
                    featured ? "text-lg md:text-3xl" : "text-lg"
                }`}>
                    {trip.titleAr}
                </h3>

                {/* Tagline — hidden on mobile, visible on hover for non-featured on md+, always for featured */}
                <p className={`hidden md:block text-white/65 text-sm leading-relaxed font-arabic mb-4 line-clamp-2 overflow-hidden transition-all duration-500 ease-in-out ${
                    featured
                        ? "max-h-20 opacity-100"
                        : "max-h-0 opacity-0 mb-0 group-hover:max-h-20 group-hover:opacity-100 group-hover:mb-4"
                }`}>
                    {trip.taglineAr}
                </p>

                {/* CTA */}
                <span className="inline-flex items-center gap-2 text-sm font-bold text-white/90 group-hover:text-white group-hover:gap-3 transition-all duration-300">
                    عرض التفاصيل
                    <ChevronLeft className="w-4 h-4" />
                </span>
            </div>
            </Link>

            {/* Quick Add Modal */}
            {showModal && (
                <TripQuickAddModal
                    trip={trip}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
