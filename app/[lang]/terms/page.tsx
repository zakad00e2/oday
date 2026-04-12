import type { Metadata } from "next";
import PolicyDocumentView from "@/components/legal/PolicyDocumentView";
import { getLegalContent } from "@/lib/legal-content";
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
    title: isAr ? "الشروط والأحكام" : "Terms & Conditions",
    description: isAr
      ? "الشروط والأحكام الخاصة بخدمات Oday Tourism، تشمل قواعد الحجز، الإلغاء، والاستخدام."
      : "Terms and conditions for Oday Tourism services, including booking rules, cancellation, and usage policies.",
    path: "/terms",
    noIndex: false,
  });
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = (i18n.locales.includes(lang as Locale) ? lang : i18n.defaultLocale) as Locale;
  const legal = getLegalContent(locale);

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-28 pb-20">
      <div className="mx-auto max-w-5xl px-4 md:px-8">
        <PolicyDocumentView document={legal.terms} />
      </div>
    </main>
  );
}
