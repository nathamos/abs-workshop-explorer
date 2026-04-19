import { useNavigate } from 'react-router-dom'

const roomConcepts = [
  {
    id: 'attributes-as-filters',
    title: 'Attributes As Filters',
    description: 'Set your preferences as filters. We surface the rooms that best match what you\'re looking for.',
    route: '/flow-a/rooms',
  },
  {
    id: 'configure-attributes',
    title: 'Configure Attributes',
    description: 'Build your ideal room by combining attributes. We match you to the closest available option.',
    route: '/flow-b/rooms',
  },
  {
    id: 'select-customise',
    title: 'Select & Customise Room',
    description: 'Browse room types and customise from within each card before committing.',
    route: '/flow-c/rooms',
  },
  {
    id: 'budget-led',
    title: 'Budget Led',
    description: 'Set a budget and build your room from there — the bar fills as you add upgrades.',
    route: '/flow-budget',
  },
]

const serviceConcepts = [
  {
    id: 'one-big-list',
    title: 'One Big List',
    description: 'All available services in a single scrollable list. Check off what you want.',
    route: '/flow-a/services',
  },
  {
    id: 'nested-pages',
    title: 'Nested Pages',
    description: 'Services organised by category. Dive into each section to explore the options.',
    route: '/flow-b/services',
  },
  {
    id: 'bundles',
    title: 'Bundles with Different Rates',
    description: 'Pre-curated service packages at different price points. Pick the one that fits.',
    route: '/flow-c/services',
  },
  {
    id: 'chronological',
    title: 'Chronological / Itinerary Based',
    description: 'Plan your services day by day across your stay. See your trip take shape.',
    route: '/flow-e/itinerary',
  },
]

function ConceptCard({ concept, accentColor }) {
  const navigate = useNavigate()
  const disabled = !concept.route

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e5e7eb',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        opacity: disabled ? 0.45 : 1,
      }}
    >
      <div
        style={{
          background: '#d1d5db',
          borderRadius: 8,
          height: 110,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          color: '#6b7280',
          border: '1px solid #9ca3af',
        }}
      >
        Concept Card
      </div>

      <p style={{ fontWeight: 700, fontSize: 14, color: '#000', margin: 0 }}>
        {concept.title}
      </p>

      <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>
        {concept.description}
      </p>

      <button
        onClick={() => !disabled && navigate(concept.route)}
        disabled={disabled}
        style={{
          background: accentColor,
          color: '#fff',
          border: 'none',
          borderRadius: 9999,
          padding: '14px 20px',
          fontWeight: 700,
          fontSize: 15,
          cursor: disabled ? 'default' : 'pointer',
          width: '100%',
          marginTop: 'auto',
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
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#000', whiteSpace: 'nowrap', margin: 0 }}>
          {title}
        </h2>
        <div style={{ flex: 1, height: 2, background: accentColor }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 28 }}>
        {concepts.map(concept => (
          <ConceptCard key={concept.id} concept={concept} accentColor={accentColor} />
        ))}
      </div>
    </section>
  )
}

export default function ExplorerHome() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', padding: '72px 80px 100px' }}>
      <h1 style={{ fontSize: 48, fontWeight: 800, color: '#000', marginBottom: 80, lineHeight: 1.1 }}>
        Play with The UI/UX Options
      </h1>

      <Section title="Select Room" concepts={roomConcepts} accentColor="#7c3aed" />
      <Section title="Services / Add-Ons" concepts={serviceConcepts} accentColor="#22c55e" />
    </div>
  )
}
