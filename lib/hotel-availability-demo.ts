import type { ApiHotel } from "./hotel-service";
import { addStayDays, cairoToday, HotelAvailabilityError, stayIssue, stayNights, STAY_HORIZON,
  type CalendarChange, type CalendarDay, type RatePair, type RoomCalendar, type StayCriteria,
  type StayRoom, type StayAddon, type StayQuote, type StayOffer, type StayAmount } from "./hotel-stay";
import { getVisitorCurrency, type VisitorCategory } from "./visitor-pricing";

export const demoHotel: ApiHotel = {
  id: "demo-coast", destination: "SHARM_EL_SHEIKH", initial_price: "100", initial_price_egp: "5000",
  stars: "FIVE", rating: "4.8", is_discounted: false, discount_percentage: "0", original_price: "0",
  translations: [
    { language: "ar", name: "منتجع الساحل التجريبي", slug: "demo-coast", description: "فندق تجريبي لاختبار التوافر والأسعار حسب الليلة." },
    { language: "en", name: "Coast Resort Demo", slug: "demo-coast", description: "A sample resort for previewing availability and nightly prices." },
  ],
  assets: [{ kind: "HOTEL_MAIN_IMAGE", url: "/images/hotels-hero-sea-room.png" }],
  rooms: [
    { id: "demo-double", capacity: "2", price: "100", price_egp: "5000", translations: [
      { language: "ar", name: "غرفة مزدوجة", description: "غرفة تجريبية تتسع لشخصين." }, { language: "en", name: "Double room", description: "A sample room for two guests." },
    ] },
    { id: "demo-family", capacity: "3", price: "150", price_egp: "7200", translations: [
      { language: "ar", name: "غرفة عائلية", description: "غرفة تجريبية تتسع لثلاثة أشخاص." }, { language: "en", name: "Family room", description: "A sample room for three guests." },
    ] },
  ],
  addons: [{ id: "demo-upgrade", price: "20", price_egp: "900", translations: [
    { language: "ar", name: "ترقية إطلالة البحر", description: "ترقية تجريبية لإطلالة على البحر." }, { language: "en", name: "Sea view upgrade", description: "A sample upgrade to a sea view." },
  ] }],
};

type SavedCalendar = { revision: number; days: Record<string, CalendarDay> };
type DemoStore = Pick<Map<string, SavedCalendar>, "get" | "set">;
const storageKey = "oday-hotel-availability-demo-v1:";
const browserStore: DemoStore = {
  get(key) {
    if (typeof window === "undefined") return undefined;
    try { return JSON.parse(window.localStorage.getItem(storageKey + key) ?? "null") ?? undefined; } catch { return undefined; }
  },
  set(key, value) {
    window.localStorage.setItem(storageKey + key, JSON.stringify(value));
    return this as Map<string, SavedCalendar>;
  },
};
const amounts = (usd: string, egp: string | number | null | undefined): RatePair =>
  ({ USD: Number(usd).toFixed(2), EGP: egp == null ? null : Number(egp).toFixed(2) });
const invalid = () => new HotelAvailabilityError("Invalid input", 400, "INVALID_INPUT");
const unavailable = () => new HotelAvailabilityError("The stay is unavailable", 409, "STAY_UNAVAILABLE");
const toCents = (amount: string) => Math.round(Number(amount) * 100);
const money = (cents: number) => (cents / 100).toFixed(2);
const total = (values: StayAmount[]) => values.some(value => value === null)
  ? null : money(values.reduce((sum, value) => sum + toCents(value!), 0));

function room(roomId: string) {
  const found = demoHotel.rooms!.find(r => r.id === roomId);
  if (!found) throw new HotelAvailabilityError("Unknown room", 404, "NOT_FOUND");
  return found;
}

