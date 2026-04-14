import Tag from './Tag'

export default function ServiceItem({ item, checked, onChange, quantity = 1, onQuantityChange }) {
  const isLocked = item.tag === 'included'
  const showQty = checked && item.quantifiable && !isLocked

  return (
    <div
      className="flex items-start gap-3 py-3"
      style={{ borderBottom: '1px solid var(--color-border)' }}
    >
      {/* Checkbox */}
      <button
        onClick={() => !isLocked && onChange(!checked)}
        className="flex-shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center transition-colors"
        style={{
          border: checked && !isLocked ? 'none' : '1.5px solid var(--color-border)',
          background: checked && !isLocked ? 'var(--color-teal)' : isLocked ? 'var(--color-surface-alt)' : 'var(--color-surface)',
          cursor: isLocked ? 'default' : 'pointer',
          borderRadius: 'var(--radius-sm)',
        }}
        disabled={isLocked}
      >
        {(checked || isLocked) && (
          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
            <path d="M1 4L4 7L10 1" stroke={isLocked ? 'var(--color-text-tertiary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Emoji icon */}
      <div
        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-xl"
        style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}
      >
        {item.emoji}
      </div>

      {/* Name + description */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium leading-tight"
          style={{ color: isLocked ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)' }}
        >
          {item.name}
        </p>
        <p className="text-xs mt-0.5 leading-snug" style={{ color: 'var(--color-text-secondary)' }}>
          {item.description}
        </p>
        {item.tag === 'popular' && (
          <div className="mt-1">
            <Tag variant="popular">Popular</Tag>
          </div>
        )}
        {isLocked && (
          <div className="mt-1">
            <Tag variant="included">Included</Tag>
          </div>
        )}
      </div>

      {/* Price + optional qty control */}
      <div className="flex-shrink-0 text-right">
        <p
          className="text-sm font-semibold"
          style={{ color: isLocked ? 'var(--color-text-tertiary)' : 'var(--color-addprice)' }}
        >
          {isLocked || item.price === 0
            ? 'Included'
            : showQty && quantity > 1
            ? `+SGD ${item.price * quantity}`
            : `+SGD ${item.price}`}
        </p>
        {showQty && (
          <div className="flex items-center justify-end gap-1 mt-1.5">
            <button
              onClick={() => onQuantityChange(-1)}
              disabled={quantity <= 1}
              style={{
                width: 24,
                height: 24,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: quantity <= 1 ? 'var(--color-surface-alt)' : 'var(--color-surface)',
                color: quantity <= 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)',
                cursor: quantity <= 1 ? 'default' : 'pointer',
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              −
            </button>
            <span
              className="text-sm font-medium"
              style={{ minWidth: 16, textAlign: 'center', color: 'var(--color-text-primary)' }}
            >
              {quantity}
            </span>
            <button
              onClick={() => onQuantityChange(1)}
              style={{
                width: 24,
                height: 24,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                color: 'var(--color-text-primary)',
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
