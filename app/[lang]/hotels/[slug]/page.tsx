import type { Metadata } from "next";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { getHotelBySlug } from "@/lib/hotel-service";
import { buildPageMetadata, SITE_URL, SITE_NAME } from "@/lib/seo";
import HotelDetailClient from "@/components/hotels/HotelDetailClient";
import JsonLd from "@/components/JsonLd";

interface Props {
  params: Promise<{ lang: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  let hotel;
  try {
    hotel = await getHotelBySlug(slug);
  } catch {
    hotel = null;
  }

  if (!hotel) {
    return {
      title: isAr ? "فندق غير موجود" : "Hotel Not Found",
      robots: { index: false, follow: false },
    };
  }

  const name = isAr ? hotel.nameAr : (hotel.nameEn || hotel.nameAr);
  const city = isAr ? hotel.destinationLabelAr : hotel.destinationLabelEn;
  const description = isAr
    ? hotel.descriptionAr || `${name} في ${city} - احجز الآن مع Oday Tourism`
    : hotel.descriptionEn || `${name} in ${city} – Book now with Oday Tourism`;

  const title = isAr
    ? `${name} | فندق في ${city}`
    : `${name} | Hotel in ${city}`;

  const ogImage = hotel.mainImage || undefined;

  const meta = buildPageMetadata({
    lang: locale,
    title,
    description: description.slice(0, 160),
    path: `/hotels/${slug}`,
    ogImage,
    ogType: "article",
  });

  return {
    ...meta,
    alternates: {
      ...meta.alternates,
      languages: {
        ar: `${SITE_URL}/ar/hotels/${slug}`,
        en: `${SITE_URL}/en/hotels/${slug}`,
        "x-default": `${SITE_URL}/ar/hotels/${slug}`,
      },
    },
  };
}

export default async function HotelDetailPage({ params }: Props) {
  const { lang, slug } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  let hotel;
  try {
    hotel = await getHotelBySlug(slug);
  } catch {
    hotel = null;
  }

  const starsMap: Record<number, number> = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5 };

  const jsonLd = hotel
    ? {
        "@context": "https://schema.org",
        "@type": "Hotel",
        name: isAr ? hotel.nameAr : (hotel.nameEn || hotel.nameAr),
        description: isAr
          ? hotel.descriptionAr
          : (hotel.descriptionEn || hotel.descriptionAr),
        url: `${SITE_URL}/${locale}/hotels/${slug}`,
        image: hotel.mainImage || undefined,
        address: {
          "@type": "PostalAddress",
          addressLocality: isAr
            ? hotel.destinationLabelAr
            : hotel.destinationLabelEn,
          addressCountry: "EG",
        },
        starRating: hotel.stars > 0
          ? {
              "@type": "Rating",
              ratingValue: starsMap[hotel.stars] ?? hotel.stars,
            }
          : undefined,
        priceRange: hotel.initialPrice > 0 ? `$${hotel.initialPrice}+` : undefined,
        containsPlace: hotel.rooms.map((room) => ({
          "@type": "HotelRoom",
          name: isAr ? room.nameAr : (room.nameEn || room.nameAr),
          description: isAr
            ? room.descriptionAr
            : (room.descriptionEn || room.descriptionAr),
          offers: room.price > 0
            ? {
              "@type": "Offer",
              price: room.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            }
            : undefined,
        })),
        amenityFeature: hotel.facilitiesEn.map((f) => ({
          "@type": "LocationFeatureSpecification",
          name: f,
          value: true,
        })),
        brand: {
          "@type": "Brand",
          name: SITE_NAME,
        },
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
        name: isAr ? "الفنادق" : "Hotels",
        item: `${SITE_URL}/${locale}/hotels`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: hotel
          ? (isAr ? hotel.nameAr : (hotel.nameEn || hotel.nameAr))
          : slug,
        item: `${SITE_URL}/${locale}/hotels/${slug}`,
      },
    ],
  };

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <JsonLd data={breadcrumbJsonLd} />
      <HotelDetailClient />
    </>
  );
}
