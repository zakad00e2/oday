import {
  PackageSelection,
  PricingBreakdown,
  AddOn,
  PromoCode,
  GuestInfo,
} from "./types";
import { promoCodes } from "./data";

// ─── Calculate total guests ─────────────────────────────────────────────────

export function totalGuests(guests: GuestInfo): number {
  return guests.adults + guests.children;
}

// ─── Hotel cost ─────────────────────────────────────────────────────────────

export function calculateHotelCost(
  basePricePerNight: number,
  numberOfNights: number,
  guests: GuestInfo
): number {
  // Pricing: basePricePerNight is per room. We assume 1 room per 2 guests (ceil).
  const numRooms = Math.ceil(totalGuests(guests) / 2);
  return basePricePerNight * numberOfNights * Math.max(numRooms, 1);
}

// ─── Trips cost ─────────────────────────────────────────────────────────────

export function calculateTripsCost(
  trips: { pricePerPerson: number }[],
  guests: GuestInfo
): number {
  const guestCount = totalGuests(guests);
  return trips.reduce((sum, trip) => sum + trip.pricePerPerson * guestCount, 0);
}

// ─── Add-on cost ────────────────────────────────────────────────────────────

export function calculateAddOnCost(
  addOn: AddOn,
  guests: GuestInfo,
  numberOfNights: number
): number {
  switch (addOn.pricingModel) {
    case "fixed":
      return addOn.price;
    case "perPerson":
      return addOn.price * totalGuests(guests);
    case "perNight":
      return addOn.price * numberOfNights;
    default:
      return addOn.price;
  }
}

export function calculateAddOnsCost(
  addOns: AddOn[],
  guests: GuestInfo,
  numberOfNights: number
): number {
  return addOns.reduce(
    (sum, addOn) => sum + calculateAddOnCost(addOn, guests, numberOfNights),
    0
  );
}

// ─── Promo code lookup ──────────────────────────────────────────────────────

export function findPromoCode(code: string): PromoCode | null {
  if (!code.trim()) return null;
  return (
    promoCodes.find(
      (p) => p.code.toLowerCase() === code.trim().toLowerCase()
    ) ?? null
  );
}

// ─── Discount ───────────────────────────────────────────────────────────────

export function calculateDiscount(
  subtotal: number,
  promo: PromoCode | null
): number {
  if (!promo) return 0;
  if (promo.type === "percentage") {
    return Math.round(subtotal * (promo.value / 100));
  }
  return Math.min(promo.value, subtotal); // fixed discount can't exceed subtotal
}

// ─── Full pricing breakdown ─────────────────────────────────────────────────

export function calculatePricingBreakdown(
  selection: PackageSelection
): PricingBreakdown {
  const hotelCost = selection.hotel
    ? calculateHotelCost(
        selection.hotel.basePricePerNight,
        selection.numberOfNights,
        selection.guests
      )
    : 0;

  const tripsCost = calculateTripsCost(selection.trips, selection.guests);
  const addOnsCost = calculateAddOnsCost(
    selection.addOns,
    selection.guests,
    selection.numberOfNights
  );

  const subtotal = hotelCost + tripsCost + addOnsCost;
  const appliedPromo = findPromoCode(selection.promoCode);
  const discount = calculateDiscount(subtotal, appliedPromo);
  const total = subtotal - discount;

  return {
    hotelCost,
    tripsCost,
    addOnsCost,
    subtotal,
    discount,
    total: Math.max(total, 0),
    appliedPromo,
  };
}

// ─── Format currency ────────────────────────────────────────────────────────

export function formatPrice(amount: number): string {
  return "$" + (amount ?? 0).toLocaleString("en-US");
}

// ─── Generate package ID ────────────────────────────────────────────────────

export function generatePackageId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `PKG-${timestamp}-${random}`.toUpperCase();
}
