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
                </div>
            </ScrollReveal>
        </section>
    );
}
