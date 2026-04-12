import type { Metadata } from "next";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";
import AboutPageClient from "@/components/about/AboutPageClient";

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
      ? "من نحن | Oday Tourism - شركة سياحة في شرم الشيخ"
      : "About Us | Oday Tourism - Travel Company in Sharm El Sheikh",
    description: isAr
      ? "تعرف على Oday Tourism، شركة سياحية مرخصة في مصر متخصصة في رحلات شرم الشيخ. نقدم حجوزات فنادق، رحلات بحرية، سفاري، وتجارب سفر متكاملة منذ أكثر من 10 سنوات."
      : "Learn about Oday Tourism, a licensed Egyptian travel company specializing in Sharm El Sheikh. We offer hotel bookings, boat trips, desert safaris, and complete travel packages with over 10 years of experience.",
    path: "/about",
  });
}

export default function AboutPage() {
  return <AboutPageClient />;
}
