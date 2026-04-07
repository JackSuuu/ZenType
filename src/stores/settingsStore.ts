import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ThemeName, Language, SoundProfile } from '../types'

interface SettingsState {
  theme: ThemeName
  language: Language
  soundProfile: SoundProfile
  soundVolume: number
  ambientVolume: number
  showLiveWpm: boolean
  showLiveAcc: boolean
  blindMode: boolean
  fontSize: 'sm' | 'md' | 'lg' | 'xl'
  caretStyle: 'line' | 'block' | 'underline'
  smoothCaret: boolean
  setTheme: (theme: ThemeName) => void
  setLanguage: (lang: Language) => void
  setSoundProfile: (profile: SoundProfile) => void
  setSoundVolume: (vol: number) => void
  setAmbientVolume: (vol: number) => void
  toggleLiveWpm: () => void
  toggleLiveAcc: () => void
  toggleBlindMode: () => void
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void
  setCaretStyle: (style: 'line' | 'block' | 'underline') => void
  toggleSmoothCaret: () => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'matcha',
      language: 'english',
      soundProfile: 'wood',
      soundVolume: 0.5,
      ambientVolume: 0,
      showLiveWpm: true,
      showLiveAcc: true,
      blindMode: false,
      fontSize: 'md',
      caretStyle: 'line',
      smoothCaret: true,
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setSoundProfile: (soundProfile) => set({ soundProfile }),
      setSoundVolume: (soundVolume) => set({ soundVolume }),
      setAmbientVolume: (ambientVolume) => set({ ambientVolume }),
      toggleLiveWpm: () => set((s) => ({ showLiveWpm: !s.showLiveWpm })),
      toggleLiveAcc: () => set((s) => ({ showLiveAcc: !s.showLiveAcc })),
      toggleBlindMode: () => set((s) => ({ blindMode: !s.blindMode })),
      setFontSize: (fontSize) => set({ fontSize }),
      setCaretStyle: (caretStyle) => set({ caretStyle }),
      toggleSmoothCaret: () => set((s) => ({ smoothCaret: !s.smoothCaret })),
    }),
    { name: 'muontype-settings' }
  )
)
