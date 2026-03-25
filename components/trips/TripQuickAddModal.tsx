"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { TripDetail } from "@/lib/trips-types";
import { useCart } from "@/lib/cart-context";

interface TripQuickAddModalProps {
    trip: TripDetail;
    onClose: () => void;
}

export default function TripQuickAddModal({ trip, onClose }: TripQuickAddModalProps) {
    const { addTrip, openCart } = useCart();

    const [selectedOptionIds, setSelectedOptionIds] = useState<Set<string>>(() => {
        if (!trip || trip.options.length === 0) return new Set();
        return new Set([trip.options[0].id]);
    });
    const [selectedAddOnIds, setSelectedAddOnIds] = useState<Set<string>>(new Set());

    const toggleOptionId = (id: string) => {
        setSelectedOptionIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    const toggleAddOn = (id: string) => {
        setSelectedAddOnIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectedOptions = trip.options.filter(o => selectedOptionIds.has(o.id));
    const selectedAddOns = trip.addOns.filter(a => selectedAddOnIds.has(a.id));
    const totalPrice = selectedOptions.reduce((s, o) => s + o.price, 0) + selectedAddOns.reduce((s, a) => s + a.price, 0);

    const handleAddToCart = () => {
        addTrip({
            slug: trip.slug,
            titleAr: trip.titleAr,
            heroImage: trip.heroImage,
            startingPrice: trip.startingPrice,
            selectedOptions: selectedOptions.length > 0
                ? selectedOptions.map(o => ({ nameAr: o.nameAr, price: o.price }))
                : undefined,
        });
        onClose();
        openCart();
    };

    const hasOptions = trip.options.length > 0;
    const hasAddOns = trip.addOns.length > 0;

    const modal = (
        /* Full-screen backdrop + flex centering */
        <div
            className="fixed inset-0 z-9999 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4"
            onClick={onClose}
        >
            {/* Modal panel */}
            <div
                className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
                style={{ maxHeight: "90dvh" }}
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="shrink-0 flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
                    <h3 className="text-[#0F172A] font-extrabold text-base leading-snug line-clamp-2 flex-1">
                        {trip.titleAr}
                    </h3>
                    <button
                        onClick={onClose}
                        className="mr-3 w-8 h-8 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors shrink-0 cursor-pointer"
                        aria-label="إغلاق"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">

                    {/* Options */}
                    {hasOptions && (
                        <div>
                            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
                                نوع الرحلة
                            </p>
                            <div className="space-y-2">
                                {trip.options.map((opt) => {
                                    const active = selectedOptionIds.has(opt.id);
                                    return (
                                        <button
                                            key={opt.id}
                                            onClick={() => toggleOptionId(opt.id)}
                                            className={`w-full text-right px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                                                active
                                                    ? "border-[#0EA5E9] bg-[#F0F9FF]"
                                                    : "border-[#E2E8F0] bg-white hover:border-[#BAE6FD]"
                                            }`}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold leading-snug ${active ? "text-[#0EA5E9]" : "text-[#0F172A]"}`}>
                                                    {opt.nameAr}
                                                </p>
                                                {opt.descriptionAr && (
                                                    <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">{opt.descriptionAr}</p>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-sm font-black ${active ? "text-[#0EA5E9]" : "text-[#0F172A]"}`}>
                                                    {opt.price > 0 ? `$${opt.price}` : "عند الطلب"}
                                                </span>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                    active ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-[#CBD5E1]"
                                                }`}>
                                                    {active && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Add-ons */}
                    {hasAddOns && (
                        <div>
                            <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-3">
                                إضافات اختيارية
                            </p>
                            <div className="space-y-2">
                                {trip.addOns.map((addon) => {
                                    const active = selectedAddOnIds.has(addon.id);
                                    return (
                                        <button
                                            key={addon.id}
                                            onClick={() => toggleAddOn(addon.id)}
                                            className={`w-full text-right px-4 py-3.5 rounded-2xl border-2 transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                                                active
                                                    ? "border-[#10B981] bg-[#F0FDF4]"
                                                    : "border-[#E2E8F0] bg-white hover:border-[#A7F3D0]"
                                            }`}
                                        >
                                            <div className="flex items-center flex-1 min-w-0">
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold leading-snug ${active ? "text-[#10B981]" : "text-[#0F172A]"}`}>
                                                        {addon.nameAr}
                                                    </p>
                                                    {addon.descriptionAr && (
                                                        <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-1">{addon.descriptionAr}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <span className={`text-sm font-black ${active ? "text-[#10B981]" : "text-[#0F172A]"}`}>
                                                    {addon.price > 0 ? `+$${addon.price}` : "مجاناً"}
                                                </span>
                                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                                                    active ? "border-[#10B981] bg-[#10B981]" : "border-[#CBD5E1]"
                                                }`}>
                                                    {active && (
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {!hasOptions && !hasAddOns && (
                        <p className="text-center py-6 text-[#64748B] text-sm">لا توجد خيارات إضافية لهذه الرحلة.</p>
                    )}
                </div>

                {/* Footer */}
                <div className="shrink-0 border-t border-[#E2E8F0] px-5 py-4 bg-white">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[#64748B]">
                            {totalPrice > 0 ? "السعر التقديري / شخص" : ""}
                        </span>
                        <span className="text-xl font-black text-[#0EA5E9]">
                            {totalPrice > 0
                                ? `$${totalPrice}`
                                : trip.startingPrice > 0
                                    ? `يبدأ من $${trip.startingPrice}`
                                    : "السعر عند الطلب"}
                        </span>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-[#0EA5E9] hover:bg-[#0284C7] active:scale-[0.98] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm shadow-sm cursor-pointer"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        أضف لبرنامجك
                    </button>
                </div>
            </div>
        </div>
    );

    if (typeof window === "undefined") return null;
    return createPortal(modal, document.body);
}
