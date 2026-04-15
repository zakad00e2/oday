import type { HotelRecord } from "./hotel-service";

const HOTEL_CLIENT_CACHE_TTL_MS = 5 * 60 * 1000;

interface HotelsListCacheEntry {
  hotels: HotelRecord[];
  updatedAt: number;
}

interface HotelDetailCacheEntry {
  hotel: HotelRecord;
  updatedAt: number;
}

let hotelsListCache: HotelsListCacheEntry | null = null;
const hotelDetailCache = new Map<string, HotelDetailCacheEntry>();

function getHotelSlugs(hotel: HotelRecord) {
  return Array.from(new Set([hotel.slug, hotel.slugAr, hotel.slugEn].filter(Boolean)));
}

function writeHotelAliases(hotel: HotelRecord, updatedAt: number) {
  const entry: HotelDetailCacheEntry = { hotel, updatedAt };

  for (const slug of getHotelSlugs(hotel)) {
    hotelDetailCache.set(slug, entry);
  }
}

export function isHotelClientCacheFresh(updatedAt: number) {
  return Date.now() - updatedAt < HOTEL_CLIENT_CACHE_TTL_MS;
}

export function readHotelsListCache() {
  return hotelsListCache;
}

export function writeHotelsListCache(hotels: HotelRecord[]) {
  const updatedAt = Date.now();
  hotelsListCache = { hotels, updatedAt };

  for (const hotel of hotels) {
    writeHotelAliases(hotel, updatedAt);
  }

  return hotelsListCache;
}

export function readHotelDetailCache(slug: string) {
  if (!slug) {
    return null;
  }

  const cachedHotel = hotelDetailCache.get(slug);
  if (cachedHotel) {
    return cachedHotel;
  }

  const hotelFromList = hotelsListCache?.hotels.find((hotel) =>
    getHotelSlugs(hotel).includes(slug),
  );

  if (!hotelFromList || !hotelsListCache) {
    return null;
  }

  writeHotelAliases(hotelFromList, hotelsListCache.updatedAt);
  return hotelDetailCache.get(slug) ?? null;
}

export function writeHotelDetailCache(hotel: HotelRecord | null) {
  if (!hotel) {
    return null;
  }

  const updatedAt = Date.now();
  writeHotelAliases(hotel, updatedAt);

  if (hotelsListCache) {
    hotelsListCache = {
      hotels: hotelsListCache.hotels.map((currentHotel) =>
        currentHotel.id === hotel.id ? hotel : currentHotel,
      ),
      updatedAt,
    };
  }

  return hotelDetailCache.get(hotel.slug) ?? null;
}

export function clearHotelClientCache() {
  hotelsListCache = null;
  hotelDetailCache.clear();
}
