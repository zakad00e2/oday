# Visitor pricing: backend integration handoff

‫تم تنفيذ جزء الفرونت إند لإدخال سعرين مستقلين وعرض السعر المناسب لفئة الزائر. يحتاج تفعيل أسعار الجنيه على البيانات الفعلية إلى تعديلات الباك إند الموضحة هنا. لم تُعدّل قاعدة البيانات أو الخدمات الخلفية.‬

## Business rule

| Self-declared visitor category | Frontend value | Currency |
| --- | --- | --- |
| Egyptian national or foreign national holding valid Egyptian residency | `egyptian-resident` | `EGP` |
| Other nationalities without valid Egyptian residency | `other` | `USD` |

Updated eligibility approved on 2026-10-27: the first category includes Egyptians and foreign nationals with valid Egyptian residency. The historical `egyptian-resident` identifier remains unchanged for compatibility; do not interpret it as restricting eligibility to Egyptians living in Egypt. Apply the updated labels to booking/inquiry eligibility checks as well as hotel and trip prices. The introductory copy is generic: “للحصول على الأسعار، يُرجى اختيار فئة التسعير.”

On first entry to the hotel or trip section (list or detail routes under `/ar/hotels`, `/en/hotels`, `/ar/trips`, `/en/trips`), a residence-selection modal opens automatically after stored preference hydration. This applies to direct links and client navigation. Home and unrelated public pages do not automatically prompt. The visitor chooses between the two tariff categories before proceeding in these sections. There is no pricing/category control in the header or mobile navigation; a footer button reopens the modal for later changes. Saved valid choices bypass the automatic prompt. Escape/backdrop cannot skip the first choice; Escape or cancel during an edit retains the prior choice. The choice is stored as a validated string in `localStorage["oday-visitor-category-v1"]`. It survives reloads and Arabic/English navigation, and synchronizes between tabs. If storage is unavailable, the choice works for the current mounted session.

Before a choice, pricing UI asks the visitor to select a category. Nationality/residency is not inferred from language, IP, timezone or browser location. These are independently administered tariffs, not foreign exchange conversions.

## Exact API contract

**Existing fields remain USD.** The frontend adds EGP fields beside them. No endpoint renaming, currency query parameter or new category endpoint is required for the catalog: list/detail responses return both independent prices.

| Entity | Existing USD API field | New EGP API field | Normalized frontend EGP property |
| --- | --- | --- | --- |
| Hotel starting price | `initial_price` | `initial_price_egp` | `initialPriceEgp` |
| Hotel original price | `original_price` | `original_price_egp` | `originalPriceEgp` |
| Hotel room | `price` | `price_egp` | `priceEgp` |
| Hotel addon | `price` | `price_egp` | `priceEgp` |
| Trip starting price | `price` | `price_egp` | `startingPriceEgp` |
| Trip option | `price` | `price_egp` | `priceEgp` |
| Trip addon | `price` | `price_egp` | `priceEgp` |

Implement these fields in:

- Hotel `GET /hotel`, `GET /hotel/:id`, `POST /hotel`, `PATCH /hotel/:id`.
- Trip `GET /trip`, `GET /trip/:id`, `POST /trip`, `PATCH /trip/:id`.
- All nested room/option/addon entities and their serializers/DTOs.
- Successful create/update responses as well as subsequent list/detail responses.

The existing service base paths are configured through `NEXT_PUBLIC_HOTEL_API_BASE` and `NEXT_PUBLIC_TRIP_API_BASE`; their defaults end in `/hotel` and `/trip` on the existing Railway service. The frontend does not introduce a new backend host.

### Requests: multipart top-level fields, JSON nested collections

Requests keep the existing `multipart/form-data` encoding, authorization header, file field names, translations and other business fields. The browser supplies the multipart boundary; do not force a JSON Content-Type on these requests.

Hotel example (logical FormData entries; scalar values are strings):

```text
slug = verification-hotel
destination = CAIRO
initial_price = 100.25
initial_price_egp = 3500.75
original_price = 125.50
original_price_egp = 4200.00
stars = FIVE
rating = UNRATED
is_discounted = true
discount_percentage = 20
youtube_video_url =
translations = [{"language":"ar","name":"فندق التجربة","slug":"verification-hotel","description":"وصف الفندق","Facilities":[]},{"language":"en","name":"Verification Hotel","slug":"verification-hotel","description":"Hotel description","Facilities":[]}]
rooms = [{"capacity":"2","price":100.25,"price_egp":3500.75,"translations":[{"language":"ar","name":"غرفة مزدوجة","description":"شخصان"},{"language":"en","name":"Double room","description":"Two guests"}]}]
addons = [{"price":5.50,"price_egp":150.25,"translations":[{"language":"ar","name":"إطلالة بحرية","description":"لكل غرفة في الليلة"},{"language":"en","name":"Sea view","description":"Per room per night"}]}]
mainImages = <existing upload convention; file when selected>
subImages = <existing upload convention; files when selected>
```

