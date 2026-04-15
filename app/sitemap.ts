import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { listTrips } from "@/lib/trip-service";
import { listHotels } from "@/lib/hotel-service";

const locales = ["ar", "en"] as const;

const staticRoutes = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/hotels", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/trips", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/airport-coordination", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/airport-coordination/terms", priority: 0.3, changeFrequency: "yearly" as const },
  { path: "/airport-coordination/refund-policy", priority: 0.3, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static routes for all locales
  for (const route of staticRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${route.path}`,
        lastModified: now,
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: {
            ar: `${SITE_URL}/ar${route.path}`,
            en: `${SITE_URL}/en${route.path}`,
          },
        },
      });
    }
  }

  // Dynamic trip pages
  try {
    const { trips } = await listTrips({ limit: 200 });
    for (const trip of trips) {
      if (!trip.slug) continue;
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/trips/${trip.slug}`,
          lastModified: trip.updatedAt ? new Date(trip.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: {
              ar: `${SITE_URL}/ar/trips/${trip.slug}`,
              en: `${SITE_URL}/en/trips/${trip.slug}`,
            },
          },
        });
      }
    }
  } catch {
    // If the API is unavailable during build, skip dynamic trip entries
  }

  // Dynamic hotel pages
  try {
    const { hotels } = await listHotels({ limit: 200 });
    for (const hotel of hotels) {
      const slug = hotel.slugEn || hotel.slug;
      if (!slug) continue;
      for (const locale of locales) {
        entries.push({
          url: `${SITE_URL}/${locale}/hotels/${slug}`,
          lastModified: hotel.updatedAt ? new Date(hotel.updatedAt) : now,
          changeFrequency: "weekly",
          priority: 0.8,
          alternates: {
            languages: {
              ar: `${SITE_URL}/ar/hotels/${slug}`,
              en: `${SITE_URL}/en/hotels/${slug}`,
            },
          },
        });
      }
    }
  } catch {
    // If the API is unavailable during build, skip dynamic hotel entries
  }

  return entries;
}
