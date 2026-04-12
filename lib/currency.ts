export type CurrencyLang = "ar" | "en";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatAmount(value: number): string {
  return numberFormatter.format(value);
}

export function formatPrice(value: number, lang: CurrencyLang): string {
  const amount = formatAmount(value);
  return lang === "ar" ? `${amount} ج.م` : `EGP ${amount}`;
}

export function formatPriceWithSign(value: number, lang: CurrencyLang): string {
  const sign = value < 0 ? "-" : "+";
  return `${sign}${formatPrice(Math.abs(value), lang)}`;
}

export function formatPriceCode(value: number): string {
  return `EGP ${formatAmount(value)}`;
}
