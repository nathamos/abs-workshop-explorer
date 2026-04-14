import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { bookingContext } from '../../data/bookingContext'

export default function FlowCIndex() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedRoomAttributes, setSelectedRoomAttributes] = useState({})
  const [selectedBundleId, setSelectedBundleId] = useState(null)

  const state = {
    selectedRoom,
    selectedRoomAttributes,
    selectedBundleId,
    setters: {
      setSelectedRoom,
      setSelectedRoomAttributes,
      setSelectedBundleId,
    },
    bookingContext,
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Outlet context={state} />
      </div>
    </div>
  )
}
