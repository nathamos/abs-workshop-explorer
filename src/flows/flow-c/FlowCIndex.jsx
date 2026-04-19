import { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { bookingContext } from '../../data/bookingContext'
import { rooms } from '../../data/rooms'

export default function FlowCIndex() {
  const navigate = useNavigate()
  const [selectedRoom, setSelectedRoom] = useState(rooms[0])
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
      <div className="max-w-[800px] mx-auto px-6 py-8">
        <Outlet context={state} />
      </div>
    </div>
  )
}
