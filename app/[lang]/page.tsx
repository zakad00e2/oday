import type { Metadata } from "next";
import CTAHeroBanner from "@/components/CTAHeroBanner";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Packages from "@/components/Packages";
import PackagesGallery from "@/components/PackagesGallery";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
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
      ? "عدي للسياحة | فنادق ورحلات في شرم الشيخ ومصر"
      : "Oday Tourism | Hotels & Trips in Sharm El Sheikh, Egypt",
    description: isAr
      ? "احجز فندقك، استمتع برحلات بحرية وسفاري في شرم الشيخ، والغردقة، ومناطق مصر السياحية مع Oday Tourism. عروض حصرية وتجارب لا تُنسى."
      : "Book your hotel, enjoy boat trips, desert safaris, and water activities in Sharm El Sheikh and Egypt with Oday Tourism. Exclusive offers and unforgettable experiences.",
    path: "/",
  });
}

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const dict = await getDictionary(locale);

  return (
    <main>
      <Hero hero={dict.hero} lang={locale} />
      <PackagesGallery />
      <Packages packages={dict.packages} lang={locale} />
      <ShowcaseGallery />
      <HowItWorks howItWorks={dict.howItWorks} />
      <CTAHeroBanner cta={dict.cta} />
    </main>
  );
}
