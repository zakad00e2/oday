"use client";

import { useState, useMemo } from "react";
import { usePackage } from "@/lib/package-context";
import { hotels } from "@/lib/data";
import { formatPrice } from "@/lib/pricing";
import { Hotel } from "@/lib/types";

const locations = Array.from(new Set(hotels.map((h) => h.location)));
const starOptions = [3, 4, 5];

export default function HotelStep() {
  const { selection, setHotel, setNumberOfNights, setGuests, setTravelDate, goNext } = usePackage();

  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterStars, setFilterStars] = useState<number>(0);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (filterCity !== "all" && h.location !== filterCity) return false;
      if (filterStars > 0 && h.stars < filterStars) return false;
      return true;
    });
  }, [filterCity, filterStars]);

  const isSelected = (h: Hotel) => selection.hotel?.id === h.id;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Guest details */}
      <div className="bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
        <p className="text-xs font-semibold text-[#64748B] uppercase tracking-widest mb-4">تفاصيل الإقامة</p>
        <div className="flex flex-wrap gap-x-8 gap-y-5 items-start">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">عدد الليالي</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setNumberOfNights(selection.numberOfNights - 1)} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">−</button>
              <span className="text-base font-bold text-[#0F172A] w-6 text-center tabular-nums">{selection.numberOfNights}</span>
              <button onClick={() => setNumberOfNights(selection.numberOfNights + 1)} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">البالغين</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests({ ...selection.guests, adults: selection.guests.adults - 1 })} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">−</button>
              <span className="text-base font-bold text-[#0F172A] w-6 text-center tabular-nums">{selection.guests.adults}</span>
              <button onClick={() => setGuests({ ...selection.guests, adults: selection.guests.adults + 1 })} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">الأطفال</span>
            <div className="flex items-center gap-3">
              <button onClick={() => setGuests({ ...selection.guests, children: selection.guests.children - 1 })} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">−</button>
              <span className="text-base font-bold text-[#0F172A] w-6 text-center tabular-nums">{selection.guests.children}</span>
              <button onClick={() => setGuests({ ...selection.guests, children: selection.guests.children + 1 })} className="w-8 h-8 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all text-lg leading-none shadow-sm">+</button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 flex-1 min-w-[180px] max-w-xs">
            <span className="text-[11px] font-medium text-[#64748B] uppercase tracking-wider">تاريخ السفر</span>
            <input
              type="date"
              value={selection.travelDate}
              onChange={(e) => setTravelDate(e.target.value)}
              className="h-10 rounded-xl border border-[#E2E8F0] px-3 text-sm text-[#0F172A] focus:outline-none focus:border-[#0EA5E9] focus:ring-1 focus:ring-[#0EA5E9] transition-all bg-white shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 items-center bg-white p-1 rounded-xl">
        {["all", ...locations].map((loc) => (
          <button
            key={loc}
            onClick={() => setFilterCity(loc)}
            className={`rounded-full px-4 py-1.5 text-xs font-medium border transition-all duration-200 ${
              filterCity === loc
                ? "bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-sm"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"
            }`}
          >
            {loc === "all" ? "كل المدن" : loc}
          </button>
        ))}
        <div className="w-px h-6 bg-[#E2E8F0] mx-2 hidden sm:block"></div>
        <select
          value={filterStars}
          onChange={(e) => setFilterStars(Number(e.target.value))}
          className="rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-xs text-[#64748B] focus:outline-none focus:border-[#0EA5E9] cursor-pointer font-medium"
        >
          <option value={0}>كل التقييمات ⭑</option>
          {starOptions.map((s) => (
            <option key={s} value={s}>{s} نجوم فأكثر</option>
          ))}
        </select>
      </div>

      {/* Hotel Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filtered.map((hotel) => {
          const selected = isSelected(hotel);
          return (
            <button
              key={hotel.id}
              onClick={() => setHotel(selected ? null : hotel)}
              className={`group text-right bg-white rounded-2xl overflow-hidden border-2 transition-all duration-300 flex flex-col sm:flex-row ${
                selected
                  ? "border-[#0EA5E9] shadow-md shadow-[#0EA5E9]/10"
                  : "border-transparent shadow-sm hover:border-[#E2E8F0] hover:shadow-md"
              }`}
            >
              <div className="relative h-48 sm:h-auto sm:w-40 shrink-0 overflow-hidden">
                <img
                  src={hotel.images[0]}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-2.5 right-2.5 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1">
                  <span className="text-[#FBBF24] text-[10px]">★</span>
                  <span className="text-white text-[10px] font-bold">{hotel.stars}</span>
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="text-[15px] font-bold text-[#0F172A] leading-snug">{hotel.name}</h4>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                      selected ? "bg-[#0EA5E9] border-[#0EA5E9] text-white" : "border-[#CBD5E1]"
                    }`}>
                      {selected && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] mb-2.5 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {hotel.location}
                  </p>
                  <p className="text-[11px] text-[#94A3B8] mb-3 line-clamp-2 leading-relaxed">{hotel.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.features.slice(0, 3).map((f) => (
                      <span key={f} className="text-[10px] font-medium bg-[#F1F5F9] text-[#64748B] rounded-md px-2 py-1">{f}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between mt-3">
                  <span className="text-[10px] text-[#94A3B8] font-medium">سعر الليلة</span>
                  <span className="text-sm font-bold text-[#0EA5E9]">{formatPrice(hotel.basePricePerNight)}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-[#94A3B8] bg-[#F8FAFC] rounded-2xl border border-dashed border-[#CBD5E1]">
          <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] text-[#0EA5E9] flex items-center justify-center mx-auto mb-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <p className="text-sm font-medium">لا توجد فنادق تطابق بحثك</p>
        </div>
      )}

      <div className="flex justify-end pt-2">
        <button
          onClick={goNext}
          disabled={!selection.hotel}
          className={`flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-300 w-full sm:w-auto ${
            selection.hotel
              ? "bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-md hover:shadow-lg shadow-[#0EA5E9]/20"
              : "bg-[#F1F5F9] text-[#94A3B8] cursor-not-allowed"
          }`}
        >
          التالي: اختر الرحلات
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
