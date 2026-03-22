import React, { useState } from 'react'
import useStore from '../store/useStore'
import { MONTHS, DAYS, generateCalendarDays, getHeatColor } from '../utils/helpers'

const CURRENT_YEAR = new Date().getFullYear()
const CURRENT_MONTH = new Date().getMonth()

export default function CalendarHeatmap() {
  const [view, setView] = useState('month')
  const [month, setMonth] = useState(CURRENT_MONTH)
  const [year, setYear] = useState(CURRENT_YEAR)
  const [tooltip, setTooltip] = useState(null)

  const heatData = useStore(s => s.getHeatmapData())
  const heatMap = Object.fromEntries(heatData.map(d => [d.date, d]))
  const maxCount = Math.max(...heatData.map(d => d.count), 1)

  const today = new Date().toISOString().slice(0, 10)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  if (view === 'year') {
    // Yearly view: compact grid
    const allDays = []
    for (let m = 0; m < 12; m++) {
      const days = generateCalendarDays(year, m)
      allDays.push({ month: m, days })
    }

    return (
      <div>
        <ViewToggle view={view} setView={setView} year={year} setYear={setYear} />
        <div className="mt-4 space-y-3 overflow-x-auto pb-2">
          {allDays.map(({ month: m, days }) => (
            <div key={m} className="flex items-center gap-3">
              <div className="w-8 text-xs font-medium shrink-0 text-right"
                style={{ color: 'var(--text-muted)' }}>{MONTHS[m]}</div>
              <div className="flex flex-wrap gap-1">
                {days.map((d, i) => (
                  <div
                    key={i}
                    className="heatmap-cell relative"
                    style={{
                      width: 12, height: 12,
                      background: d ? getHeatColor(heatMap[d.date]?.count || 0, maxCount) : 'transparent',
                      border: d?.date === today ? '1.5px solid var(--accent)' : 'none',
                      opacity: d ? 1 : 0,
                    }}
                    onMouseEnter={() => d && setTooltip({ date: d.date, data: heatMap[d.date] })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        {tooltip && <TooltipBox tooltip={tooltip} />}
        <Legend />
      </div>
    )
  }

  // Monthly view
  const days = generateCalendarDays(year, month)

  return (
    <div>
      <ViewToggle view={view} setView={setView} year={year} setYear={setYear}
        month={month} prevMonth={prevMonth} nextMonth={nextMonth} showMonthNav />
      <div className="mt-4">
        <div className="grid grid-cols-7 mb-2">
          {DAYS.map(d => (
            <div key={d} className="text-center text-xs font-semibold py-1"
              style={{ color: 'var(--text-muted)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div
              key={i}
              className="aspect-square rounded-lg flex items-center justify-center text-xs relative transition-all duration-150"
              style={{
                background: d ? getHeatColor(heatMap[d?.date]?.count || 0, maxCount) : 'transparent',
                color: d?.date === today ? 'var(--accent)' : 'var(--text-secondary)',
                border: d?.date === today ? '2px solid var(--accent)' : '1px solid transparent',
                fontFamily: 'DM Sans',
                fontWeight: d?.date === today ? 700 : 400,
                cursor: d ? 'pointer' : 'default',
              }}
              onMouseEnter={() => d && setTooltip({ date: d.date, data: heatMap[d.date] })}
              onMouseLeave={() => setTooltip(null)}
            >
              {d?.day}
            </div>
          ))}
        </div>
      </div>
      {tooltip && <TooltipBox tooltip={tooltip} />}
      <Legend />
    </div>
  )
}

function ViewToggle({ view, setView, year, setYear, month, prevMonth, nextMonth, showMonthNav }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2">
      <div className="flex items-center gap-2">
        {showMonthNav && view === 'month' && (
          <>
            <button onClick={prevMonth} className="btn-ghost px-2 py-1 text-lg">‹</button>
            <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)', minWidth: 90, textAlign: 'center' }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} className="btn-ghost px-2 py-1 text-lg">›</button>
          </>
        )}
        {view === 'year' && (
          <>
            <button onClick={() => setYear(y => y - 1)} className="btn-ghost px-2 py-1 text-lg">‹</button>
            <span className="font-display font-semibold text-sm" style={{ color: 'var(--text-primary)', minWidth: 50, textAlign: 'center' }}>{year}</span>
            <button onClick={() => setYear(y => y + 1)} className="btn-ghost px-2 py-1 text-lg">›</button>
          </>
        )}
      </div>
      <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
        {['month', 'year'].map(v => (
          <button
            key={v}
            onClick={() => setView(v)}
            className="px-3 py-1.5 text-xs font-medium capitalize transition-colors"
            style={{
              background: view === v ? 'var(--accent)' : 'var(--bg-elevated)',
              color: view === v ? 'white' : 'var(--text-secondary)',
            }}
          >{v}</button>
        ))}
      </div>
    </div>
  )
}

function TooltipBox({ tooltip }) {
  return (
    <div className="mt-3 px-3 py-2.5 rounded-xl text-sm"
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      }}>
      <div className="stat-label">{tooltip.date}</div>
      {tooltip.data ? (
        <div className="mt-1 flex gap-4">
          <span style={{ color: 'var(--text-primary)' }}>
            <strong>{tooltip.data.count}</strong>
            <span style={{ color: 'var(--text-muted)' }}> sessions</span>
          </span>
          <span style={{ color: 'var(--accent)' }}>
            <strong>{tooltip.data.avgWPM}</strong>
            <span style={{ color: 'var(--text-muted)' }}> avg WPM</span>
          </span>
        </div>
      ) : (
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>No activity</div>
      )}
    </div>
  )
}

function Legend() {
  return (
    <div className="flex items-center gap-2 mt-4 justify-end">
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Less</span>
      {[0, 0.25, 0.5, 0.75, 1].map((v, i) => (
        <div key={i} className="heatmap-cell" style={{ width: 12, height: 12, background: getHeatColor(v, 1) }} />
      ))}
      <span className="text-xs" style={{ color: 'var(--text-muted)' }}>More</span>
    </div>
  )
}
