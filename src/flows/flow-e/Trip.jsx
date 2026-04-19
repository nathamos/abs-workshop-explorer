import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { serviceCategories } from '../../data/services'
import AttributePill from '../../components/shared/AttributePill'

// ─── Module-level helpers ────────────────────────────────────────────────────

const STANDARD_IDS = new Set(['daily-breakfast', 'daily-housekeeping', 'gym-access'])

function buildServiceMap() {
  const map = {}
  serviceCategories.forEach((cat) => {
    cat.items.forEach((item) => { map[item.id] = item })
  })
  return map
}
const SERVICE_MAP = buildServiceMap()

// ─── Label helpers for fixed room attributes (display only) ─────────────────

function beddingLabel(bedding) {
  const labels = { king: 'King bed', queen: 'Queen bed', twin: 'Twin beds', double: 'Double bed', sofa: 'Sofa bed' }
  if (Array.isArray(bedding)) return bedding.map((v) => labels[v] ?? v).join(' · ')
  return labels[bedding] ?? String(bedding)
}

function viewLabel(view) {
  return { courtyard: 'Courtyard view', city: 'City view', marina: 'Marina view' }[view] ?? view
}

function bathroomLabel(bathroom) {
  return {
    shower: 'Shower',
    bathtub: 'Bathtub + shower',
    'sep-bath-walkin': 'Separate bath + walk-in shower',
  }[bathroom] ?? bathroom
}

function floorLabel(floor) {
  return { low: 'Low floor · Floors 1–5', mid: 'Mid floor · Floors 6–12', high: 'High floor · Floors 13–20' }[floor] ?? floor
}

function pillowLabel(pillows) {
  return { standard: 'Standard', firm: 'Firm', feather: 'Feather', 'memory-foam': 'Memory foam' }[pillows] ?? pillows
}

// ─── Preference options (hotel can honour for any room) ──────────────────────

const FLOOR_OPTS = [
  { value: 'low',  label: 'Low floor' },
  { value: 'mid',  label: 'Mid floor' },
  { value: 'high', label: 'High floor' },
]

const PILLOW_OPTS = [
  { value: 'standard',    label: 'Standard' },
  { value: 'firm',        label: 'Firm' },
  { value: 'feather',     label: 'Feather' },
  { value: 'memory-foam', label: 'Memory foam' },
]

// ─── Sub-components ──────────────────────────────────────────────────────────

function AttrRow({ label, value }) {
  return (
    <div className="flex items-center justify-between" style={{ paddingTop: 10 }}>
      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{value}</span>
    </div>
  )
}

