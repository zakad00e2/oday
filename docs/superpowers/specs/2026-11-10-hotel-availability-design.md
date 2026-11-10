# Hotel availability and nightly pricing

Status: proposal for review. Room-type calendars are confirmed; the defaults and API below are proposed for the first release.

## Outcome

A guest can choose a destination, check-in and checkout dates, and a party size on `/ar/hotels` or `/en/hotels`. Search lists hotels only when a group of rooms can accommodate the party and stay available for every night. An admin can open or close nights and set a different rate for any room type. The guest carries the same dates and party into the hotel page, the plan, and the existing WhatsApp inquiry.

The user will implement the frontend. [The backend handoff](../../../HOTEL_AVAILABILITY_BACKEND_HANDOFF.md) specifies the proposed service contract, migration, and acceptance cases. Confirm the contract with the backend developer before connecting the production UI. This release does not confirm reservations, hold rooms, take payments, or define age-based child rates.

## Approaches

- **One calendar per hotel:** fewer fields for the admin, but a sold-out double room would be treated the same as an available suite. A hotel-wide rate would also obscure the price of the room a guest can use.
- **One calendar per room type (selected):** matches the existing room capacity and base-price model. Each type can have different stock and nightly rates, and the system can combine types when the group needs more than one room. This requires stable room IDs and server-side availability calculation.

## Guest experience

The reference image places destination, stay dates, party size, and a search action in one row. Use that order in Arabic and mirror it in English. On small screens stack the controls and keep the submit action in view. Use the site's visual language. The image's blue banner and yellow border describe the reference, not required brand colors.

Reuse the existing destination catalog. Require a destination, both dates, and at least one adult; default to two adults and no children. Children count toward room capacity like adults in this release. Guests do not have to choose a room count in the search form. The results explain how many rooms the recommended option uses and display the total for the whole stay in the current visitor tariff. The last day is checkout, so it has no price and needs no stock. A missing tariff displays “عند الطلب” / “On request”; it does not turn a physically available stay into an empty result.

Keep the existing destination browse available before search and after clearing it. Give a submitted search a shareable URL. Editing the form does not change the displayed criteria until submit. Show distinct loading, empty, and error states; retry failures without silently substituting the regular hotel catalog for available results. The hotel detail route carries the dates and guest counts; a direct visit without dates can still browse the hotel and must request availability before adding a dated stay to the plan.

Details loads the available room types and a recommended combination. Guests may change rooms, quantities, dates, party size, or upgrades; refresh the quote for each valid changed selection. The hotel line in the plan retains its own party and dates so edits to the shared party controls for trips do not change a hotel quote implicitly. The plan and checkout use the server quote, rather than multiplying the old catalog rate by the number of nights. Before sending a WhatsApp inquiry, recheck the exact selection. If availability was lost, direct the guest back to choose rooms; if the price changed, show the new total and require confirmation. A stay can be quoted “On request” if inventory is available but a price is missing. An API failure is a separate state and does not confirm availability.

Treat a saved hotel line without a dated quote as unverified. If the dates, party and stable selection IDs are known, fetch a new exact quote and ask the guest to confirm it. If any required information is missing, or IDs cannot be resolved, return the guest to hotel details to update the selection. Do not automatically substitute other rooms or carry forward the old total.

## Admin experience

Add a calendar section to `/admin/hotels` for saved room types. Add an explicit maximum occupancy field per room type; the current admin infers capacity from descriptions and may silently use two. Preserve room IDs when saving content and send an explicit list for deletions. Show dates as open with a unit count or closed, and distinguish base rates from overrides for each currency. Admins can apply changes to a single night or a range, including closing nights and clearing overrides. Keep dates, inventory, and prices in a calendar save flow separate from saving hotel content. Warn about unsaved changes on room/month switches, preserve the draft on write errors, and reload the current revision on a conflict.

## Release boundaries

An unconfigured night is closed for dated search. Do not seed availability from hotel descriptions or assume the number of physical rooms. Keep ordinary listing/detail routes working for existing hotels, and enable the new production search only after the backend is deployed and participating hotels have configured their calendars. Verify stable room IDs during ordinary hotel edits before enabling the admin calendar. The frontend can develop against fixtures that follow the handoff contract; fixtures are local only.

Use the existing EGP and USD tariffs and never convert between them. No decision about storage framework, query engine, or internal allocation algorithm is required on the frontend. The backend owns authoritative stock and price calculations; the frontend owns presentation, validation feedback, and inquiry wording.
