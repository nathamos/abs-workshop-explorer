import Tag from './Tag'

export default function ServiceItem({ item, checked, onChange }) {
  const isLocked = item.tag === 'included'
  const isDefault = item.tag === 'default'

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
        {item.tag && item.tag !== 'included' && (
          <div className="mt-1">
            <Tag variant={item.tag}>{item.tag === 'default' ? 'Default included' : 'Popular'}</Tag>
          </div>
        )}
        {isLocked && (
          <div className="mt-1">
            <Tag variant="included">Included</Tag>
          </div>
        )}
      </div>

      {/* Price */}
      <div className="flex-shrink-0 text-right">
        <p
          className="text-sm font-semibold"
          style={{
            color: isLocked
              ? 'var(--color-text-tertiary)'
              : isDefault
              ? 'var(--color-positive)'
              : 'var(--color-addprice)',
          }}
        >
          {item.priceLabel}
        </p>
      </div>
    </div>
  )
}
