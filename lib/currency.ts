export type CurrencyLang = "ar" | "en";

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const CURRENCY_CODE = "EGP";

function formatAmount(value: number): string {
  return numberFormatter.format(value);
}

export function formatPrice(value: number, lang: CurrencyLang): string {
  void lang;
  const amount = formatAmount(value);
  return `${CURRENCY_CODE} ${amount}`;
}

export function formatPriceWithSign(value: number, lang: CurrencyLang): string {
  const sign = value < 0 ? "-" : "+";
  return `${sign}${formatPrice(Math.abs(value), lang)}`;
}

export function formatPriceCode(value: number): string {
  return `${CURRENCY_CODE} ${formatAmount(value)}`;
}
