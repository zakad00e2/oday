"use client";

import { useState } from "react";
import { TripDetail, TripOption, TripAddOn } from "@/lib/trips-types";
import ScrollReveal from "../ScrollReveal";
import { useCart } from "@/lib/cart-context";

interface TripBookingFormProps {
    trip: TripDetail;
    selectedOptionId: string | null;
    selectedAddOnIds: Set<string>;
    guestCount: number;
    childrenCount: number;
    onGuestCountChange: (n: number) => void;
    onChildrenCountChange: (n: number) => void;
    totalPrice: number;
    selectedOption?: TripOption | null;
    selectedAddOns?: TripAddOn[];
    optionQuantity?: number;
}

export default function TripBookingForm({
    trip,
    selectedOptionId,
    selectedAddOnIds,
    guestCount,
    childrenCount,
    onGuestCountChange,
    onChildrenCountChange,
    totalPrice,
    selectedOption,
    selectedAddOns = [],
    optionQuantity = 1,
}: TripBookingFormProps) {
    const [name, setName] = useState("");
    const [hotel, setHotel] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { addTrip, removeTrip, cart, openCart } = useCart();
    const isInCart = cart.trips.some((t) => t.slug === trip.slug);

    const handleCartAction = () => {
        if (isInCart) {
            openCart();
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

    const fields = trip.bookingFields;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (fields.includes("name") && !name.trim()) errs.name = "الاسم مطلوب";
        if (fields.includes("hotel") && !hotel.trim()) errs.hotel = "اسم الفندق مطلوب";
        if (fields.includes("date") && !date) errs.date = "التاريخ مطلوب";
        if (fields.includes("tripType") && trip.options.length > 0 && !selectedOptionId) errs.tripType = "يرجى اختيار نوع الرحلة";
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        // Build WhatsApp message
        const selectedOption = trip.options.find((o) => o.id === selectedOptionId);
        const selectedAddOns = trip.addOns.filter((a) => selectedAddOnIds.has(a.id));

        let msg = `🌊 *حجز جديد — ${trip.titleAr}*\n\n`;
        msg += `👤 الاسم: ${name}\n`;
        msg += `👥 عدد الأشخاص: ${guestCount}\n`;
        if (fields.includes("childrenUnder5")) msg += `👶 أطفال تحت 5 سنوات: ${childrenCount}\n`;
        if (hotel) msg += `🏨 الفندق: ${hotel}\n`;
        if (date) msg += `📅 التاريخ: ${date}\n`;
        if (time) msg += `🕐 الموعد: ${time}\n`;
        if (selectedOption) msg += `📋 الخيار: ${selectedOption.nameAr}\n`;
        if (selectedAddOns.length > 0) msg += `➕ الإضافات: ${selectedAddOns.map((a) => a.nameAr).join("، ")}\n`;
        if (totalPrice > 0) msg += `💰 الإجمالي: $${totalPrice}\n`;
        if (notes) msg += `📝 ملاحظات: ${notes}\n`;

        const whatsappUrl = `https://wa.me/201234567890?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="py-16 md:py-20">
                <div className="max-w-lg mx-auto text-center bg-white rounded-3xl p-10 border border-[#e2e8f0] shadow-sm">
                    <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                        <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0f172a] mb-3">تم إرسال طلب الحجز! ✨</h3>
                    <p className="text-[#64748b] mb-6">سيتم التواصل معك عبر الواتساب لتأكيد الحجز.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="text-[#0EA5E9] font-bold text-sm hover:underline cursor-pointer"
                    >
                        إرسال حجز آخر
                    </button>
                </div>
            </section>
        );
    }

    const inputClass = (field: string) =>
        `w-full bg-[#f8fafc] border ${errors[field] ? "border-red-400" : "border-[#e2e8f0]"} rounded-xl px-4 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition`;

    return (
        <section className="py-16 md:py-20">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">احجز الآن</h2>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={100}>
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6 md:p-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {/* Name */}
                        {fields.includes("name") && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">الاسم الكامل *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="أدخل اسمك الكامل"
                                    className={inputClass("name")}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>
                        )}

                        {/* Guests */}
                        {fields.includes("guests") && (
                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">عدد الأشخاص</label>
                                <div className="flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => onGuestCountChange(Math.max(1, guestCount - 1))}
                                        className="px-4 py-3.5 text-[#64748b] hover:bg-[#e2e8f0] transition font-bold cursor-pointer"
                                    >
                                        −
                                    </button>
                                    <span className="flex-1 text-center text-sm font-bold text-[#0f172a]">{guestCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => onGuestCountChange(guestCount + 1)}
                                        className="px-4 py-3.5 text-[#64748b] hover:bg-[#e2e8f0] transition font-bold cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Children */}
                        {fields.includes("childrenUnder5") && (
                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">أطفال تحت 5 سنوات</label>
                                <div className="flex items-center bg-[#f8fafc] border border-[#e2e8f0] rounded-xl overflow-hidden">
                                    <button
                                        type="button"
                                        onClick={() => onChildrenCountChange(Math.max(0, childrenCount - 1))}
                                        className="px-4 py-3.5 text-[#64748b] hover:bg-[#e2e8f0] transition font-bold cursor-pointer"
                                    >
                                        −
                                    </button>
                                    <span className="flex-1 text-center text-sm font-bold text-[#0f172a]">{childrenCount}</span>
                                    <button
                                        type="button"
                                        onClick={() => onChildrenCountChange(childrenCount + 1)}
                                        className="px-4 py-3.5 text-[#64748b] hover:bg-[#e2e8f0] transition font-bold cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Hotel */}
                        {fields.includes("hotel") && (
                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">اسم الفندق *</label>
                                <input
                                    type="text"
                                    value={hotel}
                                    onChange={(e) => setHotel(e.target.value)}
                                    placeholder="أدخل اسم الفندق"
                                    className={inputClass("hotel")}
                                />
                                {errors.hotel && <p className="text-red-500 text-xs mt-1">{errors.hotel}</p>}
                            </div>
                        )}

                        {/* Date */}
                        {fields.includes("date") && (
                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">التاريخ *</label>
                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className={inputClass("date")}
                                />
                                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                            </div>
                        )}

                        {/* Time */}
                        {fields.includes("time") && (
                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">موعد الرحلة</label>
                                <input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className={inputClass("time")}
                                />
                            </div>
                        )}

                        {/* Notes */}
                        {fields.includes("notes") && (
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">ملاحظات</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="أي ملاحظات أو طلبات خاصة..."
                                    rows={3}
                                    className={`${inputClass("notes")} resize-none`}
                                />
                            </div>
                        )}
                    </div>

                    {/* Mobile-only price summary (hidden on lg) */}
                    {totalPrice > 0 && (
                        <div className="mt-6 lg:hidden bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
                            <div className="flex items-center gap-3 px-5 pt-5 pb-3 border-b border-[#e2e8f0]">
                                <span className="text-base font-bold text-[#0f172a]">ملخص السعر</span>
                            </div>
                            <div className="px-5 py-4 space-y-3">
                                {selectedOption && (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-[#0f172a]">{selectedOption.nameAr}</p>
                                            {optionQuantity > 1 && (
                                                <p className="text-xs text-[#94a3b8]">{optionQuantity} × ${selectedOption.price}</p>
                                            )}
                                        </div>
                                        <span className="font-bold text-[#0f172a]">
                                            {selectedOption.price > 0 ? `$${selectedOption.price * optionQuantity}` : "—"}
                                        </span>
                                    </div>
                                )}
                                {selectedAddOns.map((addOn) => (
                                    <div key={addOn.id} className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-[#0f172a]">{addOn.nameAr}</p>
                                        <span className="font-bold text-[#0f172a]">
                                            {addOn.price > 0 ? `$${addOn.price}` : "—"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-5 py-3 flex items-center justify-between">
                                <span className="text-sm font-bold text-[#0f172a]">الإجمالي</span>
                                <span className="text-xl font-black text-[#0EA5E9]">${totalPrice}</span>
                            </div>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="mt-6 flex flex-col gap-3">
                        {/* Add to Cart */}
                        <button
                            type="button"
                            onClick={handleCartAction}
                            className={`w-full flex items-center justify-center gap-2 font-bold px-8 py-3.5 rounded-2xl transition-all text-sm cursor-pointer ${
                                isInCart
                                    ? "bg-[#dcfce7] text-[#15803d] border-2 border-[#86efac] hover:bg-[#bbf7d0]"
                                    : "bg-[#0284C7] text-white hover:bg-[#0369A1]"
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
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                    أضف لبرنامجك
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-[#e2e8f0]" />
                            <span className="text-xs text-[#94a3b8] font-medium">أو احجز مباشرة</span>
                            <div className="flex-1 h-px bg-[#e2e8f0]" />
                        </div>

                        {/* WhatsApp Submit */}
                        <button
                            type="submit"
                            className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-8 py-4 rounded-2xl shadow-lg hover:bg-[#1ebe57] hover:scale-[1.02] transition-all text-base cursor-pointer"
                        >
                            احجز الآن عبر واتساب
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.438C7.869 23.456 9.895 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.76-.514-5.352-1.442l-.384-.228-3.644.854.893-3.546-.252-.399A9.773 9.773 0 012.18 12c0-5.423 4.397-9.82 9.82-9.82 5.423 0 9.82 4.397 9.82 9.82 0 5.423-4.397 9.82-9.82 9.82z" />
                            </svg>
                        </button>
                    </div>
                </form>
            </ScrollReveal>
        </section>
    );
}
