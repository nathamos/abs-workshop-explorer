import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { serviceCategories } from '../../data/services'
import { SERVICE_TIMING } from './serviceTiming'

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildServiceMap() {
  const map = {}
  serviceCategories.forEach((cat) => {
    cat.items.forEach((item) => { map[item.id] = item })
  })
  return map
}
const SERVICE_MAP = buildServiceMap()

const TIME_SLOTS = [
  { id: 'morning',   label: 'Morning',   emoji: '🌅' },
  { id: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { id: 'evening',   label: 'Evening',   emoji: '🌙' },
]

// ─── Service Sheet ───────────────────────────────────────────────────────────
// Opens when a "+" is tapped. Adds selected service to the chosen day+time slot.

function ServiceSheet({ slot, myServices, onAdd, onClose }) {
  const [openCat, setOpenCat] = useState(null)

  // Already-added IDs for this slot
  const slotIds = new Set(
    myServices.filter((s) => s.day === slot.day && s.time === slot.time).map((s) => s.id)
  )

  function handleToggle(item) {
    if (slotIds.has(item.id)) {
      // Remove from this slot
      onAdd(item, 'remove')
    } else {
      onAdd(item, 'add')
    }
  }

  const timeLabel = TIME_SLOTS.find((t) => t.id === slot.time)?.label ?? slot.time

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 50 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '82vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: 'var(--color-border)', borderRadius: 2, margin: '16px auto 0', flexShrink: 0 }} />

        {/* Header */}
        <div className="flex items-center justify-between" style={{ padding: '14px 20px 12px', flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Add to {slot.dayLabel}
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              {timeLabel} · tap to add or remove
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-teal)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              padding: '8px 18px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Done
          </button>
        </div>

        {/* Categories */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {serviceCategories.map((cat) => {
            const isOpen = openCat === cat.id
            return (
              <div key={cat.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                <button
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                  className="w-full text-left flex items-center justify-between"
                  style={{ padding: '13px 20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 15 }}>{cat.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>{cat.label}</span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'inline-block', color: 'var(--color-text-tertiary)', fontSize: 18 }}
                  >
                    ›
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: 'easeInOut' }}
                      style={{ overflow: 'hidden' }}
                    >
                      {cat.items.map((item) => {
                        const isAdded = slotIds.has(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => handleToggle(item)}
                            className="w-full text-left flex items-start justify-between"
                            style={{
                              padding: '11px 20px 11px 44px',
                              background: isAdded ? 'var(--color-teal-light)' : 'transparent',
                              border: 'none',
                              borderTop: '1px solid var(--color-border)',
                              cursor: 'pointer',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 'var(--radius-md)',
                                  background: isAdded ? '#fff' : 'var(--color-surface-alt)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 16,
                                  flexShrink: 0,
                                }}
                              >
                                {item.emoji}
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                                  {item.name}
                                </div>
                                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                                  {item.description}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 ml-3 mt-1">
                              <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
                                {item.price === 0 ? 'Incl.' : `+SGD ${item.price}`}
                              </span>
                              <div
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: '50%',
                                  border: isAdded ? '1.5px solid var(--color-teal)' : '1.5px solid var(--color-border)',
                                  background: isAdded ? 'var(--color-teal)' : 'transparent',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontSize: 12,
                                  flexShrink: 0,
                                }}
                              >
                                {isAdded ? '✓' : ''}
                              </div>
                            </div>
                          </button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
          <div style={{ height: 32 }} />
        </div>
      </motion.div>
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Itinerary() {
  const { myServices, setters, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  // pickerSlot: { day, time, dayLabel } | null
  const [pickerSlot, setPickerSlot] = useState(null)

  function openPicker(day, time, dayLabel) {
    setPickerSlot({ day, time, dayLabel })
  }

  function handleServiceToggle(item, action) {
    if (action === 'add') {
      setters.setMyServices((prev) => [
        ...prev,
        { id: item.id, day: pickerSlot.day, time: pickerSlot.time },
      ])
    } else {
      setters.setMyServices((prev) =>
        prev.filter((s) => !(s.id === item.id && s.day === pickerSlot.day && s.time === pickerSlot.time))
      )
    }
  }

  function removeService(id, day, time) {
    setters.setMyServices((prev) =>
      prev.filter((s) => !(s.id === id && s.day === day && s.time === time))
    )
  }

  // ── Dates ────────────────────────────────────────────────────────────────
  const checkIn = new Date(bookingContext.checkIn)
  const nights  = bookingContext.nights

  // Build all itinerary days: stay nights + check-out day
  const allDays = Array.from({ length: nights + 1 }, (_, i) => {
    const d = new Date(checkIn)
    d.setDate(d.getDate() + i)
    const isCheckout = i === nights
    return {
      dayIndex: i,
      isCheckout,
      fullLabel: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }),
      shortLabel: d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }),
    }
  })

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Back */}
      <button
        onClick={() => navigate('/flow-e/trip')}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, color: 'var(--color-text-tertiary)', padding: '0 0 20px', display: 'block' }}
      >
        ← Back to trip
      </button>

      {/* Title */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 26, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
          My Itinerary
        </h2>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          {bookingContext.property} · {nights} nights
        </p>
      </div>

      {/* Day blocks */}
      {allDays.map(({ dayIndex, isCheckout, fullLabel, shortLabel }) => {
        // Check-out only shows morning
        const timeSlotsForDay = isCheckout
          ? TIME_SLOTS.filter((t) => t.id === 'morning')
          : TIME_SLOTS

        return (
          <div
            key={dayIndex}
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              marginBottom: 12,
            }}
          >
            {/* Day header */}
            <div
              style={{
                padding: '12px 20px',
                background: 'var(--color-surface-alt)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--color-text-primary)',
                }}
              >
                {isCheckout ? `Check-out · ${shortLabel}` : fullLabel}
              </span>
            </div>

            {/* Time slots */}
            {timeSlotsForDay.map((slot, slotIdx) => {
              const slotServices = myServices.filter(
                (s) => s.day === dayIndex && s.time === slot.id
              )

              return (
                <div
                  key={slot.id}
                  style={{
                    borderTop: slotIdx === 0 ? 'none' : '1px solid var(--color-border)',
                  }}
                >
                  {/* Time slot header */}
                  <div
                    className="flex items-center justify-between"
                    style={{ padding: '10px 20px 8px' }}
                  >
                    <div className="flex items-center gap-2">
                      <span style={{ fontSize: 14 }}>{slot.emoji}</span>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: 'var(--color-text-secondary)',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {slot.label}
                      </span>
                    </div>
                    {/* + button */}
                    <button
                      onClick={() => openPicker(dayIndex, slot.id, isCheckout ? `Check-out · ${shortLabel}` : shortLabel)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        border: '1.5px solid var(--color-teal)',
                        background: 'var(--color-teal-light)',
                        color: 'var(--color-teal)',
                        fontSize: 18,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        lineHeight: 1,
                        paddingBottom: 1,
                      }}
                    >
                      +
                    </button>
                  </div>

                  {/* Service items */}
                  {slotServices.length > 0 && (
                    <div style={{ paddingBottom: 8 }}>
                      {slotServices.map(({ id, day, time }) => {
                        const svc = SERVICE_MAP[id]
                        if (!svc) return null
                        return (
                          <div
                            key={`${id}-${day}-${time}`}
                            className="flex items-center justify-between"
                            style={{ padding: '8px 20px 8px 48px' }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 'var(--radius-sm)',
                                  background: 'var(--color-surface-alt)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: 15,
                                  flexShrink: 0,
                                }}
                              >
                                {svc.emoji}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>
                                  {svc.name}
                                </div>
                                <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
                                  {svc.price === 0 ? 'Included' : `+SGD ${svc.price}`}
                                </div>
                              </div>
                            </div>
                            <button
                              onClick={() => removeService(id, day, time)}
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: '50%',
                                border: '1px solid var(--color-border)',
                                background: 'var(--color-surface-alt)',
                                color: 'var(--color-text-tertiary)',
                                fontSize: 14,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                flexShrink: 0,
                              }}
                            >
                              ×
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Empty state hint */}
                  {slotServices.length === 0 && (
                    <div style={{ padding: '2px 20px 12px 48px', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                      Nothing added yet
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )
      })}

      {/* Done */}
      <div style={{ marginTop: 8 }}>
        <button
          onClick={() => navigate('/flow-e/trip')}
          style={{
            width: '100%',
            background: 'var(--color-text-primary)',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            padding: '15px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
          }}
          className="transition-opacity hover:opacity-90"
        >
          Done — back to trip
        </button>
      </div>

      {/* Service picker sheet */}
      <AnimatePresence>
        {pickerSlot && (
          <ServiceSheet
            slot={pickerSlot}
            myServices={myServices}
            onAdd={handleServiceToggle}
            onClose={() => setPickerSlot(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
