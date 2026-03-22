import React from 'react'
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Area, AreaChart, ReferenceLine
} from 'recharts'
import useStore from '../store/useStore'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="px-3 py-2.5 rounded-xl text-sm"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
        }}>
        <div className="stat-label mb-1">Session #{label}</div>
        <div className="font-display font-bold text-base" style={{ color: 'var(--accent)' }}>
          {payload[0]?.value} <span className="text-xs font-normal">WPM</span>
        </div>
        {payload[1] && (
          <div className="text-xs mt-0.5" style={{ color: 'var(--jade)' }}>
            {payload[1].value}% accuracy
          </div>
        )}
      </div>
    )
  }
  return null
}

export default function WPMChart({ compact = false }) {
  const sessions = useStore(s => s.getRecentSessions(compact ? 10 : 20))

  const data = sessions.map((s, i) => ({
    session: i + 1,
    wpm: s.wpm,
    accuracy: s.accuracy,
  }))

  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-48 gap-2"
        style={{ color: 'var(--text-muted)' }}>
        <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
          <path d="M3 3v18h18M7 16l4-4 4 4 4-6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-sm">Complete a session to see your progress</p>
      </div>
    )
  }

  const avg = Math.round(data.reduce((a, b) => a + b.wpm, 0) / data.length)

  return (
    <div className="w-full">
      {!compact && (
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="stat-label">Avg WPM (last {data.length})</div>
            <div className="font-display font-bold text-2xl mt-0.5" style={{ color: 'var(--text-primary)' }}>
              {avg} <span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>wpm</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 inline-block rounded" style={{ background: 'var(--accent)' }}/>
              WPM
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 inline-block rounded" style={{ background: 'var(--jade)' }}/>
              Accuracy
            </span>
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={compact ? 80 : 220}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="wpmGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(129,140,248,0.3)" />
              <stop offset="95%" stopColor="rgba(129,140,248,0)" />
            </linearGradient>
            <linearGradient id="accGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="rgba(52,211,153,0.2)" />
              <stop offset="95%" stopColor="rgba(52,211,153,0)" />
            </linearGradient>
          </defs>
          {!compact && (
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
          )}
          {!compact && (
            <XAxis
              dataKey="session"
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              label={{ value: 'Sessions', position: 'insideBottom', offset: -2, fill: 'var(--text-muted)', fontSize: 10 }}
            />
          )}
          {!compact && (
            <YAxis
              tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
            />
          )}
          {!compact && <Tooltip content={<CustomTooltip />} />}
          {!compact && (
            <ReferenceLine y={avg} stroke="var(--accent)" strokeDasharray="4 4" strokeOpacity={0.4} />
          )}
          <Area
            type="monotone"
            dataKey="wpm"
            stroke="var(--accent)"
            strokeWidth={compact ? 1.5 : 2}
            fill="url(#wpmGrad)"
            dot={false}
            activeDot={compact ? false : { r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
          />
          {!compact && (
            <Area
              type="monotone"
              dataKey="accuracy"
              stroke="var(--jade)"
              strokeWidth={1.5}
              fill="url(#accGrad)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--jade)', strokeWidth: 0 }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
