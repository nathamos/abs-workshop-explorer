import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import StepHeader from '../../components/shared/StepHeader'
import ContextStrip from '../../components/shared/ContextStrip'
import ServiceItem from '../../components/shared/ServiceItem'
import BookingSummary from '../../components/shared/BookingSummary'
import { serviceCategories } from '../../data/services'

const NIGHTS = 3

const allItems = serviceCategories.flatMap((c) => c.items)
const standardItems = allItems.filter((i) => i.standardInclusion)
const optionalItems = allItems.filter((i) => !i.standardInclusion)
const defaultOptionalIds = optionalItems.filter((i) => i.defaultIncluded).map((i) => i.id)

export default function Services() {
  const { selectedRoom, selectedServices, setSelectedServices } = useOutletContext()
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState({})

  useEffect(() => {
    if (!selectedRoom) {
      navigate('/flow-a/rooms')
      return
    }
    if (selectedServices.length === 0) {
      setSelectedServices(defaultOptionalIds)
    }
  }, [selectedRoom])

  if (!selectedRoom) return null

  function handleChange(itemId, checked) {
    setSelectedServices((prev) =>
      checked ? [...prev, itemId] : prev.filter((id) => id !== itemId)
    )
    if (!checked) {
      setQuantities((prev) => {
        const next = { ...prev }
        delete next[itemId]
        return next
      })
    }
  }

  function handleQuantityChange(itemId, delta) {
    setQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(1, (prev[itemId] || 1) + delta),
    }))
  }

  const roomTotal = selectedRoom.basePricePerNight * NIGHTS

  const checkedOptional = optionalItems.filter((i) => selectedServices.includes(i.id))

  const summaryServices = checkedOptional.map((i) => {
    const qty = quantities[i.id] || 1
    return {
      id: i.id,
      name: qty > 1 ? `${i.name} ×${qty}` : i.name,
      price: i.price * qty,
    }
  })

  const addOnTotal = checkedOptional.reduce(
    (sum, i) => sum + i.price * (quantities[i.id] || 1),
    0
  )

  const total = roomTotal + addOnTotal

  const sectionHeadingStyle = {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--color-text-primary)',
    borderBottom: '1px solid var(--color-border)',
    paddingBottom: '8px',
  }

  return (
    <div style={{ paddingBottom: '120px' }}>
      <button
        onClick={() => navigate('/flow-a/rooms')}
        className="text-sm mb-3"
        style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        ← Back
      </button>
      <StepHeader
        step={2}
        totalSteps={3}
        title="Customise your stay"
        subtitle="Add services to your stay. Prices are per stay."
      />

      <ContextStrip
        roomName={selectedRoom.name}
        nights={NIGHTS}
        totalPrice={roomTotal}
        dates="14–17 Jun"
        guests="2 guests"
      />

      {/* Standard inclusions */}
      <div className="mb-6">
        <h2 className="mb-2" style={sectionHeadingStyle}>
          What's included
        </h2>
        {standardItems.map((item) => (
          <ServiceItem
            key={item.id}
            item={item}
            checked={true}
            onChange={() => {}}
          />
        ))}
      </div>

      {/* Optional add-ons by category */}
      {serviceCategories.map((category) => {
        const items = category.items.filter((i) => !i.standardInclusion)
        if (items.length === 0) return null
        return (
          <div key={category.id} className="mb-6">
            <h2
              className="mb-2"
              style={sectionHeadingStyle}
            >
              {category.label}
            </h2>
            {items.map((item) => (
              <ServiceItem
                key={item.id}
                item={item}
                checked={selectedServices.includes(item.id)}
                onChange={(checked) => handleChange(item.id, checked)}
                quantity={quantities[item.id] || 1}
                onQuantityChange={(delta) => handleQuantityChange(item.id, delta)}
              />
            ))}
          </div>
        )
      })}

      <BookingSummary
        roomName={selectedRoom.name}
        nights={NIGHTS}
        roomTotal={roomTotal}
        selectedServices={summaryServices}
        total={total}
        onContinue={() => navigate('/flow-a/confirmation')}
        ctaLabel="Continue to payment ↗"
      />
    </div>
  )
}
