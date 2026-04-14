import { Link } from 'react-router-dom'

const flows = [
  {
    path: '/flow-a',
    label: 'Flow A — Filter & Narrow',
    description: 'Room-first. Filter a room list by attributes; ranked results.',
  },
  {
    path: '/flow-b',
    label: 'Flow B — Build Your Room (unpriced)',
    description: 'Attribute-first. Compose a room from preferences; no prices shown.',
  },
  {
    path: '/flow-b-priced',
    label: 'Flow B — Build Your Room (priced)',
    description: 'Same as Flow B with live SGD price deltas per attribute.',
  },
  {
    path: '/flow-c',
    label: 'Flow C — Room First',
    description: 'Pick a room, personalise in-card, select a bundle.',
  },
  {
    path: '/flow-d',
    label: 'Flow D — Conversational',
    description: 'Answer 5 questions; receive a curated recommendation.',
  },
]

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-[800px] mx-auto px-6 py-12">
        <p
          className="text-xs font-medium tracking-widest uppercase mb-2"
          style={{ color: 'var(--color-text-tertiary)' }}
        >
          Research prototype
        </p>
        <h1
          className="text-3xl mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          ABS Prototype
        </h1>
        <p className="text-sm mb-8" style={{ color: 'var(--color-text-secondary)' }}>
          The Straits, Singapore · 14–17 Jun · 2 guests
        </p>

        <div className="flex flex-col gap-3">
          {flows.map((flow) => (
            <Link
              key={flow.path}
              to={flow.path}
              className="block px-6 py-5 rounded-2xl border transition-colors hover:border-[var(--color-teal)]"
              style={{
                background: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
            >
              <p className="text-base font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
                {flow.label}
              </p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {flow.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
