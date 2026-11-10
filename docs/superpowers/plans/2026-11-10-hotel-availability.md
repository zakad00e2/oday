# Hotel Availability Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans (inline) or superpowers:subagent-driven-development. Steps use checkbox syntax for tracking.

**Goal:** Deliver dated hotel discovery, server-quoted stays, and the room-type admin calendar on the frontend.

**Architecture:** Use a typed hotel availability client with an explicit rollout flag and an isolated development demo. Search criteria are URL state; quotes are keyed by the exact party, date range, room quantities, upgrades and tariff. Calendar editing is independent of hotel content.

**Tech Stack:** Next.js, React, TypeScript, Tailwind, Node test runner.

**Spec:** [Hotel availability design](../specs/2026-11-10-hotel-availability-design.md); [backend contract](../../../HOTEL_AVAILABILITY_BACKEND_HANDOFF.md).

## Global constraints

- Use Cairo calendar dates, exclusive checkout, 1–30 nights, a 365-night horizon, and 1–20 guests.
- Keep independent EGP and USD tariffs and null on-request prices. Preserve the existing catalog and WhatsApp inquiry.
- Keep production search/calendar disabled until the backend is ready. Local demo uses the same types and never submits a real inquiry.

## Review focus

- A room group must be available on every night; checkout does not consume inventory.
- An older or repriced cart must not send a stale price to checkout.
- Search/results and exact quotes must not regress when a late request finishes.
- Calendar edits must preserve omitted fields and reject stale revisions.
- Regular hotel saves must preserve existing room IDs in calendar mode.

### 1. Availability contract and search

- [x] Test URL criteria, exclusive checkout, invalid dates and the demo's full-stay inventory and pricing.
- [x] Add `lib/hotel-stay.ts` for criteria, date and quote types; `lib/hotel-availability-service.ts` for wire requests; and `lib/hotel-availability-demo.ts` for local fixtures and mutations.
- [x] Add `components/hotels/HotelDiscovery.tsx` to the hotels page. Keep browse before a search, present the applied criteria and matching stays, and carry dates and guests into each detail link.
- [x] Run the availability tests and verify Arabic and English search in the browser.

### 2. Detail quote, plan and inquiry

- [x] Test price changes, missing tariffs and quote identity before implementation.
- [x] Add `HotelStayBooking.tsx` in the existing hotel detail booking slot. Quote the available options and the exact selection using the public service.
- [x] Preserve guest counts and accepted quote on the hotel line. Use quoted subtotals and nights in the plan and checkout; revalidate the exact selection before sending an inquiry. Confirm changes and block unavailable/stale room IDs.
- [x] Run availability and existing cart tests, then verify search → room selection → plan → checkout in the browser.

### 3. Admin calendar and handoff

- [x] Test calendar range edits, partial override clearing and stale revision rejection.
- [x] Add `HotelRoomCalendar.tsx` to the admin hotels UI with date/range editing, stock counts, EGP/USD overrides and revision handling. Retain room IDs on regular saves and add a numeric capacity input.
- [x] Verify calendar saves, closed dates, rate changes and access gating. Run all repo test scripts, TypeScript, changed-file lint and production build.
- [x] Update the backend handoff with the actual frontend status, configuration and staging checks. Commit the feature on the isolated branch.
