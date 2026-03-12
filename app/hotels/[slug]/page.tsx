"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getHotelBySlug } from "@/lib/hotels-data";
import { useCart } from "@/lib/cart-context";
import ScrollReveal from "@/components/ScrollReveal";

/* ─── Hero ─────────────────────────────────────────────────── */
function HotelDetailHero({ hotel, onBookNow }: { hotel: ReturnType<typeof getHotelBySlug> & object; onBookNow: () => void }) {
    const images = hotel.gallery ?? [];
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;
        const timer = setInterval(() => setIdx((i) => (i + 1) % images.length), 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <section className="w-full px-3 md:px-5 pt-20 pb-10">
            <div className="mx-auto max-w-[1600px]">

                {/* ── Main Image ── */}
                <div className="relative overflow-hidden rounded-[2rem] h-[58vh] sm:h-[65vh] md:h-[78vh] flex flex-col justify-end shadow-2xl mb-3">

                    {images.map((src, i) => (
                        <Image
                            key={src}
                            src={src}
                            alt={`${hotel.name} - ${i + 1}`}
                            fill
                            priority={i === 0}
                            sizes="100vw"
                            className={`object-cover transition-opacity duration-700 ${i === idx ? "opacity-100" : "opacity-0"}`}
                        />
                    ))}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    {/* Content */}
                    <div className="relative z-10 w-full max-w-[900px] px-5 md:px-14 pb-8 md:pb-12 pt-32 md:pt-48">
                        <ScrollReveal delay={100}>
                            <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-2 sm:mb-4 max-w-3xl" style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}>
                                {hotel.name}
                            </h1>
                        </ScrollReveal>
                        <ScrollReveal delay={200}>
                            <div className="flex items-center gap-1 mb-5 sm:mb-8">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <svg key={i} className={`w-5 h-5 ${i < hotel.stars ? "text-amber-400" : "text-white/20"}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className="text-white/70 text-sm mr-2">{hotel.stars} نجوم</span>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={300}>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={onBookNow}
                                    className="group inline-flex items-center gap-2 sm:gap-2.5 pr-5 pl-2 py-2 sm:pr-7 sm:pl-2.5 sm:py-2.5 rounded-full bg-gradient-to-l from-[#0369A1] via-[#0284C7] to-[#0EA5E9] text-white text-sm sm:text-base font-semibold shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_24px_rgba(14,165,233,0.55)] hover:scale-105 hover:brightness-110 transition-all duration-300 border border-white/20 cursor-pointer"
                                >
                                    احجز الآن
                                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0284C7] shadow-md shrink-0">
                                        <svg className="w-3.5 h-3.5 scale-x-[-1]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </span>
                                </button>
                                <a
                                    href="#gallery"
                                    className="inline-flex items-center gap-2 border border-white/30 bg-white/10 backdrop-blur-sm text-white font-semibold px-4 py-2 sm:px-5 sm:py-2.5 rounded-full hover:bg-white/20 hover:border-white/50 hover:scale-105 transition-all duration-300 text-xs sm:text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    شاهد الصور
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {/* ── Thumbnails ── */}
                {images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto py-2 px-2" style={{ scrollbarWidth: "none" }}>
                        {images.map((src, i) => (
                            <button
                                key={i}
                                onClick={() => setIdx(i)}
                                className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
                                    i === idx
                                        ? "ring-2 ring-[#0EA5E9] ring-offset-2 opacity-100 scale-[1.04]"
                                        : "opacity-60 hover:opacity-90"
                                }`}
                                style={{ width: "90px", height: "60px" }}
                            >
                                <Image
                                    src={src}
                                    alt={`${hotel.name} - ${i + 1}`}
                                    fill
                                    sizes="90px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                )}

            </div>
        </section>
    );
}

