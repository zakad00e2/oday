"use client";

import { TripDetail, TripOption, TripAddOn } from "@/lib/trips-types";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/dictionary-context";
import Link from "next/link";

interface TripCartSidebarProps {
    trip: TripDetail;
    selectedOption: TripOption | null;
    selectedAddOns: TripAddOn[];
    totalPrice: number;
    optionQuantity: number;
}

export default function TripCartSidebar({
    trip,
    selectedOption,
    selectedAddOns,
    totalPrice,
    optionQuantity,
}: TripCartSidebarProps) {
    const { addTrip, removeTrip, cart, openCart } = useCart();
    const { lang } = useI18n();
    const isInCart = cart.trips.some((t) => t.slug === trip.slug);

    const handleAddToCart = () => {
        addTrip({
            slug: trip.slug,
            titleAr: trip.titleAr,
            titleEn: trip.titleEn,
            heroImage: trip.heroImage,
            startingPrice: trip.startingPrice,
            selectedOptions: selectedOption
                ? [{ nameAr: selectedOption.nameAr, nameEn: selectedOption.nameEn, price: selectedOption.price }]
                : undefined,
            selectedAddOns: selectedAddOns.length > 0
                ? selectedAddOns.map((a) => ({ nameAr: a.nameAr, nameEn: a.nameEn, price: a.price }))
                : undefined,
        });
        openCart();
    };

    return (
        <div className="lg:sticky lg:top-28 space-y-4">
            <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-6 pt-5 pb-4 border-b border-[#e2e8f0]">
                    <h3 className="text-base font-bold text-[#0f172a]">ملخص الحجز</h3>
                </div>

                {/* Price breakdown */}
                <div className="px-6 py-4 space-y-3">
                    {selectedOption ? (
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#0f172a] font-medium">{selectedOption.nameAr}</p>
                                {optionQuantity > 1 && (
                                    <p className="text-xs text-[#94a3b8]">{optionQuantity} × ${selectedOption.price}</p>
                                )}
                            </div>
                            <span className="font-bold text-[#0f172a]">
                                {selectedOption.price > 0 ? `$${selectedOption.price * optionQuantity}` : "—"}
                            </span>
                        </div>
                    ) : trip.options.length > 0 ? (
                        <p className="text-sm text-[#94a3b8]">اختر نوع الرحلة من الأسفل</p>
                    ) : trip.startingPrice > 0 ? (
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-[#0f172a] font-medium">سعر الرحلة</span>
                            <span className="font-bold text-[#0f172a]">${trip.startingPrice}</span>
                        </div>
                    ) : (
                        <p className="text-sm text-[#94a3b8]">السعر عند الطلب</p>
                    )}

                    {selectedAddOns.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between">
                            <span className="text-sm text-[#64748b]">+ {addon.nameAr}</span>
                            <span className="text-sm font-bold text-[#0f172a]">
                                {addon.price > 0 ? `$${addon.price}` : "—"}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-[#0f172a]">السعر / شخص</span>
                    <span className="text-2xl font-black text-[#0EA5E9]">
                        {totalPrice > 0
                            ? `$${totalPrice}`
                            : trip.startingPrice > 0
                                ? `$${trip.startingPrice}`
                                : "عند الطلب"}
                    </span>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6 pt-3 space-y-3">
                    <button
                        onClick={() => {
                            if (isInCart) openCart();
                            else handleAddToCart();
                        }}
                        className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all text-sm active:scale-[0.98] cursor-pointer ${
                            isInCart
                                ? 'bg-[#dcfce7] text-[#15803d] border-2 border-[#86efac] hover:bg-[#bbf7d0]'
                                : 'bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-sm'
                        }`}
                    >
                        {isInCart ? (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                تمت الإضافة لبرنامجك
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                                أضف لبرنامجك
                            </>
                        )}
                    </button>
                </div>
            </div>

            <Link
                href={`/${lang}/trips`}
                className="block text-center text-xs text-[#94a3b8] hover:text-[#0EA5E9] transition-colors py-2"
            >
                تصفح المزيد من الرحلات ←
            </Link>
        </div>
    );
}
