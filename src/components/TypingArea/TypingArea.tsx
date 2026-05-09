import React, { useMemo, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import type { TypingViewState } from '../../hooks/useTypingEngine'
import clsx from 'clsx'

interface TypingAreaProps {
  viewState: TypingViewState
  testState: string
  onMobileKey?: (key: string) => void
}

const FONT_SIZE_MAP = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
}

const LINE_HEIGHT = 'leading-[2.6em]'
const WORDS_PER_LINE = 9

// Single word rendering — memoized so unchanged words never re-render
const WordSpan = React.memo(function WordSpan({
  word,
  isCurrentWord,
  isPastWord,
  typedWord,
  blindMode,
  renderTick,
}: {
  word: { original: string; chars: { char: string; status: string }[]; isCompleted: boolean; hasError: boolean }
  isCurrentWord: boolean
  isPastWord: boolean
  typedWord: string
  blindMode: boolean
  renderTick: number
}) {
  const extraTyped = isCurrentWord ? typedWord.slice(word.original.length) : ''
  const atEnd = isCurrentWord && typedWord.length >= word.original.length

  return (
    <span className="relative inline-block">
      {word.chars.map((charData, charIdx) => {
        // Mark current char with data attribute — caret div reads this to position itself
        const isCurrentChar = isCurrentWord && charIdx === typedWord.length

        let statusClass = 'char-pending'
        if (blindMode && isPastWord) {
          statusClass = 'char-correct'
        } else if (charData.status === 'correct') {
          statusClass = 'char-correct'
        } else if (charData.status === 'error') {
          statusClass = 'char-error'
        }

        return (
          <span
            key={charIdx}
            data-tick={statusClass !== 'char-pending' ? renderTick : undefined}
            data-char-cursor={isCurrentChar ? '' : undefined}
            className={statusClass}
          >
            {charData.char}
          </span>
        )
      })}

      {/* Extra typed chars beyond word length */}
      {extraTyped && (
        <span className="char-extra" data-tick={renderTick}>{extraTyped}</span>
      )}

      {/* 0-width anchor at end of word — caret sits here when word is fully typed */}
      <span
        data-char-cursor={atEnd ? '' : undefined}
        style={{ display: 'inline-block', width: 0, overflow: 'visible' }}
        aria-hidden="true"
      />
    </span>
  )
})

