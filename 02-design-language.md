# 02 — Design Language

This document defines the visual system for all four flows. All flows share these tokens and patterns to ensure consistency across the prototype. The aesthetic is deliberately white-label: warm-neutral, clean, and hospitality-appropriate without being branded.

---

## Aesthetic Direction

**Tone**: Calm, premium-adjacent, understated. Not a budget booking engine, not a luxury hotel. Think mid-scale hospitality done thoughtfully — closer to a well-designed fintech product than a legacy OTA.

**Not**: Purple gradients, heavy drop shadows, garish CTAs, generic sans-serif, or anything that reads as generic SaaS.

**Reference feel from screenshots**: Off-white background, rounded cards, generous padding, subtle hairline dividers, teal/green accent for selections and positive values, amber for default/warning tags, green text for negative price values (credits).

---

## Colour Tokens

Define these as CSS variables in `index.css` and reference throughout:

```css
:root {
  /* Backgrounds */
  --color-bg:           #F5F3EE;   /* warm off-white page background */
  --color-surface:      #FFFFFF;   /* card / panel backgrounds */
  --color-surface-alt:  #F0EDE7;   /* subtle inset / context strip */

  /* Text */
  --color-text-primary:   #1A1A1A;  /* headings, primary labels */
  --color-text-secondary: #6B6560;  /* subtitles, descriptions */
  --color-text-tertiary:  #9E9890;  /* captions, metadata */

  /* Accent — selection / active state */
  --color-teal:         #2D7D6F;   /* selected pills, active borders, CTAs */
  --color-teal-light:   #E8F4F1;   /* selected pill background */
  --color-teal-border:  #2D7D6F;   /* selected card border */

  /* Semantic */
  --color-positive:     #2D7D6F;   /* credit / negative price (−SGD) */
  --color-addprice:     #1A1A1A;   /* add-on price (+SGD) */
  --color-amber:        #D97706;   /* "Default included" tag text */
  --color-amber-bg:     #FEF3C7;   /* "Default included" tag background */
  --color-green-tag:    #2D7D6F;   /* "Popular" tag text */
  --color-green-tag-bg: #E8F4F1;   /* "Popular" tag background */

  /* Borders */
  --color-border:       #E5E1D8;   /* card borders, dividers */
  --color-border-focus: #2D7D6F;   /* selected card border */

  /* Danger */
  --color-danger:       #DC2626;   /* conflict warnings */
  --color-danger-light: #FEF2F2;
}
```

---

## Typography

```css
/* Import in index.css */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600&display=swap');

:root {
  --font-display: 'DM Serif Display', Georgia, serif;  /* page titles, room names */
  --font-body:    'DM Sans', system-ui, sans-serif;    /* everything else */
}
```

**Usage rules:**
- Page titles (`h1`): `font-display`, 28–32px, normal weight
- Section headings (`h2`): `font-body`, 18–20px, weight 600
- Attribute group labels: `font-body`, 11px, weight 500, ALL CAPS, letter-spacing 0.08em, `--color-text-tertiary`
- Body / descriptions: `font-body`, 14px, weight 400, `--color-text-secondary`
- Price labels: `font-body`, 14–16px, weight 600
- Step label ("STEP 2 OF 4"): `font-body`, 11px, weight 500, ALL CAPS, letter-spacing 0.08em, `--color-text-tertiary`

---

## Spacing & Layout

- Page max-width: **800px**, centred, `padding: 0 24px`
- Card padding: **20px 24px**
- Section gap (between cards/groups): **16px**
- Inline element gap (pill row): **8px**
- Divider between list items: 1px solid `--color-border`

---

## Border Radius

```css
:root {
  --radius-sm:   6px;   /* tags, small pills */
  --radius-md:   12px;  /* input fields, small cards */
  --radius-lg:   16px;  /* main cards, panels */
  --radius-xl:   24px;  /* total pill, floating elements */
  --radius-full: 9999px; /* attribute selection pills */
}
```

---

## Core Components

### Attribute Pill (selection chip)

Two states: unselected and selected.

