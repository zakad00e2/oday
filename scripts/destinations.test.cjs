/* eslint-disable @typescript-eslint/no-require-imports -- Load the existing TS services without a separate test dependency. */
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

const destinations = require("../lib/destination-service.ts");
const { HOTEL_DESTINATION_OPTIONS, listHotels } = require("../lib/hotel-service.ts");
const { TRIP_DESTINATION_OPTIONS, getTripDestinationLabels, resolveTripDestination, isSupportedTripDestination } = require("../lib/trip-destinations.ts");
const { getDestinationLabels } = require("../lib/destinations.ts");
const { listTrips } = require("../lib/trip-service.ts");
const record = { destination: "SHARM_EL_SHEIKH", image: null, hotels_count: 5, trips_count: 3 };

function mockSession(t) {
  t.mock.method(globalThis, "fetch");
  const previousWindow = globalThis.window;
  const previousStorage = globalThis.localStorage;
  globalThis.window = { dispatchEvent() {} };
  globalThis.localStorage = { getItem: () => "test-admin-token" };
  t.after(() => {
    globalThis.window = previousWindow;
    globalThis.localStorage = previousStorage;
  });
}

test("public destination requests use the proper type and never send a stored admin token", async (t) => {
  mockSession(t);
  const requests = [];
  fetch.mock.mockImplementation(async (url, init) => {
    requests.push({ url: String(url), init });
    return Response.json(String(url).includes("/SHARM_EL_SHEIKH") ? record : [record]);
  });
  assert.deepEqual(await destinations.listDestinations({ type: "hotels" }), [record]);
  await destinations.listDestinations({ type: "trips" });
  await destinations.listDestinations();
  assert.deepEqual(await destinations.getDestination("SHARM_EL_SHEIKH"), record);
  assert.equal(new URL(requests[0].url).searchParams.get("type"), "hotels");
  assert.equal(new URL(requests[1].url).searchParams.get("type"), "trips");
  assert.equal(new URL(requests[2].url).search, "");
  for (const { init } of requests) assert.equal(new Headers(init.headers).has("Authorization"), false);
});

test("hotel and trip lists send destination and city respectively without authorization", async (t) => {
  mockSession(t);
  const requests = [];
  fetch.mock.mockImplementation(async (url, init) => {
    requests.push({ url: String(url), init });
    return Response.json({ data: [], meta: { total: 0, page: 1, limit: 100, totalPages: 1 } });
  });
  await listHotels({ destination: "ASWAN", page: 1, limit: 100 });
  await listTrips({ city: "LUXOR", page: 1, limit: 100 });
  assert.equal(new URL(requests[0].url).searchParams.get("destination"), "ASWAN");
  assert.equal(new URL(requests[0].url).searchParams.has("city"), false);
  assert.equal(new URL(requests[1].url).searchParams.get("city"), "LUXOR");
  assert.equal(new URL(requests[1].url).searchParams.has("destination"), false);
  for (const { init } of requests) assert.equal(new Headers(init.headers).has("Authorization"), false);
});

test("all 14 destination values and labels are available to hotels and trips", () => {
  assert.equal(HOTEL_DESTINATION_OPTIONS.length, 14);
  assert.deepEqual(TRIP_DESTINATION_OPTIONS.map((d) => d.value).sort(), HOTEL_DESTINATION_OPTIONS.map((d) => d.value).sort());
  assert.match(destinations.getDestinationImage(record), /^https:\/\/images\.unsplash\.com\//);
  assert.equal(destinations.getDestinationImage({ ...record, image: { url: "https://ik.imagekit.io/example.jpg" } }), "https://ik.imagekit.io/example.jpg");
});

test("Aswan and Luxor support Arabic labels, aliases and default images", () => {
  for (const [value, ar, en, alias] of [["ASWAN", "أسوان", "Aswan", "اسوان"], ["LUXOR", "الأقصر", "Luxor", "الاقصر"]]) {
    assert.deepEqual(getDestinationLabels(value), { ar, en });
    assert.deepEqual(getTripDestinationLabels(value), { value, ar, en });
    assert.equal(resolveTripDestination(alias), value);
    assert.equal(isSupportedTripDestination(value), true);
    assert.equal(HOTEL_DESTINATION_OPTIONS.some((option) => option.value === value), true);
    const fallback = destinations.getDestinationImage({ destination: value, image: null });
    assert.ok(fs.existsSync(require("node:path").join(__dirname, "../public", fallback)));
  }
});

test("image replacement uses one multipart image and bearer auth; deletion uses DELETE", async (t) => {
  mockSession(t);
  const requests = [];
  fetch.mock.mockImplementation(async (url, init) => {
    requests.push({ url: String(url), init });
    return init.method === "DELETE" ? new Response(null, { status: 204 }) : Response.json(record);
  });
  const file = new File(["image"], "photo.png", { type: "image/png" });
  await destinations.updateDestinationImage("SHARM_EL_SHEIKH", file);
  await destinations.deleteDestinationImage("SHARM_EL_SHEIKH");
  assert.ok(requests[0].url.endsWith("/destination/SHARM_EL_SHEIKH/image"));
  assert.equal(requests[0].init.method, "PUT");
  assert.deepEqual([...requests[0].init.body.keys()], ["image"]);
  assert.equal(requests[0].init.body.get("image").name, "photo.png");
  assert.equal(new Headers(requests[0].init.headers).has("Content-Type"), false);
  assert.equal(requests[1].init.method, "DELETE");
  for (const { init } of requests) assert.equal(new Headers(init.headers).get("Authorization"), "Bearer test-admin-token");
});

test("invalid and oversized uploads are rejected before sending a request", async (t) => {
  mockSession(t);
  await assert.rejects(destinations.updateDestinationImage("CAIRO", new File(["text"], "file.txt", { type: "text/plain" })), /صورة/);
  await assert.rejects(destinations.updateDestinationImage("CAIRO", new File([new Uint8Array(2 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })), /2/);
  assert.equal(fetch.mock.callCount(), 0);
});

test("API errors retain their status and messages, including array validation errors", async (t) => {
  mockSession(t);
  for (const status of [400, 401, 404]) {
    fetch.mock.mockImplementation(async () => Response.json({ message: ["invalid image", "try again"] }, { status }));
    await assert.rejects(destinations.deleteDestinationImage("CAIRO"), (error) => error.status === status && error.message === "invalid image، try again");
  }
});
