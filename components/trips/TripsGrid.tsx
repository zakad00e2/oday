"use client";

import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { listTrips, type TripRecord } from "@/lib/trip-service";
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

export default function TripsGrid() {
  const { lang } = useI18n();
  const t = (ar: ReactNode, en: ReactNode) => (lang === "ar" ? ar : en);

  const [trips, setTrips] = useState<TripRecord[]>([]);
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

  if (loading) {
    return <TripsGridSkeleton />;
  }

  if (error) {
    return (
      <section id="trips" className="bg-background py-16 md:py-24">
        <div className="max-w-300 mx-auto px-6 text-center md:px-12">
          <p className="text-base text-[#64748b]">
            {t(
              "\u062d\u062f\u062b \u062e\u0637\u0623 \u0641\u064a \u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0631\u062d\u0644\u0627\u062a. \u062d\u0627\u0648\u0644 \u0645\u0631\u0629 \u0623\u062e\u0631\u0649.",
              "Failed to load trips. Please try again.",
            )}
          </p>
          <button
            onClick={() => {
              void loadTrips();
            }}
            className="mt-4 rounded-full bg-[#0EA5E9] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0284C7]"
          >
            {t("\u0625\u0639\u0627\u062f\u0629 \u0627\u0644\u0645\u062d\u0627\u0648\u0644\u0629", "Retry")}
          </button>
        </div>
      </section>
    );
  }

  if (trips.length === 0) {
    return (
      <section id="trips" className="bg-background py-16 md:py-24">
        <div className="max-w-300 mx-auto px-6 text-center md:px-12">
          <p className="text-base text-[#64748b]">
            {t(
              "\u0644\u0627 \u062a\u0648\u062c\u062f \u0631\u062d\u0644\u0627\u062a \u0645\u062a\u0627\u062d\u0629 \u062d\u0627\u0644\u064a\u0627\u064b.",
              "No trips available at the moment.",
            )}
          </p>
        </div>
      </section>
    );
  }

  const [featured, ...rest] = trips;

  return (
    <section id="trips" className="bg-background py-16 md:py-24">
      <div className="max-w-300 mx-auto px-6 md:px-12">
        <ScrollReveal>
          <div className="mb-12 text-center">
            <span className="mb-4 inline-block rounded-full bg-[#0EA5E9]/8 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0EA5E9]">
              {t("\u0631\u062d\u0644\u0627\u062a\u0646\u0627 \u0627\u0644\u0645\u0645\u064a\u0632\u0629", "Featured trips")}
            </span>
            <h2 className="mb-4 text-3xl font-bold text-[#0f172a] md:text-4xl">
              {t(
                <>
                  {"\u0627\u062e\u062a\u0631 \u0631\u062d\u0644\u062a\u0643 "}
                  <span className="text-[#0f172a]">
                    {"\u0627\u0644\u0645\u0641\u0636\u0644\u0629"}
                  </span>
                </>,
                <>
                  Pick your <span className="text-[#000000]">favorite</span> trip
                </>,
              )}
            </h2>
            <p className="mx-auto max-w-lg text-base text-[#64748b]">
              {t(
                "\u0631\u062d\u0644\u0627\u062a \u0648\u0623\u0646\u0634\u0637\u0629 \u0645\u062a\u0646\u0648\u0639\u0629 \u0641\u064a \u0627\u0646\u062a\u0638\u0627\u0631\u0643 - \u0643\u0644 \u0631\u062d\u0644\u0629 \u062a\u062c\u0631\u0628\u0629 \u0644\u0627 \u062a\u064f\u0646\u0633\u0649",
                "A variety of trips and activities await you - every trip is unforgettable",
              )}
            </p>
          </div>
        </ScrollReveal>

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
    </section>
  );
}
