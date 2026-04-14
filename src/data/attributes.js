export const attributes = [
  {
    id: 'roomCategory',
    label: 'Room type',
    type: 'select',
    options: [
      { value: 'standard', label: 'Standard',  priceDelta: 0 },
      { value: 'superior', label: 'Superior',  priceDelta: 20 },
      { value: 'deluxe',   label: 'Deluxe',    priceDelta: 45 },
    ],
  },
  {
    id: 'occupancy',
    label: 'Guests',
    type: 'select',
    options: [
      { value: 1, label: '1 guest',  priceDelta: 0 },
      { value: 2, label: '2 guests', priceDelta: 15 },
    ],
  },
  {
    id: 'bedding',
    label: 'Bed type',
    emoji: '🛏',
    type: 'select',
    options: [
      { value: 'king',   label: 'King bed',   emoji: '🛏️',  priceDelta: 0 },
      { value: 'twin',   label: 'Twin beds',  emoji: '🛏🛏', priceDelta: 0 },
      { value: 'double', label: 'Double bed', emoji: '🛏️',  priceDelta: 0 },
    ],
  },
  {
    id: 'floor',
    label: 'Floor',
    emoji: '🏢',
    type: 'select',
    options: [
      { value: 'low',  label: 'Low floor',  sublabel: 'Floors 1–5',   priceDelta: 0 },
      { value: 'mid',  label: 'Mid floor',  sublabel: 'Floors 6–12',  priceDelta: 15 },
      { value: 'high', label: 'High floor', sublabel: 'Floors 13–20', priceDelta: 30 },
    ],
  },
  {
    id: 'view',
    label: 'View',
    emoji: '👁',
    type: 'select',
    options: [
      { value: 'courtyard', label: 'Courtyard',   emoji: '🌿', priceDelta: 0 },
      { value: 'city',      label: 'City view',   emoji: '🏙️', priceDelta: 20 },
      { value: 'marina',    label: 'Marina view', emoji: '🌊', priceDelta: 40 },
    ],
  },
  {
    id: 'balcony',
    label: 'Balcony',
    emoji: '🌅',
    type: 'toggle',
    options: [
      { value: false, label: 'No balcony', priceDelta: 0 },
      { value: true,  label: 'Balcony',    priceDelta: 25 },
    ],
  },
  {
    id: 'bathroom',
    label: 'Bathroom',
    emoji: '🛁',
    type: 'select',
    options: [
      { value: 'shower',  label: 'Standard shower',  priceDelta: 0 },
      { value: 'bathtub', label: 'Bathtub + shower',  priceDelta: 20 },
    ],
  },
  {
    id: 'kitchen',
    label: 'Kitchen',
    emoji: '🍳',
    type: 'toggle',
    options: [
      { value: false, label: 'No kitchenette', priceDelta: 0 },
      { value: true,  label: 'Kitchenette',    priceDelta: 30 },
    ],
  },
  {
    id: 'facilityAccess',
    label: 'Facilities',
    emoji: '🏊',
    type: 'select',
    options: [
      { value: 'room-only', label: 'Room only',         priceDelta: 0 },
      { value: 'pool-gym',  label: 'Pool + Gym access', priceDelta: 22 },
    ],
  },
  {
    id: 'laundry',
    label: 'Laundry',
    emoji: '👕',
    type: 'toggle',
    options: [
      { value: false, label: 'No laundry',           priceDelta: 0 },
      { value: true,  label: 'Daily laundry service', priceDelta: 28 },
    ],
  },
  {
    id: 'smoking',
    label: 'Smoking',
    type: 'toggle',
    options: [
      { value: false, label: 'Non-smoking', priceDelta: null },
      { value: true,  label: 'Smoking',     priceDelta: null },
    ],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    type: 'toggle',
    options: [
      { value: false, label: 'Standard room',   priceDelta: null },
      { value: true,  label: 'Accessible room', priceDelta: null },
    ],
  },
]

export const conflicts = [
  {
    attributes: ['accessibility:true', 'floor:high'],
    message: 'Accessible rooms are on low floors only.',
  },
  {
    attributes: ['connecting:true', 'balcony:true'],
    message: "Connecting rooms don't include a balcony.",
  },
  {
    attributes: ['kitchen:true', 'bedding:twin'],
    message: 'Kitchenette is only available with a king or double bed.',
  },
]
