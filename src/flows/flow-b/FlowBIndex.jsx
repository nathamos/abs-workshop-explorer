import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { serviceCategories } from '../../data/services'

const defaultSelectedServices = serviceCategories.flatMap((cat) =>
  cat.items.filter((item) => item.defaultIncluded).map((item) => item.id)
)

export default function FlowBIndex({ priced = false }) {
  const navigate = useNavigate()
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
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1 text-sm"
        style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          color: 'var(--color-text-primary)',
          zIndex: 100,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Exit
      </button>
      <Outlet context={flowState} />
    </div>
  )
}
