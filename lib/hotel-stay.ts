import type { PricingCurrency, VisitorCategory } from "./visitor-pricing";

export const STAY_GUEST_LIMIT = 20;
export const STAY_NIGHT_LIMIT = 30;
export const STAY_HORIZON = 365;
const DAY = 86_400_000;
const cairo = new Intl.DateTimeFormat("en-CA", { timeZone: "Africa/Cairo", year: "numeric", month: "2-digit", day: "2-digit" });

export type StayGuests = { adults: number; children: number };
export type StayCriteria = StayGuests & { check_in: string; check_out: string };
export type StayRoom = { room_id: string; quantity: number };
export type StayAddon = { addon_id: string; quantity: number };
export type StayAmount = string | null;
export type StayCalendarPrice = { date: string; available: boolean; total: StayAmount };
export type StayOffer = {
  nights: number; currency: PricingCurrency; pricing_status: "PRICED" | "ON_REQUEST";
  total: StayAmount; rooms: StayRoom[];
};
export type StayQuote = Omit<StayOffer, "rooms"> & StayCriteria & {
  hotel_id: string; visitor_category: VisitorCategory;
  available_room_types: { room_id: string; capacity: number; max_quantity: number; unit_stay_total: StayAmount }[];
  rooms: (StayRoom & { subtotal: StayAmount; nightly_rates: { date: string; unit_rate: StayAmount }[] })[];
  addons: (StayAddon & { unit_rate: StayAmount; subtotal: StayAmount })[];
  room_total: StayAmount; addons_total: StayAmount; quoted_at: string;
};
export type ExactStay = StayCriteria & { rooms: StayRoom[]; addons: StayAddon[] };
export type RatePair = Record<PricingCurrency, StayAmount>;
export type CalendarDay = { date: string; available_units: number; rate_override: RatePair };
export type RoomCalendar = { hotel_id: string; room_id: string; revision: number; base_rates: RatePair; days: CalendarDay[] };
export type CalendarChange = { from: string; to: string; available_units?: number; rate_override?: Partial<RatePair> };

export class HotelAvailabilityError extends Error {
  constructor(message: string, public status: number, public code: string) {
    super(message);
    this.name = "HotelAvailabilityError";
  }
}

export function cairoToday(now = new Date()) {
  const parts = Object.fromEntries(cairo.formatToParts(now).map(part => [part.type, part.value]));
  return [parts.year, parts.month, parts.day].join("-");
}

function dayTime(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return NaN;
  const time = Date.parse(value + "T00:00:00Z");
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : NaN;
}

export function addStayDays(value: string, delta: number) {
  const time = dayTime(value);
  return Number.isFinite(time) ? new Date(time + delta * DAY).toISOString().slice(0, 10) : "";
}

export function stayNights(from: string, to: string) {
  return (dayTime(to) - dayTime(from)) / DAY;
}

export function stayIssue(stay: StayCriteria, today = cairoToday()): "dates" | "duration" | "party" | null {
  const nights = stayNights(stay.check_in, stay.check_out);
  if (!(nights > 0) || stay.check_in < today) return "dates";
  if (nights > STAY_NIGHT_LIMIT || stay.check_out > addStayDays(today, STAY_HORIZON)) return "duration";
  if (!Number.isInteger(stay.adults) || !Number.isInteger(stay.children) || stay.adults < 1 ||
      stay.children < 0 || stay.adults + stay.children > STAY_GUEST_LIMIT) return "party";
  return null;
}

export function stayQuery(stay: StayCriteria) {
  const { check_in, check_out, adults, children } = stay;
  return new URLSearchParams({ check_in, check_out, adults: String(adults), children: String(children) });
}

export function readStayQuery(query: Pick<URLSearchParams, "get">): StayCriteria {
  const count = (value: string | null, fallback: number) => value === null ? fallback : /^\d+$/.test(value) ? Number(value) : -1;
  return { check_in: query.get("check_in") ?? "", check_out: query.get("check_out") ?? "",
    adults: count(query.get("adults"), 2), children: count(query.get("children"), 0) };
}

export function stayMoney(amount: StayAmount) {
  return typeof amount === "string" && /^\d+(?:\.\d{1,2})?$/.test(amount) ? Number(amount) : NaN;
}

export function sameStayQuote(a: StayQuote | undefined, b: StayQuote) {
  if (!a) return false;
  const normalizedAmount = (amount: StayAmount) => amount === null ? null : stayMoney(amount);
  const signature = (q: StayQuote) => JSON.stringify([
    q.hotel_id, q.check_in, q.check_out, q.adults, q.children, q.nights, q.visitor_category, q.currency, q.pricing_status,
    normalizedAmount(q.total),
    [...q.rooms].sort((x,y) => x.room_id.localeCompare(y.room_id)).map(r =>
      [r.room_id, r.quantity, [...r.nightly_rates].sort((x,y) => x.date.localeCompare(y.date))
        .map(n => [n.date, normalizedAmount(n.unit_rate)])]),
    [...q.addons].sort((x,y) => x.addon_id.localeCompare(y.addon_id)).map(x => [x.addon_id, x.quantity, normalizedAmount(x.unit_rate)]),
  ]);
  return signature(a) === signature(b);
}

export function exactStayRequest(line: {
  checkIn?: string; checkOut?: string; stayGuests?: StayGuests; stayQuote?: StayQuote;
  selectedRooms?: { id: string; count: number }[];
  selectedAddOns?: { id?: string; count?: number }[];
}, today = cairoToday()): ExactStay | null {
  if (!line.stayGuests || !line.checkIn || !line.checkOut || !line.selectedRooms?.length) return null;
  const stay = { check_in: line.checkIn, check_out: line.checkOut, ...line.stayGuests };
  if (stayIssue(stay, today)) return null;
  const valid = (id: string | undefined, count: number | undefined) => Boolean(id && id !== "legacy-room" && (line.stayQuote || !/^(room-\d+|addon-\d+)$/.test(id)) &&
    count !== undefined && Number.isInteger(count) && count > 0 && count <= STAY_GUEST_LIMIT);
  if (line.selectedRooms.some(room => !valid(room.id, room.count)) ||
      line.selectedAddOns?.some(addon => !valid(addon.id, addon.count))) return null;
  return {
    ...stay,
    rooms: line.selectedRooms.map(r => ({ room_id: r.id, quantity: r.count })),
    addons: (line.selectedAddOns ?? []).map(a => ({ addon_id: a.id!, quantity: a.count! })),
  };
}
