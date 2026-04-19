import { useNavigate, useOutletContext } from 'react-router-dom'
import { motion } from 'framer-motion'
import { rooms } from '../../data/rooms'
import { serviceCategories } from '../../data/services'
import { bookingContext } from '../../data/bookingContext'

const profiles = {
  business: {
    roomId: 'superior-marina',
    bundleServiceIds: ['premium-wifi', 'desk-setup', 'fnb-credit'],
    bundleName: 'Work trip',
  },
  couple: {
    roomId: 'deluxe-balcony',
    bundleServiceIds: ['daily-breakfast', 'bottle-wine', 'turndown', 'occasion-setup'],
    bundleName: 'Romantic getaway',
  },
  explorer: {
    roomId: 'superior-marina',
    bundleServiceIds: ['cultural-tour', 'bike-hire', 'fnb-credit', 'welcome-amenity'],
    bundleName: 'City explorer',
  },
  family: {
    roomId: 'family-connecting',
    bundleServiceIds: ['cot', 'baby-kit', 'daily-breakfast', 'extra-bed'],
    bundleName: 'Family break',
  },
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function Confirmation() {
  const { profile, selectedRoom } = useOutletContext()
  const navigate = useNavigate()

  const profileData = profiles[profile] || profiles.explorer
  const room = selectedRoom || rooms.find(r => r.id === profileData.roomId)
  const allItems = serviceCategories.flatMap(cat => cat.items)
  const bundleItems = profileData.bundleServiceIds.map(id => allItems.find(i => i.id === id)).filter(Boolean)

  const { nights, guests, checkIn, checkOut, property, location } = bookingContext
  const roomTotal = room ? room.basePricePerNight * nights : 0
  const bundleTotal = bundleItems.reduce((sum, item) => sum + item.price, 0)
  const grandTotal = roomTotal + bundleTotal

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading confirmation…</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '56px',
        }}
      >
        <div className="max-w-[800px] mx-auto px-4 h-full flex items-center">
          <button
            onClick={() => navigate('/flow-d/chat')}
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Start over
          </button>
        </div>
      </div>

      <div
        className="max-w-[800px] mx-auto px-6 py-10"
        style={{ paddingTop: '88px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p
            className="font-semibold tracking-widest mb-2"
            style={{ fontSize: '11px', color: 'var(--color-teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            Booking confirmed
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              color: 'var(--color-text-primary)',
              lineHeight: '1.2',
            }}
          >
            Your room is ready to book.
          </h1>

          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{ fontSize: '15px', color: 'var(--color-text-primary)' }}
            >
              {property}, {location}
            </p>
            <p
              className="text-sm mb-4"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {formatDate(checkIn)} – {formatDate(checkOut)}
            </p>

            <div
              className="pt-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '18px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {room.name}
              </p>
              <p
                className="mt-0.5"
                style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}
              >
                {room.tagline}
              </p>
              <p
                className="mt-1"
                style={{
                  fontSize: '13px',
                  color: 'var(--color-text-secondary)',
                  fontStyle: 'italic',
                }}
              >
                Recommended based on your answers · {nights} nights · {guests} guests
              </p>
            </div>

            <div
              className="mt-5 pt-4"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: 'var(--color-text-secondary)' }}>Room · {nights} nights</span>
                <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
              </div>

              {bundleItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm mb-1">
                  <span style={{ color: 'var(--color-text-secondary)' }}>
                    {item.emoji} {item.name}
                  </span>
                  <span style={{ color: 'var(--color-text-primary)' }}>SGD {item.price}</span>
                </div>
              ))}

              <div
                className="flex justify-between text-sm font-semibold pt-3 mt-2"
                style={{ borderTop: '1px solid var(--color-border)' }}
              >
                <span>Total</span>
                <span>SGD {grandTotal}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/complete')}
              className="w-full text-sm font-semibold text-white mt-5 transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 16px',
              }}
            >
              Continue to payment ↗
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
