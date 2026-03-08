"use client";

import { TripOption, TripAddOn } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";

interface TripPriceSummaryProps {
    selectedOption: TripOption | null;
    quantity: number;
    addOns: TripAddOn[];
    total: number;
}

export default function TripPriceSummary({ selectedOption, quantity, addOns, total }: TripPriceSummaryProps) {
    return (
        <section className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">ملخص السعر</h2>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden max-w-lg">
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
                                    {addOn.icon && <span className="text-sm">{addOn.icon}</span>}
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
                </div>
            </ScrollReveal>
        </section>
    );
}
