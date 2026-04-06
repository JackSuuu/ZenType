import React from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

interface Tab {
  id: string
  label: string
  labelSub?: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (id: string) => void
  size?: 'sm' | 'md'
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  size = 'md',
}) => {
  return (
    <div className="flex items-center gap-1 rounded-lg p-1"
      style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'relative rounded-md font-mono transition-colors duration-150 cursor-pointer focus:outline-none',
            size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-1.5 text-sm',
          )}
          style={{
            color: activeTab === tab.id ? 'var(--bg)' : 'var(--subtext)',
            fontWeight: activeTab === tab.id ? 700 : 400,
          }}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="tab-indicator"
              className="absolute inset-0 rounded-md"
              style={{ background: 'var(--primary)' }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">
            {tab.label}
            {tab.labelSub && (
              <span className="ml-1 text-xs opacity-60">{tab.labelSub}</span>
            )}
          </span>
        </button>
      ))}
    </div>
  )
}

export default Tabs
