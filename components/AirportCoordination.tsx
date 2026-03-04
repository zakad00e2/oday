"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import {
    price24,
    price72,
    EXTRA_AIRLINE_FEE,
    AIRLINES,
    ACCEPTED_EXTENSIONS,
    ACCEPTED_FILE_TYPES,
    MAX_FILE_SIZE,
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
    serviceType?: string;
    file?: string;
    country?: string;
    airport?: string;
    airline?: string;
    otherAirline?: string;
    customAirlineName?: string;
    fullName?: string;
    whatsapp?: string;
}

/* ─── Component ──────────────────────────────────────────────── */
export default function AirportCoordination() {
    // ── Service type
    const [serviceType, setServiceType] = useState<ServiceType>(null);

    // ── File upload
    const [file, setFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // ── Arrival details
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [airport, setAirport] = useState("");
    const [arrivalDate, setArrivalDate] = useState("");
    const [arrivalTime, setArrivalTime] = useState("");
    const [flightNumber, setFlightNumber] = useState("");

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
    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [whatsappUrl, setWhatsappUrl] = useState("");

    /* ─── Pricing ───────────────────────────────────────────────── */
    const basePrice = serviceType === "24h" ? price24 : serviceType === "72h" ? price72 : 0;
    const extraFee = useMemo(() => {
        if (!airlineChoice) return 0;
        return airlineChoice === "egyptair" ? 0 : EXTRA_AIRLINE_FEE;
    }, [airlineChoice]);
    const total = basePrice + extraFee;

    /* ─── Airline display name ─────────────────────────────────── */
    const resolvedAirlineName = useMemo(() => {
        if (airlineChoice === "egyptair") return "مصر للطيران (EgyptAir)";
        if (!otherAirlineId) return "";
        if (otherAirlineId === "other") return customAirlineName || "أخرى";
        const found = AIRLINES.find((a) => a.id === otherAirlineId);
        return found ? `${found.labelAr} (${found.labelEn})` : "";
    }, [airlineChoice, otherAirlineId, customAirlineName]);

    /* ─── File handler ─────────────────────────────────────────── */
    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!ACCEPTED_FILE_TYPES.includes(f.type)) {
            setErrors((prev) => ({ ...prev, file: "نوع الملف غير مدعوم. يُقبل: JPG, PNG, PDF" }));
            return;
        }
        if (f.size > MAX_FILE_SIZE) {
            setErrors((prev) => ({ ...prev, file: "حجم الملف يتجاوز 10 ميغابايت" }));
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
    }, []);

    const removeFile = useCallback(() => {
        setFile(null);
        setFilePreview(null);
        if (fileRef.current) fileRef.current.value = "";
    }, []);

    /* ─── Validation ───────────────────────────────────────────── */
    const validate = useCallback((): boolean => {
        const errs: FormErrors = {};

        if (!serviceType) errs.serviceType = "يرجى اختيار نوع الخدمة";
        if (!file) errs.file = "يرجى رفع صورة جواز السفر أو وثيقة اللجوء";
        if (!country.trim()) errs.country = "يرجى إدخال بلد المغادرة";
        if (!airport.trim()) errs.airport = "يرجى إدخال مطار الوصول";

        if (!airlineChoice) {
            errs.airline = "يرجى اختيار شركة الطيران";
        } else if (airlineChoice === "other" && !otherAirlineId) {
            errs.otherAirline = "يرجى اختيار شركة الطيران من القائمة";
        } else if (airlineChoice === "other" && otherAirlineId === "other" && !customAirlineName.trim()) {
            errs.customAirlineName = "يرجى كتابة اسم شركة الطيران";
        }

        if (!fullName.trim()) errs.fullName = "يرجى إدخال الاسم الكامل";
        if (!whatsapp.trim()) errs.whatsapp = "يرجى إدخال رقم الواتساب";

        setErrors(errs);
        return Object.keys(errs).length === 0;
    }, [serviceType, file, country, airport, airlineChoice, otherAirlineId, customAirlineName, fullName, whatsapp]);

    /* ─── Submit ───────────────────────────────────────────────── */
    const handleSubmit = useCallback(
        (e: React.FormEvent) => {
            e.preventDefault();
            if (!validate()) return;

            setLoading(true);

            const formData: AirportFormData = {
                serviceType: serviceType!,
                basePrice,
                airlineName: resolvedAirlineName,
                extraFee,
                total,
                fileName: file?.name || "",
                country: country.trim(),
                city: city.trim(),
                airport: airport.trim(),
                arrivalDate,
                arrivalTime,
                flightNumber: flightNumber.trim(),
                fullName: fullName.trim(),
                whatsappNumber: whatsapp.trim(),
                email: email.trim(),
                notes: notes.trim(),
            };

            const message = buildWhatsAppMessage(formData);
            const url = buildWhatsAppUrl(message);

            // Small delay to feel natural
            setTimeout(() => {
                setWhatsappUrl(url);
                setShowConfirmModal(true);
                setLoading(false);
            }, 600);
        },
        [validate, serviceType, basePrice, resolvedAirlineName, extraFee, total, file, country, city, airport, arrivalDate, arrivalTime, flightNumber, fullName, whatsapp, email, notes]
    );

    /* ─── Helpers ──────────────────────────────────────────────── */
    const labelClass = "block text-sm font-semibold text-[#0F172A] mb-1.5";
    const inputClass =
        "w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] transition-all";
    const errorClass = "text-xs text-red-500 mt-1 font-medium";

    const otherAirlines = AIRLINES.filter((a) => !a.isEgyptAir);

    /* ─── Render ───────────────────────────────────────────────── */
    return (
        <section className="py-20 bg-[#FAFAFA] min-h-screen">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] rounded-full px-4 py-1.5 mb-5 shadow-sm">
                        <svg className="w-4 h-4 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                        <span className="text-xs font-medium text-[#111]">تنسيقات المطار</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-medium text-[#111] leading-tight mb-4">
                        حجز <span className="font-semibold">تنسيقات المطار</span>
                    </h1>
                    <p className="text-[#6B7280] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
                        احصل على تأشيرتك بسهولة وسرعة. اختر نوع الخدمة وأكمل البيانات أدناه.
                    </p>
                </div>

                {/* Layout: Form + Price Card */}
                <form id="airport-form" onSubmit={handleSubmit} noValidate>
                    <div className="flex flex-col lg:flex-row gap-8 items-stretch">
                        {/* ── Left: Form Sections ─────────────────────── */}
                        <div className="flex-1 w-full space-y-6">

                            {/* ─── 1. Service Type ──────────────────────── */}
                            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">1</span>
                                    نوع الخدمة
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {/* 24h card */}
                                    <button
                                        type="button"
                                        onClick={() => { setServiceType("24h"); setErrors((p) => ({ ...p, serviceType: undefined })); }}
                                        className={`relative rounded-xl border-2 p-5 text-right transition-all duration-200 cursor-pointer ${serviceType === "24h"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-sm"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        {serviceType === "24h" && (
                                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#0EA5E9] flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                        <svg className="w-6 h-6 text-[#0EA5E9] mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                                        <h3 className="font-bold text-[#111] text-base mb-1">تأشيرة خلال 24 ساعة</h3>
                                        <p className="text-sm text-[#6B7280]">معالجة سريعة خلال يوم واحد</p>
                                        <div className="mt-3 text-xl font-bold text-[#0EA5E9]">${price24}</div>
                                    </button>

                                    {/* 72h card */}
                                    <button
                                        type="button"
                                        onClick={() => { setServiceType("72h"); setErrors((p) => ({ ...p, serviceType: undefined })); }}
                                        className={`relative rounded-xl border-2 p-5 text-right transition-all duration-200 cursor-pointer ${serviceType === "72h"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF] shadow-sm"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        {serviceType === "72h" && (
                                            <div className="absolute top-3 left-3 w-5 h-5 rounded-full bg-[#0EA5E9] flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                        )}
                                        <svg className="w-6 h-6 text-[#0EA5E9] mb-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <h3 className="font-bold text-[#111] text-base mb-1">تأشيرة خلال 72 ساعة</h3>
                                        <p className="text-sm text-[#6B7280]">معالجة خلال ثلاثة أيام عمل</p>
                                        <div className="mt-3 text-xl font-bold text-[#0EA5E9]">${price72}</div>
                                    </button>
                                </div>
                                {errors.serviceType && <p className={errorClass}>{errors.serviceType}</p>}
                            </div>

                            {/* ─── 2. Upload Document ───────────────────── */}
                            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">2</span>
                                    رفع المستند
                                </h2>
                                <p className="text-sm text-[#6B7280] mb-4">
                                    صورة جواز السفر أو وثيقة اللجوء الأوروبية <span className="text-[#94A3B8]">(JPG, PNG, PDF — حد أقصى 10 ميغابايت)</span>
                                </p>

                                {!file ? (
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#CBD5E1] rounded-xl py-10 cursor-pointer hover:border-[#0EA5E9] hover:bg-[#F0F9FF]/50 transition-all">
                                        <svg className="w-10 h-10 text-[#94A3B8] mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <span className="text-sm font-medium text-[#6B7280]">اضغط لاختيار الملف أو اسحبه هنا</span>
                                        <input
                                            ref={fileRef}
                                            type="file"
                                            accept={ACCEPTED_EXTENSIONS}
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>
                                ) : (
                                    <div className="relative border border-[#E2E8F0] rounded-xl p-4 flex items-center gap-4 bg-[#F8FAFC]">
                                        {filePreview ? (
                                            <img src={filePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-[#E2E8F0]" />
                                        ) : (
                                            <div className="w-20 h-20 rounded-lg bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center">
                                                <svg className="w-8 h-8 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-[#111] truncate">{file.name}</p>
                                            <p className="text-xs text-[#94A3B8] mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                        <button type="button" onClick={removeFile} className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                )}
                                {errors.file && <p className={errorClass}>{errors.file}</p>}
                            </div>

                            {/* ─── 3. Arrival Details ───────────────────── */}
                            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">3</span>
                                    تفاصيل الوصول
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>بلد المغادرة *</label>
                                        <input type="text" value={country} onChange={(e) => { setCountry(e.target.value); setErrors((p) => ({ ...p, country: undefined })); }} className={inputClass} placeholder="مثال: اليونان" />
                                        {errors.country && <p className={errorClass}>{errors.country}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>المدينة <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className={inputClass} placeholder="مثال: أثينا" />
                                    </div>
                                    <div>
                                        <label className={labelClass}>مطار الوصول *</label>
                                        <input type="text" value={airport} onChange={(e) => { setAirport(e.target.value); setErrors((p) => ({ ...p, airport: undefined })); }} className={inputClass} placeholder="مثال: مطار القاهرة الدولي" />
                                        {errors.airport && <p className={errorClass}>{errors.airport}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>تاريخ الوصول <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <input type="date" value={arrivalDate} onChange={(e) => setArrivalDate(e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>وقت الوصول <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <input type="time" value={arrivalTime} onChange={(e) => setArrivalTime(e.target.value)} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className={labelClass}>رقم الرحلة <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <input type="text" value={flightNumber} onChange={(e) => setFlightNumber(e.target.value)} className={inputClass} placeholder="مثال: MS 700" />
                                    </div>
                                </div>
                            </div>

                            {/* ─── 4. Airline ────────────────────────────── */}
                            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">4</span>
                                    شركة الطيران
                                </h2>

                                <div className="grid sm:grid-cols-2 gap-4 mb-4">
                                    {/* EgyptAir */}
                                    <button
                                        type="button"
                                        onClick={() => { setAirlineChoice("egyptair"); setErrors((p) => ({ ...p, airline: undefined, otherAirline: undefined })); }}
                                        className={`rounded-xl border-2 p-4 text-right transition-all duration-200 cursor-pointer ${airlineChoice === "egyptair"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF]"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <h3 className="font-bold text-[#111] text-sm mb-0.5">مصر للطيران (EgyptAir)</h3>
                                        <p className="text-xs text-green-600 font-medium flex items-center gap-1">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                                            بدون رسوم إضافية
                                        </p>
                                    </button>

                                    {/* Other */}
                                    <button
                                        type="button"
                                        onClick={() => { setAirlineChoice("other"); setErrors((p) => ({ ...p, airline: undefined })); }}
                                        className={`rounded-xl border-2 p-4 text-right transition-all duration-200 cursor-pointer ${airlineChoice === "other"
                                            ? "border-[#0EA5E9] bg-[#F0F9FF]"
                                            : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
                                            }`}
                                    >
                                        <h3 className="font-bold text-[#111] text-sm mb-0.5">شركة طيران أخرى</h3>
                                        <p className="text-xs text-amber-600 font-medium">رسوم إضافية ${EXTRA_AIRLINE_FEE} +</p>
                                    </button>
                                </div>

                                {errors.airline && <p className={errorClass}>{errors.airline}</p>}

                                {/* Other airline dropdown */}
                                {airlineChoice === "other" && (
                                    <div className="space-y-4 mt-4 p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                                        <div>
                                            <label className={labelClass}>اختر شركة الطيران *</label>
                                            <select
                                                value={otherAirlineId}
                                                onChange={(e) => { setOtherAirlineId(e.target.value); setErrors((p) => ({ ...p, otherAirline: undefined })); }}
                                                className={inputClass + " cursor-pointer"}
                                            >
                                                <option value="">— اختر —</option>
                                                {otherAirlines.map((a) => (
                                                    <option key={a.id} value={a.id}>
                                                        {a.labelAr} ({a.labelEn})
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.otherAirline && <p className={errorClass}>{errors.otherAirline}</p>}
                                        </div>

                                        {otherAirlineId === "other" && (
                                            <div>
                                                <label className={labelClass}>اسم شركة الطيران *</label>
                                                <input
                                                    type="text"
                                                    value={customAirlineName}
                                                    onChange={(e) => { setCustomAirlineName(e.target.value); setErrors((p) => ({ ...p, customAirlineName: undefined })); }}
                                                    className={inputClass}
                                                    placeholder="أدخل اسم شركة الطيران"
                                                />
                                                {errors.customAirlineName && <p className={errorClass}>{errors.customAirlineName}</p>}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ─── 5. Contact Info ──────────────────────── */}
                            <div className="bg-white rounded-2xl border border-[#F3F4F6] shadow-sm p-6">
                                <h2 className="text-lg font-bold text-[#111] mb-4 flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-full bg-[#0EA5E9] text-white text-xs font-bold flex items-center justify-center">5</span>
                                    معلومات التواصل
                                </h2>
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className={labelClass}>الاسم الكامل *</label>
                                        <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); setErrors((p) => ({ ...p, fullName: undefined })); }} className={inputClass} placeholder="الاسم كما في جواز السفر" />
                                        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>رقم الواتساب *</label>
                                        <input type="tel" value={whatsapp} onChange={(e) => { setWhatsapp(e.target.value); setErrors((p) => ({ ...p, whatsapp: undefined })); }} className={inputClass} placeholder="+90 555 123 4567" dir="ltr" />
                                        {errors.whatsapp && <p className={errorClass}>{errors.whatsapp}</p>}
                                    </div>
                                    <div>
                                        <label className={labelClass}>البريد الإلكتروني <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="email@example.com" dir="ltr" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className={labelClass}>ملاحظات إضافية <span className="text-[#94A3B8] font-normal">(اختياري)</span></label>
                                        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass + " resize-none min-h-[100px]"} placeholder="أي طلبات خاصة أو ملاحظات..." />
                                    </div>
                                </div>
                            </div>

                            {/* Spacer for fixed mobile bar */}
                            <div className="lg:hidden h-24" />
                        </div>

                        {/* ── Right: Sticky Price Card (desktop) ───── */}
                        <div className="hidden lg:block w-80 shrink-0">
                            <div className="sticky top-24 bg-white rounded-2xl border border-[#F3F4F6] shadow-md p-6 space-y-5">
                                <h3 className="text-base font-bold text-[#111] flex items-center gap-2">
                                    <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                                    </svg>
                                    ملخص الأسعار
                                </h3>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#6B7280]">السعر الأساسي</span>
                                        <span className="font-bold text-[#111]">
                                            {serviceType ? `$${basePrice}` : "—"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[#6B7280]">رسوم شركة الطيران</span>
                                        <span className={`font-bold ${extraFee > 0 ? "text-amber-600" : "text-green-600"}`}>
                                            {airlineChoice ? (extraFee > 0 ? `+$${extraFee}` : "مجاناً") : "—"}
                                        </span>
                                    </div>
                                    <div className="h-px bg-[#E2E8F0]" />
                                    <div className="flex justify-between items-center">
                                        <span className="font-bold text-[#111] text-base">الإجمالي</span>
                                        <span className="text-xl font-bold text-[#0EA5E9]">
                                            {serviceType ? `$${total}` : "—"}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2.5 bg-[#25D366] text-white rounded-xl px-6 py-3.5 text-sm font-bold hover:bg-[#1da851] active:scale-[0.98] transition-all duration-200 shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                                    )}
                                    {loading ? "جاري الإرسال..." : "إرسال عبر واتساب"}
                                </button>

                                <p className="text-[10px] text-[#94A3B8] text-center leading-snug">
                                    سيتم توجيهك إلى واتساب لإتمام الحجز
                                </p>
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
                        <h3 className="text-xl font-bold text-[#111] mb-3">تم تجهيز طلبك!</h3>
                        <p className="text-sm text-[#6B7280] leading-relaxed mb-2">
                            سيتم فتح واتساب لإرسال تفاصيل الحجز.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-right mb-6">
                            <p className="text-sm font-semibold text-amber-800 mb-1 flex items-center gap-1.5">
                                <svg className="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                                خطوة مهمة
                            </p>
                            <p className="text-xs text-amber-700 leading-relaxed">
                                بعد فتح واتساب وإرسال الرسالة، قم بإرسال صورة جواز السفر أو الوثيقة في <strong>نفس المحادثة</strong>.
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
                                فتح واتساب وإرسال الطلب
                            </a>
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                className="text-sm text-[#6B7280] hover:text-[#111] transition-colors py-2"
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Fixed Mobile Bottom Bar ─────────────────── */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E2E8F0] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 flex items-center justify-between gap-3">
                <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#94A3B8] font-medium">الإجمالي</span>
                    <span className="text-lg font-bold text-[#0EA5E9] leading-tight">
                        {serviceType ? `$${total}` : "—"}
                    </span>
                </div>
                <button
                    type="submit"
                    form="airport-form"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white rounded-xl px-5 py-3 text-sm font-bold hover:bg-[#1da851] active:scale-[0.98] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                    )}
                    {loading ? "جاري الإرسال..." : "إرسال عبر واتساب"}
                </button>
            </div>
        </section>
    );
}
