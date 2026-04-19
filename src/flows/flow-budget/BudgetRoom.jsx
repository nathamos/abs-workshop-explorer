import { useMemo } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

import { attributes } from '../../data/attributes'
import { conflicts } from '../../data/attributes'
import { rooms } from '../../data/rooms'
import { findBestRoom, getActiveConflict } from '../../data/roomMatching'
import AttributePill from '../../components/shared/AttributePill'

// The cheapest possible room per night — all attribute deltas stack on top of this
const BASE_RATE = 180

// Attributes to show, in display order (skip pillows and accessibility)
const ATTR_GROUPS = [
  { label: 'Room category', ids: ['roomCategory'] },
  { label: 'Guests', ids: ['occupancy'] },
  { label: 'Bed type', ids: ['bedding'] },
  { label: 'Floor & view', ids: ['floor', 'view'] },
  { label: 'Room extras', ids: ['balcony', 'livingArea', 'kitchen', 'laundry'] },
  { label: 'Bathroom', ids: ['bathroom'] },
  { label: 'Facilities', ids: ['facilityAccess'] },
]

function computeDelta(selectedAttributes) {
  let delta = 0
  for (const attr of attributes) {
    if (attr.type === 'multiselect') continue
    const selected = selectedAttributes[attr.id]
    if (selected === undefined || selected === null) continue
    const opt = attr.options.find((o) => o.value === selected)
    if (opt?.priceDelta) delta += opt.priceDelta
  }
  return delta
}

