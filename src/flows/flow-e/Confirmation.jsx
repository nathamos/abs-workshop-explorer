import { useOutletContext, useNavigate } from 'react-router-dom'
import { serviceCategories } from '../../data/services'
import { SERVICE_TIMING } from './serviceTiming'

function buildServiceMap() {
  const map = {}
  serviceCategories.forEach((cat) => {
    cat.items.forEach((item) => { map[item.id] = item })
  })
  return map
}
const SERVICE_MAP = buildServiceMap()

function attrLabel(key, value) {
  const maps = {
    floor:    { low: 'Low floor', mid: 'Mid floor', high: 'High floor' },
    view:     { courtyard: 'Courtyard view', city: 'City view', marina: 'Marina view' },
    bedding:  { king: 'King bed', queen: 'Queen bed', twin: 'Twin beds', double: 'Double bed', sofa: 'Sofa bed' },
    bathroom: { shower: 'Shower', bathtub: 'Bathtub + shower', 'sep-bath-walkin': 'Walk-in shower' },
  }
  return maps[key]?.[value] ?? String(value)
}

function groupBySlot(serviceIds) {
  const groups = { 0: [], 1: [], 2: [], 3: [] }
  serviceIds.forEach((id) => {
    const slot = SERVICE_TIMING[id]?.slot ?? 0
    groups[slot].push(id)
  })
  return groups
}

export default function Confirmation() {
  const { selectedRoom, roomAttrs, myServices, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  const nights = bookingContext.nights
  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)
  const checkInLabel  = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  const roomTotal     = selectedRoom ? selectedRoom.basePricePerNight * nights : 0
  const servicesTotal = myServices.reduce((sum, id) => sum + (SERVICE_MAP[id]?.price || 0), 0)
  const grandTotal    = roomTotal + servicesTotal

  const grouped = groupBySlot(myServices)

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

  const cardStyle = {
    background: 'var(--color-surface)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-lg)',
    overflow: 'hidden',
    marginBottom: 12,
  }

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>
          Review your trip
        </p>
        <h1 style={{ fontSize: 26, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', marginBottom: 4 }}>
          {bookingContext.property}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
          {checkInLabel} – {checkOutLabel} · {nights} nights · {bookingContext.guests} guests
        </p>
      </div>

      {/* Room card */}
      <div style={cardStyle}>
        {selectedRoom?.image && (
          <img
            src={selectedRoom.image}
            alt={selectedRoom?.name}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
          />
        )}
        <div style={{ padding: '16px 20px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 6 }}>
            Your room
          </div>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 12 }}>
            {selectedRoom?.name}
          </div>

          {/* Attribute rows */}
          {roomAttrs && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { icon: '🏢', label: 'Location', value: attrLabel('floor',    roomAttrs.floor) },
                { icon: '🌇', label: 'View',     value: attrLabel('view',     roomAttrs.view) },
                { icon: '🛏️', label: 'Bed',      value: attrLabel('bedding',  roomAttrs.bedding) },
                { icon: '🚿', label: 'Bathroom', value: attrLabel('bathroom', roomAttrs.bathroom) },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13 }}>{row.icon}</span>
                    <span style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{row.label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* My stay — itinerary */}
      <div style={cardStyle}>
        <div style={{ padding: '16px 20px 12px' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)' }}>
            Your stay
          </div>
        </div>

        {myServices.length === 0 ? (
          <div style={{ padding: '0 20px 20px', fontSize: 14, color: 'var(--color-text-tertiary)' }}>
            No add-ons selected.
          </div>
        ) : (
          slotMeta.map((slot) => {
            const ids = grouped[slot.key]
            if (ids.length === 0) return null
            const headerText = slot.label ? `${slot.label} · ${slot.date}` : slot.date
            return (
              <div key={slot.key}>
                {/* Slot divider */}
                <div
                  style={{
                    padding: '8px 20px',
                    background: 'var(--color-surface-alt)',
                    borderTop: '1px solid var(--color-border)',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-text-tertiary)',
                  }}
                >
                  {headerText}
                </div>
                {ids.map((id) => {
                  const svc = SERVICE_MAP[id]
                  if (!svc) return null
                  const when = SERVICE_TIMING[id]?.when || ''
                  return (
                    <div
                      key={id}
                      className="flex items-start justify-between"
                      style={{ padding: '12px 20px', borderTop: '1px solid var(--color-border)' }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-surface-alt)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 16,
                            flexShrink: 0,
                          }}
                        >
                          {svc.emoji}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)', marginBottom: 2 }}>
                            {svc.name}
                          </div>
                          <div style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{when}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', flexShrink: 0, marginLeft: 12 }}>
                        {svc.price === 0 ? 'Incl.' : `+SGD ${svc.price}`}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })
        )}
      </div>

      {/* Price breakdown */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 12 }}>
          Price breakdown
        </div>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              {selectedRoom?.name} · {nights} nights
            </span>
            <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
          </div>
          {servicesTotal > 0 && (
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Add-ons</span>
              <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>SGD {servicesTotal}</span>
            </div>
          )}
          <div
            className="flex items-center justify-between"
            style={{ borderTop: '1px solid var(--color-border)', paddingTop: 10, marginTop: 4 }}
          >
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>Total</span>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>SGD {grandTotal}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <button
        style={{
          width: '100%',
          background: 'var(--color-text-primary)',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          borderRadius: 'var(--radius-md)',
          padding: '16px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: 12,
        }}
        className="transition-opacity hover:opacity-90"
      >
        Confirm booking
      </button>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/flow-e/trip')}
          style={{
            flex: 1,
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
          className="transition-opacity hover:opacity-70"
        >
          ← Back to trip
        </button>
        <button
          onClick={() => navigate('/flow-e/rooms')}
          style={{
            flex: 1,
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
          }}
          className="transition-opacity hover:opacity-70"
        >
          Start over
        </button>
      </div>
    </div>
  )
}
