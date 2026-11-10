import Link from "next/link";
import { notFound } from "next/navigation";
import HotelRoomCalendar from "@/components/admin/HotelRoomCalendar";
import { getAvailabilityDemoHotel, hotelAvailabilityDemo } from "@/lib/hotel-availability-service";

export default async function DemoCalendarPage({ params }: { params: Promise<{ lang: string }> }) {
  if (!hotelAvailabilityDemo) notFound();
  const hotel = await getAvailabilityDemoHotel("demo-coast");
  if (!hotel) notFound();
  const { lang } = await params;
  return <main className="mx-auto min-h-screen max-w-4xl px-4 pb-12 pt-24">
    <div className="mb-4 rounded-xl bg-sky-50 p-4 text-sm text-slate-800">
      <p>{lang === "ar" ? "تقويم تجريبي. تحفظ التغييرات في هذا المتصفح فقط." : "Demo calendar. Changes are saved only in this browser."}</p>
      <Link className="mt-2 inline-block font-semibold text-sky-800 underline" href={"/" + lang + "/hotels"}>{lang === "ar" ? "العودة إلى بحث الفنادق" : "Back to hotel search"}</Link>
    </div>
    <div className="overflow-hidden rounded-2xl border border-slate-200"><HotelRoomCalendar hotelId={hotel.id} hotelName={hotel.nameAr}
      rooms={hotel.rooms.map(room => ({ id: room.id, name: room.nameAr }))} /></div>
  </main>;
}
