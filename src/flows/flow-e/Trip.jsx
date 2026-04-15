import { useState, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { serviceCategories } from '../../data/services'
import AttributePill from '../../components/shared/AttributePill'
import { SERVICE_TIMING } from './serviceTiming'

// ─── Attribute helpers ──────────────────────────────────────────────────────

const FLOOR_OPTS  = [
  { value: 'low',  label: 'Low floor',  emoji: '🌱' },
  { value: 'mid',  label: 'Mid floor',  emoji: '🏙️' },
  { value: 'high', label: 'High floor', emoji: '☁️' },
]
const VIEW_OPTS = [
  { value: 'courtyard', label: 'Courtyard', emoji: '🌿' },
  { value: 'city',      label: 'City view',   emoji: '🏙️' },
  { value: 'marina',    label: 'Marina view', emoji: '🌊' },
]
const BED_OPTS = [
  { value: 'king',   label: 'King bed',   emoji: '🛏️' },
  { value: 'queen',  label: 'Queen bed',  emoji: '🛏️' },
  { value: 'twin',   label: 'Twin beds',  emoji: '👫' },
  { value: 'double', label: 'Double bed', emoji: '🛏️' },
  { value: 'sofa',   label: 'Sofa bed',   emoji: '🛋️' },
]
const BATH_OPTS = [
  { value: 'shower',          label: 'Shower',                         emoji: '🚿' },
  { value: 'bathtub',         label: 'Bathtub + shower',               emoji: '🛁' },
  { value: 'sep-bath-walkin', label: 'Separate bath + walk-in shower', emoji: '🛁' },
]

function attrLabel(key, value) {
  const maps = {
    floor:    { low: 'Low floor · Floors 1–5', mid: 'Mid floor · Floors 6–12', high: 'High floor · Floors 13–20' },
    view:     { courtyard: 'Courtyard view', city: 'City view', marina: 'Marina view' },
    bedding:  { king: 'King bed', queen: 'Queen bed', twin: 'Twin beds', double: 'Double bed', sofa: 'Sofa bed' },
    bathroom: { shower: 'Shower', bathtub: 'Bathtub + shower', 'sep-bath-walkin': 'Walk-in shower' },
  }
  return maps[key]?.[value] ?? String(value)
}

function extrasLabel(attrs) {
  const parts = []
  if (attrs.balcony)      parts.push('Balcony')
  if (attrs.livingArea)   parts.push('Separate lounge')
  if (attrs.coffeeMachine) parts.push('Nespresso')
  return parts.join(' · ') || null
}

// ─── Service helpers ────────────────────────────────────────────────────────

function buildServiceMap() {
  const map = {}
  serviceCategories.forEach((cat) => {
    cat.items.forEach((item) => { map[item.id] = item })
  })
  return map
}
const SERVICE_MAP = buildServiceMap()

// Groups selected service IDs into chronological slots (0–3)
function groupBySlot(serviceIds) {
  const groups = { 0: [], 1: [], 2: [], 3: [] }
  serviceIds.forEach((id) => {
    const timing = SERVICE_TIMING[id]
    const slot = timing ? timing.slot : 0
    groups[slot].push(id)
  })
  return groups
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SectionCard({ children }) {
  return (
    <div
      style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  )
}

function SectionHeader({ emoji, label, actionLabel, onAction, isOpen, onToggle }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ padding: '16px 20px' }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 16 }}>{emoji}</span>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--color-text-primary)' }}>
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3">
        {actionLabel && (
          <button
            onClick={(e) => { e.stopPropagation(); onAction() }}
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--color-teal)',
              background: 'var(--color-teal-light)',
              border: '1px solid var(--color-teal)',
              borderRadius: 'var(--radius-full)',
              padding: '5px 12px',
              cursor: 'pointer',
            }}
          >
            {actionLabel}
          </button>
        )}
        <motion.span
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          onClick={onToggle}
          style={{ display: 'inline-block', color: 'var(--color-text-tertiary)', fontSize: 18, cursor: 'pointer' }}
        >
          ›
        </motion.span>
      </div>
    </div>
  )
}

