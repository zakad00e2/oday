export const i18n = {
  defaultLocale: "ar" as const,
  locales: ["ar", "en"] as const,
};

export type Locale = (typeof i18n)["locales"][number];

export function isValidLocale(lang: string): lang is Locale {
  return i18n.locales.includes(lang as Locale);
}

export function getDirection(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getFontFamily(locale: Locale): string {
  return locale === "ar" ? "'Cairo', sans-serif" : "'Manrope', sans-serif";
}
