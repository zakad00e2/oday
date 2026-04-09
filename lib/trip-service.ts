import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";

import type { TripDetail, TripOption, TripAddOn } from "./trips-types";

export const TRIP_API_BASE =
  process.env.NEXT_PUBLIC_TRIP_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/trip";

// ── API response types ──────────────────────────────────────────────────────

export interface ApiTripAsset {
  id?: string;
  url: string;
  kind?: string;
  fileType?: string;
  fileSizeInKB?: number;
  tripId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiTripTranslation {
  id?: string;
  trip_id?: string;
  language: "ar" | "en";
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  facilities: string[];
}

export interface ApiTripOptionTranslation {
  id?: string;
  option_id?: string;
  language: "ar" | "en";
  name: string;
  description?: string;
}

export interface ApiTripOption {
  id?: string;
  price: string;
  trip_id?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  translations?: ApiTripOptionTranslation[];
}

export interface ApiTripAddonTranslation {
  id?: string;
  addon_id?: string;
  language: "ar" | "en";
  name: string;
  description: string;
}

export interface ApiTripAddon {
  id?: string;
  price: string;
  trip_id?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  translations?: ApiTripAddonTranslation[];
}

export interface ApiTrip {
  id: string;
  slug: string;
  price: string;
  start_time: string;
  end_time: string;
  youtube_video_url?: string | null;
  video_url?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  assets?: ApiTripAsset[];
  translations?: ApiTripTranslation[];
  options?: ApiTripOption[];
  addons?: ApiTripAddon[];
}

export interface ApiTripListResponse {
  data: ApiTrip[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ── App record type ─────────────────────────────────────────────────────────

export type TripRecord = TripDetail & {
  id: string;
  imageAssetIdsByUrl: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function parseNumber(
  value: string | number | null | undefined,
  fallback = 0,
) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getTranslation(
  translations: ApiTripTranslation[] | undefined,
  language: "ar" | "en",
) {
  return translations?.find((t) => t.language === language);
}

function getOptionTranslation(
  translations: ApiTripOptionTranslation[] | undefined,
  language: "ar" | "en",
) {
  return translations?.find((t) => t.language === language);
}

function getAddonTranslation(
  translations: ApiTripAddonTranslation[] | undefined,
  language: "ar" | "en",
) {
  return translations?.find((t) => t.language === language);
}

const arabicCharacterPattern = /[\u0600-\u06FF]/;
const mojibakeCharacterPattern = /[أƒأکأ™أ‚أگأ¢أ¯آ؟]/g;

function textScore(value: string) {
  const arabicMatches = value.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  const latinMatches = value.match(/[A-Za-z0-9]/g)?.length ?? 0;
  const mojibakeMatches = value.match(mojibakeCharacterPattern)?.length ?? 0;
  const replacementMatches = value.match(/\uFFFD/g)?.length ?? 0;

  return arabicMatches * 3 + latinMatches - mojibakeMatches * 4 - replacementMatches * 6;
}

function repairText(value: string | null | undefined): string {
  if (!value) return "";

  const normalizedValue = value.trim();
  if (!normalizedValue) return "";

  const hasArabic = arabicCharacterPattern.test(normalizedValue);
  const looksBroken = mojibakeCharacterPattern.test(normalizedValue);

  if (hasArabic || !looksBroken) {
    mojibakeCharacterPattern.lastIndex = 0;
    return normalizedValue;
  }

  mojibakeCharacterPattern.lastIndex = 0;

  try {
    const bytes = Uint8Array.from(
      Array.from(normalizedValue, (character) => character.codePointAt(0) ?? 0).map(
        (codePoint) => codePoint & 0xff,
      ),
    );
    const decoded = new TextDecoder("utf-8", { fatal: false }).decode(bytes).trim();

    if (!decoded || decoded.includes("\uFFFD")) {
      return normalizedValue;
    }

    return textScore(decoded) > textScore(normalizedValue) ? decoded : normalizedValue;
  } catch {
    return normalizedValue;
  }
}

function repairTextList(values: string[] | null | undefined): string[] {
  return (values ?? []).map((v) => repairText(v)).filter(Boolean);
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

// ── Mapping API → TripRecord ────────────────────────────────────────────────

function createTripRecord(apiTrip: ApiTrip): TripRecord {
  const ar = getTranslation(apiTrip.translations, "ar");
  const en = getTranslation(apiTrip.translations, "en");
  const assets = apiTrip.assets ?? [];
  const imageAssetIdsByUrl: Record<string, string[]> = {};

  for (const asset of assets) {
    if (asset.url && asset.id) {
      imageAssetIdsByUrl[asset.url] = [
        ...(imageAssetIdsByUrl[asset.url] ?? []),
        asset.id,
      ];
    }
  }

  const mainAssets = assets.filter((a) => a.kind === "TRIP_MAIN_IMAGE");
  const galleryAssets = assets.filter(
    (a) => a.kind !== "TRIP_MAIN_IMAGE" && a.url,
  );
  const mainImageUrls = dedupe(mainAssets.map((a) => a.url));
  const galleryImages = dedupe(galleryAssets.map((a) => a.url));
  const heroImage = mainImageUrls.at(-1) || galleryImages[0] || "";

  const options: TripOption[] = (apiTrip.options ?? [])
    .filter((o) => !o.is_deleted)
    .map((option, index) => {
      const optAr = getOptionTranslation(option.translations, "ar");
      const optEn = getOptionTranslation(option.translations, "en");
      return {
        id: option.id ?? `opt-${index}`,
        nameAr: repairText(optAr?.name || optEn?.name),
        nameEn: repairText(optEn?.name || optAr?.name),
        descriptionAr: repairText(optAr?.description || optEn?.description),
        descriptionEn: repairText(optEn?.description || optAr?.description),
        price: parseNumber(option.price),
      };
    });

  const addOns: TripAddOn[] = (apiTrip.addons ?? [])
    .filter((a) => !a.is_deleted)
    .map((addon, index) => {
      const addAr = getAddonTranslation(addon.translations, "ar");
      const addEn = getAddonTranslation(addon.translations, "en");
      return {
        id: addon.id ?? `addon-${index}`,
        nameAr: repairText(addAr?.name || addEn?.name),
        nameEn: repairText(addEn?.name || addAr?.name),
        price: parseNumber(addon.price),
        descriptionAr: repairText(addAr?.description || addEn?.description),
        descriptionEn: repairText(addEn?.description || addAr?.description),
      };
    });

  return {
    id: apiTrip.id,
    slug: apiTrip.slug,
    titleAr: repairText(ar?.title || en?.title),
    titleEn: repairText(en?.title || ar?.title),
    taglineAr: repairText(ar?.subtitle || en?.subtitle),
    taglineEn: repairText(en?.subtitle || ar?.subtitle),
    descriptionAr: repairText(ar?.description || en?.description),
    descriptionEn: repairText(en?.description || ar?.description),
    heroImage,
    galleryImages,
    youtubeUrl: apiTrip.youtube_video_url?.trim() ?? apiTrip.video_url?.trim() ?? "",
    schedule: {
      startTime: apiTrip.start_time || "",
      endTime: apiTrip.end_time || "",
      durationAr: repairText(ar?.duration || en?.duration),
      durationEn: repairText(en?.duration || ar?.duration),
    },
    includesAr: repairTextList(ar?.facilities),
    includesEn: repairTextList(en?.facilities),
    essentialsAr: [],
    essentialsEn: [],
    options,
    addOns,
    startingPrice: parseNumber(apiTrip.price),
    bookingFields: ["name", "guests", "hotel", "date", "notes"],
    imageAssetIdsByUrl,
    createdAt: apiTrip.created_at ?? "",
    updatedAt: apiTrip.updated_at ?? "",
  };
}

// ── Error class ─────────────────────────────────────────────────────────────

export class TripServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "TripServiceError";
    this.status = status;
  }
}

// ── HTTP helpers ────────────────────────────────────────────────────────────

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

async function requestJson<T>(path = "", init?: RequestInit): Promise<T> {
  const headers = createAuthorizedHeaders(init?.headers);
  if (!(init?.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${TRIP_API_BASE}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const payload = await parseResponse(response);

  if (
    (response.status === 401 || response.status === 403) &&
    headers.has("Authorization")
  ) {
    broadcastUnauthorizedSession();
  }

  if (!response.ok) {
    const message =
      typeof payload === "object" &&
      payload !== null &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new TripServiceError(message, response.status);
  }

  return payload as T;
}

// ── Mutation types ──────────────────────────────────────────────────────────

export interface TripMutationInput {
  slug: string;
  price: number;
  startTime: string;
  endTime: string;
  youtubeUrl: string;
  titleAr: string;
  titleEn: string;
  subtitleAr: string;
  subtitleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  durationAr: string;
  durationEn: string;
  facilitiesAr: string[];
  facilitiesEn: string[];
  options: {
    price: number;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }[];
  addons: {
    price: number;
    nameAr: string;
    nameEn: string;
    descriptionAr: string;
    descriptionEn: string;
  }[];
}

export interface TripMediaInput {
  mainImageFiles?: File[];
  galleryFiles?: File[];
  deleteAssetIds?: string[];
}

// ── Build FormData for create/update ────────────────────────────────────────

function buildTripFormData(
  input: TripMutationInput,
  media?: TripMediaInput,
): FormData {
  const formData = new FormData();

  formData.set("slug", input.slug);
  formData.set("price", String(Math.max(0, input.price)));
  formData.set("start_time", input.startTime);
  formData.set("end_time", input.endTime);
  formData.set("youtube_video_url", input.youtubeUrl.trim());

  const translations = [
    {
      language: "ar",
      title: input.titleAr.trim(),
      subtitle: input.subtitleAr.trim(),
      description: input.descriptionAr.trim(),
      duration: input.durationAr.trim(),
      facilities: input.facilitiesAr,
    },
    {
      language: "en",
      title: input.titleEn.trim(),
      subtitle: input.subtitleEn.trim(),
      description: input.descriptionEn.trim(),
      duration: input.durationEn.trim(),
      facilities: input.facilitiesEn,
    },
  ];

  const options = input.options.map((opt) => ({
    price: Math.max(0, opt.price),
    translations: [
      {
        language: "ar",
        name: opt.nameAr.trim(),
        description: opt.descriptionAr.trim(),
      },
      {
        language: "en",
        name: opt.nameEn.trim(),
        description: opt.descriptionEn.trim(),
      },
    ],
  }));

  const addons = input.addons.map((addon) => ({
    price: Math.max(0, addon.price),
    translations: [
      {
        language: "ar",
        name: addon.nameAr.trim(),
        description: addon.descriptionAr.trim(),
      },
      {
        language: "en",
        name: addon.nameEn.trim(),
        description: addon.descriptionEn.trim(),
      },
    ],
  }));

  formData.set("translations", JSON.stringify(translations));
  formData.set("options", JSON.stringify(options));
  formData.set("addons", JSON.stringify(addons));

  for (const file of media?.mainImageFiles ?? []) {
    formData.append("mainImages", file, file.name);
  }

  for (const file of media?.galleryFiles ?? []) {
    formData.append("subImages", file, file.name);
  }

  for (const [index, assetId] of (media?.deleteAssetIds ?? []).entries()) {
    if (!assetId) continue;
    formData.append(`deleteAssetIds[${index}]`, assetId);
  }

  return formData;
}

// ── Slug helper ─────────────────────────────────────────────────────────────

export function slugifyTrip(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `trip-${Date.now()}`;
}

// ── CRUD operations ─────────────────────────────────────────────────────────

export async function listTrips(options?: {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}) {
  const search = new URLSearchParams();

  if (options?.page) search.set("page", String(options.page));
  if (options?.limit) search.set("limit", String(options.limit));

  const query = search.toString();
  const payload = await requestJson<ApiTripListResponse>(
    query ? `?${query}` : "",
    { method: "GET", signal: options?.signal },
  );

  return {
    trips: payload.data
      .filter((t) => !t.is_deleted)
      .map(createTripRecord),
    meta: payload.meta,
  };
}

export async function getTripById(id: string, signal?: AbortSignal) {
  const payload = await requestJson<ApiTrip>(`/${id}`, {
    method: "GET",
    signal,
  });
  return createTripRecord(payload);
}

export async function getTripBySlug(
  slug: string,
  signal?: AbortSignal,
): Promise<TripRecord | null> {
  let page = 1;
  const limit = 100;

  while (true) {
    const result = await listTrips({ page, limit, signal });
    const found = result.trips.find((t) => t.slug === slug);

    if (found) return found;
    if (page >= result.meta.totalPages) return null;
    page += 1;
  }
}

export async function createTrip(
  input: TripMutationInput,
  media?: TripMediaInput,
) {
  const payload = await requestJson<ApiTrip>("", {
    method: "POST",
    body: buildTripFormData(input, media),
  });
  return createTripRecord(payload);
}

export async function updateTrip(
  id: string,
  input: TripMutationInput,
  media?: TripMediaInput,
) {
  const payload = await requestJson<ApiTrip>(`/${id}`, {
    method: "PATCH",
    body: buildTripFormData(input, media),
  });
  return createTripRecord(payload);
}

export async function deleteTrip(id: string) {
  await requestJson<unknown>(`/${id}`, { method: "DELETE" });
}
