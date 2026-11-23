"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { BedDouble, CalendarCheck, Sparkles } from "lucide-react";
import type { HotelRecord } from "@/lib/hotel-service";
import { formatHotelRoomCapacity } from "@/lib/hotel-room-capacity";
import { useCart } from "@/lib/cart-context";
import { limitHotelAddOnCounts } from "@/lib/cart-hotel";
import { quoteHotelStay, hotelAvailabilityDemo } from "@/lib/hotel-availability-service";
import { addStayDays, cairoToday, exactStayRequest, HotelAvailabilityError, missingChildAges, readStayQuery, stayIssue,
  stayMoney, type StayCriteria, type StayQuote } from "@/lib/hotel-stay";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { useVisitorPricing } from "@/lib/visitor-pricing-context";
import StayFields, { stayIssueMessage } from "./StayFields";
import HotelDatePicker from "./HotelDatePicker";
import HotelOptionDescription from "./HotelOptionDescription";

const button = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-2 font-semibold text-white hover:bg-sky-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-600";

function useQuote({ hotelId, criteria, category, selection, attempt }: {
  hotelId: string; criteria: StayCriteria; category: NonNullable<ReturnType<typeof useVisitorPricing>["category"]>;
  selection?: Parameters<typeof quoteHotelStay>[3]; attempt: number;
}) {
  const key = JSON.stringify([hotelId, criteria, category, selection, attempt]);
  const [response, setResponse] = useState<{ key: string; quote?: StayQuote; unavailable?: boolean }>();
  useEffect(() => {
    const controller = new AbortController();
    quoteHotelStay(hotelId, criteria, category, selection, controller.signal).then(quote => {
      if (!controller.signal.aborted) setResponse({ key, quote });
    }).catch(error => {
      if (!controller.signal.aborted) setResponse({ key, unavailable: error instanceof HotelAvailabilityError && error.code === "STAY_UNAVAILABLE" });
    });
    return () => controller.abort();
  }, [hotelId, criteria, category, selection, key]);
  return response?.key === key ? response : undefined;
}

function QuoteError({ unavailable, ar, retry }: { unavailable?: boolean; ar: boolean; retry: () => void }) {
  return <div role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-900">
    <p>{unavailable
      ? (ar ? "الغرف المختارة غير متاحة طوال الإقامة. جرّب تعديل الغرف أو التواريخ." : "These rooms are not available for the full stay. Try different rooms or dates.")
      : (ar ? "تعذّر التحقق من الإقامة الآن." : "The stay could not be checked right now.")}</p>
    <button className="mt-2 min-h-9 font-semibold text-sky-900 underline" type="button" onClick={retry}>
      {ar ? "إعادة التحقق" : "Check again"}
    </button>
  </div>;
}

type BookingProps = { hotel: HotelRecord; criteria: StayCriteria; category: NonNullable<ReturnType<typeof useVisitorPricing>["category"]> };

function BookingOptions({ hotel, criteria, category }: BookingProps) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const [attempt, setAttempt] = useState(0);
  const result = useQuote({ hotelId: hotel.id, criteria, category, attempt });
  if (!result) return <p className="mt-5 text-slate-600" role="status">{ar ? "جاري التحقق من التوافر…" : "Checking room availability…"}</p>;
  if (!result.quote) return <QuoteError ar={ar} unavailable={result.unavailable} retry={() => setAttempt(n => n + 1)} />;
  return <RoomSelection key={attempt} hotel={hotel} criteria={criteria} category={category} initial={result.quote}
    reload={() => setAttempt(n => n + 1)} />;
}

