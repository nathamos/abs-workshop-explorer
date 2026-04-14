# 07 — Repo Setup & Routing

This document is the first thing to action in Claude Code. It covers scaffolding the repo, installing dependencies, and wiring up the routing shell before any flow-specific work begins.

---

## Initialise the Project

```bash
npm create vite@latest abs-prototype -- --template react
cd abs-prototype
npm install
npm install react-router-dom framer-motion
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Tailwind Config

In `tailwind.config.js`:

```js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [],
}
```

In `src/index.css`, replace contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

/* All CSS variables from 02-design-language.md go here */
:root {
  --color-bg:             #F5F3EE;
  --color-surface:        #FFFFFF;
  --color-surface-alt:    #F0EDE7;
  --color-text-primary:   #1A1A1A;
  --color-text-secondary: #6B6560;
  --color-text-tertiary:  #9E9890;
  --color-teal:           #2D7D6F;
  --color-teal-light:     #E8F4F1;
  --color-teal-border:    #2D7D6F;
  --color-positive:       #2D7D6F;
  --color-addprice:       #1A1A1A;
  --color-amber:          #D97706;
  --color-amber-bg:       #FEF3C7;
  --color-green-tag:      #2D7D6F;
  --color-green-tag-bg:   #E8F4F1;
  --color-border:         #E5E1D8;
  --color-border-focus:   #2D7D6F;
  --color-danger:         #DC2626;
  --color-danger-light:   #FEF2F2;

  --font-display: 'DM Serif Display', Georgia, serif;
  --font-body:    'DM Sans', system-ui, sans-serif;

  --radius-sm:   6px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;
}

body {
  font-family: var(--font-body);
  background-color: var(--color-bg);
  color: var(--color-text-primary);
  -webkit-font-smoothing: antialiased;
}
```

---

## App.jsx — Routing Shell

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Flow A
import FlowAIndex from './flows/flow-a/FlowAIndex'
import FlowARooms from './flows/flow-a/Rooms'
import FlowAServices from './flows/flow-a/Services'
import FlowAConfirmation from './flows/flow-a/Confirmation'

// Flow B
import FlowBIndex from './flows/flow-b/FlowBIndex'
import FlowBRooms from './flows/flow-b/Rooms'
import FlowBServices from './flows/flow-b/Services'
import FlowBConfirmation from './flows/flow-b/Confirmation'

// Flow C
import FlowCIndex from './flows/flow-c/FlowCIndex'
import FlowCRooms from './flows/flow-c/Rooms'
import FlowCServices from './flows/flow-c/Services'
import FlowCConfirmation from './flows/flow-c/Confirmation'

// Flow D
import FlowDIndex from './flows/flow-d/FlowDIndex'
import FlowDChat from './flows/flow-d/Chat'
import FlowDRecommendation from './flows/flow-d/Recommendation'
import FlowDConfirmation from './flows/flow-d/Confirmation'

