# Room upgrade quantities implementation plan

**Goal:** Customers allocate a room count to each upgrade; the sum cannot exceed booked rooms (user selected this behavior on 2026-10-28).

**Architecture:** Keep the existing Next.js cart. Persist upgrade IDs and quantities, with legacy quantities defaulting to all booked rooms. Clamp allocations whenever room counts decrease. Calculate each upgrade as unit price × assigned rooms × nights.

**Scope:** Hotel booking controls, cart drawer, checkout summary and booking inquiry text, Arabic and English. No API changes needed; inquiries use the locally saved cart.

- [x] Add failing allocation and pricing regression tests, then implement shared count and pricing helpers.
- [x] Replace single upgrade selection with counters and atomic room/allocation updates; restore all selections and detect changes.
- [x] Use assigned quantities in cart, checkout and WhatsApp inquiry text.
- [x] Run regression tests, TypeScript, scoped lint and browser checks for multiple upgrades, limits, reducing rooms, persistence, legacy carts and both languages.

Review focus: no allocation without rooms; decrementing to zero removes allocations; increasing rooms does not restore trimmed upgrades; switching language preserves quantities; existing saved carts keep their price.

Verification: 15 unit/regression tests passed, TypeScript and scoped ESLint passed, and browser scenarios passed in Arabic and English at desktop and 390px mobile widths. Inquiry-link content was checked without sending a message. No browser runtime errors; external resources emitted three blocked-response console messages per language. Expect MCP tools were unavailable, so browser verification used the bundled Playwright runtime through a shell script. Read-only code review found no remaining actionable issues.
