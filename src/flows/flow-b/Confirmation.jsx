import { useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { attributes } from '../../data/attributes'
import { serviceCategories } from '../../data/services'

const NIGHTS = 3

function calcRoomBase(matchedRoom, selectedAttributes) {
  if (!matchedRoom) return 0
  const base = matchedRoom.basePricePerNight * NIGHTS
  let deltas = 0
  for (const attr of attributes) {
    const val = selectedAttributes[attr.id]
    if (val === undefined) continue
    const opt = attr.options.find((o) => o.value === val)
    if (opt && opt.priceDelta && opt.priceDelta > 0) {
      deltas += opt.priceDelta
    }
  }
  return base + deltas * NIGHTS
}

function calcServiceAdjustment(selectedServices) {
  let adj = 0
  for (const cat of serviceCategories) {
    for (const item of cat.items) {
      if (item.tag === 'included') continue
      const checked = selectedServices.includes(item.id)
      if (item.defaultIncluded && checked) adj -= item.price
      else if (!item.defaultIncluded && checked) adj += item.price
    }
  }
  return adj
}

function buildServicesSummaryList(selectedServices) {
  const list = []
  for (const cat of serviceCategories) {
    for (const item of cat.items) {
      if (item.tag === 'included') continue
      const checked = selectedServices.includes(item.id)
      if (item.defaultIncluded && checked) {
        list.push({ id: item.id, name: item.name, price: -item.price })
      } else if (!item.defaultIncluded && checked) {
        list.push({ id: item.id, name: item.name, price: item.price })
      }
    }
  }
  return list
}

export default function Confirmation() {
  const { selectedRoom, selectedAttributes, selectedServices } = useOutletContext()
  const navigate = useNavigate()

  const roomBase = useMemo(
    () => calcRoomBase(selectedRoom, selectedAttributes),
    [selectedRoom, selectedAttributes]
  )

  const serviceAdj = useMemo(() => calcServiceAdjustment(selectedServices), [selectedServices])
  const total = roomBase + serviceAdj

  const servicesSummaryList = useMemo(
    () => buildServicesSummaryList(selectedServices),
    [selectedServices]
  )

  // Build attribute pills for display
  const attrPills = useMemo(() => {
    if (!selectedAttributes) return []
    const pills = []
    for (const attr of attributes) {
      const val = selectedAttributes[attr.id]
      if (val === undefined) continue
      // Handle multi-select (array) attributes like bedding
      if (Array.isArray(val)) {
        for (const v of val) {
          const opt = attr.options.find((o) => o.value === v)
          if (opt && opt.emoji !== '🚫') pills.push({ label: opt.label, emoji: opt.emoji })
        }
        continue
      }
      const opt = attr.options.find((o) => o.value === val)
      if (!opt) continue
      pills.push({ label: opt.label, emoji: opt.emoji })
    }
    return pills
  }, [selectedAttributes])

  const roomName = selectedRoom?.name ?? 'Your room'

  return (
    <div className="max-w-[800px] mx-auto px-6 py-8" style={{ paddingBottom: '48px' }}>
      {/* Room summary card */}
      <div
        className="mb-4"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '6px',
          }}
        >
          YOUR ROOM
        </p>
        <p
          className="text-lg mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
        >
          {roomName}
        </p>
        {selectedRoom?.tagline && (
          <p className="text-sm mb-3" style={{ color: 'var(--color-text-secondary)' }}>
            {selectedRoom.tagline}
          </p>
        )}

        {/* Attribute pills */}
        <div className="flex flex-wrap gap-1.5">
          {attrPills.map((pill, i) => (
            <span
              key={i}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'var(--color-teal-light)',
                color: 'var(--color-teal)',
                fontSize: '12px',
                fontWeight: 500,
              }}
            >
              {pill.label}
            </span>
          ))}
        </div>
      </div>

      {/* Price breakdown card */}
      <div
        className="mb-6"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          padding: '20px',
          border: '1px solid var(--color-border)',
        }}
      >
        <p
          style={{
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            letterSpacing: '0.12em',
            fontWeight: 600,
            textTransform: 'uppercase',
            marginBottom: '12px',
          }}
        >
          PRICE BREAKDOWN
        </p>

        <div className="flex justify-between text-sm mb-2">
          <span style={{ color: 'var(--color-text-secondary)' }}>
            {roomName} · {NIGHTS} nights
          </span>
          <span style={{ color: 'var(--color-text-primary)' }}>SGD {roomBase}</span>
        </div>

        {servicesSummaryList.map((svc) => (
          <div key={svc.id} className="flex justify-between text-sm mb-1">
            <span style={{ color: 'var(--color-text-secondary)' }}>{svc.name}</span>
            <span
              style={{
                color: svc.price < 0 ? 'var(--color-positive)' : 'var(--color-text-primary)',
              }}
            >
              {svc.price < 0 ? `-SGD ${Math.abs(svc.price)}` : `+SGD ${svc.price}`}
            </span>
          </div>
        ))}

        <div
          className="flex justify-between text-sm font-semibold pt-3 mt-2"
          style={{ borderTop: '1px solid var(--color-border)' }}
        >
          <span style={{ color: 'var(--color-text-primary)' }}>Total</span>
          <motion.span
            key={total}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            style={{ color: 'var(--color-text-primary)' }}
          >
            SGD {total}
          </motion.span>
        </div>
      </div>

      {/* Stay details */}
      <div
        className="mb-8 px-4 py-3 rounded-xl flex items-center justify-between"
        style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-md)' }}
      >
        <div>
          <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
            The Straits, Singapore
          </p>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            14–17 Jun · 2 guests · {NIGHTS} nights
          </p>
        </div>
      </div>

      {/* Navigation actions */}
      <div className="flex flex-col gap-3">
        <button
          className="w-full text-base font-semibold text-white transition-opacity hover:opacity-90"
          style={{
            background: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          Confirm and pay →
        </button>
        <button
          onClick={() => navigate('../services')}
          className="w-full text-sm font-medium transition-opacity hover:opacity-70"
          style={{
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-text-secondary)',
            padding: '12px',
            background: 'none',
          }}
        >
          ← Back to services
        </button>
      </div>
    </div>
  )
}
