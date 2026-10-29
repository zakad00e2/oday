import type { PricingCurrency } from "./visitor-pricing";
export type CurrencyLang = "ar" | "en";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 2,
});

function formatAmount(value: number): string {
  return numberFormatter.format(value);
}

export function formatPrice(value: number, lang: CurrencyLang, currency: PricingCurrency = "USD"): string {
  if (!Number.isFinite(value)) return lang === "ar" ? "السعر عند الطلب" : "Price on request";
  const amount = formatAmount(value);
  return currency === "EGP" ? (lang === "ar" ? `${amount} ج.م` : `EGP ${amount}`) : `$${amount}`;
}

export function formatPriceWithSign(value: number, lang: CurrencyLang, currency: PricingCurrency = "USD"): string {
  if (!Number.isFinite(value)) return formatPrice(value, lang, currency);
  const sign = value < 0 ? "-" : "+";
  return `${sign}${formatPrice(Math.abs(value), lang, currency)}`;
}

export function formatPriceCode(value: number): string {
  return `$${formatAmount(value)}`;
}
