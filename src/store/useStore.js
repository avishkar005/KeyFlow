import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const getToday = () => new Date().toISOString().slice(0, 10)

const computeStreak = (sessions) => {
  if (!sessions.length) return { current: 0, longest: 0 }
  const days = [...new Set(sessions.map(s => s.date))].sort().reverse()
  let current = 0
  let longest = 0
  let streak = 0
  const today = getToday()
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  let prev = null

  for (let i = 0; i < days.length; i++) {
    const day = days[i]
    if (i === 0) {
      if (day !== today && day !== yesterday) break
      streak = 1
    } else {
      const diff = (new Date(prev) - new Date(day)) / 86400000
      if (diff === 1) streak++
      else break
    }
    prev = day
    longest = Math.max(longest, streak)
  }
  current = streak

  const allDays = [...new Set(sessions.map(s => s.date))].sort()
  let maxStreak = 0, runStreak = 1
  for (let i = 1; i < allDays.length; i++) {
    const diff = (new Date(allDays[i]) - new Date(allDays[i - 1])) / 86400000
    if (diff === 1) { runStreak++; maxStreak = Math.max(maxStreak, runStreak) }
    else runStreak = 1
  }
  if (allDays.length === 1) maxStreak = 1
  else maxStreak = Math.max(maxStreak, 1)

  return { current, longest: maxStreak }
}

const useStore = create(
  persist(
    (set, get) => ({
      sessions: [],
      theme: 'dark',
      settings: {
        duration: 60,
        difficulty: 'medium',
        soundEnabled: true,
        showLiveWPM: true,
      },

      addSession: (session) => {
        const sessions = [...get().sessions, { ...session, id: Date.now(), date: getToday() }]
        set({ sessions })
      },

      getStreak: () => computeStreak(get().sessions),

      getAverageWPM: () => {
        const s = get().sessions
        if (!s.length) return 0
        return Math.round(s.reduce((a, b) => a + b.wpm, 0) / s.length)
      },

      getRecentSessions: (n = 20) => get().sessions.slice(-n),

      getHeatmapData: () => {
        const sessions = get().sessions
        const map = {}
        sessions.forEach(s => {
          if (!map[s.date]) map[s.date] = { count: 0, totalWPM: 0 }
          map[s.date].count++
          map[s.date].totalWPM += s.wpm
        })
        return Object.entries(map).map(([date, d]) => ({
          date,
          count: d.count,
          avgWPM: Math.round(d.totalWPM / d.count),
        }))
      },

      toggleTheme: () => {
        const next = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: next })
        if (next === 'light') {
          document.documentElement.classList.add('light')
          document.documentElement.classList.remove('dark')
        } else {
          document.documentElement.classList.remove('light')
          document.documentElement.classList.add('dark')
        }
      },

      updateSettings: (s) => set(state => ({ settings: { ...state.settings, ...s } })),

      clearData: () => set({ sessions: [] }),
    }),
    {
      name: 'keyflow-storage',
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (state.theme === 'light') {
            document.documentElement.classList.add('light')
          }
        }
      }
    }
  )
)

export default useStore
