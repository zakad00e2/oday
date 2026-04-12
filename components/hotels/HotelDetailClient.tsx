"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import HotelDetailSkeleton from "@/components/detail-skeletons/HotelDetailSkeleton";
import FlexibleImage from "@/components/FlexibleImage";
import LocalizedDatePicker from "@/components/LocalizedDatePicker";
import ScrollReveal from "@/components/ScrollReveal";
import { useCart } from "@/lib/cart-context";
import { formatPrice, formatPriceWithSign } from "@/lib/currency";
import { useI18n } from "@/lib/i18n/dictionary-context";
import { getHotelBySlug, type HotelRecord } from "@/lib/hotel-service";
import Breadcrumb from "@/components/Breadcrumb";

interface LocalizedHotelRoom {
    id: string;
    capacity: number;
    name: string;
    nameAr: string;
    nameEn: string;
    price: number;
    description: string;
}

interface LocalizedHotelAddon {
    id: string;
    name: string;
    nameAr: string;
    nameEn: string;
    description: string;
    descriptionAr: string;
    descriptionEn: string;
    price: number;
}

interface LocalizedHotelView {
    id: string;
    slug: string;
    name: string;
    nameAr: string;
    nameEn: string;
    city: string;
    cityAr: string;
    cityEn: string;
    image: string;
    mainImages: string[];
    stars: number;
    description: string;
    gallery: string[];
    youtubeUrl: string;
    youtubeIsShort: boolean;
    amenities: { label: string }[];
    rooms: LocalizedHotelRoom[];
    addons: LocalizedHotelAddon[];
}

function formatIsoDate(date: Date) {
    return date.toISOString().split("T")[0];
}

