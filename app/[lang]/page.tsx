import CTAHeroBanner from "@/components/CTAHeroBanner";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Packages from "@/components/Packages";
import PackagesGallery from "@/components/PackagesGallery";
import ShowcaseGallery from "@/components/ShowcaseGallery";
import { i18n, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";

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
