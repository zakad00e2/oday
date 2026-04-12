import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { getTripBySlug } from "@/lib/trip-service";
import { buildPageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import TripDetailClient from "@/components/trips/TripDetailClient";
import JsonLd from "@/components/JsonLd";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  let trip;
  try {
    trip = await getTripBySlug(slug);
  } catch {
    trip = null;
  }

  if (!trip) {
    return {
      title: isAr ? "رحلة غير موجودة" : "Trip Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = isAr ? trip.titleAr : (trip.titleEn || trip.titleAr);
  const description = isAr
    ? trip.descriptionAr || `${title} - رحلة مع Oday Tourism في شرم الشيخ`
    : trip.descriptionEn || `${title} – A trip with Oday Tourism in Sharm El Sheikh`;

  const ogImage = trip.heroImage || undefined;

  const meta = buildPageMetadata({
    lang: locale,
    title,
    description: description.slice(0, 160),
    path: `/trips/${slug}`,
    ogImage,
    ogType: "article",
  });

  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: {
        ar: `${SITE_URL}/ar/trips/${slug}`,
        en: `${SITE_URL}/en/trips/${slug}`,
        "x-default": `${SITE_URL}/ar/trips/${slug}`,
      },
    },
  };
}

export default async function TripDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  let trip;
  try {
    trip = await getTripBySlug(slug);
  } catch {
    trip = null;
  }

  const jsonLd = trip
    ? {
        "@context": "https://schema.org",
        "@type": "TouristTrip",
        name: isAr ? trip.titleAr : (trip.titleEn || trip.titleAr),
        description: isAr
          ? trip.descriptionAr
          : (trip.descriptionEn || trip.descriptionAr),
        url: `${SITE_URL}/${locale}/trips/${slug}`,
        image: trip.heroImage || undefined,
        provider: {
          "@type": "TravelAgency",
          name: SITE_NAME,
          url: SITE_URL,
        },
        ...(trip.startingPrice > 0 && {
          offers: {
            "@type": "Offer",
            price: trip.startingPrice,
            priceCurrency: "EGP",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/${locale}/trips/${slug}`,
          },
        }),
        touristType: isAr ? "سياح" : "Tourists",
      }
    : null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: isAr ? "الرئيسية" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isAr ? "الرحلات" : "Trips",
        item: `${SITE_URL}/${locale}/trips`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: trip ? (isAr ? trip.titleAr : (trip.titleEn || trip.titleAr)) : slug,
        item: `${SITE_URL}/${locale}/trips/${slug}`,
      },
    ],
  };

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <TripDetailClient />
    </>
  );
}
