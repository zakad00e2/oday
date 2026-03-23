"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getTripBySlug } from "@/lib/trips-data";
import TripDetailHero from "@/components/trips/TripDetailHero";
import TripOverview from "@/components/trips/TripOverview";
import TripSchedule from "@/components/trips/TripSchedule";
import TripIncludes from "@/components/trips/TripIncludes";
import TripGallery from "@/components/trips/TripGallery";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { tripDetailEn } from "@/lib/trip-detail-locales";

export default function TripDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const trip = getTripBySlug(slug);
    const { lang } = useI18n();
    const isAr = lang === "ar";

    const [selectedOptionIds, setSelectedOptionIds] = useState<Set<string>>(new Set());
    const [personCounts, setPersonCounts] = useState<Record<string, number>>(() => {
        if (!trip) return {};
        const p: Record<string, number> = {};
        trip.options.forEach((o) => { p[o.id] = 1; });
        return p;
    });
    const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());
    const [addOnPersonCounts, setAddOnPersonCounts] = useState<Record<string, number>>(() => {
        if (!trip) return {};
        const p: Record<string, number> = {};
        trip.addOns.forEach((a) => { p[a.id] = 1; });
        return p;
    });

    const optionsRef = useRef<HTMLDivElement>(null);

    const { addTrip, removeTrip, cart, openCart } = useCart();
    const [justAdded, setJustAdded] = useState(false);
    const tripLocale = !isAr && trip ? tripDetailEn[trip.slug] : null;
    const tripTitle = trip ? (isAr ? trip.titleAr : trip.titleEn) : "";
    const tripDescription = trip ? (isAr ? trip.descriptionAr : tripLocale?.description ?? trip.descriptionEn) : "";
    const tripIncludes = trip ? (isAr ? trip.includesAr : trip.includesEn) : [];
    const tripDuration = trip
        ? (isAr
            ? trip.schedule.durationAr
            : tripLocale?.duration ?? trip.schedule.durationEn)
        : "";
    const tripFrequency = trip
        ? (isAr
            ? trip.schedule.frequencyAr
            : tripLocale?.frequency ?? trip.schedule.frequencyEn)
        : "";

    // Load selections from cart if trip exists in cart (only on mount or when cart trip changes)
    useEffect(() => {
        if (!trip) return;
        
        const cartTrip = cart.trips.find((t) => t.slug === trip.slug);
        if (!cartTrip) return;

        // Load selected options
        if (cartTrip.selectedOptions && cartTrip.selectedOptions.length > 0) {
            const optionIds = new Set<string>();
            const newPersonCounts: Record<string, number> = {};
            
            // Initialize all options to 1 first
            trip.options.forEach((o) => { newPersonCounts[o.id] = 1; });
            
            cartTrip.selectedOptions.forEach((selectedOption) => {
                // Find matching option by name (since we only store nameAr in cart)
                const matchingOption = trip.options.find((o) => o.nameAr === selectedOption.nameAr);
                if (matchingOption) {
                    optionIds.add(matchingOption.id);
                    newPersonCounts[matchingOption.id] = selectedOption.persons || 1;
                }
            });
            
            setSelectedOptionIds(optionIds);
            setPersonCounts(newPersonCounts);
        }

        // Load selected add-ons
        if (cartTrip.selectedAddOns && cartTrip.selectedAddOns.length > 0) {
            const addOnIds = new Set<string>();
            const newAddOnPersonCounts: Record<string, number> = {};
            
            // Initialize all add-ons to 1 first
            trip.addOns.forEach((a) => { newAddOnPersonCounts[a.id] = 1; });
            
            cartTrip.selectedAddOns.forEach((selectedAddOn) => {
                // Find matching add-on by name (since we only store nameAr in cart)
                const matchingAddOn = trip.addOns.find((a) => a.nameAr === selectedAddOn.nameAr);
                if (matchingAddOn) {
                    addOnIds.add(matchingAddOn.id);
                    newAddOnPersonCounts[matchingAddOn.id] = selectedAddOn.persons || 1;
                }
            });
            
            setSelectedAddOnIds(addOnIds);
            setAddOnPersonCounts(newAddOnPersonCounts);
        }
    }, [trip?.slug, JSON.stringify(cart.trips.find((t) => t.slug === trip?.slug))]);  // Re-run when this trip's cart data changes

    useEffect(() => {
        // Reserved for future cart updates if needed
    }, [cart.trips.length, trip?.slug]);

    if (!trip) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0f172a] mb-4">404</h1>
                    <p className="text-[#64748b] text-lg">{isAr ? "الرحلة غير موجودة" : "Trip not found"}</p>
                    <Link href={`/${lang}/trips`} className="inline-block mt-6 bg-[#0EA5E9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0284C7] transition">
                        {isAr ? "العودة للرحلات" : "Back to trips"}
                    </Link>
                </div>
            </main>
        );
    }

    // --- Price computation ---
    const selectedOptions = trip.options.filter((o) => selectedOptionIds.has(o.id));
    const optionsTotal = selectedOptions.reduce((sum, o) => sum + o.price * (personCounts[o.id] || 1), 0);
    const addOnsTotal = trip.addOns
        .filter((a) => selectedAddOnIds.has(a.id))
        .reduce((sum, a) => sum + a.price * (addOnPersonCounts[a.id] || 1), 0);
    const totalPriceGroup = optionsTotal + addOnsTotal;

    const isInCart = cart.trips.some((t) => t.slug === trip.slug);
    const cartTrip = cart.trips.find((t) => t.slug === trip.slug);
    const selectedAddOns = trip.addOns.filter((a) => selectedAddOnIds.has(a.id));

    // Check if current selections differ from cart
    let hasChanges = false;
    if (isInCart && cartTrip) {
        const cartOpts = cartTrip.selectedOptions || [];
        if (cartOpts.length !== selectedOptions.length) {
            hasChanges = true;
        } else {
            for (const co of cartOpts) {
                const match = selectedOptions.find(o => o.nameAr === co.nameAr);
                if (!match || (personCounts[match.id] || 1) !== (co.persons || 1)) {
                    hasChanges = true;
                    break;
                }
            }
        }

        if (!hasChanges) {
            const cartAdds = cartTrip.selectedAddOns || [];
            if (cartAdds.length !== selectedAddOns.length) {
                hasChanges = true;
            } else {
                for (const ca of cartAdds) {
                    const match = selectedAddOns.find(a => a.nameAr === ca.nameAr);
                    if (!match || (addOnPersonCounts[match.id] || 1) !== (ca.persons || 1)) {
                        hasChanges = true;
                        break;
                    }
                }
            }
        }
    }

    // (Removed wasUpdated effect)

    // Reset justAdded flag after a short delay
    useEffect(() => {
        if (justAdded) {
            const timeout = setTimeout(() => setJustAdded(false), 100);
            return () => clearTimeout(timeout);
        }
    }, [justAdded]);

    const toggleAddOn = (id: string) => {
        setSelectedAddOnIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const toggleOptionId = (id: string) => {
        setSelectedOptionIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const scrollToOptions = () => {
        const target = optionsRef.current;
        if (!target) return;
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
    };

    const handleAddToCart = () => {
        const wasInCartBefore = isInCart;
        addTrip({
            slug: trip.slug,
            titleAr: trip.titleAr,
            titleEn: trip.titleEn,
            heroImage: trip.heroImage,
            startingPrice: trip.startingPrice,
            selectedOptions: selectedOptions.length > 0
                ? selectedOptions.map((o) => ({ nameAr: o.nameAr, nameEn: o.nameEn, price: o.price, persons: personCounts[o.id] || 1 }))
                : undefined,
            selectedAddOns: selectedAddOns.length > 0
                ? selectedAddOns.map((a) => ({ nameAr: a.nameAr, nameEn: a.nameEn, price: a.price, persons: addOnPersonCounts[a.id] || 1 }))
                : undefined,
        });
        if (!wasInCartBefore) {
            setJustAdded(true);
        }
    };

    const handleUpdateOrViewCart = () => {
        if (hasChanges) {
            handleAddToCart();
        } else {
            openCart();
        }
    };

    return (
        <main className="bg-[#FAFAFA]">
            <TripDetailHero
                heroImage={trip.heroImage}
                title={tripTitle}
                kicker={isAr ? trip.titleEn : trip.titleAr}
                tagline={isAr ? trip.taglineAr : tripLocale?.tagline ?? trip.taglineAr}
                duration={tripDuration}
                frequency={tripFrequency}
                startingPrice={trip.startingPrice}
                onBookNow={scrollToOptions}
                isAr={isAr}
            />

            <div className="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12">
                {/* Overview + Schedule (full width) */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 py-10 md:py-14 border-b border-[#e2e8f0]">
                    <TripOverview description={tripDescription} title={isAr ? "تفاصيل الرحلة" : "Trip details"} />
                    <TripSchedule
                        startTime={trip.schedule.startTime}
                        endTime={trip.schedule.endTime}
                        duration={tripDuration}
                        frequency={tripFrequency}
                        labels={{
                            start: isAr ? "بداية الرحلة" : "Start time",
                            end: isAr ? "نهاية الرحلة" : "End time",
                            duration: isAr ? "مدة الرحلة" : "Duration",
                            frequency: isAr ? "التكرار" : "Availability",
                            heading: isAr ? "مواعيد الرحلة" : "Trip schedule",
                        }}
                    />
                </div>

                {/* Includes */}
                <div className="py-10 md:py-14 border-b border-[#e2e8f0]">
                    <TripIncludes items={tripIncludes} title={isAr ? "ماذا تشمل الرحلة؟" : "What's included?"} />
                </div>

                {/* ── Combined Booking Section ── */}
                {(trip.options.length > 0 || trip.addOns.length > 0) && (
                    <div id="booking" ref={optionsRef} className="py-10 md:py-14" dir={isAr ? "rtl" : "ltr"}>
                        <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">

                            {/* Header */}
                            <div className="px-6 md:px-8 py-5 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#f8fafc]">
                                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#0f172a]">{isAr ? "خصّص رحلتك واحجز" : "Customize and book your trip"}</h2>
                                    <p className="text-xs text-[#64748b] mt-0.5">{isAr ? "اختر الخيار المناسب وأضف ما تريد" : "Pick your preferred option and add extras if you like"}</p>
                                </div>
                            </div>

                            {/* Options + AddOns Grid */}
                            <div className={`px-6 md:px-8 py-7 border-b border-[#e2e8f0] ${
                                trip.options.length > 0 && trip.addOns.length > 0
                                    ? "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10"
                                    : ""
                            }`}>

                                {/* Options */}
                                {trip.options.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="font-bold text-[#0f172a]">{isAr ? "خيارات الرحلة" : "Trip options"}</h3>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {trip.options.map((option) => {
                                                const isSelected = selectedOptionIds.has(option.id);
                                                return (
                                                    <div
                                                        key={option.id}
                                                        role="checkbox"
                                                        aria-checked={isSelected}
                                                        tabIndex={0}
                                                        onClick={() => toggleOptionId(option.id)}
                                                        onKeyDown={(e) => e.key === "Enter" && toggleOptionId(option.id)}
                                                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                                                            isSelected
                                                                ? "border-[#0EA5E9] bg-[#0EA5E9]/5"
                                                                : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0EA5E9]/40"
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-2.5 flex-1">
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                                    isSelected ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-[#cbd5e1]"
                                                                }`}>
                                                                    {isSelected && (
                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-[#0f172a] text-sm leading-tight">{isAr ? option.nameAr : option.nameEn}</p>
                                                                    {(isAr ? option.descriptionAr : tripLocale?.options?.[option.id]?.description ?? option.descriptionEn) && <p className="text-xs text-[#64748b] mt-0.5">{isAr ? option.descriptionAr : tripLocale?.options?.[option.id]?.description ?? option.descriptionEn}</p>}
                                                                    {(isAr ? option.capacityLabelAr : tripLocale?.options?.[option.id]?.capacityLabel ?? option.capacityLabelEn) && (
                                                                        <span className="inline-block mt-1.5 text-xs bg-[#f0f9ff] text-[#0EA5E9] font-medium rounded-full px-2.5 py-0.5">
                                                                            {isAr ? option.capacityLabelAr : tripLocale?.options?.[option.id]?.capacityLabel ?? option.capacityLabelEn}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <span className={`font-black shrink-0 ${
                                                                isSelected ? "text-[#0EA5E9]" : "text-[#0f172a]"
                                                            }`}>
                                                                {option.price > 0 ? `$${option.price}` : "—"}
                                                            </span>
                                                        </div>
                                                        {isSelected && (
                                                            <div className={`mt-3 flex items-center gap-2 ${isAr ? "mr-7" : "ml-7"}`} onClick={(e) => e.stopPropagation()}>
                                                                <svg className="w-4 h-4 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-xs text-[#64748b]">{isAr ? "عدد الأشخاص:" : "Guests:"}</span>
                                                                <div className="flex items-center bg-white rounded-full border border-[#e2e8f0]">
                                                                    <button onClick={(e) => { e.stopPropagation(); setPersonCounts((prev) => ({ ...prev, [option.id]: Math.max(1, (prev[option.id] || 1) - 1) })); }} className="px-2.5 py-1 text-[#64748b] text-sm font-bold hover:bg-[#f1f5f9] transition cursor-pointer">−</button>
                                                                    <span className="px-3 py-1 text-sm font-bold text-[#0f172a] min-w-[28px] text-center">{personCounts[option.id] || 1}</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); setPersonCounts((prev) => ({ ...prev, [option.id]: (prev[option.id] || 1) + 1 })); }} className="px-2.5 py-1 text-[#64748b] text-sm font-bold hover:bg-[#f1f5f9] transition cursor-pointer">+</button>
                                                                </div>
                                                                {option.price > 0 && (personCounts[option.id] || 1) > 1 && (
                                                                    <span className="text-xs font-bold text-[#0EA5E9]">= ${option.price * (personCounts[option.id] || 1)}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* AddOns */}
                                {trip.addOns.length > 0 && (
                                    <div>
                                        <div className="flex items-center gap-2 mb-4">
                                            <h3 className="font-bold text-[#0f172a]">{isAr ? "الإضافات" : "Add-ons"} <span className={`text-xs font-medium text-[#64748b] px-0 py-0.5 rounded-md ${isAr ? "mr-1" : "ml-1"}`}>{isAr ? "(اختياري)" : "(Optional)"}</span></h3>
                                        </div>
                                        <div className="flex flex-col gap-3">
                                            {trip.addOns.map((addOn) => {
                                                const isAddonSelected = selectedAddOnIds.has(addOn.id);
                                                return (
                                                    <div
                                                        key={addOn.id}
                                                        role="checkbox"
                                                        aria-checked={isAddonSelected}
                                                        tabIndex={0}
                                                        onClick={() => toggleAddOn(addOn.id)}
                                                        onKeyDown={(e) => e.key === "Enter" && toggleAddOn(addOn.id)}
                                                        className={`w-full ${isAr ? "text-right" : "text-left"} p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                            isAddonSelected
                                                                ? "border-[#F59E0B] bg-[#F59E0B]/5"
                                                                : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#F59E0B]/40"
                                                        }`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex items-start gap-2.5 flex-1">
                                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                                                    isAddonSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#cbd5e1]"
                                                                }`}>
                                                                    {isAddonSelected && (
                                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-[#0f172a] text-sm leading-tight">{isAr ? addOn.nameAr : addOn.nameEn}</p>
                                                                    {(isAr ? addOn.descriptionAr : tripLocale?.addOns?.[addOn.id]?.description ?? addOn.descriptionEn) && <p className="text-xs text-[#64748b] mt-0.5">{isAr ? addOn.descriptionAr : tripLocale?.addOns?.[addOn.id]?.description ?? addOn.descriptionEn}</p>}
                                                                </div>
                                                            </div>
                                                            <span className={`font-black shrink-0 ${isAddonSelected ? "text-[#F59E0B]" : "text-[#0f172a]"}`}>
                                                                {addOn.price > 0 ? `$${addOn.price}` : "—"}
                                                            </span>
                                                        </div>
                                                        {isAddonSelected && (
                                                            <div className={`mt-3 flex items-center gap-2 ${isAr ? "mr-7" : "ml-7"}`} onClick={(e) => e.stopPropagation()}>
                                                                <svg className="w-4 h-4 text-[#64748b] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                                <span className="text-xs text-[#64748b]">{isAr ? "عدد الأشخاص:" : "Guests:"}</span>
                                                                <div className="flex items-center bg-white rounded-full border border-[#e2e8f0]">
                                                                    <button onClick={(e) => { e.stopPropagation(); setAddOnPersonCounts((prev) => ({ ...prev, [addOn.id]: Math.max(1, (prev[addOn.id] || 1) - 1) })); }} className="px-2.5 py-1 text-[#64748b] text-sm font-bold hover:bg-[#f1f5f9] transition cursor-pointer">−</button>
                                                                    <span className="px-3 py-1 text-sm font-bold text-[#0f172a] min-w-7 text-center">{addOnPersonCounts[addOn.id] || 1}</span>
                                                                    <button onClick={(e) => { e.stopPropagation(); setAddOnPersonCounts((prev) => ({ ...prev, [addOn.id]: (prev[addOn.id] || 1) + 1 })); }} className="px-2.5 py-1 text-[#64748b] text-sm font-bold hover:bg-[#f1f5f9] transition cursor-pointer">+</button>
                                                                </div>
                                                                {addOn.price > 0 && (addOnPersonCounts[addOn.id] || 1) > 1 && (
                                                                    <span className="text-xs font-bold text-[#F59E0B]">= ${addOn.price * (addOnPersonCounts[addOn.id] || 1)}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Price Summary + CTA */}
                            <div className="px-6 md:px-8 py-5 bg-[#f8fafc] flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4">
                                <div className="w-full flex flex-col items-center sm:items-start text-center sm:text-start">
                                    {(selectedOptions.length > 0 || selectedAddOns.length > 0) && (
                                        <p className="text-xs text-[#64748b] mb-1 sm:mb-1 leading-relaxed">
                                            {(isAr ? selectedOptions.map((o) => o.nameAr) : selectedOptions.map((o) => o.nameEn)).join(" + ")}
                                            {selectedAddOns.length > 0 && (
                                                <> + {(isAr ? selectedAddOns.map((a) => a.nameAr).join("، ") : selectedAddOns.map((a) => a.nameEn).join(", "))}</>
                                            )}
                                        </p>
                                    )}
                                    <div className="flex flex-col sm:flex-row items-center sm:items-baseline gap-0.5 sm:gap-1.5">
                                        <span className="text-2xl font-black text-[#0EA5E9]">
                                            {totalPriceGroup > 0
                                                ? `$${totalPriceGroup}`
                                                : trip.startingPrice > 0
                                                    ? `${isAr ? "يبدأ من" : "From"} $${trip.startingPrice}`
                                                    : isAr ? "عند الطلب" : "On request"}
                                        </span>
                                        {totalPriceGroup > 0 && (
                                            <span className="text-xs text-[#94a3b8]">{isAr ? "الإجمالي المحسوب" : "Calculated total"}</span>
                                        )}
                                    </div>
                                </div>
                                {isInCart ? (
                                    <div className="flex items-center justify-center gap-2 shrink-0 flex-wrap w-full sm:w-auto">
                                        <button
                                            onClick={handleUpdateOrViewCart}
                                            className={`w-full sm:w-auto shrink-0 font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] cursor-pointer ${
                                                hasChanges
                                                    ? 'bg-[#0284C7] text-white hover:bg-[#0369A1]'
                                                    : 'bg-[#dcfce7] text-[#15803d] border-2 border-[#86efac] hover:bg-[#bbf7d0]'
                                            }`}
                                        >
                                            {hasChanges ? (
                                                <>
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                    </svg>
                                                    {isAr ? "تعديل الحجز" : "Update booking"}
                                                </>
                                            ) : (
                                                <>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                    </svg>
                                                    {isAr ? "تمت الإضافة لبرنامجك" : "Added to your plan"}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleAddToCart}
                                        className="w-full sm:w-auto shrink-0 bg-[#0284C7] hover:bg-[#0369A1] text-white font-bold py-3.5 px-8 rounded-2xl flex items-center justify-center gap-2 text-sm transition-all active:scale-[0.98] shadow-sm cursor-pointer"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        {isAr ? "أضف لبرنامجك" : "Add to your plan"}
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                )}

                {/* Gallery */}
                {(trip.galleryImages.length > 0 || trip.youtubeUrl) && (
                    <TripGallery
                        images={trip.galleryImages}
                        tripTitle={tripTitle}
                        youtubeUrl={trip.youtubeUrl}
                        title={isAr ? "لحظات من الرحلة" : "Moments from the trip"}
                        videoTitle={isAr ? "فيديو الرحلة" : "Trip video"}
                        imageLabel={isAr ? "صورة" : "Image"}
                    />
                )}
            </div>

        </main>
    );
}
