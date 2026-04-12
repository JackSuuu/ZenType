import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
            onClick={onClose}
          />

          {/* Centering wrapper — not animated, so transform stays intact */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 4 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={clsx(
                'pointer-events-auto w-full',
                'zen-surface rounded-2xl shadow-zen-lg flex flex-col',
                size === 'sm' && 'max-w-sm',
                size === 'md' && 'max-w-lg',
                size === 'lg' && 'max-w-2xl',
              )}
              style={{ maxHeight: 'min(80vh, 640px)' }}
            >
              {/* Header */}
              {title && (
                <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
                  style={{ borderBottom: '1px solid var(--border)' }}
                >
                  <h2 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
                    {title}
                  </h2>
                  <button
                    onClick={onClose}
                    className="zen-btn-ghost w-8 h-8 flex items-center justify-center rounded-lg text-lg leading-none"
                    style={{ color: 'var(--subtext)' }}
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Body */}
              <div className="p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
