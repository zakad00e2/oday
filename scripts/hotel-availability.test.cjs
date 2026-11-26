/* eslint-disable @typescript-eslint/no-require-imports -- Transpile TS with the repo's existing test toolchain. */
const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const ts = require("typescript");

require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  });
  module._compile(outputText, filename);
};

const { addStayDays, cairoToday, missingChildAges, readStayQuery, stayIssue, stayQuery, stayNights, formatStayNights, sameStayQuote, exactStayRequest } = require("../lib/hotel-stay.ts");
const { getDemoCalendar, saveDemoCalendar, demoSearch, demoQuote, demoHotel } = require("../lib/hotel-availability-demo.ts");
const stay = { check_in: "2026-11-20", check_out: "2026-11-22", adults: 4, children: 1 };
const category = "egyptian-resident";
const today = "2026-11-20";

test("room capacity distinguishes each room's adults, children, and configured ages", () => {
  const { createHotelRecord } = require("../lib/hotel-service.ts");
  const { formatHotelRoomCapacity } = require("../lib/hotel-room-capacity.ts");
  const { rooms } = createHotelRecord({ ...demoHotel, rooms: [
    { ...demoHotel.rooms[0], capacity: 4, adult_capacity: 3, child_capacity: 1,
      children_under_3_capacity: 1, children_under_6_capacity: 0, children_6_to_12_capacity: 0 },
    { ...demoHotel.rooms[1], capacity: 3, adult_capacity: 2, child_capacity: 1,
      children_under_3_capacity: 0, children_under_6_capacity: 1, children_6_to_12_capacity: 0 },
    { ...demoHotel.rooms[1], capacity: 1, adult_capacity: 1, child_capacity: 0 },
  ] });

  assert.deepEqual(rooms.map(room => formatHotelRoomCapacity(room, true)), [
    "السعة: 3 بالغين · طفل واحد أقل من 3 سنوات",
    "السعة: بالغان · طفل واحد من 3 إلى 5 سنوات",
    "السعة: بالغ واحد",
  ]);
  assert.equal(formatHotelRoomCapacity(rooms[0], false), "Capacity: 3 adults · 1 child under 3 years");
  assert.equal(formatHotelRoomCapacity(rooms[1], false), "Capacity: 2 adults · 1 child aged 3 to 5");
});

test("room capacity retains the overall limit and never guesses missing occupancy details", () => {
  const { formatHotelRoomCapacity } = require("../lib/hotel-room-capacity.ts");
  assert.equal(formatHotelRoomCapacity({ capacity: 4 }, true), "السعة: 4 ضيوف");
  assert.equal(formatHotelRoomCapacity({ capacity: 4, adultCapacity: 3 }, false), "Capacity: 4 guests · 3 adults");
  assert.equal(formatHotelRoomCapacity({ capacity: 4, adultCapacity: 3, childCapacity: 2,
    childrenUnder3Capacity: 1, childrenUnder6Capacity: 2, children6To12Capacity: 1 }, false),
    "Capacity: 4 guests · 3 adults · 2 children (under 3 years: 1, aged 3 to 5: 2, aged 6 to 12: 1)");
});

test("stay duration excludes checkout across months and uses natural labels", () => {
  assert.equal(stayNights("2026-11-16", "2026-11-20"), 4);
  assert.equal(stayNights("2026-11-16", "2026-11-22"), 6);
  assert.equal(stayNights("2026-12-30", "2027-01-02"), 3);
  assert.deepEqual([1, 2, 3, 4, 11].map(n => formatStayNights(n, true)), ["ليلة واحدة", "ليلتان", "3 ليالٍ", "4 ليالٍ", "11 ليلة"]);
  assert.equal(formatStayNights(2, false), "2 nights");
});

test("Cairo midnight and a leap day do not shift calendar dates", () => {
  assert.equal(cairoToday(new Date("2026-11-19T22:01:00Z")), today);
  assert.equal(addStayDays("2028-02-28", 1), "2028-02-29");
  assert.equal(stayIssue({ ...stay, check_in: "2026-11-31" }, today), "dates");
  assert.equal(stayIssue({ ...stay, check_out: "2026-12-21" }, today), "duration");
  assert.equal(stayIssue({ ...stay, children: 17 }, today), "party");
});

