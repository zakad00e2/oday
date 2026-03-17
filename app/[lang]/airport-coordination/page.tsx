import AirportCoordination from "@/components/AirportCoordination";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    if (!isValidLocale(lang)) notFound();

    const dict = await getDictionary(lang as Locale);
    return {
        title: `${dict.nav.airportCoordination} | Oday Tourism`,
        description:
            lang === "ar"
                ? "احصل على تأشيرتك وموافقتك الأمنية بسهولة وسرعة — تأشيرة خلال 24 أو 72 ساعة مع خدمة شاملة وأسعار تنافسية."
                : "Get your visa and security approval quickly and easily — 24h or 72h processing with end‑to‑end follow-up.",
    };
}

export default function AirportCoordinationPage() {
    return (
        <main className="pt-20">
            <AirportCoordination />
        </main>
    );
}
