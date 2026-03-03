"use client";

import { usePackage } from "@/lib/package-context";
import { formatPrice, calculatePricingBreakdown, totalGuests } from "@/lib/pricing";

export default function PackageSummary() {
  const { selection } = usePackage();
  const breakdown = calculatePricingBreakdown(selection);
  const guests = totalGuests(selection.guests);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-5 sticky top-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"></div>
      <h3 className="text-lg font-bold text-[#0F172A] mb-5">ملخص الباقة</h3>

      <div className="space-y-5">
        {/* Hotel */}
        {selection.hotel && (
          <div className="flex gap-3 items-start pb-4 border-b border-[#F1F5F9]">
            <img src={selection.hotel.images[0]} alt={selection.hotel.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-bold text-[#0F172A] truncate">{selection.hotel.name}</h4>
              <p className="text-[11px] text-[#64748B] mt-0.5">{selection.numberOfNights} ليالي • {guests} ضيوف</p>
              <div className="text-sm font-bold text-[#0EA5E9] mt-1.5">{formatPrice(breakdown.hotelCost)}</div>
            </div>
          </div>
        )}

        {/* Trips */}
        {selection.trips.length > 0 && (
          <div className="pb-4 border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">الرحلات ({selection.trips.length})</p>
            <div className="space-y-2.5">
              {selection.trips.map((trip) => (
                <div key={trip.id} className="flex justify-between items-start text-xs">
                  <span className="text-[#334155] font-medium max-w-[140px] leading-tight">{trip.title}</span>
                  <span className="text-[#0EA5E9] font-bold shrink-0">{formatPrice(trip.pricePerPerson * guests)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add-ons */}
        {selection.addOns.length > 0 && (
          <div className="pb-4 border-b border-[#F1F5F9]">
            <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">الإضافات ({selection.addOns.length})</p>
            <div className="space-y-2.5">
              {selection.addOns.map((addon) => {
                let cost = addon.price;
                if (addon.pricingModel === "perPerson") cost *= guests;
                if (addon.pricingModel === "perNight") cost *= selection.numberOfNights;
                return (
                  <div key={addon.id} className="flex justify-between items-start text-xs">
                    <span className="text-[#334155] font-medium leading-tight flex items-center gap-1.5">
                      <span className="text-sm">{addon.icon}</span> {addon.name}
                    </span>
                    <span className="text-[#0EA5E9] font-bold shrink-0">+{formatPrice(cost)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Final Total */}
        <div className="pt-2">
          <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between">
            <span className="font-bold text-[#0F172A]">الإجمالي</span>
            <span className="text-xl font-black text-[#0EA5E9]">{formatPrice(breakdown.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}