```
Unselected: white bg, --color-border border, --color-text-primary text
Selected:   --color-teal-light bg, --color-teal border (1.5px), --color-teal text, optional checkmark prefix
```

Size: `padding: 8px 14px`, `border-radius: var(--radius-full)`, `font-size: 14px`, `font-weight: 500`

Emoji prefix where defined in attribute data — e.g. "🛏️ King bed"

### Tag / Badge

Three variants:

```
"Default included" — amber: bg --color-amber-bg, text --color-amber, font 12px weight 500
"Popular"          — teal:  bg --color-green-tag-bg, text --color-green-tag, font 12px weight 500
"Included"         — grey:  bg #F0EDE7, text --color-text-tertiary, font 12px weight 500
"Best match"       — teal text, font 11px weight 600, ALL CAPS, letter-spacing 0.06em
```

### Step Header

```
STEP X OF Y         ← 11px, caps, tertiary colour
[Page title]        ← font-display or font-body 600, 28px
[Subtitle]          ← 14px, secondary colour
```

Booking context strip below (where applicable):
```
[Room name] · [N nights]    [total price]
[dates] · [N guests]
```
Style: `--color-surface-alt` background, `border-radius: var(--radius-md)`, padding 16px.

### Booking Summary Footer / Sidebar

Persistent element showing running total. Two layout modes used across flows:

**Sticky footer** (used in mobile-width flows): full-width bar pinned to bottom, shows "Room · 3 nights: SGD XXX" and "Total: SGD XXX" with CTA button.

**Sidebar card** (used in split-screen Flow B): right-column card with itemised breakdown — base rate line, included items, each selected add-on as a line, grand total.

CTA button style: full-width, `background: --color-text-primary` (near-black), white text, `border-radius: var(--radius-md)`, `padding: 16px`, `font-weight: 600`, `font-size: 16px`. Label: "Continue to payment ↗"

### Room Card (base)

Used in Flow A (list) and Flow C (accordion base):

```
Layout: horizontal — image left (80×80px, rounded-md), content right
Content: room name (16px, weight 600), tagline (13px, secondary), match pills if applicable
Price: "from SGD XXX / per night" right-aligned, "Select" button below
Selected state: teal border, "Selected" green pill badge top-right
```

### Service Item Row

Used in add-on screens across all flows:

```
Layout: [checkbox] [emoji icon 40×40 rounded-md bg] [name + description] [price right-aligned]
Checkbox: custom styled — unchecked: border --color-border; checked: teal bg with white checkmark
Name: 15px weight 500
Description: 13px, secondary colour, max 2 lines
Price: 14px weight 600, right-aligned
  — Positive add-on: "+SGD XX" in --color-addprice
  — Default credit: "−SGD XX" in --color-positive (teal/green)
  — Included: "Included" in --color-text-tertiary
Tags appear below description, inline
```

---

## Motion

Use Framer Motion for:
- **Drawer / panel open**: `y: 20 → 0`, `opacity: 0 → 1`, duration 0.25s, ease "easeOut"
- **Card expand (accordion)**: animate `height` from 0 to auto using `AnimatePresence` + `motion.div`
- **Pill selection**: `scale: 0.97 → 1` on click, 0.1s
- **Total counter update**: subtle number change — wrap in `motion.span` with `key={total}` to trigger re-mount animation
- **Page transition between steps**: `x: 30 → 0`, `opacity: 0 → 1`, 0.2s

Keep motion subtle. This is a research prototype — interactions should feel considered, not showy.

---

## Shared Layout Shell

Every flow page wraps in a consistent shell:

```jsx
<div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
  <div className="max-w-[800px] mx-auto px-6 py-8">
    {/* StepHeader */}
    {/* Flow-specific content */}
    {/* BookingSummary footer */}
  </div>
</div>
```

---

## White-label Discipline

- No hotel logo or branding anywhere
- Property name "The Straits" appears only in the booking context strip
- No flags, nationality references, or culturally specific imagery in UI chrome
- Room images should be clean, neutral-palette renders — no people
- Avoid any colour or treatment that reads as a specific brand (no Booking.com blue, no Marriott red)
