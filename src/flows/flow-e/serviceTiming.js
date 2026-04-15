// Each service has a default day and time-of-day slot.
// day:  0 = check-in day, 1 = day 2, 2 = day 3, 3 = check-out day
// time: 'morning' | 'afternoon' | 'evening'
//
// These are only defaults — on the Itinerary screen the user places
// each service into whichever day+time slot they choose.

export const SERVICE_TIMING = {
  'airport-transfer':   { defaultDay: 0, defaultTime: 'morning'   },
  'welcome-amenity':    { defaultDay: 0, defaultTime: 'afternoon'  },
  'bottle-wine':        { defaultDay: 0, defaultTime: 'evening'    },
  'occasion-setup':     { defaultDay: 0, defaultTime: 'afternoon'  },
  'fnb-credit':         { defaultDay: 0, defaultTime: 'afternoon'  },
  'daily-breakfast':    { defaultDay: 0, defaultTime: 'morning'    },
  'daily-housekeeping': { defaultDay: 0, defaultTime: 'morning'    },
  'turndown':           { defaultDay: 0, defaultTime: 'evening'    },
  'gym-access':         { defaultDay: 0, defaultTime: 'morning'    },
  'premium-wifi':       { defaultDay: 0, defaultTime: 'morning'    },
  'desk-setup':         { defaultDay: 0, defaultTime: 'morning'    },
  'cot':                { defaultDay: 0, defaultTime: 'morning'    },
  'extra-bed':          { defaultDay: 0, defaultTime: 'morning'    },
  'baby-kit':           { defaultDay: 0, defaultTime: 'morning'    },
  'butler':             { defaultDay: 0, defaultTime: 'morning'    },
  'breakfast-in-bed':   { defaultDay: 1, defaultTime: 'morning'    },
  'spa-access':         { defaultDay: 1, defaultTime: 'morning'    },
  'personal-training':  { defaultDay: 1, defaultTime: 'morning'    },
  'cultural-tour':      { defaultDay: 1, defaultTime: 'afternoon'  },
  'meeting-room':       { defaultDay: 1, defaultTime: 'morning'    },
  'in-room-chef':       { defaultDay: 1, defaultTime: 'evening'    },
  'bike-hire':          { defaultDay: 2, defaultTime: 'morning'    },
  'cooking-class':      { defaultDay: 2, defaultTime: 'morning'    },
  'express-laundry':    { defaultDay: 2, defaultTime: 'morning'    },
}

// Pre-populated when the flow starts
export const DEFAULT_SERVICES = [
  { id: 'daily-breakfast',    day: 0, time: 'morning' },
  { id: 'daily-housekeeping', day: 0, time: 'morning' },
  { id: 'gym-access',         day: 0, time: 'morning' },
]
