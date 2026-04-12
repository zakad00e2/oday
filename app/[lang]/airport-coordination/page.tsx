import type { Metadata } from "next";
import AirportCoordination from "@/components/AirportCoordination";
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
            ? "التنسيق الأمني والتأشيرات | Oday Tourism"
            : "Security Coordination & Visas | Oday Tourism",
        description: isAr
            ? "احصل على تأشيرتك وموافقتك الأمنية لمصر بسهولة وسرعة — معالجة خلال 24 أو 72 ساعة مع متابعة شاملة وأسعار تنافسية."
            : "Get your Egypt visa and security approval quickly — 24h or 72h processing with complete end-to-end support and competitive pricing.",
        path: "/airport-coordination",
    });
}

export default function AirportCoordinationPage() {
    return (
        <main className="pt-20">
            <AirportCoordination />
        </main>
    );
}