export default function BudgetRoom() {
  const { budget, budgetMode, setBudgetMode, selectedAttributes, setSelectedAttributes } = useOutletContext()
  const navigate = useNavigate()

  const delta = useMemo(() => computeDelta(selectedAttributes), [selectedAttributes])
  const pricePerNight = BASE_RATE + delta
  const priceTrip = pricePerNight * 3

  const spend = budgetMode === 'nightly' ? pricePerNight : priceTrip
  const budgetDisplay = budgetMode === 'nightly' ? budget : Math.round(budget * 3)
  const remaining = budgetDisplay - spend
  const pct = Math.min((spend / budgetDisplay) * 100, 100).toFixed(1)
  const isOver = remaining < 0
  const isWarn = !isOver && pct >= 85

  const barColor = isOver ? '#E24B4A' : isWarn ? '#EF9F27' : 'var(--color-teal)'
  const remainingColor = isOver ? '#E24B4A' : isWarn ? '#BA7517' : 'var(--color-teal)'

  const matchedRoom = useMemo(() => findBestRoom(rooms, selectedAttributes), [selectedAttributes])
  const activeConflict = useMemo(() => getActiveConflict(conflicts, selectedAttributes), [selectedAttributes])

  function selectAttr(id, value) {
    setSelectedAttributes((prev) => ({ ...prev, [id]: value }))
  }

  function toggleBedding(value) {
    setSelectedAttributes((prev) => {
      const current = Array.isArray(prev.bedding) ? prev.bedding : [prev.bedding]
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value]
      return { ...prev, bedding: next.length ? next : [value] }
    })
  }

  function renderPills(attr) {
    if (attr.type === 'multiselect') {
      return attr.options.map((opt) => (
        <AttributePill
          key={opt.value}
          label={opt.label}
          emoji={opt.emoji}
          selected={(selectedAttributes.bedding || []).includes(opt.value)}
          onClick={() => toggleBedding(opt.value)}
          showPrice={false}
        />
      ))
    }

    if (attr.type === 'toggle') {
      const trueOpt = attr.options.find((o) => o.value === true)
      return (
        <AttributePill
          key={attr.id}
          label={trueOpt.label}
          emoji={trueOpt.emoji}
          selected={selectedAttributes[attr.id] === true}
          onClick={() => selectAttr(attr.id, !selectedAttributes[attr.id])}
          priceDelta={trueOpt.priceDelta}
          showPrice={true}
        />
      )
    }

    return attr.options.map((opt) => (
      <AttributePill
        key={opt.value}
        label={opt.label}
        emoji={opt.emoji}
        selected={selectedAttributes[attr.id] === opt.value}
        onClick={() => selectAttr(attr.id, opt.value)}
        priceDelta={opt.priceDelta}
        showPrice={true}
      />
    ))
  }

  const modeBtnStyle = (active) => ({
    padding: '5px 14px',
    borderRadius: 'var(--radius-full)',
    border: 'none',
    fontSize: 12,
    fontWeight: 500,
    cursor: 'pointer',
    background: active ? 'var(--color-teal)' : 'transparent',
    color: active ? '#fff' : 'var(--color-text-secondary)',
    transition: 'background 0.15s, color 0.15s',
  })

  return (
    <div>
      {/* ── Sticky budget bar ── */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto', padding: '16px 24px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            {/* Left: spend / budget */}
            <div>
              <p style={{ fontSize: 11, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>
                Budget
              </p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 22, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  SGD {spend}
                </span>
                <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  of SGD {budgetDisplay}
                </span>
              </div>
            </div>

            {/* Right: mode toggle + remaining */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
              <div
                style={{
                  display: 'flex',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-full)',
                  padding: 2,
                  gap: 2,
                }}
              >
                <button style={modeBtnStyle(budgetMode === 'nightly')} onClick={() => setBudgetMode('nightly')}>
                  Per night
                </button>
                <button style={modeBtnStyle(budgetMode === 'trip')} onClick={() => setBudgetMode('trip')}>
                  3 nights
                </button>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: remainingColor }}>
                {isOver
                  ? `SGD ${Math.abs(remaining)} over budget`
                  : `SGD ${remaining} remaining`}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 8, background: 'var(--color-border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${pct}%`,
                background: barColor,
                borderRadius: 4,
                transition: 'width 0.35s ease, background 0.35s ease',
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '28px 24px 140px' }}>

        {/* Matched room card */}
        <div
          style={{
            background: 'var(--color-surface)',
            border: '1.5px solid var(--color-teal-border)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px 20px',
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div>
            <p style={{ fontSize: 11, color: 'var(--color-teal)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
              Best match for your selections
            </p>
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-text-primary)', fontFamily: 'var(--font-display)', marginBottom: 3 }}>
              {matchedRoom.name}
            </p>
            <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
              {matchedRoom.tagline}
            </p>
          </div>
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <p style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-text-primary)' }}>
              SGD {pricePerNight}
              <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--color-text-secondary)' }}>/night</span>
            </p>
            <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              SGD {priceTrip} for 3 nights
            </p>
          </div>
        </div>

        {/* Conflict warning */}
        {activeConflict && (
          <div
            style={{
              background: '#FFF4E5',
              border: '1px solid #F59E0B',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              fontSize: 13,
              color: '#92400E',
              marginBottom: 24,
            }}
          >
            ⚠️ {activeConflict.message}
          </div>
        )}

        {/* Attribute groups */}
        {ATTR_GROUPS.map((group) => {
          const groupAttrs = group.ids.map((id) => attributes.find((a) => a.id === id)).filter(Boolean)
          return (
            <div key={group.label} style={{ marginBottom: 24 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'var(--color-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.07em',
                  marginBottom: 10,
                }}
              >
                {group.label}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {groupAttrs.flatMap((attr) => renderPills(attr))}
              </div>
            </div>
          )
        })}

        {/* Over-budget warning */}
        {isOver && (
          <p style={{ fontSize: 13, color: '#E24B4A', marginBottom: 12, fontWeight: 500 }}>
            You're SGD {Math.abs(remaining)} {budgetMode === 'nightly' ? 'per night' : 'total'} over your budget. You can still continue.
          </p>
        )}

        {/* Done button */}
        <button
          onClick={() => navigate('/')}
          style={{
            width: '100%',
            padding: '15px',
            background: 'var(--color-text-primary)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          className="transition-opacity hover:opacity-90"
        >
          Done — back to explorer
        </button>
      </div>
    </div>
  )
}
