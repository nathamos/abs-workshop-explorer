import { useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import StepHeader from '../../components/shared/StepHeader'
import AttributePill from '../../components/shared/AttributePill'
import { rooms } from '../../data/rooms'
import { attributes, conflicts } from '../../data/attributes'

const NIGHTS = 3

const sectionGroups = [
  {
    label: 'YOUR BED',
    ids: ['bedding'],
  },
  {
    label: 'YOUR ROOM',
    ids: ['roomCategory', 'floor', 'view', 'balcony', 'bathroom', 'kitchen'],
  },
  {
    label: 'YOUR STAY',
    ids: ['occupancy', 'facilityAccess', 'laundry'],
  },
  {
    label: 'ROOM REQUIREMENTS',
    ids: ['smoking', 'accessibility'],
  },
]

function getMatchedRoom(selectedAttributes) {
  let bestRoom = rooms[0]
  let bestScore = -1
  for (const room of rooms) {
    let score = 0
    for (const key of Object.keys(selectedAttributes)) {
      if (room.attributes[key] === selectedAttributes[key]) score++
    }
    if (score > bestScore) {
      bestScore = score
      bestRoom = room
    }
  }
  return bestRoom
}

function getActiveConflict(selectedAttributes) {
  for (const conflict of conflicts) {
    const allMatch = conflict.attributes.every((entry) => {
      const [key, rawVal] = entry.split(':')
      let val
      if (rawVal === 'true') val = true
      else if (rawVal === 'false') val = false
      else if (!isNaN(Number(rawVal))) val = Number(rawVal)
      else val = rawVal
      return selectedAttributes[key] === val
    })
    if (allMatch) return conflict
  }
  return null
}

function calcRoomBase(matchedRoom, selectedAttributes) {
  const base = matchedRoom.basePricePerNight * NIGHTS
  let deltas = 0
  for (const attr of attributes) {
    const selectedVal = selectedAttributes[attr.id]
    if (selectedVal === undefined) continue
    const opt = attr.options.find((o) => o.value === selectedVal)
    if (opt && opt.priceDelta && opt.priceDelta > 0) {
      deltas += opt.priceDelta
    }
  }
  return base + deltas * NIGHTS
}

export default function Rooms() {
  const { selectedAttributes, setSelectedAttributes, setSelectedRoom, priced } = useOutletContext()
  const navigate = useNavigate()

  const matchedRoom = useMemo(() => getMatchedRoom(selectedAttributes), [selectedAttributes])
  const activeConflict = useMemo(() => getActiveConflict(selectedAttributes), [selectedAttributes])
  const roomBase = useMemo(() => calcRoomBase(matchedRoom, selectedAttributes), [matchedRoom, selectedAttributes])

  function handlePillClick(attrId, value) {
    setSelectedAttributes((prev) => ({ ...prev, [attrId]: value }))
  }

  function handleBook() {
    if (activeConflict) return
    setSelectedRoom(matchedRoom)
    navigate('../services')
  }

  // Collect selected pills for display
  const selectedPills = useMemo(() => {
    const pills = []
    for (const attr of attributes) {
      const val = selectedAttributes[attr.id]
      if (val === undefined) continue
      const opt = attr.options.find((o) => o.value === val)
      if (opt) pills.push({ label: opt.label, emoji: opt.emoji })
    }
    return pills
  }, [selectedAttributes])

  // Collect priced line items
  const pricedLines = useMemo(() => {
    if (!priced) return []
    const lines = []
    for (const attr of attributes) {
      const val = selectedAttributes[attr.id]
      if (val === undefined) continue
      const opt = attr.options.find((o) => o.value === val)
      if (opt && opt.priceDelta && opt.priceDelta > 0) {
        lines.push({ label: opt.label, delta: opt.priceDelta * NIGHTS })
      }
    }
    return lines
  }, [selectedAttributes, priced])

  const baseRateTotal = matchedRoom.basePricePerNight * NIGHTS

  return (
    <div className="max-w-[1000px] mx-auto">
      <div
        className="flex gap-6 px-6 py-8 items-start"
        style={{ flexDirection: 'row' }}
      >
        {/* Left column — attribute checklist */}
        <div style={{ flex: '0 0 55%', paddingBottom: '120px' }}>
          <StepHeader
            step={1}
            totalSteps={3}
            title="Build your room"
            subtitle="Choose the attributes that matter to you."
          />

          <div className="flex flex-col gap-8">
            {sectionGroups.map((group) => (
              <div key={group.label}>
                <p
                  className="mb-4"
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: '0.12em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {group.label}
                </p>
                <div className="flex flex-col gap-5">
                  {group.ids.map((attrId) => {
                    const attr = attributes.find((a) => a.id === attrId)
                    if (!attr) return null
                    return (
                      <div key={attrId}>
                        <p
                          className="mb-2"
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {attr.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {attr.options.map((opt) => (
                            <AttributePill
                              key={String(opt.value)}
                              label={opt.label}
                              emoji={opt.emoji}
                              selected={selectedAttributes[attrId] === opt.value}
                              onClick={() => handlePillClick(attrId, opt.value)}
                              priceDelta={opt.priceDelta}
                              showPrice={priced}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — booking card */}
        <div style={{ flex: '0 0 45%', position: 'sticky', top: '24px' }}>
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <p
              style={{
                fontSize: '11px',
                color: 'var(--color-text-tertiary)',
                letterSpacing: '0.12em',
                fontWeight: 600,
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}
            >
              YOUR ROOM
            </p>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                color: 'var(--color-text-primary)',
                marginBottom: '4px',
              }}
            >
              {matchedRoom.name}
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-secondary)', marginBottom: '8px' }}>
              {matchedRoom.tagline}
            </p>
            <img
              src={matchedRoom.image}
              alt={matchedRoom.name}
              className="w-full object-cover rounded-lg mt-2"
              style={{ height: '144px', borderRadius: 'var(--radius-md)' }}
            />

            {/* Unpriced: pill list */}
            {!priced && (
              <div className="mt-4">
                <p
                  style={{
                    fontSize: '11px',
                    color: 'var(--color-text-tertiary)',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    marginBottom: '8px',
                  }}
                >
                  Selected attributes
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPills.map((pill, i) => (
                    <span
                      key={i}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-teal-light)',
                        color: 'var(--color-teal)',
                        fontSize: '12px',
                        fontWeight: 500,
                      }}
                    >
                      {pill.emoji && <span>{pill.emoji}</span>}
                      {pill.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Priced: itemised breakdown */}
            {priced && (
              <div className="mt-4">
                <div
                  className="flex justify-between text-sm"
                  style={{ marginBottom: '8px' }}
                >
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    Base rate ({NIGHTS} nights)
                  </span>
                  <span style={{ color: 'var(--color-text-primary)' }}>SGD {baseRateTotal}</span>
                </div>

                {pricedLines.length > 0 && (
                  <>
                    <div
                      style={{
                        height: '1px',
                        background: 'var(--color-border)',
                        marginBottom: '8px',
                      }}
                    />
                    {pricedLines.map((line, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm"
                        style={{ marginBottom: '6px' }}
                      >
                        <span style={{ color: 'var(--color-text-secondary)' }}>{line.label}</span>
                        <span style={{ color: 'var(--color-addprice)' }}>+SGD {line.delta}</span>
                      </div>
                    ))}
                  </>
                )}

                <div
                  style={{
                    height: '1px',
                    background: 'var(--color-border)',
                    margin: '10px 0',
                  }}
                />
                <div className="flex justify-between text-sm font-semibold">
                  <span style={{ color: 'var(--color-text-primary)' }}>Room total</span>
                  <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomBase}</span>
                </div>
              </div>
            )}

            {/* Conflict alert */}
            {activeConflict && (
              <div
                className="mt-4"
                style={{
                  background: 'var(--color-danger-light)',
                  border: '1px solid var(--color-danger)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                }}
              >
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--color-danger)' }}
                >
                  ⚠ Conflict detected
                </p>
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>
                  {activeConflict.message}
                </p>
              </div>
            )}

            {/* CTA */}
            <button
              onClick={handleBook}
              disabled={!!activeConflict}
              className="w-full text-base font-semibold text-white transition-opacity hover:opacity-90 mt-4"
              style={{
                background: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                opacity: activeConflict ? 0.5 : 1,
                cursor: activeConflict ? 'not-allowed' : 'pointer',
              }}
            >
              Book this room →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
