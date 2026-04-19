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
    intro: 'You need a room that works as hard as you do.',
    rationale: 'High floor for focus, king bed for comfort, and fast Wi-Fi for calls. The city view keeps you oriented.',
  },
  couple: {
    roomId: 'deluxe-balcony',
    bundleServiceIds: ['daily-breakfast', 'bottle-wine', 'turndown', 'occasion-setup'],
    bundleName: 'Romantic getaway',
    intro: 'Something special deserves the right backdrop.',
    rationale: 'Marina views from a private balcony, bathtub, and a few touches that make it feel like an occasion.',
  },
  explorer: {
    roomId: 'superior-marina',
    bundleServiceIds: ['cultural-tour', 'bike-hire', 'fnb-credit', 'welcome-amenity'],
    bundleName: 'City explorer',
    intro: "You're here for the city. Let's set you up well.",
    rationale: 'A well-positioned room with marina views, plus a guided walk and bikes so you see everything.',
  },
  family: {
    roomId: 'family-connecting',
    bundleServiceIds: ['cot', 'baby-kit', 'daily-breakfast', 'extra-bed'],
    bundleName: 'Family break',
    intro: 'Room for everyone, and a little extra ease built in.',
    rationale: 'Connecting rooms with twin beds, set up before you arrive with everything the little ones need.',
  },
}

function getAllServiceItems() {
  return serviceCategories.flatMap(cat => cat.items)
}

export default function Recommendation() {
  const { profile, setSelectedRoom, setSelectedBundleId } = useOutletContext()
  const navigate = useNavigate()

  const profileData = profiles[profile] || profiles.explorer
  const room = rooms.find(r => r.id === profileData.roomId)
  const allItems = getAllServiceItems()
  const bundleItems = profileData.bundleServiceIds.map(id => allItems.find(i => i.id === id)).filter(Boolean)

  const { nights } = bookingContext
  const roomTotal = room ? room.basePricePerNight * nights : 0
  const bundleTotal = bundleItems.reduce((sum, item) => sum + item.price, 0)
  const grandTotal = roomTotal + bundleTotal

  function handleAccept() {
    setSelectedRoom(room)
    setSelectedBundleId(profileData.bundleName)
    navigate('/')
  }

  if (!profile || !room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p style={{ color: 'var(--color-text-secondary)' }}>Loading recommendation…</p>
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
        <div className="max-w-[800px] mx-auto px-4 h-full flex items-center justify-between">
          <button
            onClick={() => navigate('/flow-d/chat')}
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Start over
          </button>
          <span
            className="absolute left-1/2 -translate-x-1/2 font-semibold text-sm"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            The Straits
          </span>
        </div>
      </div>

      <div
        className="max-w-[800px] mx-auto px-6 py-8"
        style={{ paddingTop: '80px' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-start gap-2 max-w-[75%] mb-6"
        >
          <span className="mt-1 text-xs select-none" style={{ color: 'var(--color-teal)' }}>✦</span>
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-xl)',
              padding: '14px 16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              fontSize: '15px',
              color: 'var(--color-text-primary)',
              lineHeight: '1.5',
            }}
          >
            Based on what you've told me, here's what I'd suggest.
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px',
            boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
          }}
        >
          <p
            className="font-semibold tracking-widest mb-3"
            style={{ fontSize: '11px', color: 'var(--color-teal)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            Your recommended stay
          </p>

          <p
            style={{ fontFamily: 'var(--font-display)', fontSize: '22px', color: 'var(--color-text-primary)', lineHeight: '1.2' }}
          >
            {room.name}
          </p>
          <p
            className="mt-1"
            style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}
          >
            {room.tagline}
          </p>

          <img
            src={room.image}
            alt={room.name}
            className="w-full object-cover rounded-lg mt-2"
            style={{ height: '176px' }}
          />

          <p
            className="mt-4 font-semibold tracking-widest"
            style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            Why this room
          </p>
          <p
            className="mt-1"
            style={{ fontSize: '14px', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}
          >
            {profileData.rationale}
          </p>

          <p
            className="mt-4 font-semibold tracking-widest"
            style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}
          >
            What's included
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {bundleItems.map(item => (
              <span
                key={item.id}
                className="text-sm"
                style={{
                  background: 'var(--color-surface-alt)',
                  borderRadius: 'var(--radius-full)',
                  padding: '6px 12px',
                  color: 'var(--color-text-primary)',
                }}
              >
                {item.emoji} {item.name}
              </span>
            ))}
          </div>

          <div
            className="mt-6 pt-4"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: 'var(--color-text-secondary)' }}>Room · {nights} nights</span>
              <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span style={{ color: 'var(--color-text-secondary)' }}>{profileData.bundleName}</span>
              <span style={{ color: 'var(--color-text-primary)' }}>SGD {bundleTotal}</span>
            </div>
            <div
              className="flex justify-between text-sm font-semibold pt-3"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <span>Total</span>
              <span>SGD {grandTotal}</span>
            </div>
          </div>

          <button
            onClick={handleAccept}
            className="w-full text-sm font-semibold text-white mt-4 transition-opacity hover:opacity-90"
            style={{
              background: 'var(--color-text-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
            }}
          >
            Accept this recommendation →
          </button>

          <div className="text-center mt-2">
            <button
              onClick={() => navigate('/flow-d/chat')}
              className="text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              See other options
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
