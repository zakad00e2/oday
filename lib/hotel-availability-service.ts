import { broadcastUnauthorizedSession, createAuthorizedHeaders } from "./auth-service";
import { createHotelRecord, HOTEL_API_BASE, type ApiHotel, type ApiHotelListResponse } from "./hotel-service";
import { addStayDays, HotelAvailabilityError, missingChildAges, stayNights, stayQuery, type CalendarChange, type RoomCalendar, type StayCalendarPrice, type StayGuests,
  type StayAddon, type StayCriteria, type StayOffer, type StayQuote, type StayRoom } from "./hotel-stay";
import { getVisitorCurrency, type VisitorCategory } from "./visitor-pricing";

export const hotelAvailabilityDemo = process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "demo";
export const hotelAvailabilityEnabled = hotelAvailabilityDemo || process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "live";
export const hotelCalendarEnabled = hotelAvailabilityDemo || process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "admin" ||
  process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY === "live";

type SearchResponse = { data: { hotel: ApiHotel; stay_offer: StayOffer }[]; meta: ApiHotelListResponse["meta"] };

function requireChildAges(guests: StayGuests) {
  if (missingChildAges(guests)) {
    throw new HotelAvailabilityError("Select an age for each child.", 400, "INVALID_INPUT");
  }
}

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
  requireChildAges(stay);
  const query = stayQuery(stay);
  if (!stay.children) query.delete("child_ages");
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
  requireChildAges(stay);
  const { check_in, check_out, adults, children, child_ages } = stay;
  const criteria = { check_in, check_out, adults, children, ...(children > 0 ? { child_ages } : {}) };
  if (hotelAvailabilityDemo)
    return (await import("./hotel-availability-demo")).demoQuote(hotelId, criteria, category, selection?.rooms, selection?.addons);
  return request("/" + encodeURIComponent(hotelId) + "/stay-quote", {
    method: "POST", body: JSON.stringify({ ...criteria, visitor_category: category, ...selection }), signal,
  });
}

const calendarPath = (hotelId: string, roomId: string) => "/" + encodeURIComponent(hotelId) + "/rooms/" + encodeURIComponent(roomId) + "/calendar";

export async function getHotelStayCalendar(hotelId: string, from: string, to: string, guests: StayGuests, category: VisitorCategory, signal?: AbortSignal) {
  requireChildAges(guests);
  const currency = getVisitorCurrency(category);
  if (hotelAvailabilityDemo) {
    const { demoQuote } = await import("./hotel-availability-demo");
    return Array.from({ length: stayNights(from, to) }, (_, i): StayCalendarPrice => {
      const date = addStayDays(from, i);
      try {
        const quote = demoQuote(hotelId, { ...guests, check_in: date, check_out: addStayDays(date, 1) }, category);
        return { date, available: true, total: quote.total };
      } catch (error) {
        if (!(error instanceof HotelAvailabilityError) || error.code !== "STAY_UNAVAILABLE") throw error;
        return { date, available: false, total: null };
      }
    });
  }
  const query = new URLSearchParams({ from, to, adults: String(guests.adults), children: String(guests.children), visitor_category: category });
  if (guests.children > 0 && guests.child_ages) query.set("child_ages", guests.child_ages.join(","));
  const result = await request<{ currency: string; days: StayCalendarPrice[] }>(
    "/" + encodeURIComponent(hotelId) + "/stay-calendar?" + query, { signal },
  );
  if (result.currency !== currency || !Array.isArray(result.days)) {
    throw new HotelAvailabilityError("Invalid stay calendar", 502, "SERVICE_ERROR");
  }
  return result.days;
}

export async function getHotelRoomCalendar(hotelId: string, roomId: string, from: string, to: string, signal?: AbortSignal): Promise<RoomCalendar> {
  if (hotelAvailabilityDemo) {
    const demo = await import("./hotel-availability-demo");
    if (hotelId === demo.demoHotel.id) return demo.getDemoCalendar(roomId, from, to);
  }
  return request(calendarPath(hotelId, roomId) + "?" + new URLSearchParams({ from, to }).toString(), { signal }, true);
}

export async function saveHotelRoomCalendar(hotelId: string, roomId: string, revision: number, changes: CalendarChange[]) {
  if (hotelAvailabilityDemo) {
    const demo = await import("./hotel-availability-demo");
    if (hotelId === demo.demoHotel.id) return demo.saveDemoCalendar(roomId, revision, changes);
  }
  return request<{ revision: number }>(calendarPath(hotelId, roomId), { method: "PATCH", body: JSON.stringify({ revision, changes }) }, true);
}

export async function getAvailabilityDemoHotel(slug: string) {
  if (!hotelAvailabilityDemo) return null;
  const { demoHotel } = await import("./hotel-availability-demo");
  return demoHotel.translations?.some(t => t.slug === slug) ? createHotelRecord(demoHotel) : null;
}
