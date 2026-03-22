"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CartHotel {
  id: number;
  slug: string;
  name: string;
  nameAr?: string;
  nameEn?: string;
  city: string;
  cityAr?: string;
  cityEn?: string;
  image: string;
  pricePerNight: number;
  stars: number;
  roomsCount?: number;
  roomName?: string;
  roomNameAr?: string;
  roomNameEn?: string;
  selectedAddOns?: { name: string; nameAr?: string; nameEn?: string; price: number }[];
}

export interface CartTrip {
  slug: string;
  titleAr: string;
  titleEn?: string;
  heroImage: string;
  startingPrice: number; // per person, 0 = TBD
  persons?: number;      // number of persons selected
  selectedOptions?: { nameAr: string; nameEn?: string; price: number; persons?: number }[];
  selectedAddOns?: { nameAr: string; nameEn?: string; price: number; persons?: number }[];
}

export interface CartGuests {
  adults: number;
  children: number;
}

export interface CartState {
  hotel: CartHotel | null;
  trips: CartTrip[];
  guests: CartGuests;
  nights: number;
  travelDate: string;
}

interface CartContextValue {
  cart: CartState;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  setHotel: (hotel: CartHotel | null) => void;
  addTrip: (trip: CartTrip) => void;
  removeTrip: (slug: string) => void;
  setGuests: (g: CartGuests) => void;
  setNights: (n: number) => void;
  setTravelDate: (d: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

// ─── Defaults ───────────────────────────────────────────────────────────────

const defaultCart: CartState = {
  hotel: null,
  trips: [],
  guests: { adults: 2, children: 0 },
  nights: 3,
  travelDate: "",
};

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  // Always start with defaultCart so server and client render identically (avoids hydration mismatch)
  const [cart, setCart] = useState<CartState>(defaultCart);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oday-cart");
      if (saved) {
        const parsed = JSON.parse(saved) as CartState;
        // Drop hotel if missing slug (old data format)
        if (parsed.hotel && !parsed.hotel.slug) {
          parsed.hotel = null;
        }
        setCart(parsed);
      }
    } catch {
      // ignore
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Persist to localStorage on every cart change (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem("oday-cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, isInitialized]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const setHotel = useCallback((hotel: CartHotel | null) => {
    setCart((prev) => ({ ...prev, hotel }));
  }, []);

  const addTrip = useCallback((trip: CartTrip) => {
    setCart((prev) => ({
      ...prev,
      trips: prev.trips.find((t) => t.slug === trip.slug)
        ? prev.trips.map((t) => (t.slug === trip.slug ? trip : t))
        : [...prev.trips, trip],
    }));
  }, []);

  const removeTrip = useCallback((slug: string) => {
    setCart((prev) => ({
      ...prev,
      trips: prev.trips.filter((t) => t.slug !== slug),
    }));
  }, []);

  const setGuests = useCallback((guests: CartGuests) => {
    setCart((prev) => ({
      ...prev,
      guests: {
        adults: Math.max(1, guests.adults),
        children: Math.max(0, guests.children),
      },
    }));
  }, []);

  const setNights = useCallback((nights: number) => {
    setCart((prev) => ({ ...prev, nights: Math.max(1, nights) }));
  }, []);

  const setTravelDate = useCallback((travelDate: string) => {
    setCart((prev) => ({ ...prev, travelDate }));
  }, []);

  const clearCart = useCallback(() => {
    setCart(defaultCart);
    try {
      localStorage.removeItem("oday-cart");
    } catch {
      // ignore
    }
  }, []);

  const guestsTotal = cart.guests.adults + cart.guests.children;
  const hotelBaseCost = cart.hotel ? cart.hotel.pricePerNight * cart.nights * (cart.hotel.roomsCount || 1) : 0;
  const hotelAddOnsCost = cart.hotel?.selectedAddOns ? cart.hotel.selectedAddOns.reduce((s, a) => s + a.price, 0) * cart.nights * (cart.hotel.roomsCount || 1) : 0;
  const hotelCost = hotelBaseCost + hotelAddOnsCost;

  const tripsCost = cart.trips.reduce((sum, t) => {
    const persons = t.persons ?? guestsTotal;
    const hasOptions = t.selectedOptions && t.selectedOptions.length > 0;
    const hasAddOns = t.selectedAddOns && t.selectedAddOns.length > 0;

    if (hasOptions || hasAddOns) {
      const optPrice = (t.selectedOptions || []).reduce((s, o) => s + o.price * (o.persons ?? 1), 0);
      const addOnsPrice = (t.selectedAddOns || []).reduce((s, a) => s + a.price * (a.persons ?? persons), 0);
      return sum + optPrice + addOnsPrice;
    }

    return sum + (t.startingPrice > 0 ? t.startingPrice * persons : 0);
  }, 0);
  const totalPrice = hotelCost + tripsCost;
  const totalItems = (cart.hotel ? 1 : 0) + cart.trips.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        openCart,
        closeCart,
        setHotel,
        addTrip,
        removeTrip,
        setGuests,
        setNights,
        setTravelDate,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
