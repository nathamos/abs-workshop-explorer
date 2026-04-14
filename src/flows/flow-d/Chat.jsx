import { useState, useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const questions = [
  {
    id: 'purpose',
    text: "Welcome to The Straits. Let's find the right room for your stay. What's bringing you to Singapore?",
    options: [
      { value: 'work', label: '💼 Work trip' },
      { value: 'romantic', label: '💑 Romantic getaway' },
      { value: 'leisure', label: '🧳 Leisure & exploring' },
      { value: 'family', label: '👨‍👩‍👧 Family holiday' },
    ],
  },
  {
    id: 'companion',
    text: 'And are you travelling solo, or with someone?',
    options: [
      { value: 'solo', label: '🙋 Just me' },
      { value: 'partner', label: '👫 With a partner' },
      { value: 'family', label: '👨‍👩‍👧 With family' },
      { value: 'colleagues', label: '👥 With colleagues' },
    ],
  },
  {
    id: 'view',
    text: 'How important is a view to you?',
    options: [
      { value: 'very', label: '🌊 Very — I want something special' },
      { value: 'nice', label: '🏙️ Nice to have, but not essential' },
      { value: 'not-bothered', label: "🛏️ Not bothered — I'm here to sleep" },
    ],
  },
  {
    id: 'style',
    text: 'How do you like to stay?',
    options: [
      { value: 'relaxed', label: '🧘 Relaxed — I want everything taken care of' },
      { value: 'active', label: '🗺️ Active — I\'m out most of the day' },
      { value: 'productive', label: '💻 Productive — I need a good workspace' },
      { value: 'celebratory', label: '🎉 Celebratory — it\'s a special occasion' },
    ],
  },
  {
    id: 'budget',
    text: 'Last one. How are you thinking about spend for this trip?',
    options: [
      { value: 'lean', label: '💰 Keep it lean — just the essentials' },
      { value: 'balanced', label: '⚖️ Balanced — some treats are fine' },
      { value: 'splurge', label: '✨ Go for it — make it memorable' },
    ],
  },
]

function determineProfile(answers) {
  if (answers.purpose === 'family' || answers.companion === 'family') return 'family'
  if (answers.purpose === 'work' || answers.style === 'productive') return 'business'
  if (answers.purpose === 'romantic' || (answers.companion === 'partner' && answers.view === 'very')) return 'couple'
  return 'explorer'
}

export default function Chat() {
  const { setAnswers, setProfile } = useOutletContext()
  const navigate = useNavigate()

  const [localAnswers, setLocalAnswers] = useState({})
  const [currentQ, setCurrentQ] = useState(0)
  const [answeredQs, setAnsweredQs] = useState(new Set())
  const [messages, setMessages] = useState([
    { id: 'q-0', type: 'system', text: questions[0].text },
  ])

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSelect(questionIndex, option) {
    if (answeredQs.has(questionIndex)) return

    const newAnswers = { ...localAnswers, [questions[questionIndex].id]: option.value }
    setLocalAnswers(newAnswers)
    setAnsweredQs(prev => new Set([...prev, questionIndex]))

    setMessages(prev => [
      ...prev,
      { id: `user-${questionIndex}`, type: 'user', text: option.label },
    ])

    const isLast = questionIndex === questions.length - 1

    setTimeout(() => {
      if (isLast) {
        const profile = determineProfile(newAnswers)
        setAnswers(newAnswers)
        setProfile(profile)
        navigate('/flow-d/recommendation')
      } else {
        const next = questionIndex + 1
        setCurrentQ(next)
        setMessages(prev => [
          ...prev,
          { id: `q-${next}`, type: 'system', text: questions[next].text },
        ])
      }
    }, isLast ? 800 : 600)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <div
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          height: '56px',
        }}
      >
        <div
          className="max-w-[800px] mx-auto px-4 h-full flex items-center justify-between"
        >
          <button
            onClick={() => navigate('/')}
            className="text-sm"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            ← Start over
          </button>
          <span
            className="absolute left-1/2 -translate-x-1/2 font-semibold text-sm"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--color-text-primary)' }}
          >
            The Straits
          </span>
        </div>
      </div>

      <div
        className="max-w-[800px] mx-auto px-6"
        style={{ paddingTop: '80px', paddingBottom: '40px' }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            if (msg.type === 'system') {
              const qIndex = parseInt(msg.id.split('-')[1])
              const question = questions[qIndex]
              const isAnswered = answeredQs.has(qIndex)
              const isActive = currentQ === qIndex && !isAnswered

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <div className="flex items-start gap-2 max-w-[75%]">
                    <span
                      className="mt-1 text-xs select-none"
                      style={{ color: 'var(--color-teal)' }}
                    >
                      ✦
                    </span>
                    <div
                      style={{
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-xl)',
                        padding: '14px 16px',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                        fontSize: '15px',
                        color: 'var(--color-text-primary)',
                        lineHeight: '1.5',
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.1 }}
                      className="flex flex-wrap gap-2 mt-3 ml-6"
                    >
                      {question.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleSelect(qIndex, opt)}
                          className="text-sm transition-all hover:opacity-80"
                          style={{
                            background: 'var(--color-surface)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-full)',
                            padding: '8px 14px',
                            color: 'var(--color-text-primary)',
                            cursor: 'pointer',
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </motion.div>
              )
            }

            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end mb-4"
              >
                <div
                  className="max-w-[65%] text-sm"
                  style={{
                    background: 'var(--color-teal-light)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '10px 14px',
                    color: 'var(--color-text-primary)',
                    lineHeight: '1.5',
                  }}
                >
                  {msg.text}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
