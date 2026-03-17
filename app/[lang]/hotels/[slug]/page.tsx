"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getHotelBySlug } from "@/lib/hotels-data";
import { useCart } from "@/lib/cart-context";
import ScrollReveal from "@/components/ScrollReveal";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { hotelAddOnsEn, hotelDetailEn } from "@/lib/hotel-detail-locales";

/* ─── Hero ─────────────────────────────────────────────────── */
function HotelDetailHero({
    hotel,
    onBookNow,
    isAr,
    labels,
}: {
    hotel: ReturnType<typeof getHotelBySlug> & object;
    onBookNow: () => void;
    isAr: boolean;
    labels: { stars: string; bookNow: string; viewGallery: string };
}) {
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
                                <span className={`text-white/70 text-sm ${isAr ? "mr-2" : "ml-2"}`}>{hotel.stars} {labels.stars}</span>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={300}>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={onBookNow}
                                    className="group inline-flex items-center gap-2 sm:gap-2.5 ps-5 pe-2 py-2 sm:ps-7 sm:pe-2.5 sm:py-2.5 rounded-full bg-gradient-to-l from-[#0369A1] via-[#0284C7] to-[#0EA5E9] text-white text-sm sm:text-base font-semibold shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_24px_rgba(14,165,233,0.55)] hover:scale-105 hover:brightness-110 transition-all duration-300 border border-white/20 cursor-pointer"
                                >
                                    {labels.bookNow}
                                    <span className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-[#0284C7] shadow-md shrink-0">
                                        <svg className={`w-3.5 h-3.5 ${isAr ? "scale-x-[-1]" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
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
                                    {labels.viewGallery}
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
function HotelGallery({
    images,
    name,
    youtubeUrl,
    title,
    videoTitle,
    imageLabel,
}: {
    images: string[];
    name: string;
    youtubeUrl?: string;
    title: string;
    videoTitle: string;
    imageLabel: string;
}) {
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
                    <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">{title}</h2>
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
                                title={videoTitle}
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
                                        alt={`${name} - ${imageLabel} ${i + 1}`}
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
                                            alt={`${name} - ${imageLabel} ${i + 5}`}
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
                                    alt={`${name} - ${imageLabel} ${i + 1}`}
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
                        alt={`${name} - ${imageLabel} ${lightboxIdx + 1}`}
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

const hotelAddOnsData = [
    { id: "sea_view", name: "إطلالة بحرية", price: 40, description: "غرفة بإطلالة مباشرة على البحر" },
    { id: "pool_view", name: "إطلالة مسبح", price: 20, description: "غرفة بإطلالة على المسبح الخارجي" },
    { id: "first_row", name: "صف أول على البحر", price: 60, description: "موقع في الصف الأول مباشرةً أمام الشاطئ" }
];

export default function HotelDetailPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const hotel = getHotelBySlug(slug);
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const { setHotel, cart, openCart, setNights } = useCart();
    const isInCart = cart.hotel?.id === hotel?.id;
    const hotelLocale = hotel && !isAr ? hotelDetailEn[hotel.slug] : null;
    const localizedHotel = hotel
        ? {
            ...hotel,
            name: isAr ? hotel.name : hotelLocale?.name ?? hotel.name,
            city: isAr ? hotel.city : hotelLocale?.city ?? hotel.city,
            description: isAr ? hotel.description : hotelLocale?.description ?? hotel.description,
            amenities: hotel.amenities.map((item, index) => ({
                ...item,
                label: isAr ? item.label : hotelLocale?.amenities[index] ?? item.label,
            })),
            rooms: hotel.rooms.map((room, index) => ({
                ...room,
                name: isAr ? room.name : hotelLocale?.rooms[index]?.name ?? room.name,
                description: isAr ? room.description : hotelLocale?.rooms[index]?.description ?? room.description,
            })),
        }
        : null;
    const localizedAddOns = hotelAddOnsData.map((addon) => ({
        ...addon,
        name: isAr ? addon.name : hotelAddOnsEn[addon.id as keyof typeof hotelAddOnsEn]?.name ?? addon.name,
        description: isAr ? addon.description : hotelAddOnsEn[addon.id as keyof typeof hotelAddOnsEn]?.description ?? addon.description,
    }));
    const labels = {
        notFound: isAr ? "الفندق غير موجود" : "Hotel not found",
        backToHotels: isAr ? "العودة للفنادق" : "Back to hotels",
        stars: isAr ? "نجوم" : "stars",
        bookNow: isAr ? "احجز الآن" : "Book now",
        viewGallery: isAr ? "شاهد الصور" : "View gallery",
        aboutHotel: isAr ? "نبذة عن الفندق" : "About the hotel",
        amenities: isAr ? "المرافق والخدمات" : "Amenities and services",
        chooseRoom: isAr ? "اختر غرفتك واحجز" : "Choose your room and book",
        chooseRoomSub: isAr ? "حدد نوع الغرفة وعدد الليالي" : "Select your room type and number of nights",
        roomType: isAr ? "نوع الغرفة" : "Room type",
        roomCount: isAr ? "عدد الغرف" : "Rooms",
        roomChangeNote: isAr ? "يمكن تغيير نوع الغرفة بعد إتمام الحجز، وذلك عبر التواصل معنا على الواتساب، حسب التوفر وبرسوم إضافية." : "Room type can be changed after booking by contacting us on WhatsApp, subject to availability and possible extra fees.",
        addOns: isAr ? "الإضافات" : "Add-ons",
        optional: isAr ? "(اختياري)" : "(Optional)",
        stayDates: isAr ? "تواريخ الإقامة" : "Stay dates",
        checkIn: isAr ? "تاريخ الوصول" : "Check-in date",
        checkOut: isAr ? "تاريخ المغادرة" : "Check-out date",
        night: isAr ? "ليلة" : "night",
        nights: isAr ? "ليالٍ" : "nights",
        estimatedTotalFor: isAr ? "الإجمالي التقديري لـ" : "Estimated total for",
        updateBooking: isAr ? "تعديل الحجز" : "Update booking",
        addedToPlan: isAr ? "تمت الإضافة لبرنامجك" : "Added to your plan",
        addToPlan: isAr ? "أضف لبرنامجك" : "Add to your plan",
        hotelGallery: isAr ? "صور الفندق" : "Hotel gallery",
        hotelVideo: isAr ? "فيديو الفندق" : "Hotel video",
        image: isAr ? "صورة" : "Image",
    };

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [roomsCount, setRoomsCount] = useState(1);
    const [selectedAddOns, setSelectedAddOns] = useState<string | null>(null);
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = (() => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })();
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);
    const [savedRoom, setSavedRoom] = useState<number | null>(null);
    const [savedRoomsCount, setSavedRoomsCount] = useState<number | null>(null);
    const [savedAddOns, setSavedAddOns] = useState<string | null | undefined>(undefined);
    const [savedCheckIn, setSavedCheckIn] = useState<string | null>(null);
    const [savedCheckOut, setSavedCheckOut] = useState<string | null>(null);

    // Initialize state from cart if it's already in the cart
    useEffect(() => {
        if (isInCart && cart.hotel) {
            if (cart.hotel.roomName) {
                const roomIndex = localizedHotel?.rooms.findIndex((r) => r.name === cart.hotel?.roomName);
                if (roomIndex !== undefined && roomIndex !== -1) setSelectedRoom(roomIndex);
                if (cart.hotel.roomsCount) setRoomsCount(cart.hotel.roomsCount);
            }
            if (cart.hotel.selectedAddOns && cart.hotel.selectedAddOns.length > 0) {
                const found = localizedAddOns.find((a) => a.name === cart.hotel!.selectedAddOns![0].name);
                setSelectedAddOns(found ? found.id : null);
            }
        }
    }, [isInCart, cart.hotel, localizedHotel?.rooms, localizedAddOns]);

    const nights = Math.max(1, Math.round(
        (new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000 
    ));

    const scrollToBooking = () => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const isAddOnsChanged = () => {
        const reference = savedAddOns !== undefined ? savedAddOns : (() => {
            if (!isInCart || !cart.hotel?.selectedAddOns?.length) return null;
            const found = localizedAddOns.find((a) => a.name === cart.hotel!.selectedAddOns![0].name);
            return found ? found.id : null;
        })();
        return selectedAddOns !== reference;
    };

    const hasChanges = Boolean(
        isInCart && (
            (savedRoom !== null ? selectedRoom !== savedRoom : hotel?.rooms[selectedRoom].price !== cart.hotel?.pricePerNight) ||
            (savedRoomsCount !== null ? roomsCount !== savedRoomsCount : roomsCount !== (cart.hotel?.roomsCount || 1)) ||
            (savedCheckIn !== null && checkIn !== savedCheckIn) ||
            (savedCheckOut !== null ? checkOut !== savedCheckOut : nights !== cart.nights) ||
            isAddOnsChanged()
        )
    );

    if (!hotel) {
        return (
            <main className="min-h-screen bg-[#FAFAFA] flex items-center justify-center pt-20">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-[#0f172a] mb-4">404</h1>
                    <p className="text-[#64748b] text-lg">{labels.notFound}</p>
                    <Link href={`/${lang}/hotels`} className="inline-block mt-6 bg-[#0EA5E9] text-white px-6 py-3 rounded-full font-bold hover:bg-[#0284C7] transition">
                        {labels.backToHotels}
                    </Link>
                </div>
            </main>
        );
    }

    const resolvedHotel = localizedHotel!;
    const room = resolvedHotel.rooms[selectedRoom];
    let addonsPriceTotal = 0;
    if (selectedAddOns) {
        const found = hotelAddOnsData.find(a => a.id === selectedAddOns);
        if (found) addonsPriceTotal = found.price;
    }

    const totalPrice = (room.price * roomsCount + addonsPriceTotal) * nights;

    return (
        <main className="bg-[#FAFAFA]">
            <HotelDetailHero hotel={resolvedHotel} onBookNow={scrollToBooking} isAr={isAr} labels={{ stars: labels.stars, bookNow: labels.bookNow, viewGallery: labels.viewGallery }} />

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
                                <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">{labels.aboutHotel}</h2>
                            </div>
                        </ScrollReveal>
                        <ScrollReveal delay={100}>
                            <p className="text-[#444] text-base md:text-lg leading-[2] max-w-3xl whitespace-pre-line">{resolvedHotel.description}</p>
                        </ScrollReveal>
                    </section>

                    {/* Amenities */}
                    <section>
                        <ScrollReveal>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 0 0 2.25-2.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v2.25A2.25 2.25 0 0 0 6 10.5Zm0 9.75h2.25A2.25 2.25 0 0 0 10.5 18v-2.25a2.25 2.25 0 0 0-2.25-2.25H6a2.25 2.25 0 0 0-2.25 2.25V18A2.25 2.25 0 0 0 6 20.25Zm9.75-9.75H18a2.25 2.25 0 0 0 2.25-2.25V6A2.25 2.25 0 0 0 18 3.75h-2.25A2.25 2.25 0 0 0 13.5 6v2.25a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-[#0f172a]">{labels.amenities}</h2>
                            </div>
                        </ScrollReveal>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {resolvedHotel.amenities.map((item, i) => (
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
                <div id="booking" className="py-10 md:py-14 scroll-mt-24" dir={isAr ? "rtl" : "ltr"}>
                    <div className="bg-white rounded-3xl border border-[#e2e8f0] shadow-sm overflow-hidden">

                        {/* Header */}
                        <div className="px-6 md:px-8 py-5 border-b border-[#e2e8f0] flex items-center gap-3 bg-[#f8fafc]">
                            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 flex items-center justify-center shrink-0">
                                <svg className="w-5 h-5 text-[#0EA5E9]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#0f172a]">{labels.chooseRoom}</h2>
                                <p className="text-xs text-[#64748b] mt-0.5">{labels.chooseRoomSub}</p>
                            </div>
                        </div>

                        {/* Room + Addons + Nights grid */}
                        <div className="px-6 md:px-8 py-7 border-b border-[#e2e8f0] grid grid-cols-1 lg:grid-cols-2 gap-8">

                            {/* Room selector */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-bold text-[#0f172a]">{labels.roomType}</h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {resolvedHotel.rooms.map((r, i) => {
                                        const isSelected = selectedRoom === i;
                                        return (
                                            <div
                                                key={r.name}
                                                role="radio"
                                                aria-checked={isSelected}
                                                tabIndex={0}
                                                onClick={() => { if (selectedRoom !== i) { setSelectedRoom(i); setRoomsCount(1); } }}
                                                onKeyDown={(e) => e.key === "Enter" && (() => { if (selectedRoom !== i) { setSelectedRoom(i); setRoomsCount(1); } })()}
                                                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-[#0EA5E9] bg-[#0EA5E9]/5" : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0EA5E9]/40"}`}
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
                                                {isSelected && (
                                                    <div
                                                        className="mt-3 pt-3 border-t border-[#0EA5E9]/20 flex items-center justify-between"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span className="text-xs font-medium text-[#64748b]">{labels.roomCount}</span>
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                onClick={() => setRoomsCount(c => Math.max(1, c - 1))}
                                                                className="w-7 h-7 rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] font-bold flex items-center justify-center hover:bg-[#0EA5E9]/20 transition text-base leading-none cursor-pointer"
                                                            >−</button>
                                                            <span className="w-5 text-center font-bold text-[#0f172a] text-sm">{roomsCount}</span>
                                                            <button
                                                                onClick={() => setRoomsCount(c => c + 1)}
                                                                className="w-7 h-7 rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] font-bold flex items-center justify-center hover:bg-[#0EA5E9]/20 transition text-base leading-none cursor-pointer"
                                                            >+</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                <p className="mt-3 text-xs text-[#64748b] leading-relaxed flex items-start gap-1.5">
                                    <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {labels.roomChangeNote}
                                </p>
                            </div>

                            {/* Add-ons — col 2 on desktop, spans 2 rows */}
                            <div className="lg:row-span-2">
                                <div className="flex items-center gap-2 mb-4">
                                    <h3 className="font-bold text-[#0f172a]">{labels.addOns} <span className="text-xs font-normal text-[#94a3b8]">{labels.optional}</span></h3>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {localizedAddOns.map((addon) => {
                                        const isSelected = selectedAddOns === addon.id;
                                        return (
                                            <div
                                                key={addon.id}
                                                onClick={() => setSelectedAddOns(isSelected ? null : addon.id)}
                                                className={`flex items-start justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? "border-[#F59E0B] bg-[#F59E0B]/5" : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#F59E0B]/40"}`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#cbd5e1] bg-white"}`}>
                                                        {isSelected && (
                                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-[#0f172a] text-sm block">{addon.name}</span>
                                                        <span className="text-xs text-[#64748b]">{addon.description}</span>
                                                    </div>
                                                </div>
                                                <span className={`font-black shrink-0 mt-0.5 ${isSelected ? "text-[#F59E0B]" : "text-[#0f172a]"}`}>
                                                    +{addon.price}$
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Dates */}
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="font-bold text-[#0f172a]">{labels.stayDates}</h3>
                                </div>

                                {/* Dates Grid */}
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    {/* Check-in */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] sm:text-xs font-semibold text-[#64748b]">{labels.checkIn}</label>
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
                                                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-2 sm:px-4 py-2.5 text-[13px] sm:text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B] transition cursor-pointer"
                                            />
                                        </div>
                                    </div>

                                    {/* Check-out */}
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[11px] sm:text-xs font-semibold text-[#64748b]">{labels.checkOut}</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={checkOut}
                                                min={(() => { const d = new Date(checkIn); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; })()}
                                                onChange={(e) => setCheckOut(e.target.value)}
                                                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-2 sm:px-4 py-2.5 text-[13px] sm:text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/30 focus:border-[#F59E0B] transition cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Nights badge */}
                                <div className="flex items-center gap-2 bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-4 py-2.5">
                                    <svg className="w-4 h-4 text-[#F59E0B] shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <span className="text-sm font-medium text-[#0f172a]">{nights} {nights === 1 ? labels.night : labels.nights}</span>
                                </div>
                            </div>

                        </div>

                        {/* Total + CTA */}
                        <div className="px-6 md:px-8 py-6 flex flex-col sm:flex-row items-center gap-4 justify-between">
                            <div>
                                <p className="text-sm text-[#64748b] mb-1">{labels.estimatedTotalFor} {nights} {nights === 1 ? labels.night : labels.nights}</p>
                                <div className="flex items-baseline gap-1.5 flex-wrap">
                                    <span className="text-4xl font-extrabold text-[#0EA5E9]">${totalPrice.toLocaleString("en-US")}</span>
                                    <span className="text-sm text-[#94a3b8]">({room.name}{roomsCount > 1 ? ` × ${roomsCount}` : ""})</span>
                                    {selectedAddOns && (() => {
                                        const addon = localizedAddOns.find(a => a.id === selectedAddOns);
                                        return addon ? (
                                            <span className="text-sm text-[#94a3b8]">
                                                + {addon.name}
                                            </span>
                                        ) : null;
                                    })()}
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto">
                                <button
                                    onClick={() => {
                                        setHotel({
                                            id: hotel.id,
                                            slug: hotel.slug,
                                            name: resolvedHotel.name,
                                            nameAr: hotel.name,
                                            nameEn: hotelLocale?.name ?? hotel.name,
                                            city: resolvedHotel.city,
                                            cityAr: hotel.city,
                                            cityEn: hotelLocale?.city ?? hotel.city,
                                            image: hotel.image,
                                               pricePerNight: room.price,
                                               stars: hotel.stars,
                                               roomName: room.name,
                                               roomNameAr: hotel.rooms[selectedRoom]?.name,
                                               roomNameEn: resolvedHotel.rooms[selectedRoom]?.name,
                                               roomsCount: roomsCount,
                                               selectedAddOns: selectedAddOns ? (() => {
                                                   const a = localizedAddOns.find(x => x.id === selectedAddOns);
                                                   const arabicAddOn = hotelAddOnsData.find(x => x.id === selectedAddOns);
                                                   return a ? [{ name: a.name, nameAr: arabicAddOn?.name ?? a.name, nameEn: a.name, price: a.price }] : [];
                                               })() : []
                                           });
                                          setNights(nights);
                                          setSavedRoom(selectedRoom);
                                          setSavedRoomsCount(roomsCount);
                                          setSavedAddOns(selectedAddOns);
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
                                            {labels.updateBooking}
                                        </>
                                    ) : isInCart ? (
                                        <>
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {labels.addedToPlan}
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                            </svg>
                                            {labels.addToPlan}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Gallery ── */}
                <HotelGallery images={hotel.gallery} name={resolvedHotel.name} youtubeUrl={hotel.youtubeUrl} title={labels.hotelGallery} videoTitle={labels.hotelVideo} imageLabel={labels.image} />

            </div>
        </main>
    );
}
