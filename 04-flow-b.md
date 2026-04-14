# 04 — Flow B: Build Your Room

**Route**: `/flow-b`
**Mental model**: Attribute-first. The guest composes their ideal room from scratch by selecting individual attributes. The room is a *result* of their choices, not the starting point.
**Stages**: Attribute selection → Add-ons (category navigator) → Confirmation

**This flow ships in two variants controlled by a single prop/env flag:**
- `PRICED=false` — Artefact 2a: attributes shown, no prices visible anywhere in Stage 1
- `PRICED=true` — Artefact 2b: each attribute shows its SGD delta; booking card becomes itemised bill

Both variants use identical components. The `priced` boolean is passed as context/prop and gates price rendering.

---

## Stage 1: Room Selection (Build Your Room)

**Route**: `/flow-b/rooms`

### Layout

**Split-screen**, side by side at ≥ 768px:
- **Left column** (55% width): scrollable attribute checklist
- **Right column** (45% width): sticky booking card

### Step Header (left column, above checklist)

```
STEP 1 OF 3
Build your room
Choose the attributes that matter to you.
```

### Left Column — Attribute Checklist

Attributes are grouped into 4 logical sections, each with an ALL CAPS group label:

**YOUR BED**
- Bed type (King / Twin / Double)

**YOUR ROOM**
- Room type (Standard / Superior / Deluxe)
- Floor (Low / Mid / High) — show sublabels "Floors 1–5" etc.
- View (Courtyard / City view / Marina view)
- Balcony (No balcony / Balcony)
- Bathroom (Standard shower / Bathtub + shower)
- Kitchen (None / Kitchenette)

**YOUR STAY**
- Guests (1 guest / 2 guests)
- Facilities (Room only / Pool + Gym)
- Laundry (None / Daily laundry)

**ROOM REQUIREMENTS**
- Smoking (Non-smoking / Smoking)
- Accessibility (Standard / Accessible)
- Connecting room (Not required / Required)

Each attribute renders as a labelled row:
```
[Group label — ALL CAPS, 11px, tertiary]
[Attribute label — 14px, weight 500]
[Pill options in a wrapping flex row]
  (PRICED variant only: price delta appears inside or below pill — "+SGD 20" in secondary colour, or "Included" in tertiary)
```

One option per attribute must be selected at all times (radio behaviour, not toggleable to null). Default selections on page load:
- Bed type: King
- Room type: Standard
- Floor: Low
- View: Courtyard
- All others: base/cheaper option

### Right Column — Booking Card

Sticky card that follows the user as they scroll the checklist.

**Header**:
```
Your room
[Matched room name — updates live]     ← font-display, 18px
[Room tagline]                         ← 13px, secondary
[Room image — 100% width, rounded-md, 140px tall]
```

**UNPRICED variant (2a)**:

Below the image, show current selections as a list of attribute pills grouped loosely:
```
Selected attributes:
[King bed] [City view] [High floor] [Balcony] ...
```

Then a conflict alert zone — only visible when a conflict exists:
```
⚠ Conflict detected
[Attribute A] and [Attribute B] aren't available together.
[Remove King bed ×]  [Remove Balcony ×]
```
Conflict rows render in `--color-danger-light` background with `--color-danger` text and border.

CTA at bottom of card:
```
[Book this room →]   ← full-width, near-black bg, white text
```

**PRICED variant (2b)**:

Replace the pill list with an itemised price breakdown:
```
Base rate (3 nights)        SGD 540
─────────────────────────────
Superior room               +SGD 60
High floor                  +SGD 90
City view                   +SGD 60
Balcony                     +SGD 75
─────────────────────────────
Room total                  SGD 825

[Book this room →]
```
Each line item is a row: label left, price right. Base rate and total in weight 600. Add-on lines in weight 400, secondary colour for label, primary for price. "Included" items (no delta) are not shown as line items.

The total animates on change (Framer Motion key).

### Conflict Detection Logic

A conflict exists when the guest selects a combination of attributes that no room in the inventory can satisfy. Examples:
- "Accessible" + "High floor" (accessible room is always low floor)
- "Connecting" + "Balcony" (no connecting room has a balcony)
- "Kitchenette" + "Twin beds" (kitchenette is only available in deluxe single-bed configs)

Define a `conflicts` array in `attributes.js`:
```js
export const conflicts = [
  { attributes: ["accessibility:true", "floor:high"], message: "Accessible rooms are on low floors only." },
  { attributes: ["connecting:true", "balcony:true"], message: "Connecting rooms don't include a balcony." },
  { attributes: ["kitchen:true", "bedding:twin"], message: "Kitchenette is only available with a king or double bed." },
]
```

On each selection change, check the current selection object against all conflict rules. If a conflict is found, render the conflict alert in the booking card and disable the "Book this room" CTA until resolved.

### Interaction Logic

```
On attribute pill click:
  → update selectedAttributes in state
  → find best-matching room (most attribute matches)
  → check for conflicts
  → update booking card (room name, image, price breakdown if priced)

On "Book this room" click (no conflicts):
  → store selectedAttributes + matched room in flow state
  → navigate to /flow-b/services
```

---

## Stage 2: Add-ons (Category Navigator)

**Route**: `/flow-b/services`

### Layout

Full-width single column. A category list serves as the home screen; tapping a category navigates to a dedicated screen. A persistent total pill sits in the top bar.

### Home Screen

```
STEP 2 OF 3
Enhance your stay
Add services, or opt out of defaults for a credit.

[Context strip: Room name · 3 nights    SGD XXX]

[Category list — 8 rows]
Each row:
  [Emoji icon, 48×48, rounded-lg, surface-alt bg]  [Category name — 15px weight 500]
                                                    [Category description — 13px secondary]
  [chevron right]
  [Counter badge — appears once ≥1 item selected in category]

[Dividers between rows]

[Running total bar at bottom]
  Room · 3 nights     SGD XXX
  Total               SGD XXX
  [Continue to payment ↗]
```

Counter badge style: small teal circle, white number, 18×18px, positioned top-right of emoji icon.

### Category Detail Screen

On tap of a category row, render a new screen (push navigation):

```
← Back    [Category name]    [Total pill — taps to show full breakdown]

[Items as ServiceItem rows — same as Flow A Stage 2]

[Done button at bottom — returns to category home]
```

The "Total pill" in the top bar shows running grand total and is always tappable to reveal a bottom drawer with full itemised breakdown.

### Bottom Drawer — Full Bill

Triggered by tapping the total pill. Slides up from bottom (Framer Motion `y` animation):

```
[Drag handle]

Order summary

Room · 3 nights                    SGD XXX
[Each selected service]            SGD XXX
[Default credits as negative]     −SGD XX
───────────────────────────────────────────
Total                              SGD XXX

[Close]
```

### Interaction Logic

```
On category row tap:
  → navigate to category detail screen

On ServiceItem checkbox toggle:
  → update selectedServices in state
  → update total pill
  → update counter badge on category

On total pill tap:
  → open bill breakdown drawer

On "Continue to payment":
  → navigate to /flow-b/confirmation
```

---

## Stage 3: Confirmation

**Route**: `/flow-b/confirmation`

Same structure as Flow A confirmation (see `03-flow-a.md`). The selected attribute list is shown as pills under the room name rather than just the room tagline.