function ExactQuote({ hotel, criteria, category, selection, reload }: BookingProps & {
  selection: NonNullable<Parameters<typeof quoteHotelStay>[3]>; reload: () => void;
}) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const { formatPrice } = useVisitorPricing();
  const { setHotel, openCart, setNights } = useCart();
  const response = useQuote({ hotelId: hotel.id, criteria, category, selection, attempt: 0 });
  if (!response) return <p className="mt-5 text-slate-600" role="status">{ar ? "جاري تحديث السعر…" : "Updating the stay price…"}</p>;
  if (!response.quote) return <QuoteError ar={ar} unavailable={response.unavailable} retry={reload} />;
  const quote = response.quote;
  const roomName = (id: string) => {
    const room = hotel.rooms.find(r => r.id === id);
    return room ? (ar ? room.nameAr || room.nameEn : room.nameEn || room.nameAr) : id;
  };

  function addToPlan() {
    const name = ar ? hotel.nameAr || hotel.nameEn : hotel.nameEn || hotel.nameAr;
    setHotel({
      id: hotel.id, slug: hotel.slug, slugAr: hotel.slugAr, slugEn: hotel.slugEn, name, nameAr: hotel.nameAr, nameEn: hotel.nameEn,
      city: ar ? hotel.destinationLabelAr : hotel.destinationLabelEn, cityAr: hotel.destinationLabelAr,
      cityEn: hotel.destinationLabelEn, image: hotel.mainImage, stars: hotel.stars,
      pricePerNight: 0, checkIn: quote.check_in, checkOut: quote.check_out, demoStay: hotelAvailabilityDemo,
      stayGuests: { adults: quote.adults, children: quote.children, ...(criteria.child_ages ? { child_ages: criteria.child_ages } : {}) }, stayQuote: quote,
      roomsCount: quote.rooms.reduce((sum, room) => sum + room.quantity, 0),
      selectedRooms: quote.rooms.map(room => {
        const catalog = hotel.rooms.find(r => r.id === room.room_id);
        return { id: room.room_id, count: room.quantity, name: roomName(room.room_id), nameAr: catalog?.nameAr,
          nameEn: catalog?.nameEn, pricePerNight: 0 };
      }),
      selectedAddOns: quote.addons.map(addon => {
        const catalog = hotel.addons.find(a => a.id === addon.addon_id);
        return { id: addon.addon_id, count: addon.quantity, price: 0, nameAr: catalog?.nameAr, nameEn: catalog?.nameEn,
          name: catalog ? (ar ? catalog.nameAr || catalog.nameEn : catalog.nameEn || catalog.nameAr) : addon.addon_id };
      }),
    });
    if (!hotelAvailabilityDemo) window.tatheer?.("add_to_cart", {
      ...(quote.total === null ? {} : { value: stayMoney(quote.total) }), currency: quote.currency, content_type: "hotel", content_id: hotel.id,
    });
    setNights(quote.nights);
    openCart();
  }

  return <div className="mt-6 rounded-2xl bg-slate-50 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p className="text-sm text-slate-600">{ar ? "إجمالي الإقامة · الليالي: " : "Stay total · Nights: "}{quote.nights}</p>
        <p className="text-2xl font-bold text-slate-950" aria-live="polite">{formatPrice(stayMoney(quote.total), lang)}</p>
      </div>
      <button type="button" className={button} onClick={addToPlan}>{ar ? "أضف لبرنامجك" : "Add to your plan"}</button>
    </div>
    <details className="mt-3 border-t border-slate-200 pt-2">
      <summary className="min-h-9 cursor-pointer py-1 text-sm font-semibold text-sky-900">{ar ? "تفاصيل السعر لكل ليلة" : "Nightly price breakdown"}</summary>
      <div className="mt-2 grid gap-4 text-sm text-slate-700">
        {quote.rooms.map(room => <div key={room.room_id}>
          <p className="font-semibold">{roomName(room.room_id)} × {room.quantity}</p>
          <ul className="mt-1 space-y-1">
            {room.nightly_rates.map(night => <li key={night.date} className="flex justify-between gap-2">
              <time dateTime={night.date} dir="ltr">{night.date}</time><span>{formatPrice(stayMoney(night.unit_rate), lang)}</span>
            </li>)}
          </ul>
        </div>)}
        {quote.addons.length > 0 && <p>{ar ? "إجمالي الترقيات: " : "Upgrades total: "}{formatPrice(stayMoney(quote.addons_total), lang)}</p>}
      </div>
    </details>
  </div>;
}