function extractYouTubeVideoId(url: string) {
    if (!url) return "";

    const normalizedUrl = url.trim();
    const directIdPattern = /^[A-Za-z0-9_-]{11}$/;
    if (directIdPattern.test(normalizedUrl)) {
        return normalizedUrl;
    }

    try {
        const parsed = new URL(normalizedUrl);
        const hostname = parsed.hostname.replace(/^www\./, "");

        if (hostname === "youtu.be") {
            const id = parsed.pathname.replace(/\//g, "");
            return directIdPattern.test(id) ? id : "";
        }

        if (
            hostname === "youtube.com" ||
            hostname === "m.youtube.com" ||
            hostname === "youtube-nocookie.com"
        ) {
            const pathnameParts = parsed.pathname.split("/").filter(Boolean);

            if (pathnameParts[0] === "watch") {
                const id = parsed.searchParams.get("v") ?? "";
                return directIdPattern.test(id) ? id : "";
            }

            if (pathnameParts[0] === "embed" || pathnameParts[0] === "shorts") {
                const id = pathnameParts[1] ?? "";
                return directIdPattern.test(id) ? id : "";
            }
        }
    } catch {
        return "";
    }

    return "";
}

function isYouTubeShortUrl(url: string) {
    if (!url) return false;

    try {
        const parsed = new URL(url.trim());
        const hostname = parsed.hostname.replace(/^www\./, "");
        if (hostname !== "youtube.com" && hostname !== "m.youtube.com") {
            return false;
        }

        const pathnameParts = parsed.pathname.split("/").filter(Boolean);
        return pathnameParts[0] === "shorts";
    } catch {
        return false;
    }
}

function toEmbedUrl(url: string) {
    if (!url) return "";
    const videoId = extractYouTubeVideoId(url);
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?rel=0` : "";
}

function buildLocalizedHotelView(hotel: HotelRecord, language: "ar" | "en"): LocalizedHotelView {
    const isAr = language === "ar";
    const mainImages = hotel.mainImages.length > 0 ? hotel.mainImages : hotel.mainImage ? [hotel.mainImage] : [];
    const gallery = hotel.gallery.length > 0 ? hotel.gallery : mainImages;

    return {
        id: hotel.id,
        slug: hotel.slugEn || hotel.slug,
        name: isAr ? hotel.nameAr : hotel.nameEn,
        nameAr: hotel.nameAr,
        nameEn: hotel.nameEn,
        city: isAr ? hotel.destinationLabelAr : hotel.destinationLabelEn,
        cityAr: hotel.destinationLabelAr,
        cityEn: hotel.destinationLabelEn,
        image: mainImages[0] || hotel.mainImage,
        mainImages,
        stars: hotel.stars,
        description: isAr ? hotel.descriptionAr : hotel.descriptionEn,
        gallery,
        youtubeUrl: toEmbedUrl(hotel.youtubeVideoUrl),
        youtubeIsShort: isYouTubeShortUrl(hotel.youtubeVideoUrl),
        amenities: (isAr ? hotel.facilitiesAr : hotel.facilitiesEn).map((label) => ({ label })),
        rooms: hotel.rooms.map((room) => ({
            id: room.id,
            capacity: room.capacity,
            name: isAr ? room.nameAr : room.nameEn,
            nameAr: room.nameAr,
            nameEn: room.nameEn,
            price: room.price,
            description:
                (isAr ? room.descriptionAr : room.descriptionEn) ||
                (isAr ? room.descriptionEn : room.descriptionAr) ||
                (isAr ? `السعة: ${room.capacity}` : `Capacity: ${room.capacity}`),
        })),
        addons: hotel.addons.map((addon) => ({
            id: addon.id,
            name: isAr ? addon.nameAr : addon.nameEn,
            nameAr: addon.nameAr,
            nameEn: addon.nameEn,
            description: isAr ? addon.descriptionAr : addon.descriptionEn,
            descriptionAr: addon.descriptionAr,
            descriptionEn: addon.descriptionEn,
            price: addon.price,
        })),
    };
}

function resolveRoomIndexFromCart(
    hotel: LocalizedHotelView | null,
    cartHotel: ReturnType<typeof useCart>["cart"]["hotel"],
) {
    if (!hotel || !cartHotel) return -1;

    const roomNames = [cartHotel.roomName, cartHotel.roomNameAr, cartHotel.roomNameEn].filter(
        (value): value is string => Boolean(value),
    );

    if (roomNames.length === 0) return -1;

    return hotel.rooms.findIndex((room) =>
        roomNames.includes(room.name) ||
        roomNames.includes(room.nameAr) ||
        roomNames.includes(room.nameEn),
    );
}

function resolveAddOnIdFromCart(
    hotel: LocalizedHotelView | null,
    cartHotel: ReturnType<typeof useCart>["cart"]["hotel"],
) {
    if (!hotel || !cartHotel?.selectedAddOns?.length) return null;

    for (const cartAddon of cartHotel.selectedAddOns) {
        const addonNames = [cartAddon.name, cartAddon.nameAr, cartAddon.nameEn].filter(
            (value): value is string => Boolean(value),
        );

        const found = hotel.addons.find((addon) =>
            addonNames.includes(addon.name) ||
            addonNames.includes(addon.nameAr) ||
            addonNames.includes(addon.nameEn),
        );

        if (found) return found.id;
    }

    return null;
}

function HotelStateCard({
    title,
    description,
    actionLabel,
    onAction,
    actionHref,
}: {
    title: string;
    description: string;
    actionLabel: string;
    onAction?: () => void;
    actionHref?: string;
}) {
    return (
        <main className="min-h-screen bg-[#FAFAFA] px-6 pt-24">
            <div className="mx-auto max-w-2xl rounded-[28px] border border-dashed border-[#CBD5E1] bg-white px-6 py-16 text-center shadow-sm">
                <h1 className="text-3xl font-bold text-[#0f172a]">{title}</h1>
                <p className="mt-3 text-base leading-relaxed text-[#64748b]">{description}</p>
                {actionHref ? (
                    <Link
                        href={actionHref}
                        className="mt-6 inline-flex rounded-full bg-[#0EA5E9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0284C7]"
                    >
                        {actionLabel}
                    </Link>
                ) : (
                    <button
                        type="button"
                        onClick={onAction}
                        className="mt-6 inline-flex rounded-full bg-[#0EA5E9] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0284C7]"
                    >
                        {actionLabel}
                    </button>
                )}
            </div>
        </main>
    );
}

function SectionTitle({
    iconTone,
    title,
}: {
    iconTone: "sky" | "emerald" | "amber";
    title: string;
}) {
    const toneClasses =
        iconTone === "emerald"
            ? "bg-[#10B981]/10 text-[#10B981]"
            : iconTone === "amber"
                ? "bg-[#F59E0B]/10 text-[#F59E0B]"
                : "bg-[#0EA5E9]/10 text-[#0EA5E9]";

    return (
        <div className="mb-6 flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses}`}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#0f172a] md:text-3xl">{title}</h2>
        </div>
    );
}

