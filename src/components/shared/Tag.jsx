// Tag variants: 'default' | 'popular' | 'included' | 'best-match' | 'selected' | 'badge'
export default function Tag({ variant, children }) {
  const styles = {
    default: {
      background: 'var(--color-amber-bg)',
      color: 'var(--color-amber)',
    },
    popular: {
      background: 'var(--color-green-tag-bg)',
      color: 'var(--color-green-tag)',
    },
    included: {
      background: 'var(--color-surface-alt)',
      color: 'var(--color-text-tertiary)',
    },
    'best-match': {
      background: 'transparent',
      color: 'var(--color-teal)',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      fontWeight: 600,
    },
    selected: {
      background: 'var(--color-teal-light)',
      color: 'var(--color-teal)',
    },
    badge: {
      background: 'var(--color-surface-alt)',
      color: 'var(--color-text-secondary)',
    },
  }

  const style = styles[variant] || styles.badge

  return (
    <span
      className="inline-block text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ borderRadius: 'var(--radius-sm)', fontSize: '12px', ...style }}
    >
      {children}
    </span>
  )
}