The existing hotel service carries meal-plan information through its existing facility encoding; preserve the current behavior. This pricing feature does not change image or meal-plan handling.

Trip example:

```text
city = CAIRO
slug = verification-trip
price = 20.25
price_egp = 650.50
start_time = 08:00
end_time = 10:00
youtube_video_url =
translations = [{"language":"ar","title":"رحلة التجربة","subtitle":"جولة سياحية","description":"وصف الرحلة","duration":"ساعتان","facilities":[]},{"language":"en","title":"Verification Trip","subtitle":"Sightseeing tour","description":"Trip description","duration":"Two hours","facilities":[]}]
options = [{"price":20.25,"price_egp":650.50,"translations":[{"language":"ar","name":"الخيار الأساسي","description":"لكل شخص"},{"language":"en","name":"Standard option","description":"Per person"}]}]
addons = [{"price":0,"price_egp":0,"translations":[{"language":"ar","name":"إضافة مجانية","description":"مشمولة"},{"language":"en","name":"Free addon","description":"Included"}]}]
```

For PATCH, an omitted `options` or `addons` field means **leave the existing collection unchanged**, not clear it. Empty arrays mean an explicitly empty collection. Apply updates transactionally.

The current trip dashboard already has a replacement workflow when nested collections change: temporarily rename the old slug, create the replacement record, then delete the old record; errors trigger rollback attempts. This behavior predates this feature and is preserved. EGP price changes in nested collections participate in its change detection. The frontend now checks replacement EGP acknowledgement before deleting the original. Backend support for atomic nested PATCH would allow that pre-existing workaround to be removed separately.

### Response fragments

Return decimal strings or JSON numbers; both are normalized by the frontend. A hotel pricing fragment:

```json
{
  "id": "hotel-id",
  "initial_price": "100.25",
  "initial_price_egp": "3500.75",
  "original_price": "125.50",
  "original_price_egp": "4200.00",
  "rooms": [{ "id": "room-id", "capacity": "2", "price": "100.25", "price_egp": "3500.75", "translations": [] }],
  "addons": [{ "id": "addon-id", "price": "5.50", "price_egp": "150.25", "translations": [] }]
}
```

A trip pricing fragment:

```json
{
  "id": "trip-id",
  "slug": "verification-trip",
  "price": "20.25",
  "price_egp": "650.50",
  "options": [{ "id": "option-id", "price": "20.25", "price_egp": "650.50", "translations": [] }],
  "addons": [{ "id": "addon-id", "price": "0.00", "price_egp": "0.00", "translations": [] }]
}
```

These are pricing fragments, not replacements for full existing responses. Preserve existing translations, assets, flags, identifiers, metadata and pagination (`data`, `meta.totalPages`, etc.).

## Database, validation and migration

1. Add decimal EGP columns to hotels (current/original), hotel rooms, hotel addons, trips, trip options and trip addons. Use fixed decimal precision with two fractional digits and sufficient existing business limits; avoid binary floating-point storage for money.
2. Keep historical USD values unchanged. Add EGP columns as nullable during rollout. Backfill with prices explicitly supplied by the business; do not copy USD numbers or use an invented exchange rate.
3. Missing/unpriced EGP must serialize as `null` or be omitted during migration. **Zero is not a missing-value marker**: zero optional addons may be free. The frontend treats zero hotel room/base and trip option/base prices as on-request placeholders, consistent with the existing unpriced trip convention. Establish explicit availability semantics if the backend later needs to distinguish free core products from unpriced ones.
4. Require both independent amounts for new/edited priced entries after integration. Validate finite, nonnegative decimal values, maximum two decimal places, appropriate upper bounds, and nested values too. The dashboard validates empty/negative/excess-precision inputs before submission.
5. `original_price_egp` is optional without a discount. The current multipart serializer sends an empty string for an absent optional original EGP amount; normalize that to null. With a discount, both original prices must exceed their respective current prices.
6. The dashboard requires both USD and EGP original values with a discount and does not fabricate original prices. The public card only crosses out a same-currency original greater than the current amount. Its percentage badge is calculated from those active amounts, so independent USD/EGP tariffs can show different actual discounts.
7. Preserve explicit zero with nullish logic. Do not use truthiness checks that turn `0` into `null`.
8. Update DTO allowlists/validation so EGP fields are accepted rather than stripped silently. Persist and return submitted EGP values on successful writes. The dashboard checks the acknowledgement and warns if values are missing/different; it keeps the form open so entered amounts can be retained for integration.
9. Return actionable validation errors in the existing error shape. Keep existing authenticated admin permissions on writes; expose both tariffs on public catalog reads.

## Cart, calculations and booking inquiry

The frontend stores raw independent unit-price snapshots as:

```json
{ "prices": { "USD": 20.25, "EGP": 650.5 } }
```

