import { motion } from 'framer-motion'

export default function AttributePill({ label, emoji, selected, onClick, priceDelta, showPrice }) {
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.1 }}
      onClick={onClick}
      className="inline-flex items-center gap-1 text-sm font-medium transition-colors"
      style={{
        padding: '8px 14px',
        borderRadius: 'var(--radius-full)',
        border: selected ? '1.5px solid var(--color-teal-border)' : '1px solid var(--color-border)',
        background: selected ? 'var(--color-teal-light)' : 'var(--color-surface)',
        color: selected ? 'var(--color-teal)' : 'var(--color-text-primary)',
        cursor: onClick ? 'pointer' : 'default',
        whiteSpace: 'nowrap',
      }}
    >
      {selected && <span className="text-xs">✓</span>}
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
      {showPrice && priceDelta !== null && priceDelta !== undefined && (
        <span
          className="text-xs"
          style={{ color: selected ? 'var(--color-teal)' : 'var(--color-text-secondary)' }}
        >
          {priceDelta === 0 ? 'Incl.' : `+SGD ${priceDelta}`}
        </span>
      )}
    </motion.button>
  )
}
