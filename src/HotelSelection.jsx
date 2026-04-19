import { useNavigate } from 'react-router-dom'

export default function HotelSelection() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg)' }}>
      {/* Top nav */}
      <div style={{ background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="max-w-[960px] mx-auto px-6 py-4">
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              color: 'var(--color-text-primary)',
            }}
          >
            The Straits
          </span>
        </div>
      </div>

      <div className="max-w-[960px] mx-auto px-6 py-10">
        {/* Search bar */}
        <div
          className="flex items-stretch mb-8 overflow-hidden"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          <div className="flex-1 px-5 py-4" style={{ borderRight: '1px solid var(--color-border)' }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Destination
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              Singapore
            </p>
          </div>

          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--color-border)' }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Check-in
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              14 Jun 2025
            </p>
          </div>

          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--color-border)' }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Check-out
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              17 Jun 2025
            </p>
          </div>

          <div className="px-5 py-4" style={{ borderRight: '1px solid var(--color-border)' }}>
            <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
              Guests
            </p>
            <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
              2 guests
            </p>
          </div>

          <div className="flex items-center px-5">
            <button
              disabled
              className="px-6 py-2.5 text-sm font-semibold text-white"
              style={{
                background: 'var(--color-text-primary)',
                borderRadius: 'var(--radius-md)',
                opacity: 0.35,
                cursor: 'not-allowed',
              }}
            >
              Search
            </button>
          </div>
        </div>

        {/* Results label */}
        <p className="text-sm font-medium mb-4" style={{ color: 'var(--color-text-secondary)' }}>
          1 property found
        </p>

        {/* Hotel card */}
        <div
          className="flex overflow-hidden"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)',
          }}
        >
          {/* Hotel image */}
          <div className="flex-shrink-0 overflow-hidden" style={{ width: 280, height: 240 }}>
            <img
              src="/assets/deluxe-balcony.jpg"
              alt="The Straits Hotel"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              {/* Star rating */}
              <div className="flex items-center gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
                <span
                  className="text-xs font-medium ml-1"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  5-star hotel
                </span>
              </div>

              <h2
                className="text-xl mb-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--color-text-primary)',
                }}
              >
                The Straits Hotel
              </h2>

              <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                12 Bukit Manis Road, Sentosa Island, Singapore 099891
              </p>

              <div className="flex flex-col gap-1.5 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                <span>+65 6123 8888</span>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="underline"
                  style={{ color: 'var(--color-teal)' }}
                >
                  www.thestraitshotel.com.sg
                </a>
              </div>
            </div>

            {/* Price + CTA */}
            <div className="flex items-end justify-between pt-4">
              <div>
                <p className="text-xs font-medium mb-0.5" style={{ color: 'var(--color-text-tertiary)' }}>
                  Rooms from
                </p>
                <p className="text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  SGD 180
                  <span
                    className="text-sm font-normal ml-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    / night
                  </span>
                </p>
              </div>

              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{
                  background: 'var(--color-text-primary)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                Select Hotel →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
