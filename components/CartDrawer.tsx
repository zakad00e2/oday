"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeTrip,
    setHotel,
    setGuests,
    setNights,
    setTravelDate,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const guestsTotal = cart.guests.adults + cart.guests.children;
  const hotelCost = cart.hotel ? cart.hotel.pricePerNight * cart.nights : 0;

  const buildWhatsAppMsg = () => {
    let msg = "🌟 *طلب حجز — Oday Tourism*\n\n";
    if (cart.hotel) {
      msg += `🏨 *الفندق:* ${cart.hotel.name} — ${cart.hotel.city}\n`;
      msg += `🌙 عدد الليالي: ${cart.nights}\n`;
      msg += `💰 تكلفة الإقامة: $${hotelCost}\n\n`;
    }
    if (cart.trips.length > 0) {
      msg += `🗺️ *الرحلات:*\n`;
      cart.trips.forEach((t) => {
        msg += `  • ${t.titleAr}`;
        if (t.selectedOption) {
          msg += ` — ${t.selectedOption.nameAr}`;
          if (t.selectedOption.price > 0) msg += ` ($${t.selectedOption.price}/شخص)`;
        } else if (t.startingPrice > 0) {
          msg += ` — $${t.startingPrice * guestsTotal}`;
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
    msg += `👥 الضيوف: ${cart.guests.adults} بالغ، ${cart.guests.children} أطفال\n`;
    if (cart.travelDate) msg += `📅 تاريخ السفر: ${cart.travelDate}\n`;
    if (totalPrice > 0) msg += `\n💵 *الإجمالي التقديري: $${totalPrice}*`;
    return msg;
  };

  const whatsappUrl = `https://wa.me/201032549630?text=${encodeURIComponent(buildWhatsAppMsg())}`;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer — slides in from left (RTL: left = start) */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[70] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ─────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F0F9FF] flex items-center justify-center">
              <svg
                className="w-5 h-5 text-[#0EA5E9]"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-[#0F172A]">سلة الحجوزات</h2>
              <p className="text-xs text-[#94A3B8]">
                {totalItems === 0
                  ? "السلة فارغة"
                  : `${totalItems} ${totalItems === 1 ? "عنصر" : "عناصر"}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-full bg-[#F8FAFC] flex items-center justify-center text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
            aria-label="إغلاق"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Content ────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {totalItems === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#F0F9FF] flex items-center justify-center mb-4">
                <svg
                  className="w-10 h-10 text-[#BAE6FD]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <p className="font-bold text-[#0F172A] mb-2">السلة فارغة</p>
              <p className="text-sm text-[#94A3B8] mb-8">
                أضف فنادق أو رحلات للبدء في تخصيص رحلتك
              </p>
              <div className="flex flex-col gap-2 w-full">
                <Link
                  href="/hotels"
                  onClick={closeCart}
                  className="bg-[#0F172A] text-white text-sm font-bold py-3 rounded-xl text-center"
                >
                  🏨 تصفح الفنادق
                </Link>
                <Link
                  href="/trips"
                  onClick={closeCart}
                  className="border border-[#E2E8F0] text-[#0F172A] text-sm font-bold py-3 rounded-xl text-center hover:bg-[#F8FAFC] transition-colors"
                >
                  🗺️ تصفح الرحلات
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Hotel Card */}
              {cart.hotel && (
                <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden">
                  <div className="flex gap-3 p-4">
                    <img
                      src={cart.hotel.image}
                      alt={cart.hotel.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#0EA5E9] mb-0.5">🏨 إقامة</p>
                          <h4 className="font-bold text-[#0F172A] text-sm leading-tight truncate">
                            {cart.hotel.name}
                          </h4>
                          <p className="text-xs text-[#64748B] mt-0.5">{cart.hotel.city}</p>
                        </div>
                        <button
                          onClick={() => setHotel(null)}
                          className="text-[#94A3B8] hover:text-red-500 transition-colors mt-0.5 mr-2 shrink-0"
                          aria-label="إزالة الفندق"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Nights control */}
                  <div className="px-4 pb-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-[#64748B]">عدد الليالي</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setNights(cart.nights - 1)}
                          className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold text-[#0F172A] w-5 text-center tabular-nums">
                          {cart.nights}
                        </span>
                        <button
                          onClick={() => setNights(cart.nights + 1)}
                          className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-[#0EA5E9]">${hotelCost}</span>
                  </div>
                </div>
              )}

              {/* Trips */}
              {cart.trips.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                    الرحلات ({cart.trips.length})
                  </p>
                  {cart.trips.map((trip) => (
                    <div
                      key={trip.slug}
                      className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 flex gap-3 items-center"
                    >
                      <img
                        src={trip.heroImage}
                        alt={trip.titleAr}
                        className="w-14 h-14 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#0EA5E9] mb-0.5">🗺️ رحلة</p>
                        <h4 className="font-bold text-[#0F172A] text-sm leading-tight line-clamp-2">
                          {trip.titleAr}
                        </h4>
                        {trip.selectedOption && (
                          <p className="text-xs text-[#64748B] mt-0.5">{trip.selectedOption.nameAr}</p>
                        )}
                        {trip.selectedAddOns && trip.selectedAddOns.length > 0 && (
                          <p className="text-xs text-[#94A3B8] mt-0.5">+ {trip.selectedAddOns.map(a => a.nameAr).join("، ")}</p>
                        )}
                        <p className="text-xs text-[#0EA5E9] font-bold mt-1">
                          {trip.selectedOption && trip.selectedOption.price > 0
                            ? `$${(trip.selectedOption.price + (trip.selectedAddOns || []).reduce((s, a) => s + a.price, 0)) * guestsTotal}`
                            : trip.startingPrice > 0
                              ? `$${trip.startingPrice * guestsTotal}`
                              : "السعر عند الطلب"}
                        </p>
                      </div>
                      <button
                        onClick={() => removeTrip(trip.slug)}
                        className="text-[#94A3B8] hover:text-red-500 transition-colors shrink-0"
                        aria-label="إزالة الرحلة"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Guests & Date */}
              <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-4 space-y-3">
                <p className="text-xs font-bold text-[#94A3B8] uppercase tracking-widest mb-1">
                  تفاصيل السفر
                </p>

                {/* Adults */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">البالغين</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setGuests({
                          ...cart.guests,
                          adults: cart.guests.adults - 1,
                        })
                      }
                      className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[#0F172A] w-5 text-center tabular-nums">
                      {cart.guests.adults}
                    </span>
                    <button
                      onClick={() =>
                        setGuests({
                          ...cart.guests,
                          adults: cart.guests.adults + 1,
                        })
                      }
                      className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#64748B]">الأطفال</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setGuests({
                          ...cart.guests,
                          children: cart.guests.children - 1,
                        })
                      }
                      className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold text-[#0F172A] w-5 text-center tabular-nums">
                      {cart.guests.children}
                    </span>
                    <button
                      onClick={() =>
                        setGuests({
                          ...cart.guests,
                          children: cart.guests.children + 1,
                        })
                      }
                      className="w-7 h-7 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] text-base bg-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Travel Date */}
                <div>
                  <span className="text-sm text-[#64748B] block mb-1.5">تاريخ السفر</span>
                  <input
                    type="date"
                    value={cart.travelDate}
                    onChange={(e) => setTravelDate(e.target.value)}
                    className="w-full border border-[#E2E8F0] rounded-xl px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] bg-white"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────── */}
        {totalItems > 0 && (
          <div className="border-t border-[#E2E8F0] px-6 py-5 space-y-3 bg-white">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-[#64748B]">الإجمالي التقديري</span>
              <span className="text-xl font-black text-[#0EA5E9]">
                {totalPrice > 0 ? `$${totalPrice}` : "السعر عند الطلب"}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-sm shadow-sm hover:shadow-md"
            >
              إتمام الحجز
            </Link>
            <button
              onClick={clearCart}
              className="w-full text-xs text-[#94A3B8] hover:text-red-500 transition-colors py-1.5"
            >
              مسح السلة بالكامل
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
