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
  name: string;
  city: string;
  image: string;
  pricePerNight: number;
  stars: number;
}

export interface CartTrip {
  slug: string;
  titleAr: string;
  heroImage: string;
  startingPrice: number; // per person, 0 = TBD
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

  // Load from localStorage after hydration
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oday-cart");
      if (saved) {
        const parsed = JSON.parse(saved) as CartState;
        setCart(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  // Persist to localStorage on every cart change
  useEffect(() => {
    try {
      localStorage.setItem("oday-cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const setHotel = useCallback((hotel: CartHotel | null) => {
    setCart((prev) => ({ ...prev, hotel }));
  }, []);

  const addTrip = useCallback((trip: CartTrip) => {
    setCart((prev) => ({
      ...prev,
      trips: prev.trips.find((t) => t.slug === trip.slug)
        ? prev.trips
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
  const hotelCost = cart.hotel ? cart.hotel.pricePerNight * cart.nights : 0;
  const tripsCost = cart.trips.reduce(
    (sum, t) => sum + (t.startingPrice > 0 ? t.startingPrice * guestsTotal : 0),
    0
  );
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
