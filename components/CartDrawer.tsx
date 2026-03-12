"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

/* ── Counter sub-component ── */
function Counter({ value, onDec, onInc }: { value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex items-center gap-0 bg-white rounded-full border border-[#E2E8F0] shadow-sm">
      <button onClick={onDec} className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors text-lg leading-none">−</button>
      <span className="w-7 text-center text-sm font-bold text-[#0F172A] tabular-nums select-none">{value}</span>
      <button onClick={onInc} className="w-8 h-8 flex items-center justify-center text-[#94A3B8] hover:text-[#0F172A] transition-colors text-lg leading-none">+</button>
    </div>
  );
}

/* ── Ignore unused for now ── */
void Counter;

export default function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    removeTrip,
    setHotel,
    totalPrice,
    totalItems,
    clearCart,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
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
        if (t.selectedOptions && t.selectedOptions.length > 0) {
          const optTotal = t.selectedOptions.reduce((s, o) => s + o.price * (o.persons ?? 1), 0);
          msg += ` — ${t.selectedOptions.map(o => o.nameAr).join("، ")}`;
          if (optTotal > 0) msg += ` ($${optTotal})`;
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

  const getTripPrice = (trip: typeof cart.trips[0]) => {
    if (trip.selectedOptions && trip.selectedOptions.reduce((s, o) => s + o.price * (o.persons ?? 1), 0) > 0) {
      return trip.selectedOptions.reduce((s, o) => s + o.price * (o.persons ?? 1), 0) + (trip.selectedAddOns || []).reduce((s, a) => s + a.price, 0);
    }
    return trip.startingPrice > 0 ? trip.startingPrice * guestsTotal : 0;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-[9998] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 h-full w-full sm:max-w-[440px] bg-[#F8FAFC] z-[9999] shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ━━━ Header ━━━ */}
        <div className="relative shrink-0 bg-white border-b border-[#E2E8F0] px-5 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center">
                <svg className="w-[18px] h-[18px] text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
              </div>
              <div>
                <h2 className="font-extrabold text-[#0F172A] text-[15px]">برنامج رحلتك</h2>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">
                  {totalItems === 0 ? "لم تضف شيئاً بعد" : `${totalItems} ${totalItems === 1 ? "عنصر" : "عناصر"}`}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors"
              aria-label="إغلاق"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

        </div>

        {/* ━━━ Content ━━━ */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 pb-4 space-y-3">
          {totalItems === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF] flex items-center justify-center">
                  <svg className="w-11 h-11 text-[#7DD3FC]" fill="none" stroke="currentColor" strokeWidth={1.2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#FEF3C7] flex items-center justify-center text-base">✨</div>
              </div>
              <h3 className="font-extrabold text-[#0F172A] text-lg mb-1.5">ابدأ ببناء رحلتك!</h3>
              <p className="text-sm text-[#94A3B8] leading-relaxed mb-8 max-w-[260px]">
                اختر فندق ورحلات لتخصيص تجربتك المثالية
              </p>
              <div className="flex flex-col gap-2.5 w-full max-w-[280px]">
                <Link
                  href="/hotels"
                  onClick={closeCart}
                  className="bg-[#0F172A] text-white text-sm font-bold py-3 rounded-xl text-center hover:bg-[#1E293B] transition-colors flex items-center justify-center gap-2"
                >
                  <span>🏨</span> تصفح الفنادق
                </Link>
                <Link
                  href="/trips"
                  onClick={closeCart}
                  className="bg-white border border-[#E2E8F0] text-[#0F172A] text-sm font-bold py-3 rounded-xl text-center hover:bg-white hover:border-[#CBD5E1] transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <span>🗺️</span> تصفح الرحلات
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* ── Hotel Card ── */}
              {cart.hotel && (
                <div className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0]/60 overflow-hidden">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cart.hotel.image}
                      alt={cart.hotel.name}
                      className="w-full h-28 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex items-center gap-1 mb-0.5">
                        {Array.from({ length: cart.hotel.stars }).map((_, i) => (
                          <svg key={i} className="w-3 h-3 text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                      <h4 className="font-bold text-white text-sm leading-tight truncate">{cart.hotel.name}</h4>
                      <p className="text-[11px] text-white/70">{cart.hotel.city}</p>
                    </div>
                    <button
                      onClick={() => setHotel(null)}
                      className="absolute top-2.5 left-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/80 hover:bg-red-500 hover:text-white transition-colors"
                      aria-label="إزالة الفندق"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {/* Hotel controls */}
                  <div className="px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                      <span className="text-xs text-[#64748B]">{cart.nights} ليالي</span>
                      <span className="text-base font-extrabold text-[#0F172A] mr-1">${hotelCost}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit button */}
                      <Link
                        href={`/hotels/${cart.hotel.slug}#booking`}
                        onClick={closeCart}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-bold hover:bg-[#DBEAFE] transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                        تعديل
                      </Link>
                      {/* Delete button */}
                      <button
                        onClick={() => setHotel(null)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF2F2] text-[#EF4444] text-xs font-bold hover:bg-[#FEE2E2] transition-colors"
                        aria-label="إزالة الفندق"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      
                      </button>
                    </div>
                    
                  </div>
                </div>
              )}

              {/* ── Trips ── */}
              {cart.trips.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2 px-1 pt-1">
                    {/* <div className="w-5 h-5 rounded-md bg-[#DBEAFE] flex items-center justify-center">
                      <svg className="w-3 h-3 text-[#2563EB]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div> */}
                    <span className="text-xs font-bold text-[#64748B]">الرحلات ({cart.trips.length})</span>
                  </div>
                  {cart.trips.map((trip) => {
                    const price = getTripPrice(trip);
                    return (
                      <div key={trip.slug} className="bg-white rounded-2xl shadow-sm border border-[#E2E8F0]/60 overflow-hidden">
                        {/* Trip header */}
                        <div className="flex gap-3 p-3.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={trip.heroImage}
                            alt={trip.titleAr}
                            className="w-[60px] h-[60px] rounded-xl object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <h4 className="font-bold text-[#0F172A] text-[13px] leading-snug line-clamp-2">{trip.titleAr}</h4>
                            <p className="text-sm font-extrabold text-[#0F172A] mt-1">
                              {price > 0 ? `$${price}` : "السعر عند الطلب"}
                            </p>
                          </div>
                        </div>

                        {/* Selected options breakdown */}
                        {trip.selectedOptions && trip.selectedOptions.length > 0 && (
                          <div className="mx-3.5 mb-2 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/80 divide-y divide-[#E2E8F0]/60">
                            {trip.selectedOptions.map((o, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />
                                  <span className="text-xs font-semibold text-[#334155] truncate">{o.nameAr}</span>
                                  {(o.persons ?? 1) > 1 && (
                                    <span className="text-[10px] text-[#94A3B8] shrink-0">×{o.persons}</span>
                                  )}
                                </div>
                                <span className="text-xs font-bold text-[#0F172A] shrink-0 mr-2">
                                  {o.price > 0 ? `$${o.price * (o.persons ?? 1)}` : "—"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Selected add-ons breakdown */}
                        {trip.selectedAddOns && trip.selectedAddOns.length > 0 && (
                          <div className="mx-3.5 mb-3 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]/50 divide-y divide-[#FDE68A]/40">
                            {trip.selectedAddOns.map((a, i) => (
                              <div key={i} className="flex items-center justify-between px-3 py-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="text-[10px] shrink-0">✦</span>
                                  <span className="text-xs font-semibold text-[#92400E] truncate">{a.nameAr}</span>
                                </div>
                                <span className="text-xs font-bold text-[#92400E] shrink-0 mr-2">
                                  {a.price > 0 ? `+$${a.price}` : "مجاناً"}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Trip controls */}
                        <div className="px-4 py-3 flex items-center justify-between border-t border-[#F1F5F9]">
                          <button className="text-xs text-[#94A3B8]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                          <div className="flex items-center gap-2">
                            {/* Edit button */}
                            <Link
                              href={`/trips/${trip.slug}#booking`}
                              onClick={closeCart}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EFF6FF] text-[#2563EB] text-xs font-bold hover:bg-[#DBEAFE] transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                              تعديل
                            </Link>
                            {/* Delete button */}
                            <button
                              onClick={() => removeTrip(trip.slug)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FEF2F2] text-[#EF4444] text-xs font-bold hover:bg-[#FEE2E2] transition-colors"
                              aria-label="إزالة الرحلة"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}


            </>
          )}
        </div>

        {/* ━━━ Footer ━━━ */}
        {totalItems > 0 && (
          <div className="shrink-0 border-t border-[#E2E8F0] bg-white px-5 pt-4 pb-5 space-y-3">
            {/* Breakdown */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#94A3B8]">الإجمالي التقديري</span>
              <span className="text-2xl font-black text-[#0F172A] tracking-tight">
                {totalPrice > 0 ? `$${totalPrice}` : "عند الطلب"}
              </span>
            </div>

            {/* CTA */}
            <Link
              href={`/checkout?wa=${encodeURIComponent(buildWhatsAppMsg())}`}
              onClick={closeCart}
              className="block w-full bg-gradient-to-l from-[#2563EB] to-[#3B82F6] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white font-bold py-3.5 rounded-xl text-center text-sm transition-all shadow-md shadow-[#2563EB]/20 active:scale-[0.98]"
            >
              إتمام الحجز
            </Link>

            {/* Secondary actions */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={clearCart}
                className="text-xs text-[#CBD5E1] hover:text-red-400 transition-colors"
              >
                مسح السلة
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
