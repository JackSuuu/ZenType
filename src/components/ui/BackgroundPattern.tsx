import React from 'react'

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Seigaiha (青海波) wave pattern - Japanese traditional */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.025 }}
      >
        <defs>
          <pattern id="seigaiha" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            {/* Half circles stacked like fish scales */}
            <circle cx="20" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="0" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="20" cy="20" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="0" cy="20" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
            <circle cx="40" cy="20" r="20" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha)" style={{ color: 'var(--text)' }} />
      </svg>

      {/* Radial gradient vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, var(--bg) 100%)',
        }}
      />

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to bottom, var(--bg), transparent)',
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32"
        style={{
          background: 'linear-gradient(to top, var(--bg), transparent)',
        }}
      />
    </div>
  )
}

export default BackgroundPattern