function AttrRow({ icon, label, value }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{
        padding: '11px 20px',
        borderTop: '1px solid var(--color-border)',
      }}
    >
      <div className="flex items-center gap-2">
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>{label}</span>
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
        {value}
      </span>
    </div>
  )
}

function ServiceItem({ serviceId, when, onRemove }) {
  const svc = SERVICE_MAP[serviceId]
  if (!svc) return null
  const priceLabel = svc.price === 0 ? 'Included' : `+SGD ${svc.price}`

  return (
    <div
      className="flex items-start justify-between"
      style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border)' }}
    >
      <div className="flex items-start gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 'var(--radius-md)',
            background: 'var(--color-surface-alt)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {svc.emoji}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
            {svc.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>
            {when}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
          {priceLabel}
        </span>
        <button
          onClick={() => onRemove(serviceId)}
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface-alt)',
            color: 'var(--color-text-tertiary)',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          ×
        </button>
      </div>
    </div>
  )
}

function SlotHeader({ label }) {
  return (
    <div
      style={{ padding: '10px 20px', borderTop: '1px solid var(--color-border)' }}
    >
      <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
        {label}
      </span>
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
            emoji={opt.emoji}
            selected={value === opt.value}
            onClick={() => onChange(opt.value)}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Service Sheet ──────────────────────────────────────────────────────────

function ServiceSheet({ myServices, onToggle, onClose }) {
  const [openCat, setOpenCat] = useState(null)

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
        {/* Sheet header */}
        <div
          className="flex items-center justify-between"
          style={{ padding: '20px 20px 16px', flexShrink: 0 }}
        >
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}>
              Add to your stay
            </div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Tap an item to add or remove it
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

        {/* Drag handle */}
        <div style={{ width: 40, height: 4, background: 'var(--color-border)', borderRadius: 2, margin: '0 auto 12px', flexShrink: 0 }} />

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {serviceCategories.map((cat) => {
            const isOpen = openCat === cat.id
            return (
              <div key={cat.id} style={{ borderTop: '1px solid var(--color-border)' }}>
                {/* Category header */}
                <button
                  onClick={() => setOpenCat(isOpen ? null : cat.id)}
                  className="w-full text-left flex items-center justify-between"
                  style={{ padding: '14px 20px', background: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 16 }}>{cat.emoji}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text-primary)' }}>
                      {cat.label}
                    </span>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.18 }}
                    style={{ display: 'inline-block', color: 'var(--color-text-tertiary)', fontSize: 18 }}
                  >
                    ›
                  </motion.span>
                </button>

                {/* Category items */}
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
                        const isAdded = myServices.includes(item.id)
                        return (
                          <button
                            key={item.id}
                            onClick={() => onToggle(item.id)}
                            className="w-full text-left flex items-start justify-between"
                            style={{
                              padding: '12px 20px 12px 44px',
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

// ─── Main component ─────────────────────────────────────────────────────────

export default function Trip() {
  const { selectedRoom, roomAttrs, setters, myServices, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  const [isRoomOpen, setIsRoomOpen]       = useState(true)
  const [isCustomising, setIsCustomising] = useState(false)
  const [isStayOpen, setIsStayOpen]       = useState(true)
  const [showSheet, setShowSheet]         = useState(false)

  // Local copy of attrs for editing; committed on Save
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

  function toggleService(id) {
    setters.setMyServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function removeService(id) {
    setters.setMyServices((prev) => prev.filter((s) => s !== id))
  }

  // ── Pricing ──────────────────────────────────────────────────────────────
  const nights = bookingContext.nights
  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0
  const servicesTotal = myServices.reduce((sum, id) => sum + (SERVICE_MAP[id]?.price || 0), 0)
  const grandTotal = roomTotal + servicesTotal
  const extrasCount = myServices.filter((id) => !['gym-access'].includes(id) || true).length

  // ── Date labels ──────────────────────────────────────────────────────────
  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)

  function slotDate(slot) {
    const d = new Date(checkIn)
    d.setDate(d.getDate() + slot)
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  }

  const slotMeta = [
    { key: 0, label: 'Check-in',  date: slotDate(0) },
    { key: 1, label: null,        date: slotDate(1) },
    { key: 2, label: null,        date: slotDate(2) },
    { key: 3, label: 'Check-out', date: slotDate(3) },
  ]

  // ── Chronological grouping ───────────────────────────────────────────────
  const grouped = useMemo(() => groupBySlot(myServices), [myServices])

  // Active attrs (either draft if customising, else committed)
  const displayAttrs = isCustomising ? draftAttrs : roomAttrs

  const checkInLabel  = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  if (!selectedRoom) {
    return (
      <div style={{ paddingTop: 40, textAlign: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>No room selected yet.</p>
        <button
          onClick={() => navigate('/flow-e/rooms')}
          style={{
            background: 'var(--color-text-primary)',
            color: '#fff',
            padding: '12px 24px',
            borderRadius: 'var(--radius-md)',
            border: 'none',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Choose a room →
        </button>
      </div>
    )
  }

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Back link */}
      <button
        onClick={() => navigate('/flow-e/rooms')}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: 13,
          color: 'var(--color-text-tertiary)',
          padding: '0 0 20px',
          display: 'block',
        }}
      >
        ← Change room
      </button>

      {/* Property header */}
      <div style={{ marginBottom: 20 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 4,
          }}
        >
          {bookingContext.property} · {bookingContext.location}
        </p>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--color-text-primary)' }}>
          {checkInLabel} – {checkOutLabel}
          <span style={{ color: 'var(--color-text-tertiary)', fontWeight: 400 }}>
            {' '}· {nights} nights · {bookingContext.guests} guests
          </span>
        </p>
      </div>

      {/* Room image + name */}
      <SectionCard>
        <img
          src={selectedRoom.image}
          alt={selectedRoom.name}
          style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
        />
        <div style={{ padding: '16px 20px 18px' }}>
          <div
            style={{
              fontSize: 22,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: 4,
            }}
          >
            {selectedRoom.name}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            {selectedRoom.tagline}
          </div>
        </div>
      </SectionCard>

      {/* ── My room ─────────────────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          emoji="🛏️"
          label="My room"
          actionLabel={isCustomising ? null : '+ Customise'}
          onAction={() => { setIsRoomOpen(true); setIsCustomising(true) }}
          isOpen={isRoomOpen}
          onToggle={() => { setIsRoomOpen((v) => !v); if (isCustomising) cancelCustomise() }}
        />

        <AnimatePresence initial={false}>
          {isRoomOpen && (
            <motion.div
              key="room-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {!isCustomising ? (
                /* View mode — attribute rows */
                <div>
                  <AttrRow icon="🏢" label="Location"  value={attrLabel('floor',    displayAttrs.floor)} />
                  <AttrRow icon="🌇" label="View"      value={attrLabel('view',     displayAttrs.view)} />
                  <AttrRow icon="🛏️" label="Bed"       value={attrLabel('bedding',  displayAttrs.bedding)} />
                  <AttrRow icon="🚿" label="Bathroom"  value={attrLabel('bathroom', displayAttrs.bathroom)} />
                  {extrasLabel(displayAttrs) && (
                    <AttrRow icon="✨" label="Extras" value={extrasLabel(displayAttrs)} />
                  )}
                </div>
              ) : (
                /* Customise mode — attribute pickers */
                <div style={{ padding: '4px 20px 20px', borderTop: '1px solid var(--color-border)' }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      color: 'var(--color-text-tertiary)',
                      marginBottom: 16,
                      marginTop: 16,
                    }}
                  >
                    Customise your room
                  </div>

                  <PillRow label="Floor"    opts={FLOOR_OPTS} value={draftAttrs.floor}    onChange={(v) => setDraftAttr('floor', v)} />
                  <PillRow label="View"     opts={VIEW_OPTS}  value={draftAttrs.view}     onChange={(v) => setDraftAttr('view', v)} />
                  <PillRow label="Bed type" opts={BED_OPTS}   value={draftAttrs.bedding}  onChange={(v) => setDraftAttr('bedding', v)} />
                  <PillRow label="Bathroom" opts={BATH_OPTS}  value={draftAttrs.bathroom} onChange={(v) => setDraftAttr('bathroom', v)} />

                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
                      Extras
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { key: 'balcony',       label: 'Private balcony',  emoji: '🌅' },
                        { key: 'livingArea',    label: 'Separate lounge',  emoji: '🛋️' },
                        { key: 'coffeeMachine', label: 'Nespresso',        emoji: '☕' },
                      ].map((extra) => (
                        <AttributePill
                          key={extra.key}
                          label={extra.label}
                          emoji={extra.emoji}
                          selected={!!draftAttrs[extra.key]}
                          onClick={() => setDraftAttr(extra.key, !draftAttrs[extra.key])}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={saveCustomise}
                      style={{
                        flex: 1,
                        background: 'var(--color-teal)',
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelCustomise}
                      style={{
                        flex: 1,
                        background: 'transparent',
                        color: 'var(--color-text-secondary)',
                        fontSize: 14,
                        fontWeight: 500,
                        padding: '12px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-border)',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* ── My stay ─────────────────────────────────────────────────────── */}
      <SectionCard>
        <SectionHeader
          emoji="📅"
          label="My stay"
          actionLabel="+ Add more"
          onAction={() => setShowSheet(true)}
          isOpen={isStayOpen}
          onToggle={() => setIsStayOpen((v) => !v)}
        />

        <AnimatePresence initial={false}>
          {isStayOpen && (
            <motion.div
              key="stay-body"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              {myServices.length === 0 ? (
                <div
                  style={{
                    padding: '24px 20px',
                    borderTop: '1px solid var(--color-border)',
                    textAlign: 'center',
                    color: 'var(--color-text-tertiary)',
                    fontSize: 14,
                  }}
                >
                  No items yet — tap "+ Add more" to build your itinerary.
                </div>
              ) : (
                slotMeta.map((slot) => {
                  const ids = grouped[slot.key]
                  if (ids.length === 0) return null
                  const slotLabel = slot.label
                    ? `${slot.label} · ${slot.date}`
                    : slot.date

                  return (
                    <div key={slot.key}>
                      <SlotHeader label={slotLabel} />
                      {ids.map((id) => {
                        const timing = SERVICE_TIMING[id]
                        const when = timing?.when || ''
                        return (
                          <ServiceItem
                            key={id}
                            serviceId={id}
                            when={when}
                            onRemove={removeService}
                          />
                        )
                      })}
                    </div>
                  )
                })
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </SectionCard>

      {/* ── Sticky bottom bar ────────────────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderTop: '1px solid var(--color-border)',
          zIndex: 40,
        }}
      >
        <div
          className="max-w-[800px] mx-auto flex items-center justify-between"
          style={{ padding: '16px 24px' }}
        >
          <div>
            <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>
              {nights} nights · {extrasCount} item{extrasCount !== 1 ? 's' : ''}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-text-primary)' }}>
              SGD {grandTotal}
            </div>
          </div>
          <button
            onClick={() => navigate('/flow-e/confirmation')}
            style={{
              background: 'var(--color-text-primary)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 600,
              padding: '14px 28px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
            }}
            className="transition-opacity hover:opacity-90"
          >
            Review trip →
          </button>
        </div>
      </div>

      {/* ── Service sheet ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSheet && (
          <ServiceSheet
            myServices={myServices}
            onToggle={toggleService}
            onClose={() => setShowSheet(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
