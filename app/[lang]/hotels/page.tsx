import Hotels from "@/components/Hotels";
import HotelsHero from "@/components/HotelsHero";

export const metadata = {
  title: "الفنادق | Oday Tourism",
  description: "أفخم الفنادق بأفضل الأسعار مع عروض حصرية لأجمل الوجهات السياحية المصرية.",
};

export default function HotelsPage() {
  return (
    <main>
      <HotelsHero />
      <div id="hotels">
        <Hotels />
      </div>
    </main>
  );
}