// Home
import Home from './Home'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Flow A */}
        <Route path="/flow-a" element={<FlowAIndex />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowARooms />} />
          <Route path="services" element={<FlowAServices />} />
          <Route path="confirmation" element={<FlowAConfirmation />} />
        </Route>

        {/* Flow B — unpriced */}
        <Route path="/flow-b" element={<FlowBIndex priced={false} />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowBRooms priced={false} />} />
          <Route path="services" element={<FlowBServices />} />
          <Route path="confirmation" element={<FlowBConfirmation />} />
        </Route>

        {/* Flow B — priced variant */}
        <Route path="/flow-b-priced" element={<FlowBIndex priced={true} />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowBRooms priced={true} />} />
          <Route path="services" element={<FlowBServices />} />
          <Route path="confirmation" element={<FlowBConfirmation />} />
        </Route>

        {/* Flow C */}
        <Route path="/flow-c" element={<FlowCIndex />}>
          <Route index element={<Navigate to="rooms" replace />} />
          <Route path="rooms" element={<FlowCRooms />} />
          <Route path="services" element={<FlowCServices />} />
          <Route path="confirmation" element={<FlowCConfirmation />} />
        </Route>

        {/* Flow D */}
        <Route path="/flow-d" element={<FlowDIndex />}>
          <Route index element={<Navigate to="chat" replace />} />
          <Route path="chat" element={<FlowDChat />} />
          <Route path="recommendation" element={<FlowDRecommendation />} />
          <Route path="confirmation" element={<FlowDConfirmation />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
```

Note: Flow B priced variant lives at `/flow-b-priced` so both variants can be accessed independently in research sessions.

---

## Home.jsx — Research Index Page

A simple landing page at `/` listing all flows with a brief description. Used by the researcher to navigate between flows during sessions. Not shown to participants directly.

```jsx
// Simple list of links:
// / → Flow A: Filter & Narrow
// /flow-b → Flow B: Build Your Room (unpriced)
// /flow-b-priced → Flow B: Build Your Room (priced)
// /flow-c → Flow C: Room First
// /flow-d → Flow D: Conversational
```

Style it simply — white card, the flow name as a link, one-line description. No need for anything elaborate.

---

## Shared State Pattern

Each flow manages its own state locally. Use React `useState` within each flow's index component, pass down as props or via a simple context. No global state manager needed.

Minimum shared state shape per flow:

```js
{
  selectedRoom: null,           // room object from rooms.js
  selectedAttributes: {},       // { attributeId: optionValue }
  selectedServices: [],         // array of service item ids
  totalPrice: 0,                // calculated, not stored
}
```

`totalPrice` should always be derived (calculated on render) from `selectedRoom`, `selectedAttributes`, and `selectedServices` rather than stored in state to avoid sync issues.

---

## File / Folder Structure to Create

```
src/
  data/
    bookingContext.js
    rooms.js
    attributes.js
    services.js
  components/
    shared/
      AttributePill.jsx
      RoomCard.jsx
      ServiceItem.jsx
      StepHeader.jsx
      BookingSummary.jsx
      ContextStrip.jsx
      Tag.jsx
  flows/
    flow-a/
      FlowAIndex.jsx
      Rooms.jsx
      Services.jsx
      Confirmation.jsx
    flow-b/
      FlowBIndex.jsx
      Rooms.jsx
      Services.jsx
      Confirmation.jsx
    flow-c/
      FlowCIndex.jsx
      Rooms.jsx
      Services.jsx
      Confirmation.jsx
    flow-d/
      FlowDIndex.jsx
      Chat.jsx
      Recommendation.jsx
      Confirmation.jsx
  assets/
    rooms/
      (images dropped in here)
  Home.jsx
  App.jsx
  main.jsx
  index.css
```

---

## Build Order for Claude Code Sessions

1. **Session 1**: Scaffolding + data layer
   - Init project, install deps, configure Tailwind
   - Create all files in `/src/data/`
   - Create routing shell `App.jsx` + `Home.jsx`

2. **Session 2**: Shared components
   - `AttributePill`, `Tag`, `StepHeader`, `ContextStrip`
   - `RoomCard`, `ServiceItem`
   - `BookingSummary` (footer variant)

3. **Session 3**: Flow B rooms screen
   - Split-screen layout
   - Attribute checklist + pill selection
   - Booking card with live room matching
   - Conflict detection
   - Priced / unpriced toggle

4. **Session 4**: Flow B services screen
   - Category navigator home
   - Category detail screen
   - Bottom drawer bill breakdown

5. **Session 5**: Flow A
   - Filter bar + pill selection
   - Room list with match ranking + animation
   - Flat checklist services screen

6. **Session 6**: Flow C
   - Accordion room cards
   - In-card personalisation panel
   - Bundle selector services screen

7. **Session 7**: Flow D (last)
   - Chat interface + message bubbles
   - Answer pills + sequential reveal
   - Decision tree logic
   - Recommendation card
```
