import { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { rooms } from '../../data/rooms'
import { attributes } from '../../data/attributes'

const NIGHTS = 3

const COMPARE_ROOMS = rooms.filter((r) => r.id !== 'accessible-standard')

const ROWS = [
  { id: 'bedding',       label: 'Bed type' },
  { id: 'occupancy',     label: 'Guests' },
  { id: 'size',          label: 'Room size' },
  { id: 'floor',         label: 'Floor' },
  { id: 'view',          label: 'View' },
  { id: 'balcony',       label: 'Balcony' },
  { id: 'bathroom',      label: 'Bathroom' },
  { id: 'livingArea',    label: 'Living area' },
  { id: 'kitchen',       label: 'Kitchen' },
  { id: 'laundry',       label: 'In-room laundry' },
  { id: 'facilityAccess', label: 'Facilities' },
]

function getCellValues(room, attrId) {
  if (attrId === 'size') return [{ label: `${room.size} m²`, emoji: null }]

  const roomVal = room.attributes[attrId]
  const attr = attributes.find((a) => a.id === attrId)
  if (!attr) return null

  if (attr.type === 'multiselect') {
    const vals = Array.isArray(roomVal) ? roomVal : [roomVal]
    return vals
      .map((v) => {
        const opt = attr.options.find((o) => o.value === v)
        return opt ? { label: opt.label, emoji: opt.emoji } : null
      })
      .filter(Boolean)
  }

  if (attr.type === 'toggle') {
    if (!roomVal) return null
    const opt = attr.options.find((o) => o.value === true)
    return opt ? [{ label: opt.label, emoji: opt.emoji }] : null
  }

  const opt = attr.options.find((o) => o.value === roomVal)
  return opt ? [{ label: opt.label, emoji: opt.emoji }] : null
}

function Chip({ label, emoji }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '4px 10px',
        borderRadius: 'var(--radius-full)',
        background: 'var(--color-surface-alt)',
        border: '1px solid var(--color-border)',
        fontSize: 12,
        fontWeight: 500,
        color: 'var(--color-text-primary)',
        whiteSpace: 'nowrap',
      }}
    >
      {emoji && <span>{emoji}</span>}
      <span>{label}</span>
    </span>
  )
}

export default function RoomComparison() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 48px 80px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 400,
          color: 'var(--color-text-primary)',
          marginBottom: 6,
          lineHeight: 1.15,
        }}
      >
        Room Tier Comparison
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 40 }}>
        The Straits · 14–17 June · 3 nights · 2 guests
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '160px repeat(4, 1fr)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          background: 'var(--color-surface)',
        }}
      >
        {/* ── Header row ── */}
        <div style={{ background: 'var(--color-surface)', padding: '20px 16px' }} />

        {COMPARE_ROOMS.map((room) => (
          <div
            key={room.id}
            style={{ borderLeft: '1px solid var(--color-border)', background: 'var(--color-surface)' }}
          >
            <div style={{ height: 130, overflow: 'hidden' }}>
              {room.image ? (
                <img
                  src={room.image}
                  alt={room.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'var(--color-surface-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                  }}
                >
                  🏨
                </div>
              )}
            </div>
            <div style={{ padding: '14px 16px 18px' }}>
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 400,
                  color: 'var(--color-text-primary)',
                  marginBottom: 4,
                }}
              >
                {room.name}
              </p>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>
                {room.tagline}
              </p>
            </div>
          </div>
        ))}

        {/* ── Attribute rows ── */}
        {ROWS.map((row, rowIndex) => {
          const rowBg = rowIndex % 2 === 0 ? 'var(--color-bg)' : 'var(--color-surface)'
          return (
            <Fragment key={row.id}>
              <div
                style={{
                  padding: '13px 16px',
                  background: rowBg,
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)' }}>
                  {row.label}
                </span>
              </div>

              {COMPARE_ROOMS.map((room) => {
                const values = getCellValues(room, row.id)
                return (
                  <div
                    key={room.id}
                    style={{
                      padding: '13px 16px',
                      background: rowBg,
                      borderTop: '1px solid var(--color-border)',
                      borderLeft: '1px solid var(--color-border)',
                      display: 'flex',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: 5,
                      minHeight: 48,
                    }}
                  >
                    {values ? (
                      values.map((v, i) => <Chip key={i} label={v.label} emoji={v.emoji} />)
                    ) : (
                      <span style={{ fontSize: 16, color: 'var(--color-text-tertiary)' }}>—</span>
                    )}
                  </div>
                )
              })}
            </Fragment>
          )
        })}

        {/* ── Footer: price + CTA ── */}
        <div
          style={{
            padding: '20px 16px',
            background: 'var(--color-surface)',
            borderTop: '1px solid var(--color-border)',
          }}
        />

        {COMPARE_ROOMS.map((room) => (
          <div
            key={room.id}
            style={{
              padding: '20px 16px',
              background: 'var(--color-surface)',
              borderTop: '1px solid var(--color-border)',
              borderLeft: '1px solid var(--color-border)',
            }}
          >
            <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 2 }}>
              SGD {room.basePricePerNight}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)' }}>/night</span>
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
              SGD {room.basePricePerNight * NIGHTS} for {NIGHTS} nights
            </p>
            <button
              onClick={() => navigate('/')}
              className="transition-opacity hover:opacity-90"
              style={{
                width: '100%',
                padding: '12px',
                background: 'var(--color-text-primary)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
              }}
            >
              Select →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
