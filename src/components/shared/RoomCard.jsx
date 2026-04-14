import Tag from './Tag'

export default function RoomCard({ room, selected, onSelect, matchCount, totalFilters, bestMatch, showDetails, onToggleDetails, matchedAttributes, altPrice }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all"
      style={{
        background: 'var(--color-surface)',
        border: selected
          ? '2px solid var(--color-teal-border)'
          : bestMatch
          ? '2px solid var(--color-teal-border)'
          : '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="flex items-start gap-4 p-5">
        {/* Image */}
        <div
          className="flex-shrink-0 bg-gray-100 overflow-hidden"
          style={{ width: 80, height: 80, borderRadius: 'var(--radius-md)' }}
        >
          {room.image ? (
            <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🏨</div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              {bestMatch && (
                <p
                  className="text-xs font-semibold uppercase mb-0.5"
                  style={{ color: 'var(--color-teal)', letterSpacing: '0.06em' }}
                >
                  Best match
                </p>
              )}
              <h3 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                {room.name}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
                {room.tagline}
              </p>
            </div>
            <div className="text-right flex-shrink-0">
              {selected ? (
                <Tag variant="selected">Selected ✓</Tag>
              ) : room.badge ? (
                <Tag variant="badge">{room.badge}</Tag>
              ) : null}
              <p className="text-xs mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {altPrice ? (
                  <>from <span style={{ fontWeight: 600 }}>{altPrice}</span><span style={{ color: 'var(--color-text-tertiary)' }}>/night</span></>
                ) : (
                  <>from SGD {room.basePricePerNight}<span style={{ color: 'var(--color-text-tertiary)' }}>/night</span></>
                )}
              </p>
            </div>
          </div>

          {/* Match pills */}
          {matchedAttributes && matchedAttributes.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {matchedAttributes.map((attr) => (
                <span
                  key={attr}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: 'var(--color-teal-light)',
                    color: 'var(--color-teal)',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  {attr}
                </span>
              ))}
              {totalFilters > 0 && (
                <span className="text-xs" style={{ color: 'var(--color-teal)' }}>
                  {matchCount} of {totalFilters} matched
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between mt-3">
            {onToggleDetails && (
              <button
                onClick={onToggleDetails}
                className="text-xs"
                style={{ color: 'var(--color-text-tertiary)' }}
              >
                {showDetails ? 'Hide details ▴' : 'Show room details ▾'}
              </button>
            )}
            <button
              onClick={onSelect}
              className="ml-auto text-sm font-medium transition-colors"
              style={
                selected
                  ? {
                      border: '1px solid var(--color-teal)',
                      color: 'var(--color-teal)',
                      background: 'transparent',
                      borderRadius: 'var(--radius-md)',
                      padding: '6px 16px',
                    }
                  : bestMatch
                  ? {
                      border: 'none',
                      color: 'white',
                      background: 'var(--color-teal)',
                      borderRadius: 'var(--radius-md)',
                      padding: '8px 18px',
                    }
                  : {
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      background: 'transparent',
                      borderRadius: 'var(--radius-md)',
                      padding: '6px 16px',
                    }
              }
            >
              {selected ? 'Selected' : 'Select →'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {showDetails && (
        <div
          className="px-5 pb-4 border-t"
          style={{ borderColor: 'var(--color-border)' }}
        >
          <p
            className="text-xs font-medium uppercase tracking-widest mt-3 mb-2"
            style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}
          >
            Room attributes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(room.attributes).map(([key, val]) => {
              if (val === false || val === null) return null
              const display = val === true ? key : `${key}: ${val}`
              return (
                <span
                  key={key}
                  className="text-xs px-2 py-0.5"
                  style={{
                    background: 'var(--color-surface-alt)',
                    color: 'var(--color-text-secondary)',
                    borderRadius: 'var(--radius-sm)',
                  }}
                >
                  {display}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
