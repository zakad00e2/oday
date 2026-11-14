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

const { addStayDays, cairoToday, readStayQuery, stayIssue, stayQuery, sameStayQuote, exactStayRequest } = require("../lib/hotel-stay.ts");
const { getDemoCalendar, saveDemoCalendar, demoSearch, demoQuote, demoHotel } = require("../lib/hotel-availability-demo.ts");
const stay = { check_in: "2026-11-20", check_out: "2026-11-22", adults: 4, children: 1 };
const category = "egyptian-resident";
const today = "2026-11-20";

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

test("demo search excludes a stay when just one occupied night closes and prices independent tariffs", () => {
  const storage = new Map();
  const calendar = getDemoCalendar("demo-double", today, "2026-11-23", storage, today);
  saveDemoCalendar("demo-double", calendar.revision, [
    { from: "2026-11-21", to: "2026-11-22", rate_override: { EGP: "7000.00" } },
    { from: "2026-11-22", to: "2026-11-23", available_units: 0 },
  ], storage, today);
  const results = demoSearch("SHARM_EL_SHEIKH", stay, category, 1, storage, today);
  assert.equal(results.data[0].stay_offer.total, "26400.00");
  assert.equal(demoSearch("SHARM_EL_SHEIKH", stay, "other", 1, storage, today).data[0].stay_offer.total, "500.00");
  assert.equal(demoSearch("SHARM_EL_SHEIKH", { ...stay, check_out: "2026-11-23" }, category, 1, storage, today).meta.total, 0);
  const quoted = demoQuote(demoHotel.id, stay, category, results.data[0].stay_offer.rooms, [{ addon_id: "demo-upgrade", quantity: 1 }], storage, today);
  assert.equal(quoted.total, "28200.00");
  assert.equal(quoted.available_room_types.find(r => r.room_id === "demo-double").max_quantity, 1);
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
  const line = { checkIn: stay.check_in, checkOut: stay.check_out, stayGuests: { adults: 4, children: 1 }, selectedRooms: [{ id: "demo-family", count: 2 }] };
  assert.deepEqual(exactStayRequest(line, today), { ...stay, rooms: [{ room_id: "demo-family", quantity: 2 }], addons: [] });
  assert.equal(exactStayRequest({ ...line, selectedRooms: [{ id: "legacy-room", count: 1 }] }, today), null);
  assert.equal(exactStayRequest({ ...line, stayGuests: undefined }, today), null);
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
  const prevWindow = globalThis.window;
  const prevStorage = globalThis.localStorage;
  globalThis.window = { dispatchEvent() {} };
  globalThis.localStorage = { getItem: () => "test-calendar-token" };
  t.after(() => { globalThis.window = prevWindow; globalThis.localStorage = prevStorage; });
  const seen = [];
  t.mock.method(globalThis, "fetch", async (url, init) => {
    const path = new URL(url);
    seen.push({ path, init });
    if (path.pathname.endsWith("/search")) return Response.json(demoSearch("SHARM_EL_SHEIKH", stay, category, 1, new Map(), today));
    if (path.pathname.endsWith("/stay-quote")) return Response.json(demoQuote(demoHotel.id, stay, category, undefined, undefined, new Map(), today));
    if (init.method === "PATCH") return Response.json({ code: "CALENDAR_CONFLICT", message: "Conflict" }, { status: 409 });
    return Response.json(getDemoCalendar("demo-double", today, stay.check_out, new Map(), today));
  });
  const results = await service.searchHotelStays("SHARM_EL_SHEIKH", stay, category, 1);
  await service.quoteHotelStay(demoHotel.id, stay, category, { rooms: results.items[0].offer.rooms, addons: [] });
  await service.getHotelRoomCalendar(demoHotel.id, "demo-double", today, stay.check_out);
  await assert.rejects(service.saveHotelRoomCalendar(demoHotel.id, "demo-double", 0, [{ from: today, to: stay.check_out, available_units: 0 }]), { code: "CALENDAR_CONFLICT", status: 409 });
  assert.equal(seen[0].path.searchParams.get("destination"), "SHARM_EL_SHEIKH");
  assert.equal(seen[0].path.searchParams.get("visitor_category"), category);
  assert.equal(seen[0].path.searchParams.get("check_out"), stay.check_out);
  assert.deepEqual(JSON.parse(seen[1].init.body), { ...stay, visitor_category: category, rooms: results.items[0].offer.rooms, addons: [] });
  assert.equal(seen[2].path.searchParams.get("to"), stay.check_out);
  assert.deepEqual(seen.map(({ init }) => new Headers(init.headers).get("Authorization")),
    [null, null, "Bearer test-calendar-token", "Bearer test-calendar-token"]);
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
