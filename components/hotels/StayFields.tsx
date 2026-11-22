"use client";

import { CalendarDays, ChevronDown, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { addStayDays, STAY_CHILD_MAX_AGE, STAY_GUEST_LIMIT, STAY_HORIZON, STAY_NIGHT_LIMIT, type StayCriteria } from "@/lib/hotel-stay";

const input = "min-h-10 w-full min-w-0 rounded-lg bg-transparent px-1 text-base font-semibold text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-sky-500";

export function stayIssueMessage(issue: string, ar: boolean) {
  if (issue === "ages") return ar ? "اختر عمر كل طفل للبحث عن غرف مناسبة." : "Select each child's age to find suitable rooms.";
  if (issue === "party") return ar ? "اختر بالغًا واحدًا على الأقل، وبحد أقصى ٢٠ ضيفًا." : "Choose at least one adult and no more than 20 guests.";
  if (issue === "duration") return ar ? "اختر إقامة حتى ٣٠ ليلة خلال السنة القادمة." : "Choose up to 30 nights within the next year.";
  return ar ? "اختر تاريخ وصول من اليوم ومغادرة بعده." : "Choose a check-in from today and a later checkout.";
}

export default function StayFields({ stay, setStay, today, ar, datePicker, initiallyOpen = false }: {
  stay: StayCriteria; setStay: (stay: StayCriteria) => void; today: string; ar: boolean; datePicker?: ReactNode; initiallyOpen?: boolean;
}) {
  const horizon = addStayDays(today, STAY_HORIZON);
  const maxCheckout = stay.check_in ? [addStayDays(stay.check_in, STAY_NIGHT_LIMIT), horizon].filter(Boolean).sort()[0] : horizon;
  const changeCheckIn = (check_in: string) => {
    const check_out = stay.check_out && (stay.check_out <= check_in || stay.check_out > addStayDays(check_in, STAY_NIGHT_LIMIT))
      ? "" : stay.check_out;
    setStay({ ...stay, check_in, check_out });
  };
  return (
    <>
      {datePicker ?? <div className="grid min-w-0 grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-2.5">
        <label className="min-w-0">
          <span className="flex items-center gap-1 px-1 text-xs font-medium text-slate-600">
            <CalendarDays size={14} aria-hidden />{ar ? "الوصول" : "Check-in"}
          </span>
          <input className={input} type="date" min={today} max={addStayDays(horizon, -1)} required value={stay.check_in}
            onChange={event => changeCheckIn(event.target.value)} />
        </label>
        <label className="min-w-0 border-s border-slate-200 ps-2">
          <span className="block px-1 text-xs font-medium text-slate-600">{ar ? "المغادرة" : "Checkout"}</span>
          <input className={input} type="date" min={addStayDays(stay.check_in || today, 1)} max={maxCheckout} required
            value={stay.check_out} onChange={event => setStay({ ...stay, check_out: event.target.value })} />
        </label>
      </div>}
      <details open={initiallyOpen} className="group relative min-w-0 rounded-xl border border-slate-200 bg-white">
        <summary className="flex min-h-[67px] cursor-pointer list-none items-center gap-2 rounded-xl px-3 text-start outline-none focus-visible:ring-2 focus-visible:ring-sky-500 [&::-webkit-details-marker]:hidden">
          <UsersRound className="shrink-0 text-slate-500" size={18} aria-hidden />
          <span className="min-w-0">
            <span className="block text-xs font-medium text-slate-600">{ar ? "عدد الضيوف" : "Guests"}</span>
            <span className="block text-sm font-semibold text-slate-900">{ar ? "بالغون: " : "Adults: "}{stay.adults} · {ar ? "أطفال: " : "Children: "}{stay.children}</span>
          </span>
          <ChevronDown aria-hidden size={18} strokeWidth={2} className="ms-auto shrink-0 text-slate-500 transition-transform duration-300 ease-in-out group-open:rotate-180 motion-reduce:transition-none" />
        </summary>
        <div className="absolute inset-x-0 top-full z-20 mt-2 grid min-w-44 gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
          {(["adults", "children"] as const).map(field => (
            <div key={field} className="flex items-center justify-between gap-3 text-sm text-slate-800">
              {field === "adults" ? (ar ? "البالغون" : "Adults") : (ar ? "الأطفال" : "Children")}
              <span dir="ltr" className="inline-flex shrink-0 items-center gap-1">
                <button type="button" aria-label={field === "adults" ? (ar ? "تقليل عدد البالغين" : "Decrease adults") : (ar ? "تقليل عدد الأطفال" : "Decrease children")}
                  disabled={stay[field] <= (field === "adults" ? 1 : 0)} onClick={() => setStay({ ...stay, [field]: stay[field] - 1, ...(field === "children" ? { child_ages: (stay.child_ages ?? []).slice(0, stay.children - 1) } : {}) })}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-40">−</button>
                <span className="min-w-8 text-center font-semibold tabular-nums" aria-live="polite">{stay[field]}</span>
                <button type="button" aria-label={field === "adults" ? (ar ? "زيادة عدد البالغين" : "Increase adults") : (ar ? "زيادة عدد الأطفال" : "Increase children")}
                  disabled={stay.adults + stay.children >= STAY_GUEST_LIMIT} onClick={() => setStay({ ...stay, [field]: stay[field] + 1 })}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-lg font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-sky-500 disabled:cursor-not-allowed disabled:opacity-40">+</button>
              </span>
            </div>
          ))}
          {stay.children > 0 && <div className="grid max-h-52 grid-cols-2 gap-2 overflow-y-auto border-t border-slate-100 pt-3">
            {Array.from({ length: stay.children }, (_, index) => <label key={index} className="grid min-w-0 gap-1 text-sm text-slate-700">
              <span>{ar ? `عمر الطفل ${index + 1}` : `Child ${index + 1} age`}</span>
              <span className="relative block min-w-0">
              <select value={stay.child_ages?.[index] ?? ""} onChange={event => {
                const child_ages = Array.from({ length: stay.children }, (_, i) => stay.child_ages?.[i] ?? null);
                child_ages[index] = event.target.value === "" ? null : Number(event.target.value);
                setStay({ ...stay, child_ages });
              }} className="min-h-10 w-full min-w-0 appearance-none rounded-lg border border-slate-300 bg-white ps-2 pe-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-500">
                <option value="">{ar ? "اختر العمر" : "Select age"}</option>
                {Array.from({ length: STAY_CHILD_MAX_AGE + 1 }, (_, age) => <option key={age} value={age}>
                  {age === 0 ? (ar ? "أقل من سنة" : "Under 1 year") : (ar ? `${age} سنة` : `${age} ${age === 1 ? "year" : "years"}`)}
                </option>)}
              </select>
              <ChevronDown aria-hidden size={14} className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-slate-600" />
              </span>
            </label>)}
          </div>}
          <button type="button" className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-semibold text-sky-900" onClick={event => {
            event.currentTarget.closest("details")?.removeAttribute("open");
            event.currentTarget.closest("details")?.querySelector("summary")?.focus();
          }}>{ar ? "تم" : "Done"}</button>
        </div>
      </details>
    </>
  );
}
