import {
  broadcastUnauthorizedSession,
  createAuthorizedHeaders,
} from "./auth-service";

export const HOTEL_API_BASE =
  process.env.NEXT_PUBLIC_HOTEL_API_BASE ??
  "https://oday-tourisim-production.up.railway.app/hotel";

export type HotelLanguage = "ar" | "en";
export type HotelStarsValue = "ONE" | "TWO" | "THREE" | "FOUR" | "FIVE";
export type HotelRatingValue = string;
export type HotelDestination = string;

export interface ApiHotelAsset {
  id?: string;
  url: string;
  kind?: string;
  fileType?: string;
  fileSizeInKB?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiHotelTranslation {
  id?: string;
  hotel_id?: string;
  language: HotelLanguage;
  name: string;
  slug: string;
  description: string;
  Facilities?: string[];
}

export interface ApiHotelRoomTranslation {
  id?: string;
  room_id?: string;
  language: HotelLanguage;
  name: string;
  description?: string;
}

export interface ApiHotelRoom {
  id?: string;
  capacity: string;
  price: string;
  hotel_id?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  translations?: ApiHotelRoomTranslation[];
}

export interface ApiHotelAddonTranslation {
  id?: string;
  addon_id?: string;
  language: HotelLanguage;
  name: string;
  description: string;
}

export interface ApiHotelAddon {
  id?: string;
  price: string;
  hotel_id?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  translations?: ApiHotelAddonTranslation[];
}

export interface ApiHotel {
  id: string;
  destination: HotelDestination;
  initial_price: string;
  stars: HotelStarsValue;
  rating: HotelRatingValue;
  is_discounted: boolean;
  discount_percentage: string;
  original_price: string;
  youtube_video_url?: string;
  is_deleted?: boolean;
  created_at?: string;
  updated_at?: string;
  assets?: ApiHotelAsset[];
  translations?: ApiHotelTranslation[];
  rooms?: ApiHotelRoom[];
  addons?: ApiHotelAddon[];
}

export interface ApiHotelListResponse {
  data: ApiHotel[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HotelRoomRecord {
  id: string;
  capacity: number;
  price: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface HotelAddonRecord {
  id: string;
  price: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface HotelRecord {
  id: string;
  slug: string;
  slugAr: string;
  slugEn: string;
  destination: HotelDestination;
  destinationLabelAr: string;
  destinationLabelEn: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  facilitiesAr: string[];
  facilitiesEn: string[];
  mainImages: string[];
  mainImage: string;
  gallery: string[];
  initialPrice: number;
  originalPrice: number | null;
  isDiscounted: boolean;
  discountPercentage: number | null;
  stars: number;
  starsValue: HotelStarsValue;
  ratingValue: HotelRatingValue;
  youtubeVideoUrl: string;
  rooms: HotelRoomRecord[];
  addons: HotelAddonRecord[];
  imageAssetIdsByUrl: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface HotelMutationRoomInput {
  capacity: number;
  price: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface HotelMutationAddonInput {
  price: number;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface HotelMutationInput {
  destination: HotelDestination;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  facilitiesAr: string[];
  facilitiesEn: string[];
  mainImage: string;
  gallery: string[];
  initialPrice: number;
  originalPrice: number | null;
  isDiscounted: boolean;
  discountPercentage: number | null;
  stars: HotelStarsValue;
  rating: HotelRatingValue;
  youtubeVideoUrl: string;
  rooms: HotelMutationRoomInput[];
  addons: HotelMutationAddonInput[];
}

export interface HotelCreateMediaInput {
  mainImageFiles?: File[];
  galleryFiles?: File[];
  deleteAssetIds?: string[];
}

export class HotelServiceError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "HotelServiceError";
    this.status = status;
  }
}

const destinationLabels: Record<string, { ar: string; en: string }> = {
  SHARM_EL_SHEIKH: { ar: "شرم الشيخ", en: "Sharm El Sheikh" },
  EL_GHARDQA: { ar: "الغردقة", en: "Hurghada" },
  DAHAB: { ar: "دهب", en: "Dahab" },
  EL_AIN_SOKHNA: { ar: "العين السخنة", en: "Ain Sokhna" },
  CAIRO: { ar: "القاهرة", en: "Cairo" },
  ALEXANDRIA: { ar: "الإسكندرية", en: "Alexandria" },
  LUXOR: { ar: "الأقصر", en: "Luxor" },
  ASWAN: { ar: "أسوان", en: "Aswan" },
  MARSA_ALAM: { ar: "مرسى علم", en: "Marsa Alam" },
};

const hotelStarsMap: Record<HotelStarsValue, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

const arabicCharacterPattern = /[\u0600-\u06FF]/;
const mojibakeCharacterPattern = /[ÃØÙÂÐâï¿]/g;

function parseNumber(value: string | number | null | undefined, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function dedupe(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function appendAssetIdByUrl(
  collection: Record<string, string[]>,
  url: string,
  assetId: string | undefined,
) {
  if (!url || !assetId) return;

  collection[url] = [...(collection[url] ?? []), assetId];
}

function textScore(value: string) {
  const arabicMatches = value.match(/[\u0600-\u06FF]/g)?.length ?? 0;
  const latinMatches = value.match(/[A-Za-z0-9]/g)?.length ?? 0;
  const mojibakeMatches = value.match(mojibakeCharacterPattern)?.length ?? 0;
  const replacementMatches = value.match(/\uFFFD/g)?.length ?? 0;

  return arabicMatches * 3 + latinMatches - mojibakeMatches * 4 - replacementMatches * 6;
}

function repairText(value: string | null | undefined) {
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

function repairTextList(values: string[] | undefined) {
  return (values ?? []).map((value) => repairText(value)).filter(Boolean);
}

function titleCase(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugifyHotel(value: string) {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `hotel-${Date.now()}`;
}

function getDestinationLabels(destination: HotelDestination) {
  const known = destinationLabels[destination];
  if (known) return known;

  return {
    ar: titleCase(destination),
    en: titleCase(destination),
  };
}

function getTranslation(
  translations: ApiHotelTranslation[] | undefined,
  language: HotelLanguage,
) {
  return translations?.find((translation) => translation.language === language);
}

function getRoomTranslation(
  translations: ApiHotelRoomTranslation[] | undefined,
  language: HotelLanguage,
) {
  return translations?.find((translation) => translation.language === language);
}

function getAddonTranslation(
  translations: ApiHotelAddonTranslation[] | undefined,
  language: HotelLanguage,
) {
  return translations?.find((translation) => translation.language === language);
}

function isMainHotelAsset(asset: ApiHotelAsset) {
  return asset.kind === "HOTEL_MAIN_IMAGE" || asset.kind === "MAIN";
}

function isGalleryHotelAsset(asset: ApiHotelAsset) {
  return asset.kind === "HOTEL_GALLERY_IMAGE" || asset.kind === "GALLERY";
}

function createHotelRecord(apiHotel: ApiHotel): HotelRecord {
  const ar = getTranslation(apiHotel.translations, "ar");
  const en = getTranslation(apiHotel.translations, "en");
  const assets = apiHotel.assets ?? [];
  const imageAssetIdsByUrl: Record<string, string[]> = {};

  for (const asset of assets) {
    appendAssetIdByUrl(imageAssetIdsByUrl, asset.url, asset.id);
  }

  const explicitMainAssets = assets.filter(isMainHotelAsset);
  const explicitGalleryAssets = assets.filter(isGalleryHotelAsset);
  const fallbackAssets = assets.filter(
    (asset) => !isMainHotelAsset(asset) && !isGalleryHotelAsset(asset),
  );
  const mainImages = dedupe(
    explicitMainAssets.map((asset) => asset.url).filter(Boolean),
  );
  const fallbackImage = fallbackAssets[0]?.url || explicitGalleryAssets[0]?.url || "";
  const mainImage = mainImages[0] || fallbackImage;
  const gallery = dedupe(
    [
      ...explicitGalleryAssets.map((asset) => asset.url),
      ...fallbackAssets
        .map((asset) => asset.url)
        .filter((url) => url && !mainImages.includes(url) && url !== mainImage),
    ].filter(Boolean),
  );
  const labels = getDestinationLabels(apiHotel.destination);
  const repairedNameAr = repairText(ar?.name || en?.name || "");
  const repairedNameEn = repairText(en?.name || ar?.name || "");
  const repairedDescriptionAr = repairText(ar?.description || en?.description || "");
  const repairedDescriptionEn = repairText(en?.description || ar?.description || "");

  return {
    id: apiHotel.id,
    slug: en?.slug || ar?.slug || apiHotel.id,
    slugAr: ar?.slug || en?.slug || apiHotel.id,
    slugEn: en?.slug || ar?.slug || apiHotel.id,
    destination: apiHotel.destination,
    destinationLabelAr: repairText(labels.ar),
    destinationLabelEn: repairText(labels.en),
    nameAr: repairedNameAr,
    nameEn: repairedNameEn || repairedNameAr,
    descriptionAr: repairedDescriptionAr,
    descriptionEn: repairedDescriptionEn || repairedDescriptionAr,
    facilitiesAr: repairTextList(ar?.Facilities),
    facilitiesEn: repairTextList(en?.Facilities),
    mainImages: mainImages.length > 0 ? mainImages : mainImage ? [mainImage] : [],
    mainImage,
    gallery,
    initialPrice: parseNumber(apiHotel.initial_price),
    originalPrice: apiHotel.original_price ? parseNumber(apiHotel.original_price) : null,
    isDiscounted: Boolean(apiHotel.is_discounted),
    discountPercentage: apiHotel.discount_percentage ? parseNumber(apiHotel.discount_percentage) : null,
    stars: hotelStarsMap[apiHotel.stars] ?? 0,
    starsValue: apiHotel.stars,
    ratingValue: apiHotel.rating,
    youtubeVideoUrl: apiHotel.youtube_video_url ?? "",
    rooms: (apiHotel.rooms ?? []).map((room, index) => ({
      id: room.id ?? `room-${index + 1}`,
      capacity: parseNumber(room.capacity),
      price: parseNumber(room.price),
      nameAr: repairText(
        getRoomTranslation(room.translations, "ar")?.name ||
          getRoomTranslation(room.translations, "en")?.name ||
          "",
      ),
      nameEn: repairText(
        getRoomTranslation(room.translations, "en")?.name ||
          getRoomTranslation(room.translations, "ar")?.name ||
          "",
      ),
      descriptionAr: repairText(
        getRoomTranslation(room.translations, "ar")?.description ||
          getRoomTranslation(room.translations, "en")?.description ||
          "",
      ),
      descriptionEn: repairText(
        getRoomTranslation(room.translations, "en")?.description ||
          getRoomTranslation(room.translations, "ar")?.description ||
          "",
      ),
    })),
    addons: (apiHotel.addons ?? []).map((addon, index) => ({
      id: addon.id ?? `addon-${index + 1}`,
      price: parseNumber(addon.price),
      nameAr: repairText(
        getAddonTranslation(addon.translations, "ar")?.name ||
          getAddonTranslation(addon.translations, "en")?.name ||
          "",
      ),
      nameEn: repairText(
        getAddonTranslation(addon.translations, "en")?.name ||
          getAddonTranslation(addon.translations, "ar")?.name ||
          "",
      ),
      descriptionAr: repairText(
        getAddonTranslation(addon.translations, "ar")?.description ||
          getAddonTranslation(addon.translations, "en")?.description ||
          "",
      ),
      descriptionEn: repairText(
        getAddonTranslation(addon.translations, "en")?.description ||
          getAddonTranslation(addon.translations, "ar")?.description ||
          "",
      ),
    })),
    imageAssetIdsByUrl,
    createdAt: apiHotel.created_at ?? "",
    updatedAt: apiHotel.updated_at ?? "",
  };
}

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

  const response = await fetch(`${HOTEL_API_BASE}${path}`, {
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

    throw new HotelServiceError(message, response.status);
  }

  return payload as T;
}

function buildCreateFormData(
  input: HotelMutationInput,
  media?: HotelCreateMediaInput,
) {
  const baseSlug = slugifyHotel(input.slug || input.nameEn || input.nameAr);
  const enSlug = baseSlug;
  const arSlug = `${baseSlug}-ar`;
  const translations = [
    {
      language: "ar",
      name: input.nameAr.trim(),
      slug: arSlug,
      description: input.descriptionAr.trim(),
      Facilities: input.facilitiesAr,
    },
    {
      language: "en",
      name: input.nameEn.trim(),
      slug: enSlug,
      description: input.descriptionEn.trim(),
      Facilities: input.facilitiesEn,
    },
  ];
  const rooms = input.rooms.map((room) => ({
    capacity: String(Math.max(1, room.capacity)),
    price: Math.max(0, room.price),
    translations: [
      {
        language: "ar",
        name: room.nameAr.trim(),
        description: room.descriptionAr.trim(),
      },
      {
        language: "en",
        name: room.nameEn.trim(),
        description: room.descriptionEn.trim(),
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
  const formData = new FormData();

  formData.set("slug", enSlug);
  formData.set("destination", input.destination);
  formData.set("initial_price", String(Math.max(0, input.initialPrice)));
  formData.set("stars", input.stars);
  formData.set("rating", input.rating);
  formData.set("is_discounted", String(input.isDiscounted));
  formData.set(
    "discount_percentage",
    String(Math.max(0, input.discountPercentage ?? 0)),
  );
  formData.set(
    "original_price",
    String(Math.max(0, input.originalPrice ?? input.initialPrice)),
  );
  formData.set("youtube_video_url", input.youtubeVideoUrl.trim());
  formData.set("translations", JSON.stringify(translations));
  formData.set("rooms", JSON.stringify(rooms));
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

export function createEmptyHotelInput(): HotelMutationInput {
  return {
    destination: "SHARM_EL_SHEIKH",
    slug: "",
    nameAr: "",
    nameEn: "",
    descriptionAr: "",
    descriptionEn: "",
    facilitiesAr: [],
    facilitiesEn: [],
    mainImage: "",
    gallery: [],
    initialPrice: 0,
    originalPrice: null,
    isDiscounted: false,
    discountPercentage: 0,
    stars: "FIVE",
    rating: "UNRATED",
    youtubeVideoUrl: "",
    rooms: [],
    addons: [],
  };
}

export function toHotelMutationInput(hotel: HotelRecord): HotelMutationInput {
  return {
    destination: hotel.destination,
    slug: hotel.slugEn || hotel.slugAr || hotel.slug,
    nameAr: hotel.nameAr,
    nameEn: hotel.nameEn,
    descriptionAr: hotel.descriptionAr,
    descriptionEn: hotel.descriptionEn,
    facilitiesAr: [...hotel.facilitiesAr],
    facilitiesEn: [...hotel.facilitiesEn],
    mainImage: hotel.mainImages[0] || hotel.mainImage,
    gallery: hotel.gallery.filter((url) => url !== hotel.mainImage),
    initialPrice: hotel.initialPrice,
    originalPrice: hotel.originalPrice,
    isDiscounted: hotel.isDiscounted,
    discountPercentage: hotel.discountPercentage,
    stars: hotel.starsValue,
    rating: hotel.ratingValue,
    youtubeVideoUrl: hotel.youtubeVideoUrl,
    rooms: hotel.rooms.map((room) => ({
      capacity: room.capacity,
      price: room.price,
      nameAr: room.nameAr,
      nameEn: room.nameEn,
      descriptionAr: room.descriptionAr,
      descriptionEn: room.descriptionEn,
    })),
    addons: hotel.addons.map((addon) => ({
      price: addon.price,
      nameAr: addon.nameAr,
      nameEn: addon.nameEn,
      descriptionAr: addon.descriptionAr,
      descriptionEn: addon.descriptionEn,
    })),
  };
}

export async function listHotels(options?: {
  page?: number;
  limit?: number;
  signal?: AbortSignal;
}) {
  const search = new URLSearchParams();

  if (options?.page) search.set("page", String(options.page));
  if (options?.limit) search.set("limit", String(options.limit));

  const query = search.toString();
  const payload = await requestJson<ApiHotelListResponse>(
    query ? `?${query}` : "",
    {
      method: "GET",
      signal: options?.signal,
    },
  );

  return {
    hotels: payload.data.filter((hotel) => !hotel.is_deleted).map(createHotelRecord),
    meta: payload.meta,
  };
}

export async function getHotelById(id: string, signal?: AbortSignal) {
  const payload = await requestJson<ApiHotel>(`/${id}`, {
    method: "GET",
    signal,
  });

  return createHotelRecord(payload);
}

export async function getHotelBySlug(slug: string, signal?: AbortSignal) {
  let page = 1;
  const limit = 100;

  while (true) {
    const result = await listHotels({ page, limit, signal });
    const found = result.hotels.find((hotel) =>
      [hotel.slug, hotel.slugAr, hotel.slugEn].includes(slug),
    );

    if (found) return found;
    if (page >= result.meta.totalPages) return null;
    page += 1;
  }
}

export async function createHotel(
  input: HotelMutationInput,
  media?: HotelCreateMediaInput,
) {
  const payload = await requestJson<ApiHotel>("", {
    method: "POST",
    body: buildCreateFormData(input, media),
  });

  return createHotelRecord(payload);
}

export async function updateHotel(
  id: string,
  input: HotelMutationInput,
  media?: HotelCreateMediaInput,
) {
  const payload = await requestJson<ApiHotel>(`/${id}`, {
    method: "PATCH",
    body: buildCreateFormData(input, media),
  });

  return createHotelRecord(payload);
}

export async function deleteHotel(id: string) {
  await requestJson<unknown>(`/${id}`, {
    method: "DELETE",
  });
}