function HotelHero({
    hotel,
    isAr,
    labels,
    onBookNow,
}: {
    hotel: LocalizedHotelView;
    isAr: boolean;
    labels: { stars: string; bookNow: string; viewGallery: string };
    onBookNow: () => void;
}) {
    const images =
        hotel.mainImages.length > 0
            ? hotel.mainImages
            : hotel.gallery.length > 0
                ? hotel.gallery
                : hotel.image
                    ? [hotel.image]
                    : [];
    const [imageIndex, setImageIndex] = useState(0);

    useEffect(() => {
        if (images.length <= 1) return;

        const timer = window.setInterval(() => {
            setImageIndex((current) => (current + 1) % images.length);
        }, 4000);

        return () => window.clearInterval(timer);
    }, [images.length]);

    return (
        <section className="w-full px-3 pt-20 pb-10 md:px-5">
            <div className="mx-auto max-w-[1600px]">
                <div className="relative mb-3 flex h-[58vh] flex-col justify-end overflow-hidden rounded-[2rem] shadow-2xl sm:h-[65vh] md:h-[78vh]">
                    {images.length > 0 ? (
                        images.map((src, index) => (
                            <FlexibleImage
                                key={`${src}-${index}`}
                                src={src}
                                alt={`${hotel.name} in ${hotel.city} - photo ${index + 1}`}
                                fill
                                priority={index === 0}
                                quality={100}
                                sizes="(max-width: 1600px) 100vw, 1600px"
                                className={`object-cover transition-opacity duration-700 ${
                                    index === imageIndex ? "opacity-100" : "opacity-0"
                                }`}
                            />
                        ))
                    ) : (
                        <div className="absolute inset-0 bg-[#E5E7EB]" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

                    <div className="relative z-10 w-full max-w-[900px] px-5 pt-32 pb-8 md:px-14 md:pt-48 md:pb-12">
                        <ScrollReveal delay={100}>
                            <h1 className="mb-2 max-w-3xl text-xl font-bold leading-tight text-white sm:text-3xl md:mb-4 md:text-5xl lg:text-6xl">
                                {hotel.name}
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal delay={200}>
                            <div className="mb-5 flex items-center gap-1 sm:mb-8">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <svg key={index} className={`h-5 w-5 ${index < hotel.stars ? "text-amber-400" : "text-white/20"}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                                <span className={`text-sm text-white/70 ${isAr ? "mr-2" : "ml-2"}`}>
                                    {hotel.stars} {labels.stars}
                                </span>
                            </div>
                        </ScrollReveal>

                        <ScrollReveal delay={300}>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="button"
                                    onClick={onBookNow}
                                    className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-gradient-to-l from-[#0369A1] via-[#0284C7] to-[#0EA5E9] ps-5 pe-2 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] transition-all duration-300 hover:scale-105 hover:brightness-110 hover:shadow-[0_0_24px_rgba(14,165,233,0.55)] sm:gap-2.5 sm:ps-7 sm:pe-2.5 sm:py-2.5 sm:text-base"
                                >
                                    {labels.bookNow}
                                    <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#0284C7] shadow-md sm:h-9 sm:w-9">
                                        <svg className={`h-3.5 w-3.5 ${isAr ? "scale-x-[-1]" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                                        </svg>
                                    </span>
                                </button>

                                <a
                                    href="#gallery"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:border-white/50 hover:bg-white/20 sm:px-5 sm:py-2.5 sm:text-sm"
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {labels.viewGallery}
                                </a>
                            </div>
                        </ScrollReveal>
                    </div>
                </div>

                {images.length > 1 ? (
                    <div className="flex gap-2 overflow-x-auto px-2 py-2" style={{ scrollbarWidth: "none" }}>
                        {images.map((src, index) => (
                            <button
                                key={`${src}-${index}`}
                                type="button"
                                onClick={() => setImageIndex(index)}
                                className={`relative h-[60px] w-[90px] shrink-0 overflow-hidden rounded-xl transition-all duration-300 ${
                                    index === imageIndex
                                        ? "scale-[1.04] opacity-100 ring-2 ring-[#0EA5E9] ring-offset-2"
                                        : "opacity-60 hover:opacity-90"
                                }`}
                            >
                                <Image
                                    src={src}
                                    alt={`${hotel.name} in ${hotel.city} - photo ${index + 1}`}
                                    fill
                                    sizes="90px"
                                    className="object-cover"
                                />
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>
        </section>
    );
}

function HotelGallery({
    hotel,
    labels,
}: {
    hotel: LocalizedHotelView;
    labels: { hotelGallery: string; hotelVideo: string; image: string };
}) {
    const galleryImages = [...hotel.mainImages, ...hotel.gallery];
    const hasGalleryContent = Boolean(hotel.youtubeUrl) || galleryImages.length > 0;

    return (
        <section id="gallery" className="border-t border-[#e2e8f0] py-10 md:py-14">
            <ScrollReveal>
                <SectionTitle iconTone="amber" title={labels.hotelGallery} />
            </ScrollReveal>

            {hasGalleryContent ? (
                <div className="grid gap-4 md:auto-rows-[280px] md:grid-cols-2 xl:grid-cols-3">
                    {hotel.youtubeUrl ? (
                        <ScrollReveal delay={0} className="md:row-span-2">
                            <div className={`h-full overflow-hidden rounded-[24px] border border-[#E2E8F0] shadow-sm ${
                                hotel.youtubeIsShort ? "bg-black" : "bg-white"
                            }`}>
                                {hotel.youtubeIsShort ? (
                                    <div className="flex min-h-[520px] items-center justify-center p-4 md:h-full md:min-h-0 md:p-0">
                                        <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[20px] md:h-full md:w-auto md:max-w-full md:rounded-none">
                                            <iframe
                                                src={hotel.youtubeUrl}
                                                title={labels.hotelVideo}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                referrerPolicy="strict-origin-when-cross-origin"
                                                loading="lazy"
                                                className="absolute inset-0 h-full w-full"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative aspect-[4/3] min-h-[260px] md:h-full md:min-h-0 md:aspect-auto">
                                        <iframe
                                            src={hotel.youtubeUrl}
                                            title={labels.hotelVideo}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            referrerPolicy="strict-origin-when-cross-origin"
                                            loading="lazy"
                                            className="absolute inset-0 h-full w-full"
                                        />
                                    </div>
                                )}
                            </div>
                        </ScrollReveal>
                    ) : null}

                    {galleryImages.map((image, index) => (
                        <ScrollReveal key={`${image}-${index}`} delay={index * 40} className="h-full">
                            <div className="relative aspect-[4/3] min-h-[260px] overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white shadow-sm md:h-full md:min-h-0 md:aspect-auto">
                                <Image
                                    src={image}
                                    alt={`${hotel.name} in ${hotel.city} - ${labels.image} ${index + 1}`}
                                    fill
                                    sizes="(max-width: 1280px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 hover:scale-105"
                                />
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            ) : (
                <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-6 py-10 text-center text-sm text-[#64748b]">
                    {labels.image}
                </div>
            )}
        </section>
    );
}

export default function HotelDetailClient() {
    const params = useParams();
    const slug = params?.slug as string;
    const { lang } = useI18n();
    const isAr = lang === "ar";
    const { cart, openCart, setHotel, setNights } = useCart();
    const [hotelData, setHotelData] = useState<HotelRecord | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const labels = {
        loading: isAr ? "جاري تحميل الفندق..." : "Loading hotel...",
        retry: isAr ? "إعادة المحاولة" : "Retry",
        notFound: isAr ? "الفندق غير موجود" : "Hotel not found",
        notFoundDesc: isAr ? "لم نتمكن من العثور على هذا الفندق في البيانات القادمة من الـ API." : "We could not find this hotel in the live API data.",
        backToHotels: isAr ? "العودة للفنادق" : "Back to hotels",
        stars: isAr ? "نجوم" : "stars",
        bookNow: isAr ? "احجز الآن" : "Book now",
        viewGallery: isAr ? "شاهد الصور" : "View gallery",
        aboutHotel: isAr ? "نبذة عن الفندق" : "About the hotel",
        amenities: isAr ? "المرافق والخدمات" : "Amenities and services",
        chooseRoom: isAr ? "اختر غرفتك واحجز" : "Choose your room and book",
        chooseRoomSub: isAr ? "حدد نوع الغرفة وعدد الغرف وتواريخ الإقامة" : "Select the room type, room count, and your stay dates.",
        roomType: isAr ? "نوع الغرفة" : "Room type",
        roomCount: isAr ? "عدد الغرف" : "Rooms",
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
        noRooms: isAr ? "لا توجد غرف متاحة لهذا الفندق حاليًا." : "No rooms are available for this hotel right now.",
        noAddOns: isAr ? "لا توجد إضافات متاحة حاليًا." : "No add-ons are available right now.",
    };

    const loadHotel = useCallback(async (signal?: AbortSignal) => {
        try {
            setIsLoading(true);
            setError(null);
            const hotel = await getHotelBySlug(slug, signal);
            setHotelData(hotel);
        } catch (loadError) {
            if (signal?.aborted) return;
            setError(loadError instanceof Error ? loadError.message : labels.loading);
        } finally {
            if (!signal?.aborted) {
                setIsLoading(false);
            }
        }
    }, [labels.loading, slug]);

    useEffect(() => {
        const controller = new AbortController();
        void loadHotel(controller.signal);
        return () => controller.abort();
    }, [loadHotel]);

    const hotel = useMemo(
        () => (hotelData ? buildLocalizedHotelView(hotelData, lang) : null),
        [hotelData, lang],
    );

    const isInCart = cart.hotel?.id === hotel?.id;
    const cartRoomIndex = resolveRoomIndexFromCart(hotel, cart.hotel);
    const cartAddonId = resolveAddOnIdFromCart(hotel, cart.hotel);

    const today = formatIsoDate(new Date());
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = formatIsoDate(tomorrowDate);

    const [selectedRoom, setSelectedRoom] = useState(0);
    const [roomsCount, setRoomsCount] = useState(1);
    const [selectedAddOnId, setSelectedAddOnId] = useState<string | null>(null);
    const [checkIn, setCheckIn] = useState(today);
    const [checkOut, setCheckOut] = useState(tomorrow);

    useEffect(() => {
        if (!hotel || !isInCart || !cart.hotel) return;

        if (cartRoomIndex >= 0) {
            setSelectedRoom((current) => (current === cartRoomIndex ? current : cartRoomIndex));
        }

        setRoomsCount((current) => (current === (cart.hotel?.roomsCount || 1) ? current : (cart.hotel?.roomsCount || 1)));
        setSelectedAddOnId((current) => (current === cartAddonId ? current : cartAddonId));
    }, [hotel, isInCart, cart.hotel, cartRoomIndex, cartAddonId]);

    useEffect(() => {
        if (checkOut <= checkIn) {
            const nextDate = new Date(checkIn);
            nextDate.setDate(nextDate.getDate() + 1);
            setCheckOut(formatIsoDate(nextDate));
        }
    }, [checkIn, checkOut]);

    const nights = Math.max(
        1,
        Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000),
    );
    const minimumCheckOut = formatIsoDate(new Date(new Date(checkIn).getTime() + 86400000));

    const room = hotel?.rooms[selectedRoom] ?? null;
    const selectedAddon = hotel?.addons.find((addon) => addon.id === selectedAddOnId) ?? null;
    const selectedAddOns = selectedAddon
        ? [{
            name: selectedAddon.name,
            nameAr: selectedAddon.nameAr,
            nameEn: selectedAddon.nameEn,
            price: selectedAddon.price,
        }]
        : [];

    const totalPrice = room
        ? (room.price * roomsCount * nights) + (selectedAddon ? selectedAddon.price * roomsCount * nights : 0)
        : 0;

    const hasChanges = Boolean(
        isInCart && hotel && (
            selectedRoom !== cartRoomIndex ||
            roomsCount !== (cart.hotel?.roomsCount || 1) ||
            nights !== cart.nights ||
            selectedAddOnId !== cartAddonId
        ),
    );

    const scrollToBooking = () => {
        document.getElementById("booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    if (isLoading) {
        return <HotelDetailSkeleton />;
    }

    if (error) {
        return (
            <HotelStateCard
                title={isAr ? "تعذر تحميل الفندق" : "Unable to load hotel"}
                description={error}
                actionLabel={labels.retry}
                onAction={() => {
                    void loadHotel();
                }}
            />
        );
    }

    if (!hotel) {
        return (
            <HotelStateCard
                title={labels.notFound}
                description={labels.notFoundDesc}
                actionLabel={labels.backToHotels}
                actionHref={`/${lang}/hotels`}
            />
        );
    }

    const breadcrumbItems = [
        { label: isAr ? "الرئيسية" : "Home", href: `/${lang}` },
        { label: isAr ? "الفنادق" : "Hotels", href: `/${lang}/hotels` },
        { label: hotel.name },
    ];

    return (
        <main className="bg-[#FAFAFA]">
            <div className="mx-auto max-w-[1600px] px-4 md:px-6 pt-24 pb-2">
                <Breadcrumb items={breadcrumbItems} isRtl={isAr} />
            </div>
            <HotelHero
                hotel={hotel}
                isAr={isAr}
                labels={{ stars: labels.stars, bookNow: labels.bookNow, viewGallery: labels.viewGallery }}
                onBookNow={scrollToBooking}
            />

            <div className="mx-auto max-w-[1100px] px-4 md:px-8 lg:px-12">
                <div className="border-b border-[#e2e8f0] py-10 md:py-14">
                    <section className="mb-10">
                        <ScrollReveal>
                            <SectionTitle iconTone="sky" title={labels.aboutHotel} />
                        </ScrollReveal>
                        <ScrollReveal delay={100}>
                            <p className="max-w-3xl whitespace-pre-line text-base leading-[2] text-[#444] md:text-lg">
                                {hotel.description}
                            </p>
                        </ScrollReveal>
                    </section>

                    <section>
                        <ScrollReveal>
                            <SectionTitle iconTone="emerald" title={labels.amenities} />
                        </ScrollReveal>
                        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                            {hotel.amenities.map((item, index) => (
                                <ScrollReveal key={`${item.label}-${index}`} delay={index * 40}>
                                    <div className="flex items-center gap-2.5 px-1 py-2">
                                        <svg className="h-4 w-4 shrink-0 text-[#10B981]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-sm font-medium leading-snug text-[#374151]">{item.label}</span>
                                    </div>
                                </ScrollReveal>
                            ))}
                        </div>
                    </section>
                </div>

                <div id="booking" className="scroll-mt-24 py-10 md:py-14" dir={isAr ? "rtl" : "ltr"}>
                    <div className="overflow-visible rounded-3xl border border-[#e2e8f0] bg-white shadow-sm">
                        <div className="flex items-center gap-3 border-b border-[#e2e8f0] bg-[#f8fafc] px-6 py-5 md:px-8">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9]">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#0f172a]">{labels.chooseRoom}</h2>
                                <p className="mt-0.5 text-xs text-[#64748b]">{labels.chooseRoomSub}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 border-b border-[#e2e8f0] px-6 py-7 lg:grid-cols-2 md:px-8">
                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <h3 className="font-bold text-[#0f172a]">{labels.roomType}</h3>
                                </div>

                                {hotel.rooms.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {hotel.rooms.map((hotelRoom, index) => {
                                            const isSelected = selectedRoom === index;
                                            return (
                                                <div
                                                    key={hotelRoom.id}
                                                    role="radio"
                                                    aria-checked={isSelected}
                                                    tabIndex={0}
                                                    onClick={() => setSelectedRoom(index)}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            setSelectedRoom(index);
                                                        }
                                                    }}
                                                    className={`cursor-pointer rounded-2xl border-2 p-5 transition-all ${
                                                        isSelected
                                                            ? "border-[#0EA5E9] bg-[#0EA5E9]/5"
                                                            : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#0EA5E9]/40"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex flex-1 items-start gap-2.5">
                                                            <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                                                isSelected ? "border-[#0EA5E9] bg-[#0EA5E9]" : "border-[#cbd5e1]"
                                                            }`}>
                                                                {isSelected ? (
                                                                    <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                    </svg>
                                                                ) : null}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold leading-tight text-[#0f172a]">{hotelRoom.name}</p>
                                                                <p className="mt-0.5 text-xs text-[#64748b]">{hotelRoom.description}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`shrink-0 font-semibold ${isSelected ? "text-[#0EA5E9]" : "text-[#0f172a]"}`}>
                                                            {formatPrice(hotelRoom.price, lang)}
                                                        </span>
                                                    </div>

                                                    {isSelected ? (
                                                        <div
                                                            className="mt-3 flex items-center justify-between border-t border-[#0EA5E9]/20 pt-3"
                                                            onClick={(event) => event.stopPropagation()}
                                                        >
                                                            <span className="text-xs font-medium text-[#64748b]">{labels.roomCount}</span>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setRoomsCount((current) => Math.max(1, current - 1))}
                                                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-base font-bold leading-none text-[#0EA5E9] transition hover:bg-[#0EA5E9]/20"
                                                                >
                                                                    -
                                                                </button>
                                                                <span className="w-5 text-center text-sm font-bold text-[#0f172a]">{roomsCount}</span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setRoomsCount((current) => current + 1)}
                                                                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0EA5E9]/10 text-base font-bold leading-none text-[#0EA5E9] transition hover:bg-[#0EA5E9]/20"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : null}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-6 text-sm text-[#64748b]">
                                        {labels.noRooms}
                                    </div>
                                )}
                            </div>

                            <div>
                                <div className="mb-4 flex items-center gap-2">
                                    <h3 className="font-bold text-[#0f172a]">
                                        {labels.addOns} <span className="text-xs font-normal text-[#94a3b8]">{labels.optional}</span>
                                    </h3>
                                </div>

                                {hotel.addons.length > 0 ? (
                                    <div className="flex flex-col gap-3">
                                        {hotel.addons.map((addon) => {
                                            const isSelected = selectedAddOnId === addon.id;
                                            return (
                                                <button
                                                    key={addon.id}
                                                    type="button"
                                                    onClick={() => setSelectedAddOnId((current) => current === addon.id ? null : addon.id)}
                                                    className={`flex items-start justify-between rounded-2xl border-2 p-4 text-start transition-all ${
                                                        isSelected
                                                            ? "border-[#F59E0B] bg-[#F59E0B]/5"
                                                            : "border-[#e2e8f0] bg-[#f8fafc] hover:border-[#F59E0B]/40"
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                                                            isSelected ? "border-[#F59E0B] bg-[#F59E0B]" : "border-[#cbd5e1] bg-white"
                                                        }`}>
                                                            {isSelected ? (
                                                                <svg className="h-3.5 w-3.5 text-white" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                            ) : null}
                                                        </div>
                                                        <div>
                                                            <span className="block text-sm font-bold text-[#0f172a]">{addon.name}</span>
                                                            <span className="text-xs text-[#64748b]">{addon.description}</span>
                                                        </div>
                                                    </div>
                                                    <span className={`mt-0.5 shrink-0 font-semibold ${isSelected ? "text-[#F59E0B]" : "text-[#0f172a]"}`}>
                                                        {formatPriceWithSign(addon.price, lang)}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-5 py-6 text-sm text-[#64748b]">
                                        {labels.noAddOns}
                                    </div>
                                )}
                            </div>

                            <div className="lg:col-span-2">
                                <div className="mb-4 flex items-center gap-2">
                                    <h3 className="font-bold text-[#0f172a]">{labels.stayDates}</h3>
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-xs font-semibold text-[#64748b]">{labels.checkIn}</span>
                                        <LocalizedDatePicker
                                            value={checkIn}
                                            onChange={(value) => setCheckIn(value || today)}
                                            locale={isAr ? "ar" : "en"}
                                            label={labels.checkIn}
                                            placeholder={isAr ? "اختر من التقويم" : "Choose from calendar"}
                                            minDate={today}
                                            allowClear={false}
                                        />
                                    </label>

                                    <label className="flex flex-col gap-1.5">
                                        <span className="text-xs font-semibold text-[#64748b]">{labels.checkOut}</span>
                                        <LocalizedDatePicker
                                            value={checkOut}
                                            onChange={(value) => setCheckOut(value || tomorrow)}
                                            locale={isAr ? "ar" : "en"}
                                            label={labels.checkOut}
                                            placeholder={isAr ? "اختر من التقويم" : "Choose from calendar"}
                                            minDate={minimumCheckOut}
                                            allowClear={false}
                                        />
                                    </label>
                                </div>

                                <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5">
                                    <svg className="h-4 w-4 shrink-0 text-[#F59E0B]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                    <span className="text-sm font-medium text-[#0f172a]">
                                        {nights} {nights === 1 ? labels.night : labels.nights}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row md:px-8">
                            <div>
                                <p className="mb-1 text-sm text-[#64748b]">
                                    {labels.estimatedTotalFor} {nights} {nights === 1 ? labels.night : labels.nights}
                                </p>
                                <div className="flex flex-wrap items-baseline gap-1.5">
                                    <span className="text-4xl font-bold text-[#0EA5E9]">
                                        {formatPrice(totalPrice, lang)}
                                    </span>
                                    {room ? (
                                        <span className="text-sm text-[#94a3b8]">
                                            {roomsCount > 1 ? `x${roomsCount} ` : ""}({room.name}{selectedAddon ? ` + ${selectedAddon.name}` : ""})
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <button
                                type="button"
                                disabled={!room}
                                onClick={() => {
                                    if (!room) return;

                                    setHotel({
                                        id: hotel.id,
                                        slug: hotel.slug,
                                        name: hotel.name,
                                        nameAr: hotel.nameAr,
                                        nameEn: hotel.nameEn,
                                        city: hotel.city,
                                        cityAr: hotel.cityAr,
                                        cityEn: hotel.cityEn,
                                        image: hotel.image,
                                        pricePerNight: room.price,
                                        stars: hotel.stars,
                                        roomName: room.name,
                                        roomNameAr: room.nameAr,
                                        roomNameEn: room.nameEn,
                                        roomsCount,
                                        selectedAddOns,
                                    });
                                    setNights(nights);
                                    openCart();
                                }}
                                className={`inline-flex w-full items-center justify-center gap-3 rounded-2xl px-7 py-3.5 text-base font-bold transition-all duration-300 active:scale-[0.97] sm:w-auto ${
                                    !room
                                        ? "cursor-not-allowed bg-[#E2E8F0] text-[#94A3B8]"
                                        : hasChanges
                                            ? "bg-[#0284C7] text-white hover:bg-[#0369A1]"
                                            : isInCart
                                                ? "border-2 border-[#86efac] bg-[#dcfce7] text-[#15803d] hover:bg-[#bbf7d0]"
                                                : "bg-[#0284C7] text-white hover:bg-[#0369A1]"
                                }`}
                            >
                                {hasChanges ? labels.updateBooking : isInCart ? labels.addedToPlan : labels.addToPlan}
                            </button>
                        </div>
                    </div>
                </div>

                <HotelGallery
                    hotel={hotel}
                    labels={{ hotelGallery: labels.hotelGallery, hotelVideo: labels.hotelVideo, image: labels.image }}
                />
            </div>
        </main>
    );
}
