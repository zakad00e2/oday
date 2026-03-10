"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [hotelName, setHotelName] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const guestsTotal = cart.guests.adults + cart.guests.children;
    const hotelCost = cart.hotel ? cart.hotel.pricePerNight * cart.nights : 0;

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = "الاسم مطلوب";
        if (!phone.trim()) errs.phone = "رقم الهاتف مطلوب";
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        let msg = "🌟 *طلب حجز جديد — Oday Tourism*\n\n";
        msg += `👤 الاسم: ${name}\n`;
        msg += `📞 الهاتف/واتساب: ${phone}\n`;
        if (email.trim()) msg += `📧 البريد: ${email}\n`;
        msg += `👥 الضيوف: ${cart.guests.adults} بالغ، ${cart.guests.children} أطفال\n`;
        if (cart.travelDate) msg += `📅 تاريخ السفر: ${cart.travelDate}\n`;
        msg += "\n";

        if (cart.hotel) {
            msg += `🏨 *الفندق:* ${cart.hotel.name} — ${cart.hotel.city}\n`;
            msg += `   الليالي: ${cart.nights} | التكلفة: $${hotelCost}\n\n`;
        }

        if (hotelName.trim() && !cart.hotel) {
            msg += `🏨 الفندق المطلوب: ${hotelName}\n\n`;
        }

        if (cart.trips.length > 0) {
            msg += `🗺️ *الرحلات:*\n`;
            cart.trips.forEach((t) => {
                msg += `  • ${t.titleAr}`;
                if (t.selectedOption) {
                    msg += ` — ${t.selectedOption.nameAr}`;
                    if (t.selectedOption.price > 0) msg += ` ($${t.selectedOption.price}/شخص)`;
                }
                msg += "\n";
                if (t.selectedAddOns && t.selectedAddOns.length > 0) {
                    t.selectedAddOns.forEach((a) => {
                        msg += `    + ${a.nameAr}`;
                        if (a.price > 0) msg += ` ($${a.price})`;
                        msg += "\n";
                    });
                }
            });
            msg += "\n";
        }

        if (totalPrice > 0) msg += `💵 *الإجمالي التقديري: $${totalPrice}*\n`;
        if (notes.trim()) msg += `\n📝 ملاحظات: ${notes}\n`;

        const whatsappUrl = `https://wa.me/201032549630?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir="rtl">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-3xl p-10 border border-[#e2e8f0] shadow-sm text-center">
                        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-[#0f172a] mb-3">تم إرسال طلبك بنجاح!</h3>
                        <p className="text-[#64748b] mb-6">سيتم التواصل معك عبر الواتساب لتأكيد التفاصيل.</p>
                        <Link
                            href="/trips"
                            className="bg-[#2563EB] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1d4ed8] transition inline-block"
                        >
                            تصفح المزيد من الرحلات
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (totalItems === 0) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir="rtl">
                <div className="max-w-lg mx-auto px-4 text-center">
                    <div className="bg-white rounded-3xl p-10 border border-[#e2e8f0] shadow-sm">
                        <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-[#BAE6FD]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#0f172a] mb-3">السلة فارغة</h3>
                        <p className="text-[#64748b] mb-6">أضف رحلات أو فنادق لبدء الحجز</p>
                        <div className="flex flex-col gap-2">
                            <Link href="/trips" className="bg-[#2563EB] text-white py-3 rounded-xl font-bold text-center">
                                تصفح الرحلات
                            </Link>
                            <Link href="/hotels" className="border border-[#e2e8f0] text-[#0f172a] py-3 rounded-xl font-bold text-center hover:bg-[#f8fafc] transition-colors">
                                تصفح الفنادق
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const inputClass = (field: string) =>
        `w-full bg-[#f8fafc] border ${errors[field] ? "border-red-400" : "border-[#e2e8f0]"} rounded-xl px-4 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition`;

    return (
        <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir="rtl">
            <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-8">إتمام الحجز</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6 md:p-8">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6">بياناتك الشخصية</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">رقم الهاتف / واتساب *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+20 xxx xxx xxxx"
                                    className={inputClass("phone")}
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">البريد الإلكتروني</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="email@example.com"
                                    className={inputClass("email")}
                                />
                            </div>

                            {!cart.hotel && (
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-bold text-[#0f172a] mb-2">اسم الفندق (إن وجد)</label>
                                    <input
                                        type="text"
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        placeholder="الفندق الذي تقيم به في شرم الشيخ"
                                        className={inputClass("hotelName")}
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">ملاحظات إضافية</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="أي ملاحظات أو طلبات خاصة..."
                                    rows={3}
                                    className={`${inputClass("notes")} resize-none`}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-6 w-full bg-[#25D366] hover:bg-[#20BE5C] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-base transition-all active:scale-[0.98]"
                        >
                            أرسل طلب الحجز عبر واتساب
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.438C7.869 23.456 9.895 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.76-.514-5.352-1.442l-.384-.228-3.644.854.893-3.546-.252-.399A9.773 9.773 0 012.18 12c0-5.423 4.397-9.82 9.82-9.82 5.423 0 9.82 4.397 9.82 9.82 0 5.423-4.397 9.82-9.82 9.82z" />
                            </svg>
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden lg:sticky lg:top-28">
                        <div className="px-6 pt-6 pb-4 border-b border-[#e2e8f0]">
                            <h2 className="text-lg font-bold text-[#0f172a]">ملخص الطلب</h2>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                                {totalItems} {totalItems === 1 ? "عنصر" : "عناصر"}
                            </p>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {/* Hotel */}
                            {cart.hotel && (
                                <div className="flex gap-3 pb-4 border-b border-[#f1f5f9]">
                                    <img src={cart.hotel.image} alt={cart.hotel.name} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#0EA5E9] font-semibold">إقامة فندقية</p>
                                        <p className="text-sm font-bold text-[#0f172a] truncate">{cart.hotel.name}</p>
                                        <p className="text-xs text-[#64748b]">{cart.nights} ليالي</p>
                                    </div>
                                    <span className="text-sm font-bold text-[#0f172a] shrink-0">${hotelCost}</span>
                                </div>
                            )}

                            {/* Trips */}
                            {cart.trips.map((trip) => {
                                const tripCost = trip.selectedOption
                                    ? (trip.selectedOption.price + (trip.selectedAddOns || []).reduce((s, a) => s + a.price, 0)) * guestsTotal
                                    : trip.startingPrice > 0 ? trip.startingPrice * guestsTotal : 0;
                                return (
                                    <div key={trip.slug} className="flex gap-3 pb-4 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                                        <img src={trip.heroImage} alt={trip.titleAr} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-[#0EA5E9] font-semibold">رحلة</p>
                                            <p className="text-sm font-bold text-[#0f172a] line-clamp-1">{trip.titleAr}</p>
                                            {trip.selectedOption && (
                                                <p className="text-xs text-[#64748b]">{trip.selectedOption.nameAr}</p>
                                            )}
                                            {trip.selectedAddOns && trip.selectedAddOns.length > 0 && (
                                                <p className="text-xs text-[#94a3b8]">
                                                    + {trip.selectedAddOns.map((a) => a.nameAr).join("، ")}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-[#0f172a] shrink-0">
                                            {tripCost > 0 ? `$${tripCost}` : "—"}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Guests */}
                            <div className="flex items-center justify-between text-sm pt-2">
                                <span className="text-[#64748b]">الضيوف</span>
                                <span className="font-bold text-[#0f172a]">
                                    {cart.guests.adults} بالغ{cart.guests.children > 0 ? `، ${cart.guests.children} أطفال` : ""}
                                </span>
                            </div>
                            {cart.travelDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#64748b]">تاريخ السفر</span>
                                    <span className="font-bold text-[#0f172a]">{cart.travelDate}</span>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                            <span className="font-bold text-[#0f172a]">الإجمالي التقديري</span>
                            <span className="text-2xl font-black text-[#2563EB]">
                                {totalPrice > 0 ? `$${totalPrice}` : "عند الطلب"}
                            </span>
                        </div>

                        <div className="px-6 py-4">
                            <button
                                onClick={clearCart}
                                className="w-full text-xs text-[#94a3b8] hover:text-red-500 transition-colors py-1"
                            >
                                مسح السلة بالكامل
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
