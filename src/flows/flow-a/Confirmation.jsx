import { useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { serviceCategories } from '../../data/services'

const NIGHTS = 3

const allItems = serviceCategories.flatMap((c) => c.items)

export default function Confirmation() {
  const { selectedRoom, selectedServices } = useOutletContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!selectedRoom) navigate('/flow-a/rooms')
  }, [selectedRoom])

  if (!selectedRoom) return null

  const roomTotal = selectedRoom.basePricePerNight * NIGHTS

  const checkedNonDefault = allItems.filter(
    (i) => !i.defaultIncluded && i.tag !== 'included' && selectedServices.includes(i.id)
  )
  const removedDefaults = allItems.filter(
    (i) => i.defaultIncluded && i.tag !== 'included' && !selectedServices.includes(i.id)
  )
  const addOnTotal = checkedNonDefault.reduce((sum, i) => sum + i.price, 0)
  const creditTotal = removedDefaults.reduce((sum, i) => sum + i.price, 0)
  const total = roomTotal + addOnTotal - creditTotal

  const selectedServiceNames = allItems.filter((i) => selectedServices.includes(i.id)).map((i) => i.name)

  return (
    <div>
      <p
        className="text-xs font-semibold uppercase mb-3"
        style={{ color: 'var(--color-teal)', letterSpacing: '0.08em' }}
      >
        Booking confirmed
      </p>

      <h1
        className="text-3xl mb-6"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
      >
        Your room is ready to book.
      </h1>

      <div
        className="mb-6"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '24px',
          border: '1px solid var(--color-border)',
        }}
      >
        <p className="text-base font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
          The Straits, Singapore
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          Sat 14 Jun — Tue 17 Jun · 3 nights · 2 guests
        </p>

        <p className="text-sm font-semibold mb-0.5" style={{ color: 'var(--color-text-primary)' }}>
          {selectedRoom.name}
        </p>
        <p className="text-xs mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          {selectedRoom.tagline}
        </p>

        {selectedServiceNames.length > 0 && (
          <div>
            <p
              className="text-xs font-semibold uppercase mb-2"
              style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}
            >
              Included services
            </p>
            <ul className="flex flex-col gap-1">
              {selectedServiceNames.map((name) => (
                <li key={name} className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {name}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <div className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--color-text-secondary)' }}>
              {selectedRoom.name} · {NIGHTS} nights
            </span>
            <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomTotal}</span>
          </div>

          {checkedNonDefault.map((item) => (
            <div key={item.id} className="flex justify-between text-xs mb-0.5">
              <span style={{ color: 'var(--color-text-secondary)' }}>{item.name}</span>
              <span style={{ color: 'var(--color-text-primary)' }}>+SGD {item.price}</span>
            </div>
          ))}

          {removedDefaults.map((item) => (
            <div key={item.id} className="flex justify-between text-xs mb-0.5">
              <span style={{ color: 'var(--color-text-secondary)' }}>{item.name} (removed)</span>
              <span style={{ color: 'var(--color-positive)' }}>-SGD {item.price}</span>
            </div>
          ))}

          <div
            className="flex justify-between text-sm font-semibold pt-2 mt-2"
            style={{ borderTop: '1px solid var(--color-border)' }}
          >
            <span>Total</span>
            <span>SGD {total}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/flow-a/services')}
          className="flex-1 text-sm font-medium py-3 transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            background: 'transparent',
          }}
        >
          ← Back to services
        </button>
        <button
          onClick={() => navigate('/flow-a/rooms')}
          className="flex-1 text-sm font-medium py-3 transition-colors"
          style={{
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            color: 'var(--color-text-primary)',
            background: 'transparent',
          }}
        >
          Start over
        </button>
      </div>
    </div>
  )
}
