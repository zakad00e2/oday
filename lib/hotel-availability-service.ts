import { broadcastUnauthorizedSession, createAuthorizedHeaders } from "./auth-service";
import { createHotelRecord, HOTEL_API_BASE, type ApiHotel, type ApiHotelListResponse } from "./hotel-service";
import { HotelAvailabilityError, stayQuery, type CalendarChange, type RoomCalendar,
  type StayAddon, type StayCriteria, type StayOffer, type StayQuote, type StayRoom } from "./hotel-stay";
import type { VisitorCategory } from "./visitor-pricing";

export const hotelAvailabilityDemo = process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "demo";
export const hotelAvailabilityEnabled = hotelAvailabilityDemo || process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "live";
export const hotelCalendarEnabled = process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "admin" ||
  process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "live";

type SearchResponse = { data: { hotel: ApiHotel; stay_offer: StayOffer }[]; meta: ApiHotelListResponse["meta"] };

async function request<T>(path: string, init: RequestInit = {}, admin = false): Promise<T> {
  const headers = admin ? createAuthorizedHeaders(init.headers) : new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const response = await fetch(HOTEL_API_BASE + path, { ...init, headers, cache: "no-store" });
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload === null) {
    if (admin && (response.status === 401 || response.status === 403) && headers.has("Authorization"))
      broadcastUnauthorizedSession();
    throw new HotelAvailabilityError(typeof payload?.message === "string" ? payload.message : "Hotel availability is temporarily unavailable.",
      response.ok ? 502 : response.status, typeof payload?.code === "string" ? payload.code : "SERVICE_ERROR");
  }
  return payload as T;
}

export async function searchHotelStays(destination: string, stay: StayCriteria, category: VisitorCategory, page: number, signal?: AbortSignal) {
  const query = stayQuery(stay);
  query.set("destination", destination);
  query.set("visitor_category", category);
  query.set("page", String(page));
  query.set("limit", "20");
  const result = hotelAvailabilityDemo
    ? (await import("./hotel-availability-demo")).demoSearch(destination, stay, category, page)
    : await request<SearchResponse>("/search?" + query.toString(), { signal });
  return { items: result.data.map(({ hotel, stay_offer }) => ({ hotel: createHotelRecord(hotel), offer: stay_offer })), meta: result.meta };
}

export async function quoteHotelStay(
  hotelId: string, stay: StayCriteria, category: VisitorCategory,
  selection?: { rooms: StayRoom[]; addons: StayAddon[] }, signal?: AbortSignal,
): Promise<StayQuote> {
  const { check_in, check_out, adults, children } = stay;
  const criteria = { check_in, check_out, adults, children };
  if (hotelAvailabilityDemo)
    return (await import("./hotel-availability-demo")).demoQuote(hotelId, criteria, category, selection?.rooms, selection?.addons);
  return request("/" + encodeURIComponent(hotelId) + "/stay-quote", {
    method: "POST", body: JSON.stringify({ ...criteria, visitor_category: category, ...selection }), signal,
  });
}

const calendarPath = (hotelId: string, roomId: string) => "/" + encodeURIComponent(hotelId) + "/rooms/" + encodeURIComponent(roomId) + "/calendar";

export async function getHotelRoomCalendar(hotelId: string, roomId: string, from: string, to: string, signal?: AbortSignal): Promise<RoomCalendar> {
  if (hotelAvailabilityDemo) return (await import("./hotel-availability-demo")).getDemoCalendar(roomId, from, to);
  return request(calendarPath(hotelId, roomId) + "?" + new URLSearchParams({ from, to }).toString(), { signal }, true);
}

export async function saveHotelRoomCalendar(hotelId: string, roomId: string, revision: number, changes: CalendarChange[]) {
  if (hotelAvailabilityDemo) return (await import("./hotel-availability-demo")).saveDemoCalendar(roomId, revision, changes);
  return request<{ revision: number }>(calendarPath(hotelId, roomId), { method: "PATCH", body: JSON.stringify({ revision, changes }) }, true);
}

export async function getAvailabilityDemoHotel(slug: string) {
  if (!hotelAvailabilityDemo) return null;
  const { demoHotel } = await import("./hotel-availability-demo");
  return demoHotel.translations?.some(t => t.slug === slug) ? createHotelRecord(demoHotel) : null;
}
