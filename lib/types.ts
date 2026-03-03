// ─── Package Builder Data Models ────────────────────────────────────────────

export interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  basePricePerNight: number;
  images: string[];
  features: string[];
  description: string;
}

export interface Trip {
  id: string;
  title: string;
  city: string;
  pricePerPerson: number;
  duration: string;
  images: string[];
  included: string[];
  description: string;
}

export type AddOnPricingModel = "fixed" | "perPerson" | "perNight";

export interface AddOn {
  id: string;
  name: string;
  type: "flight" | "transfer" | "insurance" | "other";
  pricingModel: AddOnPricingModel;
  price: number;
  description: string;
  icon: string; // emoji or icon identifier
}

export interface PromoCode {
  code: string;
  type: "percentage" | "fixed";
  value: number; // percentage (e.g., 10 for 10%) or fixed amount
}

export interface GuestInfo {
  adults: number;
  children: number;
}

export interface PricingBreakdown {
  hotelCost: number;
  tripsCost: number;
  addOnsCost: number;
  subtotal: number;
  discount: number;
  total: number;
  appliedPromo: PromoCode | null;
}

export interface PackageSelection {
  hotel: Hotel | null;
  trips: Trip[];
  addOns: AddOn[];
  numberOfNights: number;
  guests: GuestInfo;
  travelDate: string;
  promoCode: string;
}

export interface PackageOutput {
  packageId: string;
  hotelId: string;
  tripIds: string[];
  addOnIds: string[];
  nights: number;
  guests: GuestInfo;
  dates: string;
  pricingBreakdown: PricingBreakdown;
  total: number;
}
