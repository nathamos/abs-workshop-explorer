# Figma Design System Rules
_For use by Claude when implementing Figma designs into this codebase._

---

## Stack

- **React 18** with JSX (no TypeScript)
- **React Router DOM 6** — nested routes, `useOutletContext()` for state
- **Tailwind CSS 3** — utility classes for layout/spacing only
- **Framer Motion 11** — all animations
- **Vite 5** — build tool

---

## 1. Design Tokens

All tokens are CSS custom properties defined in `src/index.css` `:root`. Always reference these variables — never hardcode hex values or raw numbers.

### Colors
```css
/* Backgrounds */
--color-bg: #F5F3EE          /* page background — warm beige */
--color-surface: #FFFFFF      /* card / container */
--color-surface-alt: #F0EDE7  /* secondary surface */

/* Text */
--color-text-primary: #1A1A1A
--color-text-secondary: #6B6560
--color-text-tertiary: #9E9890

/* Brand accent */
--color-teal: #2D7D6F
--color-teal-light: #E8F4F1
--color-teal-border: #2D7D6F

/* State colors */
--color-positive: #2D7D6F
--color-amber: #D97706
--color-amber-bg: #FEF3C7
--color-danger: #DC2626
--color-danger-light: #FEF2F2

/* Tags */
--color-green-tag: #2D7D6F
--color-green-tag-bg: #E8F4F1

/* Borders */
--color-border: #E5E1D8
--color-border-focus: #2D7D6F
```

### Typography
```css
--font-display: 'DM Serif Display', Georgia, serif   /* headings only */
--font-body: 'DM Sans', system-ui, sans-serif        /* all body text */
```

Use `fontFamily: 'var(--font-display)'` inline for headings, or set via Tailwind `font-` utilities against the body default. Body font is set globally on `<body>`.

### Border Radius
```css
--radius-sm: 6px
--radius-md: 12px
--radius-lg: 16px
--radius-xl: 24px
--radius-full: 9999px   /* pills */
```

---

## 2. Styling Approach

**Pattern:** Tailwind for layout/spacing + inline `style` objects for token-based visual properties.

```jsx
// Correct — layout via Tailwind, visuals via CSS vars
<div
  className="flex items-center gap-3 px-4 py-3"
  style={{
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid var(--color-border)',
  }}
>

// Wrong — hardcoded values
<div className="bg-white rounded-xl border border-gray-200 flex items-center gap-3 px-4 py-3">
```

**Do not** extend `tailwind.config.js` with custom tokens — the CSS custom property system is the source of truth.

**No CSS modules.** No styled-components. No scoped styles. Everything is either Tailwind utilities or inline styles using the token variables.

---

## 3. Component Library

Located in `src/components/shared/`. When implementing a Figma design, check here first before creating anything new.

### `AttributePill`
Selectable pill for room attribute choices (bed type, view, floor, etc.).
```jsx
<AttributePill
  label="King bed"
  emoji="🛏️"
  selected={true}
  onClick={() => {}}
  priceDelta={0}        // optional — shows "+$X" if non-zero
  showPrice={false}     // toggles price delta display
/>
```

### `RoomCard`
Full room display with image, match score, expandable details.
```jsx
<RoomCard
  room={roomObject}
  selected={false}
  onSelect={() => {}}
  matchCount={3}
  totalFilters={5}
  bestMatch={true}
  showDetails={false}
  onToggleDetails={() => {}}
  matchedAttributes={[]}
  altPrice={null}
/>
```

### `Tag`
Badge component. Variants: `default` | `popular` | `included` | `best-match` | `selected` | `badge`
```jsx
<Tag variant="popular">Popular</Tag>
```

### `StepHeader`
Step progress header shown at the top of each flow step.
```jsx
<StepHeader
  step={1}
  totalSteps={3}
  title="Select Your Room"
  subtitle="Optional subtitle"
  rightContent={<SomeButton />}   // optional
/>
```

### `ServiceItem`
Selectable add-on with checkbox, quantity controls, price.
```jsx
<ServiceItem
  item={serviceObject}
  checked={false}
  onChange={() => {}}
  quantity={1}
  onQuantityChange={() => {}}
/>
```

### `BookingSummary`
Fixed bottom bar with price total and CTA. Always positioned `fixed bottom-0`.
```jsx
<BookingSummary
  roomName="Classic Room"
  nights={3}
  roomTotal={540}
  selectedServices={[]}
  total={540}
  onContinue={() => {}}
  ctaLabel="Continue to payment ↗"
/>
```

