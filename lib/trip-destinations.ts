import { DESTINATION_OPTIONS } from "./destinations";
export type TripDestination = string;

export interface TripDestinationOption {
  value: TripDestination;
  labelAr: string;
  labelEn: string;
  aliases: readonly string[];
}

export const DEFAULT_TRIP_DESTINATION = "SHARM_EL_SHEIKH";

export const TRIP_DESTINATION_OPTIONS: readonly TripDestinationOption[] = DESTINATION_OPTIONS;

export function normalizeTripDestinationValue(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function resolveTripDestination(
  value: string | null | undefined,
): TripDestination | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;

  const normalized = normalizeTripDestinationValue(trimmed);
  const known = TRIP_DESTINATION_OPTIONS.find((option) =>
    [option.value, ...option.aliases].some(
      (candidate) => normalizeTripDestinationValue(candidate) === normalized,
    ),
  );

  if (known) return known.value;

  return trimmed.toUpperCase().replace(/\s+/g, "_");
}

export function getTripDestinationLabels(value: string | null | undefined) {
  const resolved = resolveTripDestination(value);
  const known = TRIP_DESTINATION_OPTIONS.find((option) => option.value === resolved);

  if (known) {
    return {
      value: known.value,
      ar: known.labelAr,
      en: known.labelEn,
    };
  }

  const fallback = resolved ? titleCase(resolved) : titleCase(DEFAULT_TRIP_DESTINATION);

  return {
    value: resolved ?? DEFAULT_TRIP_DESTINATION,
    ar: fallback,
    en: fallback,
  };
}

export function isSupportedTripDestination(
  value: string | null | undefined,
): value is TripDestination {
  return TRIP_DESTINATION_OPTIONS.some((option) => option.value === value);
}
