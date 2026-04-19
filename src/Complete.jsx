import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONFETTI_COLORS = [
  'var(--color-teal)',
  '#F59E0B',
  '#EF4444',
  '#3B82F6',
  '#8B5CF6',
  '#EC4899',
  '#10B981',
  '#F97316',
]

const pieces = Array.from({ length: 90 }, (_, i) => ({
  id: i,
  left: `${(i * 1.12) % 100}%`,
  size: 6 + (i % 5) * 2,
  color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  isCircle: i % 3 === 0,
  delay: ((i * 0.07) % 2.4).toFixed(2),
  duration: (2.2 + (i % 4) * 0.4).toFixed(2),
}))

export default function Complete() {
  const navigate = useNavigate()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}
    >
      <style>{`
        @keyframes confettoFall {
          0%   { transform: translateY(-40px) rotate(0deg);   opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(600deg); opacity: 0; }
        }
      `}</style>

      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: 0,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.isCircle ? '50%' : 2,
            animation: `confettoFall ${p.duration}s ${p.delay}s ease-in forwards`,
            pointerEvents: 'none',
          }}
        />
      ))}

      <div className="relative z-10 text-center px-6" style={{ maxWidth: 480 }}>
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'var(--color-teal-light)', border: '2px solid var(--color-teal)' }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--color-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>

        <h1
          className="text-4xl mb-3"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          You're all done!
        </h1>

        <p className="text-base mb-8" style={{ color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Thanks for completing the session. Your facilitator will take it from here.
        </p>

        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          Back to start
        </button>
      </div>
    </div>
  )
}