test("a shared result URL preserves the exact stay and rejects malformed quantities", () => {
  const query = stayQuery(stay);
  assert.equal(query.toString(), "check_in=2026-11-20&check_out=2026-11-22&adults=4&children=1");
  assert.deepEqual(readStayQuery(query), stay);
  query.set("adults", "2e0");
  assert.equal(readStayQuery(query).adults, -1);
});

test("child ages survive a stay link including an unselected age", () => {
  const family = { ...stay, children: 2, child_ages: [5, null] };
  assert.deepEqual(readStayQuery(stayQuery(family)), family);
  assert.deepEqual(readStayQuery(new URLSearchParams("children=2&child_ages=12,13")).child_ages, [12, null]);
});

test("each child needs an age from zero through twelve", () => {
  assert.equal(missingChildAges({ adults: 2, children: 2, child_ages: [0, 12] }), false);
  assert.equal(missingChildAges({ adults: 2, children: 2, child_ages: [0, null] }), true);
  assert.equal(missingChildAges({ adults: 2, children: 1, child_ages: [13] }), true);
  assert.equal(missingChildAges({ adults: 2, children: 1 }), true);
});

test("demo search excludes a stay when just one occupied night closes and prices independent tariffs", () => {
  const storage = new Map();
  const calendar = getDemoCalendar("demo-double", today, "2026-11-23", storage, today);
  saveDemoCalendar("demo-double", calendar.revision, [
    { from: "2026-11-21", to: "2026-11-22", rate_override: { EGP: "7000.00" } },
    { from: "2026-11-22", to: "2026-11-23", available_units: 0 },
  ], storage, today);
  saveDemoCalendar("demo-family", 0, [{ from: "2026-11-22", to: "2026-11-23", available_units: 0 }], storage, today);
  const results = demoSearch("SHARM_EL_SHEIKH", stay, category, 1, storage, today);
  assert.equal(results.data[0].stay_offer.total, "26400.00");
  assert.equal(demoSearch("SHARM_EL_SHEIKH", stay, "other", 1, storage, today).data[0].stay_offer.total, "500.00");
  assert.equal(demoSearch("SHARM_EL_SHEIKH", { ...stay, check_out: "2026-11-23" }, category, 1, storage, today).meta.total, 0);
  const quoted = demoQuote(demoHotel.id, stay, category, results.data[0].stay_offer.rooms, [{ addon_id: "demo-upgrade", quantity: 1 }], storage, today);
  assert.equal(quoted.total, "28200.00");
  assert.equal(quoted.available_room_types.find(r => r.room_id === "demo-double").max_quantity, 5);
});

test("demo nights are open by default and reopening retains the nightly price override", () => {
  const storage = new Map();
  const night = { from: "2027-02-15", to: "2027-02-16" };
  const readNight = () => getDemoCalendar("demo-double", night.from, night.to, storage, today).days[0];
  assert.equal(readNight().available_units, 1);
  saveDemoCalendar("demo-double", 0, [{ ...night, available_units: 0 }], storage, today);
  saveDemoCalendar("demo-double", 1, [{ ...night, rate_override: { EGP: "7300.00" } }], storage, today);
  assert.equal(readNight().available_units, 0);
  saveDemoCalendar("demo-double", 2, [{ ...night, available_units: 1 }], storage, today);
  assert.equal(readNight().available_units, 1);
  assert.equal(readNight().rate_override.EGP, "7300.00");
});

test("six guests can use two open rooms with capacity three", () => {
  const storage = new Map();
  const party = { check_in: "2026-11-20", check_out: "2026-11-21", adults: 6, children: 0 };
  const results = demoSearch("SHARM_EL_SHEIKH", party, category, 1, storage, today);
  assert.equal(results.meta.total, 1);
  assert.deepEqual(results.data[0].stay_offer.rooms, [{ room_id: "demo-family", quantity: 2 }]);
  const quote = demoQuote(demoHotel.id, party, category, undefined, [], storage, today);
  assert.equal(quote.available_room_types.find(r => r.room_id === "demo-family").max_quantity, 6);
  assert.equal(quote.total, "14400.00");
});

