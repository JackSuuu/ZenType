import React, { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTypingStore } from '../stores/typingStore'
import { useSettingsStore } from '../stores/settingsStore'
import { useTypingEngine } from '../hooks/useTypingEngine'
import { useTimer } from '../hooks/useTimer'
import { TypingArea } from '../components/TypingArea/TypingArea'
import { StatsPanel } from '../components/Stats/StatsPanel'
import { Results } from '../components/Results/Results'
import { Tabs } from '../components/ui/Tabs'
import clsx from 'clsx'

const TIME_OPTIONS = [
  { id: '15', label: '15' },
  { id: '30', label: '30' },
  { id: '60', label: '60' },
  { id: '120', label: '120' },
]

const WORD_OPTIONS = [
  { id: '10', label: '10' },
  { id: '25', label: '25' },
  { id: '50', label: '50' },
  { id: '100', label: '100' },
]

const LANG_OPTIONS = [
  { id: 'english', label: 'english' },
  { id: 'english_1k', label: 'english 1k' },
  { id: 'code', label: 'code' },
  { id: 'japanese', label: 'japanese' },
]

const MODE_TABS = [
  { id: 'time', label: 'time', labelSub: '時' },
  { id: 'words', label: 'words', labelSub: '語' },
  { id: 'quote', label: 'quote', labelSub: '句' },
  { id: 'zen', label: 'zen', labelSub: '禅' },
]

const SakuraPetal: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div
    className="fixed pointer-events-none z-10"
    style={{
      ...style,
      animation: `sakuraFall ${3 + Math.random() * 3}s ease-in-out forwards`,
    }}
  >
    <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
      <path d="M6 1 C8 3, 10 5, 8 8 C6 11, 4 11, 2 8 C0 5, 2 3, 6 1Z"
        fill="var(--primary)" opacity="0.5" />
    </svg>
  </div>
)

export const Home: React.FC = () => {
  const store = useTypingStore()
  const { language, setLanguage } = useSettingsStore()
  const { testState, mode, timeLimit, wordCount, lastResult } = store

  // useTypingEngine now owns words locally and returns viewState for TypingArea
  const { viewState, handleMobileKey } = useTypingEngine()
  useTimer()

  // Init test on mount and when config changes
  useEffect(() => {
    store.initTest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, timeLimit, wordCount, language])

  // Map settings language to store language key
  useEffect(() => {
    const langMap: Record<string, any> = {
      english: 'english',
      english_1k: 'english_1k',
      code: 'code',
      japanese: 'japanese',
      chinese: 'english',
    }
    store.setLanguage(langMap[language] || 'english')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  // Tab to restart
  const handleTabKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        store.resetTest()
      }
    },
    [store]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleTabKey)
    return () => window.removeEventListener('keydown', handleTabKey)
  }, [handleTabKey])

  // Sakura particles on finish
  const [petals, setPetals] = React.useState<{ id: number; left: number }[]>([])
  useEffect(() => {
    if (testState === 'finished') {
      const newPetals = Array.from({ length: 10 }, (_, i) => ({
        id: Date.now() + i,
        left: 5 + Math.random() * 90,
      }))
      setPetals(newPetals)
      const t = setTimeout(() => setPetals([]), 5000)
      return () => clearTimeout(t)
    }
  }, [testState])

  const isFinished = testState === 'finished'

  return (
    <div
      className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4"
      style={{ position: 'relative', minHeight: 'calc(100vh - 140px)', marginTop: '-3rem' }}
    >
      {petals.map((p) => (
        <SakuraPetal key={p.id} style={{ left: `${p.left}%`, top: '-20px' }} />
      ))}

      <div className="w-full max-w-3xl" style={{ touchAction: 'manipulation' }}>
        <AnimatePresence mode="wait">
          {isFinished && lastResult ? (
            <Results
              key="results"
              result={lastResult}
              onRestart={() => store.resetTest()}
              onNewTest={() => { store.setMode('time'); store.resetTest() }}
            />
          ) : (
            <motion.div
              key="typing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Mode / config selector — always in DOM, GPU-only hide/show.
                  Uses scaleY+opacity (GPU composited) instead of maxHeight (layout reflow). */}
              <motion.div
                animate={testState === 'idle'
                  ? { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' as const }
                  : { opacity: 0, y: -6, scale: 0.97, pointerEvents: 'none' as const }
                }
                initial={false}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ transformOrigin: 'top center', willChange: 'transform, opacity' }}
                className="flex flex-col items-center gap-2"
              >
                <Tabs
                  tabs={MODE_TABS}
                  activeTab={mode}
                  onChange={(id) => store.setMode(id as any)}
                />

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {mode === 'time' && TIME_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => store.setTimeLimit(Number(opt.id))}
                      className={clsx('zen-btn text-xs', timeLimit === Number(opt.id) && 'active')}
                    >
                      {opt.label}
                    </button>
                  ))}
                  {mode === 'words' && WORD_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => store.setWordCount(Number(opt.id))}
                      className={clsx('zen-btn text-xs', wordCount === Number(opt.id) && 'active')}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {mode !== 'quote' && mode !== 'zen' && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {LANG_OPTIONS.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setLanguage(lang.id as any)}
                        className={clsx('zen-btn text-xs', language === lang.id && 'active')}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Live stats bar */}
              <StatsPanel />

              {/* Typing area */}
              <div
                className="relative px-1 sm:px-2 py-3 sm:py-4 cursor-text"
                style={{ minHeight: '148px' }}
              >
                <TypingArea viewState={viewState} testState={testState} onMobileKey={handleMobileKey} />
              </div>

              {/* Tab hint — always in DOM, GPU-only fade */}
              <motion.div
                animate={testState === 'running'
                  ? { opacity: 1, pointerEvents: 'auto' as const }
                  : { opacity: 0, pointerEvents: 'none' as const }
                }
                initial={false}
                transition={{ duration: 0.15 }}
                className="text-center mt-3"
              >
                <span className="font-mono text-xs" style={{ color: 'var(--subtext)', opacity: 0.35 }}>
                  tab to restart
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Home
