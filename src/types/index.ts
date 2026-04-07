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
      bg: '#0b0f0e', surface: '#111815', border: '#1a2620',
      text: '#c8d4c0', subtext: '#4a5e50',
      primary: '#5a8f6a', secondary: '#8faa70', error: '#c05040',
    },
  },
  {
    name: 'sumi',
    label: 'Sumi',
    labelJp: '墨染',
    description: '水墨の黒 · Ink Wash Black',
    colors: {
      bg: '#080808', surface: '#111111', border: '#1e1e1e',
      text: '#c8c8c8', subtext: '#383838',
      primary: '#909090', secondary: '#606060', error: '#b04040',
    },
  },
  {
    name: 'ukiyo',
    label: 'Ukiyo',
    labelJp: '浮世',
    description: '浮世絵の青 · Ukiyo-e Blue',
    colors: {
      bg: '#070c14', surface: '#0c1420', border: '#131e30',
      text: '#b8c8d8', subtext: '#2e4058',
      primary: '#4a7898', secondary: '#6090b0', error: '#b04848',
    },
  },
  {
    name: 'shu',
    label: 'Shu',
    labelJp: '朱砂',
    description: '朱の赤 · Vermilion Red',
    colors: {
      bg: '#0d0806', surface: '#150e0a', border: '#261610',
      text: '#c8b8a8', subtext: '#4a3028',
      primary: '#b05040', secondary: '#c07050', error: '#d06040',
    },
  },
  {
    name: 'yuki',
    label: 'Yuki',
    labelJp: '雪月',
    description: '雪の白 · Snow White',
    colors: {
      bg: '#080c10', surface: '#0e1318', border: '#161e26',
      text: '#b8c8d0', subtext: '#2a3a44',
      primary: '#6090a8', secondary: '#7aa8c0', error: '#a84050',
    },
  },
]
