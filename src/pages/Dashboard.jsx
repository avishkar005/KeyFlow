import React from 'react'
import { Link } from 'react-router-dom'
import { Keyboard, Flame, Target, TrendingUp, Zap, ChevronRight, Trophy, Clock } from 'lucide-react'
import useStore from '../store/useStore'
import WPMChart from '../components/WPMChart'
import { getWPMLabel, formatTime } from '../utils/helpers'

function StatCard({ icon: Icon, label, value, suffix = '', accent, subtext }) {
  return (
    <div className="card p-5 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="stat-label">{label}</div>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${accent}18` }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
      </div>
      <div>
        <div className="font-display font-black text-3xl leading-none" style={{ color: 'var(--text-primary)' }}>
          {value}
          {suffix && <span className="text-base font-medium ml-1" style={{ color: 'var(--text-muted)' }}>{suffix}</span>}
        </div>
        {subtext && <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{subtext}</div>}
      </div>
    </div>
  )
}

export default function Dashboard() {
  const sessions = useStore(s => s.sessions)
  const getStreak = useStore(s => s.getStreak)
  const getAverageWPM = useStore(s => s.getAverageWPM)

  const streak = getStreak()
  const avgWPM = getAverageWPM()
  const recentSessions = sessions.slice(-5).reverse()
  const totalSessions = sessions.length
  const totalTime = sessions.reduce((a, b) => a + (b.duration || 0), 0)
  const wpmLabel = getWPMLabel(avgWPM)

  const today = new Date().toISOString().slice(0, 10)
  const todaySessions = sessions.filter(s => s.date === today)
  const todayWPM = todaySessions.length
    ? Math.round(todaySessions.reduce((a, b) => a + b.wpm, 0) / todaySessions.length)
    : 0

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title text-3xl">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <Link to="/practice" className="btn-primary">
          <Keyboard size={15} /> Start Practice <ChevronRight size={14} />
        </Link>
      </div>

      {/* Welcome / First time */}
      {totalSessions === 0 && (
        <div className="card p-6 flex items-center gap-5"
          style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.08), rgba(52,211,153,0.04))' }}>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent)', boxShadow: '0 8px 24px rgba(129,140,248,0.3)' }}>
            <Zap size={22} color="white" fill="white" />
          </div>
          <div>
            <div className="section-title text-lg">Welcome to KeyFlow!</div>
            <div className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Start your first typing session to track your progress and build your streak.
            </div>
          </div>
          <Link to="/practice" className="btn-primary ml-auto shrink-0">
            Let's go <ChevronRight size={14} />
          </Link>
        </div>
      )}

      {/* Streak highlight */}
      {streak.current > 0 && (
        <div className="card p-5 flex items-center gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), transparent)' }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'rgba(245,158,11,0.15)' }}>
            <Flame size={22} style={{ color: 'var(--accent-warm)' }} />
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-xl" style={{ color: 'var(--accent-warm)' }}>
              {streak.current} Day Streak 🔥
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Keep it up! Your best streak is {streak.longest} days.
              {streak.current === streak.longest && streak.current > 1 && ' — New record!'}
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="stat-label">Best</div>
            <div className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              {streak.longest}d
            </div>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={TrendingUp}
          label="Avg Speed"
          value={avgWPM}
          suffix="wpm"
          accent="var(--accent)"
          subtext={avgWPM > 0 ? wpmLabel.label : 'No data yet'}
        />
        <StatCard
          icon={Flame}
          label="Current Streak"
          value={streak.current}
          suffix="days"
          accent="var(--accent-warm)"
          subtext={streak.current > 0 ? 'Keep going!' : 'Start today!'}
        />
        <StatCard
          icon={Target}
          label="Total Sessions"
          value={totalSessions}
          accent="var(--jade)"
          subtext={totalSessions > 0 ? `${todaySessions.length} today` : 'No sessions yet'}
        />
        <StatCard
          icon={Clock}
          label="Time Practiced"
          value={formatTime(totalTime)}
          accent="#f0abfc"
          subtext="Total practice time"
        />
      </div>

      {/* Chart + Recent sessions */}
      <div className="grid lg:grid-cols-5 gap-4">
        {/* Chart */}
        <div className="card p-5 lg:col-span-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="section-title text-base">Progress</h3>
            <Link to="/progress" className="text-xs btn-ghost py-1 px-2">View all →</Link>
          </div>
          <WPMChart />
        </div>

        {/* Recent sessions */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title text-base">Recent Sessions</h3>
            <Trophy size={15} style={{ color: 'var(--text-muted)' }} />
          </div>
          {recentSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-2"
              style={{ color: 'var(--text-muted)' }}>
              <Keyboard size={28} strokeWidth={1.5} />
              <p className="text-sm text-center">No sessions yet.<br/>Start practicing!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((s, i) => (
                <div key={s.id || i}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                  style={{ background: 'var(--bg-elevated)' }}>
                  <div>
                    <div className="font-display font-bold text-base" style={{ color: 'var(--accent)' }}>
                      {s.wpm} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>wpm</span>
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium" style={{ color: s.accuracy >= 95 ? 'var(--jade)' : 'var(--accent-warm)' }}>
                      {s.accuracy}%
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's summary */}
      {todaySessions.length > 0 && (
        <div className="card p-5">
          <h3 className="section-title text-base mb-4">Today's Summary</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Sessions', value: todaySessions.length },
              { label: 'Best WPM', value: Math.max(...todaySessions.map(s => s.wpm)) },
              { label: 'Avg WPM', value: todayWPM },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="stat-label">{label}</div>
                <div className="font-display font-bold text-2xl mt-1" style={{ color: 'var(--text-primary)' }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
