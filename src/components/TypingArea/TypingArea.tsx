import React, { useMemo, useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import type { TypingViewState } from '../../hooks/useTypingEngine'
import clsx from 'clsx'

interface TypingAreaProps {
  viewState: TypingViewState
  testState: string
  /** Called when the hidden input fires a key — used by mobile to drive the engine */
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
}: {
  word: { original: string; chars: { char: string; status: string }[]; isCompleted: boolean; hasError: boolean }
  isCurrentWord: boolean
  isPastWord: boolean
  typedWord: string
  blindMode: boolean
}) {
  // Extra chars typed beyond word length
  const extraTyped = isCurrentWord ? typedWord.slice(word.original.length) : ''

  return (
    <span className="relative inline-block">
      {word.chars.map((charData, charIdx) => {
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
            className={clsx(statusClass, isCurrentChar && 'char-cursor')}
          >
            {charData.char}
          </span>
        )
      })}

      {/* Extra typed characters — only visible when isCurrentWord */}
      {extraTyped && (
        <span className="char-extra">{extraTyped}</span>
      )}

      {/* Cursor beam at end of word */}
      <span
        className="char-cursor-beam"
        style={{
          opacity: isCurrentWord && typedWord.length >= word.original.length ? 1 : 0,
          width: 0,
        }}
      />
    </span>
  )
})

export const TypingArea: React.FC<TypingAreaProps> = ({ viewState, testState, onMobileKey }) => {
  const { blindMode, fontSize } = useSettingsStore()
  const { words, currentWordIndex, typedWord } = viewState

  // Hidden input ref for mobile virtual keyboard
  const hiddenInputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Track which display-line we're on to animate when it scrolls
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

  // Keep hidden input focused whenever the test is active or idle
  const focusInput = useCallback(() => {
    hiddenInputRef.current?.focus({ preventScroll: true })
  }, [])

  // Auto-focus on mount and state changes
  useEffect(() => {
    if (testState !== 'finished') {
      focusInput()
    }
  }, [testState, focusInput])

  // Handle mobile input events: map `input` events → synthetic key presses
  // This fires from the virtual keyboard's composition input
  const lastValueRef = useRef('')
  const handleInput = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const input = e.currentTarget
    const newValue = input.value
    const old = lastValueRef.current

    if (newValue.length > old.length) {
      // Characters added
      const added = newValue.slice(old.length)
      for (const ch of added) {
        onMobileKey?.(ch)
      }
    } else if (newValue.length < old.length) {
      // Backspace(s)
      const deletedCount = old.length - newValue.length
      for (let i = 0; i < deletedCount; i++) {
        onMobileKey?.('Backspace')
      }
    }

    lastValueRef.current = newValue

    // Keep input value short to prevent it growing unbounded.
    // We reset to a stable sentinel after every word (space) is processed.
    if (newValue.includes(' ')) {
      onMobileKey?.(' ')
      input.value = ''
      lastValueRef.current = ''
    }
  }, [onMobileKey])

  // Also handle keydown for physical keyboards (already handled by global listener,
  // but we still call preventDefault to avoid the input value growing visibly).
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    // Space and Enter on mobile: treat space as word-advance
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault()
    }
  }, [])

  if (words.length === 0) return null

  return (
    <div
      ref={wrapperRef}
      className={clsx(
        'relative font-mono select-none',
        FONT_SIZE_MAP[fontSize],
        LINE_HEIGHT,
        // Make the whole area tappable on mobile to focus the hidden input
        'cursor-text',
      )}
      style={{ color: 'var(--subtext)' }}
      onClick={focusInput}
      onTouchStart={focusInput}
    >
      {/*
        Hidden input — kept in the DOM always so iOS/Android can show the virtual
        keyboard.  It's visually invisible (opacity:0, size 1px) but positioned
        inside the typing area so the keyboard appears near the words on scroll.
        `inputMode="text"` keeps the full QWERTY keyboard open on mobile.
        `autocorrect="off"` / `autocapitalize="none"` prevent iOS from mangling input.
      */}
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
          fontSize: '16px', // prevent iOS zoom-in on focus
          zIndex: -1,
        }}
      />

      {/* Use currentLine as key so the word block animates when lines scroll */}
      <motion.div
        key={Math.max(0, currentLine - 1)}
        initial={lineChanged ? { opacity: 0.7, y: 4 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: 'easeOut' }}
        className="flex flex-wrap gap-x-[0.6em] gap-y-0 overflow-hidden"
        style={{ maxHeight: `calc(2.6em * ${VISIBLE_LINES})` }}
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
            />
          )
        })}
      </motion.div>

      {/* Idle hint */}
      {testState === 'idle' && words.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span
            className="font-mono text-sm"
            style={{ color: 'var(--subtext)', opacity: 0.4 }}
          >
            tap or start typing...
          </span>
        </div>
      )}
    </div>
  )
}

export default TypingArea
