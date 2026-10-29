# Residence dialog: supplied visual reference

The user asks to make the existing first-entry residence dialog resemble the supplied screenshot. This is a visual revision; eligibility, persistence, initial-choice requirements, footer editing, and keyboard behavior stay unchanged.

## Layout map (5 x 5 grid)

Reference dimensions: approximately 1320 x 1490. Most content sits between x=97 and x=1223 inside an off-white panel bounded by x=49 and x=1270. Estimates below are proportional; the implementation adapts them to a 560px maximum-width dialog.

| Grid row | Occupied regions | Hierarchy and relationship |
| --- | --- | --- |
| 1 (0-20%) | Columns 1-5: illustration frame; navy passport centered over a blue circular accent | Strong illustration establishes travel context; frame uses quiet rounded border |
| 2 (20-40%) | Columns 1-5: lower cropped illustration then centered welcome heading | Image dominates the top; typography becomes the next focal point |
| 3 (40-60%) | Centered two-line gray explanation, generous whitespace and hairline divider; first card begins | Clear separation between explanation and decision |
| 4 (60-80%) | First full-width outlined residence option, then second option begins | Icons on RTL leading/right edge; text in the middle; chevrons on left |
| 5 (80-100%) | Second outlined option and centered policy note | Two equally styled choices, quiet eligibility explanation below |

## Element inventory and design tokens

- Outer panel: off-white approximately `#FCFCFC`, thin `#E2E2E2` border, no strong visible internal shadow, generous rounded corners.
- Hero frame: white `#FFFFFF`, faint `#EEEEEE` border, radius approximately 16px at target scale, wide aspect near 2.5:1, clipped illustration.
- Hero illustration: passport and airplane outlines in navy approximately `#092674`; pale blue circle approximately `#C9E5FA`. Recreate as a repo-owned SVG asset, not a raster screenshot crop.
- Welcome heading: centered, black `#0B0B0B`, heavy Arabic/uppercase Latin branding; target 22-28px depending on viewport.
- Explanation: centered gray `#636363`, readable 14-16px, relaxed line-height; keep hotel and trip pricing scope clear.
- Divider: approximately `#EEEEEE`, spans inner content width.
- Option cards: surface matches panel, thin `#E1E1E1` outline, radius 14-16px, comfortable 14-20px padding; title 16-19px bold, caption 13-15px gray.
- Leading icons: outlined person in sky `#5CA9C8`, outlined globe in gold `#C3A053`; trailing gray chevron. No currency badge in the cards.
- Bottom note: centered gray 12-14px, explaining nationality/residence eligibility and hotel policy.

## Layout architecture

Keep the native dialog and its existing focus/scroll controls. Use a single vertical stack: illustration, centered heading/explanation, separator, two stacked choice buttons, note. Maximum width 560px; mobile width viewport minus 32px. Maintain scrollability within viewport on short screens and remove dominant shadow from the inner panel. The hero is decorative context but has a descriptive image label for verification/accessibility.

At 390px, use compact padding and a roughly 130px illustration; at desktop use approximately 190px illustration. The text must wrap without clipping at 320px and in both Arabic and English. Only later edits display a close control, positioned over the illustration in its own small surface.

## Interaction map

- Updated by the user on 2026-10-27: Egyptian nationals or foreign nationals holding valid Egyptian residency select EGP; other nationalities select USD. Retain the historical category identifiers for saved-choice compatibility.
- Use the supplied category labels and descriptions; the introduction says “للحصول على الأسعار، يُرجى اختيار فئة التسعير.” so it applies to hotels and trips.
- Initial dialog remains mandatory within hotel/trip list and detail routes only; home and unrelated pages do not prompt automatically. Later footer editing can cancel.
- Preserve native background inertness, explicit Tab/Shift+Tab wrapping, storage hydration gate, and no header controls.

## Verification

Watch the new image/welcome browser assertion fail before implementing. Then verify both language layouts at desktop, 390px, and 320px; image/card geometry and wrapping; keyboard behavior and the existing pricing/admin regression scenarios. Run TypeScript, targeted lint and a production build for the revised component/asset.

## Approved compact revision

The visitor requested a smaller modal with the existing site logo instead of the passport illustration. The revised dialog has a 440px maximum width, a 96px mobile / 112px desktop logo area, and the existing `/optimized/logo.webp` asset. Spacing, headings and cards are smaller while preserving wrapping, keyboard access, both category choices and saved preferences. Browser geometry checks cover the logo, maximum width, desktop height below 550px and narrow-screen overflow in both languages.
