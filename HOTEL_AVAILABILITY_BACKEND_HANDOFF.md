# Backend handoff: hotel availability and nightly pricing

Frontend handoff, 2026-11-10. The bilingual dated search, stay quote and checkout recheck, and Arabic admin calendar are implemented against the contract below. The backend endpoints and database migration are still required. The frontend has a local demo; live integration must be verified on staging. See the [frontend design](docs/superpowers/specs/2026-11-10-hotel-availability-design.md).

## Enablement and local preview

| Value of `NEXT_PUBLIC_HOTEL_AVAILABILITY` | Behavior |
| --- | --- |
| Unset | Existing catalog, hotel detail, and admin behavior. No dated availability requests. |
| `demo` | Development-only public search, sample hotel and calendar at `/ar/hotel-calendar-demo` or `/en/hotel-calendar-demo`. Select `SHARM_EL_SHEIKH` and dates from today to start. Sample stock, rates and cart persist in this browser only. Checkout verifies the quote but never opens WhatsApp. |
| `admin` | Authenticated room calendars and ID-aware hotel PATCH are enabled; guest pages still use the existing catalog. Use this phase to configure stock and rates. |
| `live` | Dated guest search and quoting, checkout rechecks, and the admin calendar are enabled. |

Public environment variables are baked in at build time. Rebuild/redeploy when changing modes. Development preview (PowerShell):

```powershell
$env:NEXT_PUBLIC_HOTEL_AVAILABILITY = 'demo'
npm run dev:next
```

The calendar demo exercises the same editor and date contract as `/admin/hotels`, without requiring a live admin account or writing to the hotel service. To verify frontend domain and request behavior run `npm run test:hotel-availability`.

Frontend checks passed on 2026-11-10: the 41-test repo suite, lint on the changed files, and a production build in `live` mode. Browser checks used the local demo: search and room selection, add-ons and cart totals, a rate change requiring checkout confirmation, and an Arabic mobile search after closing an occupied night. The authenticated calendar against a real backend and the live inquiry flow remain staging checks.

## What to build

Add a public dated hotel search, a public stay quote, and an authenticated room-type calendar API on the existing hotel service. Search accepts a destination, dates and guest counts. A hotel qualifies only when the same allocation of rooms can accommodate the whole party on every night. Return a price for the full stay at the selected visitor tariff. The admin can manage bookable units and rate overrides by night or range. The current checkout remains a WhatsApp inquiry; these calls never reserve stock or promise confirmation.

The frontend currently uses `NEXT_PUBLIC_HOTEL_API_BASE` (ends in `/hotel`), `GET /hotel` for catalog browsing, `GET /hotel/:id` for hotel data, and `GET /destination?type=hotels` for destination identifiers. Keep their existing semantics. Use a distinct `/hotel/search` route; ensure it does not match the dynamic `/:id` route. Keep the existing hotel multipart CRUD contract. Request authorization for both admin calendar routes using the existing admin mechanism, including authenticated reads. Verify that the room belongs to the hotel in the path.

## Domain rules

- Persist per-night overrides and stock using a unique `(room_id, stay_date)` key. Store `stay_date` as a date without a time and optional USD/EGP override amounts as exact decimals. `available_units` is the number of rooms of that type the business is willing to sell on that night. `0` or no row means closed. An admin can set more than one unit; a positive count does not imply a reservation or automatic deduction.
- Only active hotels and active room types with stable IDs and verified positive integer capacities qualify. Never use a room index or name as an ID. On ordinary hotel edits, keep IDs and calendar entries for unchanged and edited room types. Archive or invalidate calendar rows for deleted types, and never attach them to a newly created type.
- A stay is `[check_in, check_out)` in the hotel's local calendar (`Africa/Cairo` for the current destinations). For a Nov 20–22 stay, check and charge the nights of Nov 20 and Nov 21 only. Use `YYYY-MM-DD`; reject invalid dates, dates before local today and stays with checkout on or before check-in. Proposed bounds: 1–30 nights, every night within a rolling 365-day window starting today, and 1–20 total guests including at least one adult. Share the final limits with the frontend. Admin range reads and writes use the same exclusive end convention.
- Adults and children each occupy one capacity slot. Child ages, infant rules and child-specific rates are outside this release. A combination can use several units of one type and can mix types. For each type the maximum allocatable quantity is the **minimum** of its available units across all nights. The sum of `capacity × quantity` must cover the party. Exclude combinations with more rooms than guests. Never swap room types between nights to make a stay qualify.
- Existing `room.price` is the base USD rate and `room.price_egp` is the independent base EGP rate. Effective nightly rate for each currency is that date's override, if present, otherwise the base rate. No exchange-rate conversion or automatic hotel discount stacking. Missing, non-positive or invalid legacy base amounts mean “on request”; new overrides must be positive and have no more than two decimal places. A missing rate for a night in the chosen tariff makes the affected subtotal and full stay total `null`, never zero or a partial quote. Availability remains valid when prices are missing.
- Find the cheapest **fully priced** feasible combination for the requested tariff. If none is fully priced, return a feasible combination with `pricing_status: "ON_REQUEST"` and a null total. For ties prefer fewer rooms, then a stable room ID/quantity ordering; for an on-request option prefer fewer rooms, then the same stable ordering. Price is the sum of effective nightly rates multiplied by units per type. Compute availability and recommendations before pagination, and use a deterministic hotel order (existing catalog order plus hotel ID as a tie-breaker, or hotel ID alone if there is no catalog order).

