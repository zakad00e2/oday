import type { Metadata } from "next";
import Hotels from "@/components/Hotels";
import HotelsHero from "@/components/HotelsHero";
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
      ? "الفنادق | أفضل فنادق شرم الشيخ والغردقة ومصر"
      : "Hotels | Best Hotels in Sharm El Sheikh, Hurghada & Egypt",
    description: isAr
      ? "اختر من بين أفضل الفنادق والمنتجعات في شرم الشيخ، الغردقة، دهب، والقاهرة. أسعار تنافسية وعروض حصرية مع Oday Tourism."
      : "Browse top-rated hotels and resorts in Sharm El Sheikh, Hurghada, Dahab, and Cairo. Competitive prices and exclusive deals with Oday Tourism.",
    path: "/hotels",
  });
}

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
