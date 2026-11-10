"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarDays, X } from "lucide-react";
import { getHotelRoomCalendar, saveHotelRoomCalendar } from "@/lib/hotel-availability-service";
import { addStayDays, cairoToday, HotelAvailabilityError, STAY_HORIZON, stayNights,
  type CalendarChange, type RatePair, type RoomCalendar } from "@/lib/hotel-stay";

type Room = { id: string; name: string };
type Draft = {
  from: string; through: string; units: string;
  USD: { mode: "keep" | "set" | "clear"; value: string };
  EGP: { mode: "keep" | "set" | "clear"; value: string };
};

const emptyDraft = (date: string): Draft => ({
  from: date, through: date, units: "", USD: { mode: "keep", value: "" }, EGP: { mode: "keep", value: "" },
});
const field = "min-h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm text-slate-950 focus-visible:outline-2 focus-visible:outline-sky-700";
const secondary = "min-h-10 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50 disabled:opacity-40";
const months = new Intl.DateTimeFormat("ar-EG", { month: "long", year: "numeric", timeZone: "UTC" });
const weekdays = new Intl.DateTimeFormat("ar-EG", { weekday: "short", timeZone: "UTC" });
const dateObject = (value: string) => new Date(value + "T00:00:00Z");

function monthStart(today: string, offset: number) {
  const [year, month] = today.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1 + offset, 1)).toISOString().slice(0, 10);
}