## Public API

### `GET /hotel/search`

```http
GET /hotel/search?destination=SHARM_EL_SHEIKH&check_in=2026-11-20&check_out=2026-11-22&adults=4&children=1&visitor_category=egyptian-resident&page=1&limit=20
```

Required: `destination` (the current catalog code), `check_in`, `check_out`, `adults`, `visitor_category`. Default `children=0`, `page=1`, `limit=20`; proposed page size cap: 100. The service maps `egyptian-resident` to `EGP` and `other` to `USD`, per the [existing tariff contract](VISITOR_PRICING_BACKEND_HANDOFF.md). Language does not select currency. This parameter is new for dated search and quoting only. Return an empty `data` array and `meta.total=0`, `meta.totalPages=0` for a valid search with no matches. Pagination counts matching hotels, including physically available hotels priced on request.

```json
{
  "data": [
    {
      "hotel": {
        "id": "h_123",
        "destination": "SHARM_EL_SHEIKH"
      },
      "stay_offer": {
        "nights": 2,
        "currency": "EGP",
        "pricing_status": "PRICED",
        "total": "26400.00",
        "rooms": [
          { "room_id": "r_double", "quantity": 1 },
          { "room_id": "r_family", "quantity": 1 }
        ]
      }
    }
  ],
  "meta": { "total": 1, "page": 1, "limit": 20, "totalPages": 1 }
}
```

`hotel` is abbreviated above: return the existing `ApiHotel` catalog shape, including translated names/slugs and assets required by the card. `stay_offer.total` covers all nights and all recommended units, excluding optional upgrades. Use decimal strings in the currency's major unit consistently. Do not derive the stay total from `initial_price` or `original_price`.

### `POST /hotel/:hotelId/stay-quote`

Use the same fields and rules as search, except `destination` is derived from the hotel. Omit `rooms` to return the recommendation and selectable room types for this stay. Include a nonempty `rooms` array to check the exact combination; include `addons` only with explicit rooms. Each ID must be unique within its array and belong to the hotel; quantities must be positive integers. Upgrades use existing tariff prices per upgraded room per night; the sum of upgrade quantities may not exceed the number of selected rooms. Zero upgrades can be represented by an omitted or empty `addons` array.

```json
{
  "check_in": "2026-11-20",
  "check_out": "2026-11-22",
  "adults": 4,
  "children": 1,
  "visitor_category": "egyptian-resident",
  "rooms": [
    { "room_id": "r_double", "quantity": 1 },
    { "room_id": "r_family", "quantity": 1 }
  ],
  "addons": [{ "addon_id": "a_upgrade", "quantity": 1 }]
}
```

```json
{
  "hotel_id": "h_123",
  "check_in": "2026-11-20",
  "check_out": "2026-11-22",
  "adults": 4,
  "children": 1,
  "nights": 2,
  "visitor_category": "egyptian-resident",
  "currency": "EGP",
  "pricing_status": "PRICED",
  "available_room_types": [
    { "room_id": "r_double", "capacity": 2, "max_quantity": 1, "unit_stay_total": "12000.00" },
    { "room_id": "r_family", "capacity": 3, "max_quantity": 1, "unit_stay_total": "14400.00" }
  ],
  "rooms": [
    {
      "room_id": "r_double", "quantity": 1, "subtotal": "12000.00",
      "nightly_rates": [
        { "date": "2026-11-20", "unit_rate": "5000.00" },
        { "date": "2026-11-21", "unit_rate": "7000.00" }
      ]
    },
    {
      "room_id": "r_family", "quantity": 1, "subtotal": "14400.00",
      "nightly_rates": [
        { "date": "2026-11-20", "unit_rate": "7200.00" },
        { "date": "2026-11-21", "unit_rate": "7200.00" }
      ]
    }
  ],
  "addons": [
    { "addon_id": "a_upgrade", "quantity": 1, "unit_rate": "900.00", "subtotal": "1800.00" }
  ],
  "room_total": "26400.00",
  "addons_total": "1800.00",
  "total": "28200.00",
  "quoted_at": "2026-11-10T12:00:00Z"
}
```

