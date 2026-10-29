import type { CartState } from "./cart-context";
import { resolveVisitorPrice, type PricePair, type PricingCurrency } from "./visitor-pricing";

function activePrice(value: number, prices: PricePair | undefined, currency: PricingCurrency | null) {
  return prices
    ? resolveVisitorPrice(prices.USD, prices.EGP, currency)
    : resolveVisitorPrice(value, null, currency);
}

export function resolveCartPrices(cart: CartState, currency: PricingCurrency | null): CartState {
  return {
    ...cart,
    hotel: cart.hotel ? {
      ...cart.hotel,
      pricePerNight: activePrice(cart.hotel.pricePerNight, cart.hotel.prices, currency),
      selectedRooms: cart.hotel.selectedRooms?.map(room => ({
        ...room, pricePerNight: activePrice(room.pricePerNight, room.prices, currency),
      })),
      selectedAddOns: cart.hotel.selectedAddOns?.map(addOn => ({
        ...addOn, price: activePrice(addOn.price, addOn.prices, currency),
      })),
    } : null,
    trips: cart.trips.map(trip => ({
      ...trip,
      startingPrice: activePrice(trip.startingPrice, trip.prices, currency),
      selectedOptions: trip.selectedOptions?.map(option => ({
        ...option, price: activePrice(option.price, option.prices, currency),
      })),
      selectedAddOns: trip.selectedAddOns?.map(addOn => ({
        ...addOn, price: activePrice(addOn.price, addOn.prices, currency),
      })),
    })),
  };
}
