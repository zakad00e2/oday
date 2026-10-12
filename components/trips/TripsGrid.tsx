"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import Image from "next/image";
import { listTrips, type TripRecord } from "@/lib/trip-service";
import { TRIP_DESTINATION_OPTIONS } from "@/lib/trip-destinations";
import TripCard from "./TripCard";
import ScrollReveal from "../ScrollReveal";
import Skeleton from "../ui/Skeleton";
import { useI18n } from "@/lib/i18n/dictionary-context";

const destinationImages: Record<string, string> = {
  SHARM_EL_SHEIKH: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=85",
  EL_GHARDQA: "/images/hurghada.jpg",
  EL_AIN_SOKHNA: "/images/ain-sokhna.jpg",
  EL_GOUNA: "/images/destinations/el-gouna.jpg",
};

const destinationImagePositions: Record<string, string> = {
  EL_GHARDQA: "center 58%",
  EL_AIN_SOKHNA: "center 65%",
};

function TripsHeadingSkeleton() {
  return (
    <div className="mb-12 text-center">
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

function TripsGridSkeleton({ destinations }: { destinations: boolean }) {
  return (
    <section id="trips" className="scroll-mt-24 bg-background py-16 md:py-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        <TripsHeadingSkeleton />

        {destinations ? (
          <div className="grid gap-7 md:grid-cols-2">
            {TRIP_DESTINATION_OPTIONS.map((destination) => (
              <Skeleton key={destination.value} className="min-h-[320px] rounded-[28px] sm:min-h-[380px] lg:min-h-[430px]" />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-4 md:mb-5">
              <TripCardSkeleton featured />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <TripCardSkeleton key={index} />
              ))}
            </div>
          </>
        )}
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
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [isDestinationTransitioning, setIsDestinationTransitioning] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const destinationTransitionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  useEffect(() => () => {
    if (destinationTransitionTimerRef.current !== null) {
      clearTimeout(destinationTransitionTimerRef.current);
    }
  }, []);

  const destinationOptions = useMemo(() => {
    return TRIP_DESTINATION_OPTIONS.map((option) => ({
      value: option.value,
      label: isAr ? option.labelAr : option.labelEn,
      image: destinationImages[option.value],
      count: trips.filter((trip) => trip.destination === option.value).length,
    })).filter((destination) => destination.count > 0);
  }, [isAr, trips]);

  const activeDestination = destinationOptions.find(
    (destination) => destination.value === selectedDestination,
  );

  const filteredTrips = useMemo(() => {
    if (selectedDestination === null) return [];

    return trips.filter((trip) => trip.destination === selectedDestination);
  }, [selectedDestination, trips]);

  const changeDestination = (destination: string | null) => {
    setSelectedDestination(destination);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current?.scrollIntoView({ block: "start" });
    });
  };

  const selectDestination = (destination: string) => {
    if (destinationTransitionTimerRef.current !== null) return;

    setIsDestinationTransitioning(true);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    destinationTransitionTimerRef.current = setTimeout(() => {
      destinationTransitionTimerRef.current = null;
      changeDestination(destination);
      setIsDestinationTransitioning(false);
    }, reducedMotion ? 0 : 520);
  };

  if (loading) {
    return <TripsGridSkeleton destinations={selectedDestination === null} />;
  }

  if (error) {
    return (
      <section id="trips" className="scroll-mt-24 bg-background py-16 md:py-24">
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

  const [featured, ...rest] = filteredTrips;

  return (
    <section id="trips" className="scroll-mt-24 bg-background py-16 md:py-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        <ScrollReveal>
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
                {t("العودة إلى الوجهات", "Back to destinations")}
              </button>
            ) : null}
            <h2 ref={headingRef} tabIndex={-1} className={`mb-4 text-3xl font-semibold leading-tight text-[#111] outline-none md:text-5xl ${selectedDestination === null ? "scroll-mt-28" : "scroll-mt-48"}`}>
              {selectedDestination === null
                ? t("اختر وجهتك", "Choose your destination")
                : t(`رحلات ${activeDestination?.label ?? selectedDestination}`, `Trips in ${activeDestination?.label ?? selectedDestination}`)}
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-sm leading-relaxed text-[#6B7280] md:text-base">
              {selectedDestination === null ? t(
                "اختر وجهتك لتكتشف الرحلات والأنشطة المتاحة فيها.",
                "Choose where you want to go to discover the trips and activities available there.",
              ) : t(
                "رحلات وأنشطة متنوعة في انتظارك، وكل رحلة مصممة لتكون تجربة لا تُنسى.",
                "A curated selection of trips and activities is waiting for you, and every trip is built to be unforgettable.",
              )}
            </p>
          </div>
        </ScrollReveal>

        {selectedDestination === null && destinationOptions.length === 0 ? (
          <TripsStatusCard
            title={t("لا توجد رحلات متاحة حاليًا", "No trips available yet") as string}
            description={t("ستظهر الوجهات هنا عند إضافة رحلات إليها.", "Destinations will appear here when trips are added to them.") as string}
          />
        ) : selectedDestination === null ? (
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
                className="group relative flex min-h-[320px] cursor-pointer items-end overflow-hidden rounded-[28px] bg-[#0F172A] text-start shadow-md transition-all hover:-translate-y-1 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0EA5E9] sm:min-h-[380px] lg:min-h-[430px]"
              >
                {destination.image ? (
                  <Image
                    src={destination.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
                    style={{ objectPosition: destinationImagePositions[destination.value] ?? "center" }}
                  />
                ) : null}
                <span aria-hidden="true" className={`absolute inset-0 bg-gradient-to-t via-black/20 to-transparent ${destination.value === "SHARM_EL_SHEIKH" ? "from-black/90" : "from-black/75"}`} />
                <span className="relative flex w-full flex-col gap-3 p-7 text-white sm:p-9">
                  <span className="text-3xl font-bold sm:text-4xl">{destination.label}</span>
                  <span className="text-sm text-white/90">
                    {destination.count > 0
                      ? `${destination.count.toLocaleString(lang)} ${t("رحلات متاحة", "trips available")}`
                      : t("لا توجد رحلات متاحة بعد", "No trips available yet")}
                  </span>
                  <span className="mt-2 inline-flex items-center gap-2 text-sm font-semibold">
                    {t("عرض الرحلات", "View trips")}
                    <svg aria-hidden="true" className={`h-4 w-4 transition-transform duration-300 ${isAr ? "group-hover:-translate-x-1" : "rotate-180 group-hover:translate-x-1"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : filteredTrips.length === 0 ? (
          <TripsStatusCard
            title={t("لا توجد رحلات متاحة في هذه الوجهة بعد", "No trips are available in this destination yet") as string}
            description={
              t(
                "ستُضاف رحلات هذه الوجهة قريبًا. يمكنك العودة لاختيار وجهة أخرى.",
                "Trips for this destination will be added soon. You can return to choose another destination.",
              ) as string
            }
            actionLabel={t("العودة إلى الوجهات", "Back to destinations") as string}
            onAction={() => changeDestination(null)}
          />
        ) : (
          <div className="animate-destination-content-enter">
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
          </div>
        )}
      </div>
    </section>
  );
}
