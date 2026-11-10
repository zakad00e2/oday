"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { MapPin, Search } from "lucide-react";
import FlexibleImage from "@/components/FlexibleImage";
import Hotels from "@/components/Hotels";
import { HOTEL_DESTINATION_OPTIONS } from "@/lib/hotel-service";
import { listDestinations } from "@/lib/destination-service";
import { getDestinationLabels } from "@/lib/destinations";
import { searchHotelStays, hotelAvailabilityDemo } from "@/lib/hotel-availability-service";
import { addStayDays, cairoToday, readStayQuery, stayIssue, stayMoney, stayQuery, type StayCriteria } from "@/lib/hotel-stay";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { useVisitorPricing } from "@/lib/visitor-pricing-context";
import StayFields, { stayIssueMessage } from "./StayFields";

const defaultDestinations = HOTEL_DESTINATION_OPTIONS.map(d => String(d.value));
const action = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-2 text-sm font-bold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700";

function SearchForm({ initial, destination, today, submit }: {
  initial: StayCriteria; destination: string; today: string; submit: (destination: string, stay: StayCriteria) => void;
}) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [stay, setStay] = useState(initial);
  const [selected, setSelected] = useState(destination);
  const [catalog, setCatalog] = useState<string[]>(defaultDestinations);
  const [error, setError] = useState("");
  useEffect(() => {
    if (hotelAvailabilityDemo) return;
    const controller = new AbortController();
    listDestinations({ type: "hotels", signal: controller.signal })
      .then(records => { if (!controller.signal.aborted) setCatalog(records.map(record => record.destination)); })
      .catch(() => { /* Keep the site's known destination codes when the catalog is unreachable. */ });
    return () => controller.abort();
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const issue = stayIssue(stay, today);
    if (!selected || issue) {
      setError(!selected ? (ar ? "اختر وجهة أولًا." : "Choose a destination first.") : stayIssueMessage(issue!, ar));
      return;
    }
    setError("");
    submit(selected, stay);
  };

  return (
    <form className="relative z-20 rounded-2xl border border-sky-100 bg-[#f4faff] p-3 shadow-sm sm:p-4" onSubmit={handleSubmit}>
      <div className="grid items-stretch gap-2.5 lg:grid-cols-[1fr_1.55fr_0.85fr_auto]">
        <label className="grid min-w-0 content-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2">
          <span className="flex items-center gap-1 text-xs font-medium text-slate-600"><MapPin size={14} aria-hidden />{ar ? "الوجهة" : "Destination"}</span>
          <select required className="min-h-8 w-full min-w-0 rounded-md bg-white text-base font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            value={selected} onChange={event => setSelected(event.target.value)}>
            <option value="">{ar ? "إلى أين تريد الذهاب؟" : "Where are you going?"}</option>
            {[...new Set([...(selected ? [selected] : []), ...catalog])].map(code => (
              <option key={code} value={code}>{getDestinationLabels(code)[lang]}</option>
            ))}
          </select>
        </label>
        <StayFields stay={stay} setStay={setStay} today={today} ar={ar} />
        <button className={action} type="submit"><Search size={18} aria-hidden />{ar ? "بحث" : "Search"}</button>
      </div>
      {error && <p className="mt-2 px-1 text-sm font-medium text-red-700" role="alert">{error}</p>}
    </form>
  );
}

