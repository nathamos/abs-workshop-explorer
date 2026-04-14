# 01 — Shared Data Layer

All three data files live in `/src/data/`. Every flow imports from here — nothing is hardcoded inside a flow.

---

## Booking Context (`/src/data/bookingContext.js`)

```js
export const bookingContext = {
  property: "The Straits",
  location: "Singapore",
  checkIn: "2025-06-14",
  checkOut: "2025-06-17",
  nights: 3,
  guests: 2,
  baseRatePerNight: 180,
}
```

---

## Room Types (`/src/data/rooms.js`)

Five room types. Each has a fixed set of attribute values — this is what the filter/match logic compares against guest selections.

Images live in `/src/assets/rooms/`. Filenames are referenced below — drop in matching files when ready. Suggested style: clean CGI-style room renders or high-quality photography, consistent warm-neutral palette.

```js
export const rooms = [
  {
    id: "standard-city",
    name: "Classic Room",
    badge: null,
    tagline: "King bed · City-facing · 26 m²",
    description: "A well-appointed room with city views and a king bed. Clean, comfortable, and everything you need.",
    image: "/assets/rooms/classic-room.jpg",
    basePricePerNight: 180,
    size: 26,
    attributes: {
      roomCategory: "standard",
      occupancy: 2,
      bedding: "king",
      floor: "mid",
      view: "city",
      balcony: false,
      bathroom: "shower",
      kitchen: false,
      facilityAccess: "room-only",
      laundry: false,
      smoking: false,
      accessibility: false,
      connecting: false,
    },
  },
  {
    id: "superior-marina",
    name: "Superior Room",
    badge: "Popular",
    tagline: "King bed · Marina-facing · 30 m²",
    description: "A spacious superior room with sweeping marina views and a king bed. The most-booked room at The Straits.",
    image: "/assets/rooms/superior-room.jpg",
    basePricePerNight: 200,
    size: 30,
    attributes: {
      roomCategory: "superior",
      occupancy: 2,
      bedding: "king",
      floor: "high",
      view: "marina",
      balcony: false,
      bathroom: "shower",
      kitchen: false,
      facilityAccess: "room-only",
      laundry: false,
      smoking: false,
      accessibility: false,
      connecting: false,
    },
  },
  {
    id: "deluxe-balcony",
    name: "Deluxe Balcony Room",
    badge: null,
    tagline: "King bed · Marina view · Balcony · 34 m²",
    description: "A generous deluxe room with a private balcony overlooking the marina. Perfect for watching the sunset.",
    image: "/assets/rooms/deluxe-balcony.jpg",
    basePricePerNight: 245,
    size: 34,
    attributes: {
      roomCategory: "deluxe",
      occupancy: 2,
      bedding: "king",
      floor: "high",
      view: "marina",
      balcony: true,
      bathroom: "bathtub",
      kitchen: false,
      facilityAccess: "room-only",
      laundry: false,
      smoking: false,
      accessibility: false,
      connecting: false,
    },
  },
  {
    id: "family-connecting",
    name: "Family Room",
    badge: "Great for families",
    tagline: "Twin beds + connecting · City-facing · 42 m²",
    description: "Two interconnecting rooms with twin beds, ideal for families travelling with children.",
    image: "/assets/rooms/family-room.jpg",
    basePricePerNight: 265,
    size: 42,
    attributes: {
      roomCategory: "deluxe",
      occupancy: 4,
      bedding: "twin",
      floor: "mid",
      view: "city",
      balcony: false,
      bathroom: "bathtub",
      kitchen: false,
      facilityAccess: "room-only",
      laundry: false,
      smoking: false,
      accessibility: false,
      connecting: true,
    },
  },
  {
    id: "accessible-standard",
    name: "Accessible Room",
    badge: null,
    tagline: "King bed · Courtyard · Accessible · 30 m²",
    description: "Fully accessible room on a low floor with wide doorways, roll-in shower, and ground-level access.",
    image: "/assets/rooms/accessible-room.jpg",
    basePricePerNight: 180,
    size: 30,
    attributes: {
      roomCategory: "standard",
      occupancy: 2,
      bedding: "king",
      floor: "low",
      view: "courtyard",
      balcony: false,
      bathroom: "shower",
      kitchen: false,
      facilityAccess: "room-only",
      laundry: false,
      smoking: false,
      accessibility: true,
      connecting: false,
    },
  },
]
```

