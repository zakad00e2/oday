import type { Metadata } from "next";
import TripsHero from "@/components/trips/TripsHero";
import TripsGrid from "@/components/trips/TripsGrid";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = (isValidLocale(lang) ? lang : i18n.defaultLocale) as Locale;
  const isAr = locale === "ar";

  return buildPageMetadata({
    lang: locale,
    title: isAr
      ? "الرحلات | رحلات بحرية وسفاري وأنشطة في شرم الشيخ"
      : "Trips | Boat Trips, Safari & Activities in Sharm El Sheikh",
    description: isAr
      ? "اكتشف أفضل الرحلات البحرية، سفاري الصحراء، والأنشطة المائية في شرم الشيخ مع Oday Tourism. احجز رحلتك الآن بأسعار تنافسية."
      : "Explore the best boat trips, desert safaris, and water activities in Sharm El Sheikh with Oday Tourism. Book your adventure now at competitive prices.",
    path: "/trips",
  });
}

export default function TripsPage() {
  return (
    <main>
      <TripsHero />
      <TripsGrid />
    </main>
  );
}