function RoomSelection({ hotel, criteria, category, initial, reload }: BookingProps & { initial: StayQuote; reload: () => void }) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const { formatPrice, resolvePrice } = useVisitorPricing();
  const { cart } = useCart();
  const guests = criteria.adults + criteria.children;
  const allowedRooms = initial.available_room_types.filter(r => hotel.rooms.some(room => room.id === r.room_id && !room.idIsSynthetic));
  const availableAddons = hotel.addons.filter(addon => !addon.idIsSynthetic);
  const [restored] = useState(() => {
    if (cart.hotel?.id !== hotel.id) return null;
    const saved = exactStayRequest(cart.hotel);
    if (!saved || saved.check_in !== criteria.check_in || saved.check_out !== criteria.check_out ||
        saved.adults !== criteria.adults || saved.children !== criteria.children ||
        JSON.stringify(saved.child_ages ?? []) !== JSON.stringify(criteria.child_ages ?? [])) return null;
    return saved;
  });
  const [roomCounts, setRoomCounts] = useState<Record<string, number>>(() => Object.fromEntries(
    (restored?.rooms ?? initial.rooms).filter(room => allowedRooms.some(r => r.room_id === room.room_id && room.quantity <= r.max_quantity))
      .map(room => [room.room_id, room.quantity]),
  ));
  const [addonCounts, setAddonCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries((restored?.addons ?? []).filter(addon => availableAddons.some(a => a.id === addon.addon_id))
      .map(addon => [addon.addon_id, addon.quantity])));
  const count = Object.values(roomCounts).reduce((sum, n) => sum + n, 0);
  const upgrades = Object.values(addonCounts).reduce((sum, n) => sum + n, 0);
  const capacity = allowedRooms.reduce((sum, room) => sum + room.capacity * (roomCounts[room.room_id] ?? 0), 0);
  const selection = useMemo(() => ({
    rooms: Object.entries(roomCounts).filter(([, quantity]) => quantity > 0).map(([room_id, quantity]) => ({ room_id, quantity })),
    addons: Object.entries(addonCounts).filter(([, quantity]) => quantity > 0).map(([addon_id, quantity]) => ({ addon_id, quantity })),
  }), [roomCounts, addonCounts]);

  return <div className="mt-6">
    <h3 className="flex items-center gap-2 font-bold text-slate-950"><BedDouble size={19} aria-hidden />{ar ? "أنواع الغرف المتاحة" : "Available room types"}</h3>
    <div className="mt-3 flex flex-col gap-3">
      {allowedRooms.map(room => {
        const record = hotel.rooms.find(r => r.id === room.room_id)!;
        const name = ar ? record.nameAr || record.nameEn : record.nameEn || record.nameAr;
        const description = ar ? record.descriptionAr || record.descriptionEn : record.descriptionEn || record.descriptionAr;
        const capacityLabel = formatHotelRoomCapacity({ ...record, capacity: room.capacity }, ar);
        const current = roomCounts[room.room_id] ?? 0;
        const max = Math.min(room.max_quantity, guests - count + current);
        const selected = current > 0;
        const setCount = (value: number) => {
          setRoomCounts(previous => ({ ...previous, [room.room_id]: value }));
          setAddonCounts(previous => limitHotelAddOnCounts(previous, count - current + value));
        };
        return <div key={room.room_id} role="group" aria-label={name} className={`relative rounded-2xl border-2 p-5 text-start transition-all ${selected ? "border-[#0EA5E9] bg-[#0EA5E9]/5" : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0EA5E9]/40"}`}>
          <button type="button" aria-label={name} aria-pressed={selected} disabled={!selected && max < 1}
            onClick={() => setCount(selected ? 0 : 1)}
            className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] disabled:cursor-not-allowed" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-2.5">
              <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-[#cbd5e1] bg-white"}`}>
                {selected ? <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg> : <span className="h-2 w-2 rounded-full bg-[#cbd5e1]" />}
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold leading-tight text-[#0f172a]">{name}</span>
                {description && <HotelOptionDescription description={description} ar={ar} />}
                {capacityLabel && <p className="mt-1 text-xs leading-relaxed text-slate-700">{capacityLabel}</p>}
              </div>
            </div>
            <span className={`shrink-0 text-end font-semibold ${selected ? "text-[#0EA5E9]" : "text-[#0f172a]"}`}>{formatPrice(stayMoney(room.unit_stay_total), lang)}</span>
          </div>
          <div className={`mt-3 flex items-center justify-between border-t pt-3 ${selected ? "border-[#0EA5E9]/20" : "border-[#e2e8f0]"}`}>
            <span className="text-xs font-medium text-[#64748b]">{ar ? "عدد الغرف" : "Rooms"}</span>
            <div className="relative z-20 flex items-center gap-2">
              <button type="button" aria-label={ar ? `تقليل عدد غرف ${name}` : `Decrease rooms for ${name}`} disabled={!selected} onClick={() => setCount(current - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-base font-bold leading-none text-[#0EA5E9] hover:bg-[#0EA5E9]/20 disabled:cursor-not-allowed disabled:opacity-40">−</button>
              <span className="w-5 text-center text-sm font-bold text-[#0f172a]" aria-live="polite">{current}</span>
              <button type="button" aria-label={ar ? `زيادة عدد غرف ${name}` : `Increase rooms for ${name}`} disabled={current >= max} onClick={() => setCount(current + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-base font-bold leading-none text-[#0EA5E9] hover:bg-[#0EA5E9]/20 disabled:cursor-not-allowed disabled:opacity-40">+</button>
            </div>
          </div>
        </div>;
      })}
    </div>
    {allowedRooms.length === 0 && <QuoteError ar={ar} retry={reload} />}
    {availableAddons.length > 0 && count > 0 && <fieldset className="mt-5">
      <legend className="font-bold text-slate-950"><span className="inline-flex items-center gap-2"><Sparkles size={19} aria-hidden />{ar ? "ترقيات الغرف (اختياري)" : "Room upgrades (optional)"}</span></legend>
      <p className="mt-2 text-xs leading-relaxed text-[#64748b]" aria-live="polite">
        {ar ? `حدد عدد الغرف لكل ترقية. الغرف المتبقية بدون ترقية: ${count - upgrades}` : `Choose rooms for each upgrade. Rooms without an upgrade: ${count - upgrades}`}
      </p>
      {availableAddons.map(addon => {
        const name = ar ? addon.nameAr || addon.nameEn : addon.nameEn || addon.nameAr;
        const description = ar ? addon.descriptionAr || addon.descriptionEn : addon.descriptionEn || addon.descriptionAr;
        const current = addonCounts[addon.id] ?? 0;
        const selected = current > 0;
        const price = resolvePrice(addon.price, addon.priceEgp);
        const setCount = (value: number) => setAddonCounts(previous => ({ ...previous, [addon.id]: value }));
        return <div key={addon.id} role="group" aria-label={name} className={`relative mt-3 rounded-2xl border-2 p-4 text-start transition-all ${selected ? "border-[#F59E0B] bg-[#F59E0B]/5" : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#F59E0B]/40"}`}>
          <button type="button" aria-label={name} aria-pressed={selected} disabled={!selected && upgrades >= count}
            onClick={() => setCount(selected ? 0 : 1)}
            className="absolute inset-0 z-10 cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F59E0B] disabled:cursor-not-allowed" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-start gap-3">
              <span aria-hidden className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${selected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#cbd5e1] bg-white"}`}>
                {selected && <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
              </span>
              <div className="min-w-0">
                <span className="block text-sm font-bold text-[#0f172a]">{name}</span>
                {description && <HotelOptionDescription description={description} ar={ar} />}
              </div>
            </div>
            <span className={`shrink-0 font-semibold ${selected ? "text-[#F59E0B]" : "text-[#0f172a]"}`}>{Number.isFinite(price) && price > 0 ? "+" : ""}{formatPrice(price, lang)}</span>
          </div>
          <p className="mt-2 text-xs text-[#64748b]">{ar ? "السعر لكل غرفة في الليلة" : "Price per room per night"}</p>
          <div className="mt-3 flex items-center justify-between border-t border-[#e2e8f0] pt-3">
            <span className="text-xs font-medium text-[#64748b]">{ar ? "عدد الغرف" : "Rooms"}</span>
            <div className="relative z-20 flex items-center gap-2">
              <button type="button" aria-label={ar ? `تقليل غرف ترقية ${name}` : `Decrease rooms for ${name}`} disabled={current === 0} onClick={() => setCount(current - 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B]/10 font-bold text-[#92400E] hover:bg-[#F59E0B]/20 disabled:cursor-not-allowed disabled:opacity-40">−</button>
              <span className="w-5 text-center text-sm font-bold text-[#0f172a]" aria-live="polite">{current}</span>
              <button type="button" aria-label={ar ? `زيادة غرف ترقية ${name}` : `Increase rooms for ${name}`} disabled={upgrades >= count} onClick={() => setCount(current + 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F59E0B]/10 font-bold text-[#92400E] hover:bg-[#F59E0B]/20 disabled:cursor-not-allowed disabled:opacity-40">+</button>
            </div>
          </div>
        </div>;
      })}
    </fieldset>}
    {count > 0 && capacity >= guests && count <= guests && upgrades <= count
      ? <ExactQuote key={JSON.stringify(selection)} hotel={hotel} criteria={criteria} category={category} selection={selection} reload={reload} />
      : <p className="mt-4 text-sm text-slate-700" role="status">{ar ? "اختر غرفًا تكفي عدد الضيوف." : "Select enough rooms for your group."}</p>}
  </div>;
}

function StayBookingForm({ hotel, initial, today, applied }: { hotel: HotelRecord; initial: StayCriteria; today: string; applied: boolean }) {
  const { lang } = useI18n();
  const ar = lang === "ar";
  const { category, resolvePrice } = useVisitorPricing();
  const [draft, setDraft] = useState(initial);
  const [criteria, setCriteria] = useState<StayCriteria | null>(applied ? initial : null);
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState("");
  function submit(event: FormEvent) {
    event.preventDefault();
    const issue = stayIssue(draft, today) ?? (missingChildAges(draft) ? "ages" : null);
    setError(issue ? stayIssueMessage(issue, ar) : "");
    if (!issue) { setCriteria(draft); setAttempt(n => n + 1); }
  }
  function updateDraft(next: StayCriteria) {
    setDraft(next);
    setCriteria(stayIssue(next, today) || missingChildAges(next) ? null : next);
    setError("");
  }
  return <section aria-labelledby="stay-booking-heading" className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-7">
    <h2 id="stay-booking-heading" className="flex items-center gap-2 text-xl font-bold text-slate-950">
      <CalendarCheck size={22} aria-hidden />{ar ? "تحقّق من غرف إقامتك" : "Check rooms for your stay"}
    </h2>
    <p className="mt-1 text-sm text-slate-600">{ar ? "اختر التواريخ وعدد الضيوف لعرض السعر حسب الليلة." : "Choose dates and guests to see the rates for each night."}</p>
    {missingChildAges(draft) && error === "" && <p className="mt-2 text-sm font-medium text-slate-700">{stayIssueMessage("ages", ar)}</p>}
    <form className="relative z-20 mt-4 grid gap-2.5 lg:grid-cols-[1.55fr_1fr_auto] lg:items-end" onSubmit={submit}>
      <StayFields stay={draft} setStay={updateDraft} today={today} ar={ar} initiallyOpen={missingChildAges(initial)}
        datePicker={<HotelDatePicker hotelId={hotel.id} basePrice={resolvePrice(hotel.initialPrice, hotel.initialPriceEgp)}
          stay={draft} setStay={updateDraft} today={today} ar={ar} />} />
      <button className={`${button} lg:min-h-[69px]`} type="submit">{ar ? "تحقّق من التوافر" : "Check availability"}</button>
    </form>
    {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
    {criteria && category && <BookingOptions key={attempt + ":" + category} hotel={hotel} criteria={criteria} category={category} />}
    {criteria && !category && <p className="mt-4 text-sm text-slate-700" role="status">{ar ? "اختر فئة التسعير لعرض السعر." : "Choose your pricing category to see a quote."}</p>}
  </section>;
}

export default function HotelStayBooking({ hotel }: { hotel: HotelRecord }) {
  const query = useSearchParams();
  const [today] = useState(cairoToday);
  const linkStay = readStayQuery(query);
  const defaultDates = { check_in: today, check_out: addStayDays(today, 1) };
  const linkedPartyWithDefaultDates = { ...linkStay, ...defaultDates };
  const linkIsValid = !stayIssue(linkStay, today);
  const fallback = stayIssue(linkedPartyWithDefaultDates, today) ? { ...defaultDates, adults: 2, children: 0 } : linkedPartyWithDefaultDates;
  const applied = linkIsValid && !missingChildAges(linkStay);
  return <StayBookingForm key={hotel.id + ":" + query.toString()} hotel={hotel} today={today} applied={applied}
    initial={linkIsValid ? linkStay : fallback} />;
}
