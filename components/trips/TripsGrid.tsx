"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { listTrips, type TripRecord } from "@/lib/trip-service";
import {
  TRIP_DESTINATION_OPTIONS,
  isSupportedTripDestination,
} from "@/lib/trip-destinations";
import TripCard from "./TripCard";
import ScrollReveal from "../ScrollReveal";
import Skeleton from "../ui/Skeleton";
import { useI18n } from "@/lib/i18n/dictionary-context";

function TripsHeadingSkeleton() {
  return (
    <div className="mb-12 text-center">
      <Skeleton className="mx-auto mb-4 h-8 w-36 rounded-full bg-[#DBEAFE]" />
      <Skeleton className="mx-auto mb-4 h-10 w-full max-w-[24rem] rounded-full md:h-12" />
      <Skeleton className="mx-auto h-4 w-full max-w-[28rem] rounded-full bg-[#F1F5F9]" />
    </div>
  );
}

function TripCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-sm ${
        featured ? "aspect-[4/5] md:aspect-[21/9]" : "aspect-[4/5]"
      }`}
    >
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/60 to-white/15" />

      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
        <Skeleton
          className={`mb-3 h-6 rounded-full bg-white ${
            featured ? "w-3/4 md:w-1/3" : "w-3/4"
          }`}
        />
        <Skeleton
          className={`mb-2 hidden h-4 rounded-full bg-white/80 md:block ${
            featured ? "w-2/3 md:w-1/2" : "w-full"
          }`}
        />
        <Skeleton
          className={`mb-4 hidden h-4 rounded-full bg-white/70 md:block ${
            featured ? "w-1/2 md:w-2/5" : "w-2/3"
          }`}
        />
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28 rounded-full bg-white" />
          <Skeleton className="h-4 w-4 rounded-full bg-white" />
        </div>
      </div>
    </div>
  );
}

function TripsGridSkeleton() {
  return (
    <section id="trips" className="bg-background py-16 md:py-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        <TripsHeadingSkeleton />

        <div className="mb-4 md:mb-5">
          <TripCardSkeleton featured />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {Array.from({ length: 6 }).map((_, index) => (
            <TripCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TripsStatusCard({
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

export default function TripsGrid() {
  const { lang } = useI18n();
  const isAr = lang === "ar";
  const t = (ar: ReactNode, en: ReactNode) => (isAr ? ar : en);

  const [trips, setTrips] = useState<TripRecord[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrips = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true);
      setError(null);
      const result = await listTrips({ page: 1, limit: 100, signal });
      setTrips(result.trips);
    } catch (err) {
      if (signal?.aborted || (err instanceof Error && err.name === "AbortError")) {
        return;
      }

      setError(err instanceof Error ? err.message : "Failed to load trips");
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void loadTrips(controller.signal);

    return () => controller.abort();
  }, [loadTrips]);

  const destinationOptions = useMemo(() => {
    const availableDestinations = new Set(
      trips
        .map((trip) => trip.destination)
        .filter((destination): destination is string => isSupportedTripDestination(destination)),
    );

    return TRIP_DESTINATION_OPTIONS.filter((option) =>
      availableDestinations.has(option.value),
    ).map((option) => ({
      value: option.value,
      label: isAr ? option.labelAr : option.labelEn,
    }));
  }, [isAr, trips]);

  useEffect(() => {
    if (
      selectedDestination !== "all" &&
      !destinationOptions.some((option) => option.value === selectedDestination)
    ) {
      setSelectedDestination("all");
    }
  }, [destinationOptions, selectedDestination]);

  const filteredTrips = useMemo(() => {
    if (selectedDestination === "all") return trips;

    return trips.filter((trip) => trip.destination === selectedDestination);
  }, [selectedDestination, trips]);

  const resetFilters = () => {
    setSelectedDestination("all");
  };

  if (loading) {
    return <TripsGridSkeleton />;
  }

  if (error) {
    return (
      <section id="trips" className="bg-background py-16 md:py-24">
        <div className="max-w-300 mx-auto px-6 md:px-12">
          <TripsStatusCard
            title={t("تعذر تحميل الرحلات", "Unable to load trips") as string}
            description={error}
            actionLabel={t("إعادة المحاولة", "Retry") as string}
            onAction={() => {
              void loadTrips();
            }}
            tone="error"
          />
        </div>
      </section>
    );
  }

  if (trips.length === 0) {
    return (
      <section id="trips" className="bg-background py-16 md:py-24">
        <div className="max-w-300 mx-auto px-6 md:px-12">
          <TripsStatusCard
            title={t("لا توجد رحلات متاحة الآن", "No trips available right now") as string}
            description={
              t(
                "ستظهر هنا الرحلات القادمة مباشرة من لوحة التحكم بمجرد توفرها في الـ API.",
                "Trips created in the dashboard will appear here automatically once available in the API.",
              ) as string
            }
          />
        </div>
      </section>
    );
  }

  const [featured, ...rest] = filteredTrips;

  return (
    <section id="trips" className="bg-background py-16 md:py-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0EA5E9]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0EA5E9]">
              {t("رحلاتنا المميزة", "Featured trips")}
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#0f172a] md:text-4xl">
              {t(
                <>
                  اختر رحلتك <span className="text-[#0f172a]">المفضلة</span>
                </>,
                <>
                  Pick your <span className="text-[#000000]">favorite</span> trip
                </>,
              )}
            </h2>
            <p className="mx-auto max-w-lg text-base text-[#64748b]">
              {t(
                "رحلات وأنشطة متنوعة في انتظارك، وكل رحلة مصممة لتكون تجربة لا تُنسى.",
                "A curated selection of trips and activities is waiting for you, and every trip is built to be unforgettable.",
              )}
            </p>

            <div className="mx-auto mt-8 flex w-full max-w-2xl flex-col gap-4">
              <div className="flex flex-wrap items-end justify-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white px-3 py-3 shadow-sm">
                <div className="flex min-w-[150px] flex-1 flex-col gap-1">
                  <label className="px-1 text-[11px] font-semibold tracking-wide text-[#94A3B8]">
                    {t("الوجهة", "Destination")}
                  </label>
                  <div className="relative">
                    <select
                      value={selectedDestination}
                      onChange={(event) => setSelectedDestination(event.target.value)}
                      className="w-full cursor-pointer appearance-none rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] py-2 pe-4 ps-9 text-[13px] font-medium text-[#0F172A] transition-all focus:border-[#0EA5E9] focus:outline-none focus:ring-2 focus:ring-[#0EA5E9]/30"
                    >
                      <option value="all">{t("كل الوجهات", "All destinations")}</option>
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

                {selectedDestination !== "all" ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="flex h-[36px] min-w-[100px] flex-[0_1_auto] items-center justify-center whitespace-nowrap rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-3 text-[12px] font-semibold text-[#EF4444] transition-all hover:bg-[#FEE2E2]"
                  >
                    {t("مسح الفلاتر", "Clear filters")}
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {filteredTrips.length === 0 ? (
          <TripsStatusCard
            title={t("لا توجد نتائج مطابقة", "No matching trips") as string}
            description={
              t(
                "جرّب اختيار وجهة أخرى أو امسح الفلتر لعرض جميع الرحلات المتاحة.",
                "Try choosing another destination or clear the filter to see all available trips.",
              ) as string
            }
            actionLabel={t("مسح الفلاتر", "Clear filters") as string}
            onAction={resetFilters}
          />
        ) : (
          <>
            {featured ? (
              <ScrollReveal>
                <div className="mb-4 md:mb-5">
                  <TripCard trip={featured} index={0} featured />
                </div>
              </ScrollReveal>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
              {rest.map((trip, index) => (
                <ScrollReveal key={trip.slug} delay={index * 70}>
                  <TripCard trip={trip} index={index + 1} />
                </ScrollReveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