export default function HotelRoomCalendar({ hotelId, hotelName, rooms, onClose }: {
  hotelId: string; hotelName: string; rooms: Room[]; onClose?: () => void;
}) {
  const [today] = useState(cairoToday);
  const [roomId, setRoomId] = useState(rooms[0]?.id ?? "");
  const [offset, setOffset] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [draft, setDraft] = useState(() => emptyDraft(today));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ error?: boolean; text: string }>();
  const [response, setResponse] = useState<{ key: string; calendar?: RoomCalendar }>();
  const dialog = useRef<HTMLDialogElement>(null);
  const horizon = addStayDays(today, STAY_HORIZON);
  const month = monthStart(today, offset);
  const followingMonth = monthStart(today, offset + 1);
  const from = month < today ? today : month;
  const to = followingMonth < horizon ? followingMonth : horizon;
  const key = [roomId, from, to, attempt].join(":");
  const visible = response?.key === key ? response : undefined;
  const calendar = visible?.calendar;
  const selectedDay = calendar?.days.find(day => day.date === draft.from);
  const dirty = Boolean(draft.units || draft.USD.mode !== "keep" || draft.EGP.mode !== "keep");
  const arCount = new Intl.NumberFormat("ar-EG");

  useEffect(() => { dialog.current?.showModal(); }, []);
  useEffect(() => {
    if (!roomId) return;
    const controller = new AbortController();
    getHotelRoomCalendar(hotelId, roomId, from, to, controller.signal).then(calendar => {
      if (!controller.signal.aborted) setResponse({ key, calendar });
    }).catch(() => {
      if (!controller.signal.aborted) setResponse({ key });
    });
    return () => controller.abort();
  }, [hotelId, roomId, from, to, key]);

  function discard() {
    return !isSaving && (!dirty || window.confirm("لديك تغييرات غير محفوظة. هل تريد تجاهلها؟"));
  }
  function changeRoom(nextRoom: string) {
    if (!discard()) return;
    setRoomId(nextRoom);
    setDraft(emptyDraft(from));
    setMessage(undefined);
  }
  function changeMonth(nextOffset: number) {
    if (!discard()) return;
    const nextMonth = monthStart(today, nextOffset);
    setOffset(nextOffset);
    setDraft(emptyDraft(nextMonth < today ? today : nextMonth));
    setMessage(undefined);
  }
  function close() {
    if (discard()) onClose?.();
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    if (isSaving || !calendar || !dirty) return;
    const change: CalendarChange = { from: draft.from, to: addStayDays(draft.through, 1) };
    if (draft.from < today || change.to > horizon || !(stayNights(change.from, change.to) > 0)) {
      setMessage({ error: true, text: "اختر نطاقًا صالحًا من اليوم وحتى نهاية فترة الحجز." });
      return;
    }
    if (draft.units !== "") {
      if (!/^\d+$/.test(draft.units) || !Number.isSafeInteger(Number(draft.units))) {
        setMessage({ error: true, text: "أدخل عدد غرف صحيحًا، أو صفرًا لإغلاق الليالي." });
        return;
      }
      change.available_units = Number(draft.units);
    }
    const rates: Partial<RatePair> = {};
    for (const currency of ["USD", "EGP"] as const) {
      const rate = draft[currency];
      if (rate.mode === "clear") rates[currency] = null;
      if (rate.mode === "set") {
        if (!/^\d+(?:\.\d{1,2})?$/.test(rate.value) || !Number.isFinite(Number(rate.value)) || Number(rate.value) <= 0) {
          setMessage({ error: true, text: "أدخل سعرًا أكبر من صفر وبمنزلتين عشريتين كحد أقصى." });
          return;
        }
        rates[currency] = rate.value;
      }
    }
    if (Object.keys(rates).length) change.rate_override = rates;
    setIsSaving(true);
    setMessage(undefined);
    try {
      await saveHotelRoomCalendar(hotelId, roomId, calendar.revision, [change]);
      setDraft({ ...emptyDraft(draft.from), through: draft.through });
      setMessage({ text: "تم حفظ تغييرات التقويم." });
      setAttempt(n => n + 1);
    } catch (error) {
      if (error instanceof HotelAvailabilityError && error.code === "CALENDAR_CONFLICT") {
        setMessage({ error: true, text: "تغيّر التقويم منذ فتحه. راجع البيانات المحدّثة قبل حفظ مسودتك مرة أخرى." });
        setAttempt(n => n + 1);
      } else {
        setMessage({ error: true, text: error instanceof HotelAvailabilityError && error.code === "INVALID_INPUT"
          ? "لم يقبل الخادم نطاق التواريخ أو القيم المحددة. راجعها وأعد المحاولة."
          : "تعذّر حفظ التقويم. احتفظنا بالتغييرات لتعيد المحاولة." });
      }
    } finally {
      setIsSaving(false);
    }
  }

  const body = <section dir="rtl" aria-labelledby="room-calendar-heading" className="bg-white p-4 text-slate-950 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 pb-4">
      <div>
        <h2 id="room-calendar-heading" className="flex items-center gap-2 text-lg font-bold"><CalendarDays size={20} aria-hidden />تقويم التوافر والأسعار</h2>
        <p className="mt-1 text-sm text-slate-600">{hotelName}</p>
      </div>
      {onClose && <button type="button" aria-label="إغلاق التقويم" className={secondary} onClick={close} disabled={isSaving}><X size={18} aria-hidden /></button>}
    </div>
    {!roomId ? <p className="py-4 text-slate-700">احفظ نوع غرفة أولًا لإدارة تقويمه.</p> : <>
      <div className="my-4 grid gap-3 sm:grid-cols-2 sm:items-end">
        <label className="grid gap-1 text-sm font-semibold">نوع الغرفة
          <select className={field} value={roomId} onChange={event => changeRoom(event.target.value)} disabled={isSaving}>
            {rooms.map(room => <option key={room.id} value={room.id}>{room.name}</option>)}
          </select>
        </label>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" className={secondary} onClick={() => changeMonth(offset - 1)} disabled={isSaving || offset === 0}>السابق</button>
          <h3 className="text-sm font-bold" aria-live="polite">{months.format(dateObject(month))}</h3>
          <button type="button" className={secondary} onClick={() => changeMonth(offset + 1)} disabled={isSaving || followingMonth >= horizon}>التالي</button>
        </div>
      </div>
      {!visible ? <p className="py-4 text-slate-600" role="status">جاري تحميل التقويم…</p>
        : !calendar ? <div className="rounded-xl bg-red-50 p-4 text-red-800" role="alert">
          تعذّر تحميل التقويم. <button type="button" className="font-semibold underline" onClick={() => setAttempt(n => n + 1)}>إعادة المحاولة</button>
        </div> : <>
          <p className="mb-2 text-xs text-slate-600">السعر الأساسي لكل غرفة في الليلة: <bdi>USD {calendar.base_rates.USD ?? "—"}</bdi> · <bdi>EGP {calendar.base_rates.EGP ?? "—"}</bdi></p>
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {Array.from({ length: 7 }, (_, i) => <span className="truncate text-center text-[11px] text-slate-600" key={i}>{weekdays.format(new Date(Date.UTC(2026, 0, 4 + i)))}</span>)}
            {Array.from({ length: dateObject(month).getUTCDay() + Number(from.slice(8)) - 1 }, (_, i) =>
              <span key={"blank-" + i} aria-hidden />)}
            {calendar.days.map(day => {
              const open = day.available_units > 0;
              const special = day.rate_override.USD !== null || day.rate_override.EGP !== null;
              const picked = day.date >= draft.from && day.date <= draft.through;
              return <button key={day.date} type="button" aria-pressed={picked} disabled={isSaving}
                aria-label={day.date + (open ? "، الغرف المتاحة: " + day.available_units : "، مغلق") +
                  (special ? "، سعر خاص: " + (day.rate_override.USD ?? "—") + " USD، " + (day.rate_override.EGP ?? "—") + " EGP" : "")}
                onClick={() => setDraft({ ...draft, from: day.date, through: day.date })}
                className={"flex min-h-12 min-w-0 flex-col items-center justify-center rounded-md border text-xs focus-visible:outline-2 focus-visible:outline-sky-700 " +
                  (open ? "border-emerald-200 bg-emerald-50 text-emerald-900 " : "border-slate-200 bg-slate-100 text-slate-600 ") +
                  (picked ? "ring-2 ring-inset ring-sky-700" : "")}>
                <span className="font-bold">{arCount.format(Number(day.date.slice(8)))}</span>
                <span className="text-[10px]">{open ? arCount.format(day.available_units) : "مغلق"}{special ? " · ★" : ""}</span>
              </button>;
            })}
          </div>
          <p className="mt-2 text-xs text-slate-600">الرقم يوضح عدد الغرف المتاحة. ★ تعني أن لهذه الليلة سعرًا خاصًا.</p>
          {selectedDay && <p className="mt-2 rounded-lg bg-sky-50 px-3 py-2 text-sm text-slate-800">
            <bdi>{selectedDay.date}</bdi> · {selectedDay.available_units ? "الغرف المتاحة: " + arCount.format(selectedDay.available_units) : "مغلق"} · سعر الليلة:{" "}
            <bdi>USD {selectedDay.rate_override.USD ?? calendar.base_rates.USD ?? "—"}</bdi> ·{" "}
            <bdi>EGP {selectedDay.rate_override.EGP ?? calendar.base_rates.EGP ?? "—"}</bdi>
          </p>}
        </>}
      <form className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:p-4" onSubmit={save}>
        <fieldset disabled={isSaving || !calendar} className="min-w-0 space-y-3">
          <legend className="pb-2 font-bold">تعديل ليلة أو عدة ليالٍ</legend>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <label className="grid gap-1 text-sm">أول ليلة
              <input type="date" className={field} min={today} max={addStayDays(horizon, -1)} value={draft.from} required
                onChange={event => setDraft({ ...draft, from: event.target.value, through: draft.through < event.target.value ? event.target.value : draft.through })} />
            </label>
            <label className="grid gap-1 text-sm">آخر ليلة (شاملة)
              <input type="date" className={field} min={draft.from || today} max={addStayDays(horizon, -1)} value={draft.through} required
                onChange={event => setDraft({ ...draft, through: event.target.value })} />
            </label>
            <label className="grid gap-1 text-sm">عدد الغرف المتاحة
              <input type="number" className={field} min={0} step={1} placeholder="بدون تغيير" value={draft.units}
                onChange={event => setDraft({ ...draft, units: event.target.value })} />
            </label>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(["USD", "EGP"] as const).map(currency => <div key={currency} className="grid content-start gap-2">
              <label className="grid gap-1 text-sm">{currency === "USD" ? "سعر الدولار لليلة" : "سعر الجنيه لليلة"}
                <select className={field} value={draft[currency].mode} onChange={event => setDraft({
                  ...draft, [currency]: { ...draft[currency], mode: event.target.value as Draft["USD"]["mode"] },
                })}>
                  <option value="keep">بدون تغيير</option>
                  <option value="set">تحديد سعر خاص</option>
                  <option value="clear">الرجوع للسعر الأساسي</option>
                </select>
              </label>
              {draft[currency].mode === "set" && <label className="grid gap-1 text-sm">
                {currency === "USD" ? "قيمة سعر الدولار" : "قيمة سعر الجنيه"}
                <input type="text" dir="ltr" inputMode="decimal" required className={field} value={draft[currency].value}
                  onChange={event => setDraft({ ...draft, [currency]: { ...draft[currency], value: event.target.value } })} />
              </label>}
            </div>)}
          </div>
          <p className="text-xs text-slate-600">اكتب صفرًا لإغلاق الليالي. اترك العدد فارغًا عند تغيير السعر فقط.</p>
          <button type="submit" disabled={!dirty || isSaving} className="min-h-11 rounded-xl bg-sky-800 px-5 py-2 text-sm font-bold text-white hover:bg-sky-900 disabled:bg-slate-300 disabled:text-slate-700">
            {isSaving ? "جاري الحفظ…" : "حفظ تغييرات التقويم"}
          </button>
        </fieldset>
        {message && <p role={message.error ? "alert" : "status"} className={"mt-3 text-sm font-semibold " + (message.error ? "text-red-700" : "text-emerald-800")}>{message.text}</p>}
      </form>
    </>}
  </section>;

  return onClose ? <dialog ref={dialog} aria-labelledby="room-calendar-heading"
    onCancel={event => { event.preventDefault(); close(); }}
    className="m-auto max-h-[92dvh] w-[calc(100%-1rem)] max-w-3xl overflow-auto rounded-2xl shadow-xl backdrop:bg-slate-950/60">{body}</dialog> : body;
}
