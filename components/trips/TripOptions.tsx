"use client";

import { TripOption } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";

interface TripOptionsProps {
    options: TripOption[];
    selectedOptionId: string | null;
    onSelectOption: (id: string) => void;
    quantities: Record<string, number>;
    onUpdateQuantity: (optionId: string, qty: number) => void;
}

export default function TripOptions({
    options,
    selectedOptionId,
    onSelectOption,
    quantities,
    onUpdateQuantity,
}: TripOptionsProps) {
    return (
        <section className="py-10 md:py-14 border-b border-[#e2e8f0]">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">خيارات الرحلة</h2>
                </div>
            </ScrollReveal>

            <div className="flex flex-col gap-4">
                {options.map((option, i) => {
                    const isSelected = selectedOptionId === option.id;
                    const qty = quantities[option.id] || 1;
                    const capacityLabel = option.capacityLabelAr ?? option.capacityLabelEn;

                    return (
                        <ScrollReveal key={option.id} delay={i * 80}>
                            <div
                                role="button"
                                tabIndex={0}
                                onClick={() => onSelectOption(option.id)}
                                onKeyDown={(e) => e.key === 'Enter' && onSelectOption(option.id)}
                                className={`w-full text-right p-5 md:p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer ${isSelected
                                        ? "border-[#0EA5E9] bg-[#0EA5E9]/5 shadow-lg"
                                        : "border-[#e2e8f0] bg-white hover:border-[#0EA5E9]/30 hover:shadow-md"
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            {/* Radio indicator */}
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? "border-[#0EA5E9]" : "border-[#cbd5e1]"
                                                }`}>
                                                {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#0EA5E9]" />}
                                            </div>
                                            <h3 className="font-bold text-[#0f172a] text-base md:text-lg">{option.nameAr}</h3>
                                        </div>
                                        <p className="text-xs text-[#94a3b8] font-medium mr-7 mb-1">{option.nameEn}</p>
                                        <p className="text-sm text-[#64748b] mr-7">{option.descriptionAr}</p>
                                        {capacityLabel && (
                                            <span className="inline-block mt-2 mr-7 text-xs bg-[#F0F9FF] text-[#0EA5E9] font-medium rounded-full px-3 py-1">
                                                {capacityLabel}
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-left shrink-0">
                                        {option.price > 0 ? (
                                            <div className="text-xl font-black text-[#0f172a]">
                                                ${option.price}
                                            </div>
                                        ) : (
                                            <span className="text-xs text-[#94a3b8] bg-[#f8fafc] rounded-full px-3 py-1">
                                                اسأل عن السعر
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Quantity selector - only for options with maxQuantity */}
                                {isSelected && option.maxQuantity && option.maxQuantity > 1 && (
                                    <div className="mt-4 mr-7 flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                        <span className="text-sm text-[#64748b]">الكمية:</span>
                                        <div className="flex items-center bg-white rounded-full border border-[#e2e8f0] overflow-hidden">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(option.id, qty - 1); }}
                                                className="px-3 py-1.5 text-[#64748b] hover:bg-[#f8fafc] transition font-bold cursor-pointer"
                                                disabled={qty <= 1}
                                            >
                                                −
                                            </button>
                                            <span className="px-4 py-1.5 text-sm font-bold text-[#0f172a] min-w-[40px] text-center">{qty}</span>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onUpdateQuantity(option.id, qty + 1); }}
                                                className="px-3 py-1.5 text-[#64748b] hover:bg-[#f8fafc] transition font-bold cursor-pointer"
                                                disabled={qty >= (option.maxQuantity || 99)}
                                            >
                                                +
                                            </button>
                                        </div>
                                        {option.price > 0 && qty > 1 && (
                                            <span className="text-sm font-bold text-[#0EA5E9]">= ${option.price * qty}</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    );
                })}
            </div>
        </section>
    );
}
