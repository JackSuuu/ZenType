import React, { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Header } from './components/Header/Header'
import { Modal } from './components/ui/Modal'
import { SettingsPanel } from './components/Settings/SettingsPanel'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { useTheme } from './hooks/useTheme'
import { BackgroundPattern } from './components/ui/BackgroundPattern'

const AppContent: React.FC = () => {
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  useTheme()

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      {/* Background decorative pattern */}
      <BackgroundPattern />

      {/* Header */}
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center">
        <span className="font-mono text-xs" style={{ color: 'var(--subtext)', opacity: 0.3 }}>
          zentype · 禅타이핑 · made with
          <span className="mx-1" style={{ color: 'var(--primary)' }}>茶</span>
          and code
        </span>
      </footer>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        title="settings · 設定"
        size="md"
      >
        <SettingsPanel />
      </Modal>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