function PillRow({ label, opts, value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
        {label}
      </div>
      <div className="flex flex-wrap gap-2">
        {opts.map((opt) => (
          <AttributePill
            key={opt.value}
            label={opt.label}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────

export default function Trip() {
  const { selectedRoom, roomAttrs, setters, myServices, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  const [isCustomising, setIsCustomising] = useState(false)
  const [draftAttrs, setDraftAttrs] = useState(() => roomAttrs)

  function setDraftAttr(key, value) {
    setDraftAttrs((prev) => ({ ...prev, [key]: value }))
  }
  function saveCustomise() {
    setters.setRoomAttrs(draftAttrs)
    setIsCustomising(false)
  }
  function cancelCustomise() {
    setDraftAttrs(roomAttrs)
    setIsCustomising(false)
  }

  // ── Itinerary summary ────────────────────────────────────────────────────
  const userAddedServices = myServices.filter((s) => !STANDARD_IDS.has(s.id))
  const totalItems = userAddedServices.length

  // ── Pricing ──────────────────────────────────────────────────────────────
  const nights = bookingContext.nights
  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0
  const servicesTotal = myServices.reduce((sum, { id }) => sum + (SERVICE_MAP[id]?.price || 0), 0)
  const grandTotal = roomTotal + servicesTotal

  // ── Date labels ──────────────────────────────────────────────────────────
  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)
  const checkInLabel  = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  function dayShortLabel(dayIndex) {
    const d = new Date(checkIn)
    d.setDate(d.getDate() + dayIndex)
    return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  }

  const stayDays = Array.from({ length: nights }, (_, i) => i)

  const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    marginBottom: 12,
  }

  return (
    <div style={{ paddingBottom: selectedRoom ? 100 : 40 }}>

      {/* ── Property header ──────────────────────────────────────────── */}
      <div style={{ marginBottom: 20 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
          {bookingContext.property} · {bookingContext.location}
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {checkInLabel} – {checkOutLabel}
          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
            {' '}· {nights} nights · {bookingContext.guests} guests
          </span>
        </p>
      </div>

      {/* ── Room card ────────────────────────────────────────────────── */}
      <div style={cardStyle}>
        {!selectedRoom ? (
          <button
            onClick={() => navigate('/flow-e/rooms')}
            className="w-full text-left"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: 'var(--color-surface-alt)' }}>
              <span style={{ fontSize: 36 }}>🏨</span>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                  Select your room
                </div>
                <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                  {bookingContext.property}, {bookingContext.location} · {rooms_count} room types available
                </div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-teal)', background: 'var(--color-teal-light)', padding: '8px 20px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-teal)' }}>
                Browse rooms →
              </div>
            </div>
          </button>
        ) : (
          <>
            <img
              src={selectedRoom.image}
              alt={selectedRoom.name}
              style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
            />
            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 3 }}>
                {selectedRoom.name} at {bookingContext.property}
              </div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 14 }}>
                {selectedRoom.tagline}
              </div>

              <AnimatePresence initial={false} mode="wait">
                {!isCustomising ? (
                  <motion.div
                    key="view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {/* ── Fixed room facts ── */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 2, marginBottom: 16 }}>
                      <AttrRow label="Bed"      value={beddingLabel(selectedRoom.attributes.bedding)} />
                      <AttrRow label="View"     value={viewLabel(selectedRoom.attributes.view)} />
                      <AttrRow label="Bathroom" value={bathroomLabel(selectedRoom.attributes.bathroom)} />
                    </div>
                    {/* ── User preferences ── */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginBottom: 16 }}>
                      <AttrRow label="Floor"   value={floorLabel(roomAttrs.floor)} />
                      <AttrRow label="Pillows" value={pillowLabel(roomAttrs.pillows)} />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/flow-e/rooms')}
                        style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 13, fontWeight: 500, padding: '9px 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      >
                        Change room
                      </button>
                      <button
                        onClick={() => { setDraftAttrs(roomAttrs); setIsCustomising(true) }}
                        style={{ flex: 1, background: 'var(--color-teal-light)', color: 'var(--color-teal)', fontSize: 13, fontWeight: 600, padding: '9px 0', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-teal)', cursor: 'pointer' }}
                      >
                        + Customise
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="customise"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 16, borderTop: '1px solid var(--color-border)', paddingTop: 14 }}>
                      Your preferences
                    </div>
                    <PillRow label="Floor"   opts={FLOOR_OPTS}  value={draftAttrs.floor}   onChange={(v) => setDraftAttr('floor', v)} />
                    <PillRow label="Pillows" opts={PILLOW_OPTS} value={draftAttrs.pillows} onChange={(v) => setDraftAttr('pillows', v)} />
                    <div className="flex gap-3" style={{ marginTop: 6 }}>
                      <button
                        onClick={saveCustomise}
                        style={{ flex: 1, background: 'var(--color-teal)', color: '#fff', fontSize: 14, fontWeight: 600, padding: '12px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelCustomise}
                        style={{ flex: 1, background: 'transparent', color: 'var(--color-text-secondary)', fontSize: 14, fontWeight: 500, padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      {/* ── My Itinerary preview card ─────────────────────────────────── */}
      <button
        onClick={() => navigate('/flow-e/itinerary')}
        className="w-full text-left"
        style={{ ...cardStyle, border: '1px solid var(--color-border)', background: 'var(--color-surface)', display: 'block', cursor: 'pointer' }}
      >
        <div className="flex items-center justify-between" style={{ padding: '16px 20px 14px' }}>
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 16 }}>📅</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>My Itinerary</span>
          </div>
          {totalItems > 0 && (
            <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)' }}>
          {stayDays.map((dayIdx) => {
            const dayServices = userAddedServices.filter((s) => s.day === dayIdx)
            return (
              <div key={dayIdx} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <div style={{ padding: '7px 20px', background: 'var(--color-surface-alt)', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
                  {dayShortLabel(dayIdx)}
                </div>
                {dayServices.length === 0 ? (
                  <div style={{ padding: '8px 20px', fontSize: 12, color: 'var(--color-text-tertiary)' }}>
                    Nothing added yet
                  </div>
                ) : (
                  dayServices.map(({ id, time }) => {
                    const svc = SERVICE_MAP[id]
                    if (!svc) return null
                    return (
                      <div key={`${id}-${time}`} className="flex items-center justify-between" style={{ padding: '7px 20px' }}>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 14 }}>{svc.emoji}</span>
                          <span style={{ fontSize: 13, color: 'var(--color-text-primary)' }}>{svc.name}</span>
                        </div>
                        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{time}</span>
                      </div>
                    )
                  })
                )}
              </div>
            )
          })}
        </div>

        <div style={{ padding: '14px 20px', fontSize: 13, fontWeight: 600, color: 'var(--color-teal)' }}>
          {totalItems > 0 ? 'Edit itinerary →' : 'Build your itinerary →'}
        </div>
      </button>

      {/* ── Sticky bottom bar ─────────────────────────────────────────── */}
      {selectedRoom && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', zIndex: 40 }}>
          <div className="max-w-[800px] mx-auto flex items-center justify-between" style={{ padding: '16px 24px' }}>
            <div>
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
                {nights} nights · {totalItems} item{totalItems !== 1 ? 's' : ''}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                SGD {grandTotal}
              </div>
            </div>
            <button
              onClick={() => navigate('/flow-e/confirmation')}
              style={{ background: 'var(--color-text-primary)', color: '#fff', fontSize: 15, fontWeight: 600, padding: '14px 28px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer' }}
              className="transition-opacity hover:opacity-90"
            >
              Review trip →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Static count of available room types
const rooms_count = 5
