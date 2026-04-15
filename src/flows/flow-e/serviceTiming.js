// Maps each service ID to a chronological slot within the stay.
// slot 0 = check-in day
// slot 1 = day 2 (mid-stay, night 1)
// slot 2 = day 3 (mid-stay, night 2)
// slot 3 = check-out day
// `when` is a short sublabel shown under the service name in the itinerary.

export const SERVICE_TIMING = {
  'airport-transfer':   { slot: 0, when: 'On arrival' },
  'welcome-amenity':    { slot: 0, when: 'On arrival' },
  'bottle-wine':        { slot: 0, when: 'On arrival' },
  'occasion-setup':     { slot: 0, when: 'On arrival' },
  'fnb-credit':         { slot: 0, when: 'Throughout stay' },
  'daily-breakfast':    { slot: 0, when: 'Each morning' },
  'daily-housekeeping': { slot: 0, when: 'Each day' },
  'turndown':           { slot: 0, when: 'Each evening' },
  'gym-access':         { slot: 0, when: 'Throughout stay' },
  'premium-wifi':       { slot: 0, when: 'Throughout stay' },
  'desk-setup':         { slot: 0, when: 'Check-in' },
  'cot':                { slot: 0, when: 'Check-in' },
  'extra-bed':          { slot: 0, when: 'Check-in' },
  'baby-kit':           { slot: 0, when: 'Check-in' },
  'butler':             { slot: 0, when: 'Throughout stay' },
  'breakfast-in-bed':   { slot: 1, when: 'Morning' },
  'spa-access':         { slot: 1, when: 'Morning' },
  'personal-training':  { slot: 1, when: 'Session' },
  'cultural-tour':      { slot: 1, when: 'Afternoon' },
  'meeting-room':       { slot: 1, when: 'Morning' },
  'in-room-chef':       { slot: 1, when: 'Evening' },
  'bike-hire':          { slot: 2, when: 'All day' },
  'cooking-class':      { slot: 2, when: 'Morning' },
  'express-laundry':    { slot: 2, when: 'Same-day return' },
}

export const DEFAULT_SERVICE_IDS = ['daily-breakfast', 'daily-housekeeping', 'gym-access']