These pairs accompany existing hotel room/addon and trip option/addon selections and base trip prices. New trip selections also retain option/addon IDs, avoiding ambiguity when different tariffs share the same translated names. The cart derives an active numeric view from the visitor category and never overwrites the other currency. Legacy cart values without a pair are treated as USD-only.

- Hotel cost: sum of selected room unit prices × room quantities × nights, plus selected hotel addon prices × total rooms × nights.
- Trip cost: selected option prices × each selected quantity, plus selected addon prices × their quantities. With no selected options, use the trip's starting price × persons, then add addons. This also fixes the previous addon-only branch dropping the trip base amount.
- An unavailable required selected unit propagates to an incomplete line/total. The UI displays “Price on request”; a known partial sum is not advertised as the complete price. A valid free optional addon stays free.
- Quote inquiries include the visitor category and currency, selected lines/quantities/dates, and explicit on-request pricing where unavailable. There is no new booking/payment endpoint in this change; the current checkout composes a WhatsApp inquiry.
- Analytics use the active currency and omit numeric value when the total is incomplete. Existing server-rendered structured offers remain explicitly USD; they are not relabeled with client-side EGP preferences.

When actual reservations/payments are implemented, the backend must verify any eligibility requirements, reload authoritative prices by item IDs and category, calculate all totals itself, validate availability/dates, and snapshot the charged amount/currency. localStorage, frontend totals and incoming currency claims are untrusted.

Security approval/visa prices continue to use their existing USD pricing and are outside this feature.

## Integration acceptance checklist

- [ ] Migration preserves USD and represents missing EGP as null.
- [ ] Create/edit a hotel with decimal USD/EGP current/original amounts, multiple rooms and free/paid addons; reload both list/detail and confirm every amount.
- [ ] Create/edit a trip with decimal USD/EGP base/options/addons; verify omitted PATCH collections stay unchanged.
- [ ] Reject negative, malformed, excess-precision and unauthorized writes; preserve explicit free-addon zero values.
- [ ] Select each visitor category; verify Arabic/English, mobile/desktop, reload and cross-tab behavior.
- [ ] Populate a cart, change category repeatedly, and verify room counts/persons/nights and each independent amount remain intact.
- [ ] Test legacy carts and a selected addon missing EGP: the complete total must be on request, with no false free label or USD/EGP mixed sum.
- [ ] Confirm successful writes return EGP and no dashboard integration warning appears.
- [ ] Confirm security approval prices remain USD and server structured offers remain currency-labeled.

## Verification and delivery status

Frontend implementation and local verification results are recorded below at task completion. Backend persistence and migration remain the backend developer's responsibility. All automated mutation verification uses intercepted fixture responses; no production records were changed.

### Verified locally on 2026-10-26

- Full existing/new Node suite: **25 passed, 0 failed** (`node --experimental-strip-types --test scripts/visitor-pricing.test.cjs scripts/destinations.test.cjs scripts/mascot-model.test.mjs scripts/smooth-scroll.test.mjs`). Pricing-only command: `npm run test:pricing`.
- Real browser fixture suite (rerun on 2026-10-27): **16 scenarios passed, 0 failures, 0 page exceptions**. All four admin POST/PATCH requests were intercepted; no production records were changed. Includes automatic prompting limited to hotel/trip sections through direct links and client navigation, no prompt/flash on home or about pages, compact residence modal with the existing site logo, Arabic/English layout at desktop/390px/320px, no header controls, Tab/Shift+Tab focus containment, mandatory initial choice, saved-choice bypass without a modal flash, footer edit cancellation, cross-tab updates, duplicate-name option IDs across reload, cart repricing, legacy/missing prices, quote contents, blocked storage, and dashboard validation/response acknowledgement.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit` passed.
- ESLint on new and changed pricing files: passed with zero errors. The newly touched Footer retains eight existing Next.js image-optimization warnings for its pre-existing payment logos.
- `npm run build` (default Turbopack production build): passed. A production Webpack build also passed. The repository still emits its existing middleware-to-proxy deprecation notice.
- Independent code review identified two P2 cases: duplicate-name trip selection restoration and reused acknowledgement matches for duplicate nested rows. Both were fixed with failing-then-passing regression tests.

Browser verification requires an available Playwright package and installed Chromium. Run the existing dev server, point `NODE_PATH` to the Playwright package parent when it is not locally installed, optionally set `VISITOR_PRICING_BROWSER_PATH`, and run `node scripts/verify-visitor-pricing.cjs`. `VISITOR_PRICING_BASE_URL` defaults to `http://localhost:3100`. Fixtures are in `scripts/fixtures/visitor-pricing.cjs`; evidence is written to `.superpowers/sdd/2026-10-26-visitor-pricing/`.

The frontend is ready for the agreed API contract. Successful live EGP persistence, pricing backfill, eligibility verification and authoritative booking prices remain pending backend implementation.
