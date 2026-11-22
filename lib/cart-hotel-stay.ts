import type { CartHotel } from "./cart-context";
import { getCartHotelAddOnCount, type CartHotelAddOn, type CartHotelRoomSelection } from "./cart-hotel";
import { stayMoney, stayNights, stayQuery, type StayQuote } from "./hotel-stay";

type QuotedHotel = { stayQuote?: StayQuote; stayQuoteCurrent?: boolean; requiresStayQuote?: boolean };

export function hasDatedHotelPrice(hotel?: QuotedHotel | null) {
  return Boolean(hotel?.stayQuote || hotel?.requiresStayQuote);
}

export function getCartStayTotal(hotel: QuotedHotel) {
  return hotel.stayQuoteCurrent === false ? NaN : stayMoney(hotel.stayQuote?.total ?? null);
}

export function getCartHotelNights(hotel: CartHotel | null, fallback: number) {
  if (hotel && hasDatedHotelPrice(hotel)) {
    const nights = stayNights(hotel.checkIn ?? "", hotel.checkOut ?? "");
    return nights > 0 ? nights : 0;
  }
  return fallback;
}

export function getCartHotelRoomPrice(hotel: QuotedHotel | null, room: CartHotelRoomSelection) {
  if (!hasDatedHotelPrice(hotel)) return room.pricePerNight;
  return hotel?.stayQuoteCurrent === false ? NaN :
    stayMoney(hotel?.stayQuote?.rooms.find(line => line.room_id === room.id)?.subtotal ?? null);
}

export function getCartHotelUpgradeTotal(hotel: QuotedHotel | null, addon: CartHotelAddOn, nights: number, rooms: number) {
  if (!hasDatedHotelPrice(hotel)) return addon.price * nights * getCartHotelAddOnCount(addon, rooms);
  return hotel?.stayQuoteCurrent === false ? NaN :
    stayMoney(hotel?.stayQuote?.addons.find(line => line.addon_id === addon.id)?.subtotal ?? null);
}

export function cartHotelEditHref(hotel: CartHotel, lang: "ar" | "en") {
  const slug = (lang === "ar" ? hotel.slugAr : hotel.slugEn) || hotel.slug;
  const guests = hotel.stayGuests ?? hotel.stayQuote ?? { adults: 2, children: 0 };
  const query = hasDatedHotelPrice(hotel)
    ? "?" + stayQuery({ ...guests, check_in: hotel.checkIn ?? "", check_out: hotel.checkOut ?? "" }).toString()
    : "";
  return "/" + lang + "/hotels/" + encodeURIComponent(slug) + query + "#booking";
}