---

## Room Attributes (`/src/data/attributes.js`)

12 attributes. Each has an `id`, display `label`, `type` (select or toggle), `options` array, and `priceDelta` per option. Options with `priceDelta: 0` are included; positive values are add-ons; `null` means the attribute is a constraint/eligibility selector with no price implication.

```js
export const attributes = [
  {
    id: "roomCategory",
    label: "Room type",
    type: "select",
    options: [
      { value: "standard",  label: "Standard",  priceDelta: 0 },
      { value: "superior",  label: "Superior",  priceDelta: 20 },
      { value: "deluxe",    label: "Deluxe",    priceDelta: 45 },
    ],
  },
  {
    id: "occupancy",
    label: "Guests",
    type: "select",
    options: [
      { value: 1, label: "1 guest",  priceDelta: 0 },
      { value: 2, label: "2 guests", priceDelta: 15 },
    ],
  },
  {
    id: "bedding",
    label: "Bed type",
    emoji: "🛏",
    type: "select",
    options: [
      { value: "king",   label: "King bed",      emoji: "🛏️",  priceDelta: 0 },
      { value: "twin",   label: "Twin beds",     emoji: "🛏🛏", priceDelta: 0 },
      { value: "double", label: "Double bed",    emoji: "🛏️",  priceDelta: 0 },
    ],
  },
  {
    id: "floor",
    label: "Floor",
    emoji: "🏢",
    type: "select",
    options: [
      { value: "low",  label: "Low floor",  sublabel: "Floors 1–5",   priceDelta: 0 },
      { value: "mid",  label: "Mid floor",  sublabel: "Floors 6–12",  priceDelta: 15 },
      { value: "high", label: "High floor", sublabel: "Floors 13–20", priceDelta: 30 },
    ],
  },
  {
    id: "view",
    label: "View",
    emoji: "👁",
    type: "select",
    options: [
      { value: "courtyard", label: "Courtyard",   emoji: "🌿", priceDelta: 0 },
      { value: "city",      label: "City view",   emoji: "🏙️", priceDelta: 20 },
      { value: "marina",    label: "Marina view", emoji: "🌊", priceDelta: 40 },
    ],
  },
  {
    id: "balcony",
    label: "Balcony",
    emoji: "🌅",
    type: "toggle",
    options: [
      { value: false, label: "No balcony", priceDelta: 0 },
      { value: true,  label: "Balcony",    priceDelta: 25 },
    ],
  },
  {
    id: "bathroom",
    label: "Bathroom",
    emoji: "🛁",
    type: "select",
    options: [
      { value: "shower",  label: "Standard shower",   priceDelta: 0 },
      { value: "bathtub", label: "Bathtub + shower",  priceDelta: 20 },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen",
    emoji: "🍳",
    type: "toggle",
    options: [
      { value: false, label: "No kitchenette", priceDelta: 0 },
      { value: true,  label: "Kitchenette",    priceDelta: 30 },
    ],
  },
  {
    id: "facilityAccess",
    label: "Facilities",
    emoji: "🏊",
    type: "select",
    options: [
      { value: "room-only", label: "Room only",        priceDelta: 0 },
      { value: "pool-gym",  label: "Pool + Gym access", priceDelta: 22 },
    ],
  },
  {
    id: "laundry",
    label: "Laundry",
    emoji: "👕",
    type: "toggle",
    options: [
      { value: false, label: "No laundry",          priceDelta: 0 },
      { value: true,  label: "Daily laundry service", priceDelta: 28 },
    ],
  },
  {
    id: "smoking",
    label: "Smoking",
    type: "toggle",
    options: [
      { value: false, label: "Non-smoking", priceDelta: null },
      { value: true,  label: "Smoking",     priceDelta: null },
    ],
  },
  {
    id: "accessibility",
    label: "Accessibility",
    type: "toggle",
    options: [
      { value: false, label: "Standard room",    priceDelta: null },
      { value: true,  label: "Accessible room",  priceDelta: null },
    ],
  },
]
```

