"use client";

import { TripOption, TripAddOn } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";
import { useCart } from "@/lib/cart-context";

interface TripPriceSummaryProps {
    selectedOption: TripOption | null;
    quantity: number;
    addOns: TripAddOn[];
    total: number;
    trip: { slug: string; titleAr: string; heroImage: string; startingPrice: number };
}

export default function TripPriceSummary({ selectedOption, quantity, addOns, total, trip }: TripPriceSummaryProps) {
    const { addTrip, removeTrip, cart, openCart } = useCart();
    const isInCart = cart.trips.some((t) => t.slug === trip.slug);

    const handleCartAction = () => {
        if (isInCart) {
            removeTrip(trip.slug);
        } else {
            addTrip({
                slug: trip.slug,
                titleAr: trip.titleAr,
                heroImage: trip.heroImage,
                startingPrice: trip.startingPrice,
            });
            openCart();
        }
    };

    return (
        <section className="py-10 md:py-38 border-b border-[#e2e8f0]">
            <ScrollReveal delay={100}>
                <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden max-w-lg">
                    {/* Header inside box */}
                    <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#e2e8f0]">
                        <h2 className="text-xl font-bold text-[#0f172a]">ملخص السعر</h2>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Selected option */}
                        {selectedOption && (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-[#0f172a]">{selectedOption.nameAr}</p>
                                    {quantity > 1 && (
                                        <p className="text-xs text-[#94a3b8]">{quantity} × ${selectedOption.price}</p>
                                    )}
                                </div>
                                <span className="font-bold text-[#0f172a]">
                                    {selectedOption.price > 0 ? `$${selectedOption.price * quantity}` : "—"}
                                </span>
                            </div>
                        )}

                        {/* Add-ons */}
                        {addOns.map((addOn) => (
                            <div key={addOn.id} className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-[#0f172a]">{addOn.nameAr}</p>
                                </div>
                                <span className="font-bold text-[#0f172a]">
                                    {addOn.price > 0 ? `$${addOn.price}` : "—"}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Total */}
                    <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                        <span className="text-base font-bold text-[#0f172a]">الإجمالي</span>
                        <span className="text-2xl font-black text-[#2563EB]">
                            {total > 0 ? `$${total}` : "اسأل عن السعر"}
                        </span>
                    </div>

                    {/* Add to Cart */}
                    <div className="px-6 pb-6 pt-3">
                        <button
                            onClick={handleCartAction}
                            className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                                isInCart
                                    ? "bg-[#0EA5E9] text-white hover:bg-[#0284C7]"
                                    : "bg-[#F0F9FF] text-[#0EA5E9] border border-[#BAE6FD] hover:bg-[#0EA5E9] hover:text-white hover:border-[#0EA5E9]"
                            }`}
                        >
                            {isInCart ? (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                    تم الإضافة للسلة
                                </>
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    أضف لسلة الحجوزات
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </ScrollReveal>
        </section>
    );
}
