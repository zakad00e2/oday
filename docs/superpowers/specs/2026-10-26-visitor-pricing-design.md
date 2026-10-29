# Visitor-based hotel and trip pricing

Date: 2026-10-26
Status: Approved by the user on 2026-10-26; frontend implemented. Backend integration remains pending.

## Intent and agreed requirements

The user wants frontend changes only, plus a backend developer handoff report after implementation. Hotel and trip prices must depend on the visitor category. Administrators enter independent Egyptian pound and US dollar prices, rather than an exchange-rate conversion.

The user explicitly selected a visitor-controlled category persisted between visits:

- Egyptian national or holder of valid Egyptian residency: EGP (updated by user on 2026-10-27).
- Other nationalities without valid Egyptian residency: USD.

This feature extends the existing Next.js/React application and its existing admin dashboard. No new framework, backend service, or visitor login is needed.

## Current behavior

- `lib/currency.ts` formats every price as USD, independently of language.
- Public hotel and trip records expose one numeric price at each pricing level.
- Hotel admin inputs cover starting price, original price, rooms, and room addons.
- Trip admin inputs cover starting price, options, and addons.
- Cart records persist numeric unit prices, selected rooms/options/addons, quantities, and dates in localStorage. The drawer and checkout build WhatsApp booking inquiries from those values.
- Public language layouts share `components/LayoutWrapper.tsx`; admin authentication is separate and supplies no visitor nationality/residence profile.
- Hotel records are cached on the client. Detail route metadata includes USD structured offers.

## Approaches considered

1. **Explicit visitor category, saved locally (chosen by the user).** Works for anonymous visitors and captures both nationality and residence through one clearly worded choice. The category is self-declared; the backend must not treat it as proof of eligibility.
2. **Automatic inference from location or account data.** Would require backend work and cannot establish both nationality and residence from an IP address. The existing app has no relevant visitor account data. Not selected.

The following engineering and interaction details are proposed implementation choices, rather than additional user requirements.

## Visitor experience

- Latest user revision: show a bilingual residence-selection dialog automatically on first hotel/trip section entry after storage hydration, including list/detail URLs and client navigation. Home and unrelated pages do not automatically prompt. Remove all residence/category pricing controls from the header and mobile navigation. A footer button can reopen the dialog for later changes.
- The two labels explain eligibility: Egyptian or valid Egyptian residency holder / other nationalities. The approved compact modal uses category icons without currency badges.
- Save a versioned category value in localStorage. Validate stored values and tolerate blocked storage. Restore after hydration without a server/client markup mismatch. Switching Arabic/English must preserve the category.
- Until a category is selected, keep the residence dialog open; initial Escape or backdrop interactions cannot skip the choice. Use a native modal dialog for keyboard focus containment and background inertness. Do not reopen automatically for a saved valid choice. During a later edit, Escape/cancel keeps the previous choice. Prices remain unresolved until a choice is made.
- Visitors can change their choice. A change immediately updates displayed unit prices, sorting by price where applicable, cart lines, totals, and booking inquiry currency.
- Display EGP as an explicitly labeled Egyptian pound amount, and USD with the existing dollar convention. Preserve meaningful decimals, up to two places, rather than rounding paid amounts to whole units.
- Category selection applies only to hotels/trips and their cart/checkout flow. Security approvals and visa pricing retain their existing USD behavior.

## Independent prices and compatibility

Keep existing API price fields as USD for compatibility, adding EGP fields alongside them:

| Pricing level | Existing USD field | Proposed EGP field |
| --- | --- | --- |
| Hotel starting price | `initial_price` | `initial_price_egp` |
| Hotel original price | `original_price` | `original_price_egp` |
| Hotel room | `price` | `price_egp` |
| Hotel addon | `price` | `price_egp` |
| Trip starting price | `price` | `price_egp` |
| Trip option | `price` | `price_egp` |
| Trip addon | `price` | `price_egp` |