---

## Services & Add-ons (`/src/data/services.js`)

8 categories, ~24 individual items. Each item has: `id`, `name`, `description`, `emoji`, `price` (SGD, per stay unless noted), `priceLabel`, optional `tag` ("default" | "popular" | "included" | null), and `defaultIncluded` boolean.

Items marked `defaultIncluded: true` appear pre-checked with an amber "Default included" tag and a negative price (opting out gives a credit). Items marked `tag: "included"` are complimentary — locked, greyed out, no price interaction.

```js
export const serviceCategories = [
  {
    id: "food-drink",
    label: "Food & drink",
    description: "Breakfast, dining vouchers, room service",
    emoji: "🍽️",
    items: [
      {
        id: "daily-breakfast",
        name: "Daily breakfast",
        description: "Continental spread for 2 guests each morning. Uncheck to remove and receive a credit.",
        emoji: "🥐",
        price: 56,
        priceLabel: "-SGD 56",
        tag: "default",
        defaultIncluded: true,
      },
      {
        id: "fnb-credit",
        name: "F&B credit — SGD 50",
        description: "Spend at the restaurant or on in-room dining.",
        emoji: "🍴",
        price: 50,
        priceLabel: "+SGD 50",
        tag: "popular",
        defaultIncluded: false,
      },
      {
        id: "breakfast-in-bed",
        name: "Breakfast in bed",
        description: "One morning of your choice, delivered to your room.",
        emoji: "☕",
        price: 22,
        priceLabel: "+SGD 22",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "housekeeping",
    label: "Housekeeping",
    description: "Daily service, turndown, laundry",
    emoji: "🛎️",
    items: [
      {
        id: "daily-housekeeping",
        name: "Daily room service",
        description: "Full clean, fresh towels and linen each day. Uncheck to remove and receive a credit.",
        emoji: "🛎️",
        price: 15,
        priceLabel: "-SGD 15",
        tag: "default",
        defaultIncluded: true,
      },
      {
        id: "turndown",
        name: "Turndown service",
        description: "Evening preparation of your room, all 3 nights.",
        emoji: "🌙",
        price: 18,
        priceLabel: "+SGD 18",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "express-laundry",
        name: "Express laundry",
        description: "Same-day return for up to 5 garments.",
        emoji: "👜",
        price: 28,
        priceLabel: "+SGD 28",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "wellness",
    label: "Wellness & leisure",
    description: "Spa, gym, personal training",
    emoji: "🧘",
    items: [
      {
        id: "spa-access",
        name: "Spa access — 2 guests",
        description: "Full access for both guests for the entire stay.",
        emoji: "🐯",
        price: 65,
        priceLabel: "+SGD 65",
        tag: "popular",
        defaultIncluded: false,
      },
      {
        id: "personal-training",
        name: "Personal training session",
        description: "1-hour session with a certified trainer.",
        emoji: "🏋️",
        price: 75,
        priceLabel: "+SGD 75",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "gym-access",
        name: "Gym access",
        description: "Daily access for both guests — complimentary.",
        emoji: "💪",
        price: 0,
        priceLabel: "Included",
        tag: "included",
        defaultIncluded: true,
      },
    ],
  },
  {
    id: "welcome-arrival",
    label: "Welcome & arrival",
    description: "Flowers, wine, occasion setup",
    emoji: "💐",
    items: [
      {
        id: "welcome-amenity",
        name: "Welcome amenity",
        description: "Seasonal fruit and a cold drink waiting in your room.",
        emoji: "🍓",
        price: 18,
        priceLabel: "+SGD 18",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "bottle-wine",
        name: "Bottle of wine",
        description: "A selected local or international bottle on arrival.",
        emoji: "🍷",
        price: 45,
        priceLabel: "+SGD 45",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "occasion-setup",
        name: "Occasion setup",
        description: "Flowers, balloons, and personalised message for a special event.",
        emoji: "🎉",
        price: 68,
        priceLabel: "+SGD 68",
        tag: "popular",
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "experiences",
    label: "Experiences & local",
    description: "Guides, bike hire, cultural activities",
    emoji: "🚲",
    items: [
      {
        id: "bike-hire",
        name: "Bike hire — 1 day",
        description: "Explore the city at your own pace. Two bikes included.",
        emoji: "🚴",
        price: 30,
        priceLabel: "+SGD 30",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "cultural-tour",
        name: "Cultural walking tour",
        description: "A 2-hour guided tour of Chinatown and the civic district.",
        emoji: "🗺️",
        price: 55,
        priceLabel: "+SGD 55",
        tag: "popular",
        defaultIncluded: false,
      },
      {
        id: "cooking-class",
        name: "Hawker cooking class",
        description: "Learn to cook two Singaporean dishes with a local chef.",
        emoji: "🍜",
        price: 85,
        priceLabel: "+SGD 85",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "connectivity",
    label: "Connectivity & workspace",
    description: "Enhanced Wi-Fi, desk setup, meeting room",
    emoji: "💼",
    items: [
      {
        id: "premium-wifi",
        name: "Premium Wi-Fi",
        description: "High-speed fibre connection, ideal for video calls and large file transfers.",
        emoji: "📶",
        price: 12,
        priceLabel: "+SGD 12",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "desk-setup",
        name: "Ergonomic desk setup",
        description: "External monitor, keyboard, and mouse added to your room.",
        emoji: "🖥️",
        price: 35,
        priceLabel: "+SGD 35",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "meeting-room",
        name: "Meeting room — half day",
        description: "Private meeting room for up to 4 people, with AV and refreshments.",
        emoji: "📋",
        price: 120,
        priceLabel: "+SGD 120",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "family",
    label: "Family & accessibility",
    description: "Cot, extra bed, baby kit, accessibility",
    emoji: "👶",
    items: [
      {
        id: "cot",
        name: "Travel cot",
        description: "A cot with fresh linen, set up before you arrive.",
        emoji: "🍼",
        price: 20,
        priceLabel: "+SGD 20",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "extra-bed",
        name: "Extra rollaway bed",
        description: "A comfortable rollaway for an additional guest.",
        emoji: "🛏️",
        price: 35,
        priceLabel: "+SGD 35",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "baby-kit",
        name: "Baby amenity kit",
        description: "Bottle warmer, baby bath products, and changing mat.",
        emoji: "🧸",
        price: 15,
        priceLabel: "+SGD 15",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
  {
    id: "personalised",
    label: "Personalised service",
    description: "Butler, private car, in-room chef",
    emoji: "🤵",
    items: [
      {
        id: "airport-transfer",
        name: "Airport transfer",
        description: "Private car pick-up or drop-off at Changi Airport.",
        emoji: "🚗",
        price: 55,
        priceLabel: "+SGD 55",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "butler",
        name: "Butler service",
        description: "A dedicated butler for the duration of your stay.",
        emoji: "🤵",
        price: 150,
        priceLabel: "+SGD 150",
        tag: null,
        defaultIncluded: false,
      },
      {
        id: "in-room-chef",
        name: "In-room chef dinner",
        description: "A private chef cooks a three-course dinner in your room for two.",
        emoji: "👨‍🍳",
        price: 220,
        priceLabel: "+SGD 220",
        tag: null,
        defaultIncluded: false,
      },
    ],
  },
]
```

---

## Notes for Claude Code
- The `defaultIncluded: true` items should be initialised as selected in all flows' local state
- Price delta for room attributes is **per night** and multiplied by `bookingContext.nights` in the total calculation
- Service prices are **per stay** (already totals, not per-night)
- The `tag: "included"` items (e.g. gym access) should render as locked/greyed with "Included" label — no checkbox interaction
