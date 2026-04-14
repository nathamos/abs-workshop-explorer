# 03 — Flow A: Filter & Narrow

**Route**: `/flow-a`
**Mental model**: Room-first. Guest starts with the full inventory and narrows it down by expressing preferences as filters. The room is the primary object; attributes are filtering tools.
**Stages**: Room selection → Add-ons (flat checklist) → Confirmation

---

## Stage 1: Room Selection

**Route**: `/flow-a/rooms`

### Layout

Full-width single column. Two sections stacked vertically: filter bar on top, room list below.

### Step Header

```
STEP 1 OF 3
Select your room
Sat 14 Jun — Tue 17 Jun · 2 guests   [right-aligned, same line as step label]
```

### Filter Bar

A contained card (`--color-surface`, `--radius-lg`, padding 20px) sitting above the room list.

Four filter groups, each on its own row with an ALL CAPS label above:

```
BED TYPE     [King bed ✓] [Twin beds] [Double bed]
VIEW         [Courtyard] [City view ✓] [Mountain view] [Marina view]
LOCATION     [High floor] [Quiet wing] [Corner room] [Low floor]
ROOM TYPE    [Private terrace] [Connecting rooms] [Accessible] [Kitchenette]
```

Each option is an `AttributePill`. Multiple selections within a group are allowed (OR logic within group, AND logic across groups). Selected pills show teal border + teal-light background.

Below the filter groups, a sort/meta row:
```
[left] "X rooms · Y match your filters"  [right] Sort by: [Price] [Best match]  — segmented control style
```
"Best match" is default sort. Text: 13px secondary colour.

### Room List

Rooms render as `RoomCard` components in a vertical stack with 12px gap.

**Best match card** (top-ranked room when filters are active):
- Full-width card with teal border (2px)
- "BEST MATCH" label in teal, 11px, caps, above room name
- Match pill strip: "This room has the following selected attributes" (13px secondary) followed by teal pills for each matched attribute
- "X of Y matched" in teal, 13px, bottom-right of card
- "Select →" button (outlined, teal border + text)
- Price: "from SGD XXX / per night" right-aligned

**Other room cards**: Same layout, no teal border, no BEST MATCH label. Still show match pills if partially matching.

**Room card expanded state** (on "Show room details ▾" tap):
Inline expand below the card header — shows full attribute list as small grey pills. No drawer needed here.

**No-match state**: If filters produce 0 results, show a soft message: "No rooms match all your filters. Try removing one." with a "Clear filters" link.

### Interaction Logic

```
On filter pill click:
  → toggle that attribute value in local filter state
  → re-rank rooms: full matches first, then partial (sorted by match count desc), then no-match at bottom
  → update "X rooms · Y match" counter
  → animate room card reorder (layout animation via Framer Motion layoutId)

On "Select" click:
  → store selected room in flow state
  → navigate to /flow-a/services
```

---

## Stage 2: Add-ons

**Route**: `/flow-a/services`

### Layout

Single scrollable column. Context strip at top. All 8 service categories rendered as flat grouped sections — no navigation, everything visible at once.

### Step Header

```
STEP 2 OF 3
Customise your stay
Add services or remove defaults for a credit. Prices are per stay.
```

Context strip (below header):
```
[Selected room name] · 3 nights     SGD [room total]
14–17 Jun · 2 guests
```

### Service Sections

Each category renders as a section with:
- Category label as section heading (16px, weight 600) with a hairline rule below
- Items as `ServiceItem` rows (see design language doc)
- 24px gap between category sections

Render all 8 categories in this order:
1. Food & drink
2. Housekeeping
3. Wellness & leisure
4. Welcome & arrival
5. Experiences & local
6. Connectivity & workspace
7. Family & accessibility
8. Personalised service

### Running Total

Sticky element at bottom of viewport:
```
Room · 3 nights                SGD XXX
[Selected add-ons each as a line if any]
─────────────────────────────────────
Total                          SGD XXX

[Continue to payment ↗]
```

Total updates live on checkbox interaction. Framer Motion key-based animation on total value.

Default-included items start pre-checked. Their price appears as −SGD XX (green/teal). Unchecking them removes that value from the total.

### Interaction Logic

```
On checkbox toggle:
  → update selectedServices in local state
  → recalculate total
  → animate total counter

On "Continue to payment" click:
  → navigate to /flow-a/confirmation
```

---

## Stage 3: Confirmation

**Route**: `/flow-a/confirmation`

### Layout

Simple summary page. No further interaction needed — this is the end state for the research session.

### Content

```
BOOKING CONFIRMED  ← small teal label
Your room is ready to book.  ← h1, font-display

[Booking summary card]
  The Straits, Singapore
  Sat 14 Jun — Tue 17 Jun · 3 nights · 2 guests

  [Room name]
  [Room attributes as pills]

  Services included:
  [List of selected services]

  ─────────────────
  Room (3 nights)    SGD XXX
  [Each service]     SGD XXX
  ─────────────────
  Total              SGD XXX

[Two ghost buttons at bottom]
  "← Back to services"    "Start over"
```

The confirmation page is identical in structure across all flows — only the route prefix changes.
