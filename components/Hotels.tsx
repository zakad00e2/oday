"use client";

import DestinationImage from "./DestinationImage";
import { getDestinationImage } from "@/lib/destination-service";
import { getDestinationLabels } from "@/lib/destinations";
import { useDestinationCatalog } from "@/lib/use-destination-catalog";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import Skeleton from "./ui/Skeleton";
import { useVisitorPricing } from "@/lib/visitor-pricing-context";
import { getPriceDiscount } from "@/lib/visitor-pricing";
import { writeHotelDetailCache } from "@/lib/hotel-client-cache";
import { useI18n } from "@/lib/i18n/dictionary-context";
import {
  getHotelMealPlanLabel,
  type HotelRecord,
  listHotels,
} from "@/lib/hotel-service";

type SortKey = "default" | "MOST_BOOKED" | "TOP_RATED" | "LOWEST_PRICE";
const DESTINATION_TRANSITION_MS = 520;

function normalizeHotelSearch(value: string) {
  return value.normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase().trim();
}

const destinationImagePositions: Record<string, string> = {
  DAHAB: "center 57%",
  EL_AIN_SOKHNA: "center 65%",
  EL_GHARDQA: "center 58%",
};

function HotelsLoadingGrid({ destinations = false }: { destinations?: boolean }) {
  if (destinations) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] rounded-[24px]" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[24px] border border-[#F3F4F6] bg-white shadow-sm"
        >
          <Skeleton className="aspect-[16/10]" />
          <div className="space-y-3 p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-2/3 rounded-full" />
                <Skeleton className="h-4 w-1/3 rounded-full bg-[#F1F5F9]" />
              </div>
              <div className="mt-0.5 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Skeleton
                    key={starIndex}
                    className="h-3.5 w-3.5 rounded-full bg-[#F8FAFC]"
                  />
                ))}
              </div>
            </div>
            <Skeleton className="h-4 w-full rounded-full bg-[#F1F5F9]" />
            <Skeleton className="h-4 w-5/6 rounded-full bg-[#F1F5F9]" />
            <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-3">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20 rounded-full bg-[#F8FAFC]" />
                <Skeleton className="h-7 w-28 rounded-full" />
              </div>
              <Skeleton className="h-5 w-28 rounded-full bg-[#F8FAFC]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function HotelsStatusCard({
  title,
  description,
  actionLabel,
  onAction,
  tone = "neutral",
}: {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "neutral" | "error";
}) {
  const toneClasses =
    tone === "error"
      ? "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]"
      : "border-[#CBD5E1] bg-[#F8FAFC] text-[#64748B]";

  return (
    <div className={`mt-8 rounded-2xl border border-dashed px-6 py-12 text-center ${toneClasses}`}>
      <p className="text-base font-semibold">{title}</p>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed">{description}</p>
      {actionLabel && onAction ? (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-full bg-[#111] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0EA5E9]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

function filterByRating(hotels: HotelRecord[], sortBy: SortKey): HotelRecord[] {
  if (sortBy === "default") return hotels;
  return hotels.filter((hotel) => hotel.ratingValue === sortBy);
}

function hasHotelDiscount(hotel: Pick<HotelRecord, "isDiscounted" | "discountPercentage">) {
  return hotel.isDiscounted && (hotel.discountPercentage ?? 0) > 0;
}

function HotelCard({
  hotel,
  lang,
  labels,
}: {
  hotel: HotelRecord;
  lang: "ar" | "en";
  labels: ReturnType<typeof useI18n>["dict"]["hotelsPage"];
}) {
  const { formatPrice, resolvePrice } = useVisitorPricing();
  const activePrice = resolvePrice(hotel.initialPrice, hotel.initialPriceEgp);
  const originalPrice = resolvePrice(hotel.originalPrice, hotel.originalPriceEgp);
  const [imageIndex, setImageIndex] = useState(0);
  const isAr = lang === "ar";
  const images =
    hotel.mainImages.length > 0
      ? hotel.mainImages
      : hotel.gallery.length > 0
        ? hotel.gallery
        : hotel.mainImage
          ? [hotel.mainImage]
          : [];
  const hotelName = isAr ? hotel.nameAr : hotel.nameEn;
  const hotelCity = isAr ? hotel.destinationLabelAr : hotel.destinationLabelEn;
  const hotelDescription = isAr ? hotel.descriptionAr : hotel.descriptionEn;
  const discountPercentage = getPriceDiscount(activePrice, originalPrice);
  const hasDiscount = hotel.isDiscounted && discountPercentage !== null;
  const discountLabel = hasDiscount ? `${discountPercentage}%` : "";
  const mealPlanLabel = hotel.mealPlan
    ? getHotelMealPlanLabel(hotel.mealPlan, lang)
    : "";

  const goPrev = (event: React.MouseEvent) => {
    event.preventDefault();
    setImageIndex((current) => (current - 1 + images.length) % images.length);
  };

  const goNext = (event: React.MouseEvent) => {
    event.preventDefault();
    setImageIndex((current) => (current + 1) % images.length);
  };

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-[24px] border border-[#F3F4F6] bg-white shadow-sm transition-all duration-500 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        {hasDiscount ? (
          <div className="absolute top-4 end-4 z-20 flex items-center gap-1.5 rounded-full border border-white/20 bg-red-500/90 px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.15)] backdrop-blur-md">
            <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-[11px] font-bold tracking-wide text-white">
              {labels.discount} {discountLabel}
            </span>
          </div>
        ) : null}

        {images.length > 0 ? (
          images.map((src, index) => (
            <Image
              key={`${hotel.id}-${src}-${index}`}
              src={src}
              alt={`${hotelName} in ${hotelCity}${index > 0 ? ` - photo ${index + 1}` : ""}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={`object-cover transition-all duration-500 ${
                index === imageIndex ? "scale-100 opacity-100" : "scale-105 opacity-0"
              }`}
              priority={index === 0}
            />
          ))
        ) : (
          <div className="flex h-full items-center justify-center bg-[#E5E7EB] text-sm font-medium text-[#64748B]">
            {isAr ? "لا توجد صورة متاحة" : "No image available"}
          </div>
        )}

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label={labels.prevImage}
              className="absolute start-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-100 backdrop-blur-sm transition-all duration-200 hover:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
            >
              <svg className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label={labels.nextImage}
              className="absolute end-2.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white opacity-100 backdrop-blur-sm transition-all duration-200 hover:bg-black/60 md:opacity-0 md:group-hover:opacity-100"
            >
              <svg className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <div className="absolute bottom-2.5 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setImageIndex(index);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    index === imageIndex ? "w-4 bg-white" : "w-1.5 bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-5 pb-3">
        <div>
          <div className="mb-1 flex items-start justify-between gap-2">
            <h3 className="text-base font-bold leading-snug text-[#111]">{hotelName}</h3>
            <div className="mt-0.5 flex flex-shrink-0 items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <svg key={index} className={`h-3.5 w-3.5 ${index < hotel.stars ? "text-yellow-400" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            <span className="text-xs text-[#94A3B8]">{hotelCity}</span>
          </div>
        </div>

        <p
          className="overflow-hidden text-sm leading-relaxed text-[#6B7280]"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
          }}
        >
          {hotelDescription}
        </p>

        {mealPlanLabel ? (
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-full bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 ring-1 ring-sky-100">
              {mealPlanLabel}
            </span>
          </div>
        ) : null}

        <div className="mt-auto flex items-center justify-between border-t border-[#F3F4F6] pt-3">
          <div className="flex flex-col">
            <span className="mb-1 text-[11px] font-medium text-[#64748B]">{labels.startsFrom}</span>
            <div className="flex items-baseline gap-2">
              {hasDiscount && Number.isFinite(originalPrice) && originalPrice > activePrice ? (
                <span className="relative inline-flex items-center text-sm font-medium leading-none text-[#9CA3AF]">
                  <span>{formatPrice(originalPrice, lang)}</span>
                  <span aria-hidden="true" className="absolute start-0 end-0 top-1/2 h-px -translate-y-1/2 bg-[#9CA3AF]" />
                </span>
              ) : null}
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold leading-none text-[#0EA5E9]">
                  {formatPrice(activePrice > 0 ? activePrice : Number.NaN, lang)}
                </span>
              </div>
              <span className="text-xs text-[#94A3B8]">{labels.perNight}</span>
            </div>
          </div>

          <Link
            href={`/${lang}/hotels/${hotel.slugEn || hotel.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-bold text-[#0f172a] transition-all duration-300 hover:text-[#0EA5E9]"
          >
            {labels.detailsAndBook}
            <svg
              className={`h-4 w-4 transition-transform duration-300 ${
                lang === "en" ? "scale-x-[-1] group-hover:translate-x-1" : "group-hover:-translate-x-1"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}

async function fetchDestinationHotels(destination: string, page: number, signal: AbortSignal) {
  const response = await listHotels({ destination, page, limit: 100, signal });
  response.hotels.forEach(writeHotelDetailCache);
  return { items: response.hotels, totalPages: response.meta.totalPages };
}

export default function Hotels() {
  const { dict, lang } = useI18n();
  const d = dict.hotelsPage;
  const isAr = lang === "ar";
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [hoveredDestination, setHoveredDestination] = useState<string | null>(null);
  const [isDestinationTransitioning, setIsDestinationTransitioning] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const destinationTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDestinationTransitioningRef = useRef(false);
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { destinations, items: hotels, isLoading, error, retry } = useDestinationCatalog(
    "hotels", selectedDestination, fetchDestinationHotels,
  );

  useEffect(() => () => {
    if (destinationTransitionTimerRef.current) {
      clearTimeout(destinationTransitionTimerRef.current);
    }
  }, []);

  const destinationOptions = destinations.map((destination) => {
    const labels = getDestinationLabels(destination.destination);
    return {
      value: destination.destination,
      label: isAr ? labels.ar : labels.en,
      image: getDestinationImage(destination),
      customImage: Boolean(destination.image),
      count: destination.hotels_count,
    };
  });

  const activeDestination = destinationOptions.find(
    (destination) => destination.value === selectedDestination,
  );
  const hasHotelsInDestination = hotels.some((hotel) => hotel.destination === selectedDestination);
  const searchPlaceholder = d.searchPlaceholder.replace("{destination}", activeDestination?.label ?? "");

  const filteredHotels = useMemo(() => {
    if (selectedDestination === null) return [];
    const byRating = filterByRating(hotels, sortBy);
    const normalizedQuery = normalizeHotelSearch(searchQuery);

    return byRating.filter((hotel) => {
      if (hotel.destination !== selectedDestination) {
        return false;
      }

      if (showDiscountsOnly && !hasHotelDiscount(hotel)) {
        return false;
      }

      return [hotel.nameAr, hotel.nameEn].some((name) =>
        normalizeHotelSearch(name).includes(normalizedQuery),
      );
    });
  }, [hotels, selectedDestination, showDiscountsOnly, sortBy, searchQuery]);

  const resetFilters = () => {
    setSortBy("default");
    setShowDiscountsOnly(false);
    setSearchQuery("");
  };

  const changeDestination = (destination: string | null) => {
    setSelectedDestination(destination);
    resetFilters();
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start" });
    });
  };

  const selectDestination = (destination: string) => {
    if (isDestinationTransitioningRef.current) return;

    isDestinationTransitioningRef.current = true;
    setHoveredDestination(null);
    setIsDestinationTransitioning(true);
    destinationTransitionTimerRef.current = setTimeout(() => {
      isDestinationTransitioningRef.current = false;
      destinationTransitionTimerRef.current = null;
      changeDestination(destination);
      setIsDestinationTransitioning(false);
    }, DESTINATION_TRANSITION_MS);
  };

  return (
    <section id="hotels" className="bg-[#FAFAFA] py-20">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6">
          <div className={`mb-10 text-center ${selectedDestination !== null ? "animate-destination-content-enter" : ""}`}>
            {selectedDestination !== null ? (
              <button
                type="button"
                onClick={() => changeDestination(null)}
                className="mb-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#E2E8F0] bg-white px-5 py-2 text-sm font-semibold text-[#0F172A] transition hover:border-[#0EA5E9] hover:text-[#0284C7] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5E9]"
              >
                <svg aria-hidden="true" className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                {d.backToDestinations}
              </button>
            ) : null}
            <h2 ref={headingRef} tabIndex={-1} className={`mb-4 text-3xl font-semibold leading-tight text-[#111] outline-none md:text-5xl ${selectedDestination === null ? "scroll-mt-28" : "scroll-mt-48"}`}>
              {selectedDestination === null
                ? d.chooseDestination
                : d.hotelsInDestination.replace("{destination}", activeDestination?.label ?? selectedDestination)}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#6B7280] md:text-base">
              {selectedDestination === null ? d.chooseDestinationDescription : d.subtitle}
            </p>

            {selectedDestination !== null ? (
              <div className="mx-auto mb-10 flex w-full max-w-2xl flex-col gap-4">
                <div role="search" className="relative">
                  <label htmlFor="destination-hotel-search" className="sr-only">
                    {searchPlaceholder}
                  </label>
                  <svg aria-hidden="true" className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94A3B8]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <path strokeLinecap="round" d="m16 16 4 4" />
                  </svg>
                  <input
                    ref={searchInputRef}
                    id="destination-hotel-search"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-14 w-full rounded-2xl border border-[#E2E8F0] bg-white ps-12 pe-14 text-start text-base text-[#0F172A] shadow-sm outline-none transition focus:border-[#0EA5E9] focus:ring-4 focus:ring-[#0EA5E9]/10 placeholder:text-[#94A3B8] [&::-webkit-search-cancel-button]:appearance-none"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      aria-label={d.clearSearch}
                      onClick={() => {
                        setSearchQuery("");
                        searchInputRef.current?.focus();
                      }}
                      className="absolute end-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-[#64748B] transition hover:bg-[#F1F5F9] hover:text-[#0F172A] focus-visible:outline-2 focus-visible:outline-[#0EA5E9]"
                    >
                      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="m6 6 12 12M6 18 18 6" />
                      </svg>
                    </button>
                  ) : null}
                </div>
                {(sortBy !== "default" || showDiscountsOnly) && !isLoading ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex h-[36px] min-w-[100px] flex-[0_1_auto] items-center justify-center whitespace-nowrap rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 text-[12px] font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                  >
                    {d.clearFilters}
                  </button>
                ) : null}

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy("default");
                      setShowDiscountsOnly(false);
                    }}
                    className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                      sortBy === "default" && !showDiscountsOnly
                        ? "border border-[#111] bg-[#111] text-white shadow-md"
                        : "border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm hover:border-[#CBD5E1] hover:text-[#0F172A]"
                    }`}
                  >
                    {d.defaultSort}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const nextState = !showDiscountsOnly;
                      setShowDiscountsOnly(nextState);
                      if (nextState) setSortBy("default");
                    }}
                    className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                      showDiscountsOnly
                        ? "border border-[#111] bg-[#111] text-white shadow-md"
                        : "border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm hover:border-[#CBD5E1] hover:text-[#0F172A]"
                    }`}
                  >
                    {d.discounts}
                  </button>

                  {([
                    { id: "MOST_BOOKED", label: d.mostBooked },
                    { id: "TOP_RATED", label: d.highestRated },
                    { id: "LOWEST_PRICE", label: d.lowestPrice },
                  ] as const).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortBy(option.id);
                        setShowDiscountsOnly(false);
                      }}
                      className={`rounded-full px-5 py-2 text-[13px] font-semibold transition-all duration-300 ${
                        sortBy === option.id && !showDiscountsOnly
                          ? "border border-[#111] bg-[#111] text-white shadow-md"
                          : "border border-[#E2E8F0] bg-white text-[#64748B] shadow-sm hover:border-[#CBD5E1] hover:text-[#0F172A]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          {isLoading ? <HotelsLoadingGrid destinations={selectedDestination === null} /> : null}

          {!isLoading && error ? (
            <HotelsStatusCard
              title={isAr ? "تعذر تحميل الفنادق" : "Unable to load hotels"}
              description={error}
              actionLabel={isAr ? "إعادة المحاولة" : "Retry"}
              onAction={() => {
                retry();
              }}
              tone="error"
            />
          ) : null}

          {!isLoading && !error && selectedDestination === null && destinationOptions.length === 0 ? (
            <HotelsStatusCard
              title={d.noHotelsYet}
              description={isAr ? "ستظهر الوجهات هنا عند إضافة فنادق إليها." : "Destinations will appear here when hotels are added to them."}
            />
          ) : null}

          {!isLoading && !error && selectedDestination === null && destinationOptions.length > 0 ? (
            <div
              aria-busy={isDestinationTransitioning}
              className={`grid gap-7 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:grid-cols-2 ${
                isDestinationTransitioning
                  ? "pointer-events-none scale-[0.97] opacity-0 blur-[2px]"
                  : "scale-100 opacity-100 blur-0"
              }`}
            >
              {destinationOptions.map((destination) => (
                <button
                  key={destination.value}
                  type="button"
                  onClick={() => selectDestination(destination.value)}
                  onMouseEnter={() => setHoveredDestination(destination.value)}
                  onMouseLeave={() => setHoveredDestination(null)}
                  className="group relative flex min-h-[320px] cursor-pointer items-end overflow-hidden rounded-[28px] bg-[#0F172A] text-start shadow-md transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5E9] sm:min-h-[380px] lg:min-h-[430px]"
                >
                  {destination.image ? (
                    <DestinationImage
                      destination={destination.value}
                      src={destination.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                      style={{ objectPosition: destination.customImage ? "center" : destinationImagePositions[destination.value] ?? "center" }}
                    />
                  ) : null}
                  <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t via-black/20 to-transparent ${
                    ["EL_AIN_SOKHNA", "EL_GHARDQA"].includes(destination.value)
                      ? "from-black/75"
                      : "from-black/90"
                  }`} />
                  <span className="relative flex w-full flex-col gap-3 p-7 text-white sm:p-9">
                    <span className="text-3xl font-bold sm:text-4xl">{destination.label}</span>
                    <span className="text-sm text-white/90">
                      {destination.count > 0
                        ? `${destination.count.toLocaleString(lang)} ${d.hotelsAvailable}`
                        : d.noHotelsYet}
                    </span>
                    <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                      {d.viewDestinationHotels}
                      <svg
                        aria-hidden="true"
                        className={`h-4 w-4 transition-transform duration-300 ${isAr ? "" : "rotate-180"}`}
                        style={{
                          transform: hoveredDestination === destination.value
                            ? `translateX(${isAr ? "-4px" : "4px"})`
                            : undefined,
                        }}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </span>
                  </span>
                </button>
              ))}
            </div>
          ) : null}

          {!isLoading && !error && selectedDestination !== null && filteredHotels.length > 0 ? (
            <div className="animate-destination-content-enter grid gap-6 md:grid-cols-2">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} lang={lang} labels={d} />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && selectedDestination !== null && filteredHotels.length === 0 ? (
            <HotelsStatusCard
              title={hasHotelsInDestination ? d.noResults : d.noHotelsInDestination}
              description={
                hasHotelsInDestination
                  ? d.noResultsDescription
                  : d.noHotelsInDestinationDescription
              }
              actionLabel={
                hasHotelsInDestination
                  ? d.clearFilters
                  : d.backToDestinations
              }
              onAction={
                hasHotelsInDestination
                  ? resetFilters
                  : () => changeDestination(null)
              }
            />
          ) : null}
        </div>
      </ScrollReveal>
    </section>
  );
}
