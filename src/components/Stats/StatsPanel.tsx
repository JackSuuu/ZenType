import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    <AnimatePresence>
      {isRunning && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
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
                <motion.div
                  key={timeRemaining}
                  initial={{ scale: 1.1, opacity: 0.6 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="font-mono font-bold"
                  style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: timeRemaining <= 5 ? 'var(--error)' : 'var(--secondary)',
                    lineHeight: 1,
                  }}
                >
                  {timeRemaining}
                </motion.div>
                <div className="stat-label">seconds</div>
              </>
            ) : mode === 'words' ? (
              <>
                <div className="font-mono font-bold"
                  style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: 'var(--secondary)', lineHeight: 1 }}
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
                    style={{ background: 'var(--secondary)' }}
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
      )}
    </AnimatePresence>
  )
}

export default StatsPanel
