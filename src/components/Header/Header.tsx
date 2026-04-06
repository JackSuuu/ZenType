import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { useHistoryStore } from '../../stores/historyStore'
import { THEMES } from '../../types'
import clsx from 'clsx'

interface HeaderProps {
  onOpenSettings: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const location = useLocation()
  const { theme, setTheme } = useSettingsStore()
  const { getBestWpm } = useHistoryStore()
  const bestWpm = getBestWpm()

  const navLinks = [
    { path: '/', label: 'type' },
    { path: '/history', label: 'history' },
  ]

  return (
    <header className="sticky top-0 z-30 px-6 py-4"
      style={{
        background: 'linear-gradient(to bottom, var(--bg), transparent)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-7 h-7">
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <circle cx="14" cy="14" r="13" stroke="var(--primary)" strokeWidth="1.5" />
              <circle cx="14" cy="14" r="6" fill="var(--primary)" opacity="0.2" />
              <circle cx="14" cy="14" r="2.5" fill="var(--primary)" />
              <path d="M14 4 C8 4, 4 8, 4 14" stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 3" />
              <path d="M14 4 C20 4, 24 8, 24 14" stroke="var(--secondary)" strokeWidth="1" strokeDasharray="2 3" />
            </svg>
          </div>
          <span className="font-serif text-xl tracking-wide font-medium"
            style={{ color: 'var(--text)' }}
          >
            ZenType
          </span>
          <span className="font-serif text-xs opacity-40 hidden sm:block"
            style={{ color: 'var(--secondary)' }}
          >
            禅
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={clsx(
                'relative px-3 py-1.5 rounded-md font-mono text-xs transition-colors duration-200',
                location.pathname === link.path
                  ? ''
                  : 'hover:text-opacity-100'
              )}
              style={{
                color: location.pathname === link.path ? 'var(--primary)' : 'var(--subtext)',
              }}
            >
              {location.pathname === link.path && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-md"
                  style={{ background: 'rgba(255,255,255,0.05)' }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-3">
          {/* Best WPM badge */}
          {bestWpm > 0 && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
            >
              <span className="font-mono text-xs font-bold" style={{ color: 'var(--secondary)' }}>
                {bestWpm}
              </span>
              <span className="font-mono text-xs" style={{ color: 'var(--subtext)' }}>
                pb
              </span>
            </div>
          )}

          {/* Theme dots */}
          <div className="hidden sm:flex items-center gap-1.5">
            {THEMES.map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                title={`${t.labelJp} - ${t.label}`}
                className={clsx(
                  'w-3 h-3 rounded-full transition-all duration-200 cursor-pointer',
                  theme === t.name ? 'scale-125 ring-1 ring-offset-1' : 'opacity-60 hover:opacity-100'
                )}
                style={{
                  background: t.colors.primary,
                }}
              />
            ))}
          </div>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="zen-btn-ghost w-8 h-8 flex items-center justify-center rounded-lg"
            title="Settings"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <line x1="2" y1="4" x2="14" y2="4" />
              <circle cx="10" cy="4" r="1.5" fill="currentColor" stroke="none" />
              <line x1="2" y1="8" x2="14" y2="8" />
              <circle cx="5" cy="8" r="1.5" fill="currentColor" stroke="none" />
              <line x1="2" y1="12" x2="14" y2="12" />
              <circle cx="11" cy="12" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
