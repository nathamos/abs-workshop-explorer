import { useState, useMemo } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import StepHeader from '../../components/shared/StepHeader'
import ContextStrip from '../../components/shared/ContextStrip'
import ServiceItem from '../../components/shared/ServiceItem'
import BookingSummary from '../../components/shared/BookingSummary'
import { serviceCategories } from '../../data/services'
import { attributes } from '../../data/attributes'

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
      if (item.defaultIncluded) {
        if (checked) adj -= item.price
      } else {
        if (checked) adj += item.price
      }
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

export default function Services() {
  const { selectedRoom, selectedAttributes, selectedServices, setSelectedServices } = useOutletContext()
  const navigate = useNavigate()

  const [activeCategoryId, setActiveCategoryId] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const roomBase = useMemo(
    () => calcRoomBase(selectedRoom, selectedAttributes),
    [selectedRoom, selectedAttributes]
  )

  const serviceAdj = useMemo(() => calcServiceAdjustment(selectedServices), [selectedServices])
  const total = roomBase + serviceAdj

  const servicesSummaryList = useMemo(() => buildServicesSummaryList(selectedServices), [selectedServices])

  const activeCategory = activeCategoryId
    ? serviceCategories.find((c) => c.id === activeCategoryId)
    : null

  function toggleService(id) {
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  function getCountForCategory(catId) {
    const cat = serviceCategories.find((c) => c.id === catId)
    if (!cat) return 0
    return cat.items.filter(
      (item) => item.tag !== 'included' && selectedServices.includes(item.id)
    ).length
  }

  const roomName = selectedRoom?.name ?? 'Your room'

  if (activeCategory) {
    const catTotal = activeCategory.items.reduce((acc, item) => {
      if (item.tag === 'included') return acc
      const checked = selectedServices.includes(item.id)
      if (item.defaultIncluded && checked) return acc - item.price
      if (!item.defaultIncluded && checked) return acc + item.price
      return acc
    }, 0)

    const runningTotal = roomBase + serviceAdj

    return (
      <div className="max-w-[800px] mx-auto px-6 py-8" style={{ paddingBottom: '120px' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setActiveCategoryId(null)}
            className="text-sm font-medium"
            style={{ color: 'var(--color-teal)' }}
          >
            ← Back
          </button>
          <p
            className="text-base font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {activeCategory.label}
          </p>
          <button
            onClick={() => setDrawerOpen(true)}
            className="text-sm font-semibold px-3 py-1.5 rounded-full"
            style={{
              background: 'var(--color-teal)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
            }}
          >
            SGD {runningTotal}
          </button>
        </div>

        {/* Items */}
        <div>
          {activeCategory.items.map((item) => (
            <ServiceItem
              key={item.id}
              item={item}
              checked={selectedServices.includes(item.id)}
              onChange={(checked) => {
                setSelectedServices((prev) =>
                  checked ? [...prev, item.id] : prev.filter((s) => s !== item.id)
                )
              }}
            />
          ))}
        </div>

        {/* Done button */}
        <button
          onClick={() => setActiveCategoryId(null)}
          className="w-full text-base font-semibold text-white mt-6"
          style={{
            background: 'var(--color-text-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
          }}
        >
          Done
        </button>

        {/* Bottom drawer — full bill */}
        <AnimatePresence>
          {drawerOpen && (
            <>
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40"
                style={{ background: 'rgba(0,0,0,0.4)' }}
                onClick={() => setDrawerOpen(false)}
              />
              <motion.div
                key="drawer"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 z-50"
                style={{
                  background: 'var(--color-surface)',
                  borderRadius: '20px 20px 0 0',
                  padding: '24px',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                }}
              >
                <p
                  className="text-base font-semibold mb-4"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  Full bill
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
                  <span>Total</span>
                  <motion.span key={runningTotal} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}>
                    SGD {runningTotal}
                  </motion.span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-full text-sm font-semibold mt-4"
                  style={{
                    background: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  Close
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // Home screen
  return (
    <div className="max-w-[800px] mx-auto px-6 py-8" style={{ paddingBottom: '120px' }}>
      <StepHeader
        step={2}
        totalSteps={3}
        title="Enhance your stay"
        subtitle="Add services, or opt out of defaults for a credit."
      />

      <ContextStrip
        roomName={roomName}
        nights={NIGHTS}
        totalPrice={roomBase}
        dates="14–17 Jun"
        guests="2 guests"
      />

      <div
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        {serviceCategories.map((cat, idx) => {
          const count = getCountForCategory(cat.id)
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className="w-full flex items-center gap-4 px-4 py-4 text-left transition-colors hover:bg-gray-50"
              style={{
                borderBottom:
                  idx < serviceCategories.length - 1
                    ? '1px solid var(--color-border)'
                    : 'none',
              }}
            >
              {/* Emoji icon with counter badge */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-12 h-12 flex items-center justify-center text-2xl"
                  style={{
                    background: 'var(--color-surface-alt)',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  {cat.emoji}
                </div>
                {count > 0 && (
                  <div
                    className="absolute flex items-center justify-center"
                    style={{
                      top: '-4px',
                      right: '-4px',
                      width: '18px',
                      height: '18px',
                      background: 'var(--color-teal)',
                      borderRadius: '9999px',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </div>
                )}
              </div>

              {/* Name + description */}
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-text-primary)' }}
                >
                  {cat.label}
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {cat.description}
                </p>
              </div>

              {/* Chevron */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                style={{ flexShrink: 0, color: 'var(--color-text-tertiary)' }}
              >
                <path
                  d="M6 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )
        })}
      </div>

      <BookingSummary
        roomName={roomName}
        nights={NIGHTS}
        roomTotal={roomBase}
        selectedServices={servicesSummaryList}
        total={total}
        onContinue={() => navigate('../confirmation')}
      />
    </div>
  )
}
