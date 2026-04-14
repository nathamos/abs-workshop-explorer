export default function StepHeader({ step, totalSteps, title, subtitle, rightContent }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-1">
        <p
          className="text-xs font-medium tracking-widest uppercase"
          style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}
        >
          Step {step} of {totalSteps}
        </p>
        {rightContent && (
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {rightContent}
          </p>
        )}
      </div>
      <h1
        className="text-3xl mb-1"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
