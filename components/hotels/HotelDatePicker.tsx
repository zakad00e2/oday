"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { getHotelStayCalendar } from "@/lib/hotel-availability-service";
import { addStayDays, stayMoney, stayNights, STAY_HORIZON, STAY_NIGHT_LIMIT, type StayCalendarPrice, type StayCriteria } from "@/lib/hotel-stay";
import { useVisitorPricing } from "@/lib/visitor-pricing-context";

function monthStart(date: string, offset = 0) {
  const [year, month] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + offset, 1)).toISOString().slice(0, 10);
}

const asDate = (date: string) => new Date(date + "T00:00:00Z");

export type HotelDatePickerProps = {
  hotelId: string;
  basePrice: number;
  stay: StayCriteria;
  setStay: (stay: StayCriteria) => void;
  today: string;
  ar: boolean;
};

export default function HotelDatePicker({ hotelId, basePrice, stay, setStay, today, ar }: HotelDatePickerProps) {
  const { category, currency } = useVisitorPricing();
  const container = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [month, setMonth] = useState(() => monthStart(stay.check_in || today));
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [editingEnd, setEditingEnd] = useState(false);
  const [result, setResult] = useState<{ key: string; days?: StayCalendarPrice[] }>();
  const horizon = addStayDays(today, STAY_HORIZON);
  const following = monthStart(month, 1);
  const from = month < today ? today : month;
  const monthLimit = monthStart(month, 2);
  const to = monthLimit < horizon ? monthLimit : horizon;
  const { adults, children } = stay;
  const key = JSON.stringify([hotelId, from, to, adults, children, category]);
  const response = result?.key === key ? result : undefined;
  const prices = new Map(response?.days?.map(day => [day.date, day]));
  const lang = ar ? "ar-EG" : "en-GB";
  const shortDate = new Intl.DateTimeFormat(lang, { day: "numeric", month: "short", timeZone: "UTC", numberingSystem: "latn" });
  const longDate = new Intl.DateTimeFormat(lang, { dateStyle: "full", timeZone: "UTC", numberingSystem: "latn" });
  const monthLabel = new Intl.DateTimeFormat(lang, { month: "long", year: "numeric", timeZone: "UTC", numberingSystem: "latn" });
  const weekday = new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: "UTC" });
  const priceLabel = new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 });
  const dayLabel = new Intl.NumberFormat("en-US");
  const summary = (date: string) => date ? shortDate.format(asDate(date)) : "—";
  const hasBasePrice = Number.isFinite(basePrice) && basePrice > 0;

  useEffect(() => {
    if (!visible || !category || from >= to) return;
    const controller = new AbortController();
    getHotelStayCalendar(hotelId, from, to, { adults, children }, category, controller.signal)
      .then(days => { if (!controller.signal.aborted) setResult({ key, days }); })
      .catch(() => { if (!controller.signal.aborted) setResult({ key }); });
    return () => controller.abort();
  }, [visible, hotelId, category, from, to, adults, children, key]);

  useEffect(() => {
    if (!visible) return;
    function handlePointer(event: PointerEvent) {
      if (!container.current?.contains(event.target as Node)) setVisible(false);
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setVisible(false);
        trigger.current?.focus();
      }
    }
    document.addEventListener("pointerdown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [visible]);

  function open() {
    setStart(stay.check_in);
    setEnd(stay.check_out);
    setEditingEnd(false);
    setMonth(monthStart(stay.check_in || today));
    setResult(undefined);
    setVisible(current => !current);
  }

  function choose(date: string) {
    if (editingEnd && start && date > start) {
      setEnd(date);
      setEditingEnd(false);
    } else {
      setStart(date);
      setEnd("");
      setEditingEnd(true);
    }
  }

  function hasClosedNight(checkIn: string, checkOut: string) {
    for (let night = checkIn; night < checkOut; night = addStayDays(night, 1)) {
      if (prices.get(night)?.available === false) return true;
    }
    return false;
  }

  function dayDisabled(date: string) {
    if (date < today || date > horizon) return true;
    if (editingEnd && start && date > start) {
      if (stayNights(start, date) > STAY_NIGHT_LIMIT) return true;
      return hasClosedNight(start, date);
    }
    return date === horizon || prices.get(date)?.available === false;
  }

  function renderMonth(first: string) {
    const days = stayNights(first, monthStart(first, 1));
    const weekdays = Array.from({ length: 7 }, (_, index) => weekday.format(asDate(addStayDays("2026-01-04", index))));
    return (
      <section key={first} aria-label={monthLabel.format(asDate(first))} className="min-w-0">
        <h3 className="mb-4 text-center text-base font-bold text-slate-950">{monthLabel.format(asDate(first))}</h3>
        <div className="grid grid-cols-7">
          {weekdays.map((label, i) => <span key={i} className="pb-2 text-center text-[10px] text-slate-600 sm:text-xs">{label}</span>)}
          {Array.from({ length: asDate(first).getUTCDay() }, (_, i) => <span key={"empty-" + i} aria-hidden />)}
          {Array.from({ length: days }, (_, i) => {
            const date = addStayDays(first, i);
            const day = prices.get(date);
            const price = date < today || date >= horizon
              ? NaN
              : day
                ? day.available ? stayMoney(day.total) : basePrice
                : basePrice;
            const priced = Number.isFinite(price) && price > 0;
            const selected = date === start || date === end;
            const inside = Boolean(start && end && date > start && date < end);
            const note = day?.available === false
              ? (ar ? "غير متاح" : "Unavailable") + (priced ? " · " + (ar ? "السعر الأساسي " : "Base price ") + priceLabel.format(price) + " " + currency : "")
              : priced ? priceLabel.format(price) + " " + currency
              : day?.available ? (ar ? "عند الطلب" : "On request")
              : day ? (ar ? "غير متاح" : "Unavailable") : "";
            return <button key={date} type="button" disabled={dayDisabled(date)} aria-pressed={selected}
              aria-label={[longDate.format(asDate(date)), note].filter(Boolean).join(", ")}
              className={"flex min-h-12 min-w-0 flex-col items-center justify-center rounded-md border border-transparent px-px py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-800 " +
                (selected ? "bg-sky-700 font-bold text-white disabled:opacity-60" :
                  inside ? "bg-sky-50 text-sky-950" : "text-slate-900 enabled:hover:border-sky-300 enabled:hover:bg-sky-50 disabled:text-slate-500")}
              onClick={() => choose(date)}>
              <span className={"text-sm " + (date === today && !selected ? "font-bold text-sky-700" : "font-semibold")}>{dayLabel.format(i + 1)}</span>
              <span className={"block w-full break-all text-[9px] leading-3 sm:text-[10px] " + (selected ? "text-white" : "text-slate-600")} aria-hidden>
                {priced ? priceLabel.format(price) : "—"}
              </span>
            </button>;
          })}
        </div>
      </section>
    );
  }

  const nights = stayNights(start, end);
  const canApply = Boolean(start && end && nights > 0 && nights <= STAY_NIGHT_LIMIT && !hasClosedNight(start, end));
  return <div ref={container} className="relative min-w-0">
    <button type="button" ref={trigger} onClick={open} aria-haspopup="dialog" aria-expanded={visible} aria-controls="hotel-date-calendar"
      className="grid min-h-[67px] w-full min-w-0 grid-cols-2 items-center rounded-xl border border-slate-200 bg-white p-2.5 text-start focus-visible:ring-2 focus-visible:ring-sky-600">
      <span className="min-w-0 px-1">
        <span className="flex items-center gap-1 text-xs text-slate-600"><CalendarDays size={14} aria-hidden />{ar ? "الوصول" : "Check-in"}</span>
        <span className="block truncate text-sm font-semibold text-slate-900">{summary(stay.check_in)}</span>
      </span>
      <span className="min-w-0 border-s border-slate-200 ps-2">
        <span className="block text-xs text-slate-600">{ar ? "المغادرة" : "Checkout"}</span>
        <span className="block truncate text-sm font-semibold text-slate-900">{summary(stay.check_out)}</span>
      </span>
    </button>
    {visible && <div id="hotel-date-calendar" role="dialog" dir={ar ? "rtl" : "ltr"} aria-labelledby="hotel-calendar-title"
      className="absolute start-0 top-full z-50 mt-2 max-h-[min(75dvh,650px)] w-[min(760px,calc(100vw-3rem))] max-w-[calc(100vw-3rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl sm:p-5 lg:max-h-none lg:overflow-visible">
        <header className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 id="hotel-calendar-title" className="text-lg font-bold text-slate-950">{ar ? "تواريخ الإقامة" : "Stay dates"}</h2>
            <p className="text-sm text-slate-600" aria-live="polite">{editingEnd ? (ar ? "اختر تاريخ المغادرة" : "Choose your checkout date") : (ar ? "اختر تاريخ الوصول" : "Choose your check-in date")}</p>
          </div>
          <button type="button" onClick={() => { setVisible(false); trigger.current?.focus(); }} aria-label={ar ? "إغلاق التقويم" : "Close calendar"}
            className="grid size-10 shrink-0 place-items-center rounded-lg text-slate-700 hover:bg-slate-100"><X size={19} aria-hidden /></button>
        </header>
        <div className="mb-3 flex items-center justify-between">
          <button type="button" aria-label={ar ? "الشهر السابق" : "Previous month"} disabled={month <= monthStart(today)}
            onClick={() => setMonth(monthStart(month, -1))}
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-900 enabled:hover:bg-slate-50 disabled:opacity-40">
            {ar ? <ChevronRight size={19} aria-hidden /> : <ChevronLeft size={19} aria-hidden />}
          </button>
          <button type="button" aria-label={ar ? "الشهر التالي" : "Next month"} disabled={following >= horizon}
            onClick={() => setMonth(following)}
            className="grid size-10 place-items-center rounded-full border border-slate-200 text-slate-900 enabled:hover:bg-slate-50 disabled:opacity-40">
            {ar ? <ChevronLeft size={19} aria-hidden /> : <ChevronRight size={19} aria-hidden />}
          </button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {renderMonth(month)}
          {following <= horizon && renderMonth(following)}
        </div>
        <div className="mt-4 border-t border-slate-200 pt-3">
          <p role="status" className="text-sm text-slate-700">
            {!category ? (ar ? "اختر فئة التسعير لعرض الأسعار." : "Choose your pricing category to see rates.")
              : !response?.days && hasBasePrice ? (ar
                ? "السعر الأساسي للفندق لليلة · " + currency + " · تحقّق من التوافر لمعرفة السعر النهائي."
                : "Hotel base rate per night · " + currency + " · Check availability for the final price.")
              : !response ? (ar ? "جاري تحميل أسعار الليالي…" : "Loading nightly rates…")
              : !response.days ? (ar ? "اختر التواريخ للتحقق من السعر." : "Select dates to check the price.")
              : (ar ? "الأسعار لكل ليلة للمجموعة المحددة. الأيام الرمادية غير متاحة ويظهر فيها السعر الأساسي للفندق · " : "Prices are per night for your group. Grey dates are unavailable and show the hotel base rate · ") + currency}
          </p>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900" aria-live="polite">{summary(start)} – {summary(end)}
              {canApply && (ar ? " · الليالي: " : " · Nights: ") + dayLabel.format(nights)}</p>
            <button type="button" disabled={!canApply}
              onClick={() => { setStay({ ...stay, check_in: start, check_out: end }); setVisible(false); trigger.current?.focus(); }}
              className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white enabled:hover:bg-sky-800 disabled:bg-slate-200 disabled:text-slate-700">
              {ar ? "تأكيد التواريخ" : "Apply dates"}
            </button>
          </div>
        </div>
    </div>}
  </div>;
}
