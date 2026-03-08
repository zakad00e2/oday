"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { getTripBySlug } from "@/lib/trips-data";
import { TripDetail } from "@/lib/trips-types";
import TripDetailHero from "@/components/trips/TripDetailHero";
import TripOverview from "@/components/trips/TripOverview";
import TripSchedule from "@/components/trips/TripSchedule";
import TripIncludes from "@/components/trips/TripIncludes";
import TripEssentials from "@/components/trips/TripEssentials";
import TripGallery from "@/components/trips/TripGallery";
import TripVideo from "@/components/trips/TripVideo";
import TripOptions from "@/components/trips/TripOptions";
import TripAddOns from "@/components/trips/TripAddOns";
import TripPriceSummary from "@/components/trips/TripPriceSummary";
import TripBookingForm from "@/components/trips/TripBookingForm";

export default function TripDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const trip = getTripBySlug(slug);

    // --- State for selections ---
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [optionQuantities, setOptionQuantities] = useState<Record<string, number>>({});
    const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());
    const [guestCount, setGuestCount] = useState(1);
    const [childrenCount, setChildrenCount] = useState(0);

    const bookingRef = useRef<HTMLDivElement>(null);

    // Initialize first option as selected
    useEffect(() => {
        if (trip && trip.options.length > 0 && !selectedOptionId) {
            setSelectedOptionId(trip.options[0].id);
            const initialQty: Record<string, number> = {};
            trip.options.forEach((o) => { initialQty[o.id] = 1; });
            setOptionQuantities(initialQty);
        }
    }, [trip, selectedOptionId]);

    if (!trip) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0f172a] mb-4">404</h1>
                    <p className="text-[#64748b] text-lg">الرحلة غير موجودة</p>
                    <a href="/trips" className="inline-block mt-6 bg-[#2563EB] text-white px-6 py-3 rounded-full font-bold hover:bg-[#1d4ed8] transition">
                        العودة للرحلات
                    </a>
                </div>
            </main>
        );
    }

    // --- Price computation ---
    const selectedOption = trip.options.find((o) => o.id === selectedOptionId);
    const optionPrice = selectedOption
        ? selectedOption.price * (optionQuantities[selectedOption.id] || 1)
        : 0;
    const addOnsTotal = trip.addOns
        .filter((a) => selectedAddOnIds.has(a.id))
        .reduce((sum, a) => sum + a.price, 0);
    const totalPrice = optionPrice + addOnsTotal;

    const toggleAddOn = (id: string) => {
        setSelectedAddOnIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const updateQuantity = (optionId: string, qty: number) => {
        setOptionQuantities((prev) => ({ ...prev, [optionId]: Math.max(1, qty) }));
    };

    const scrollToBooking = () => {
        bookingRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <main className="bg-[#FAFAFA]">
            <TripDetailHero trip={trip} onBookNow={scrollToBooking} />

            <div className="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12">
                {/* Overview + Schedule side by side */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 py-10 md:py-14 border-b border-[#e2e8f0]">
                    <TripOverview description={trip.descriptionAr} />
                    <TripSchedule schedule={trip.schedule} />
                </div>

                {/* Includes & Essentials side by side on large */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 py-10">
                    <TripIncludes items={trip.includes} />
                    <TripEssentials items={trip.essentials} />
                </div>

                {/* Gallery */}
                {trip.galleryImages.length > 0 && (
                    <TripGallery images={trip.galleryImages} tripTitle={trip.titleAr} />
                )}

                {/* Video */}
                {trip.youtubeUrl && <TripVideo url={trip.youtubeUrl} />}

                {/* Options */}
                {trip.options.length > 0 && (
                    <TripOptions
                        options={trip.options}
                        selectedOptionId={selectedOptionId}
                        onSelectOption={setSelectedOptionId}
                        quantities={optionQuantities}
                        onUpdateQuantity={updateQuantity}
                    />
                )}

                {/* Add-ons */}
                {trip.addOns.length > 0 && (
                    <TripAddOns
                        addOns={trip.addOns}
                        selectedIds={selectedAddOnIds}
                        onToggle={toggleAddOn}
                    />
                )}

                {/* Price Summary */}
                {(trip.options.length > 0 || trip.addOns.length > 0) && totalPrice > 0 && (
                    <TripPriceSummary
                        selectedOption={selectedOption || null}
                        quantity={selectedOption ? (optionQuantities[selectedOption.id] || 1) : 0}
                        addOns={trip.addOns.filter((a) => selectedAddOnIds.has(a.id))}
                        total={totalPrice}
                    />
                )}

                {/* Booking Form */}
                <div ref={bookingRef}>
                    <TripBookingForm
                        trip={trip}
                        selectedOptionId={selectedOptionId}
                        selectedAddOnIds={selectedAddOnIds}
                        guestCount={guestCount}
                        childrenCount={childrenCount}
                        onGuestCountChange={setGuestCount}
                        onChildrenCountChange={setChildrenCount}
                        totalPrice={totalPrice}
                    />
                </div>
            </div>
        </main>
    );
}
