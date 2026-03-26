"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { useI18n } from "@/lib/i18n/dictionary-context";
import Link from "next/link";
import {
    NATIONALITY_OPTIONS,
    EXTRA_AIRLINE_FEE,
    AIRLINES,
    ACCEPTED_EXTENSIONS,
    ACCEPTED_FILE_TYPES,
    MAX_FILE_SIZE,
    type NationalityId,
} from "@/lib/airport-config";
import {
    buildWhatsAppMessage,
    buildWhatsAppUrl,
    AirportFormData,
} from "@/lib/whatsapp-message";

/* ─── Types ──────────────────────────────────────────────────── */
type ServiceType = "24h" | "72h" | null;
type AirlineChoice = "egyptair" | "other";

interface FormErrors {
    nationalityId?: string;
    serviceType?: string;
    file?: string;
    country?: string;
    airport?: string;
    airline?: string;
    otherAirline?: string;
    customAirlineName?: string;
    fullName?: string;
    whatsapp?: string;
    agreement?: string;
}

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

function LocalizedDatePicker({
    value,
    onChange,
    locale,
    label,
    placeholder,
    clearLabel,
}: {
    value: string;
    onChange: (value: string) => void;
    locale: "ar" | "en";
    label: string;
    placeholder: string;
    clearLabel: string;
}) {
    const isAr = locale === "ar";
    const selectedDate = parseIsoDate(value);
    const [open, setOpen] = useState(false);
    const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
        const base = selectedDate ?? new Date();
        return new Date(base.getFullYear(), base.getMonth(), 1);
    });

    const weekdayFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { weekday: "short" }),
        [isAr]
    );
    const monthFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { month: "long", year: "numeric" }),
        [isAr]
    );
    const displayFormatter = useMemo(
        () => new Intl.DateTimeFormat(isAr ? "ar-EG" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
        [isAr]
    );

    const weekdayLabels = useMemo(() => {
        const start = new Date(2026, 0, 4);
        return Array.from({ length: 7 }, (_, idx) => {
            const date = new Date(start);
            date.setDate(start.getDate() + idx);
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

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] transition-all flex items-center justify-between gap-3 hover:border-[#0EA5E9] ${isAr ? "text-right" : "text-left"}`}
            >
                <span className={value ? "text-[#0F172A]" : "text-[#94A3B8]"}>
                    {selectedDate ? displayFormatter.format(selectedDate) : placeholder}
                </span>
                <svg className="w-5 h-5 text-[#64748B] shrink-0" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </button>

            {open && (
                <div className={`absolute z-30 mt-2 w-full min-w-[280px] rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-xl ${isAr ? "right-0" : "left-0"}`}>
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() => setVisibleMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]"
                            aria-label={isAr ? "الشهر السابق" : "Previous month"}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
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
                            const isToday = iso === formatIsoDate(new Date());

                            return (
                                <button
                                    key={iso}
                                    type="button"
                                    onClick={() => chooseDate(date)}
                                    className={`h-10 rounded-xl text-sm transition-all ${
                                        isSelected
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

                    <div className="mt-3 flex items-center justify-between gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                onChange("");
                                setOpen(false);
                            }}
                            className="text-xs font-medium text-[#64748B] hover:text-[#111]"
                        >
                            {clearLabel}
                        </button>
                        <div className="text-xs text-[#94A3B8]">{label}</div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ─── Component ──────────────────────────────────────────────── */
export default function AirportCoordination() {
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const t = useCallback((ar: string, en: string) => (isAr ? ar : en), [isAr]);

    // ── Document type
    const [nationalityId, setNationalityId] = useState<NationalityId | null>(null);

    // ── Service type
    const [serviceType, setServiceType] = useState<ServiceType>(null);

    // ── File upload
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Arrival details
    const [country, setCountry] = useState("");
    const [airport, setAirport] = useState("");
    const [travelDate, setTravelDate] = useState("");

    // ── Airline
    const [airlineChoice, setAirlineChoice] = useState<AirlineChoice | null>(null);
    const [otherAirlineId, setOtherAirlineId] = useState("");
    const [customAirlineName, setCustomAirlineName] = useState("");

    // ── Contact
    const [fullName, setFullName] = useState("");
    const [whatsapp, setWhatsapp] = useState("");
    const [email, setEmail] = useState("");
    const [notes, setNotes] = useState("");

    // ── State
    const [agreedToPolicies, setAgreedToPolicies] = useState(false);
    const [errors, setErrors] = useState<FormErrors & { agreement?: string }>({});
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState("");

    /* ─── Pricing ───────────────────────────────────────────────── */
    const selectedNationality = useMemo(
        () => NATIONALITY_OPTIONS.find((option) => option.id === nationalityId) ?? null,
        [nationalityId]
    );
    const selectedNationalityLabel = useMemo(() => {
        if (!selectedNationality) return "";
        return isAr ? selectedNationality.labelAr : selectedNationality.labelEn;
    }, [isAr, selectedNationality]);
    const basePrice =
        serviceType === "24h"
            ? selectedNationality?.price24 ?? 0
            : serviceType === "72h"
                ? selectedNationality?.price72 ?? 0
                : 0;
    const extraFee = useMemo(() => {
        if (!airlineChoice) return 0;
        return airlineChoice === "egyptair" ? 0 : EXTRA_AIRLINE_FEE;
    }, [airlineChoice]);
    const total = selectedNationality && serviceType ? basePrice + extraFee : 0;

    /* ─── Airline display name ─────────────────────────────────── */
    const resolvedAirlineName = useMemo(() => {
        if (airlineChoice === "egyptair") return t("مصر للطيران (EgyptAir)", "EgyptAir");
        if (!otherAirlineId) return "";
        if (otherAirlineId === "other") return customAirlineName || t("أخرى", "Other");
        const found = AIRLINES.find((a) => a.id === otherAirlineId);
        return found ? (isAr ? found.labelAr : found.labelEn) : "";
    }, [airlineChoice, otherAirlineId, customAirlineName, isAr, t]);

    /* ─── File handler ─────────────────────────────────────────── */
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
            setErrors((prev) => ({
                ...prev,
                file: t("نوع الملف غير مدعوم. يُقبل: JPG, PNG, PDF", "Unsupported file type. Accepted: JPG, PNG, PDF"),
            }));
            return;
        }
        if (f.size > MAX_FILE_SIZE) {
            setErrors((prev) => ({
                ...prev,
                file: t("حجم الملف يتجاوز 10 ميغابايت", "File size exceeds 10 MB"),
            }));
            return;
        }

        setFile(f);
        setErrors((prev) => ({ ...prev, file: undefined }));

        if (f.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = () => setFilePreview(reader.result as string);
            reader.readAsDataURL(f);
        } else {
            setFilePreview(null);
        }
    }, [t]);

    const removeFile = useCallback(() => {
        setFile(null);
        setFilePreview(null);
        if (fileRef.current) fileRef.current.value = "";
    }, []);

    /* ─── Validation ───────────────────────────────────────────── */
    const validate = useCallback((): boolean => {
        const errs: FormErrors = {};

        if (!nationalityId) errs.nationalityId = t("يرجى اختيار الجنسية", "Please select a nationality");
        if (!serviceType) errs.serviceType = t("يرجى اختيار نوع الخدمة", "Please select the service type");
        
        if (!country.trim()) errs.country = t("يرجى إدخال بلد المغادرة", "Please enter the departure country");
        if (!airport.trim()) errs.airport = t("يرجى إدخال مطار المغادرة", "Please enter the departure airport");

        if (!airlineChoice) {
            errs.airline = t("يرجى اختيار شركة الطيران", "Please select the airline");
        } else if (airlineChoice === "other" && !otherAirlineId) {
            errs.otherAirline = t("يرجى اختيار شركة الطيران من القائمة", "Please choose the airline from the list");
        } else if (airlineChoice === "other" && otherAirlineId === "other" && !customAirlineName.trim()) {
            errs.customAirlineName = t("يرجى كتابة اسم شركة الطيران", "Please enter the airline name");
        }

        if (!fullName.trim()) errs.fullName = t("يرجى إدخال الاسم الكامل", "Please enter your full name");
        if (!whatsapp.trim()) errs.whatsapp = t("يرجى إدخال رقم الواتساب", "Please enter your WhatsApp number");
        if (!agreedToPolicies) errs.agreement = t("يجب الموافقة على الشروط والأحكام للاستمرار", "You must agree to the terms to continue");

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [airlineChoice, country, customAirlineName, nationalityId, file, fullName, otherAirlineId, airport, serviceType, t, whatsapp, agreedToPolicies]);

    /* ─── Submit ───────────────────────────────────────────────── */
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);

            const formData: AirportFormData = {
                nationalityId: nationalityId!,
                nationalityLabel: selectedNationalityLabel,
                serviceType: serviceType!,
                basePrice,
                airlineName: resolvedAirlineName,
                extraFee,
                total,
                fileName: file?.name || "",
                country: country.trim(),
                airport: airport.trim(),
                travelDate,
                fullName: fullName.trim(),
                whatsappNumber: whatsapp.trim(),
                email: email.trim(),
                notes: notes.trim(),
            };

            const message = buildWhatsAppMessage(formData, lang);
            const url = buildWhatsAppUrl(message);

            // Small delay to feel natural
            setTimeout(() => {
                setWhatsappUrl(url);
                setShowConfirmModal(true);
                setLoading(false);
            }, 600);
        },
        [validate, nationalityId, selectedNationalityLabel, serviceType, basePrice, resolvedAirlineName, extraFee, total, file, country, airport, travelDate, fullName, whatsapp, email, notes, lang]
    );

    /* ─── Helpers ──────────────────────────────────────────────── */
    const labelClass = "block text-sm font-semibold text-[#0F172A] mb-1.5";
    const inputClass =
        "w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] transition-all";
    const errorClass = "text-xs text-red-500 mt-1 font-medium";
    const textAlignClass = isAr ? "text-right" : "text-left";
    const choiceTextAlignClass = isAr ? "text-right" : "text-left";
    const selectedBadgeSideClass = isAr ? "left-3" : "right-3";
    const noteItemPaddingClass = isAr ? "pr-5" : "pl-5";
    const noteItemBulletClass = isAr ? "right-0" : "left-0";

    const otherAirlines = AIRLINES.filter((a) => !a.isEgyptAir);

    /* ─── Render ───────────────────────────────────────────────── */

    return (
        <section className="py-20 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
                        {t("الموافقات الأمنية وتأشيرات دخول مصر", "Security approvals & Egypt entry visas")}
                    </h1>
                    <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        {t(
                            "نوفر خدمة الموافقات الأمنية والتأشيرات لعدة جنسيات، مع متابعة كاملة لجميع الإجراءات وتحديد السعر حسب الجنسية وسرعة المعالجة التي تختارها.",
                            "We provide security approvals and visa support for multiple nationalities, with full follow-up and pricing based on the selected nationality and processing speed."
                        )}
                    </p>
                </div>

                {/* Who needs approval note */}
                <div className={`mb-10 bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 lg:p-8 shadow-sm ${textAlignClass}`}>
                    <h3 className="text-lg font-bold text-[#0369A1] mb-5 flex items-center gap-2">
                        <svg className="w-7 h-7 md:w-5 md:h-5 shrink-0 text-[#0284C7]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        {t("معلومات مهمة قبل تقديم الطلب", "Important information before submitting your request")}
                    </h3>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white p-4 rounded-xl border border-[#E0F2FE] shadow-sm">
                            <h4 className="font-bold text-[#0284C7] mb-2 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                                {t("خدمة متعددة الجنسيات", "Multi-nationality service")}
                            </h4>
                            <p className="text-sm text-[#475569] leading-relaxed">
                                {t(
                                    "الخدمة متاحة لعدة جنسيات، ويمكنك اختيار الجنسية المناسبة مباشرة من القائمة داخل النموذج.",
                                    "The service supports multiple nationalities, and you can choose the correct nationality directly from the form list."
                                )}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#E0F2FE] shadow-sm">
                            <h4 className="font-bold text-[#0284C7] mb-2 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                                {t("الأسعار حسب الجنسية", "Pricing by nationality")}
                            </h4>
                            <p className="text-sm text-[#475569] leading-relaxed">
                                {t(
                                    "السعر يتغير تلقائياً حسب الجنسية التي تختارها، مع وجود سعر مختلف لخدمة 24 ساعة وخدمة 72 ساعة.",
                                    "Pricing updates automatically based on the selected nationality, with different rates for 24-hour and 72-hour processing."
                                )}
                            </p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-[#E0F2FE] shadow-sm">
                            <h4 className="font-bold text-[#0284C7] mb-2 text-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]"></span>
                                {t("تجهيز الطلب", "Request preparation")}
                            </h4>
                            <p className="text-sm text-[#475569] leading-relaxed">
                                {t(
                                    "اختر الجنسية ونوع الخدمة وارفع المستندات المطلوبة، وسنجهز لك الطلب مع المتابعة حتى إصدار الموافقة.",
                                    "Choose the nationality, select the service type, upload the required document, and we will handle the follow-up until the approval is issued."
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Layout: Form + Price Card */}
                <form id="airport-form" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                        {/* ── Left: Form Sections ─────────────────────── */}
                        <div className="flex-1 w-full flex flex-col gap-6">

                            {/* ─── 1. Service Type ──────────────────────── */}
                            <div className="order-2 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">2</span>
                                    {t("نوع الخدمة", "Service type")}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* 24h card */}
                                    <button
                                        type="button"
                                        onClick={() => { setServiceType("24h"); setErrors((p) => ({ ...p, serviceType: undefined })); }}
                                        className={`relative rounded-xl border-2 p-5 ${choiceTextAlignClass} transition-all duration-200 cursor-pointer ${serviceType === "24h"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-sm"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <div className={`absolute top-3 ${selectedBadgeSideClass} w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                            serviceType === "24h" ? "bg-[#0EA5E9] border-transparent" : "border-2 border-[#CBD5E1] bg-white"
                                        }`}>
                                            {serviceType === "24h" && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <svg className="shrink-0 w-8 h-8 mb-3 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4.5 2.25M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <h3 className="font-bold text-[#111] text-base mb-1">
                                            {t("موافقة أمنية خلال 24 ساعة", "Security approval within 24 hours")}
                                        </h3>
                                        <p className="text-sm text-[#6B7280]">
                                            {t(
                                                "خدمة عاجلة لمعالجة الطلب وإصدار الموافقة الأمنية والتلكس خلال يوم واحد",
                                                "Urgent processing to issue the security approval and telex within one day."
                                            )}
                                        </p>
                                        <div className="mt-3 text-xl font-bold text-[#0EA5E9]">
                                            {selectedNationality ? `$${selectedNationality.price24}` : "—"}
                                        </div>
                                    </button>

                                    {/* 72h card */}
                                    <button
                                        type="button"
                                        onClick={() => { setServiceType("72h"); setErrors((p) => ({ ...p, serviceType: undefined })); }}
                                        className={`relative rounded-xl border-2 p-5 ${choiceTextAlignClass} transition-all duration-200 cursor-pointer ${serviceType === "72h"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-sm"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <div className={`absolute top-3 ${selectedBadgeSideClass} w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                            serviceType === "72h" ? "bg-[#0EA5E9] border-transparent" : "border-2 border-[#CBD5E1] bg-white"
                                        }`}>
                                            {serviceType === "72h" && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            )}
                                        </div>
                                        <svg className="shrink-0 w-8 h-8 mb-3 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                                        </svg>
                                        <h3 className="font-bold text-[#111] text-base mb-1">
                                            {t("موافقة أمنية خلال 72 ساعة", "Security approval within 72 hours")}
                                        </h3>
                                        <p className="text-sm text-[#6B7280]">
                                            {t(
                                                "معالجة الطلب وإصدار الموافقة الأمنية والتلكس خلال 48 ل 72 ساعة",
                                                "Request processing and issuance of the security approval and telex within 48 to 72 hours."
                                            )}
                                        </p>
                                        <div className="mt-3 text-xl font-bold text-[#0EA5E9]">
                                            {selectedNationality ? `$${selectedNationality.price72}` : "—"}
                                        </div>
                                    </button>
                                </div>
                                {errors.serviceType && <p className={errorClass}>{errors.serviceType}</p>}
                            </div>

                            {/* ─── 2. Document Type ─────────────────────── */}
                            <div className="order-1 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">1</span>
                                    {t("الجنسية", "Nationality")}
                                </h2>
                                <div>
                                    <label className={labelClass}>{t("اختر الجنسية", "Choose nationality")} *</label>
                                    <div className="relative">
                                        <select
                                            value={nationalityId ?? ""}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setNationalityId(value ? (value as NationalityId) : null);
                                                setErrors((p) => ({ ...p, nationalityId: undefined }));
                                            }}
                                            className={`${inputClass} appearance-none ${choiceTextAlignClass} ${isAr ? "pl-10" : "pr-10"}`}
                                        >
                                            <option value="">{t("اختر الجنسية من القائمة", "Select nationality from the list")}</option>
                                            {NATIONALITY_OPTIONS.map((option) => (
                                                <option key={option.id} value={option.id}>
                                                    {isAr ? option.labelAr : option.labelEn}
                                                </option>
                                            ))}
                                        </select>
                                        <div className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-[#94A3B8] ${isAr ? "left-4" : "right-4"}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-sm text-[#6B7280]">
                                        {t(
                                            "سيتم تحديد السعر تلقائياً بعد اختيار الجنسية",
                                            "Pricing updates automatically after you choose the nationality and service type."
                                        )}
                                    </p>
                                    {errors.nationalityId && <p className={errorClass}>{errors.nationalityId}</p>}
                                </div>
                            </div>


                            {/* ─── 3. Upload Document (Removed - Only WhatsApp) ───────────────────── */}
                            <div className="order-3 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">3</span>
                                    {t("معلومات المستند", "Document information")}
                                </h2>
                                <p className="text-sm text-[#6B7280] mb-4">
                                    {t("صورة جواز السفر أو وثيقة السفر", "Passport image or travel document")}
                                </p>
                                <div className="mt-3 text-sm text-[#475569] leading-relaxed">
                                    <div className="flex items-start gap-2 bg-[#F0F9FF] p-4 rounded-xl border border-[#BAE6FD]">
                                        <svg className="w-5 h-5 text-[#0EA5E9] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <p>{t(
                                            "سيُطلب منك إرسال صورة جواز السفر (أو وثيقة السفر) لاحقاً عبر محادثة الواتساب مع الموظف المختص بعد تقديم الطلب.",
                                            "You will be asked to send a copy of your passport (or travel document) later via WhatsApp chat with the assigned agent after submitting the request."
                                        )}</p>
                                    </div>
                                </div>
                            </div>

                            {/* ─── 4. Arrival Details ───────────────────── */}
                            <div className="order-4 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">4</span>
                                    {t("تفاصيل السفر", "Travel details")}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>{t("بلد المغادرة", "Departure country")} *</label>
                                        <input type="text" value={country} onChange={(e) => { setCountry(e.target.value); setErrors((p) => ({ ...p, country: undefined })); }} className={inputClass} placeholder={t("مثال: اليونان", "Example: Greece")} />
                                        {errors.country && <p className={errorClass}>{errors.country}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t("مطار المغادرة", "Departure airport")} *</label>
                                        <input type="text" value={airport} onChange={(e) => { setAirport(e.target.value); setErrors((p) => ({ ...p, airport: undefined })); }} className={inputClass} placeholder={t("مثال: مطار أثينا الدولي", "Example: Athens International Airport")} />
                                        {errors.airport && <p className={errorClass}>{errors.airport}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t("تاريخ السفر", "Travel date")} <span className="text-[#94A3B8] font-normal">{t("(اختياري)", "(Optional)")}</span></label>
                                        <LocalizedDatePicker
                                            value={travelDate}
                                            onChange={setTravelDate}
                                            locale={isAr ? "ar" : "en"}
                                            label={t("اختر من التقويم", "Choose from calendar")}
                                            placeholder={t("اختر التاريخ", "Select a date")}
                                            clearLabel={t("مسح التاريخ", "Clear date")}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* ─── 5. Airline ────────────────────────────── */}
                            <div className="order-5 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">5</span>
                                    {t("شركة الطيران", "Airline")}
                                </h2>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    {/* EgyptAir */}
                                    <button
                                        type="button"
                                        onClick={() => { setAirlineChoice("egyptair"); setErrors((p) => ({ ...p, airline: undefined, otherAirline: undefined })); }}
                                        className={`relative rounded-xl border-2 p-4 flex flex-col justify-center ${choiceTextAlignClass} transition-all duration-200 cursor-pointer ${airlineChoice === "egyptair"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF]"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                                airlineChoice === "egyptair" ? "bg-[#0EA5E9] border-transparent" : "border-2 border-[#CBD5E1] bg-white"
                                            }`}>
                                                {airlineChoice === "egyptair" && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-[#111] text-sm">{t("مصر للطيران (EgyptAir)", "EgyptAir")}</h3>
                                        </div>
                                        <div className={`mt-2 ${isAr ? 'mr-8' : 'ml-8'}`}>
                                            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                                {t("بدون رسوم إضافية", "No extra fee")}
                                            </p>
                                        </div>
                                    </button>

                                    {/* Other */}
                                    <button
                                        type="button"
                                        onClick={() => { setAirlineChoice("other"); setErrors((p) => ({ ...p, airline: undefined })); }}
                                        className={`relative rounded-xl border-2 p-4 flex flex-col justify-center ${choiceTextAlignClass} transition-all duration-200 cursor-pointer ${airlineChoice === "other"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF]"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 w-full">
                                            <div className={`shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                                                airlineChoice === "other" ? "bg-[#0EA5E9] border-transparent" : "border-2 border-[#CBD5E1] bg-white"
                                            }`}>
                                                {airlineChoice === "other" && (
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-[#111] text-sm">{t("شركة طيران أخرى", "Other airline")}</h3>
                                        </div>
                                        <div className={`mt-2 ${isAr ? 'mr-8' : 'ml-8'}`}>
                                            <p className="text-xs text-amber-600 font-medium">{t("رسوم إضافية", "Extra fee")} ${EXTRA_AIRLINE_FEE} +</p>
                                        </div>
                                    </button>
                                </div>

                                {errors.airline && <p className={errorClass}>{errors.airline}</p>}

                                {/* Other airline dropdown */}
                                {airlineChoice === "other" && (
                                    <div className="space-y-4 mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                                        <div>
                                            <label className={labelClass}>{t("اختر شركة الطيران", "Choose the airline")} *</label>
                                            <select
                                                value={otherAirlineId}
                                                onChange={(e) => { setOtherAirlineId(e.target.value); setErrors((p) => ({ ...p, otherAirline: undefined })); }}
                                                className={inputClass + " cursor-pointer"}
                                            >
                                                <option value="">{t("— اختر —", "— Select —")}</option>
                                                {otherAirlines.map((a) => (
                                                    <option key={a.id} value={a.id}>
                                                        {isAr ? a.labelAr : a.labelEn}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.otherAirline && <p className={errorClass}>{errors.otherAirline}</p>}
                                        </div>

                                        {otherAirlineId === "other" && (
                                            <div>
                                                <label className={labelClass}>{t("اسم شركة الطيران", "Airline name")} *</label>
                                                <input
                                                    type="text"
                                                    value={customAirlineName}
                                                    onChange={(e) => { setCustomAirlineName(e.target.value); setErrors((p) => ({ ...p, customAirlineName: undefined })); }}
                                                    className={inputClass}
                                                    placeholder={t("أدخل اسم شركة الطيران", "Enter the airline name")}
                                                />
                                                {errors.customAirlineName && <p className={errorClass}>{errors.customAirlineName}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Note */}
                                <div className="mt-6 flex items-start gap-3 px-5 py-4 rounded-xl bg-[#F0F9FF] border border-[#E0F2FE]">
                                    <svg className="w-5 h-5 text-[#0EA5E9] shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                                    </svg>
                                    <p className="text-sm text-[#334155] leading-relaxed font-medium">
                                        {t(
                                            "يفضّل تأكيد حجز تذكرة الطيران بعد إبلاغكم بصدور الموافقة الأمنية، ثم إرسال التذكرة المؤكدة إلى الموظف المختص الذي يتابع طلبكم.",
                                            "Please confirm your flight booking after we notify you that the security approval has been issued, then send the confirmed ticket to the assigned agent handling your request."
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* ─── 6. Contact Info ──────────────────────── */}
                            <div className="order-6 bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">6</span>
                                    {t("معلومات التواصل", "Contact information")}
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>{t("الاسم الكامل", "Full name")} *</label>
                                        <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }} className={inputClass} placeholder={t("الاسم كما في جواز السفر", "Name as shown on the passport")} />
                                        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t("رقم الواتساب", "WhatsApp number")} *</label>
                                        <input type="tel" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); setErrors((p) => ({ ...p, whatsapp: undefined })); }} className={inputClass} placeholder="+90 555 123 4567" dir="ltr" />
                                        {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>{t("البريد الإلكتروني", "Email")} <span className="text-[#94A3B8] font-normal">{t("(اختياري)", "(Optional)")}</span></label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" dir="ltr" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>{t("ملاحظات إضافية", "Additional notes")} <span className="text-[#94A3B8] font-normal">{t("(اختياري)", "(Optional)")}</span></label>
                                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass + " resize-none min-h-[100px]"} placeholder={t("أي طلبات خاصة أو ملاحظات...", "Any special requests or notes...")} />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* ── Right/Bottom: Price Card ───── */}
                        <div className="w-full lg:w-80 shrink-0">
                            <div className="lg:sticky lg:top-24">
                                <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-md p-4 space-y-3">
                                    <h3 className="text-base font-bold text-[#111] flex items-center gap-2">
                                        <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                            <rect width="16" height="20" x="4" y="2" rx="2" />
                                            <line x1="8" x2="16" y1="6" y2="6" />
                                            <line x1="16" x2="16" y1="14" y2="18" />
                                            <path d="M16 10h.01" />
                                            <path d="M12 10h.01" />
                                            <path d="M8 10h.01" />
                                            <path d="M12 14h.01" />
                                            <path d="M8 14h.01" />
                                            <path d="M12 18h.01" />
                                            <path d="M8 18h.01" />
                                        </svg>
                                        {t("ملخص الأسعار", "Price summary")}
                                    </h3>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between items-center gap-4">
                                            <span className="text-[#6B7280]">{t("الجنسية", "Nationality")}</span>
                                            <span className={`font-bold text-[#111] ${textAlignClass}`}>
                                                {selectedNationalityLabel || "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#6B7280]">{t("السعر الأساسي", "Base price")}</span>
                                            <span className="font-bold text-[#111]">
                                                {selectedNationality && serviceType ? `$${basePrice}` : "—"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-[#6B7280]">{t("رسوم شركة الطيران", "Airline fee")}</span>
                                            <span className={`font-bold ${extraFee > 0 ? "text-[#111]" : "text-green-600"}`}>
                                                {airlineChoice ? (extraFee > 0 ? `+$${extraFee}` : t("مجاناً", "Free")) : "—"}
                                            </span>
                                        </div>
                                        <div className="h-px bg-[#E2E8F0]" />
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold text-[#111] text-base">{t("الإجمالي", "Total")}</span>
                                            <span className="text-xl font-bold text-[#0EA5E9]">
                                                {selectedNationality && serviceType ? `$${total}` : "—"}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-3">
                                        <div className="flex items-center gap-2">
                                            <input
                                                id="agreement"
                                                type="checkbox"
                                                checked={agreedToPolicies}
                                                onChange={(e) => setAgreedToPolicies(e.target.checked)}
                                                className="w-4 h-4 text-[#0EA5E9] border-gray-300 rounded focus:ring-[#0EA5E9]"
                                            />
                                            <label htmlFor="agreement" className="text-xs text-[#0F172A] leading-tight font-medium">
                                                {t("قرأت وأوافق على", "I have read and agree to")}
                                                &nbsp;
                                                <Link href={`/${lang}/terms`} className="text-[#0EA5E9] hover:text-[#0284C7] font-bold" target="_blank">{t("الشروط والأحكام", "Terms & Conditions")}</Link>
                                                &nbsp;{isAr ? "و" : "and"}&nbsp;
                                                <Link href={`/${lang}/refund-policy`} className="text-[#0EA5E9] hover:text-[#0284C7] font-bold" target="_blank">{t("سياسة الاسترداد", "Refund Policy")}</Link>
                                            </label>
                                        </div>
                                        {errors.agreement && <p className="text-xs text-red-500 mt-1.5 font-bold">{errors.agreement}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || !agreedToPolicies}
                                        className={`w-full flex items-center justify-center gap-2.5 text-white rounded-xl px-6 py-3 text-sm font-bold shadow-md transition-all duration-200 ${
                                            agreedToPolicies
                                                ? "bg-[#25D366] hover:bg-[#1da851] active:scale-[0.98] cursor-pointer"
                                                : "bg-gray-400 cursor-not-allowed"
                                        } disabled:opacity-60`}
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                        )}
                                        {loading ? t("جاري الإرسال...", "Sending...") : t("إرسال عبر واتساب", "Send via WhatsApp")}
                                    </button>

                                    <p className="text-[10px] text-[#94A3B8] text-center leading-snug">
                                        {t("سيتم توجيهك إلى واتساب لإتمام الحجز", "You will be redirected to WhatsApp to complete the booking")}
                                    </p>
                                </div>

                                {/* Important Notes */}
                                <div className={`mt-6 bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm ${textAlignClass}`}>
                                    <h4 className="font-bold text-amber-700 mb-3 text-sm flex items-center gap-1.5">
                                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {t("ملاحظات مهمة", "Important notes")}
                                    </h4>
                                    <ul className="text-xs text-amber-900 space-y-2.5">
                                        <li className={`relative ${noteItemPaddingClass}`}>
                                            <span className={`absolute ${noteItemBulletClass} top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500`}></span>
                                            {t(
                                                "الموافقة الأمنية صالحة للسفر لمرة واحدة فقط خلال مدة أقصاها 3 أشهر من تاريخ إصدارها.",
                                                "The security approval is valid for one trip only and up to 3 months from the issue date."
                                            )}
                                        </li>
                                        <li className={`relative ${noteItemPaddingClass}`}>
                                            <span className={`absolute ${noteItemBulletClass} top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500`}></span>
                                            {t(
                                                "بعد تقديم طلب الموافقة الأمنية وبدء الإجراءات لا يمكن إلغاء الطلب.",
                                                "Once submitted, the request cannot be cancelled."
                                            )}
                                        </li>
                                        <li className={`relative ${noteItemPaddingClass}`}>
                                            <span className={`absolute ${noteItemBulletClass} top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500`}></span>
                                            {t(
                                                "في حال رفض الطلب أمنياً يتم خصم 40$ كمصاريف إدارية واسترجاع باقي المبلغ خلال 5 إلى 15 يوم عمل.",
                                                "If rejected, $40 will be deducted and the remaining amount refunded within 5–15 business days."
                                            )}
                                        </li>
                                        <li className={`relative ${noteItemPaddingClass}`}>
                                            <span className={`absolute ${noteItemBulletClass} top-1.5 w-1.5 h-1.5 rounded-full bg-amber-500`}></span>
                                            {t(
                                                "أي تعديل بعد صدور الموافقة الأمنية قد يترتب عليه رسوم إضافية.",
                                                "Any changes after approval may incur additional fees."
                                            )}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {/* ─── Confirmation Modal ─────────────────────────── */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center mx-auto mb-5">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-[#111] mb-3">{t("تم تجهيز طلبك!", "Your request is ready!")}</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed mb-2">
                            {t("سيتم فتح واتساب لإرسال تفاصيل الحجز.", "WhatsApp will open so you can send the booking details.")}
                        </p>
                        <div className={`bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 ${textAlignClass}`}>
                            <p className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                {t("خطوة مهمة", "Important step")}
                            </p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                {t("بعد فتح واتساب وإرسال الرسالة، قم بإرسال صورة جواز السفر أو الوثيقة في ", "After WhatsApp opens and you send the message, please send the passport or document image in ")}
                                <strong>{t("نفس المحادثة", "the same chat")}</strong>
                                .
                            </p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2.5 bg-[#25D366] text-white rounded-xl px-6 py-3.5 text-sm font-bold hover:bg-[#1da851] transition-all shadow-md"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                {t("فتح واتساب وإرسال الطلب", "Open WhatsApp and send the request")}
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="text-sm text-[#6B7280] hover:text-[#111] transition-colors py-2"
                            >
                                {t("إغلاق", "Close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}


        </section>
    );
}

