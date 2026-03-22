import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Keyboard, BarChart2, Settings,
  Flame, Moon, Sun, Zap
} from 'lucide-react'
import useStore from '../store/useStore'

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/practice', icon: Keyboard, label: 'Practice' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  const theme = useStore(s => s.theme)
  const toggleTheme = useStore(s => s.toggleTheme)
  const getStreak = useStore(s => s.getStreak)
  const streak = getStreak()

  return (
    <aside
      className={`
        fixed top-0 left-0 h-full z-30 w-64 flex flex-col
        transition-transform duration-300 ease-out
        lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-light)',
      }}
    >
      {/* Logo */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex items-center gap-2.5 mb-1">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--accent)', boxShadow: '0 4px 12px rgba(129,140,248,0.4)' }}
          >
            <Zap size={15} color="white" fill="white" />
          </div>
          <span className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
            Key<span style={{ color: 'var(--accent)' }}>Flow</span>
          </span>
        </div>
        <p className="text-xs ml-1 mt-0.5" style={{ color: 'var(--text-muted)' }}>Typing Practice Platform</p>
      </div>

      {/* Streak badge */}
      {streak.current > 0 && (
        <div className="mx-4 mt-4 mb-1 px-3 py-2.5 rounded-xl flex items-center gap-2.5"
          style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <Flame size={16} style={{ color: 'var(--accent-warm)' }} />
          <div>
            <div className="text-xs font-semibold" style={{ color: 'var(--accent-warm)' }}>
              {streak.current} Day Streak
            </div>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Best: {streak.longest} days
            </div>
          </div>
        </div>
      )}

      {/* Divider */}
      <div className="mx-4 my-4" style={{ height: '1px', background: 'var(--border-light)' }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="px-3 pb-5 space-y-2">
        <div className="mx-1" style={{ height: '1px', background: 'var(--border-light)' }} />
        <button
          onClick={toggleTheme}
          className="sidebar-item w-full"
        >
          {theme === 'dark'
            ? <Sun size={17} />
            : <Moon size={17} />
          }
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="px-3 py-3 rounded-xl mt-2"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-light)' }}>
          <div className="stat-label mb-1">Version</div>
          <div className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>KeyFlow v1.0.0</div>
        </div>
      </div>
    </aside>
  )
}
