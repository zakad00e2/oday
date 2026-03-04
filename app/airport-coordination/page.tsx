import AirportCoordination from "@/components/AirportCoordination";

export const metadata = {
    title: "حجز تنسيقات المطار | Oday Tourism",
    description:
        "احجز تنسيقات المطار بسهولة — تأشيرة خلال 24 أو 72 ساعة مع خدمة شاملة وأسعار تنافسية.",
};

export default function AirportCoordinationPage() {
    return (
        <main className="pt-20">
            <AirportCoordination />
        </main>
    );
}
