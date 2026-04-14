export default function ContextStrip({ roomName, nights, totalPrice, dates, guests }) {
  return (
    <div
      className="px-4 py-3 rounded-xl mb-6 flex items-center justify-between"
      style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}
    >
      <div>
        <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {roomName} · {nights} nights
        </p>
        <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {dates} · {guests}
        </p>
      </div>
      {totalPrice !== undefined && (
        <p className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
          SGD {totalPrice}
        </p>
      )}
    </div>
  )
}
