"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  Hotel,
  Trip,
  AddOn,
  GuestInfo,
  PackageSelection,
  PricingBreakdown,
  PackageOutput,
} from "./types";
import {
  calculatePricingBreakdown,
  generatePackageId,
} from "./pricing";

// ─── Context Types ──────────────────────────────────────────────────────────

interface PackageContextValue {
  // Current step (1–4)
  step: number;
  setStep: (step: number) => void;
  goNext: () => void;
  goPrev: () => void;
  canProceed: boolean;

  // Selections
  selection: PackageSelection;
  setHotel: (hotel: Hotel | null) => void;
  toggleTrip: (trip: Trip) => void;
  toggleAddOn: (addOn: AddOn) => void;
  setNumberOfNights: (n: number) => void;
  setGuests: (g: GuestInfo) => void;
  setTravelDate: (d: string) => void;
  setPromoCode: (c: string) => void;

  // Pricing
  pricing: PricingBreakdown;

  // Actions
  savePackage: () => void;
  generateOutput: () => PackageOutput;
  resetPackage: () => void;
  isSaved: boolean;
}

const defaultSelection: PackageSelection = {
  hotel: null,
  trips: [],
  addOns: [],
  numberOfNights: 3,
  guests: { adults: 2, children: 0 },
  travelDate: "",
  promoCode: "",
};

const PackageContext = createContext<PackageContextValue | null>(null);

// ─── Provider ───────────────────────────────────────────────────────────────

export function PackageProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState<PackageSelection>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("oday-package");
        if (saved) return JSON.parse(saved) as PackageSelection;
      } catch {
        // ignore
      }
    }
    return defaultSelection;
  });
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return sessionStorage.getItem("oday-package") !== null;
      } catch {
        return false;
      }
    }
    return false;
  });

  // Pricing (recalculated on every selection change)
  const pricing = calculatePricingBreakdown(selection);

  // Can proceed validation
  const canProceed = (() => {
    switch (step) {
      case 1:
        return (
          selection.hotel !== null &&
          selection.numberOfNights >= 1 &&
          selection.guests.adults >= 1
        );
      case 2:
        return true; // trips are optional
      case 3:
        return true; // add-ons are optional
      case 4:
        return selection.hotel !== null;
      default:
        return false;
    }
  })();

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, 4));
  }, []);

  const goPrev = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const setHotel = useCallback((hotel: Hotel | null) => {
    setSelection((prev) => ({ ...prev, hotel }));
    setIsSaved(false);
  }, []);

  const toggleTrip = useCallback((trip: Trip) => {
    setSelection((prev) => {
      const exists = prev.trips.find((t) => t.id === trip.id);
      return {
        ...prev,
        trips: exists
          ? prev.trips.filter((t) => t.id !== trip.id)
          : [...prev.trips, trip],
      };
    });
    setIsSaved(false);
  }, []);

  const toggleAddOn = useCallback((addOn: AddOn) => {
    setSelection((prev) => {
      const exists = prev.addOns.find((a) => a.id === addOn.id);
      return {
        ...prev,
        addOns: exists
          ? prev.addOns.filter((a) => a.id !== addOn.id)
          : [...prev.addOns, addOn],
      };
    });
    setIsSaved(false);
  }, []);

  const setNumberOfNights = useCallback((n: number) => {
    setSelection((prev) => ({ ...prev, numberOfNights: Math.max(1, n) }));
    setIsSaved(false);
  }, []);

  const setGuests = useCallback((g: GuestInfo) => {
    setSelection((prev) => ({
      ...prev,
      guests: { adults: Math.max(1, g.adults), children: Math.max(0, g.children) },
    }));
    setIsSaved(false);
  }, []);

  const setTravelDate = useCallback((d: string) => {
    setSelection((prev) => ({ ...prev, travelDate: d }));
    setIsSaved(false);
  }, []);

  const setPromoCode = useCallback((c: string) => {
    setSelection((prev) => ({ ...prev, promoCode: c }));
    setIsSaved(false);
  }, []);

  const savePackage = useCallback(() => {
    try {
      sessionStorage.setItem("oday-package", JSON.stringify(selection));
      setIsSaved(true);
    } catch {
      // ignore
    }
  }, [selection]);

  const generateOutput = useCallback((): PackageOutput => {
    return {
      packageId: generatePackageId(),
      hotelId: selection.hotel?.id ?? "",
      tripIds: selection.trips.map((t) => t.id),
      addOnIds: selection.addOns.map((a) => a.id),
      nights: selection.numberOfNights,
      guests: selection.guests,
      dates: selection.travelDate,
      pricingBreakdown: pricing,
      total: pricing.total,
    };
  }, [selection, pricing]);

  const resetPackage = useCallback(() => {
    setSelection(defaultSelection);
    setStep(1);
    setIsSaved(false);
    try {
      sessionStorage.removeItem("oday-package");
    } catch {
      // ignore
    }
  }, []);

  return (
    <PackageContext.Provider
      value={{
        step,
        setStep,
        goNext,
        goPrev,
        canProceed,
        selection,
        setHotel,
        toggleTrip,
        toggleAddOn,
        setNumberOfNights,
        setGuests,
        setTravelDate,
        setPromoCode,
        pricing,
        savePackage,
        generateOutput,
        resetPackage,
        isSaved,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function usePackage() {
  const ctx = useContext(PackageContext);
  if (!ctx) {
    throw new Error("usePackage must be used within a PackageProvider");
  }
  return ctx;
}
