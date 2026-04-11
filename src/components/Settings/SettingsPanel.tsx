import React from 'react'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { THEMES } from '../../types'
import type { ThemeName } from '../../types'

const SOUND_PROFILES = [
  { id: 'none', label: 'silent', desc: '無音' },
  { id: 'wood', label: 'wood', desc: '木質' },
  { id: 'mechanical', label: 'mechanical', desc: '機械' },
  { id: 'soft', label: 'soft', desc: '柔和' },
  { id: 'typewriter', label: 'typewriter', desc: '打字機' },
] as const

const FONT_SIZES: { id: 'sm' | 'md' | 'lg' | 'xl'; label: string; desc: string; cls?: string }[] = [
  { id: 'sm', label: 'Aa', desc: 'small' },
  { id: 'md', label: 'Aa', desc: 'medium', cls: 'text-base' },
  { id: 'lg', label: 'Aa', desc: 'large', cls: 'text-lg' },
  { id: 'xl', label: 'Aa', desc: 'x-large', cls: 'text-xl' },
]

export const SettingsPanel: React.FC = () => {
  const settings = useSettingsStore()

  const Section: React.FC<{ title: string; titleJp: string; children: React.ReactNode }> = ({
    title, titleJp, children
  }) => (
    <div className="mb-8">
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="font-mono text-sm font-bold" style={{ color: 'var(--text)' }}>
          {title}
        </h3>
        <span className="font-serif text-xs" style={{ color: 'var(--secondary)', opacity: 0.7 }}>
          {titleJp}
        </span>
      </div>
      {children}
    </div>
  )

  return (
    <div>
      {/* Theme */}
      <Section title="theme" titleJp="テーマ">
        <div className="grid grid-cols-1 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => settings.setTheme(theme.name as ThemeName)}
              className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 cursor-pointer text-left w-full"
                style={{
                  background: settings.theme === theme.name
                    ? 'var(--overlay-md)'
                    : 'transparent',
                  border: `1px solid ${settings.theme === theme.name ? 'var(--primary)' : 'var(--border)'}`,
                }}
            >
              {/* Color preview dots */}
              <div className="flex gap-1 flex-shrink-0">
                {['bg', 'primary', 'secondary', 'error'].map((colorKey) => (
                  <div
                    key={colorKey}
                    className="w-3 h-3 rounded-full"
                    style={{ background: theme.colors[colorKey as keyof typeof theme.colors] }}
                  />
                ))}
              </div>
              <div className="flex-1">
                <div className="font-mono text-sm flex items-center gap-2"
                  style={{ color: 'var(--text)' }}
                >
                  {theme.labelJp}
                  <span style={{ color: 'var(--subtext)' }}>·</span>
                  {theme.label}
                </div>
                <div className="font-sans text-xs mt-0.5" style={{ color: 'var(--subtext)' }}>
                  {theme.description}
                </div>
              </div>
              {settings.theme === theme.name && (
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: 'var(--primary)' }}
                />
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* Sound */}
      <Section title="sound" titleJp="音響">
        <div className="flex flex-wrap gap-2 mb-4">
          {SOUND_PROFILES.map((p) => (
            <button
              key={p.id}
              onClick={() => settings.setSoundProfile(p.id)}
              className={`zen-btn text-xs px-3 py-1.5 ${settings.soundProfile === p.id ? 'active' : ''}`}
            >
              {p.label}
              <span className="ml-1 text-xs opacity-50 font-serif">{p.desc}</span>
            </button>
          ))}
        </div>

        {settings.soundProfile !== 'none' && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="font-mono text-xs w-20" style={{ color: 'var(--subtext)' }}>
                keypress
              </label>
              <input
                type="range"
                min={0} max={1} step={0.05}
                value={settings.soundVolume}
                onChange={(e) => settings.setSoundVolume(Number(e.target.value))}
                className="flex-1 accent-[var(--primary)]"
              />
              <span className="font-mono text-xs w-8 text-right" style={{ color: 'var(--subtext)' }}>
                {Math.round(settings.soundVolume * 100)}
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* Display */}
      <Section title="display" titleJp="表示">
        {/* Font Size */}
        <div className="mb-4">
          <div className="font-mono text-xs mb-2" style={{ color: 'var(--subtext)' }}>font size</div>
          <div className="flex gap-2">
            {FONT_SIZES.map((fs) => (
              <button
                key={fs.id}
                onClick={() => settings.setFontSize(fs.id)}
                className={`zen-btn px-3 py-2 ${settings.fontSize === fs.id ? 'active' : ''} ${fs.cls || ''}`}
              >
                {fs.label}
              </button>
            ))}
          </div>
        </div>

        {/* Toggles */}
        <div className="space-y-3">
          {[
            { label: 'live wpm', labelJp: 'ライブWPM', value: settings.showLiveWpm, toggle: settings.toggleLiveWpm },
            { label: 'live accuracy', labelJp: '正確率', value: settings.showLiveAcc, toggle: settings.toggleLiveAcc },
            { label: 'blind mode', labelJp: '盲打モード', value: settings.blindMode, toggle: settings.toggleBlindMode },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <span className="font-mono text-sm" style={{ color: 'var(--text)' }}>{item.label}</span>
                <span className="font-serif text-xs ml-2" style={{ color: 'var(--subtext)' }}>{item.labelJp}</span>
              </div>
              <button
                onClick={item.toggle}
                className="relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none"
                style={{
                  background: item.value ? 'var(--primary)' : 'var(--border)',
                }}
              >
                <motion.div
                  className="absolute top-0.5 w-5 h-5 rounded-full"
                  style={{ background: item.value ? 'var(--bg)' : 'var(--subtext)' }}
                  animate={{ left: item.value ? '1.375rem' : '0.125rem' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

export default SettingsPanel
