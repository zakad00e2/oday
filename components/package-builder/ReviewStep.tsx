"use client";

import { usePackage } from "@/lib/package-context";
import { formatPrice, calculatePricingBreakdown, totalGuests, calculateAddOnCost } from "@/lib/pricing";
import AddonIcon from "./AddonIcon";

export default function ReviewStep() {
  const { selection, goPrev, setStep } = usePackage();
  const breakdown = calculatePricingBreakdown(selection);

  if (!selection.hotel) return null;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
        <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest mb-1.5">مراجعة الباقة</p>
        <h3 className="text-lg font-bold text-[#0F172A]">تأكيد تفاصيل الحجز</h3>
        <p className="text-xs text-[#64748B] mt-1">يرجى مراجعة التفاصيل أدناه قبل المتابعة للحجز عبر واتساب</p>
      </div>

      <div className="space-y-4">
        {/* Hotel Section */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
            <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              الإقامة
            </h4>
            <button onClick={() => setStep(1)} className="text-[11px] font-bold text-[#0EA5E9] hover:underline bg-[#F0F9FF] px-2 py-1 rounded">تعديل</button>
          </div>
          <div className="flex gap-4 items-start">
            <img src={selection.hotel.images[0]} alt={selection.hotel.name} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-[#E2E8F0]" />
            <div>
              <h5 className="font-bold text-[#0F172A] mb-1">{selection.hotel.name}</h5>
              <p className="text-xs text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded inline-flex items-center gap-1.5 mb-2">
                <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg> {selection.numberOfNights} ليالي
                <span className="w-1 h-1 rounded-full bg-[#CBD5E1] mx-1"></span>
                <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg> {selection.guests.adults} بالغين، {selection.guests.children} أطفال
              </p>
              <div className="text-sm font-bold text-[#0EA5E9]">{formatPrice(breakdown.hotelCost)}</div>
            </div>
          </div>
        </div>

        {/* Trips Section */}
        {selection.trips.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
              <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </span>
                الرحلات
              </h4>
              <button onClick={() => setStep(2)} className="text-[11px] font-bold text-[#0EA5E9] hover:underline bg-[#F0F9FF] px-2 py-1 rounded">تعديل</button>
            </div>
            <div className="space-y-3">
              {selection.trips.map(trip => (
                <div key={trip.id} className="flex gap-3 items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <img src={trip.images[0]} alt={trip.title} className="w-10 h-10 rounded-lg object-cover border border-[#E2E8F0]" />
                    <div>
                      <h5 className="text-xs font-bold text-[#0F172A]">{trip.title}</h5>
                      <p className="text-[10px] text-[#64748B]">{trip.duration}</p>
                    </div>
                  </div>
                  <div dir="rtl" className="text-xs text-[#0EA5E9] shrink-0 text-left  ">
                    <span className="text-[10px] text-[#94A3B8]">{formatPrice(trip.pricePerPerson)} × {totalGuests(selection.guests)} أشخاص</span>
                   
                    <div className="font-bold  ">{formatPrice(trip.pricePerPerson * totalGuests(selection.guests))}</div>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-sm font-bold text-[#0EA5E9] border-t border-dashed border-[#E2E8F0]">
                إجمالي الرحلات: {formatPrice(breakdown.tripsCost)}
              </div>
            </div>
          </div>
        )}

        {/* AddOns Section */}
        {selection.addOns.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
              <h4 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </span>
                الإضافات
              </h4>
              <button onClick={() => setStep(3)} className="text-[11px] font-bold text-[#0EA5E9] hover:underline bg-[#F0F9FF] px-2 py-1 rounded">تعديل</button>
            </div>
            <div className="space-y-3">
              {selection.addOns.map(addon => (
                <div key={addon.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#F0F9FF] text-[#0EA5E9] border border-[#E2E8F0] [&_svg]:w-5 [&_svg]:h-5">
                      <AddonIcon id={addon.id} />
                    </span>
                    <span className="text-xs font-bold text-[#0F172A]">{addon.name}</span>
                  </div>
                  <div  className="text-xs text-[#0EA5E9] shrink-0 text-left">
                    {addon.pricingModel === "perPerson" && (
                      <span className="text-[10px] text-[#94A3B8]">{formatPrice(addon.price)} × {totalGuests(selection.guests)} أشخاص</span>
                    )}
                    {addon.pricingModel === "perNight" && (
                      <span className="text-[10px] text-[#94A3B8]">{formatPrice(addon.price)} × {selection.numberOfNights}</span>
                    )}
                    <div className="font-bold pr-5 ">{formatPrice(calculateAddOnCost(addon, selection.guests, selection.numberOfNights))}</div>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-sm font-bold text-[#0EA5E9] border-t border-dashed border-[#E2E8F0] text-right">
                إجمالي الإضافات: {formatPrice(breakdown.addOnsCost)}
              </div>
            </div>
          </div>
        )}

        {/* Final Price Block */}
        <div className="bg-gradient-to-br from-[#0EA5E9] to-[#0284C7] rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full mix-blend-overlay blur-xl -mr-10 -mt-10"></div>
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white/80 text-sm font-medium mb-1">المجموع النهائي</p>
              <div className="text-4xl font-bold flex items-end gap-2">
                {formatPrice(breakdown.total)} <span className="text-lg font-medium opacity-80 mb-1">USD</span>
              </div>
              <p className="text-white/70 text-xs mt-1">شامل الضرائب والرسوم</p>
            </div>
            
            <a 
              href="#"
              className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20BE5C] text-white px-8 py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.88-.653-1.474-1.46-1.649-1.758-.173-.298-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
              تأكيد الحجز عبر واتساب
            </a>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex pt-4">
        <button
          onClick={goPrev}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#64748B] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-all"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          رجوع
        </button>
      </div>
    </div>
  );
}