test("calendar partial override updates and clears one currency and stale saves are atomic", () => {
  const storage = new Map();
  saveDemoCalendar("demo-double", 0, [{ from: today, to: "2026-11-22", available_units: 2, rate_override: { USD: "140.00", EGP: "7500.00" } }], storage, today);
  saveDemoCalendar("demo-double", 1, [{ from: today, to: "2026-11-21", rate_override: { EGP: null } }], storage, today);
  assert.throws(() => saveDemoCalendar("demo-double", 1, [{ from: today, to: "2026-11-22", available_units: 0 }], storage, today), { code: "CALENDAR_CONFLICT" });
  const calendar = getDemoCalendar("demo-double", today, "2026-11-22", storage, today);
  assert.equal(calendar.revision, 2);
  assert.deepEqual(calendar.days.map(d => [d.available_units, d.rate_override.USD, d.rate_override.EGP]), [[2, "140.00", null], [2, "140.00", "7500.00"]]);
});

test("revalidation detects a changed nightly price even when the total is unchanged", () => {
  const quote = demoQuote(demoHotel.id, stay, category, undefined, undefined, new Map(), today);
  assert.ok(sameStayQuote(quote, { ...quote, quoted_at: "2026-11-21T00:00:00Z", rooms: [...quote.rooms].reverse() }));
  const changed = structuredClone(quote);
  changed.rooms[0].nightly_rates[0].unit_rate = "4500.00";
  changed.rooms[0].nightly_rates[1].unit_rate = "5500.00";
  assert.equal(sameStayQuote(quote, changed), false);
  assert.equal(sameStayQuote(quote, { ...quote, total: null, pricing_status: "ON_REQUEST" }), false);
});

test("cart revalidation never substitutes a synthetic legacy room ID or a missing party", () => {
  const line = { checkIn: stay.check_in, checkOut: stay.check_out, stayGuests: { adults: 4, children: 1, child_ages: [12] }, selectedRooms: [{ id: "demo-family", count: 2 }] };
  assert.deepEqual(exactStayRequest(line, today), { ...stay, child_ages: [12], rooms: [{ room_id: "demo-family", quantity: 2 }], addons: [] });
  assert.equal(exactStayRequest({ ...line, selectedRooms: [{ id: "legacy-room", count: 1 }] }, today), null);
  assert.equal(exactStayRequest({ ...line, stayGuests: undefined }, today), null);
  const legacy = { ...line, slug: "demo-coast", requiresStayQuote: true, stayGuests: { adults: 4, children: 1 } };
  assert.equal(exactStayRequest(legacy, today), null);
  const { cartHotelEditHref } = require("../lib/cart-hotel-stay.ts");
  const editUrl = new URL(cartHotelEditHref(legacy, "ar"), "https://example.com");
  assert.equal(editUrl.hash, "#booking");
  assert.deepEqual(readStayQuery(editUrl.searchParams), stay);
});

test("a checkout quote with different child ages requires review even when the price is unchanged", () => {
  const family = { ...stay, children: 2, child_ages: [0, 12] };
  const quote = demoQuote(demoHotel.id, family, category, undefined, undefined, new Map(), today);
  assert.equal(sameStayQuote(quote, { ...quote, child_ages: [12, 0] }), true);
  assert.equal(sameStayQuote(quote, { ...quote, child_ages: [0, 11] }), false);
  assert.equal(sameStayQuote(quote, { ...quote, child_ages: undefined }), false);
});

