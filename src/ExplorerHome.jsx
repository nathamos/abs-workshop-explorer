import { useNavigate } from 'react-router-dom'

const roomConcepts = [
  {
    id: 'attributes-as-filters',
    title: 'Attributes As Filters',
    description: 'Set your preferences as filters. We surface the rooms that best match what you\'re looking for.',
    route: '/flow-a/rooms',
    image: '/assets/card-attributes-as-filters.jpg',
  },
  {
    id: 'configure-attributes',
    title: 'Configure Attributes',
    description: 'Build your ideal room by combining attributes. We match you to the closest available option.',
    route: '/flow-b/rooms',
    image: '/assets/card-configure-attributes.jpg',
  },
  {
    id: 'select-customise',
    title: 'Select & Customise Room',
    description: 'Browse room types and customise from within each card before committing.',
    route: '/flow-c/rooms',
    image: '/assets/card-select-customise-room.jpg',
  },
  {
    id: 'budget-led',
    title: 'Room Tier Comparison',
    description: 'See all room types side by side. Compare what each includes and choose the one that fits.',
    route: '/flow-budget',
    image: '/assets/card-room-tier-comparison.jpg',
  },
]

const serviceConcepts = [
  {
    id: 'one-big-list',
    title: 'One Big List',
    description: 'All available services in a single scrollable list. Check off what you want.',
    route: '/flow-a/services',
    image: '/assets/card-one-big-list.png',
  },
  {
    id: 'nested-pages',
    title: 'Nested Pages',
    description: 'Services organised by category. Dive into each section to explore the options.',
    route: '/flow-b/services',
    image: '/assets/card-nested-pages.jpg',
  },
  {
    id: 'bundles',
    title: 'Bundles with Different Rates',
    description: 'Pre-curated service packages at different price points. Pick the one that fits.',
    route: '/flow-c/services',
    image: '/assets/card-bundles.jpg',
  },
  {
    id: 'chronological',
    title: 'Chronological / Itinerary Based',
    description: 'Plan your services day by day across your stay. See your trip take shape.',
    route: '/flow-e/itinerary',
    image: '/assets/card-chronological.png',
  },
]

function ConceptCard({ concept, accentColor }) {
  const navigate = useNavigate()
  const disabled = !concept.route

  return (
    <div
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--color-border)',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <div style={{ borderRadius: 'var(--radius-sm)', height: 110, overflow: 'hidden' }}>
        <img src={concept.image} alt={concept.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>

      <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--color-text-primary)', margin: 0 }}>
        {concept.title}
      </p>

      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', margin: 0, lineHeight: 1.6 }}>
        {concept.description}
      </p>

      <button
        onClick={() => !disabled && navigate(concept.route)}
        disabled={disabled}
        style={{
          background: accentColor,
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-full)',
          padding: '14px 20px',
          fontWeight: 600,
          fontSize: 15,
          cursor: disabled ? 'default' : 'pointer',
          width: '100%',
          marginTop: 'auto',
          fontFamily: 'var(--font-body)',
        }}
      >
        {disabled ? 'Coming soon' : 'Go →'}
      </button>
    </div>
  )
}

function Section({ title, concepts, accentColor }) {
  return (
    <section style={{ marginBottom: 72 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            color: 'var(--color-text-primary)',
            whiteSpace: 'nowrap',
            margin: 0,
            fontWeight: 400,
          }}
        >
          {title}
        </h2>
        <div style={{ flex: 1, height: 2, background: accentColor }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
        {concepts.map(concept => (
          <ConceptCard key={concept.id} concept={concept} accentColor={accentColor} />
        ))}
      </div>
    </section>
  )
}

export default function ExplorerHome() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '72px 48px 100px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 48,
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            marginBottom: 72,
            lineHeight: 1.1,
          }}
        >
          Play with The UI/UX Options
        </h1>

        <Section title="Select Room" concepts={roomConcepts} accentColor="#7c3aed" />
        <Section title="Services / Add-Ons" concepts={serviceConcepts} accentColor="#22c55e" />
      </div>
    </div>
  )
}
