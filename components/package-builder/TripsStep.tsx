"use client";

import { useState, useMemo } from "react";
import { usePackage } from "@/lib/package-context";
import { trips } from "@/lib/data";
import { formatPrice, totalGuests } from "@/lib/pricing";
import { Trip } from "@/lib/types";

const cities = Array.from(new Set(trips.map((t) => t.city)));

export default function TripsStep() {
  const { selection, toggleTrip, goNext, goPrev } = usePackage();
  const [filterCity, setFilterCity] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filterCity === "all") return trips;
    return trips.filter((t) => t.city === filterCity);
  }, [filterCity]);

  const isSelected = (t: Trip) => selection.trips.some((st) => st.id === t.id);
  const guestCount = totalGuests(selection.guests);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] p-5">
        <div>
          <p className="text-[11px] font-semibold text-[#64748B] uppercase tracking-widest mb-1.5">الرحلات (اختياري)</p>
          <h3 className="text-lg font-bold text-[#0F172A]">أضف المتعة لرحلتك</h3>
          <p className="text-xs text-[#64748B] mt-1">السعر بناءً على {guestCount} ضيوف</p>
        </div>
        {selection.trips.length > 0 && (
          <div className="inline-flex items-center gap-2 bg-[#E0F2FE] text-[#0369A1] rounded-xl px-4 py-2 text-sm font-bold border border-[#BAE6FD] self-start sm:self-auto shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
            </svg>
            {selection.trips.length} رحلات مختارة
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl">
        {["all", ...cities].map((city) => (
          <button
            key={city}
            onClick={() => setFilterCity(city)}
            className={`rounded-full px-5 py-2 text-xs font-semibold border transition-all duration-200 ${filterCity === city
                ? "bg-[#0EA5E9] text-white border-[#0EA5E9] shadow-sm"
                : "bg-white text-[#64748B] border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A]"
              }`}
          >
            {city === "all" ? "كل المدن" : city}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((trip) => {
          const selected = isSelected(trip);
          return (
            <button
              key={trip.id}
              onClick={() => toggleTrip(trip)}
              className={`group w-full text-right rounded-2xl overflow-hidden border-2 transition-all duration-300 bg-white flex flex-col ${selected
                  ? "border-[#0EA5E9] shadow-md shadow-[#0EA5E9]/10"
                  : "border-[#E2E8F0] hover:border-[#CBD5E1] shadow-sm hover:shadow-md"
                }`}
            >
              <div className="relative h-44 overflow-hidden shrink-0">
                <img
                  src={trip.images[0]}
                  alt={trip.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {selected && (
                  <div className="absolute inset-0 bg-[#0EA5E9]/20 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-[#0EA5E9] flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-[#0F172A] text-[10px] font-bold rounded-lg px-2.5 py-1.5 shadow-sm">
                  {trip.city}
                </div>
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h4 className="text-[15px] font-bold text-[#0F172A] leading-snug">{trip.title}</h4>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${selected ? "bg-[#0EA5E9] border-[#0EA5E9] text-white" : "border-[#CBD5E1]"
                      }`}>
                      {selected && (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-[#64748B] line-clamp-2 mb-3 leading-relaxed">{trip.description}</p>
                </div>
                <div className="pt-3 border-t border-[#F1F5F9]">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-[#94A3B8] font-medium">المدة:</span>
                    <span className="text-[#475569] font-semibold">{trip.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#94A3B8] font-medium">للشخص:</span>
                    <span className="text-[#0EA5E9] font-bold text-sm">{formatPrice(trip.pricePerPerson)}</span>
                  </div>
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <p className="text-sm font-medium">لا توجد رحلات في هذه المدينة</p>
        </div>
      )}

      <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#E2E8F0]">
        <button onClick={goPrev} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-[#64748B] bg-white border border-[#E2E8F0] hover:border-[#CBD5E1] hover:text-[#0F172A] transition-all">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          رجوع
        </button>
        <button onClick={goNext} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-sm font-bold bg-[#0EA5E9] text-white hover:bg-[#0284C7] shadow-md hover:shadow-lg shadow-[#0EA5E9]/20 transition-all duration-300">
          التالي: الإضافات
          <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
