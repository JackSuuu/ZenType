import { create } from 'zustand'
import type { TestState, TestMode, WordData, CharStatus, WpmDataPoint, KeystrokeData, TestResult } from '../types'
import { getRandomWords, getRandomQuote } from '../data/wordlists'
import type { WordListKey } from '../data/wordlists'

interface TypingState {
  // Test config
  mode: TestMode
  timeLimit: number
  wordCount: number
  language: WordListKey

  // Test state
  testState: TestState
  words: WordData[]          // initial word list — set once, never mutated during typing
  currentWordIndex: number   // updated on space (for StatsPanel word counter)

  // Stats
  timeElapsed: number
  timeRemaining: number
  correctChars: number
  incorrectChars: number
  extraChars: number
  wpmHistory: WpmDataPoint[]
  keystrokes: KeystrokeData[]

  // Result
  lastResult: TestResult | null

  // Actions
  setMode: (mode: TestMode) => void
  setTimeLimit: (limit: number) => void
  setWordCount: (count: number) => void
  setLanguage: (lang: WordListKey) => void
  initTest: () => void
  /** Called by useTypingEngine on space — receives cumulative totals */
  recordWord: (totalCorrect: number, totalIncorrect: number, nextWordIndex: number) => void
  /** Called by useTypingEngine when last word finished in words/quote mode */
  finishTest: (correctChars: number, incorrectChars: number, extraChars: number, keystrokes: KeystrokeData[]) => void
  /** Start the test (first keypress) */
  startTest: () => void
  resetTest: () => void
  tick: () => void
}

function buildWords(mode: TestMode, wordCount: number, language: WordListKey): WordData[] {
  let wordStrings: string[] = []

  if (mode === 'quote') {
    const q = getRandomQuote()
    wordStrings = q.text.split(' ')
  } else if (mode === 'zen') {
    wordStrings = getRandomWords(language, 200)
  } else {
    const count = mode === 'time' ? 150 : wordCount
    wordStrings = getRandomWords(language, count)
  }

  return wordStrings.map((word) => ({
    original: word,
    chars: word.split('').map((ch) => ({ char: ch, status: 'pending' as CharStatus })),
    isCompleted: false,
    hasError: false,
  }))
}

function calcWpm(correctChars: number, seconds: number): number {
  if (seconds === 0) return 0
  return Math.round((correctChars / 5) / (seconds / 60))
}

function buildResult(state: TypingState, overrides?: Partial<TypingState>): TestResult {
  const s = { ...state, ...overrides }
  const { correctChars, incorrectChars, extraChars, timeElapsed, wpmHistory, keystrokes, mode, timeLimit, wordCount, language } = s
  const totalChars = correctChars + incorrectChars
  const wpm = calcWpm(correctChars, timeElapsed || 1)
  const rawWpm = calcWpm(totalChars, timeElapsed || 1)
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    timestamp: Date.now(),
    mode,
    timeLimit,
    wordCount,
    language,
    wpm,
    rawWpm,
    accuracy,
    correctChars,
    incorrectChars,
    extraChars,
    totalChars,
    duration: timeElapsed,
    wpmHistory,
    keystrokes,
    theme: 'matcha',
  }
}

export const useTypingStore = create<TypingState>()((set, get) => ({
  mode: 'time',
  timeLimit: 30,
  wordCount: 25,
  language: 'english',
  testState: 'idle',
  words: [],
  currentWordIndex: 0,
  timeElapsed: 0,
  timeRemaining: 30,
  correctChars: 0,
  incorrectChars: 0,
  extraChars: 0,
  wpmHistory: [],
  keystrokes: [],
  lastResult: null,

  setMode: (mode) => set({ mode }),
  setTimeLimit: (timeLimit) => set({ timeLimit, timeRemaining: timeLimit }),
  setWordCount: (wordCount) => set({ wordCount }),
  setLanguage: (language) => set({ language }),

  initTest: () => {
    const { mode, wordCount, language, timeLimit } = get()
    const words = buildWords(mode, wordCount, language)
    set({
      words,
      testState: 'idle',
      currentWordIndex: 0,
      timeElapsed: 0,
      timeRemaining: timeLimit,
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      wpmHistory: [],
      keystrokes: [],
      lastResult: null,
    })
  },

  startTest: () => set({ testState: 'running' }),

  recordWord: (totalCorrect, totalIncorrect, nextWordIndex) => {
    // Receives cumulative totals from useTypingEngine — just overwrite, no addition
    set({
      correctChars: totalCorrect,
      incorrectChars: totalIncorrect,
      currentWordIndex: nextWordIndex,
    })
  },

  finishTest: (correctChars, incorrectChars, extraChars, keystrokes) => {
    const state = get()
    const overrides = { correctChars, incorrectChars, extraChars, keystrokes }
    const result = buildResult({ ...state, ...overrides })
    set({ ...overrides, testState: 'finished', lastResult: result })
  },

  resetTest: () => {
    const { mode, wordCount, language, timeLimit } = get()
    const words = buildWords(mode, wordCount, language)
    set({
      words,
      testState: 'idle',
      currentWordIndex: 0,
      timeElapsed: 0,
      timeRemaining: timeLimit,
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      wpmHistory: [],
      keystrokes: [],
      lastResult: null,
    })
  },

  tick: () => {
    const state = get()
    if (state.testState !== 'running') return

    const newElapsed = state.timeElapsed + 1
    const newRemaining = Math.max(0, state.timeLimit - newElapsed)

    const currentWpm = calcWpm(state.correctChars, newElapsed)
    const rawWpm = calcWpm(state.correctChars + state.incorrectChars, newElapsed)
    const newHistory = [
      ...state.wpmHistory,
      { second: newElapsed, wpm: currentWpm, raw: rawWpm, errors: state.incorrectChars },
    ]

    // Time mode: auto-finish when timer hits 0
    if (state.mode === 'time' && newRemaining === 0) {
      const result = buildResult({ ...state, timeElapsed: newElapsed, wpmHistory: newHistory })
      set({
        timeElapsed: newElapsed,
        timeRemaining: 0,
        wpmHistory: newHistory,
        testState: 'finished',
        lastResult: result,
      })
      return
    }

    set({
      timeElapsed: newElapsed,
      timeRemaining: newRemaining,
      wpmHistory: newHistory,
    })
  },
}))
