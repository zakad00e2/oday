"use client";

import { TripAddOn } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";

interface TripAddOnsProps {
    addOns: TripAddOn[];
    selectedIds: Set<string>;
    onToggle: (id: string) => void;
}

export default function TripAddOns({ addOns, selectedIds, onToggle }: TripAddOnsProps) {
    return (
        <section className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">الإضافات</h2>
                </div>
            </ScrollReveal>

            <div className="flex flex-col gap-4">
                {addOns.map((addOn, i) => {
                    const isSelected = selectedIds.has(addOn.id);
                    return (
                        <ScrollReveal key={addOn.id} delay={i * 80}>
                            <button
                                onClick={() => onToggle(addOn.id)}
                                className={`w-full text-right p-5 rounded-2xl border-2 transition-all duration-300 ${isSelected
                                        ? "border-[#F59E0B] bg-[#F59E0B]/5 shadow-lg"
                                        : "border-[#e2e8f0] bg-white hover:border-[#F59E0B]/30 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-start gap-3">
                                        {/* Checkbox indicator */}
                                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#cbd5e1]"
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-[#0f172a]">{addOn.nameAr}</h3>
                                            </div>
                                            <p className="text-xs text-[#94a3b8] mb-1">{addOn.nameEn}</p>
                                            <p className="text-sm text-[#64748b]">{addOn.descriptionAr}</p>
                                        </div>
                                    </div>

                                    <div className="text-left shrink-0">
                                        {addOn.price > 0 ? (
                                            <span className="text-lg font-black text-[#0f172a]">${addOn.price}</span>
                                        ) : (
                                            <span className="text-xs text-[#94a3b8] bg-[#f8fafc] rounded-full px-3 py-1">اسأل عن السعر</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
