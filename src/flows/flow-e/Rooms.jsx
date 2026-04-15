import { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { rooms } from '../../data/rooms'
import StepHeader from '../../components/shared/StepHeader'

function deriveRoomAttrs(room) {
  return {
    floor: room.attributes.floor,
    view: room.attributes.view,
    bedding: room.attributes.bedding,
    bathroom: room.attributes.bathroom,
    balcony: room.attributes.balcony,
    livingArea: room.attributes.livingArea,
    coffeeMachine: room.attributes.coffeeMachine,
  }
}

export default function Rooms() {
  const { bookingContext, setters } = useOutletContext()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(null)

  function handleSelect(room) {
    setters.setSelectedRoom(room)
    setters.setRoomAttrs(deriveRoomAttrs(room))
    setSelectedId(room.id)
    setTimeout(() => navigate('/flow-e/trip'), 320)
  }

  const nights = bookingContext.nights
  const checkIn = new Date(bookingContext.checkIn)
  const checkOut = new Date(bookingContext.checkOut)
  const checkInLabel = checkIn.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
  const checkOutLabel = checkOut.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

  return (
    <div style={{ paddingBottom: 80 }}>
      <StepHeader
        step={1}
        totalSteps={2}
        title="Choose your room"
        subtitle="Select a room to build your trip around."
      />

      {/* Booking context pills */}
      <div className="flex gap-3 mb-6" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'CHECK-IN', value: checkInLabel },
          { label: 'CHECK-OUT', value: checkOutLabel },
          { label: 'GUESTS', value: `${bookingContext.guests} adults` },
        ].map((pill) => (
          <div
            key={pill.label}
            style={{
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 14px',
              background: 'var(--color-surface)',
              minWidth: 100,
            }}
          >
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', color: 'var(--color-text-tertiary)', textTransform: 'uppercase', marginBottom: 2 }}>
              {pill.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--color-text-primary)' }}>
              {pill.value}
            </div>
          </div>
        ))}
      </div>

      {/* Room list */}
      <div className="flex flex-col" style={{ gap: 12 }}>
        {rooms.map((room) => {
          const isSelected = selectedId === room.id
          const isDimmed = selectedId && selectedId !== room.id
          const roomTotal = room.basePricePerNight * nights

          return (
            <div
              key={room.id}
              style={{
                borderRadius: 'var(--radius-lg)',
                border: isSelected ? '2px solid var(--color-teal)' : '1px solid var(--color-border)',
                background: 'var(--color-surface)',
                overflow: 'hidden',
                opacity: isDimmed ? 0.5 : 1,
                transition: 'opacity 0.25s ease, border 0.15s ease',
              }}
            >
              {/* Room image */}
              <div style={{ position: 'relative' }}>
                <img
                  src={room.image}
                  alt={room.name}
                  style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
                />
                {room.badge && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      background: 'var(--color-surface)',
                      color: 'var(--color-text-secondary)',
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {room.badge}
                  </span>
                )}
              </div>

              {/* Info row */}
              <div className="flex items-center justify-between" style={{ padding: '16px 20px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)', marginBottom: 3 }}>
                    {room.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                    {room.tagline}
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color-text-primary)' }}>
                      SGD {room.basePricePerNight}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>per night</div>
                  </div>
                  <button
                    onClick={() => handleSelect(room)}
                    style={{
                      background: isSelected ? 'var(--color-teal)' : 'var(--color-text-primary)',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 600,
                      padding: '9px 16px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    {isSelected ? 'Selected ✓' : 'Select →'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
