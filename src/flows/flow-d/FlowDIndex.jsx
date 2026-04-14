import { useState } from 'react'
import { Outlet } from 'react-router-dom'

export default function FlowDIndex() {
  const [answers, setAnswers] = useState({})
  const [profile, setProfile] = useState(null)
  const [selectedRoom, setSelectedRoom] = useState(null)
  const [selectedBundleId, setSelectedBundleId] = useState(null)

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <Outlet
        context={{
          answers,
          setAnswers,
          profile,
          setProfile,
          selectedRoom,
          setSelectedRoom,
          selectedBundleId,
          setSelectedBundleId,
        }}
      />
    </div>
  )
}
