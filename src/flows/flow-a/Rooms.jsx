import { useState, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StepHeader from '../../components/shared/StepHeader'
import AttributePill from '../../components/shared/AttributePill'
import RoomCard from '../../components/shared/RoomCard'
import { rooms } from '../../data/rooms'
import { attributes } from '../../data/attributes'

const beddingAttr = attributes.find((a) => a.id === 'bedding')
const viewAttr = attributes.find((a) => a.id === 'view')
const floorAttr = attributes.find((a) => a.id === 'floor')

const booleanFilters = [
  { id: 'balcony', label: 'Balcony' },
  { id: 'connecting', label: 'Connecting rooms' },
  { id: 'accessibility', label: 'Accessible' },
  { id: 'kitchen', label: 'Kitchen' },
]

export default function Rooms() {
  const { selectedRoom, setSelectedRoom, expandedDetails, setExpandedDetails } = useOutletContext()
  const navigate = useNavigate()

  const [bedding, setBedding] = useState([])
  const [view, setView] = useState([])
  const [floor, setFloor] = useState([])
  const [roomType, setRoomType] = useState([])
  const [sort, setSort] = useState('best')

  function toggle(arr, val) {
    return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
  }

  const activeFilterGroups = useMemo(() => {
    const groups = []
    if (bedding.length) groups.push({ key: 'bedding', values: bedding })
    if (view.length) groups.push({ key: 'view', values: view })
    if (floor.length) groups.push({ key: 'floor', values: floor })
    if (roomType.length) groups.push({ key: 'roomType', values: roomType })
    return groups
  }, [bedding, view, floor, roomType])

  const totalFilters = activeFilterGroups.length

  function getRoomMatchCount(room) {
    let count = 0
    for (const group of activeFilterGroups) {
      if (group.key === 'roomType') {
        const matched = group.values.some((v) => room.attributes[v] === true)
        if (matched) count++
      } else {
        if (group.values.includes(room.attributes[group.key])) count++
      }
    }
    return count
  }

  function getMatchedAttributes(room) {
    const matched = []
    for (const group of activeFilterGroups) {
      if (group.key === 'bedding') {
        const opt = beddingAttr.options.find((o) => o.value === room.attributes.bedding)
        if (opt && group.values.includes(room.attributes.bedding)) matched.push(opt.label)
      } else if (group.key === 'view') {
        const opt = viewAttr.options.find((o) => o.value === room.attributes.view)
        if (opt && group.values.includes(room.attributes.view)) matched.push(opt.label)
      } else if (group.key === 'floor') {
        const opt = floorAttr.options.find((o) => o.value === room.attributes.floor)
        if (opt && group.values.includes(room.attributes.floor)) matched.push(opt.label)
      } else if (group.key === 'roomType') {
        for (const v of group.values) {
          if (room.attributes[v] === true) {
            const bf = booleanFilters.find((f) => f.id === v)
            if (bf) matched.push(bf.label)
          }
        }
      }
    }
    return matched
  }

  const sortedRooms = useMemo(() => {
    if (totalFilters === 0) {
      return [...rooms].sort((a, b) => a.basePricePerNight - b.basePricePerNight)
    }
    const withCounts = rooms.map((r) => ({ room: r, count: getRoomMatchCount(r) }))
    if (sort === 'price') {
      return withCounts
        .sort((a, b) => {
          if (b.count !== a.count) return b.count - a.count
          return a.room.basePricePerNight - b.room.basePricePerNight
        })
        .map((x) => x.room)
    }
    return withCounts
      .sort((a, b) => b.count - a.count || a.room.basePricePerNight - b.room.basePricePerNight)
      .map((x) => x.room)
  }, [totalFilters, bedding, view, floor, roomType, sort])

  const matchingCount = totalFilters === 0 ? rooms.length : sortedRooms.filter((r) => getRoomMatchCount(r) === totalFilters).length

  function handleSelect(room) {
    setSelectedRoom(room)
    navigate('/flow-a/services')
  }

  return (
    <div>
      <StepHeader
        step={1}
        totalSteps={3}
        title="Select your room"
        rightContent="Sat 14 Jun — Tue 17 Jun · 2 guests"
      />

      <div
        className="mb-6"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              Bed type
            </p>
            <div className="flex flex-wrap gap-2">
              {beddingAttr.options.map((opt) => (
                <AttributePill
                  key={opt.value}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={bedding.includes(opt.value)}
                  onClick={() => setBedding(toggle(bedding, opt.value))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              View
            </p>
            <div className="flex flex-wrap gap-2">
              {viewAttr.options.map((opt) => (
                <AttributePill
                  key={opt.value}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={view.includes(opt.value)}
                  onClick={() => setView(toggle(view, opt.value))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              Floor
            </p>
            <div className="flex flex-wrap gap-2">
              {floorAttr.options.map((opt) => (
                <AttributePill
                  key={opt.value}
                  label={opt.label}
                  selected={floor.includes(opt.value)}
                  onClick={() => setFloor(toggle(floor, opt.value))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase mb-2" style={{ color: 'var(--color-text-tertiary)', letterSpacing: '0.08em' }}>
              Room type
            </p>
            <div className="flex flex-wrap gap-2">
              {booleanFilters.map((f) => (
                <AttributePill
                  key={f.id}
                  label={f.label}
                  selected={roomType.includes(f.id)}
                  onClick={() => setRoomType(toggle(roomType, f.id))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>{rooms.length} rooms</span>
            {totalFilters > 0 && (
              <span> · <span style={{ color: 'var(--color-teal)', fontWeight: 600 }}>{matchingCount}</span> match your filters</span>
            )}
          </p>
          <div
            className="flex items-center"
            style={{
              background: 'var(--color-surface-alt)',
              borderRadius: 'var(--radius-full)',
              padding: '2px',
            }}
          >
            <button
              onClick={() => setSort('best')}
              className="text-xs font-medium px-3 py-1.5 transition-colors"
              style={{
                borderRadius: 'var(--radius-full)',
                background: sort === 'best' ? 'var(--color-surface)' : 'transparent',
                color: sort === 'best' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: sort === 'best' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Best match
            </button>
            <button
              onClick={() => setSort('price')}
              className="text-xs font-medium px-3 py-1.5 transition-colors"
              style={{
                borderRadius: 'var(--radius-full)',
                background: sort === 'price' ? 'var(--color-surface)' : 'transparent',
                color: sort === 'price' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                boxShadow: sort === 'price' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              Price
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <AnimatePresence>
          {sortedRooms.map((room, idx) => {
            const matchCount = getRoomMatchCount(room)
            const matchedAttributes = getMatchedAttributes(room)
            const isBestMatch = totalFilters > 0 && idx === 0 && matchCount === totalFilters
            return (
              <motion.div
                key={room.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <RoomCard
                  room={room}
                  selected={selectedRoom?.id === room.id}
                  onSelect={() => handleSelect(room)}
                  matchCount={matchCount}
                  totalFilters={totalFilters}
                  bestMatch={isBestMatch}
                  showDetails={expandedDetails === room.id}
                  onToggleDetails={() => setExpandedDetails(expandedDetails === room.id ? null : room.id)}
                  matchedAttributes={matchedAttributes}
                />
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
