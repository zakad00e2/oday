"use client";

import { useId } from "react";

interface DualPriceInputsProps {
  usd: number;
  egp?: number | null;
  onChange: (usd: number, egp: number | null) => void;
  label: string;
}

export default function DualPriceInputs({ usd, egp, onChange, label }: DualPriceInputsProps) {
  const id = useId();
  const inputClass = "w-full min-w-0 border border-[#E5E7EB] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#111]";
  return (
    <fieldset className="min-w-0 col-span-full">
      <legend className="mb-2 text-xs font-medium text-[#374151]">{label}</legend>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor={`${id}-usd`} className="mb-1 block text-xs text-[#6B7280]">دولار (USD)</label>
          <input id={`${id}-usd`} aria-label={`${label} — USD`} type="number" min="0" step="0.01" dir="ltr" value={Number.isFinite(usd) ? usd : ""} onChange={event => onChange(event.target.value === "" ? Number.NaN : Number(event.target.value), egp ?? null)} className={inputClass} />
        </div>
        <div>
          <label htmlFor={`${id}-egp`} className="mb-1 block text-xs text-[#6B7280]">جنيه مصري (EGP)</label>
          <input id={`${id}-egp`} aria-label={`${label} — EGP`} type="number" min="0" step="0.01" dir="ltr" value={egp != null && Number.isFinite(egp) ? egp : ""} onChange={event => onChange(usd, event.target.value === "" ? null : Number(event.target.value))} className={inputClass} />
        </div>
      </div>
    </fieldset>
  );
}
