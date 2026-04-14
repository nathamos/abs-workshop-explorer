import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function FlowAIndex() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedServices, setSelectedServices] = useState([])
  const [expandedDetails, setExpandedDetails] = useState(null)

  const flowState = {
    selectedRoom,
    setSelectedRoom,
    selectedServices,
    setSelectedServices,
    expandedDetails,
    setExpandedDetails,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Outlet context={flowState} />
      </div>
    </div>
  )
}