`available_room_types` includes types with at least one unit available for every night, even if several types are needed to cover the party; `max_quantity` is capped at the guest count. Join by stable ID to the localized hotel record; both room types and selectable add-ons need stable IDs in the hotel response. `unit_stay_total` is for one room across all nights. Each subtotal is null if its required tariff is missing; use `"0.00"` for the sum of an empty upgrades list. `pricing_status` is `ON_REQUEST` if the full total is null. For a quote without explicit rooms or upgrades, the room allocation and total should match search under the same data snapshot. Prices and inventory are current as of the response; use `Cache-Control: no-store` for search and quote.

Requote the exact selection before sending the inquiry. The frontend compares the new total, nightly lines and currency with what the guest accepted, including changes from priced to on-request or the reverse. A successful repricing returns the updated quote; it does not need a price-change HTTP error or a persistent quote ID. Unavailable stock returns a conflict; no room is held between quote and inquiry.

For old saved cart lines without a dated quote, the frontend requests a new exact quote if the inputs and stable IDs are known and shows it for confirmation. If the selection is missing inputs or a stored ID was synthetic or stale, it asks the guest to reselect. Legacy catalog rates never count as an accepted quote.

## Admin API

`GET /hotel/:hotelId/rooms/:roomId/calendar?from=2026-11-20&to=2026-11-23` returns one entry per requested night, including closed dates with no row. Include the revision for the entire room calendar, current base rates and per-night overrides so the UI can tell the difference between an override and an inherited price. Allow at least one calendar month per request within the configured booking window.

```json
{
  "hotel_id": "h_123",
  "room_id": "r_double",
  "revision": 8,
  "base_rates": { "USD": "100.00", "EGP": "5000.00" },
  "days": [
    { "date": "2026-11-20", "available_units": 1, "rate_override": { "USD": null, "EGP": null } },
    { "date": "2026-11-21", "available_units": 1, "rate_override": { "USD": "140.00", "EGP": "7000.00" } },
    { "date": "2026-11-22", "available_units": 0, "rate_override": { "USD": null, "EGP": null } }
  ]
}
```

`PATCH /hotel/:hotelId/rooms/:roomId/calendar` accepts a revision and an array of non-overlapping changes. A single night is a range where `to` is the following date. Each change must set at least one stock or price field. Omitted fields stay unchanged. Explicit `null` clears an override for that currency. Setting units to `0` closes the dates and keeps existing price overrides unless explicitly cleared. A price-only edit does not open a date. Apply the entire batch atomically, and return `200` with the new `revision`; the frontend reloads the displayed calendar. A stale revision returns `409` with no partial writes.

```json
{
  "revision": 8,
  "changes": [
    { "from": "2026-11-21", "to": "2026-11-22", "available_units": 2, "rate_override": { "EGP": "7500.00" } },
    { "from": "2026-11-22", "to": "2026-11-23", "available_units": 0, "rate_override": { "USD": null, "EGP": null } }
  ]
}
```

### Preserve IDs when editing room types

The current frontend's multipart `rooms` array does not send room IDs. Extend `PATCH /hotel/:hotelId` to accept the scalar `rooms_write_mode=by_id` for the updated admin. In that mode, `rooms` is a JSON upsert array: a row with `id` updates that type, and a row without `id` creates one. `delete_room_ids` is a separate JSON array of explicit deletions. Omitted collections mean no changes, and an existing type missing from the upsert array stays intact. Reject foreign, duplicate, unknown or conflicting IDs and apply room changes atomically. Return stable IDs for every room in the saved and read responses.

Retain legacy writes for hotels that have not enabled calendar management. Once a hotel has received its first successful calendar write, reject legacy requests that attempt room replacement without `rooms_write_mode=by_id`; return `409 ROOM_IDS_REQUIRED` before modifying the hotel. Legacy updates that omit room changes remain compatible. The server must never match existing room types by translated name, position, capacity or price. Deploy the ID-aware admin before enabling calendar management.

