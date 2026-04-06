"use client";

import { useEffect, useMemo, useRef, useState } from "react";

function parseIsoDate(value: string): Date | null {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
}

function formatIsoDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

interface LocalizedDatePickerProps {
    value: string;
    onChange: (value: string) => void;
    locale: "ar" | "en";
    label: string;
    placeholder: string;
    clearLabel?: string;
    allowClear?: boolean;
    minDate?: string;
}

export default function LocalizedDatePicker({
    value,
    onChange,
    locale,
    label,
    placeholder,
    clearLabel,
    allowClear = true,
    minDate,
}: LocalizedDatePickerProps) {
    const isAr = locale === "ar";
    const resolvedClearLabel = clearLabel ?? (isAr ? "مسح" : "Clear");
    const selectedDate = parseIsoDate(value);
    const minSelectableDate = parseIsoDate(minDate ?? "");
    const todayIso = formatIsoDate(new Date());
    const rootRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
        const base = selectedDate ?? minSelectableDate ?? new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const weekdayFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { weekday: "short" }),
        [isAr],
    );
    const monthFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { month: "long", year: "numeric" }),
        [isAr],
    );
    const displayFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
        [isAr],
    );

    const weekdayLabels = useMemo(() => {
        const start = new Date(2026, 0, 4);
        return Array.from({ length: 7 }, (_, index) => {
            const date = new Date(start);
            date.setDate(start.getDate() + index);
            return weekdayFormatter.format(date);
        });
    }, [weekdayFormatter]);

    const calendarDays = useMemo(() => {
        const year = visibleMonth.getFullYear();
        const month = visibleMonth.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const cells: Array<Date | null> = Array.from({ length: firstDay }, () => null);

        for (let day = 1; day <= daysInMonth; day += 1) {
            cells.push(new Date(year, month, day));
        }

        while (cells.length % 7 !== 0) {
            cells.push(null);
        }

        return cells;
    }, [visibleMonth]);

    const chooseDate = (date: Date) => {
        onChange(formatIsoDate(date));
        setVisibleMonth(new Date(date.getFullYear(), date.getMonth(), 1));
        setOpen(false);
    };

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent | TouchEvent) => {
            const target = event.target;
            if (!(target instanceof Node)) return;
            if (rootRef.current?.contains(target)) return;
            setOpen(false);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handlePointerDown);
        document.addEventListener("touchstart", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("mousedown", handlePointerDown);
            document.removeEventListener("touchstart", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`flex w-full items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] transition-all hover:border-[#0EA5E9] ${isAr ? "text-right" : "text-left"}`}
            >
                <span className={value ? "text-[#0F172A]" : "text-[#94A3B8]"}>
                    {selectedDate ? displayFormatter.format(selectedDate) : placeholder}
                </span>
                <svg className="h-5 w-5 shrink-0 text-[#64748B]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {open ? (
                <div className={`absolute z-30 mt-2 w-full min-w-[280px] rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl ${isAr ? "right-0" : "left-0"}`}>
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                            aria-label={isAr ? "الشهر السابق" : "Previous month"}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={isAr ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
                            </svg>
                        </button>
                        <div className="text-sm font-semibold text-[#111]">{monthFormatter.format(visibleMonth)}</div>
                        <button
                            type="button"
                            onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                            aria-label={isAr ? "الشهر التالي" : "Next month"}
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                            </svg>
                        </button>
                    </div>

                    <div className="mb-2 grid grid-cols-7 gap-1">
                        {weekdayLabels.map((day) => (
                            <div key={day} className="py-1 text-center text-xs font-semibold text-[#94A3B8]">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {calendarDays.map((date, index) => {
                            if (!date) {
                                return <div key={`empty-${index}`} className="h-10" />;
                            }

                            const iso = formatIsoDate(date);
                            const isSelected = iso === value;
                            const isToday = iso === todayIso;
                            const isDisabled = Boolean(minSelectableDate && date < minSelectableDate);

                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    disabled={isDisabled}
                                    onClick={() => chooseDate(date)}
                                    className={`h-10 rounded-xl text-sm transition-all ${
                                        isDisabled
                                            ? "cursor-not-allowed text-[#CBD5E1]"
                                            : isSelected
                                                ? "bg-[#0EA5E9] text-white shadow-sm"
                                                : isToday
                                                    ? "border border-[#0EA5E9] text-[#0EA5E9] hover:bg-[#F0F9FF]"
                                                    : "text-[#0F172A] hover:bg-[#F8FAFC]"
                                    }`}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    <div className={`mt-3 flex items-center gap-2 text-xs ${allowClear ? "justify-between" : "justify-end"}`}>
                        {allowClear ? (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange("");
                                    setOpen(false);
                                }}
                                className="font-medium text-[#64748B] hover:text-[#111]"
                            >
                                {resolvedClearLabel}
                            </button>
                        ) : null}
                        <div className="text-[#94A3B8]">{label}</div>
                    </div>
                </div>
            ) : null}
        </div>
    );
}
