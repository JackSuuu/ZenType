import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TestResult } from '../types'

interface HistoryState {
  results: TestResult[]
  addResult: (result: TestResult) => void
  clearHistory: () => void
  getBestWpm: () => number
  getAverageWpm: (last?: number) => number
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set, get) => ({
      results: [],
      addResult: (result) =>
        set((s) => ({
          results: [result, ...s.results].slice(0, 100), // keep last 100
        })),
      clearHistory: () => set({ results: [] }),
      getBestWpm: () => {
        const { results } = get()
        if (results.length === 0) return 0
        return Math.max(...results.map((r) => r.wpm))
      },
      getAverageWpm: (last = 10) => {
        const { results } = get()
        const slice = results.slice(0, last)
        if (slice.length === 0) return 0
        return Math.round(slice.reduce((sum, r) => sum + r.wpm, 0) / slice.length)
      },
    }),
    { name: 'muontype-history' }
  )
)
