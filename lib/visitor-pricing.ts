export type VisitorCategory = "egyptian-resident" | "other";
export type PricingCurrency = "EGP" | "USD";
export type PricePair = { USD: number | null; EGP: number | null };

export const VISITOR_CATEGORY_KEY = "oday-visitor-category-v1";

export function parseVisitorCategory(value: unknown): VisitorCategory | null {
  return value === "egyptian-resident" || value === "other" ? value : null;
}

export function getVisitorCurrency(value: unknown): PricingCurrency | null {
  const category = parseVisitorCategory(value);
  return category === "egyptian-resident" ? "EGP" : category === "other" ? "USD" : null;
}

export function parsePrice(value: unknown): number | null {
  if (typeof value !== "number" && typeof value !== "string") return null;
  if (typeof value === "string" && !/^\d+(?:\.\d+)?$/.test(value.trim())) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

export function pricePair(usd: unknown, egp: unknown): PricePair {
  return { USD: parsePrice(usd), EGP: parsePrice(egp) };
}

export function samePricePair(left: PricePair | undefined, right: PricePair | undefined) {
  return parsePrice(left?.USD) === parsePrice(right?.USD)
    && parsePrice(left?.EGP) === parsePrice(right?.EGP);
}

export function isValidPriceInput(value: unknown): boolean {
  const price = parsePrice(value);
  return price !== null && Math.abs(price * 100 - Math.round(price * 100)) < 0.000001;
}

export function getPriceDiscount(current: number, original: number): number | null {
  return Number.isFinite(current) && Number.isFinite(original) && current > 0 && original > current
    ? Math.round((1 - current / original) * 1000) / 10
    : null;
}

type PricedEntry = { nameAr: string; price: number; priceEgp?: number | null };

export function hasRetainedEgpPrices(expected: PricedEntry[], actual: PricedEntry[]): boolean {
  const unmatched = [...actual];
  return expected.every(entry => {
    const egp = parsePrice(entry.priceEgp);
    if (egp === null) return false;
    const index = unmatched.findIndex(saved => saved.nameAr.trim() === entry.nameAr.trim()
      && parsePrice(saved.price) === parsePrice(entry.price)
      && parsePrice(saved.priceEgp) === egp);
    if (index < 0) return false;
    unmatched.splice(index, 1);
    return true;
  });
}

// NaN deliberately propagates unavailable prices through arithmetic instead of
// turning an incomplete booking into a misleading partial or free total.
export function resolveVisitorPrice(
  usd: unknown,
  egp: unknown,
  currency: PricingCurrency | null,
): number {
  return (currency ? pricePair(usd, egp)[currency] : null) ?? Number.NaN;
}

export function visitorCategoryLabel(category: VisitorCategory | null, lang: "ar" | "en") {
  if (category === "egyptian-resident") return lang === "ar" ? "مصري أو حامل إقامة مصرية سارية" : "Egyptian or valid Egyptian residency holder";
  if (category === "other") return lang === "ar" ? "الجنسيات الأخرى" : "Other nationalities";
  return lang === "ar" ? "لم تُحدد فئة الزائر" : "Visitor category not selected";
}
