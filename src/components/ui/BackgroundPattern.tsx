import React from 'react'

export const BackgroundPattern: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {/* Fine dot grid — future-zen feel */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.18 }}
      >
        <defs>
          <pattern id="dotgrid" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.8" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dotgrid)" style={{ color: 'var(--border)' }} />
      </svg>

      {/* Central radial bloom — soft primary haze */}
      <div
        className="absolute"
        style={{
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '70vw',
          height: '60vh',
          background: 'radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)',
          opacity: 0.04,
          filter: 'blur(40px)',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, var(--bg) 90%)',
        }}
      />
    </div>
  )
}

export default BackgroundPattern
