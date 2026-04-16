export default function RoomCard({ room, selected, onSelect, matchCount, totalFilters }) {
  const hasFilters = totalFilters > 0
  const isBestMatch = hasFilters && matchCount === totalFilters
  const isPartialMatch = hasFilters && matchCount > 0 && matchCount < totalFilters

  const cardStyle = {
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    border: isBestMatch
      ? '2px solid var(--color-teal)'
      : '1px solid var(--color-border)',
    boxShadow: isBestMatch || isPartialMatch
      ? '0 4px 8px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.3)'
      : 'none',
  }

  return (
    <div style={cardStyle}>
      {/* Top row: thumbnail + content + price */}
      <div className="flex items-start gap-4">
        <div
          className="flex-shrink-0 overflow-hidden"
          style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-alt)' }}
        >
          {room.image && (
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              {isBestMatch && (
                <p
                  className="text-sm font-semibold uppercase mb-1"
                  style={{ color: 'var(--color-teal)', letterSpacing: '0.04em' }}
                >
                  Best match {matchCount} of {totalFilters}
                </p>
              )}
              {isPartialMatch && (
                <p
                  className="text-sm font-semibold uppercase mb-1"
                  style={{ color: '#eb5a00', letterSpacing: '0.04em' }}
                >
                  Partial match {matchCount} of {totalFilters}
                </p>
              )}
              <h3 className="text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {room.name}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                {room.tagline}
              </p>
            </div>

            <p className="text-sm flex-shrink-0" style={{ color: 'var(--color-text-secondary)' }}>
              from SGD {room.basePricePerNight}
              <span style={{ color: 'var(--color-text-tertiary)' }}>/night</span>
            </p>
          </div>
        </div>
      </div>

      {/* Button row */}
      <div className="flex justify-end">
        <button
          onClick={onSelect}
          className="text-base font-semibold"
          style={{
            border: '1px solid var(--color-teal)',
            color: 'var(--color-teal)',
            background: 'var(--color-teal-light)',
            borderRadius: 'var(--radius-md)',
            padding: '10px 20px',
            cursor: 'pointer',
          }}
        >
          {selected ? 'Selected' : 'Select →'}
        </button>
      </div>
    </div>
  )
}
