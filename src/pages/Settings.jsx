import React, { useState } from 'react'
import { Sun, Moon, Trash2, Download, Volume2, VolumeX, Eye, EyeOff, Shield } from 'lucide-react'
import useStore from '../store/useStore'

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4"
      style={{ borderBottom: '1px solid var(--border-light)' }}>
      <div>
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{label}</div>
        {description && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{description}</div>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all duration-300 flex items-center"
      style={{ background: value ? 'var(--accent)' : 'var(--bg-elevated)', border: '1px solid var(--border)' }}
    >
      <span
        className="absolute w-4 h-4 rounded-full bg-white transition-all duration-300 shadow"
        style={{ left: value ? '26px' : '4px' }}
      />
    </button>
  )
}

function SegmentedControl({ options, value, onChange }) {
  return (
    <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className="px-3 py-1.5 text-xs font-medium transition-colors"
          style={{
            background: value === o.value ? 'var(--accent)' : 'var(--bg-elevated)',
            color: value === o.value ? 'white' : 'var(--text-secondary)',
          }}
        >{o.label}</button>
      ))}
    </div>
  )
}

export default function Settings() {
  const settings = useStore(s => s.settings)
  const updateSettings = useStore(s => s.updateSettings)
  const theme = useStore(s => s.theme)
  const toggleTheme = useStore(s => s.toggleTheme)
  const clearData = useStore(s => s.clearData)
  const sessions = useStore(s => s.sessions)

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [cleared, setCleared] = useState(false)

  const handleClear = () => {
    if (showClearConfirm) {
      clearData()
      setCleared(true)
      setShowClearConfirm(false)
    } else {
      setShowClearConfirm(true)
    }
  }

  const handleExport = () => {
    const data = { sessions, exportedAt: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'keyflow-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="section-title text-3xl mb-2">Settings</h1>
      <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
        Customize your KeyFlow experience
      </p>

      {/* Appearance */}
      <section className="card p-5 mb-5">
        <h2 className="section-title text-base mb-1">Appearance</h2>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Visual preferences</p>

        <SettingRow label="Theme" description="Switch between dark and light mode">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
          >
            {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
            {theme === 'dark' ? 'Dark' : 'Light'}
          </button>
        </SettingRow>
      </section>

      {/* Practice */}
      <section className="card p-5 mb-5">
        <h2 className="section-title text-base mb-1">Practice</h2>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Typing session defaults</p>

        <SettingRow label="Default Duration" description="How long each session lasts">
          <SegmentedControl
            options={[{ value: 30, label: '30s' }, { value: 60, label: '60s' }, { value: 120, label: '2m' }]}
            value={settings.duration}
            onChange={v => updateSettings({ duration: v })}
          />
        </SettingRow>

        <SettingRow label="Default Difficulty" description="Complexity of texts to practice">
          <SegmentedControl
            options={[
              { value: 'easy', label: 'Easy' },
              { value: 'medium', label: 'Med' },
              { value: 'hard', label: 'Hard' },
            ]}
            value={settings.difficulty}
            onChange={v => updateSettings({ difficulty: v })}
          />
        </SettingRow>

        <SettingRow
          label="Show Live WPM"
          description="Display real-time words per minute during typing"
        >
          <Toggle
            value={settings.showLiveWPM !== false}
            onChange={v => updateSettings({ showLiveWPM: v })}
          />
        </SettingRow>

        <SettingRow
          label="Sound Effects"
          description="Play subtle sounds during typing practice"
        >
          <Toggle
            value={settings.soundEnabled !== false}
            onChange={v => updateSettings({ soundEnabled: v })}
          />
        </SettingRow>
      </section>

      {/* Data */}
      <section className="card p-5 mb-5">
        <h2 className="section-title text-base mb-1">Data</h2>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Manage your typing data</p>

        <SettingRow
          label="Export Data"
          description={`Export all ${sessions.length} sessions as JSON`}
        >
          <button
            onClick={handleExport}
            disabled={sessions.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{
              background: 'var(--bg-elevated)',
              color: sessions.length === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
              cursor: sessions.length === 0 ? 'not-allowed' : 'pointer',
            }}
          >
            <Download size={14} />
            Export
          </button>
        </SettingRow>

        <SettingRow
          label="Clear All Data"
          description="Permanently delete all sessions and streak history"
        >
          {cleared ? (
            <span className="text-sm" style={{ color: 'var(--jade)' }}>✓ Cleared</span>
          ) : (
            <button
              onClick={handleClear}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: showClearConfirm ? 'rgba(248,113,113,0.15)' : 'var(--bg-elevated)',
                color: showClearConfirm ? 'var(--rose)' : 'var(--text-secondary)',
                border: `1px solid ${showClearConfirm ? 'rgba(248,113,113,0.3)' : 'var(--border)'}`,
              }}
            >
              <Trash2 size={14} />
              {showClearConfirm ? 'Confirm?' : 'Clear Data'}
            </button>
          )}
        </SettingRow>
      </section>

      {/* About */}
      <section className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <Shield size={16} style={{ color: 'var(--accent)' }} />
          <h2 className="section-title text-base">About KeyFlow</h2>
        </div>
        <div className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
          <p>KeyFlow is a typing practice platform designed to help you improve your typing speed and accuracy through daily practice.</p>
          <p className="text-xs pt-2" style={{ color: 'var(--text-muted)' }}>
            All data is stored locally in your browser. No accounts, no tracking.
          </p>
        </div>
        <div className="mt-4 pt-4 flex items-center justify-between"
          style={{ borderTop: '1px solid var(--border-light)' }}>
          <span className="stat-label">Version</span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>v1.0.0</span>
        </div>
      </section>
    </div>
  )
}
