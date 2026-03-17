import TripsHero from "@/components/trips/TripsHero";
import TripsGrid from "@/components/trips/TripsGrid";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLocale(lang)) notFound();

  const dict = await getDictionary(lang as Locale);
  return {
    title: `${dict.nav.trips} | Oday Tourism`,
    description:
      lang === "ar"
        ? "اكتشف أفضل الرحلات البحرية وأنشطة السفاري والمغامرات المائية في شرم الشيخ مع Oday Tourism."
        : "Discover boat trips, safari adventures, and water activities in Sharm El‑Sheikh with Oday Tourism.",
  };
}

export default function TripsPage() {
  return (
    <main>
      <TripsHero />
      <TripsGrid />
    </main>
  );
}
