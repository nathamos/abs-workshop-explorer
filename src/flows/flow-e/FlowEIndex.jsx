import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { bookingContext } from '../../data/bookingContext'
import { DEFAULT_SERVICES } from './serviceTiming'

export default function FlowEIndex() {
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [roomAttrs, setRoomAttrs] = useState({})
  // Each entry: { id: string, day: 0–3, time: 'morning'|'afternoon'|'evening' }
  const [myServices, setMyServices] = useState(DEFAULT_SERVICES)

  const state = {
    selectedRoom,
    roomAttrs,
    myServices,
    setters: {
      setSelectedRoom,
      setRoomAttrs,
      setMyServices,
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
