import AirportCoordination from "@/components/AirportCoordination";

export const metadata = {
    title: "خدمات التأشيرات والموافقات الأمنية | Oday Tourism",
    description:
        "احصل على تأشيرتك وموافقتك الأمنية بسهولة وسرعة — تأشيرة خلال 24 أو 72 ساعة مع خدمة شاملة وأسعار تنافسية.",
};

export default function AirportCoordinationPage() {
    return (
        <main className="pt-20">
            <AirportCoordination />
        </main>
    );
}