- Extend frontend service response types, normalized records, mutation input types, and FormData serializers consistently. Nested rooms/options/addons continue using the existing JSON collection payloads.
- Existing records with only a legacy price continue to provide USD. Missing EGP is represented as unavailable, never copied from USD, converted using an invented rate, or coerced into a free price.
- Accept valid decimal values, including numeric strings returned by the API. Reject negative, malformed, or non-finite values. Keep absent/null distinct from explicit zero.
- Preserve existing product-specific zero semantics: a zero base/starting price may mean on request; a zero optional addon may mean free. Missing values must never be labeled free.
- Store raw independent price data in shared caches. Resolve the visitor's price when rendering, so a cached record cannot leak the previously selected category's resolved price.
- Only show a crossed-out original hotel price when the same currency has a valid original amount greater than its current amount. Never compare currencies or fabricate an original price.

## Admin experience

- Replace single price entry areas with clearly labeled USD and EGP inputs at every applicable pricing level in both create and edit flows.
- Include both current and original hotel price fields where discounts are supported. Original price stays optional when there is no discount.
- Show both currencies in admin summaries so an administrator can identify incomplete records.
- Require both applicable price values for new or edited priced entries, with clear validation; preserve deliberate zero values where the existing product permits them. Empty inputs are distinct from zero.
- Legacy records load their existing USD price and an empty EGP field. Do not invent EGP amounts in existing or sample data.
- Include the EGP fields in outgoing frontend payloads. The backend may reject or ignore new fields until updated; do not claim backend persistence is implemented. If a successful response does not retain submitted EGP values, show an integration warning rather than claiming the dual prices were saved successfully.

## Cart and booking inquiry behavior

- Persist both independent unit prices for newly added hotel rooms, hotel addons, trip options/addons, and trip starting prices. Keep quantities, identities, and dates.
- Derive the active cart view and totals from the selected category, without destructively replacing the stored USD or EGP values.
- Recalculate immediately when the category changes. Never add EGP and USD values into a single numeric total.
- Legacy saved carts are interpreted as USD-only. For the EGP category they remain visible, with affected lines marked on request until the visitor reselects those items from refreshed catalog data.
- If any required selected line has an unavailable active-currency price, mark the complete total as on request. Do not present a partial sum as the complete booking cost. The WhatsApp inquiry may still be sent as a quote request, explicitly identifying the category, currency, and unpriced lines.
- Allow catalog browsing and quote requests while pricing is unavailable; avoid blocking the existing inquiry-based booking flow unnecessarily.
- Update the existing analytics currency values in hotel/cart/checkout events to match the active amount; omit numeric purchase-like values when the total is incomplete.
- Public server-rendered structured offers must remain truthful. They can advertise the existing explicitly labeled USD offer, but must never relabel a cached USD offer as EGP based on a client preference.

## Backend handoff

Deliver a separate repository document detailing:

- The chosen category rules and frontend persistence behavior.
- Exact proposed field names for each API response and multipart/JSON request, with complete hotel/trip examples.
- Required schema, validation, migration/backfill, and create/update/list/detail changes for the backend developer.
- How to preserve legacy USD data and represent missing EGP during migration.
- Eligibility verification and authoritative repricing belong on the backend when implementing actual bookings/payments; localStorage and submitted prices are untrusted.
- Frontend readiness versus the backend work still required, integration test cases, and observed verification results.

No database migrations, backend endpoints, production data edits, deployments, or messages to the backend developer are part of this task.

## Verification criteria

1. Unit tests cover category selection, decimal parsing/formatting, missing versus zero prices, API normalization/payloads, cart repricing, and incomplete totals.
2. Verify both languages, desktop/mobile selector access, category persistence across reload and language switch, and invalid/blocked localStorage behavior.
3. Browser verification covers hotel/trip detail selection, room/option/addon calculations, switching category with a populated cart, legacy carts, checkout, and WhatsApp inquiry content without sending messages.
4. Browser verification covers admin create/edit inputs, decimal/empty/negative values, nested collections, and outgoing dual-price payloads using local test fixtures or intercepted requests. Do not write test data into production.
5. Run TypeScript checking, relevant existing tests, targeted lint checks, and production build where the local environment permits. Report existing unrelated failures separately.

## Decisions left to implementation

Choose component names, exact selector placement, localStorage keys/versioning, frontend price helper signatures, and test fixtures using existing application conventions. Use the smallest reusable implementation that satisfies these behaviors and keeps the existing visual design.
