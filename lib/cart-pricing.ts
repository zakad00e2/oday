import type {
  CartHotelAddOn,
  CartHotelRoomSelection,
} from "./cart-hotel";
import {
  getCartHotelAddOnsCost,
  getCartHotelBaseCost,
} from "./cart-hotel";

export interface CartPricingGuests {
  adults: number;
  children: number;
}

export interface CartPricingHotel {
  pricePerNight: number;
  roomsCount?: number;
  roomName?: string;
  roomNameAr?: string;
  roomNameEn?: string;
  selectedRooms?: CartHotelRoomSelection[];
  selectedAddOns?: CartHotelAddOn[];
}

export interface CartPricingTripSelection {
  price: number;
  persons?: number;
}

export interface CartPricingTrip {
  startingPrice: number;
  persons?: number;
  selectedOptions?: CartPricingTripSelection[];
  selectedAddOns?: CartPricingTripSelection[];
}

export function calculateGuestTotal(guests: CartPricingGuests): number {
  return guests.adults + guests.children;
}

export function calculateHotelLineCost(
  hotel: CartPricingHotel,
  nights: number,
): number {
  return getCartHotelBaseCost(hotel, nights) + getCartHotelAddOnsCost(hotel, nights);
}

export function calculateTripLineCost(
  trip: CartPricingTrip,
  guestsTotal: number,
): number {
  const persons = trip.persons ?? guestsTotal;
  const hasOptions = (trip.selectedOptions?.length ?? 0) > 0;
  const hasAddOns = (trip.selectedAddOns?.length ?? 0) > 0;

  if (hasOptions || hasAddOns) {
    const optionsTotal = (trip.selectedOptions ?? []).reduce(
      (sum, option) => sum + option.price * (option.persons ?? 1),
      0,
    );
    const addOnsTotal = (trip.selectedAddOns ?? []).reduce(
      (sum, addOn) => sum + addOn.price * (addOn.persons ?? persons),
      0,
    );

    return optionsTotal + addOnsTotal;
  }

  return trip.startingPrice > 0 ? trip.startingPrice * persons : 0;
}

export function calculateTripQuantity(
  trip: CartPricingTrip,
  guestsTotal: number,
): number {
  if (typeof trip.persons === "number" && trip.persons > 0) {
    return trip.persons;
  }

  if ((trip.selectedOptions?.length ?? 0) > 0) {
    return trip.selectedOptions!.reduce(
      (sum, option) => sum + (option.persons ?? 1),
      0,
    );
  }

  return guestsTotal;
}
