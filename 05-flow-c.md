# 05 — Flow C: Room First

**Route**: `/flow-c`
**Mental model**: Room-first with in-place personalisation. The guest picks a room they like, then customises it. The room has identity and presence; attributes feel like personalisation options, not a form.
**Stages**: Room selection + personalisation (accordion) → Add-ons (bundle selector) → Confirmation

---

## Stage 1: Room Selection + Personalisation

**Route**: `/flow-c/rooms`

### Step Header

```
STEP 1 OF 3
Choose your room
Select a room, then personalise it to your stay.
```

Booking context bar (below header):
```
CHECK-IN        CHECK-OUT       GUESTS
14 Jun          17 Jun          2 adults
```
Three small pill-style fields in a row, grey bordered, non-interactive (display only).

### Room Card Accordion

Rooms render as a vertical stack of cards with 12px gap.

**Collapsed card state**:
```
[Badge pill — "Standard" / "Popular" / "Great for families" — top-left of image area]
[Room illustration/image — full width, 160px tall, object-fit cover, rounded-t-lg]
[Room name — 18px, weight 600, font-display]
[Tagline — 13px, secondary]
[Expand chevron — right side, animated rotation]
```

**Expanded card state** (only one card expanded at a time):

The card expands in-place to reveal a personalisation panel below the room identity section. Use Framer Motion `AnimatePresence` + `motion.div` height animation.

```
[Same collapsed header — name, tagline, chevron now pointing up]

PERSONALISE THIS ROOM   ← ALL CAPS, 11px, tertiary, section label

Bed type
  [Queen bed ✓] [King bed] [Twin beds]   ← AttributePills

View
  [City view ✓] [Sunrise facing] [Sunset facing]

Location
  [High floor] [Quiet wing ✓] [Garden level]

Extras
  [Bathtub] [Kitchenette]                ← toggles (off by default)

[Select [Room Name] →]                   ← full-width CTA, near-black
```

Each attribute group within the personalisation panel shows only the options relevant/available for that room type (not all 12 attributes — only the customisable ones: bed, view, location, extras). This keeps the panel focused.

Prices are **not shown** in this flow's room selection stage — the emphasis is on picking the right room, not building a price.

**"Selected" state**: After clicking the CTA, that card gets a teal border and a "Selected ✓" green badge (top-right), and the panel collapses. The other cards dim slightly (opacity 0.6).

### Interaction Logic

```
On card tap (collapsed):
  → expand this card
  → collapse any previously expanded card
  → scroll card into view if needed

On attribute pill tap inside expanded card:
  → update that room's local attribute selection
  → no price update (unpriced stage)

On "Select [Room Name]" CTA:
  → mark room as selected
  → collapse card, show Selected badge
  → show "Continue →" button below the stack (or auto-advance after 400ms)
  → navigate to /flow-c/services
```

---

## Stage 2: Add-ons (Bundle Selector)

**Route**: `/flow-c/services`

### Mental model

Rather than individual item selection, this stage presents pre-built bundles named after trip motivations. One bundle (or room-only) can be selected. This is the most opinionated add-on model — deliberately contrasting with Flow A's flat checklist.

### Step Header

```
STEP 2 OF 3
How does your stay sound?
Choose a bundle, or continue with room only.
```

Context strip:
```
[Room name] · 3 nights              SGD XXX
14–17 Jun · 2 guests
```

### Bundle Cards

A scrollable vertical stack of 6 option cards: 1 room-only + 5 bundles.

**Room only card**:
```
Room only
The Straits experience, no extras.
                                    SGD [room total]
[Select]
```

**Bundle cards** (one selected at a time):

```
[Bundle name — 18px, font-display]     SGD [bundle total]
[One-line flavour description]         Save SGD XX vs. individual
[Included items as emoji pills]
  🥐 Breakfast  🌙 Turndown  🚗 Airport transfer  ...
[Select]
```

Bundle definitions:

| Bundle | Name | Included services | Rationale |
|---|---|---|---|
| 1 | Romantic getaway | Daily breakfast, bottle of wine, turndown, occasion setup | Couples, anniversary |
| 2 | Weekend escape | Daily breakfast, late check-out, welcome amenity, spa access | Leisure, relaxation |
| 3 | Work trip | Premium Wi-Fi, desk setup, early check-in, late check-out, F&B credit | Business travel |
| 4 | Family break | Travel cot, baby kit, daily breakfast, extra rollaway bed | Families |
| 5 | City explorer | Cultural walking tour, bike hire, F&B credit, welcome amenity | Active, local |

**Pricing**: Calculate each bundle price by summing the constituent service prices + room total. Show "Save SGD XX" nudge comparing to sum of individual items (build in a modest implied saving of ~10–15%).

**Selected state**: Card gets teal border, "Selected ✓" badge top-right. Previously selected card returns to default state.

### Running Total

Sticky footer:
```
[Bundle name or "Room only"]         SGD XXX
[Continue to payment ↗]
```

Updates instantly on bundle selection change.

### Interaction Logic

```
On bundle card tap:
  → deselect current selection
  → select tapped bundle
  → update footer total

On "Continue to payment":
  → navigate to /flow-c/confirmation
```

---

## Stage 3: Confirmation

**Route**: `/flow-c/confirmation`

Same structure as Flow A confirmation. Bundle items are listed as individual services in the summary — not as a bundle name — so the breakdown reads naturally.
