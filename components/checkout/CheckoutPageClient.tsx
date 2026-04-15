"use client";

import { useState } from "react";
import Link from "next/link";
import FlexibleImage from "@/components/FlexibleImage";
import CartHotelSummaryCard from "@/components/cart/CartHotelSummaryCard";
import {
  getCartHotelRoomCount,
  getCartHotelSelectedRoomName,
  getCartHotelSelectedRooms,
} from "@/lib/cart-hotel";
import { useCart } from "@/lib/cart-context";
import {
  calculateGuestTotal,
  calculateHotelLineCost,
  calculateTripLineCost,
  calculateTripQuantity,
} from "@/lib/cart-pricing";
import { formatPrice, formatPriceWithSign } from "@/lib/currency";
import { openExternalUrl } from "@/lib/external-links";
import { useI18n } from "@/lib/i18n/dictionary-context";

export default function CheckoutPageClient() {
  const { cart, totalPrice, totalItems, clearCart, setGuests } = useCart();
  const { lang } = useI18n();
  const isAr = lang === "ar";

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [hotelName, setHotelName] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  const guestsTotal = calculateGuestTotal(cart.guests);
  const hotelSelectedRooms = cart.hotel ? getCartHotelSelectedRooms(cart.hotel) : [];
  const hotelRoomCount = cart.hotel ? getCartHotelRoomCount(cart.hotel) : 0;
  const hotelCost = cart.hotel ? calculateHotelLineCost(cart.hotel, cart.nights) : 0;

  const getHotelName = (hotel: NonNullable<typeof cart.hotel>) =>
    isAr ? hotel.nameAr ?? hotel.name : hotel.nameEn ?? hotel.name;
  const getHotelCity = (hotel: NonNullable<typeof cart.hotel>) =>
    isAr ? hotel.cityAr ?? hotel.city : hotel.cityEn ?? hotel.city;
  const getHotelAddOnName = (
    addOn: NonNullable<NonNullable<typeof cart.hotel>["selectedAddOns"]>[number],
  ) => (isAr ? addOn.nameAr ?? addOn.name : addOn.nameEn ?? addOn.name);
  const getTripTitle = (trip: typeof cart.trips[number]) =>
    isAr ? trip.titleAr : trip.titleEn ?? trip.titleAr;
  const getTripOptionName = (
    option: NonNullable<typeof cart.trips[number]["selectedOptions"]>[number],
  ) => (isAr ? option.nameAr : option.nameEn ?? option.nameAr);
  const getTripAddOnName = (
    addOn: NonNullable<typeof cart.trips[number]["selectedAddOns"]>[number],
  ) => (isAr ? addOn.nameAr : addOn.nameEn ?? addOn.nameAr);
  const updateGuestCount = (field: "adults" | "children", delta: number) => {
    setGuests({
      adults: field === "adults" ? cart.guests.adults + delta : cart.guests.adults,
      children: field === "children" ? cart.guests.children + delta : cart.guests.children,
    });
  };

  const t = {
    errors: {
      name: isAr ? "الاسم مطلوب" : "Name is required",
      phone: isAr ? "رقم الهاتف مطلوب" : "Phone number is required",
    },
    whatsapp: {
      header: isAr ? "طلب حجز جديد | Oday Tourism" : "New booking request | Oday Tourism",
      name: isAr ? "الاسم" : "Name",
      phone: isAr ? "الهاتف / واتساب" : "Phone / WhatsApp",
      email: isAr ? "البريد الإلكتروني" : "Email",
      adults: isAr ? "البالغين" : "Adults",
      children: isAr ? "الأطفال" : "Children",
      travelDate: isAr ? "تاريخ السفر" : "Travel date",
      hotel: isAr ? "الفندق" : "Hotel",
      room: isAr ? "الغرف" : "Rooms",
      addOns: isAr ? "ترقيات الغرف" : "Room upgrades",
      nights: isAr ? "عدد الليالي" : "Nights",
      cost: isAr ? "التكلفة" : "Cost",
      requestedHotel: isAr ? "الفندق المطلوب" : "Requested hotel",
      trips: isAr ? "الرحلات" : "Trips",
      estimatedTotal: isAr ? "الإجمالي التقديري" : "Estimated total",
      notes: isAr ? "ملاحظات" : "Notes",
      agreementConfirmed: isAr
        ? "تمت الموافقة على الشروط والأحكام وسياسة الاسترداد وسياسة الخصوصية"
        : "Agreed to Terms & Conditions, Refund Policy, and Privacy Policy",
    },
    submitted: {
      title: isAr ? "تم إرسال طلبك بنجاح" : "Your request was sent successfully",
      desc: isAr
        ? "سنتواصل معك على واتساب لتأكيد التفاصيل."
        : "We'll contact you on WhatsApp to confirm the details.",
      cta: isAr ? "تصفح المزيد من الرحلات" : "Browse more trips",
    },
    empty: {
      title: isAr ? "السلة فارغة" : "Your cart is empty",
      desc: isAr
        ? "أضف فندقًا أو رحلة لبدء الحجز."
        : "Add trips or hotels to start your booking.",
      trips: isAr ? "تصفح الرحلات" : "Browse trips",
      hotels: isAr ? "تصفح الفنادق" : "Browse hotels",
    },
    form: {
      title: isAr ? "إتمام الحجز" : "Complete booking",
      section: isAr ? "بياناتك" : "Your details",
      fullName: isAr ? "الاسم الكامل *" : "Full name *",
      fullNamePlaceholder: isAr ? "أدخل اسمك الكامل" : "Enter your full name",
      phone: isAr ? "الهاتف / واتساب *" : "Phone / WhatsApp *",
      email: isAr ? "البريد الإلكتروني" : "Email address",
      guestsSection: isAr ? "عدد المسافرين" : "Travelers",
      adults: isAr ? "البالغين" : "Adults",
      children: isAr ? "الأطفال" : "Children",
      hotelName: isAr ? "اسم الفندق (إن وجد)" : "Hotel name (if any)",
      hotelNamePlaceholder: isAr
        ? "اسم الفندق الذي ترغب به"
        : "The hotel you'd like to book",
      notes: isAr ? "ملاحظات إضافية" : "Additional notes",
      notesPlaceholder: isAr
        ? "أي ملاحظات أو طلبات خاصة..."
        : "Any notes or special requests...",
      submit: isAr ? "إرسال الطلب عبر واتساب" : "Send booking request via WhatsApp",
    },
    legal: {
      agreementLabel: isAr ? "أوافق على" : "I agree to",
      termsLabel: isAr ? "الشروط والأحكام" : "Terms & Conditions",
      refundLabel: isAr ? "سياسة الاسترداد" : "Refund Policy",
      privacyLabel: isAr ? "سياسة الخصوصية" : "Privacy Policy",
      agreementError: isAr
        ? "يجب الموافقة على الشروط للمتابعة"
        : "You must agree to the terms to continue",
    },
    summary: {
      title: isAr ? "ملخص الطلب" : "Order summary",
      item: isAr ? "عنصر" : "item",
      items: isAr ? "عناصر" : "items",
      hotelStay: isAr ? "إقامة فندقية" : "Hotel stay",
      selectedRooms: isAr ? "الغرف المختارة" : "Selected rooms",
      nights: isAr ? "ليالٍ" : "nights",
      rooms: isAr ? "غرف" : "rooms",
      trip: isAr ? "رحلة" : "Trip",
      travelers: isAr ? "المسافرون" : "Travelers",
      adults: isAr ? "البالغين" : "adults",
      children: isAr ? "الأطفال" : "children",
      travelDate: isAr ? "تاريخ السفر" : "Travel date",
      estimatedTotal: isAr ? "الإجمالي التقديري" : "Estimated total",
      onRequest: isAr ? "عند الطلب" : "On request",
      clear: isAr ? "مسح السلة" : "Clear cart",
      free: isAr ? "مجاني" : "Free",
    },
  };
  const hotelSummaryLabels = {
    hotelStay: t.summary.hotelStay,
    nights: t.summary.nights,
    rooms: t.summary.rooms,
    estimatedTotal: t.summary.estimatedTotal,
    free: t.summary.free,
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = t.errors.name;
    if (!phone.trim()) nextErrors.phone = t.errors.phone;
    if (!agreedToPolicies) nextErrors.agreement = t.legal.agreementError;
    return nextErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    let msg = `*${t.whatsapp.header}*\n\n`;
    msg += `${t.whatsapp.name}: ${name}\n`;
    msg += `${t.whatsapp.phone}: ${phone}\n`;
    if (email.trim()) msg += `${t.whatsapp.email}: ${email}\n`;
    msg += `${t.whatsapp.adults}: ${cart.guests.adults}\n`;
    msg += `${t.whatsapp.children}: ${cart.guests.children}\n`;
    if (cart.travelDate) msg += `${t.whatsapp.travelDate}: ${cart.travelDate}\n`;
    msg += "\n";

    if (cart.hotel) {
      msg += `*${t.whatsapp.hotel}:* ${getHotelName(cart.hotel)} - ${getHotelCity(cart.hotel)}\n`;

      if (hotelSelectedRooms.length > 0) {
        msg += `${t.whatsapp.room}:\n`;
        hotelSelectedRooms.forEach((room) => {
          msg += `- ${getCartHotelSelectedRoomName(room, lang)} x${room.count}`;
          if (room.pricePerNight > 0) {
            msg += ` (${formatPrice(room.pricePerNight, lang)})`;
          }
          msg += "\n";
        });
      }

      if (cart.hotel.selectedAddOns?.length) {
        msg += `${t.whatsapp.addOns}: ${cart.hotel.selectedAddOns
          .map((addOn) => {
            const addOnTotal = addOn.price * cart.nights * hotelRoomCount;
            return `${getHotelAddOnName(addOn)}${
              addOn.price > 0 ? ` (${formatPriceWithSign(addOnTotal, lang)})` : ""
            }`;
          })
          .join(isAr ? "، " : ", ")}\n`;
      }

      msg += `${t.whatsapp.nights}: ${cart.nights} | ${t.whatsapp.cost}: ${formatPrice(hotelCost, lang)}\n\n`;
    }

    if (hotelName.trim() && !cart.hotel) {
      msg += `${t.whatsapp.requestedHotel}: ${hotelName}\n\n`;
    }

    if (cart.trips.length > 0) {
      msg += `*${t.whatsapp.trips}:*\n`;
      cart.trips.forEach((trip) => {
        const tripQuantity = calculateTripQuantity(trip, guestsTotal);
        msg += `- ${getTripTitle(trip)} x${tripQuantity}\n`;

        if (trip.selectedOptions?.length) {
          trip.selectedOptions.forEach((option) => {
            const optionPersons = option.persons ?? 1;
            const optionTotal = option.price * optionPersons;
            msg += `  • ${getTripOptionName(option)}`;
            if (optionPersons > 1) msg += ` x${optionPersons}`;
            if (option.price > 0) msg += ` (${formatPrice(optionTotal, lang)})`;
            msg += "\n";
          });
        }

        if (trip.selectedAddOns?.length) {
          trip.selectedAddOns.forEach((addOn) => {
            const addOnPersons = addOn.persons ?? tripQuantity;
            const addOnTotal = addOn.price * addOnPersons;
            msg += `  + ${getTripAddOnName(addOn)}`;
            if (addOnPersons > 1) msg += ` x${addOnPersons}`;
            if (addOn.price > 0) msg += ` (${formatPriceWithSign(addOnTotal, lang)})`;
            msg += "\n";
          });
        }

        const tripCost = calculateTripLineCost(trip, guestsTotal);
        if (tripCost > 0) {
          msg += `  ${t.whatsapp.cost}: ${formatPrice(tripCost, lang)}\n`;
        }
      });
      msg += "\n";
    }

    if (totalPrice > 0) {
      msg += `*${t.whatsapp.estimatedTotal}: ${formatPrice(totalPrice, lang)}*\n`;
    }
    if (notes.trim()) msg += `\n${t.whatsapp.notes}: ${notes}\n`;
    msg += `\n${t.whatsapp.agreementConfirmed}\n`;

    const whatsappUrl = `https://wa.me/201032549630?text=${encodeURIComponent(msg)}`;
    if (!openExternalUrl(whatsappUrl)) {
      setSubmitError(
        isAr
          ? "تعذر فتح واتساب. اسمح بالنوافذ المنبثقة ثم حاول مرة أخرى."
          : "Couldn't open WhatsApp. Please allow pop-ups and try again.",
      );
      return;
    }

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
              <Link
                href={`/${lang}/hotels`}
                className="border border-[#e2e8f0] text-[#0f172a] py-3 rounded-xl font-semibold text-center hover:bg-[#f8fafc] transition-colors"
              >
                {t.empty.hotels}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const inputClass = (field: string) =>
    `w-full bg-[#f8fafc] border ${
      errors[field] ? "border-red-400" : "border-[#e2e8f0]"
    } rounded-xl px-4 py-3.5 text-sm text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/20 focus:border-[#0EA5E9] transition`;

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-24 pb-20" dir={isAr ? "rtl" : "ltr"}>
      <div className="max-w-[1000px] mx-auto px-4 md:px-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0f172a] mb-8">{t.form.title}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
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

              <div className="md:col-span-2">
                <p className="mb-2 px-1 text-sm font-bold text-[#0f172a]">{t.form.guestsSection}</p>
                {/* <div className="rounded-2xl border  bg-[#ffffff] p-4"> */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">{t.form.adults}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateGuestCount("adults", -1)}
                            disabled={cart.guests.adults <= 1}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] text-lg font-semibold text-[#0f172a] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={isAr ? "تقليل عدد الأشخاص" : "Decrease adults"}
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-base font-bold tabular-nums text-[#0f172a]">
                            {cart.guests.adults}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateGuestCount("adults", 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] text-lg font-semibold text-[#0f172a] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                            aria-label={isAr ? "زيادة عدد الأشخاص" : "Increase adults"}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0f172a]">{t.form.children}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => updateGuestCount("children", -1)}
                            disabled={cart.guests.children <= 0}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] text-lg font-semibold text-[#0f172a] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9] disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label={isAr ? "تقليل عدد الأطفال" : "Decrease children"}
                          >
                            -
                          </button>
                          <span className="min-w-8 text-center text-base font-bold tabular-nums text-[#0f172a]">
                            {cart.guests.children}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateGuestCount("children", 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e2e8f0] text-lg font-semibold text-[#0f172a] transition hover:border-[#0EA5E9] hover:text-[#0EA5E9]"
                            aria-label={isAr ? "زيادة عدد الأطفال" : "Increase children"}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
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

              <div className="md:col-span-2 flex items-center mt-2 gap-2">
                <input
                  id="agreement"
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="w-5 h-5 text-[#0EA5E9] border-gray-300 rounded focus:ring-[#0EA5E9]"
                />
                <label htmlFor="agreement" className="ml-3 text-sm font-semibold text-[#0f172a]">
                  {t.legal.agreementLabel}{" "}
                  <Link
                    href={`/${lang}/terms`}
                    className="text-[#0EA5E9] hover:text-[#0284c7] font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.legal.termsLabel}
                  </Link>{" "}
                  {isAr ? "و" : "and"}{" "}
                  <Link
                    href={`/${lang}/refund-policy`}
                    className="text-[#0EA5E9] hover:text-[#0284c7] font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.legal.refundLabel}
                  </Link>{" "}
                  {isAr ? "و" : "and"}{" "}
                  <Link
                    href={`/${lang}/privacy-policy`}
                    className="text-[#0EA5E9] hover:text-[#0284c7] font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.legal.privacyLabel}
                  </Link>
                </label>
              </div>

              {errors.agreement && (
                <p className="md:col-span-2 text-sm font-semibold text-red-500 mt-1">
                  {errors.agreement}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={!agreedToPolicies}
              className={`mt-6 w-full ${
                agreedToPolicies
                  ? "bg-[#25D366] hover:bg-[#20BE5C] cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              } text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg text-base transition-all active:scale-[0.98]`}
            >
              {t.form.submit}
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.555 4.126 1.527 5.862L.06 23.854l6.143-1.438C7.869 23.456 9.895 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.82c-1.93 0-3.76-.514-5.352-1.442l-.384-.228-3.644.854.893-3.546-.252-.399A9.773 9.773 0 012.18 12c0-5.423 4.397-9.82 9.82-9.82 5.423 0 9.82 4.397 9.82 9.82 0 5.423-4.397 9.82-9.82 9.82z" />
              </svg>
            </button>

            {submitError && <p className="mt-3 text-sm font-medium text-red-500">{submitError}</p>}
          </form>

          <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden lg:sticky lg:top-28">
            <div className="px-6 pt-6 pb-4 border-b border-[#e2e8f0]">
              <h2 className="text-lg font-bold text-[#0f172a]">{t.summary.title}</h2>
              <p className="text-xs text-[#94a3b8] mt-0.5">
                {totalItems} {totalItems === 1 ? t.summary.item : t.summary.items}
              </p>
            </div>

            <div className="px-6 py-5 space-y-4">
              {cart.hotel && (
                <CartHotelSummaryCard
                  hotel={cart.hotel}
                  lang={lang}
                  nights={cart.nights}
                  hotelRoomCount={hotelRoomCount}
                  hotelSelectedRooms={hotelSelectedRooms}
                  hotelCost={hotelCost}
                  labels={hotelSummaryLabels}
                  getHotelName={getHotelName}
                  getHotelCity={getHotelCity}
                  getHotelAddOnName={getHotelAddOnName}
                />
              )}

              {cart.trips.map((trip) => {
                const tripCost = calculateTripLineCost(trip, guestsTotal);
                const tripQuantity = calculateTripQuantity(trip, guestsTotal);

                return (
                  <div key={trip.slug} className="rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden">
                    <div className="flex gap-3 p-3.5">
                      <FlexibleImage
                        src={trip.heroImage}
                        alt={getTripTitle(trip)}
                        width={56}
                        height={56}
                        sizes="56px"
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#0EA5E9] font-semibold">{t.summary.trip}</p>
                        <p className="text-sm font-semibold text-[#0f172a] line-clamp-1">{getTripTitle(trip)}</p>
                      </div>
                    </div>

                    {trip.selectedOptions?.length ? (
                      <div className="mx-3.5 mb-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 divide-y divide-[#E2E8F0]/60">
                        {trip.selectedOptions.map((option, index) => {
                          const optionPersons = option.persons ?? 1;
                          const optionTotal = option.price * optionPersons;
                          return (
                            <div key={index} className="flex items-center justify-between gap-3 px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                                <span className="text-xs font-semibold text-[#334155] truncate">
                                  {getTripOptionName(option)}
                                </span>
                                {optionPersons > 1 && (
                                  <span className="text-[10px] text-[#94A3B8] shrink-0">x{optionPersons}</span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-[#0F172A] shrink-0">
                                {option.price > 0 ? formatPrice(optionTotal, lang) : "—"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    {trip.selectedAddOns?.length ? (
                      <div className="mx-3.5 mb-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/50 divide-y divide-[#FDE68A]/40">
                        {trip.selectedAddOns.map((addOn, index) => {
                          const addOnPersons = addOn.persons ?? tripQuantity;
                          const addOnTotal = addOn.price * addOnPersons;
                          return (
                            <div key={index} className="flex items-center justify-between gap-3 px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] shrink-0">+</span>
                                <span className="text-xs font-semibold text-[#92400E] truncate">
                                  {getTripAddOnName(addOn)}
                                </span>
                                {addOnPersons > 1 && (
                                  <span className="text-[10px] text-[#B45309] shrink-0">x{addOnPersons}</span>
                                )}
                              </div>
                              <span className="text-xs font-bold text-[#92400E] shrink-0">
                                {addOn.price > 0 ? formatPriceWithSign(addOnTotal, lang) : t.summary.free}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : null}

                    <div className="border-t border-[#F1F5F9] px-4 py-3 flex items-center justify-between">
                      <span className="text-xs text-[#64748b]">{t.summary.estimatedTotal}</span>
                      <span className="text-sm font-semibold text-[#0f172a]">
                        {tripCost > 0 ? formatPrice(tripCost, lang) : "—"}
                      </span>
                    </div>
                  </div>
                );
              })}

              {cart.travelDate && (
                <div className="flex items-center justify-between text-sm pt-2">
                  <span className="text-[#64748b]">{t.summary.travelDate}</span>
                  <span className="font-semibold text-[#0f172a]">{cart.travelDate}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm">
                <span className="text-[#64748b]">{t.summary.travelers}</span>
                <span className="font-semibold text-[#0f172a]">
                  {cart.guests.adults} {t.summary.adults} / {cart.guests.children} {t.summary.children}
                </span>
              </div>
            </div>

            <div className="border-t border-[#e2e8f0] bg-[#f8fafc] px-6 py-4 flex items-center justify-between">
              <span className="font-semibold text-[#0f172a]">{t.summary.estimatedTotal}</span>
              <span className="text-2xl font-semibold text-[#0EA5E9]">
                {totalPrice > 0 ? formatPrice(totalPrice, lang) : t.summary.onRequest}
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
