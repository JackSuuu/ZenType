import React from 'react'
import { motion } from 'framer-motion'
import { useTypingStore } from '../../stores/typingStore'
import { useSettingsStore } from '../../stores/settingsStore'

function calcLiveWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds < 1) return 0
  return Math.round((correctChars / 5) / (elapsedSeconds / 60))
}

export const StatsPanel: React.FC = () => {
  const {
    testState,
    mode,
    timeRemaining,
    timeElapsed,
    correctChars,
    incorrectChars,
    currentWordIndex,
    wordCount,
    words,
  } = useTypingStore()
  const { showLiveWpm, showLiveAcc } = useSettingsStore()

  const isRunning = testState === 'running'
  const liveWpm = calcLiveWpm(correctChars, timeElapsed)
  const totalTyped = correctChars + incorrectChars
  const liveAcc = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 100

  // Progress for words mode
  const progress = mode === 'words' ? (currentWordIndex / (wordCount || words.length)) * 100 : 0

  return (
    <motion.div
      animate={isRunning
        ? { opacity: 1, y: 0, pointerEvents: 'auto' as const }
        : { opacity: 0, y: -6, pointerEvents: 'none' as const }
      }
      initial={false}
      transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ willChange: 'transform, opacity' }}
      className="flex items-center justify-between mb-6"
    >
      {/* Left: WPM */}
      {showLiveWpm && (
        <div className="text-center">
          <div className="stat-value">{liveWpm}</div>
          <div className="stat-label">wpm</div>
        </div>
      )}

      {/* Center: Timer or Progress */}
      <div className="text-center flex-1 mx-8">
        {mode === 'time' ? (
          <>
            <div
              className="font-mono font-bold"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: timeRemaining <= 5 ? 'var(--error)' : 'var(--text)',
                lineHeight: 1,
                transition: 'color 0.3s ease',
              }}
            >
              {timeRemaining}
            </div>
            <div className="stat-label">seconds</div>
          </>
        ) : mode === 'words' ? (
          <>
            <div className="font-mono font-bold"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--text)', lineHeight: 1 }}
            >
              {currentWordIndex}<span className="opacity-40">/{wordCount || words.length}</span>
            </div>
            <div className="stat-label">words</div>
            {/* Progress bar */}
            <div className="mt-2 h-0.5 rounded-full overflow-hidden"
              style={{ background: 'var(--border)', width: '80px', margin: '8px auto 0' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--primary)' }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </>
        ) : null}
      </div>

      {/* Right: Accuracy */}
      {showLiveAcc && (
        <div className="text-center">
          <div className="stat-value" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            {liveAcc}
            <span className="text-sm font-normal" style={{ color: 'var(--subtext)' }}>%</span>
          </div>
          <div className="stat-label">acc</div>
        </div>
      )}
    </motion.div>
  )
}

export default StatsPanel
