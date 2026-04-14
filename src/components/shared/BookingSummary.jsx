import { motion, AnimatePresence } from 'framer-motion'

export default function BookingSummary({ roomName, nights, roomTotal, selectedServices, total, onContinue, ctaLabel = 'Continue to payment ↗' }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        padding: '16px 24px',
      }}
    >
      <div className="max-w-[800px] mx-auto">
        {/* Line items */}
        <div className="flex justify-between text-sm mb-1">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {roomName ? `${roomName} · ${nights} nights` : `Room · ${nights} nights`}
          </span>
          <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
        </div>

        <AnimatePresence>
          {selectedServices && selectedServices.map((svc) => (
            <motion.div
              key={svc.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between text-xs mb-0.5"
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>{svc.name}</span>
              <span style={{ color: svc.price < 0 ? 'var(--color-positive)' : 'var(--color-text-primary)' }}>
                {svc.price < 0 ? `-SGD ${Math.abs(svc.price)}` : `+SGD ${svc.price}`}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>

        <div
          className="flex justify-between text-sm font-semibold pt-2 mt-1 mb-3"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span>Total</span>
          <motion.span key={total} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            SGD {total}
          </motion.span>
        </div>

        <button
          onClick={onContinue}
          className="w-full text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  )
}
