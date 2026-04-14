# 06 — Flow D: Conversational (Wizard of Oz)

**Route**: `/flow-d`
**Mental model**: The guest answers a handful of natural questions about their trip. The system infers a recommended room configuration and add-on bundle, presented as a single curated recommendation. Guest can accept, tweak, or restart.
**Stages**: Conversation (scripted Q&A) → Recommendation → Confirmation

**Build last.** This flow is the most different architecturally. The Wizard of Oz approach means responses are pre-scripted based on a decision tree — no AI API required unless you choose to use it later.

---

## Stage 1: Conversation

**Route**: `/flow-d/chat`

### Layout

Full-width chat interface. Messages appear in a scrollable conversation thread. No traditional step header — the experience should feel like a messaging app, not a booking form.

### Visual Treatment

```
Background: --color-bg (warm off-white)
Chat bubbles:
  — System / assistant messages: white card, left-aligned, max-width 75%, rounded-xl (flat on top-left)
  — User responses: teal-light bg, right-aligned, max-width 65%, rounded-xl (flat on top-right)
  — Emoji/avatar: small "✦" glyph or neutral geometric shape left of system bubbles (no branded logo)
```

Top bar (fixed):
```
← Start over    [property name: The Straits]    [Total pill — hidden until recommendation shown]
```

### Script: 5 Questions

Questions appear sequentially. The next question appears ~600ms after the user selects an answer. All answers are button-based (no free text), appearing below each system message as a row of response pills. Once an answer is selected, the pills collapse and the selected answer appears as a user bubble.

---

**Q1: Purpose of trip**

> "Welcome to The Straits. Let's find the right room for your stay. What's bringing you to Singapore?"

Options:
- 💼 Work trip
- 💑 Romantic getaway
- 🧳 Leisure & exploring
- 👨‍👩‍👧 Family holiday

---

**Q2: Who's travelling**

> "And are you travelling solo, or with someone?"

Options:
- 🙋 Just me
- 👫 With a partner
- 👨‍👩‍👧 With family
- 👥 With colleagues

*(Note: Q1 answer may pre-empt this — e.g. "Family holiday" auto-advances with family assumption. Handle in decision tree.)*

---

**Q3: View preference**

> "How important is a view to you?"

Options:
- 🌊 Very — I want something special
- 🏙️ Nice to have, but not essential
- 🛏️ Not bothered — I'm here to sleep

---

**Q4: Stay style**

> "How do you like to stay?"

Options:
- 🧘 Relaxed — I want everything taken care of
- 🗺️ Active — I'm out most of the day
- 💻 Productive — I need a good workspace
- 🎉 Celebratory — it's a special occasion

---

**Q5: Budget feel**

> "Last one. How are you thinking about spend for this trip?"

Options:
- 💰 Keep it lean — just the essentials
- ⚖️ Balanced — some treats are fine
- ✨ Go for it — make it memorable

---

### Decision Tree → Recommendation Mapping

Map the 5 answers to one of 3 guest profiles. These profiles correspond to pre-built recommendations.

```
Profile A — "The Business Traveller"
  Triggers: Q1=Work OR Q4=Productive
  Room: Superior Room (king, high floor, city view)
  Bundle: Work trip bundle
  Intro message: "You need a room that works as hard as you do."

Profile B — "The Leisure Couple"
  Triggers: Q1=Romantic OR (Q2=Partner AND Q3=Very important)
  Room: Deluxe Balcony Room (king, high floor, marina view, balcony)
  Bundle: Romantic getaway OR Weekend escape (based on Q5)
  Intro message: "Something special deserves the right backdrop."

Profile C — "The Explorer"
  Triggers: Q1=Leisure OR Q4=Active (and not Profile A/B)
  Room: Superior Room (king, mid floor, city view)
  Bundle: City explorer bundle
  Intro message: "You're here for the city. Let's set you up well."

Profile D — "The Family"
  Triggers: Q1=Family OR Q2=Family
  Room: Family Room (twin + connecting)
  Bundle: Family break bundle
  Intro message: "Room for everyone, and a little extra ease built in."

Default fallback → Profile C
```

Priority order for matching: Family > Business > Couple > Explorer.

---

## Stage 2: Recommendation

**Route**: `/flow-d/recommendation`

Transitions from the chat thread — the recommendation card slides up as a new panel or appears as a final system message that expands.

### Layout

A prominent recommendation card, full-width, followed by option to tweak or accept.

### Recommendation Card

```
[System message bubble]
"Based on what you've told me, here's what I'd suggest."

[Card — white, rounded-xl, padding 24px, subtle shadow]

  YOUR RECOMMENDED STAY    ← 11px, caps, teal

  [Room name]              ← font-display, 22px
  [Room tagline]           ← 13px, secondary
  [Room image — full width, 180px, rounded-lg]

  WHY THIS ROOM
  [2–3 sentence rationale referencing their answers]
    e.g. "High floor for the views you wanted, king bed for comfort,
    and a bathtub to wind down after your days out."

  WHAT'S INCLUDED
  [Service emoji pills for each bundle item]
    🥐 Daily breakfast  🍷 Bottle of wine  🌙 Turndown  🎉 Occasion setup

  ─────────────────────────────────
  Room · 3 nights                SGD XXX
  [Bundle name]                  SGD XXX
  ─────────────────────────────────
  Total                          SGD XXX

[Accept this recommendation →]   ← full-width CTA, near-black

[See other options]              ← ghost button / text link below
```

### "See other options" — Tweak Panel

A bottom drawer that slides up showing the full room list and bundle list (simplified versions from Flow A and C respectively). Guest can swap room or bundle, then close the drawer to return to the recommendation view with updates applied.

This is optional complexity — if build time is tight, replace with a simple "← Start over" link.

### Interaction Logic

```
On chat answer selection:
  → render user bubble
  → 600ms delay
  → render next system question + answer pills
  → on Q5 answered: 800ms delay → navigate to /flow-d/recommendation

On "Accept this recommendation":
  → navigate to /flow-d/confirmation

On "See other options":
  → open tweak drawer

On "← Start over":
  → clear state
  → navigate to /flow-d/chat
```

---

## Stage 3: Confirmation

**Route**: `/flow-d/confirmation`

Same structure as other flows. The "how we got here" flavour message is preserved — a small line under the room name referencing the recommendation context:

```
Recommended based on your answers · 3 nights · 2 guests
```
