// ===== Core Types =====

export type ThemeName = 'matcha' | 'sumi' | 'ukiyo' | 'shu' | 'yuki'

export type TestMode = 'time' | 'words' | 'quote' | 'zen'

export type Language = 'english' | 'english_1k' | 'english_5k' | 'code' | 'japanese' | 'chinese'

export type SoundProfile = 'none' | 'wood' | 'mechanical' | 'soft' | 'typewriter'

export interface TestConfig {
  mode: TestMode
  timeLimit: number       // seconds, for time mode
  wordCount: number       // for words mode
  language: Language
  punctuation: boolean
  numbers: boolean
}

export type CharStatus = 'pending' | 'correct' | 'error' | 'extra'

export interface CharData {
  char: string
  status: CharStatus
  typedChar?: string
}

export interface WordData {
  original: string
  chars: CharData[]
  isCompleted: boolean
  hasError: boolean
}

export interface WpmDataPoint {
  second: number
  wpm: number
  raw: number
  errors: number
}

export interface TestResult {
  id: string
  timestamp: number
  mode: TestMode
  timeLimit?: number
  wordCount?: number
  language: Language
  wpm: number
  rawWpm: number
  accuracy: number
  correctChars: number
  incorrectChars: number
  extraChars: number
  totalChars: number
  duration: number          // actual seconds elapsed
  wpmHistory: WpmDataPoint[]
  keystrokes: KeystrokeData[]
  theme: ThemeName
}

export interface KeystrokeData {
  key: string
  correct: boolean
  timestamp: number
}

export type TestState = 'idle' | 'running' | 'paused' | 'finished'

export interface ThemeConfig {
  name: ThemeName
  label: string
  labelJp: string
  description: string
  colors: {
    bg: string
    surface: string
    border: string
    text: string
    subtext: string
    primary: string
    secondary: string
    error: string
  }
}

export const THEMES: ThemeConfig[] = [
  {
    name: 'matcha',
    label: 'Matcha',
    labelJp: '抹茶',
    description: '茶室の緑 · Tea Room Green',
    colors: {
      bg: '#0f1923', surface: '#162030', border: '#1e3040',
      text: '#e8dcc8', subtext: '#8a9bb0',
      primary: '#4a7c59', secondary: '#d4a853', error: '#c84b31',
    },
  },
  {
    name: 'sumi',
    label: 'Sumi',
    labelJp: '墨染',
    description: '水墨の黒 · Ink Wash Black',
    colors: {
      bg: '#0d0d0d', surface: '#1a1a1a', border: '#2a2a2a',
      text: '#e0e0e0', subtext: '#666666',
      primary: '#d0d0d0', secondary: '#888888', error: '#cc4444',
    },
  },
  {
    name: 'ukiyo',
    label: 'Ukiyo',
    labelJp: '浮世',
    description: '浮世絵の青 · Ukiyo-e Blue',
    colors: {
      bg: '#0a1628', surface: '#0f2040', border: '#1a3060',
      text: '#f0e6c0', subtext: '#8090b0',
      primary: '#4080c0', secondary: '#d4a853', error: '#c84b31',
    },
  },
  {
    name: 'shu',
    label: 'Shu',
    labelJp: '朱砂',
    description: '朱の赤 · Vermilion Red',
    colors: {
      bg: '#1a0a05', surface: '#2a1208', border: '#3d1e10',
      text: '#f5e6d0', subtext: '#9a7060',
      primary: '#c84b31', secondary: '#d4a853', error: '#ff6b35',
    },
  },
  {
    name: 'yuki',
    label: 'Yuki',
    labelJp: '雪月',
    description: '雪の白 · Snow White',
    colors: {
      bg: '#0e1520', surface: '#161f2e', border: '#202c3e',
      text: '#d8e8f0', subtext: '#607080',
      primary: '#80b0d0', secondary: '#a0c0d0', error: '#d04050',
    },
  },
]
