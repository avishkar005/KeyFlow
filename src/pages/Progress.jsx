import React, { useState } from 'react'
import { BarChart2, Target, Clock, Zap, Award, TrendingUp } from 'lucide-react'
import useStore from '../store/useStore'
import WPMChart from '../components/WPMChart'
import CalendarHeatmap from '../components/CalendarHeatmap'
import { getWPMLabel, formatTime } from '../utils/helpers'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell
} from 'recharts'

const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function AccuracyBar({ value }) {
  const color = value >= 98 ? 'var(--jade)' : value >= 90 ? 'var(--accent)' : 'var(--accent-warm)'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 progress-bar">
        <div className="progress-bar-fill" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-sm font-mono font-medium w-12 text-right" style={{ color }}>{value}%</span>
    </div>
  )
}

const BarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2 rounded-xl text-sm"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
        <div className="stat-label">{label}</div>
        <div className="font-display font-bold" style={{ color: 'var(--accent)' }}>{payload[0]?.value} sessions</div>
      </div>
    )
  }
  return null
}

export default function Progress() {
  const sessions = useStore(s => s.sessions)
  const getStreak = useStore(s => s.getStreak)
  const getAverageWPM = useStore(s => s.getAverageWPM)
  const [tab, setTab] = useState('overview')

  const streak = getStreak()
  const avgWPM = getAverageWPM()
  const wpmLabel = getWPMLabel(avgWPM)
  const totalTime = sessions.reduce((a, b) => a + (b.duration || 0), 0)
  const avgAccuracy = sessions.length
    ? Math.round(sessions.reduce((a, b) => a + b.accuracy, 0) / sessions.length)
    : 0
  const bestWPM = sessions.length ? Math.max(...sessions.map(s => s.wpm)) : 0

  // Monthly sessions count
  const monthlyCounts = MONTHS_SHORT.map((m, i) => {
    const year = new Date().getFullYear()
    const count = sessions.filter(s => {
      const d = new Date(s.date)
      return d.getFullYear() === year && d.getMonth() === i
    }).length
    return { month: m, count }
  })

  // WPM distribution
  const brackets = [
    { label: '<30', min: 0, max: 30 },
    { label: '30-50', min: 30, max: 50 },
    { label: '50-70', min: 50, max: 70 },
    { label: '70-100', min: 70, max: 100 },
    { label: '100+', min: 100, max: Infinity },
  ]
  const wpmDist = brackets.map(b => ({
    range: b.label,
    count: sessions.filter(s => s.wpm >= b.min && s.wpm < b.max).length,
  }))

  const recentBest = sessions.slice(-10)
  const recentAvg = recentBest.length
    ? Math.round(recentBest.reduce((a, b) => a + b.wpm, 0) / recentBest.length)
    : 0

  const improvement = sessions.length >= 10
    ? recentAvg - Math.round(sessions.slice(0, 10).reduce((a, b) => a + b.wpm, 0) / 10)
    : null

  const TABS = ['overview', 'heatmap', 'sessions']

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="section-title text-3xl">Progress</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
            {sessions.length} sessions tracked
          </p>
        </div>
        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-4 py-2 text-sm font-medium capitalize transition-colors"
              style={{
                background: tab === t ? 'var(--accent)' : 'var(--bg-elevated)',
                color: tab === t ? 'white' : 'var(--text-secondary)',
              }}
            >{t}</button>
          ))}
        </div>
      </div>

      {tab === 'overview' && (
        <>
          {/* Top stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Best WPM', value: bestWPM, icon: Zap, accent: '#f0abfc', suffix: '' },
              { label: 'Avg WPM', value: avgWPM, icon: TrendingUp, accent: 'var(--accent)', suffix: '' },
              { label: 'Avg Accuracy', value: avgAccuracy, icon: Target, accent: 'var(--jade)', suffix: '%' },
              { label: 'Total Time', value: formatTime(totalTime), icon: Clock, accent: 'var(--accent-warm)', suffix: '' },
            ].map(({ label, value, icon: Icon, accent, suffix }) => (
              <div key={label} className="card p-4 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: `${accent}18` }}>
                  <Icon size={17} style={{ color: accent }} />
                </div>
                <div>
                  <div className="stat-label mb-1">{label}</div>
                  <div className="font-display font-bold text-2xl leading-none" style={{ color: 'var(--text-primary)' }}>
                    {value}{suffix}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Skill level */}
          {avgWPM > 0 && (
            <div className="card p-5 flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0"
                style={{ background: `${wpmLabel.color}18`, border: `2px solid ${wpmLabel.color}30` }}>
                <Award size={28} style={{ color: wpmLabel.color }} />
              </div>
              <div className="flex-1">
                <div className="stat-label mb-1">Skill Level</div>
                <div className="font-display font-bold text-2xl" style={{ color: wpmLabel.color }}>
                  {wpmLabel.label}
                </div>
                <div className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                  {avgWPM} average WPM
                  {improvement !== null && (
                    <span style={{ color: improvement >= 0 ? 'var(--jade)' : 'var(--rose)', marginLeft: 8 }}>
                      {improvement >= 0 ? `+${improvement}` : improvement} WPM improvement
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="stat-label mb-1">Streak</div>
                <div className="font-display font-bold text-3xl" style={{ color: 'var(--accent-warm)' }}>
                  {streak.current}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>days</div>
              </div>
            </div>
          )}

          {/* Charts row */}
          <div className="grid lg:grid-cols-5 gap-4">
            <div className="card p-5 lg:col-span-3">
              <h3 className="section-title text-base mb-4">WPM Over Time</h3>
              <WPMChart />
            </div>

            <div className="card p-5 lg:col-span-2">
              <h3 className="section-title text-base mb-4">WPM Distribution</h3>
              {sessions.length === 0 ? (
                <div className="flex items-center justify-center h-48"
                  style={{ color: 'var(--text-muted)' }}>
                  <p className="text-sm">No data yet</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={wpmDist} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                    <XAxis dataKey="range" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {wpmDist.map((_, i) => (
                        <Cell key={i} fill={`rgba(129,140,248,${0.3 + i * 0.14})`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Monthly activity */}
          <div className="card p-5">
            <h3 className="section-title text-base mb-4">Monthly Activity ({new Date().getFullYear()})</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={monthlyCounts} margin={{ top: 0, right: 0, bottom: 0, left: -25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<BarTooltip />} />
                <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} opacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {tab === 'heatmap' && (
        <div className="card p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart2 size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="section-title text-base">Activity Calendar</h3>
          </div>
          <CalendarHeatmap />
        </div>
      )}

      {tab === 'sessions' && (
        <div className="card p-5">
          <h3 className="section-title text-base mb-4">All Sessions</h3>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2"
              style={{ color: 'var(--text-muted)' }}>
              <BarChart2 size={32} strokeWidth={1.5} />
              <p className="text-sm">No sessions recorded yet</p>
            </div>
          ) : (
            <div className="space-y-1 max-h-[520px] overflow-y-auto pr-1">
              {[...sessions].reverse().map((s, i) => (
                <div key={s.id || i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                  style={{ background: 'var(--bg-elevated)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(129,140,248,0.12)', fontFamily: 'Syne', fontWeight: 700, fontSize: 12, color: 'var(--accent)' }}>
                    #{sessions.length - i}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-base" style={{ color: 'var(--text-primary)' }}>
                        {s.wpm} <span className="text-xs font-normal" style={{ color: 'var(--text-muted)' }}>wpm</span>
                      </span>
                      <AccuracyBar value={s.accuracy} />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.date}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {s.mistakes} mistakes · {formatTime(s.duration || 0)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
