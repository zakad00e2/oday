import TripsHero from "@/components/trips/TripsHero";
import TripsGrid from "@/components/trips/TripsGrid";

export const metadata = {
  title: "الرحلات | Oday Tourism",
  description: "اكتشف أفضل الرحلات البحرية وأنشطة السفاري والمغامرات المائية في شرم الشيخ مع Oday Tourism.",
};

export default function TripsPage() {
  return (
    <main>
      <TripsHero />
      <TripsGrid />
    </main>
  );
}