export const TypingArea: React.FC<TypingAreaProps> = ({ viewState, testState, onMobileKey }) => {
  const { blindMode, fontSize } = useSettingsStore()
  const { words, currentWordIndex, typedWord, renderTick } = viewState

  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const caretRef = useRef<HTMLDivElement>(null)

  // Track line for scroll animation
  const currentLine = Math.floor(currentWordIndex / WORDS_PER_LINE)
  const prevLineRef = useRef(currentLine)
  const lineChanged = currentLine !== prevLineRef.current
  if (lineChanged) prevLineRef.current = currentLine

  const VISIBLE_LINES = 3
  const visibleSlice = useMemo(() => {
    const startLine = Math.max(0, currentLine - 1)
    const startIdx = startLine * WORDS_PER_LINE
    const endIdx = Math.min(words.length, (startLine + VISIBLE_LINES) * WORDS_PER_LINE)
    return { words: words.slice(startIdx, endIdx), offset: startIdx }
  }, [words, currentLine])

  // Focus hidden input
  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    if (testState !== 'finished') focusInput()
  }, [testState, focusInput])

  // ── Smooth sliding caret ──────────────────────────────────────────────────
  // After every state update, find the [data-char-cursor] element and move the
  // caret div to its position using CSS transition — gives a smooth slide.
  useEffect(() => {
    const wrapper = wrapperRef.current
    const caret = caretRef.current
    if (!wrapper || !caret) return

    const cursorEl = wrapper.querySelector('[data-char-cursor]') as HTMLElement | null
    if (!cursorEl) return

    const wRect = wrapper.getBoundingClientRect()
    const cRect = cursorEl.getBoundingClientRect()

    const left = cRect.left - wRect.left
    const top  = cRect.top  - wRect.top

    caret.style.left   = `${left}px`
    caret.style.top    = `${top + cRect.height * 0.08}px`
    caret.style.height = `${cRect.height * 0.84}px`
  }, [renderTick, currentWordIndex, typedWord])

  // Mobile input handling
  const lastValueRef = useRef('')
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const newValue = input.value
    const old = lastValueRef.current

    if (newValue.length > old.length) {
      const added = newValue.slice(old.length)
      for (const ch of added) onMobileKey?.(ch)
    } else if (newValue.length < old.length) {
      const deletedCount = old.length - newValue.length
      for (let i = 0; i < deletedCount; i++) onMobileKey?.('Backspace')
    }

    lastValueRef.current = newValue

    if (newValue.includes(' ')) {
      onMobileKey?.(' ')
      input.value = ''
      lastValueRef.current = ''
    }
  }, [onMobileKey])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ' ' || e.key === 'Enter') e.preventDefault()
  }, [])

  if (words.length === 0) return null

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        'relative font-mono select-none cursor-text',
        FONT_SIZE_MAP[fontSize],
        LINE_HEIGHT,
      )}
      style={{ color: 'var(--subtext)' }}
      onClick={focusInput}
      onTouchStart={focusInput}
    >
      {/* Hidden input for mobile virtual keyboard */}
      <input
        ref={hiddenInputRef}
        type="text"
        inputMode="text"
        autoCorrect="off"
        autoCapitalize="none"
        autoComplete="off"
        spellCheck={false}
        aria-hidden="true"
        tabIndex={-1}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        style={{
          position: 'absolute',
          opacity: 0,
          width: '1px',
          height: '1px',
          top: '50%',
          left: '50%',
          pointerEvents: 'none',
          border: 'none',
          background: 'transparent',
          color: 'transparent',
          caretColor: 'transparent',
          fontSize: '16px',
          zIndex: -1,
        }}
      />

      {/* Smooth sliding caret — one GPU-composited element, transitions left/top */}
      <div
        ref={caretRef}
        className="char-caret"
        aria-hidden="true"
        style={{
          position: 'absolute',
          width: '2px',
          top: 0,
          left: 0,
          background: 'var(--primary)',
          borderRadius: '2px',
          pointerEvents: 'none',
          // Slide to new position on keystroke; cross-line jump is instant (top transition
          // is intentionally shorter so it snaps on line change, not slides awkwardly)
          transition: 'left 60ms cubic-bezier(0.25,0.1,0.25,1), top 40ms step-end, height 40ms step-end',
          animation: 'cursorBlink 1.05s ease-in-out infinite',
          willChange: 'left, top',
          zIndex: 10,
        }}
      />

      {/* Word rows — smooth line scroll */}
      <motion.div
        animate={{ y: lineChanged ? [4, 0] : 0, opacity: lineChanged ? [0.75, 1] : 1 }}
        transition={{ duration: 0.14, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ willChange: 'transform, opacity', maxHeight: `calc(2.6em * ${VISIBLE_LINES})` }}
        className="flex flex-wrap gap-x-[0.6em] gap-y-0 overflow-hidden"
      >
        {visibleSlice.words.map((word, relIdx) => {
          const wordIdx = relIdx + visibleSlice.offset
          const isCurrentWord = wordIdx === currentWordIndex
          const isPastWord = wordIdx < currentWordIndex

          return (
            <WordSpan
              key={wordIdx}
              word={word}
              isCurrentWord={isCurrentWord}
              isPastWord={isPastWord}
              typedWord={isCurrentWord ? typedWord : ''}
              blindMode={blindMode}
              renderTick={renderTick}
            />
          )
        })}
      </motion.div>

      {/* Idle hint */}
      {testState === 'idle' && words.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="font-mono text-sm" style={{ color: 'var(--subtext)', opacity: 0.4 }}>
            tap or start typing...
          </span>
        </div>
      )}
    </div>
  )
}

export default TypingArea
