import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { serviceCategories } from '../../data/services'
import StepHeader from '../../components/shared/StepHeader'
import BookingSummary from '../../components/shared/BookingSummary'

const bundles = [
  {
    id: 'room-only',
    name: 'Room only',
    description: 'The Straits experience, no extras.',
    serviceIds: [],
    emoji: null,
  },
  {
    id: 'romantic',
    name: 'Romantic getaway',
    description: 'Everything for a special occasion.',
    serviceIds: ['daily-breakfast', 'bottle-wine', 'turndown', 'occasion-setup'],
    emoji: '💑',
  },
  {
    id: 'weekend',
    name: 'Weekend escape',
    description: 'Rest, relax, and recharge.',
    serviceIds: ['daily-breakfast', 'welcome-amenity', 'spa-access'],
    emoji: '🌿',
  },
  {
    id: 'work-trip',
    name: 'Work trip',
    description: 'A room that works as hard as you do.',
    serviceIds: ['premium-wifi', 'desk-setup', 'fnb-credit'],
    emoji: '💼',
  },
  {
    id: 'family',
    name: 'Family break',
    description: 'Room for everyone, and a little extra ease.',
    serviceIds: ['cot', 'baby-kit', 'daily-breakfast', 'extra-bed'],
    emoji: '👨‍👩‍👧',
  },
  {
    id: 'explorer',
    name: 'City explorer',
    description: "You're here for the city. Let's set you up.",
    serviceIds: ['cultural-tour', 'bike-hire', 'fnb-credit', 'welcome-amenity'],
    emoji: '🚲',
  },
]

// Build a flat map of serviceId -> item
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

function getBundleServices(bundle) {
  return bundle.serviceIds.map((id) => serviceMap[id]).filter(Boolean)
}

function getBundleServicesTotal(bundle) {
  return getBundleServices(bundle).reduce((sum, svc) => sum + (svc.price || 0), 0)
}

function getBundleTotal(bundle, roomTotal) {
  return roomTotal + getBundleServicesTotal(bundle)
}

function getSavings(bundle, roomTotal) {
  const individual = getBundleServicesTotal(bundle)
  if (individual === 0) return 0
  const discounted = Math.round(individual * 0.88)
  return individual - discounted
}

export default function Services() {
  const { selectedRoom, selectedBundleId, setters, bookingContext } = useOutletContext()
  const navigate = useNavigate()

  const nights = bookingContext.nights
  const roomTotal = selectedRoom ? selectedRoom.basePricePerNight * nights : 0
  const roomName = selectedRoom ? selectedRoom.name : 'Your room'

  const selectedBundle = bundles.find((b) => b.id === selectedBundleId) || null

  function handleSelectBundle(bundleId) {
    setters.setSelectedBundleId(bundleId)
  }

  function handleContinue() {
    navigate('/flow-c/confirmation')
  }

  // Build BookingSummary selectedServices
  let summaryServices = []
  if (selectedBundle && selectedBundle.id !== 'room-only') {
    summaryServices = getBundleServices(selectedBundle).map((svc) => ({
      id: svc.id,
      name: svc.name,
      price: svc.price,
    }))
  }

  const bundleServicesTotal = selectedBundle ? getBundleServicesTotal(selectedBundle) : 0
  const savings = selectedBundle && selectedBundle.id !== 'room-only' ? getSavings(selectedBundle, roomTotal) : 0
  const discountedServicesTotal = savings > 0 ? bundleServicesTotal - savings : bundleServicesTotal
  const summaryTotal = roomTotal + (selectedBundle && selectedBundle.id !== 'room-only' ? discountedServicesTotal : 0)

  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)
  const checkInLabel = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ paddingBottom: 160 }}>
      <StepHeader
        step={2}
        totalSteps={3}
        title="How does your stay sound?"
        subtitle="Choose a bundle, or continue with room only."
      />

      {/* Context strip */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: 24,
          display: 'flex',
          gap: 24,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Room</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{roomName}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Nights</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{nights}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Room total</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>SGD {roomTotal}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Dates</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{checkInLabel}–{checkOutLabel}</div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: 2 }}>Guests</div>
          <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>{bookingContext.guests} guests</div>
        </div>
      </div>

      {/* Bundle cards */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        {bundles.map((bundle) => {
          const isSelected = selectedBundleId === bundle.id
          const services = getBundleServices(bundle)
          const bundleTotal = getBundleTotal(bundle, roomTotal)
          const saving = bundle.id !== 'room-only' ? getSavings(bundle, roomTotal) : 0
          const discountedTotal = saving > 0 ? bundleTotal - saving : bundleTotal

          if (bundle.id === 'room-only') {
            return (
              <motion.div
                key={bundle.id}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleSelectBundle(bundle.id)}
                style={{
                  background: 'var(--color-surface)',
                  border: isSelected ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '18px 20px',
                  cursor: 'pointer',
                  position: 'relative',
                }}
              >
                {isSelected && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 16,
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--color-teal)',
                      background: 'var(--color-teal-light)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                    }}
                  >
                    Selected ✓
                  </span>
                )}
                <div className="flex items-start justify-between">
                  <div>
                    <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                      {bundle.name}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>{bundle.description}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>SGD {roomTotal}</div>
                  </div>
                </div>
                {!isSelected && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSelectBundle(bundle.id) }}
                    style={{
                      marginTop: 14,
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--color-teal)',
                      background: 'var(--color-teal-light)',
                      border: 'none',
                      borderRadius: 'var(--radius-full)',
                      padding: '8px 16px',
                      cursor: 'pointer',
                    }}
                  >
                    Select
                  </button>
                )}
              </motion.div>
            )
          }

          return (
            <motion.div
              key={bundle.id}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectBundle(bundle.id)}
              style={{
                background: 'var(--color-surface)',
                border: isSelected ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 16,
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--color-teal)',
                    background: 'var(--color-teal-light)',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                  }}
                >
                  Selected ✓
                </span>
              )}

              <div className="flex items-start justify-between" style={{ paddingRight: isSelected ? 100 : 0 }}>
                <div>
                  <div style={{ fontSize: 18, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                    {bundle.emoji && <span style={{ marginRight: 8 }}>{bundle.emoji}</span>}
                    {bundle.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 12 }}>{bundle.description}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    SGD {discountedTotal}
                  </div>
                  {saving > 0 && (
                    <div style={{ fontSize: 12, color: 'var(--color-positive)', fontWeight: 500, marginTop: 2 }}>
                      Save SGD {saving}
                    </div>
                  )}
                </div>
              </div>

              {/* Item pills */}
              <div className="flex flex-wrap gap-2" style={{ marginBottom: 14 }}>
                {services.map((svc) => (
                  <span
                    key={svc.id}
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
                    {svc.emoji} {svc.name}
                  </span>
                ))}
              </div>

              {!isSelected && (
                <button
                  onClick={(e) => { e.stopPropagation(); handleSelectBundle(bundle.id) }}
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--color-teal)',
                    background: 'var(--color-teal-light)',
                    border: 'none',
                    borderRadius: 'var(--radius-full)',
                    padding: '8px 16px',
                    cursor: 'pointer',
                  }}
                >
                  Select
                </button>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Sticky BookingSummary */}
      {selectedBundleId && (
        <BookingSummary
          roomName={roomName}
          nights={nights}
          roomTotal={roomTotal}
          selectedServices={summaryServices}
          total={summaryTotal}
          onContinue={handleContinue}
          ctaLabel="Continue to payment ↗"
        />
      )}
    </div>
  )
}