test("a calendar-aware content update sends existing room IDs and explicit deletions", async t => {
  const { updateHotel, createEmptyHotelInput } = require("../lib/hotel-service.ts");
  const room = { id: "saved-type", capacity: 4, price: 100, priceEgp: 5000, nameAr: "غرفة", nameEn: "Room", descriptionAr: "", descriptionEn: "" };
  const input = { ...createEmptyHotelInput(), rooms: [room, { ...room, id: undefined }] };
  let body;
  t.mock.method(globalThis, "fetch", async (_, init) => { body = init.body; return Response.json(demoHotel); });
  await updateHotel(demoHotel.id, input, undefined, { deleteRoomIds: ["removed-type"] });
  assert.equal(body.get("rooms_write_mode"), "by_id");
  assert.deepEqual(JSON.parse(body.get("delete_room_ids")), ["removed-type"]);
  assert.deepEqual(JSON.parse(body.get("rooms")).map(room => room.id), ["saved-type", undefined]);
  await updateHotel(demoHotel.id, input);
  assert.equal(body.has("rooms_write_mode"), false);
  assert.equal(JSON.parse(body.get("rooms"))[0].id, undefined);
});

test("a dated cart uses the quote once and never uses an old rate or another currency", () => {
  const { calculateHotelLineCost } = require("../lib/cart-pricing.ts");
  const quote = demoQuote(demoHotel.id, stay, category, undefined, undefined, new Map(), today);
  const hotel = { pricePerNight: 500, stayQuote: quote, stayQuoteCurrent: true };
  assert.equal(calculateHotelLineCost(hotel, 99), 24400);
  assert.ok(Number.isNaN(calculateHotelLineCost({ ...hotel, stayQuoteCurrent: false }, 2)));
  assert.ok(Number.isNaN(calculateHotelLineCost({ pricePerNight: 500, requiresStayQuote: true }, 2)));
});

test("public search and quote send exact criteria without admin credentials; calendar reads and saves authenticate", async t => {
  const service = require("../lib/hotel-availability-service.ts");
  const family = { ...stay, child_ages: [7] };
  const prevWindow = globalThis.window;
  const prevStorage = globalThis.localStorage;
  globalThis.window = { dispatchEvent() {} };
  globalThis.localStorage = { getItem: () => "test-calendar-token" };
  t.after(() => { globalThis.window = prevWindow; globalThis.localStorage = prevStorage; });
  const seen = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const path = new URL(url);
    seen.push({ path, init });
    if (path.pathname.endsWith("/search")) return Response.json(demoSearch("SHARM_EL_SHEIKH", family, category, 1, new Map(), today));
    if (path.pathname.endsWith("/stay-quote")) return Response.json(demoQuote(demoHotel.id, family, category, undefined, undefined, new Map(), today));
    if (path.pathname.endsWith("/stay-calendar")) return Response.json({ currency: "EGP", days: [] });
    if (init.method === "PATCH") return Response.json({ code: "CALENDAR_CONFLICT", message: "Conflict" }, { status: 409 });
    return Response.json(getDemoCalendar("demo-double", today, stay.check_out, new Map(), today));
  });
  await assert.rejects(service.searchHotelStays("SHARM_EL_SHEIKH", stay, category, 1), { code: "INVALID_INPUT" });
  await assert.rejects(service.quoteHotelStay(demoHotel.id, stay, category), { code: "INVALID_INPUT" });
  await assert.rejects(service.getHotelStayCalendar(demoHotel.id, today, stay.check_out, stay, category), { code: "INVALID_INPUT" });
  assert.equal(seen.length, 0);
  const results = await service.searchHotelStays("SHARM_EL_SHEIKH", family, category, 1);
  const quote = await service.quoteHotelStay(demoHotel.id, family, category, { rooms: results.items[0].offer.rooms, addons: [] });
  await service.getHotelRoomCalendar(demoHotel.id, "demo-double", today, stay.check_out);
  await assert.rejects(service.saveHotelRoomCalendar(demoHotel.id, "demo-double", 0, [{ from: today, to: stay.check_out, available_units: 0 }]), { code: "CALENDAR_CONFLICT", status: 409 });
  await service.getHotelStayCalendar(demoHotel.id, today, stay.check_out, family, category);
  assert.equal(seen[0].path.searchParams.get("destination"), "SHARM_EL_SHEIKH");
  assert.equal(seen[0].path.searchParams.get("visitor_category"), category);
  assert.equal(seen[0].path.searchParams.get("check_out"), stay.check_out);
  assert.equal(seen[0].path.searchParams.get("child_ages"), "7");
  assert.deepEqual(JSON.parse(seen[1].init.body), { ...family, visitor_category: category, rooms: results.items[0].offer.rooms, addons: [] });
  assert.deepEqual(quote.child_ages, [7]);
  assert.equal(seen[2].path.searchParams.get("to"), stay.check_out);
  assert.equal(seen[4].path.searchParams.get("child_ages"), "7");
  assert.deepEqual(seen.map(({ init }) => new Headers(init.headers).get("Authorization")),
    [null, null, "Bearer test-calendar-token", "Bearer test-calendar-token", null]);
});

