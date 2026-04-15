"use client";

import type { ReactNode } from "react";
import FlexibleImage from "@/components/FlexibleImage";
import type { CartHotel } from "@/lib/cart-context";
import {
  getCartHotelSelectedRoomName,
  type CartHotelAddOn,
  type CartHotelRoomSelection,
} from "@/lib/cart-hotel";
import { formatPrice, formatPriceWithSign } from "@/lib/currency";

interface CartHotelSummaryCardLabels {
  hotelStay: string;
  nights: string;
  rooms: string;
  estimatedTotal: string;
  free: string;
}

interface CartHotelSummaryCardProps {
  hotel: CartHotel;
  lang: "ar" | "en";
  nights: number;
  hotelRoomCount: number;
  hotelSelectedRooms: CartHotelRoomSelection[];
  hotelCost: number;
  labels: CartHotelSummaryCardLabels;
  getHotelName: (hotel: CartHotel) => string;
  getHotelCity: (hotel: CartHotel) => string;
  getHotelAddOnName: (addOn: CartHotelAddOn) => string;
  actions?: ReactNode;
  className?: string;
}

export default function CartHotelSummaryCard({
  hotel,
  lang,
  nights,
  hotelRoomCount,
  hotelSelectedRooms,
  hotelCost,
  labels,
  getHotelName,
  getHotelCity,
  getHotelAddOnName,
  actions,
  className,
}: CartHotelSummaryCardProps) {
  return (
    <div
      className={`rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden${
        className ? ` ${className}` : ""
      }`}
    >
      <div className="flex gap-3 p-3.5">
        <FlexibleImage
          src={hotel.image}
          alt={getHotelName(hotel)}
          width={56}
          height={56}
          sizes="56px"
          className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-[#0EA5E9]">
            {labels.hotelStay}
          </p>
          <p className="truncate text-sm font-semibold text-[#0f172a]">
            {getHotelName(hotel)}
          </p>
          <p className="mt-0.5 text-xs text-[#64748b]">{getHotelCity(hotel)}</p>
          <p className="flex flex-wrap items-center text-xs text-[#64748b]">
            <span>
              {nights} {labels.nights}
            </span>
            {hotelRoomCount ? (
              <>
                <span className="px-1.5 text-[#94a3b8]">&middot;</span>
                <span>
                  {hotelRoomCount} {labels.rooms}
                </span>
              </>
            ) : null}
          </p>
        </div>
      </div>

      {hotelSelectedRooms.length > 0 && (
        <div className="mx-3.5 mb-2 divide-y divide-[#E2E8F0]/60 rounded-xl border border-[#E2E8F0]/80 bg-[#F8FAFC]">
          {hotelSelectedRooms.map((room) => (
            <div
              key={room.id}
              className="flex items-center justify-between gap-3 px-3 py-2"
            >
              <div className="min-w-0">
                <span className="break-words text-xs font-semibold text-[#334155]">
                  {getCartHotelSelectedRoomName(room, lang)}
                </span>
                <span className="ms-2 text-[10px] text-[#94a3b8]">
                  x{room.count}
                </span>
              </div>
              <span className="shrink-0 text-xs font-bold text-[#0f172a]">
                {formatPrice(room.pricePerNight, lang)}
              </span>
            </div>
          ))}
        </div>
      )}

      {hotel.selectedAddOns?.length ? (
        <div className="mx-3.5 mb-3 divide-y divide-[#FDE68A]/40 rounded-xl border border-[#FDE68A]/50 bg-[#FFFBEB]">
          {hotel.selectedAddOns.map((addOn, index) => {
            const addOnTotal = addOn.price * nights * hotelRoomCount;

            return (
              <div
                key={`${addOn.name}-${index}`}
                className="flex items-center justify-between gap-3 px-3 py-2"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-[10px]">+</span>
                  <span className="truncate text-xs font-semibold text-[#92400E]">
                    {getHotelAddOnName(addOn)} x{hotelRoomCount}
                  </span>
                </div>
                <span className="shrink-0 text-xs font-bold text-[#92400E]">
                  {addOn.price > 0
                    ? formatPriceWithSign(addOnTotal, lang)
                    : labels.free}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t border-[#F1F5F9] px-4 py-3">
        <span className="text-xs text-[#64748b]">{labels.estimatedTotal}</span>
        <span className="text-sm font-semibold text-[#0f172a]">
          {formatPrice(hotelCost, lang)}
        </span>
      </div>

      {actions ? (
        <div className="border-t border-[#F1F5F9] px-4 py-3">{actions}</div>
      ) : null}
    </div>
  );
}
