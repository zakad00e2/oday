"use client";

import { useEffect, useState } from "react";
import { listDestinations, type DestinationRecord } from "./destination-service";

type FetchPage<T> = (destination: string, page: number, signal: AbortSignal) => Promise<{
  items: T[];
  totalPages: number;
}>;

// Keep destination counts independent of paginated hotel/trip lists. Aborting a
// selection also prevents a slower, previous request from replacing its results.
export function useDestinationCatalog<T>(
  type: "hotels" | "trips",
  selectedDestination: string | null,
  fetchPage: FetchPage<T>,
) {
  const [destinations, setDestinations] = useState<DestinationRecord[]>([]);
  const [revision, setRevision] = useState(0);
  const key = JSON.stringify([selectedDestination, revision]);
  const [result, setResult] = useState<{ key: string; items: T[]; error: string | null }>();

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    async function load() {
      try {
        const items: T[] = [];
        if (selectedDestination === null) {
          const records = await listDestinations({ type, signal });
          if (signal.aborted) return;
          setDestinations(records);
        } else {
          let page = 1;
          let totalPages = 1;
          do {
            const response = await fetchPage(selectedDestination, page, signal);
            if (signal.aborted) return;
            items.push(...response.items);
            totalPages = response.totalPages;
            page += 1;
          } while (page <= totalPages);
        }
        if (!signal.aborted) setResult({ key, items, error: null });
      } catch (error) {
        if (!signal.aborted) {
          setResult({ key, items: [], error: error instanceof Error ? error.message : "Unable to load destinations." });
        }
      }
    }

    void load();
    return () => controller.abort();
  }, [type, selectedDestination, fetchPage, key]);

  return {
    destinations,
    items: result?.key === key ? result.items : [],
    isLoading: result?.key !== key,
    error: result?.key === key ? result.error : null,
    retry: () => setRevision((value) => value + 1),
  };
}
