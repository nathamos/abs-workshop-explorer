# ABS Prototype — Project Overview

## What This Is
A research prototype testing four different UX executions of attribute-based shopping (ABS) for a mid-scale hotel. Built to run moderated concept-testing sessions where participants explore each flow one at a time.

## Repository Structure
```
/abs-prototype
  /src
    /data
      rooms.js          ← room types, attributes, base pricing
      attributes.js     ← 12 room attribute definitions + price deltas
      services.js       ← 8 service categories + individual add-ons
    /components
      /shared           ← reused across 2+ flows
        BookingSummary  ← persistent footer / sidebar total
        AttributePill   ← selected attribute chip
        RoomCard        ← base room card used in Flow A + C
        ServiceItem     ← individual add-on row
        StepHeader      ← "Step X of Y / Title / Subtitle" header
    /flows
      /flow-a           ← Filter & Narrow
      /flow-b           ← Build Your Room (unpriced + priced variants)
      /flow-c           ← Room-First / Accordion
      /flow-d           ← Conversational (Wizard of Oz, built last)
    /assets
      /rooms            ← room images dropped in here (see 01-data.md)
  App.jsx               ← routing shell
  index.css             ← design tokens + global styles
```

## Flows Summary
| Route | Flow | Room Selection Model | Add-ons Model |
|---|---|---|---|
| `/flow-a` | Filter & Narrow | Attribute filters → ranked room list | Flat checklist |
| `/flow-b` | Build Your Room | Attribute checklist → matched room | Category navigator |
| `/flow-c` | Room First | Room card accordion | Bundle selector |
| `/flow-d` | Conversational | Scripted Q&A → recommended config | Inline recommendation |

## Shared Booking Context
All flows use the same pre-set booking context (no search UI needed):
- **Property**: The Straits, Singapore (fictional)
- **Dates**: Sat 14 Jun — Tue 17 Jun (3 nights)
- **Guests**: 2 adults
- **Base room rate**: SGD 180/night

## Tech Stack
- React + Vite
- React Router (one route per flow)
- Tailwind CSS (utility classes only, no custom Tailwind config needed)
- Framer Motion (drawer/card animations)
- No backend — all state is local React state

## Build Order
1. Shared data layer (`/data`)
2. Shared components (`/components/shared`)
3. Flow B (Build Your Room) — forces data layer to work properly
4. Flow A (Filter & Narrow) — shares room cards, different interaction
5. Flow C (Room First / Accordion)
6. Flow D (Conversational) — last, after others are tested

## Reference Documents
- `01-data.md` — rooms, attributes, services data
- `02-design-language.md` — visual design system, tokens, component patterns
- `03-flow-a.md` — Filter & Narrow spec
- `04-flow-b.md` — Build Your Room spec
- `05-flow-c.md` — Room First spec
- `06-flow-d.md` — Conversational spec
