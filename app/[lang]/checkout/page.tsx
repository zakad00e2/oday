import type { Metadata } from "next";
import { i18n, isValidLocale, type Locale } from "@/lib/i18n/config";
import { buildPageMetadata } from "@/lib/seo";
import CheckoutPageClient from "@/components/checkout/CheckoutPageClient";

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
    title: isAr ? "إتمام الحجز" : "Checkout",
    description: isAr
      ? "أتمم حجزك مع Oday Tourism."
      : "Complete your booking with Oday Tourism.",
    path: "/checkout",
    noIndex: true,
  });
}

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}
