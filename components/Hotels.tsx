"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "./ScrollReveal";
import Skeleton from "./ui/Skeleton";
import { formatPrice } from "@/lib/currency";
import {
  isHotelClientCacheFresh,
  readHotelsListCache,
  writeHotelsListCache,
} from "@/lib/hotel-client-cache";
import { useI18n } from "@/lib/i18n/dictionary-context";
import {
  getHotelMealPlanLabel,
  type HotelRecord,
  listHotels,
} from "@/lib/hotel-service";

type SortKey = "default" | "MOST_BOOKED" | "TOP_RATED" | "LOWEST_PRICE";

function HotelsLoadingGrid() {
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
  const hasDiscount = hasHotelDiscount(hotel);
  const discountPercentage = hotel.discountPercentage ?? 0;
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
              {hasDiscount && hotel.originalPrice && hotel.originalPrice > hotel.initialPrice ? (
                <span className="relative inline-flex items-center text-sm font-medium leading-none text-[#9CA3AF]">
                  <span>{formatPrice(hotel.originalPrice, lang)}</span>
                  <span aria-hidden="true" className="absolute start-0 end-0 top-1/2 h-px -translate-y-1/2 bg-[#9CA3AF]" />
                </span>
              ) : null}
              <div className="flex items-baseline gap-0.5">
                <span className="text-2xl font-bold leading-none text-[#0EA5E9]">
                  {formatPrice(hotel.initialPrice, lang)}
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

export default function Hotels() {
  const { dict, lang } = useI18n();
  const d = dict.hotelsPage;
  const isAr = lang === "ar";
  const [hotels, setHotels] = useState<HotelRecord[]>(() => readHotelsListCache()?.hotels ?? []);
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("default");
  const [showDiscountsOnly, setShowDiscountsOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(() => readHotelsListCache() === null);
  const [error, setError] = useState<string | null>(null);

  const loadHotels = useCallback(async ({
    signal,
    showLoading = true,
  }: {
    signal?: AbortSignal;
    showLoading?: boolean;
  } = {}) => {
    try {
      setError(null);
      if (showLoading) {
        setIsLoading(true);
      }
      const response = await listHotels({ page: 1, limit: 100, signal });
      writeHotelsListCache(response.hotels);
      setHotels(response.hotels);
    } catch (loadError) {
      if (signal?.aborted) return;
      const message =
        loadError instanceof Error
          ? loadError.message
          : isAr
            ? "تعذر تحميل الفنادق حاليًا."
            : "Unable to load hotels right now.";
      if (hotels.length === 0) {
        setError(message);
      }
    } finally {
      if (!signal?.aborted) {
        setIsLoading(false);
      }
    }
  }, [isAr, hotels.length]);

  useEffect(() => {
    const controller = new AbortController();
    const cachedHotels = readHotelsListCache();

    if (cachedHotels) {
      setHotels(cachedHotels.hotels);
      setIsLoading(false);

      if (!isHotelClientCacheFresh(cachedHotels.updatedAt)) {
        void loadHotels({ signal: controller.signal, showLoading: false });
      }
    } else {
      void loadHotels({ signal: controller.signal });
    }

    return () => {
      controller.abort();
    };
  }, [loadHotels]);

  const destinationOptions = useMemo(() => {
    const seen = new Set<string>();
    return hotels
      .filter((hotel) => {
        if (seen.has(hotel.destination)) return false;
        seen.add(hotel.destination);
        return true;
      })
      .map((hotel) => ({
        value: hotel.destination,
        label: isAr ? hotel.destinationLabelAr : hotel.destinationLabelEn,
      }));
  }, [hotels, isAr]);

  const filteredHotels = useMemo(() => {
    const byRating = filterByRating(hotels, sortBy);

    return byRating.filter((hotel) => {
      if (selectedDestination !== "all" && hotel.destination !== selectedDestination) {
        return false;
      }

      if (showDiscountsOnly && !hasHotelDiscount(hotel)) {
        return false;
      }

      return true;
    });
  }, [hotels, selectedDestination, showDiscountsOnly, sortBy]);

  const resetFilters = () => {
    setSelectedDestination("all");
    setSortBy("default");
    setShowDiscountsOnly(false);
  };

  return (
    <section id="hotels" className="bg-[#FAFAFA] py-20">
      <ScrollReveal>
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="mb-4 text-3xl font-semibold leading-tight text-[#111] md:text-5xl">
              {d.title} <span>{d.titleBold}</span>
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#6B7280] md:text-base">
              {d.subtitle}
            </p>

            <div className="mx-auto mb-10 flex w-full max-w-2xl flex-col gap-4">
              <div className="flex flex-wrap items-end justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-3 py-3 shadow-sm">
                <div className="flex min-w-[150px] flex-1 flex-col gap-1">
                  <label className="px-1 text-[11px] font-semibold tracking-wide text-[#94A3B8]">
                    {d.destinationLabel}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDestination}
                      onChange={(event) => setSelectedDestination(event.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pe-4 ps-9 text-[13px] font-medium text-[#0F172A] transition-all focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                    >
                      <option value="all">{d.allDestinations}</option>
                      {destinationOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute start-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]">
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {(selectedDestination !== "all" || sortBy !== "default" || showDiscountsOnly) && !isLoading ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex h-[36px] min-w-[100px] flex-[0_1_auto] items-center justify-center whitespace-nowrap rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 text-[12px] font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                  >
                    {d.clearFilters}
                  </button>
                ) : null}
              </div>

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
          </div>

          {isLoading ? <HotelsLoadingGrid /> : null}

          {!isLoading && error ? (
            <HotelsStatusCard
              title={isAr ? "تعذر تحميل الفنادق" : "Unable to load hotels"}
              description={error}
              actionLabel={isAr ? "إعادة المحاولة" : "Retry"}
              onAction={() => {
                void loadHotels();
              }}
              tone="error"
            />
          ) : null}

          {!isLoading && !error && filteredHotels.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} lang={lang} labels={d} />
              ))}
            </div>
          ) : null}

          {!isLoading && !error && filteredHotels.length === 0 ? (
            <HotelsStatusCard
              title={hotels.length === 0 ? (isAr ? "لا توجد فنادق متاحة الآن" : "No hotels available right now") : d.noResults}
              description={
                hotels.length === 0
                  ? isAr
                    ? "ستظهر هنا الفنادق القادمة مباشرة من لوحة التحكم بمجرد توفرها في الـ API."
                    : "Hotels created in the dashboard will appear here automatically once available in the API."
                  : isAr
                    ? "جرّب تغيير الوجهة أو إزالة الفلاتر لعرض نتائج أكثر."
                    : "Try changing the destination or clearing the filters to see more results."
              }
              actionLabel={hotels.length === 0 ? undefined : d.clearFilters}
              onAction={hotels.length === 0 ? undefined : resetFilters}
            />
          ) : null}
        </div>
      </ScrollReveal>
    </section>
  );
}
