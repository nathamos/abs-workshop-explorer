import { useOutletContext, useNavigate, Link } from 'react-router-dom'
import { serviceCategories } from '../../data/services'
import StepHeader from '../../components/shared/StepHeader'

const bundles = [
  {
    id: 'room-only',
    name: 'Room only',
    serviceIds: [],
  },
  {
    id: 'romantic',
    name: 'Romantic getaway',
    serviceIds: ['daily-breakfast', 'bottle-wine', 'turndown', 'occasion-setup'],
  },
  {
    id: 'weekend',
    name: 'Weekend escape',
    serviceIds: ['daily-breakfast', 'welcome-amenity', 'spa-access'],
  },
  {
    id: 'work-trip',
    name: 'Work trip',
    serviceIds: ['premium-wifi', 'desk-setup', 'fnb-credit'],
  },
  {
    id: 'family',
    name: 'Family break',
    serviceIds: ['cot', 'baby-kit', 'daily-breakfast', 'extra-bed'],
  },
  {
    id: 'explorer',
    name: 'City explorer',
    serviceIds: ['cultural-tour', 'bike-hire', 'fnb-credit', 'welcome-amenity'],
  },
]

function buildServiceMap() {
  const map = {}
  serviceCategories.forEach((cat) => {
    cat.items.forEach((item) => {
      map[item.id] = item
    })
  })
  return map
}

const serviceMap = buildServiceMap()

const ATTR_LABELS = {
  bedding: { queen: 'Queen bed', king: 'King bed', twin: 'Twin beds' },
  view: { city: 'City view', marina: 'Marina view', courtyard: 'Courtyard' },
  floor: { low: 'Low floor', mid: 'Mid floor', high: 'High floor' },
}

function getSavings(bundle) {
  const total = bundle.serviceIds.reduce((sum, id) => sum + (serviceMap[id]?.price || 0), 0)
  if (total === 0) return 0
  return Math.round(total * 0.12)
}

export default function Confirmation() {
  const { selectedRoom, selectedRoomAttributes, selectedBundleId, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  const nights = bookingContext.nights
  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0

  const selectedBundle = bundles.find((b) => b.id === selectedBundleId) || null
  const bundleServices = selectedBundle
    ? selectedBundle.serviceIds.map((id) => serviceMap[id]).filter(Boolean)
    : []

  const savings = selectedBundle && selectedBundle.id !== 'room-only' ? getSavings(selectedBundle) : 0
  const servicesTotal = bundleServices.reduce((sum, svc) => sum + (svc.price || 0), 0)
  const discountedServicesTotal = savings > 0 ? servicesTotal - savings : servicesTotal
  const grandTotal = roomTotal + discountedServicesTotal

  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)
  const checkInLabel = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  // Build attribute pills from selectedRoomAttributes
  const attrPills = []
  if (selectedRoomAttributes) {
    if (selectedRoomAttributes.bedding) {
      attrPills.push(ATTR_LABELS.bedding[selectedRoomAttributes.bedding] || selectedRoomAttributes.bedding)
    }
    if (selectedRoomAttributes.view) {
      attrPills.push(ATTR_LABELS.view[selectedRoomAttributes.view] || selectedRoomAttributes.view)
    }
    if (selectedRoomAttributes.floor) {
      attrPills.push(ATTR_LABELS.floor[selectedRoomAttributes.floor] || selectedRoomAttributes.floor)
    }
    if (selectedRoomAttributes.extras) {
      Object.entries(selectedRoomAttributes.extras).forEach(([key, val]) => {
        if (val) {
          attrPills.push(key.charAt(0).toUpperCase() + key.slice(1))
        }
      })
    }
  }

  return (
    <div style={{ paddingBottom: 120 }}>
      <StepHeader
        step={3}
        totalSteps={3}
        title="Booking summary"
        subtitle="Review your stay before confirming."
      />

      {/* Room section */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {selectedRoom?.image && (
          <img
            src={selectedRoom.image}
            alt={selectedRoom?.name}
            style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
          />
        )}
        <div style={{ padding: '18px 20px' }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-text-tertiary)',
              marginBottom: 6,
            }}
          >
            Your room
          </div>
          <div
            style={{
              fontSize: 20,
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              marginBottom: 4,
            }}
          >
            {selectedRoom?.name || 'No room selected'}
          </div>
          <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>
            {checkInLabel} – {checkOutLabel} · {nights} nights · {bookingContext.guests} guests
          </div>

          {/* Attribute pills */}
          {attrPills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {attrPills.map((pill) => (
                <span
                  key={pill}
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'var(--color-text-secondary)',
                    background: 'var(--color-surface-alt)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    padding: '5px 11px',
                  }}
                >
                  {pill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bundle section */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 10,
          }}
        >
          Package
        </div>
        <div
          style={{
            fontSize: 18,
            fontFamily: 'var(--font-display)',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            marginBottom: 12,
          }}
        >
          {selectedBundle?.name || 'None selected'}
        </div>

        {bundleServices.length > 0 && (
          <div className="flex flex-col" style={{ gap: 8 }}>
            {bundleServices.map((svc) => (
              <div key={svc.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 16 }}>{svc.emoji}</span>
                  <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>{svc.name}</span>
                </div>
                <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                  SGD {svc.price}
                </span>
              </div>
            ))}
            {savings > 0 && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--color-positive)',
                  background: 'var(--color-teal-light)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                }}
              >
                Bundle saving: −SGD {savings}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Price breakdown */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 20px',
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
            marginBottom: 12,
          }}
        >
          Price breakdown
        </div>
        <div className="flex flex-col" style={{ gap: 8 }}>
          <div className="flex items-center justify-between">
            <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              {selectedRoom?.name || 'Room'} · {nights} nights
            </span>
            <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
          </div>
          {bundleServices.length > 0 && (
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
                {selectedBundle?.name}
              </span>
              <span style={{ fontSize: 14, color: 'var(--color-text-primary)' }}>SGD {discountedServicesTotal}</span>
            </div>
          )}
          <div
            className="flex items-center justify-between"
            style={{
              borderTop: '1px solid var(--color-border)',
              paddingTop: 10,
              marginTop: 4,
            }}
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
          onClick={() => navigate('/flow-c/services')}
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
          ← Back to services
        </button>
        <button
          onClick={() => navigate('/flow-c/rooms')}
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