test("demo mode keeps the demo calendar local and routes real hotels to the server", async t => {
  const servicePath = require.resolve("../lib/hotel-availability-service.ts");
  const previous = { nodeEnv: process.env.NODE_ENV, mode: process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY, window: globalThis.window, storage: globalThis.localStorage };
  process.env.NODE_ENV = "development";
  process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY = "demo";
  delete require.cache[servicePath];
  const service = require(servicePath);
  const saved = new Map();
  globalThis.window = { localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) } };
  globalThis.localStorage = { getItem: () => "test-calendar-token" };
  t.after(() => {
    if (previous.nodeEnv === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = previous.nodeEnv;
    if (previous.mode === undefined) delete process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY; else process.env.NEXT_PUBLIC_HOTEL_AVAILABILITY = previous.mode;
    globalThis.window = previous.window; globalThis.localStorage = previous.storage; delete require.cache[servicePath];
  });
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    calls.push({ url, init });
    return Response.json(init.method === "PATCH" ? { revision: 1 } : { hotel_id: "real-hotel", room_id: "real-room", revision: 0, base_rates: { USD: "10", EGP: "500" }, days: [] });
  });
  assert.equal(service.hotelCalendarEnabled, true);
  const current = cairoToday();
  const end = addStayDays(current, 1);
  const local = await service.getHotelRoomCalendar(demoHotel.id, "demo-double", current, end);
  await service.saveHotelRoomCalendar(demoHotel.id, "demo-double", local.revision, [{ from: current, to: end, available_units: 0 }]);
  assert.equal((await service.getHotelRoomCalendar(demoHotel.id, "demo-double", current, end)).days[0].available_units, 0);
  const family = await service.getHotelRoomCalendar(demoHotel.id, "demo-family", current, end);
  await service.saveHotelRoomCalendar(demoHotel.id, "demo-family", family.revision, [{ from: current, to: end, available_units: 0 }]);
  assert.equal((await service.searchHotelStays("SHARM_EL_SHEIKH", { check_in: current, check_out: end, adults: 2, children: 0 }, category, 1)).items.length, 0);
  assert.equal(calls.length, 0);
  assert.equal((await service.getHotelRoomCalendar("real-hotel", "real-room", current, end)).hotel_id, "real-hotel");
  await service.saveHotelRoomCalendar("real-hotel", "real-room", 0, [{ from: current, to: end, available_units: 0 }]);
  assert.equal(calls.length, 2);
  assert.equal(calls[1].init.method, "PATCH");
  assert.equal(new Headers(calls[1].init.headers).get("Authorization"), "Bearer test-calendar-token");
});

