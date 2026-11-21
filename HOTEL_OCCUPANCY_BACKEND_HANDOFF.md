# Hotel room occupancy: backend handoff

## Status and scope

The frontend has fields for room occupancy limits and sends child ages with availability requests. **The existing backend must store these fields and apply them to search, calendar and quotes.** Until then, the live system cannot be relied on to filter by age or save these limits. The local demo still uses its existing total-guest capacity rules; it does not simulate age-based allocation.

## Room data contract

For each room, accept and return these integer fields in hotel create/update `rooms` entries and all hotel responses that include rooms:

```json
{
  "capacity": "4",
  "adult_capacity": 2,
  "child_capacity": 2,
  "children_under_3_capacity": 1,
  "children_3_to_5_capacity": 2,
  "children_6_to_12_capacity": 2
}
```

`capacity` remains the existing total number of guests per room. The other values are independent maxima, not a sum of reserved slots. Apply the total child limit as well as each age-band limit, adult limit and overall limit. All values are non-negative integers; adult capacity is at least 1. Adult and child capacities cannot exceed total capacity; each age-band limit cannot exceed child capacity. Preserve these fields on partial updates where omitted, including `rooms_write_mode=by_id`, and return them after saving. Existing rooms need a migration or explicit configuration; do not silently interpret missing values as zero. The frontend warns if a save response does not confirm the entered values.

Age bands are non-overlapping: 0–2, 3–5, and 6–12 inclusive. Age 12 remains included because the current guest selector explicitly allows 12. Confirm this boundary with the product owner if hotel policy instead requires strictly under 12.

## Availability requests

- `GET /hotel/search`: `child_ages` is a comma-separated list, e.g. `adults=2&children=2&child_ages=2,7`.
- `GET /hotel/{hotelId}/stay-calendar`: same `child_ages` query parameter.
- `POST /hotel/{hotelId}/stay-quote`: `child_ages` is an integer array, e.g. `{"adults":2,"children":2,"child_ages":[2,7],"check_in":"2026-12-01","check_out":"2026-12-03"}`. Existing selection fields and visitor category are unchanged.

Validate that the array contains exactly `children` integers between 0 and 12. Zero children permits an omitted or empty list. Search must filter before pagination and count results accordingly. Allocate guests across the available room units, considering the capacity limits and available inventory for every night. Quote recommendations and explicit room selections must use the same allocation rules as search; reject impossible selections. Calendar prices and availability must use the same party criteria. Revalidate all of these on checkout, including child ages, and avoid treating a quote for different ages as equivalent.

Example: one room with the limits above accepts 2 adults and children aged 2 and 7; it rejects two children aged 2 because the under-3 limit is one. Two suitable rooms may accommodate a party that does not fit one room. Availability counts must respect nightly inventory rather than just summing room-type capacities.

## Integration checks

1. Create a room, edit all five limits, reload, and verify values survive. Verify a partial content or calendar update does not erase them.
2. Exercise ages 0, 2, 3, 5, 6 and 12, plus invalid 13 and mismatched age counts. Test zero-child rooms and zero limits.
3. Compare search, calendar and quote for single- and multi-room allocations, unavailable nights, and explicit invalid room selections. Verify pagination totals after filtering.
4. Confirm checkout revalidation uses the same ages and capacities, and pricing policy handles ages if pricing depends on them. This frontend change does not implement child-age pricing.