### `ContextStrip`
Lightweight info bar summarising the booking context.
```jsx
<ContextStrip
  roomName="Classic Room"
  nights={3}
  totalPrice={540}
  dates="Jun 14–17"
  guests={2}
/>
```

---

## 4. Layout Conventions

All flow pages use this wrapper:
```jsx
<div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
  <div className="max-w-[800px] mx-auto px-6 py-8">
    {/* content */}
  </div>
</div>
```

- Max content width: **800px**, centered
- Horizontal padding: `px-6` (24px)
- Vertical padding: `py-8` (32px) at page level; `gap-4` or `gap-3` between cards

When `BookingSummary` is present, add `pb-32` to the page wrapper to avoid content being hidden behind the fixed bar.

---

## 5. Animation

Use **Framer Motion** for all transitions. Never use CSS transitions or keyframe animations.

```jsx
import { motion, AnimatePresence } from 'framer-motion'

// Card entry
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -8 }}
  transition={{ duration: 0.2 }}
>

// Tap feedback on interactive elements
<motion.button whileTap={{ scale: 0.97 }}>

// List of items that add/remove
<AnimatePresence>
  {items.map(item => (
    <motion.div key={item.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
  ))}
</AnimatePresence>
```

---

## 6. Icons & Imagery

**Icons:** Unicode emoji only — no icon library. Emojis are stored in data files (`src/data/attributes.js`, `src/data/services.js`) as `emoji` properties and passed as props.

**Room images:** Referenced as `/assets/rooms/{room-id}.jpg`. The assets directory is currently empty — components display a `🏨` emoji fallback when `room.image` is falsy.

```jsx
{room.image
  ? <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
  : <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
}
```

---

## 7. Data Shapes

When implementing new components, match these existing data structures.

### Room object (`src/data/rooms.js`)
```js
{
  id: 'classic-room',
  name: 'Classic Room',
  badge: 'Most popular',
  tagline: '...',
  description: '...',
  image: '/assets/rooms/classic-room.jpg',
  basePricePerNight: 180,
  size: 32,
  attributes: {
    bedding: 'king',
    pillows: 'standard',
    floor: 'mid',
    view: 'courtyard',
    balcony: false,
    bathroom: 'shower',
    livingArea: false,
    miniBar: false,
    coffeeMachine: true,
    kitchen: false,
    smoking: false,
    accessibility: false,
  }
}
```

### Service item (`src/data/services.js`)
```js
{
  id: 'breakfast',
  name: 'Breakfast credit',
  description: 'SGD 35 per person per day',
  emoji: '🥐',
  price: 70,
  priceLabel: '/night',
  tag: 'popular',        // 'popular' | 'included' | null
  defaultIncluded: false,
  quantifiable: true,
}
```

### Booking context (`src/data/bookingContext.js`)
```js
{
  property: 'The Straits',
  location: 'Singapore',
  checkIn: '2025-06-14',
  checkOut: '2025-06-17',
  nights: 3,
  guests: 2,
  baseRate: 180,
  currency: 'SGD',
}
```

---

## 8. Flow State Pattern

Each flow uses React Router nested routes. The Index component owns state and shares it via `<Outlet context={...} />`.

```jsx
// FlowXIndex.jsx
export default function FlowXIndex() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])

  return <Outlet context={{ selectedRoom, setSelectedRoom, selectedServices, setSelectedServices }} />
}

// Child step component
export default function FlowXRooms() {
  const { selectedRoom, setSelectedRoom } = useOutletContext()
  // ...
}
```

---

## 9. Figma → Code Checklist

When translating a Figma frame to code:

1. **Colors** — map every Figma color to the nearest `--color-*` variable; never hardcode
2. **Typography** — headings use `--font-display`, everything else uses `--font-body`
3. **Spacing** — use Tailwind spacing scale (`gap-3`, `px-4`, `py-2`, etc.)
4. **Radius** — use `--radius-*` variables; never use Tailwind `rounded-*` for token-based radius
5. **Components** — check `src/components/shared/` before building new ones
6. **Animations** — use Framer Motion; match existing motion patterns (0.2s, y:8 entry)
7. **Layout** — stay within the 800px max-width centered wrapper
8. **State** — add new state to the flow's Index component, pass via Outlet context
