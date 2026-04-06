import { useEffect, useCallback, useRef, useState } from 'react'
import { useTypingStore } from '../stores/typingStore'
import { useSound } from './useSound'
import type { WordData, CharStatus, KeystrokeData } from '../types'

// Lightweight view slice that TypingArea reads
export interface TypingViewState {
  words: WordData[]
  currentWordIndex: number
  typedWord: string
}

export function useTypingEngine() {
  const store = useTypingStore()
  const { play } = useSound()

  // Local refs — source of truth for word/char state during a test
  const wordsRef = useRef<WordData[]>([])
  const typedWordRef = useRef('')
  const currentWordIndexRef = useRef(0)
  const correctCharsRef = useRef(0)
  const incorrectCharsRef = useRef(0)
  const extraCharsRef = useRef(0)
  const keystrokesRef = useRef<KeystrokeData[]>([])

  const [viewState, setViewState] = useState<TypingViewState>({
    words: [],
    currentWordIndex: 0,
    typedWord: '',
  })

  // Sync when store initialises / resets
  const storeWords = store.words
  const storeTestState = store.testState

  useEffect(() => {
    if (storeWords.length > 0 && storeTestState === 'idle') {
      wordsRef.current = storeWords.map(w => ({
        ...w,
        chars: w.original.split('').map(ch => ({ char: ch, status: 'pending' as CharStatus })),
        isCompleted: false,
        hasError: false,
      }))
      typedWordRef.current = ''
      currentWordIndexRef.current = 0
      correctCharsRef.current = 0
      incorrectCharsRef.current = 0
      extraCharsRef.current = 0
      keystrokesRef.current = []
      setViewState({
        words: wordsRef.current,
        currentWordIndex: 0,
        typedWord: '',
      })
    }
  }, [storeWords, storeTestState])

  const flushView = useCallback(() => {
    setViewState({
      words: wordsRef.current,
      currentWordIndex: currentWordIndexRef.current,
      typedWord: typedWordRef.current,
    })
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return
      if (e.key.length > 1 && e.key !== 'Backspace' && e.key !== ' ') return

      const testState = store.testState
      if (testState === 'finished') return

      e.preventDefault()

      // Start test on first keypress
      if (testState === 'idle') {
        store.startTest()
      }

      if (e.key === 'Backspace') {
        const typed = typedWordRef.current
        if (typed.length === 0) return

        const newTyped = typed.slice(0, -1)
        typedWordRef.current = newTyped

        const idx = currentWordIndexRef.current
        const word = wordsRef.current[idx]
        word.chars = word.original.split('').map((ch, i) => ({
          char: ch,
          status: i < newTyped.length
            ? (newTyped[i] === ch ? 'correct' : 'error')
            : 'pending' as CharStatus,
        }))
        word.hasError = word.chars.some(c => c.status === 'error')

        flushView()
        return
      }

      if (e.key === ' ') {
        const typed = typedWordRef.current
        if (typed.length === 0) return

        const idx = currentWordIndexRef.current
        const words = wordsRef.current
        const word = words[idx]
        const wordCorrect = typed === word.original

        play(wordCorrect ? 'space' : 'error')

        // Finalise word chars, count correct/incorrect for this word
        let wordCorrectChars = 0
        let wordIncorrectChars = 0
        word.chars = word.original.split('').map((ch, i) => {
          const status = i < typed.length
            ? (typed[i] === ch ? 'correct' as CharStatus : 'error' as CharStatus)
            : 'error' as CharStatus
          if (status === 'correct') wordCorrectChars++
          else wordIncorrectChars++
          return { char: ch, status, typedChar: typed[i] }
        })
        word.isCompleted = true
        word.hasError = !wordCorrect

        // Extra chars beyond word length
        const wordExtraChars = Math.max(0, typed.length - word.original.length)

        // Update local stat refs
        correctCharsRef.current += wordCorrectChars
        incorrectCharsRef.current += wordIncorrectChars
        extraCharsRef.current += wordExtraChars
        keystrokesRef.current.push({ key: ' ', correct: wordCorrect, timestamp: Date.now() })

        const nextIndex = idx + 1
        typedWordRef.current = ''
        currentWordIndexRef.current = nextIndex

        const isLastWord = nextIndex >= words.length
        const mode = store.mode

        // Finish test in words/quote mode when last word is done
        if ((mode === 'words' || mode === 'quote') && isLastWord) {
          store.finishTest(
            correctCharsRef.current,
            incorrectCharsRef.current,
            extraCharsRef.current,
            keystrokesRef.current,
          )
          flushView()
          return
        }

        // Sync cumulative stats to store on word boundary (for live WPM/acc display)
        store.recordWord(
          correctCharsRef.current,
          incorrectCharsRef.current,
          nextIndex,
        )
        flushView()
        return
      }

      // Regular character — only update local refs, NO store call
      const idx = currentWordIndexRef.current
      const words = wordsRef.current
      const word = words[idx]
      if (!word) return

      const typed = typedWordRef.current
      const newTyped = typed + e.key
      typedWordRef.current = newTyped

      const expectedChar = word.original[typed.length]
      const isCorrect = e.key === expectedChar

      play(isCorrect ? 'keypress' : 'error')

      // Update char statuses in-place
      word.chars = word.original.split('').map((ch, i) => ({
        char: ch,
        status: i < newTyped.length
          ? (newTyped[i] === ch ? 'correct' : 'error')
          : 'pending' as CharStatus,
        typedChar: newTyped[i],
      }))
      word.hasError = word.chars.some(c => c.status === 'error')

      // Track in local ref only — no store.set() per keystroke
      keystrokesRef.current.push({ key: e.key, correct: isCorrect, timestamp: Date.now() })

      flushView()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [store.testState, store.mode, play, flushView]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Play complete sound on finish
  useEffect(() => {
    if (storeTestState === 'finished') {
      play('complete')
    }
  }, [storeTestState, play])

  return { viewState, store }
}
