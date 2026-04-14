import { useState, useEffect } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import StepHeader from '../../components/shared/StepHeader'
import ContextStrip from '../../components/shared/ContextStrip'
import ServiceItem from '../../components/shared/ServiceItem'
import BookingSummary from '../../components/shared/BookingSummary'
import { serviceCategories } from '../../data/services'

const NIGHTS = 3

const allItems = serviceCategories.flatMap((c) => c.items)
const defaultIds = allItems.filter((i) => i.defaultIncluded).map((i) => i.id)

export default function Services() {
  const { selectedRoom, selectedServices, setSelectedServices } = useOutletContext()
  const navigate = useNavigate()
  const [quantities, setQuantities] = useState({}) // { [itemId]: number }

  useEffect(() => {
    if (!selectedRoom) {
      navigate('/flow-a/rooms')
      return
    }
    if (selectedServices.length === 0) {
      setSelectedServices(defaultIds)
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

  const checkedItems = allItems.filter((i) => selectedServices.includes(i.id))

  const summaryServices = checkedItems
    .filter((i) => i.tag !== 'included')
    .map((i) => {
      const qty = quantities[i.id] || 1
      return {
        id: i.id,
        name: qty > 1 ? `${i.name} ×${qty}` : i.name,
        price: i.price * qty,
      }
    })

  const addOnTotal = allItems
    .filter((i) => i.tag !== 'included' && selectedServices.includes(i.id))
    .reduce((sum, i) => sum + i.price * (quantities[i.id] || 1), 0)

  const total = roomTotal + addOnTotal

  return (
    <div style={{ paddingBottom: '120px' }}>
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

      {serviceCategories.map((category) => (
        <div key={category.id} className="mb-6">
          <h2
            className="mb-2"
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
              borderBottom: '1px solid var(--color-border)',
              paddingBottom: '8px',
            }}
          >
            {category.label}
          </h2>
          {category.items.map((item) => (
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
      ))}

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