test("calendar-aware edits omit untouched addons and send only addon upserts and explicit archives", async t => {
  const { updateHotel, createEmptyHotelInput } = require("../lib/hotel-service.ts");
  const addon = { id: "saved-addon", price: 20, priceEgp: 900, nameAr: "إطلالة", nameEn: "View", descriptionAr: "", descriptionEn: "" };
  const original = [addon, { ...addon, id: "unchanged-addon" }, { ...addon, id: "removed-addon" }];
  const input = createEmptyHotelInput();
  let body;
  const fetchMock = t.mock.method(globalThis, "fetch", async (_, init) => { body = init.body; return Response.json(demoHotel); });
  const options = { deleteRoomIds: [], previousAddons: original };

  await updateHotel(demoHotel.id, { ...input, addons: original }, undefined, options);
  assert.equal(body.has("addons"), false);
  assert.equal(body.has("addons_write_mode"), false);

  await updateHotel(demoHotel.id, { ...input, addons: [
    { ...addon, priceEgp: 950 }, original[1], { ...addon, id: undefined, nameEn: "New upgrade" },
  ] }, undefined, options);
  assert.equal(body.get("addons_write_mode"), "by_id");
  assert.deepEqual(JSON.parse(body.get("addons")).map(line => [line.id, line.price_egp, line.translations[1].name]),
    [["saved-addon", 950, "View"], [undefined, 900, "New upgrade"]]);
  assert.deepEqual(JSON.parse(body.get("delete_addon_ids")), ["removed-addon"]);

  await updateHotel(demoHotel.id, { ...input, addons: [] }, undefined, options);
  assert.equal(body.has("addons"), false);
  assert.deepEqual(JSON.parse(body.get("delete_addon_ids")), ["saved-addon", "unchanged-addon", "removed-addon"]);

  await assert.rejects(
    updateHotel(demoHotel.id, { ...input, addons: [] }, undefined, { deleteRoomIds: [], previousAddons: [{ ...addon, id: undefined }] }),
    { status: 400 },
  );
  assert.equal(fetchMock.mock.callCount(), 3);
});

test("setting a room capacity sends only the room ID and capacity, and confirms it was saved", async t => {
  const { updateHotelRoomCapacity } = require("../lib/hotel-service.ts");
  const requests = [];
  const hotel = structuredClone(demoHotel);
  t.mock.method(globalThis, "fetch", async (url, init) => {
    requests.push({ pathname: new URL(url).pathname, method: init.method, body: init.body });
    if (init.method === "PATCH") return Response.json({ id: hotel.id });
    return Response.json(hotel);
  });

  await assert.rejects(updateHotelRoomCapacity(demoHotel.id, "demo-double", 51), { status: 400 });
  assert.equal(requests.length, 0);
  await assert.rejects(updateHotelRoomCapacity(demoHotel.id, "demo-double", 3), { status: 409 });
  hotel.rooms[0].capacity = 3;
  assert.equal(await updateHotelRoomCapacity(demoHotel.id, "demo-double", 3), 3);
  const patch = requests[2];
  assert.equal(patch.pathname, "/hotel/demo-coast");
  assert.equal(patch.method, "PATCH");
  assert.deepEqual([...patch.body.keys()].sort(), ["rooms", "rooms_write_mode"]);
  assert.equal(patch.body.get("rooms_write_mode"), "by_id");
  assert.deepEqual(JSON.parse(patch.body.get("rooms")), [{ id: "demo-double", capacity: 3 }]);
});

test("editing occupancy patches only changed room limits and verifies zero and cleared limits", async t => {
  const { updateHotelRoomOccupancy } = require("../lib/hotel-service.ts");
  const hotel = structuredClone(demoHotel);
  Object.assign(hotel.rooms[0], { adult_capacity: 2, child_capacity: 1, children_under_3_capacity: 1 });
  const writes = [];
  t.mock.method(globalThis, "fetch", async (_url, init) => {
    if (init.method === "PATCH") {
      writes.push(init.body);
      return Response.json({ id: hotel.id });
    }
    return Response.json(hotel);
  });

  const change = { childCapacity: 0, childrenUnder3Capacity: null };
  await assert.rejects(updateHotelRoomOccupancy(hotel.id, "demo-double", change), { status: 409 });
  Object.assign(hotel.rooms[0], { child_capacity: 0, children_under_3_capacity: null });
  const room = await updateHotelRoomOccupancy(hotel.id, "demo-double", change);
  assert.equal(room.capacity, 2);
  assert.equal(room.adultCapacity, 2);
  assert.equal(room.childCapacity, 0);
  assert.equal(room.childrenUnder3Capacity, undefined);
  assert.deepEqual([...writes[1].keys()].sort(), ["rooms", "rooms_write_mode"]);
  assert.equal(writes[1].get("rooms_write_mode"), "by_id");
  assert.deepEqual(JSON.parse(writes[1].get("rooms")), [{ id: "demo-double", child_capacity: 0, children_under_3_capacity: null }]);
});
