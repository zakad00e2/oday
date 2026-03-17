import type { Locale } from "./config";

/**
 * Prefix a path with the current locale.
 * localizedHref("/hotels", "en") → "/en/hotels"
 * localizedHref("/hotels", "ar") → "/ar/hotels"
 */
export function localizedHref(path: string, locale: Locale): string {
  // Ensure path starts with /
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`;
}

/**
 * Strip the locale prefix from a pathname.
 * stripLocale("/en/hotels") → "/hotels"
 * stripLocale("/ar")        → "/"
 */
export function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && (segments[0] === "ar" || segments[0] === "en")) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}