function defaultDay(date: string, roomId: string, today: string): CalendarDay {
  const offset = stayNights(today, date);
  return {
    date,
    available_units: offset >= 0 && offset < STAY_HORIZON ? 1 : 0,
    rate_override: roomId === "demo-double" && offset % 7 === 4 ? { USD: "140.00", EGP: "7000.00" } : { USD: null, EGP: null },
  };
}

export function getDemoCalendar(roomId: string, from: string, to: string, storage = browserStore, today = cairoToday()): RoomCalendar {
  const type = room(roomId);
  const length = stayNights(from, to);
  if (!(length > 0 && length <= STAY_HORIZON)) throw invalid();
  const saved = storage.get(roomId);
  return {
    hotel_id: demoHotel.id, room_id: roomId, revision: saved?.revision ?? 0,
    base_rates: amounts(type.price, type.price_egp),
    days: Array.from({ length }, (_, index) => {
      const date = addStayDays(from, index);
      return saved?.days[date] ?? defaultDay(date, roomId, today);
    }),
  };
}

export function saveDemoCalendar(roomId: string, revision: number, changes: CalendarChange[], storage = browserStore, today = cairoToday()) {
  room(roomId);
  const saved = storage.get(roomId);
  if (revision !== (saved?.revision ?? 0)) throw new HotelAvailabilityError("Calendar was updated", 409, "CALENDAR_CONFLICT");
  const days = { ...saved?.days };
  const touched = new Set<string>();
  for (const change of changes) {
    const length = stayNights(change.from, change.to);
    if (!(length > 0 && length <= STAY_HORIZON) || change.from < today || change.to > addStayDays(today, STAY_HORIZON)) throw invalid();
    if (change.available_units !== undefined && (!Number.isInteger(change.available_units) || change.available_units < 0)) throw invalid();
    const rates = Object.values(change.rate_override ?? {});
    if (change.available_units === undefined && !rates.length) throw invalid();
    if (rates.some(amount => amount !== null && (!/^\d+(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0))) throw invalid();
    for (let index = 0; index < length; index++) {
      const date = addStayDays(change.from, index);
      if (touched.has(date)) throw invalid();
      touched.add(date);
      const previous = days[date] ?? defaultDay(date, roomId, today);
      days[date] = { ...previous, available_units: change.available_units ?? previous.available_units,
        rate_override: { ...previous.rate_override, ...change.rate_override } };
    }
  }
  if (!touched.size) throw invalid();
  storage.set(roomId, { revision: revision + 1, days });
  return { revision: revision + 1 };
}

export function demoQuote(hotelId: string, stay: StayCriteria, category: VisitorCategory, requested?: StayRoom[], upgrades: StayAddon[] = [], storage = browserStore, today = cairoToday()): StayQuote {
  if (hotelId !== demoHotel.id) throw new HotelAvailabilityError("Unknown hotel", 404, "NOT_FOUND");
  if (stayIssue(stay, today)) throw invalid();
  const currency = getVisitorCurrency(category)!;
  const guests = stay.adults + stay.children;
  const nights = stayNights(stay.check_in, stay.check_out);
  const choices = demoHotel.rooms!.flatMap(r => {
    const room_id = r.id!;
    const c = getDemoCalendar(room_id, stay.check_in, stay.check_out, storage, today);
    const max_quantity = c.days.every(day => day.available_units > 0) ? guests : 0;
    const nightly_rates = c.days.map(d => ({ date: d.date, unit_rate: d.rate_override[currency] ?? c.base_rates[currency] }));
    return max_quantity ? [{ room_id, capacity: Number(r.capacity), max_quantity, nightly_rates,
      unit_stay_total: total(nightly_rates.map(d => d.unit_rate)) }] : [];
  }).sort((a,b) => a.room_id.localeCompare(b.room_id));
  const matching = (id: string) => choices.find(c => c.room_id === id);
  let recommendation: { rooms: StayRoom[]; cost: number; count: number } | undefined;
  function recommend(index: number, capacity: number, count: number, cost: number, rooms: StayRoom[]) {
    if (capacity >= guests) {
      if (!recommendation || cost < recommendation.cost || (cost === recommendation.cost && count < recommendation.count))
        recommendation = { rooms, cost, count };
      return;
    }
    if (index === choices.length) return;
    const choice = choices[index];
    for (let quantity = Math.min(choice.max_quantity, guests - count); quantity >= 0; quantity--) {
      const next = quantity ? [...rooms, { room_id: choice.room_id, quantity }] : rooms;
      const price = choice.unit_stay_total === null ? Infinity : toCents(choice.unit_stay_total);
      recommend(index + 1, capacity + choice.capacity * quantity, count + quantity, quantity ? cost + quantity * price : cost, next);
    }
  }
  if (!requested) recommend(0, 0, 0, 0, []);
  const selected = requested ?? recommendation?.rooms;
  const roomCount = selected?.reduce((n, r) => n + r.quantity, 0) ?? 0;
  if (!selected?.length || roomCount > guests || new Set(selected.map(r => r.room_id)).size !== selected.length ||
      selected.some(r => !Number.isInteger(r.quantity) || r.quantity < 1 || r.quantity > (matching(r.room_id)?.max_quantity ?? 0)) ||
      selected.reduce((n, r) => n + matching(r.room_id)!.capacity * r.quantity, 0) < guests) throw unavailable();
  if (new Set(upgrades.map(a => a.addon_id)).size !== upgrades.length ||
      upgrades.some(a => !Number.isInteger(a.quantity) || a.quantity < 1) ||
      upgrades.reduce((n, a) => n + a.quantity, 0) > roomCount) throw invalid();
  const rooms = selected.map(r => {
    const choice = matching(r.room_id)!;
    return { ...r, nightly_rates: choice.nightly_rates, subtotal: choice.unit_stay_total === null ? null : money(toCents(choice.unit_stay_total) * r.quantity) };
  });
  const addons = upgrades.map(a => {
    const addon = demoHotel.addons!.find(record => record.id === a.addon_id);
    if (!addon) throw unavailable();
    const unit_rate = amounts(addon.price, addon.price_egp)[currency];
    return { ...a, unit_rate, subtotal: unit_rate === null ? null : money(toCents(unit_rate) * a.quantity * nights) };
  });
  const room_total = total(rooms.map(r => r.subtotal));
  const addons_total = total(addons.map(a => a.subtotal));
  const sum = total([room_total, addons_total]);
  return { ...stay, hotel_id: hotelId, visitor_category: category, currency, nights, rooms, addons,
    available_room_types: choices.map(({ room_id, capacity, max_quantity, unit_stay_total }) =>
      ({ room_id, capacity, max_quantity, unit_stay_total })),
    room_total, addons_total, total: sum, pricing_status: sum === null ? "ON_REQUEST" : "PRICED", quoted_at: new Date().toISOString() };
}

export function demoSearch(destination: string, stay: StayCriteria, category: VisitorCategory, page: number, storage = browserStore, today = cairoToday()) {
  if (stayIssue(stay, today)) throw invalid();
  const data: { hotel: ApiHotel; stay_offer: StayOffer }[] = [];
  if (destination === demoHotel.destination) {
    try {
      const quote = demoQuote(demoHotel.id, stay, category, undefined, [], storage, today);
      if (page === 1) data.push({ hotel: demoHotel, stay_offer: { nights: quote.nights, currency: quote.currency,
        total: quote.total, pricing_status: quote.pricing_status, rooms: quote.rooms.map(({ room_id, quantity }) => ({ room_id, quantity })) } });
      return { data, meta: { total: 1, page, limit: 20, totalPages: 1 } };
    } catch (error) {
      if (!(error instanceof HotelAvailabilityError) || error.code !== "STAY_UNAVAILABLE") throw error;
    }
  }
  return { data, meta: { total: 0, page, limit: 20, totalPages: 0 } };
}