### Preserve IDs when editing room upgrades

In `admin` and `live` modes, hotel edits omit the upgrade fields when there are no changes. When an upgrade changes, the frontend sends `addons_write_mode=by_id` and puts the changed or new rows in the multipart `addons` JSON array. Existing rows carry their original `id`. New rows omit it. Removed upgrades are listed separately in `delete_addon_ids` for archival. For deletion-only edits, the request omits `addons` and still includes the mode and deletion IDs.

The backend rejects invalid IDs with `400 INVALID_INPUT` and legacy replacements of upgrades on calendar-managed hotels with `409 ADDON_IDS_REQUIRED`. Test an ordinary hotel save, an upgrade rename and an explicit removal on the designated pilot hotel before enabling guest search.

### Error contract

Return a machine-readable `code` and human-readable `message`; use `field` for validation errors when it identifies a specific request field. `400 INVALID_INPUT` covers malformed dates or ranges, unknown destination/tariff, invalid quantities, or malformed selection IDs. `401 UNAUTHENTICATED` and `403 FORBIDDEN` apply to calendar routes. `404 NOT_FOUND` covers a missing/deleted hotel or calendar room outside the hotel. `409 STAY_UNAVAILABLE` applies when no allocation can satisfy the party or a well-formed exact selection cannot be fulfilled, including insufficient stock/capacity and room or upgrade IDs that are no longer selectable for that hotel. Use a generic selection error for unknown or foreign IDs without revealing other hotels' data. `409 CALENDAR_CONFLICT` applies to a stale admin revision; `409 ROOM_IDS_REQUIRED` applies to legacy room replacement after calendar management starts. A dependency failure returns a server error, not an empty result.

## Migration and rollout

1. Ship and verify the ID-aware update contract. The current frontend extracts a number from room descriptions and falls back to two; have admins verify capacities and configure units before a hotel participates. Require stable IDs for calendar rooms and preserve them through unrelated hotel edits.
2. Add daily calendar storage and indexing. No migration should invent stock from existing catalog rows. Keep legacy catalog access available; only configured nights qualify for dated search. Use a staging dataset with an open range, a closed night, overrides in both currencies and an unavailable tariff.
3. Deploy the backend to staging and give the frontend developer the base URL, a test hotel/room and admin test access through the usual channel, confirmed validation limits, and example responses. Point `NEXT_PUBLIC_HOTEL_API_BASE` to the staging `/hotel` endpoint. Validate the public and authenticated calls, CORS for the frontend origin (including JSON POST and authenticated calendar GET/PATCH), and retention of room IDs on ordinary content edits.
4. Deploy in `admin` mode first so admins can verify room capacities and seed calendars without exposing search. Then deploy in `live` mode. Recheck search, exact quote, calendar writes and an older saved cart against staging before switching production. No backend data is seeded by the frontend.

## Acceptance cases

| Case | Expected result |
| --- | --- |
| Two-night stay with one unavailable night, or stock split across different types on different nights | Hotel excluded; the exact selection cannot be quoted. |
| Checkout date closed, both occupied nights open | Hotel eligible; checkout date is not charged. |
| Five guests, one two-person unit and one three-person unit available throughout | Both types recommended; for the example above the room total is `26400.00 EGP`. The same mix with one `900.00 EGP` upgrade for two nights quotes `28200.00 EGP`. |
| Two units of a type available on the first night, one on the second | At most one unit of that type can be selected for the stay. |
| Override only for EGP on one night | USD continues to use its own base or independent override. Clearing the EGP override restores its base. |
| A feasible stay has a missing EGP rate and no fully priced alternative | Stay appears for EGP with `ON_REQUEST`; no USD fallback or partial total. |
| Hotel initially appears, then its admin closes a night or changes a rate | A new exact quote returns `409 STAY_UNAVAILABLE` or the updated quote respectively. |
| Admin sends a stale revision, an overlapping batch, or requests another hotel's room | Write is rejected; no part of the change is saved. Unauthorized reads and writes fail. |
| Save hotel content or change a room's translated name | Existing room ID and calendar survive. Deleted room types are never offered. An old client attempting to replace rooms on a calendar-managed hotel receives `409 ROOM_IDS_REQUIRED` without altering rooms or calendars. |
| Resume an old saved cart line with a flat price or a deleted room/upgrade | Frontend requires a fresh exact quote and confirmation, or directs the guest to choose rooms again. |
| No dates provided to legacy catalog, or dates supplied to the new search with no qualifying hotels | The old catalog still works; dated search returns a successful empty page. |
