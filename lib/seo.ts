import type { Metadata } from "next";
import type { Locale } from "./i18n/config";

export const SITE_URL = "https://odaytourism.com";
export const SITE_NAME = "Oday Tourism";
export const DEFAULT_OG_IMAGE = "/newlogo.PNG";

export const SITE_TITLE_AR = "عدي للسياحة | Oday Tourism";
export const SITE_TITLE_EN = "Oday Tourism | Travel Agency in Egypt";

export const SITE_DESCRIPTION_AR =
  "حجوزات فنادق، رحلات بحرية، وسفاري في شرم الشيخ ومصر - Oday Tourism شريكك للسفر المثالي";
export const SITE_DESCRIPTION_EN =
  "Hotel bookings, boat trips, safari adventures, and custom travel packages in Sharm El Sheikh and Egypt – Oday Tourism.";

export const WHATSAPP_URL = "https://wa.me/201032549630";

/** Build a full canonical URL for a given locale + path */
export function buildCanonical(lang: Locale, path: string): string {
  const normalised = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}/${lang}${normalised}`;
}

/**
 * Build hreflang alternates for a given path (without locale prefix).
 * e.g. buildAlternates("/trips") → { canonical: "…/ar/trips", languages: { ar, en, x-default } }
 */
export function buildAlternates(lang: Locale, path: string) {
  const normalised = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return {
    canonical: `${SITE_URL}/${lang}${normalised}`,
    languages: {
      ar: `${SITE_URL}/ar${normalised}`,
      en: `${SITE_URL}/en${normalised}`,
      "x-default": `${SITE_URL}/ar${normalised}`,
    },
  };
}

interface PageMetadataOptions {
  lang: Locale;
  title: string;
  description: string;
  /** Path without locale prefix, e.g. "/trips" or "/" */
  path: string;
  ogImage?: string;
  noIndex?: boolean;
  ogType?: "website" | "article";
}

/** Build a complete, per-page Metadata object with OG, Twitter, hreflang, and canonical. */
export function buildPageMetadata({
  lang,
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  noIndex = false,
  ogType = "website",
}: PageMetadataOptions): Metadata {
  const alternates = buildAlternates(lang, path);
  const ogLocale = lang === "ar" ? "ar_EG" : "en_US";
  const ogAlternateLocale = lang === "ar" ? "en_US" : "ar_EG";

  return {
    title,
    description,
    alternates,
    ...(noIndex && { robots: { index: false, follow: false } }),
    openGraph: {
      title,
      description,
      url: alternates.canonical,
      siteName: SITE_NAME,
      locale: ogLocale,
      alternateLocale: [ogAlternateLocale],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: ogType,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
