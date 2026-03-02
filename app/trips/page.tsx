import Packages from "@/components/Packages";
import LocalTrips from "@/components/LocalTrips";

export const metadata = {
  title: "الرحلات | Adi Tourism",
  description: "اكتشف أفضل باقات السفر والرحلات الداخلية لأجمل المناطق السياحية في مصر.",
};

export default function TripsPage() {
  return (
    <main className="pt-20">
      <Packages />
      <LocalTrips />
    </main>
  );
}
