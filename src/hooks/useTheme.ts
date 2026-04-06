import { useEffect } from 'react'
import { useSettingsStore } from '../stores/settingsStore'
import { THEMES } from '../types'

export function useTheme() {
  const { theme } = useSettingsStore()

  useEffect(() => {
    const themeConfig = THEMES.find((t) => t.name === theme)
    if (!themeConfig) return

    document.documentElement.setAttribute('data-theme', theme)

    // Apply CSS variables directly for smooth transitions
    const root = document.documentElement
    const colors = themeConfig.colors
    root.style.setProperty('--bg', colors.bg)
    root.style.setProperty('--surface', colors.surface)
    root.style.setProperty('--border', colors.border)
    root.style.setProperty('--text', colors.text)
    root.style.setProperty('--subtext', colors.subtext)
    root.style.setProperty('--primary', colors.primary)
    root.style.setProperty('--secondary', colors.secondary)
    root.style.setProperty('--error', colors.error)
    root.style.setProperty('--correct', colors.primary)
  }, [theme])

  return { theme }
}