function SearchResults({ destination, stay, page, goPage }: {
  destination: string; stay: StayCriteria; page: number; goPage: (page: number) => void;
}) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const { category, formatPrice } = useVisitorPricing();
  const [attempt, setAttempt] = useState(0);
  const key = [category, attempt].join(":");
  const [response, setResponse] = useState<{ key: string; data?: Awaited<ReturnType<typeof searchHotelStays>> }>();
  useEffect(() => {
    if (!category) return;
    const controller = new AbortController();
    searchHotelStays(destination, stay, category, page, controller.signal)
      .then(data => { if (!controller.signal.aborted) setResponse({ key, data }); })
      .catch(() => { if (!controller.signal.aborted) setResponse({ key }); });
    return () => controller.abort();
  }, [destination, stay, page, category, key]);

  const result = response?.key === key ? response : undefined;
  const data = result?.data;
  const date = (value: string) => new Intl.DateTimeFormat(ar ? "ar-EG" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(value + "T00:00:00Z"));
  return (
    <section id="hotels" aria-labelledby="available-hotels-heading" className="scroll-mt-28 pb-16 pt-8">
      <h2 id="available-hotels-heading" className="text-2xl font-bold text-slate-950">{ar ? "الفنادق المتاحة" : "Available hotels"} · {getDestinationLabels(destination)[lang]}</h2>
      <p className="mt-2 text-sm text-slate-600">
        {date(stay.check_in)} – {date(stay.check_out)} · {ar ? "الضيوف: " : "Guests: "}{stay.adults + stay.children}
      </p>
      {!category ? <p className="mt-7 text-slate-600" role="status">{ar ? "اختر فئة التسعير لعرض الفنادق المتاحة." : "Choose your pricing category to see available hotels."}</p>
        : !result ? <p className="mt-7 text-slate-600" role="status">{ar ? "جاري التحقق من التوافر…" : "Checking availability…"}</p>
        : !data ? <div className="mt-6 rounded-2xl border border-red-200 p-5" role="alert">
            <p>{ar ? "تعذّر التحقق من التوافر الآن." : "Availability could not be checked."}</p>
            <button className={action + " mt-3"} type="button" onClick={() => setAttempt(n => n + 1)}>{ar ? "إعادة المحاولة" : "Try again"}</button>
          </div>
        : data.items.length === 0 ? <p className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5" role="status">
            {data.meta.total > 0 ? (ar ? "لا توجد نتائج في هذه الصفحة." : "There are no results on this page.") :
              (ar ? "لا توجد غرف تناسب المجموعة طوال التواريخ المختارة. جرّب تواريخ أو وجهة أخرى." : "No rooms fit your group for every night. Try other dates or another destination.")}
          </p>
        : <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {data.items.map(({ hotel, offer }) => {
              const slug = lang === "ar" ? hotel.slugAr || hotel.slug : hotel.slugEn || hotel.slug;
              const title = lang === "ar" ? hotel.nameAr || hotel.nameEn : hotel.nameEn || hotel.nameAr;
              return <article key={hotel.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                {hotel.mainImage && <div className="relative aspect-[2/1] bg-slate-100"><FlexibleImage src={hotel.mainImage} fill sizes="(max-width: 767px) 100vw, 45vw" className="object-cover" alt="" /></div>}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{ar ? "الليالي: " : "Nights: "}{offer.nights} · {ar ? "الغرف: " : "Rooms: "}{offer.rooms.reduce((sum, room) => sum + room.quantity, 0)}</p>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-slate-600">{ar ? "إجمالي الإقامة" : "Stay total"}</p>
                      <p className="font-bold text-slate-950">{formatPrice(stayMoney(offer.total), lang)}</p>
                    </div>
                    <Link className={action} href={"/" + lang + "/hotels/" + encodeURIComponent(slug) + "?" + stayQuery(stay).toString() + "#booking"}>
                      {ar ? "عرض الغرف" : "View rooms"}
                    </Link>
                  </div>
                </div>
              </article>;
            })}
          </div>}
      {data && (page > 1 || page < data.meta.totalPages) && <nav aria-label={ar ? "صفحات النتائج" : "Results pages"} className="mt-6 flex flex-wrap gap-3">
        {page > 1 && <button className={action} type="button" onClick={() => goPage(page - 1)}>{ar ? "السابق" : "Previous"}</button>}
        {page < data.meta.totalPages && <button className={action} type="button" onClick={() => goPage(page + 1)}>{ar ? "التالي" : "Next"}</button>}
      </nav>}
    </section>
  );
}

export default function HotelDiscovery() {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const { category } = useVisitorPricing();
  const query = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [today] = useState(cairoToday);
  const raw = query.toString();
  const rawStay = readStayQuery(query);
  const destination = query.get("destination") ?? "";
  const valid = Boolean(destination && !stayIssue(rawStay, today));
  const malformed = !valid && (query.has("destination") || query.has("check_in") || query.has("check_out"));
  const pageValue = Number(query.get("page") ?? 1);
  const page = Number.isSafeInteger(pageValue) && pageValue > 0 ? pageValue : 1;
  const searchTop = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(0);

  function apply(nextDestination: string, nextStay: StayCriteria, nextPage = 1) {
    const params = stayQuery(nextStay);
    params.set("destination", nextDestination);
    if (nextPage > 1) params.set("page", String(nextPage));
    router.push(pathname + "?" + params.toString(), { scroll: false });
    setSubmitted(n => n + 1);
    searchTop.current?.scrollIntoView({ block: "start" });
  }
  return (
    <>
      <div ref={searchTop} id="hotel-search" className="mx-auto w-full max-w-[1320px] scroll-mt-24 px-4 md:px-8">
        <h2 className="mb-3 text-xl font-bold text-slate-900">{ar ? "ابحث عن إقامتك" : "Find your stay"}</h2>
        {hotelAvailabilityDemo && <p className="mb-3 text-sm text-slate-600">
          {ar ? "نسخة تجريبية · اختر شرم الشيخ لتجربة البحث. " : "Demo · Choose Sharm El Sheikh to try a stay. "}
          <Link className="font-semibold text-sky-800 underline" href={"/" + lang + "/hotel-calendar-demo"}>{ar ? "تقويم التجربة" : "Demo calendar"}</Link>
        </p>}
        <SearchForm key={raw} today={today} destination={destination} submit={apply}
          initial={valid ? rawStay : { check_in: today, check_out: addStayDays(today, 1), adults: 2, children: 0 }} />
        {(valid || malformed) && <button className="mt-3 min-h-10 rounded-lg px-2 text-sm font-semibold text-sky-800 underline" type="button"
          onClick={() => router.push(pathname, { scroll: false })}>{ar ? "مسح البحث وعرض الوجهات" : "Clear search and browse destinations"}</button>}
        {malformed && <p className="text-sm text-red-700" role="alert">{ar ? "معايير البحث في الرابط غير صالحة." : "The search in this link is no longer valid."}</p>}
        {valid && <SearchResults key={[raw, submitted, category].join(":")} destination={destination} stay={rawStay} page={page} goPage={n => apply(destination, rawStay, n)} />}
      </div>
      {!valid && !hotelAvailabilityDemo && <Hotels />}
      {!valid && hotelAvailabilityDemo && <div className="pb-16" />}
    </>
  );
}
