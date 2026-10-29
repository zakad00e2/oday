# Visitor Pricing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Implement independent EGP/USD hotel and trip pricing controlled by a persisted visitor category, including admin forms and backend handoff.

**Architecture:** Extend existing USD records with optional EGP counterparts, preserving API compatibility. A client visitor context resolves active prices and formats them without changing security approval pricing. Cart snapshots retain both independent prices and derive active views at render time.

**Tech Stack:** Existing Next.js 16, React 19, TypeScript, Tailwind, Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-26-visitor-pricing-design.md` (approved by user on 2026-10-26).

## Global Constraints

- Frontend only; no production data writes, backend changes, deployments, or messages.
- Egyptian national or holder of valid Egyptian residency = EGP; other nationalities without valid Egyptian residency = USD (user's 2026-10-27 update).
- Missing prices remain unavailable; never convert or copy amounts between currencies.
- Keep security approval pricing in USD.
- Test using local fixtures/intercepted requests; preserve existing visual conventions.

## Review Focus

- A saved EGP choice must survive hydration/reload and locale navigation without a USD flash.
- Missing selected addon prices must propagate to an incomplete total instead of free or partial cost.
- A category switch with a saved cart must retain original independent prices and selection quantities.
- Existing backend responses may ignore EGP fields; admin must not claim successful dual-price persistence.
- Currency switching must not alter visa/security approval prices or public structured-data currency labels.

### Task 1: Pricing primitives and regression tests

**Files:** Create `lib/visitor-pricing.ts`, `scripts/visitor-pricing.test.cjs`; modify `lib/currency.ts`, `package.json`.
**Interfaces:** `VisitorCategory = "egyptian-resident" | "other"`; `PricingCurrency = "EGP" | "USD"`; `PricePair = { USD: number | null; EGP: number | null }`; `parsePrice(value: unknown): number | null`; `resolveVisitorPrice(usd, egp, currency): number` returns NaN when unavailable; `formatPrice(value, lang, currency = "USD")`.

- [x] Write tests for category mapping/validation, null/empty/negative/zero/decimal parsing, unavailable amounts, and currency formatting preserving decimals.
- [x] Run `node --test scripts/visitor-pricing.test.cjs`; expect red for missing implementation.
- [x] Implement helpers and run the same command; expect all assertions passing.

### Task 2: API records and outgoing dual-price payloads

**Files:** Modify `lib/hotel-service.ts`, `lib/trip-service.ts`, `lib/trips-types.ts`; extend pricing regression tests.
**Interfaces:** Hotel record/mutation `initialPriceEgp`, `originalPriceEgp`; nested room/addon and trip option/addon `priceEgp`; trip record `startingPriceEgp`; API snake_case fields as specified in the design.

- [x] Test mocked list/detail mapping with decimals, missing EGP and zero; test multipart mutations and nested JSON `price_egp` fields. Watch tests fail.
- [x] Extend response types, normalizers, input types, serializers, and mutation converters. Include EGP in trip deduplication keys.
- [x] Run pricing tests plus `npm run test:destinations`; expect green.

### Task 3: Visitor selector and public prices

**Files:** Create `lib/visitor-pricing-context.tsx`, `components/VisitorResidenceDialog.tsx`; modify public shell/navbar, hotel listing/detail, and trip detail/hero/options components.
**Interfaces:** `useVisitorPricing()` provides category, currency, setters, resolvePrice, and active-currency formatting wrappers. Provider lives outside CartProvider.

- [x] Add storage tests for malformed values and browser scenarios for unset category, saved choice and language switch.
- [x] Implement bilingual automatic native residence dialog after storage hydration, footer edit/cancel controls, and public price resolution from raw cached records. Do not put residence controls in the header.
- [x] Preserve original USD records; pass raw independent prices into cart snapshots. Keep missing and zero distinguishable in public UI.
- [x] Verify TypeScript and targeted browser fixtures with both currencies; expected accurate price/sort/display and no hydration issues.

### Task 4: Cart, checkout and booking inquiries

**Files:** Modify `lib/cart-context.tsx`, `lib/cart-pricing.ts`, `lib/cart-hotel.ts`, `components/CartDrawer.tsx`, `components/cart/CartHotelSummaryCard.tsx`, `components/checkout/CheckoutPageClient.tsx`; extend pure pricing tests.
**Interfaces:** Optional `prices: PricePair` on every cart priced unit; `resolveCartPrices` derives active values and treats legacy prices as USD-only. Incomplete totals remain unavailable rather than summing known lines.

- [x] Test switching EGP/USD repeatedly, legacy carts, quantities/nights, unavailable selected addon, and free addon. Watch red.
- [x] Implement raw persisted snapshots plus resolved cart views and consistent unavailable display/inquiry text. Include visitor category/currency in inquiries. Correct analytics currency and omit incomplete numeric values.
- [x] Run pricing tests and verify cart/checkout in the browser without sending WhatsApp messages.

### Task 5: Dashboard dual price entry

**Files:** Modify `app/admin/hotels/page.tsx`, `app/admin/trips/page.tsx`; create a reusable `components/admin/DualPriceInputs.tsx` if helpful.
**Interfaces:** Admin form EGP fields align with Task 2, empty fields distinct from zero; create/edit carry both prices through all nested collection paths.

- [x] Browser checks cover main/nested create/edit fields, decimals, missing/negative values and intercepted payloads.
- [x] Add labeled USD/EGP inputs for main, original and nested prices; summaries show both. Preserve legacy blank EGP values and validate before submission.
- [x] Compare saved response prices with submitted EGP values and warn if backend did not retain them.
- [x] Run targeted lint/TypeScript and browser checks; expect valid dual-price payloads with no production mutations.

### Task 6: Handoff and whole-flow verification

**Files:** Create `VISITOR_PRICING_BACKEND_HANDOFF.md`; update plan progress and spec approval status.

- [x] Document exact API/schema fields, complete multipart/nested examples, migration/validation and backend authority, readiness and integration checklist.
- [x] Run pricing and existing relevant tests, TypeScript, lint, build and browser verification; record actual results and limitations.
- [x] Request a fresh independent review of the full change, fix material findings, rerun relevant checks, and leave all work reviewable locally.

## Execution ledger

- User approved the design and implementation; execute continuously in this chat using the native inline workflow. No additional approval checkpoint is needed for the implementation plan.
- Prefer one final commit if the user requests committing; keep implementation changes reviewable in the working tree otherwise.

## Completion evidence

- Frontend implementation and backend handoff completed.
- All 25 existing/new Node tests passed.
- Real-browser fixture verification: 13 scenarios passed, zero failures/exceptions, no production writes.
- TypeScript and targeted ESLint passed.
- Independent review found two P2 issues; both fixed with RED-to-GREEN regressions (selection IDs and one-to-one EGP acknowledgement).
- Changes remain uncommitted on `codex/visitor-pricing` for review.
- Default `npm run build` passed; production Webpack build also passed.
- Full evidence and exact backend integration examples are in `VISITOR_PRICING_BACKEND_HANDOFF.md`.

## User revision: automatic first-entry residence dialog

The user explicitly requested an immediate residence choice when entering the site and no header button. Preserve the existing category rules and saved preference.

- [x] Browser RED: expect an automatic native dialog, no header selector/control, required initial selection, saved-choice bypass, and footer edit/cancel behavior in both languages/mobile.
- [x] Add hydration readiness and edit-dialog controls to the visitor context; replace the selector component with a native modal rendered once in the public shell.
- [x] Remove all pricing UI from desktop/mobile Navbar and restore its original breakpoints. Add a residence edit button in Footer.
- [x] Run browser regression suite, TypeScript, targeted ESLint, and production build. Update backend handoff wording; the API contract remains unchanged.

Residence revision completion: 14/14 browser scenarios pass, 0 failures/exceptions; 25/25 Node tests pass; TypeScript and production build pass. Header is restored to its original implementation. Dialog/context lint clean; Footer retains its existing image warnings.

## User revision: match supplied modal design

Reference blueprint: `docs/superpowers/specs/2026-10-26-residence-dialog-reference.md`.

- [ ] Browser RED for welcome title and passport/airplane illustration.
- [ ] Create a repo SVG illustration; update modal markup to illustration, centered heading/copy, divider, outlined user/globe choice cards with chevrons, policy caption. Preserve existing dialog behavior and eligibility.
- [ ] Verify desktop/390px/320px bilingual geometry and existing browser regression suite; TypeScript, targeted lint and production build.
