import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { serviceCategories } from '../../data/services'

const defaultSelectedServices = serviceCategories.flatMap((cat) =>
  cat.items.filter((item) => item.defaultIncluded).map((item) => item.id)
)

export default function FlowBIndex({ priced = false }) {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedAttributes, setSelectedAttributes] = useState({
    bedding: 'king',
    pillows: 'standard',
    floor: 'low',
    view: 'courtyard',
    balcony: false,
    bathroom: 'shower',
    livingArea: false,
    miniBar: 'none',
    coffeeMachine: false,
    kitchen: false,
    smoking: false,
    accessibility: false,
  })
  const [selectedServices, setSelectedServices] = useState(defaultSelectedServices)

  const flowState = {
    selectedRoom,
    setSelectedRoom,
    selectedAttributes,
    setSelectedAttributes,
    selectedServices,
    setSelectedServices,
    priced,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Outlet context={flowState} />
    </div>
  )
}