/* ─── Gallery ───────────────────────────────────────────────── */
function HotelGallery({ images, name, youtubeUrl }: { images: string[]; name: string; youtubeUrl?: string }) {
    const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
    return (
        <section id="gallery" className="py-10 md:py-14 border-b border-[#e2e8f0] scroll-mt-24">
            <ScrollReveal>
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#8B5CF6]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">صور الفندق</h2>
                </div>
            </ScrollReveal>

            {youtubeUrl ? (
                /* Video + Images layout */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                    {/* Video - takes full height on mobile, 2 rows on desktop */}
                    <ScrollReveal delay={0} className="md:row-span-2 w-full h-full">
                        <div className="relative rounded-2xl overflow-hidden shadow-lg border border-[#f0f0f0] w-full h-full min-h-[300px] aspect-[9/16] md:aspect-auto">
                            <iframe
                                src={youtubeUrl}
                                title="فيديو الفندق"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full absolute inset-0"
                            />
                        </div>
                    </ScrollReveal>

                    {/* Images beside video */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-4">
                        {images.slice(0, 4).map((img, i) => (
                            <ScrollReveal key={i} delay={(i + 1) * 60} className="w-full h-full">
                                <button
                                    onClick={() => setLightboxIdx(i)}
                                    className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-square w-full h-full block"
                                >
                                    <Image
                                        src={img}
                                        alt={`${name} - صورة ${i + 1}`}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                        <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                        </svg>
                                    </div>
                                </button>
                            </ScrollReveal>
                        ))}
                    </div>

                    {/* Extra images below */}
                    {images.length > 4 && (
                        <div className="col-span-full grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mt-3">
                            {images.slice(4).map((img, i) => (
                                <ScrollReveal key={i + 4} delay={(i + 5) * 60} className="w-full h-full">
                                    <button
                                        onClick={() => setLightboxIdx(i + 4)}
                                        className="relative overflow-hidden rounded-2xl group cursor-pointer aspect-square w-full h-full block"
                                    >
                                        <Image
                                            src={img}
                                            alt={`${name} - صورة ${i + 5}`}
                                            fill
                                            sizes="(max-width: 768px) 50vw, 33vw"
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                            </svg>
                                        </div>
                                    </button>
                                </ScrollReveal>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                /* Images only grid */
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    {images.map((img, i) => (
                        <ScrollReveal
                            key={i}
                            delay={i * 60}
                            className={i === 0 ? "col-span-2 md:col-span-2 row-span-2 w-full h-full" : "w-full h-full"}
                        >
                            <button
                                onClick={() => setLightboxIdx(i)}
                                className="relative w-full h-full overflow-hidden rounded-2xl group cursor-pointer aspect-square block"
                            >
                                <Image
                                    src={img}
                                    alt={`${name} - صورة ${i + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                    </svg>
                                </div>
                            </button>
                        </ScrollReveal>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightboxIdx !== null && (
                <div
                    className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxIdx(null)}
                >
                    <button
                        className="absolute top-6 left-6 text-white/80 hover:text-white transition z-10 cursor-pointer"
                        onClick={() => setLightboxIdx(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Prev */}
                    <button
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : images.length - 1));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Next */}
                    <button
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition p-2 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            setLightboxIdx((prev) => (prev !== null && prev < images.length - 1 ? prev + 1 : 0));
                        }}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <img
                        src={images[lightboxIdx]}
                        alt={`${name} - صورة ${lightboxIdx + 1}`}
                        className="max-w-full max-h-[85vh] object-contain rounded-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />

                    {/* Counter */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">
                        {lightboxIdx + 1} / {images.length}
                    </div>
                </div>
            )}
        </section>
    );
}

export default function HotelDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const hotel = getHotelBySlug(slug);
    const { setHotel, cart, openCart, setNights } = useCart();
    const isInCart = cart.hotel?.id === hotel?.id;

    const [selectedRoom, setSelectedRoom] = useState(0);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [savedRoom, setSavedRoom] = useState<number | null>(null);
    const [savedCheckIn, setSavedCheckIn] = useState<string | null>(null);
    const [savedCheckOut, setSavedCheckOut] = useState<string | null>(null);

    const hasChanges = isInCart && savedRoom !== null && (
        selectedRoom !== savedRoom ||
        checkIn !== savedCheckIn ||
        checkOut !== savedCheckOut
    );

    const nights = Math.max(1, Math.round(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000
    ));

    const scrollToBooking = () => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (!hotel) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0f172a] mb-4">404</h1>
                    <p className="text-[#64748b] text-lg">الفندق غير موجود</p>
                    <Link href="/hotels" className="inline-block mt-6 bg-[#0EA5E9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0284C7] transition">
                        العودة للفنادق
                    </Link>
                </div>
            </main>
        );
    }

    const room = hotel.rooms[selectedRoom];
    const totalPrice = room.price * nights;

    return (
        <main className="bg-[#FAFAFA]">
            <HotelDetailHero hotel={hotel} onBookNow={scrollToBooking} />

            <div className="max-w-[1100px] mx-auto px-4 md:px-8 lg:px-12">

                {/* ── Overview + Amenities ── */}
                <div className="py-10 md:py-14 border-b border-[#e2e8f0]">
                    {/* Description */}
                    <section className="mb-10">
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">نبذة عن الفندق</h2>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={100}>
                            <p className="text-[#444] text-base md:text-lg leading-[2] max-w-3xl whitespace-pre-line">{hotel.description}</p>
                        </ScrollReveal>
                    </section>

                    {/* Amenities */}
                    <section>
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">المرافق والخدمات</h2>
                            </div>
                        </ScrollReveal>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {hotel.amenities.map((item, i) => (
                                <ScrollReveal key={item.label} delay={i * 40}>
                                    <div className="flex items-center gap-2.5 px-1 py-2">
                                        <svg className="w-4 h-4 text-[#10B981] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm text-[#374151] font-medium leading-snug">{item.label}</span>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                </div>

                {/* ── Booking Section ── */}
                <div id="booking" className="py-10 md:py-14 scroll-mt-24" dir="rtl">
                    <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="px-6 md:px-8 py-5 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#f8fafc]">
                            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#0f172a]">اختر غرفتك واحجز</h2>
                                <p className="text-xs text-[#64748b] mt-0.5">حدد نوع الغرفة وعدد الليالي</p>
                            </div>
                        </div>

                        {/* Room + Nights grid */}
                        <div className="px-6 md:px-8 py-7 border-b border-[#e2e8f0] grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

                            {/* Room selector */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-bold text-[#0f172a]">نوع الغرفة</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {hotel.rooms.map((r, i) => {
                                        const isSelected = selectedRoom === i;
                                        return (
                                            <div
                                                key={r.name}
                                                role="radio"
                                                aria-checked={isSelected}
                                                tabIndex={0}
                                                onClick={() => setSelectedRoom(i)}
                                                onKeyDown={(e) => e.key === "Enter" && setSelectedRoom(i)}
                                                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-[#0EA5E9] bg-[#0EA5E9]/5" : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0EA5E9]/40"}`}
                                            >
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-start gap-2.5 flex-1">
                                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-[#cbd5e1]"}`}>
                                                            {isSelected && (
                                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#0f172a] text-sm leading-tight">{r.name}</p>
                                                            <p className="text-xs text-[#64748b] mt-0.5">{r.description}</p>
                                                        </div>
                                                    </div>
                                                    <span className={`font-black shrink-0 ${isSelected ? "text-[#0EA5E9]" : "text-[#0f172a]"}`}>
                                                        ${r.price.toLocaleString("en-US")}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-[#0f172a]">تواريخ الإقامة</h3>
                                </div>


                                {/* Check-in */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#64748b]">تاريخ الوصول</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={checkIn}
                                            min={today}
                                            onChange={(e) => {
                                                setCheckIn(e.target.value);
                                                if (e.target.value >= checkOut) {
                                                    const d = new Date(e.target.value); d.setDate(d.getDate() + 1); const next = d.toISOString().split("T")[0];
                                                    setCheckOut(next);
                                                }
                                            }}
                                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] transition cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Check-out */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-semibold text-[#64748b]">تاريخ المغادرة</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={checkOut}
                                            min={(() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })()}
                                            onChange={(e) => setCheckOut(e.target.value)}
                                            className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-2.5 text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30 focus:border-[#0EA5E9] transition cursor-pointer"
                                        />
                                    </div>
                                </div>

                                {/* Nights badge */}
                                <div className="flex items-center gap-2 bg-[#F0F9FF] border border-[#E0F2FE] rounded-xl px-4 py-2.5">
                                    <svg className="w-4 h-4 text-[#0EA5E9] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <span className="text-sm font-medium text-[#0f172a]">{nights} {nights === 1 ? "ليلة" : "ليالٍ"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Total + CTA */}
                        <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                            <div>
                                <p className="text-sm text-[#64748b] mb-1">الإجمالي التقديري لـ {nights} {nights === 1 ? "ليلة" : "ليالٍ"}</p>
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-4xl font-extrabold text-[#0EA5E9]">${totalPrice.toLocaleString("en-US")}</span>
                                    <span className="text-sm text-[#94a3b8]">({room.name})</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        setHotel({
                                            id: hotel.id,
                                            slug: hotel.slug,
                                            name: hotel.name,
                                            city: hotel.city,
                                            image: hotel.image,
                                            pricePerNight: room.price,
                                            stars: hotel.stars,
                                        });
                                        setNights(nights);
                                        setSavedRoom(selectedRoom);
                                        setSavedCheckIn(checkIn);
                                        setSavedCheckOut(checkOut);
                                        openCart();
                                    }}
                                    className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 rounded-2xl font-bold text-base transition-all duration-300 active:scale-[0.97] ${
                                        hasChanges
                                            ? "bg-[#0284C7] text-white hover:bg-[#0369A1]"
                                            : isInCart
                                            ? "bg-[#dcfce7] text-[#15803d] border-2 border-[#86efac] hover:bg-[#bbf7d0]"
                                            : "bg-[#0284C7] text-white hover:bg-[#0369A1]"
                                    }`}
                                >
                                    {hasChanges ? (
                                        <>
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            تعديل الحجز
                                        </>
                                    ) : isInCart ? (
                                        <>
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            تمت الإضافة لبرنامجك
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            أضف لبرنامجك
                                        </>
                                    )}
                                </button>
                                <p className="text-[11px] text-[#94a3b8]">سيتواصل معك فريقنا لتأكيد الحجز</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Gallery ── */}
                <HotelGallery images={hotel.gallery} name={hotel.name} youtubeUrl={hotel.youtubeUrl} />

            </div>
        </main>
    );
}
