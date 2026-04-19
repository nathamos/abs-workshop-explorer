import { useState } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const PRESETS = {
  nightly: [180, 220, 280, 350],
  trip:    [540, 660, 840, 1050],
}

export default function BudgetEntry() {
  const { budget, setBudget, budgetMode, setBudgetMode } = useOutletContext()
  const navigate = useNavigate()

  const toDisplay = (perNight, mode) =>
    mode === 'nightly' ? perNight : Math.round(perNight * 3)

  const [inputValue, setInputValue] = useState(String(toDisplay(budget, budgetMode)))

  function switchMode(mode) {
    setBudgetMode(mode)
    setInputValue(String(toDisplay(budget, mode)))
  }

  function handlePreset(val) {
    const perNight = budgetMode === 'nightly' ? val : Math.round(val / 3)
    setBudget(perNight)
    setInputValue(String(val))
  }

  function handleInput(raw) {
    setInputValue(raw)
  }

  function handleStart() {
    const n = parseInt(inputValue, 10) || 200
    const perNight = budgetMode === 'nightly' ? n : Math.round(n / 3)
    setBudget(Math.max(perNight, 60))
    navigate('/flow-budget/room')
  }

  const activePresets = PRESETS[budgetMode]
  const displayBudget = toDisplay(budget, budgetMode)

  const modeToggle = {
    wrapper: {
      display: 'flex',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-full)',
      padding: 3,
      gap: 2,
      width: 'fit-content',
      marginBottom: 32,
    },
    btn: (active) => ({
      padding: '7px 18px',
      borderRadius: 'var(--radius-full)',
      border: 'none',
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      background: active ? 'var(--color-teal)' : 'transparent',
      color: active ? '#fff' : 'var(--color-text-secondary)',
      transition: 'background 0.15s, color 0.15s',
    }),
  }

  return (
    <div style={{ maxWidth: 460, margin: '72px auto', padding: '0 24px 120px' }}>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          color: 'var(--color-text-primary)',
          marginBottom: 8,
          lineHeight: 1.15,
        }}
      >
        What's your budget?
      </h1>
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
        Set a limit and we'll show how far it goes — base room and every upgrade included.
      </p>

      {/* Nightly / trip toggle */}
      <div style={modeToggle.wrapper}>
        <button style={modeToggle.btn(budgetMode === 'nightly')} onClick={() => switchMode('nightly')}>
          Per night
        </button>
        <button style={modeToggle.btn(budgetMode === 'trip')} onClick={() => switchMode('trip')}>
          3 nights total
        </button>
      </div>

      {/* Presets */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {activePresets.map((p) => {
          const isActive = p === displayBudget
          return (
            <button
              key={p}
              onClick={() => handlePreset(p)}
              style={{
                flex: 1,
                padding: '9px 4px',
                borderRadius: 'var(--radius-full)',
                border: isActive ? '1.5px solid var(--color-teal)' : '1px solid var(--color-border)',
                background: isActive ? 'var(--color-teal-light)' : 'var(--color-surface)',
                color: isActive ? 'var(--color-teal)' : 'var(--color-text-secondary)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              ${p}
            </button>
          )
        })}
      </div>

      {/* Custom input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'var(--color-surface)',
          border: '1.5px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 16px',
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: 20, fontWeight: 500, color: 'var(--color-text-secondary)' }}>SGD</span>
        <input
          type="number"
          value={inputValue}
          min={60}
          max={5000}
          step={budgetMode === 'nightly' ? 10 : 30}
          onChange={(e) => handleInput(e.target.value)}
          style={{
            flex: 1,
            border: 'none',
            background: 'transparent',
            fontSize: 28,
            fontWeight: 600,
            color: 'var(--color-text-primary)',
            outline: 'none',
            width: '100%',
          }}
        />
        <span style={{ fontSize: 13, color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
          {budgetMode === 'nightly' ? '/ night' : 'for 3 nights'}
        </span>
      </div>
      <p style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginBottom: 32, textAlign: 'center' }}>
        14–17 June · 3 nights · 2 guests
      </p>

      <button
        onClick={handleStart}
        style={{
          width: '100%',
          padding: '15px',
          background: 'var(--color-teal)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
        }}
        className="transition-opacity hover:opacity-90"
      >
        Start building →
      </button>
    </div>
  )
}
