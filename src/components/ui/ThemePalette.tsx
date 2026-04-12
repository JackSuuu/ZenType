import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useSettingsStore } from '../../stores/settingsStore'
import { THEMES } from '../../types'
import type { ThemeName } from '../../types'

export const ThemePalette: React.FC = () => {
  const { theme, setTheme } = useSettingsStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [highlighted, setHighlighted] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = THEMES.filter(
    (t) =>
      t.label.toLowerCase().includes(query.toLowerCase()) ||
      t.labelJp.includes(query) ||
      t.description.toLowerCase().includes(query.toLowerCase()),
  )

  // Reset highlight when filter changes
  useEffect(() => {
    setHighlighted(0)
  }, [query])

  // Open on Ctrl+P / Cmd+P
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setHighlighted(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const close = useCallback(() => setOpen(false), [])

  const select = useCallback(
    (name: ThemeName) => {
      setTheme(name)
      close()
    },
    [setTheme, close],
  )

  // Keyboard navigation inside the palette
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        close()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setHighlighted((i) => (i + 1) % filtered.length)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setHighlighted((i) => (i - 1 + filtered.length) % filtered.length)
      } else if (e.key === 'Enter' && filtered[highlighted]) {
        select(filtered[highlighted].name)
      }
    },
    [close, filtered, highlighted, select],
  )

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return
    const item = listRef.current.children[highlighted] as HTMLElement | undefined
    item?.scrollIntoView({ block: 'nearest' })
  }, [highlighted])

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="palette-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            onClick={close}
          />

          {/* Palette panel */}
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] pointer-events-none px-4">
            <motion.div
              key="palette-panel"
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto w-full max-w-sm"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '0.875rem',
                boxShadow: '0 24px 64px rgba(0,0,0,0.35)',
                overflow: 'hidden',
              }}
              onKeyDown={handleKeyDown}
            >
              {/* Search input */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                {/* magnifier icon */}
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  style={{ color: 'var(--subtext)' }}
                >
                  <circle cx="6.5" cy="6.5" r="4" />
                  <line x1="10" y1="10" x2="14" y2="14" />
                </svg>
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="switch theme…"
                  className="flex-1 bg-transparent font-mono text-sm outline-none"
                  style={{
                    color: 'var(--text)',
                    caretColor: 'var(--primary)',
                  }}
                  // Prevent global keydown handler from intercepting typing
                  onKeyDown={(e) => {
                    e.stopPropagation()
                    handleKeyDown(e)
                  }}
                />
                <kbd
                  className="font-mono text-xs px-1.5 py-0.5 rounded"
                  style={{
                    color: 'var(--subtext)',
                    background: 'var(--overlay-sm)',
                    border: '1px solid var(--border)',
                  }}
                >
                  esc
                </kbd>
              </div>

              {/* Theme list */}
              <div
                ref={listRef}
                className="py-1.5"
                style={{ maxHeight: '320px', overflowY: 'auto' }}
              >
                {filtered.length === 0 ? (
                  <p
                    className="px-4 py-3 font-mono text-xs text-center"
                    style={{ color: 'var(--subtext)' }}
                  >
                    no themes match
                  </p>
                ) : (
                  filtered.map((t, i) => {
                    const isActive = t.name === theme
                    const isHighlighted = i === highlighted
                    return (
                      <button
                        key={t.name}
                        onClick={() => select(t.name)}
                        onMouseEnter={() => setHighlighted(i)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-none"
                        style={{
                          background: isHighlighted ? 'var(--overlay-md)' : 'transparent',
                          borderLeft: isActive
                            ? `2px solid ${t.colors.primary}`
                            : '2px solid transparent',
                        }}
                      >
                        {/* Color swatches */}
                        <div className="flex gap-1 flex-shrink-0">
                          {(['bg', 'primary', 'secondary', 'error'] as const).map((k) => (
                            <span
                              key={k}
                              className="w-3 h-3 rounded-full"
                              style={{
                                background: t.colors[k],
                                border: '1px solid rgba(128,128,128,0.2)',
                              }}
                            />
                          ))}
                        </div>

                        {/* Label */}
                        <div className="flex-1 min-w-0">
                          <span
                            className="font-mono text-sm"
                            style={{ color: isActive ? t.colors.primary : 'var(--text)' }}
                          >
                            {t.label}
                          </span>
                          <span
                            className="ml-2 font-serif text-xs"
                            style={{ color: 'var(--subtext)', opacity: 0.7 }}
                          >
                            {t.labelJp}
                          </span>
                        </div>

                        {/* Active checkmark */}
                        {isActive && (
                          <svg
                            className="w-3.5 h-3.5 flex-shrink-0"
                            viewBox="0 0 14 14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ color: t.colors.primary }}
                          >
                            <polyline points="2,7 5.5,10.5 12,3" />
                          </svg>
                        )}
                      </button>
                    )
                  })
                )}
              </div>

              {/* Footer hint */}
              <div
                className="px-4 py-2 flex items-center gap-3"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {[
                  { keys: ['↑', '↓'], label: 'navigate' },
                  { keys: ['↵'], label: 'select' },
                  { keys: ['ctrl', 'p'], label: 'toggle' },
                ].map(({ keys, label }) => (
                  <div key={label} className="flex items-center gap-1">
                    {keys.map((k) => (
                      <kbd
                        key={k}
                        className="font-mono text-xs px-1.5 py-0.5 rounded"
                        style={{
                          color: 'var(--subtext)',
                          background: 'var(--overlay-sm)',
                          border: '1px solid var(--border)',
                        }}
                      >
                        {k}
                      </kbd>
                    ))}
                    <span
                      className="font-mono text-xs"
                      style={{ color: 'var(--subtext)', opacity: 0.5 }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default ThemePalette
