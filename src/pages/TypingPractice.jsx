import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Settings2 } from 'lucide-react'
import TypingBox from '../components/TypingBox'
import useStore from '../store/useStore'
import { getMotivationalMessage } from '../utils/helpers'

const DIFFICULTIES = ['easy', 'medium', 'hard']
const DURATIONS = [30, 60, 120]

export default function TypingPractice() {
  const settings = useStore(s => s.settings)
  const updateSettings = useStore(s => s.updateSettings)
  const getStreak = useStore(s => s.getStreak)

  const [showConfig, setShowConfig] = useState(false)
  const [sessionMsg, setSessionMsg] = useState(null)
  const [key, setKey] = useState(0)

  const streak = getStreak()

  const handleSessionComplete = (result) => {
    const msg = getMotivationalMessage(streak.current + 1)
    setSessionMsg({ ...result, streak: streak.current + 1, motivational: msg })
  }

  const handleNewSession = () => {
    setSessionMsg(null)
    setKey(k => k + 1)
  }

  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-ghost px-2.5 py-2">
            <ChevronLeft size={16} />
          </Link>
          <div>
            <h1 className="section-title text-2xl">Typing Practice</h1>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              {settings.duration}s · {settings.difficulty} difficulty
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowConfig(c => !c)}
          className="btn-ghost gap-2"
          style={{ color: showConfig ? 'var(--accent)' : undefined }}
        >
          <Settings2 size={15} />
          Configure
        </button>
      </div>

      {/* Config panel */}
      {showConfig && (
        <div className="card p-5 mb-6 animate-slide-up">
          <h3 className="section-title text-sm mb-4">Session Settings</h3>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <div className="stat-label mb-2">Duration</div>
              <div className="flex gap-2">
                {DURATIONS.map(d => (
                  <button
                    key={d}
                    onClick={() => updateSettings({ duration: d })}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: settings.duration === d ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: settings.duration === d ? 'white' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: settings.duration === d ? 'var(--accent)' : 'var(--border)',
                    }}
                  >{d}s</button>
                ))}
              </div>
            </div>
            <div>
              <div className="stat-label mb-2">Difficulty</div>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <button
                    key={d}
                    onClick={() => { updateSettings({ difficulty: d }); setKey(k => k + 1) }}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all"
                    style={{
                      background: settings.difficulty === d ? 'var(--accent)' : 'var(--bg-elevated)',
                      color: settings.difficulty === d ? 'white' : 'var(--text-secondary)',
                      border: '1px solid',
                      borderColor: settings.difficulty === d ? 'var(--accent)' : 'var(--border)',
                    }}
                  >{d}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Streak bar */}
      {streak.current > 0 && (
        <div className="flex items-center gap-2 mb-5 px-1">
          <div className="text-sm font-semibold" style={{ color: 'var(--accent-warm)' }}>
            🔥 {streak.current} day streak
          </div>
          <div className="flex-1 progress-bar">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min((streak.current / 30) * 100, 100)}%`,
                background: 'linear-gradient(90deg, var(--accent-warm), #f87171)',
              }}
            />
          </div>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {streak.longest}d best
          </div>
        </div>
      )}

      {/* Session complete message */}
      {sessionMsg && (
        <div
          className="card p-4 mb-6 flex items-center gap-4 animate-slide-up"
          style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.08), transparent)' }}
        >
          <div className="text-2xl">🎉</div>
          <div className="flex-1">
            <div className="font-semibold text-sm" style={{ color: 'var(--jade)' }}>
              {sessionMsg.motivational}
            </div>
            <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Last session: {sessionMsg.wpm} WPM · {sessionMsg.accuracy}% accuracy
            </div>
          </div>
          <button onClick={handleNewSession} className="btn-primary py-1.5 px-3 text-sm">
            New Session
          </button>
        </div>
      )}

      {/* Typing box */}
      <TypingBox
        key={key}
        onSessionComplete={handleSessionComplete}
      />

      {/* Tips */}
      <div className="mt-8 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)' }}>
        <div className="stat-label mb-2">Tips</div>
        <div className="grid grid-cols-2 gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
          <span>· Click or press any key to begin</span>
          <span>· Press <kbd className="px-1 py-0.5 rounded text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'JetBrains Mono' }}>Esc</kbd> to reset</span>
          <span>· Focus on accuracy first, speed comes naturally</span>
          <span>· Practice daily to maintain your streak</span>
        </div>
      </div>
    </div>
  )
}
