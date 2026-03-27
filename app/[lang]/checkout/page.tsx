"use client";

import { useState } from "react";
import Link from "next/link";
import FlexibleImage from "@/components/FlexibleImage";
import { useCart } from "@/lib/cart-context";
import { useI18n } from "@/lib/i18n/dictionary-context";

export default function CheckoutPage() {
    const { cart, totalPrice, totalItems, clearCart } = useCart();
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [hotelName, setHotelName] = useState("");
    const [notes, setNotes] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [agreedToPolicies, setAgreedToPolicies] = useState(false);

    const guestsTotal = cart.guests.adults + cart.guests.children;
    const hotelBaseCost = cart.hotel ? cart.hotel.pricePerNight * cart.nights * (cart.hotel.roomsCount || 1) : 0;
    const hotelAddOnsCost = cart.hotel?.selectedAddOns ? cart.hotel.selectedAddOns.reduce((s, a) => s + a.price, 0) * cart.nights * (cart.hotel.roomsCount || 1) : 0;
    const hotelCost = hotelBaseCost + hotelAddOnsCost;
    const getHotelName = (hotel: NonNullable<typeof cart.hotel>) => isAr ? (hotel.nameAr ?? hotel.name) : (hotel.nameEn ?? hotel.name);
    const getHotelRoomName = (hotel: NonNullable<typeof cart.hotel>) => isAr ? (hotel.roomNameAr ?? hotel.roomName) : (hotel.roomNameEn ?? hotel.roomName);
    const getHotelAddOnName = (addOn: NonNullable<NonNullable<typeof cart.hotel>["selectedAddOns"]>[number]) => isAr ? (addOn.nameAr ?? addOn.name) : (addOn.nameEn ?? addOn.name);
    const getTripTitle = (trip: typeof cart.trips[number]) => isAr ? trip.titleAr : (trip.titleEn ?? trip.titleAr);
    const getTripOptionName = (option: NonNullable<typeof cart.trips[number]["selectedOptions"]>[number]) => isAr ? option.nameAr : (option.nameEn ?? option.nameAr);
    const getTripAddOnName = (addOn: NonNullable<typeof cart.trips[number]["selectedAddOns"]>[number]) => isAr ? addOn.nameAr : (addOn.nameEn ?? addOn.nameAr);
    const t = {
        errors: {
            name: isAr ? "الاسم مطلوب" : "Name is required",
            phone: isAr ? "Phone number is required" : "Phone number is required",
        },
        whatsapp: {
            header: isAr ? "طلب حجز جديد — Oday Tourism" : "New booking request — Oday Tourism",
            name: isAr ? "الاسم" : "Name",
            phone: isAr ? "الهاتف/واتساب" : "Phone / WhatsApp",
            email: isAr ? "البريد" : "Email",
            guests: isAr ? "الضيوف" : "Guests",
            adults: isAr ? "بالغ" : "adults",
            children: isAr ? "أطفال" : "children",
            travelDate: isAr ? "تاريخ السفر" : "Travel date",
            hotel: isAr ? "الفندق" : "Hotel",
            room: isAr ? "الغرفة" : "Room",
            addOns: isAr ? "الإضافات" : "Add-ons",
            nights: isAr ? "الليالي" : "Nights",
            cost: isAr ? "التكلفة" : "Cost",
            requestedHotel: isAr ? "الفندق المطلوب" : "Requested hotel",
            trips: isAr ? "الرحلات" : "Trips",
            perPerson: isAr ? "/شخص" : "/person",
            estimatedTotal: isAr ? "الإجمالي التقديري" : "Estimated total",
            notes: isAr ? "ملاحظات" : "Notes",
            agreementConfirmed: isAr ? "تمت الموافقة على الشروط والأحكام وسياسة الاسترداد" : "Agreed to Terms & Conditions and Refund Policy",
        },
        submitted: {
            title: isAr ? "تم إرسال طلبك بنجاح!" : "Your request was sent successfully!",
            desc: isAr ? "سيتم التواصل معك عبر الواتساب لتأكيد التفاصيل." : "We'll contact you on WhatsApp to confirm the details.",
            cta: isAr ? "تصفح المزيد من الرحلات" : "Browse more trips",
        },
        empty: {
            title: isAr ? "السلة فارغة" : "Your cart is empty",
            desc: isAr ? "أضف رحلات أو فنادق لبدء الحجز" : "Add trips or hotels to start your booking",
            trips: isAr ? "تصفح الرحلات" : "Browse trips",
            hotels: isAr ? "تصفح الفنادق" : "Browse hotels",
        },
        form: {
            title: isAr ? "إتمام الحجز" : "Complete booking",
            section: isAr ? "بياناتك الشخصية" : "Your details",
            fullName: isAr ? "الاسم الكامل *" : "Full name *",
            fullNamePlaceholder: isAr ? "أدخل اسمك الكامل" : "Enter your full name",
            phone: isAr ? "رقم الهاتف / واتساب *" : "Phone / WhatsApp *",
            email: isAr ? "البريد الإلكتروني" : "Email address",
            hotelName: isAr ? "اسم الفندق (إن وجد)" : "Hotel name (if any)",
            hotelNamePlaceholder: isAr ? "الفندق الذي تقيم به في شرم الشيخ" : "The hotel you're staying at in Sharm El Sheikh",
            notes: isAr ? "ملاحظات إضافية" : "Additional notes",
            notesPlaceholder: isAr ? "أي ملاحظات أو طلبات خاصة..." : "Any notes or special requests...",
            submit: isAr ? "أرسل طلب الحجز عبر واتساب" : "Send booking request via WhatsApp",
        },
        legal: {
            agreementLabel: isAr ? "قرأت وأوافق على" : "I have read and agree to",
            termsLabel: isAr ? "الشروط والأحكام" : "Terms & Conditions",
            refundLabel: isAr ? "سياسة الاسترداد" : "Refund Policy",
            agreementError: isAr ? "يجب الموافقة على الشروط والأحكام للاستمرار" : "You must agree to the terms to continue",
        },
        summary: {
            title: isAr ? "ملخص الطلب" : "Order summary",
            item: isAr ? "عنصر" : "item",
            items: isAr ? "عناصر" : "items",
            hotelStay: isAr ? "إقامة فندقية" : "Hotel stay",
            nights: isAr ? "ليالي" : "nights",
            rooms: isAr ? "غرف" : "rooms",
            trip: isAr ? "رحلة" : "Trip",
            guests: isAr ? "الضيوف" : "Guests",
            adults: isAr ? "بالغ" : "adults",
            children: isAr ? "أطفال" : "children",
            travelDate: isAr ? "تاريخ السفر" : "Travel date",
            estimatedTotal: isAr ? "الإجمالي التقديري" : "Estimated total",
            onRequest: isAr ? "عند الطلب" : "On request",
            clear: isAr ? "مسح السلة بالكامل" : "Clear cart",
        },
    };

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!name.trim()) errs.name = t.errors.name;
        if (!phone.trim()) errs.phone = t.errors.phone;
        if (!agreedToPolicies) errs.agreement = t.legal.agreementError;
        return errs;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        let msg = `*${t.whatsapp.header}*\n\n`;
        msg += `${t.whatsapp.name}: ${name}\n`;
        msg += `${t.whatsapp.phone}: ${phone}\n`;
        if (email.trim()) msg += `${t.whatsapp.email}: ${email}\n`;
        msg += `${t.whatsapp.guests}: ${cart.guests.adults} ${t.whatsapp.adults}${cart.guests.children > 0 ? `${isAr ? "،" : ","} ${cart.guests.children} ${t.whatsapp.children}` : ""}\n`;
        if (cart.travelDate) msg += `${t.whatsapp.travelDate}: ${cart.travelDate}\n`;
        msg += "\n";

        if (cart.hotel) {
            msg += `*${t.whatsapp.hotel}:* ${getHotelName(cart.hotel)} — ${isAr ? (cart.hotel.cityAr ?? cart.hotel.city) : (cart.hotel.cityEn ?? cart.hotel.city)}\n`;
            if (getHotelRoomName(cart.hotel)) msg += `${t.whatsapp.room}: ${getHotelRoomName(cart.hotel)} × ${cart.hotel.roomsCount || 1}\n`;
            if (cart.hotel.selectedAddOns?.length) msg += `${t.whatsapp.addOns}: ${cart.hotel.selectedAddOns.map((a) => getHotelAddOnName(a)).join(isAr ? "، " : ", ")}\n`;
            msg += `   ${t.whatsapp.nights}: ${cart.nights} | ${t.whatsapp.cost}: $${hotelCost}\n\n`;
        }

        if (hotelName.trim() && !cart.hotel) {
            msg += `${t.whatsapp.requestedHotel}: ${hotelName}\n\n`;
        }

        if (cart.trips.length > 0) {
            msg += `*${t.whatsapp.trips}:*\n`;
            cart.trips.forEach((trip) => {
                msg += `  • ${getTripTitle(trip)}`;
                if (trip.selectedOptions && trip.selectedOptions.length > 0) {
                    trip.selectedOptions.forEach((opt) => {
                        msg += ` — ${getTripOptionName(opt)}`;
                        if (opt.price > 0) msg += ` ($${opt.price}${t.whatsapp.perPerson})`;
                    });
                }
                msg += "\n";
                if (trip.selectedAddOns && trip.selectedAddOns.length > 0) {
                    trip.selectedAddOns.forEach((a) => {
                        msg += `    + ${getTripAddOnName(a)}`;
                        if (a.price > 0) msg += ` ($${a.price})`;
                        msg += "\n";
                    });
                }
            });
            msg += "\n";
        }

        if (totalPrice > 0) msg += `*${t.whatsapp.estimatedTotal}: $${totalPrice}*\n`;
        if (notes.trim()) msg += `\n${t.whatsapp.notes}: ${notes}\n`;
        
        msg += `\n${t.whatsapp.agreementConfirmed}\n`;

        const whatsappUrl = `https://wa.me/201032549630?text=${encodeURIComponent(msg)}`;
        window.open(whatsappUrl, "_blank");
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir={isAr ? "rtl" : "ltr"}>
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-3xl p-10 border border-[#e2e8f0] shadow-sm text-center">
                        <div className="w-16 h-16 bg-[#10B981]/10 rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-[#0f172a] mb-3">{t.submitted.title}</h3>
                        <p className="text-[#64748b] mb-6">{t.submitted.desc}</p>
                        <Link
                            href={`/${lang}/trips`}
                            className="bg-[#0EA5E9] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#0284c7] transition inline-block"
                        >
                            {t.submitted.cta}
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    if (totalItems === 0) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir={isAr ? "rtl" : "ltr"}>
                <div className="max-w-lg mx-auto px-4 text-center">
                    <div className="bg-white rounded-3xl p-10 border border-[#e2e8f0] shadow-sm">
                        <div className="w-16 h-16 bg-[#F0F9FF] rounded-full flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8 text-[#BAE6FD]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#0f172a] mb-3">{t.empty.title}</h3>
                        <p className="text-[#64748b] mb-6">{t.empty.desc}</p>
                        <div className="flex flex-col gap-2">
                            <Link href={`/${lang}/trips`} className="bg-[#0EA5E9] text-white py-3 rounded-xl font-semibold text-center">
                                {t.empty.trips}
                            </Link>
                            <Link href={`/${lang}/hotels`} className="border border-[#e2e8f0] text-[#0f172a] py-3 rounded-xl font-semibold text-center hover:bg-[#f8fafc] transition-colors">
                                {t.empty.hotels}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    const inputClass = (field: string) =>
        `w-full bg-[#f8fafc] border ${errors[field] ? "border-red-400" : "border-[#e2e8f0]"} rounded-xl px-4 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition`;

    return (
        <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir={isAr ? "rtl" : "ltr"}>
            <div className="max-w-[1000px] mx-auto px-4 md:px-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-8">{t.form.title}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm p-6 md:p-8">
                        <h2 className="text-lg font-bold text-[#0f172a] mb-6">{t.form.section}</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">{t.form.fullName}</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder={t.form.fullNamePlaceholder}
                                    className={inputClass("name")}
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">{t.form.phone}</label>
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
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">{t.form.email}</label>
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
                                    <label className="block text-sm font-bold text-[#0f172a] mb-2">{t.form.hotelName}</label>
                                    <input
                                        type="text"
                                        value={hotelName}
                                        onChange={(e) => setHotelName(e.target.value)}
                                        placeholder={t.form.hotelNamePlaceholder}
                                        className={inputClass("hotelName")}
                                    />
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-[#0f172a] mb-2">{t.form.notes}</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder={t.form.notesPlaceholder}
                                    rows={3}
                                    className={`${inputClass("notes")} resize-none`}
                                />
                            </div>
                            {/* Agreement Checkbox */}
                            <div className="md:col-span-2 flex items-center mt-2 gap-2">
                                <input
                                    id="agreement"
                                    type="checkbox"
                                    checked={agreedToPolicies}
                                    onChange={(e) => setAgreedToPolicies(e.target.checked)}
                                    className="w-5 h-5 text-[#0EA5E9] border-gray-300 rounded focus:ring-[#0EA5E9]"
                                />
                                <label htmlFor="agreement" className="ml-3 text-sm font-semibold text-[#0f172a]">
                                    {t.legal.agreementLabel}
                                    &nbsp;
                                    <Link href={`/${lang}/terms`} className="text-[#0EA5E9] hover:text-[#0284c7] font-bold" target="_blank">{t.legal.termsLabel}</Link>
                                    &nbsp;{isAr ? "و" : "and"}&nbsp;
                                    <Link href={`/${lang}/refund-policy`} className="text-[#0EA5E9] hover:text-[#0284c7] font-bold" target="_blank">{t.legal.refundLabel}</Link>
                                </label>
                            </div>
                            {errors.agreement && <p className="md:col-span-2 text-sm font-semibold text-red-500 mt-1">{errors.agreement}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={!agreedToPolicies}
                            className={`mt-6 w-full ${agreedToPolicies ? "bg-[#25D366] hover:bg-[#20BE5C] cursor-pointer" : "bg-gray-400 cursor-not-allowed"} text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-base transition-all active:scale-[0.98]`}
                        >
                            {t.form.submit}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.438C7.869 23.456 9.895 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.76-.514-5.352-1.442l-.384-.228-3.644.854.893-3.546-.252-.399A9.773 9.773 0 012.18 12c0-5.423 4.397-9.82 9.82-9.82 5.423 0 9.82 4.397 9.82 9.82 0 5.423-4.397 9.82-9.82 9.82z" />
                            </svg>
                        </button>
                    </form>

                    {/* Order Summary */}
                    <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden lg:sticky lg:top-28">
                        <div className="px-6 pt-6 pb-4 border-b border-[#e2e8f0]">
                            <h2 className="text-lg font-bold text-[#0f172a]">{t.summary.title}</h2>
                            <p className="text-xs text-[#94a3b8] mt-0.5">
                                {totalItems} {totalItems === 1 ? t.summary.item : t.summary.items}
                            </p>
                        </div>

                        <div className="px-6 py-5 space-y-4">
                            {/* Hotel */}
                            {cart.hotel && (
                                <div className="flex gap-3 pb-4 border-b border-[#f1f5f9]">
                                    <FlexibleImage src={cart.hotel.image} alt={getHotelName(cart.hotel)} width={56} height={56} sizes="56px" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-[#0EA5E9] font-semibold">{t.summary.hotelStay}</p>
                                        <p className="text-sm font-semibold text-[#0f172a] truncate">{getHotelName(cart.hotel)}</p>
                                        <p className="text-xs text-[#64748b]">
                                            {cart.nights} {t.summary.nights}
                                            {cart.hotel.roomsCount ? ` • ${cart.hotel.roomsCount} ${t.summary.rooms}` : ''}
                                        </p>
                                        {getHotelRoomName(cart.hotel) && <p className="text-[11px] text-[#94a3b8] mt-0.5">{getHotelRoomName(cart.hotel)}</p>}
                                        {cart.hotel.selectedAddOns && cart.hotel.selectedAddOns.length > 0 && (
                                            <p className="text-[11px] text-[#94a3b8] mt-0.5">
                                                + {cart.hotel.selectedAddOns.map((a) => getHotelAddOnName(a)).join(isAr ? "، " : ", ")}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-sm font-semibold text-[#0f172a] shrink-0">${hotelCost}</span>
                                </div>
                            )}

                            {/* Trips */}
                            {cart.trips.map((trip) => {
                                const tripCost = trip.selectedOptions && trip.selectedOptions.length > 0
                                    ? (trip.selectedOptions[0].price + (trip.selectedAddOns || []).reduce((s, a) => s + a.price, 0)) * guestsTotal
                                    : trip.startingPrice > 0 ? trip.startingPrice * guestsTotal : 0;
                                return (
                                    <div key={trip.slug} className="flex gap-3 pb-4 border-b border-[#f1f5f9] last:border-0 last:pb-0">
                                        <FlexibleImage src={trip.heroImage} alt={getTripTitle(trip)} width={56} height={56} sizes="56px" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-[#0EA5E9] font-semibold">{t.summary.trip}</p>
                                            <p className="text-sm font-semibold text-[#0f172a] line-clamp-1">{getTripTitle(trip)}</p>
                                            {trip.selectedOptions && trip.selectedOptions.length > 0 && (
                                                <p className="text-xs text-[#64748b]">{trip.selectedOptions.map((o) => getTripOptionName(o)).join(isAr ? "، " : ", ")}</p>
                                            )}
                                            {trip.selectedAddOns && trip.selectedAddOns.length > 0 && (
                                                <p className="text-xs text-[#94a3b8]">
                                                    + {trip.selectedAddOns.map((a) => getTripAddOnName(a)).join(isAr ? "، " : ", ")}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-semibold text-[#0f172a] shrink-0">
                                            {tripCost > 0 ? `$${tripCost}` : "—"}
                                        </span>
                                    </div>
                                );
                            })}

                            {/* Guests */}
                            <div className="flex items-center justify-between text-sm pt-2">
                                <span className="text-[#64748b]">{t.summary.guests}</span>
                                <span className="font-semibold text-[#0f172a]">
                                    {cart.guests.adults} {t.summary.adults}{cart.guests.children > 0 ? `${isAr ? "،" : ","} ${cart.guests.children} ${t.summary.children}` : ""}
                                </span>
                            </div>
                            {cart.travelDate && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#64748b]">{t.summary.travelDate}</span>
                                    <span className="font-semibold text-[#0f172a]">{cart.travelDate}</span>
                                </div>
                            )}
                        </div>

                        {/* Total */}
                        <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
                            <span className="font-semibold text-[#0f172a]">{t.summary.estimatedTotal}</span>
                            <span className="text-2xl font-semibold text-[#0EA5E9]">
                                {totalPrice > 0 ? `$${totalPrice}` : t.summary.onRequest}
                            </span>
                        </div>

                        <div className="px-6 py-4">
                            <button
                                onClick={clearCart}
                                className="w-full text-xs text-[#94a3b8] hover:text-red-500 transition-colors py-1"
                            >
                                {t.summary.clear}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
