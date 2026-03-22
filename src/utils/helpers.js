export const calcWPM = (typedChars, elapsedSeconds) => {
  if (elapsedSeconds === 0) return 0
  const words = typedChars / 5
  const minutes = elapsedSeconds / 60
  return Math.round(words / minutes)
}

export const calcAccuracy = (correct, total) => {
  if (total === 0) return 100
  return Math.round((correct / total) * 100)
}

export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m > 0) return `${m}:${s.toString().padStart(2, '0')}`
  return `${s}s`
}

export const getWPMLabel = (wpm) => {
  if (wpm < 30) return { label: 'Beginner', color: '#9090b8' }
  if (wpm < 50) return { label: 'Intermediate', color: '#f59e0b' }
  if (wpm < 70) return { label: 'Proficient', color: '#818cf8' }
  if (wpm < 100) return { label: 'Advanced', color: '#34d399' }
  return { label: 'Expert', color: '#f0abfc' }
}

export const generateCalendarDays = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date })
  }
  return days
}

export const generateYearDays = (year) => {
  const days = []
  const start = new Date(year, 0, 1)
  const startPad = start.getDay()
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 0; d < 365; d++) {
    const date = new Date(year, 0, 1 + d)
    if (date.getFullYear() !== year) break
    days.push({ date: date.toISOString().slice(0, 10) })
  }
  return days
}

export const getHeatColor = (count, max) => {
  if (!count || count === 0) return 'var(--bg-elevated)'
  const intensity = Math.min(count / Math.max(max, 1), 1)
  if (intensity < 0.25) return 'rgba(129, 140, 248, 0.3)'
  if (intensity < 0.5) return 'rgba(129, 140, 248, 0.5)'
  if (intensity < 0.75) return 'rgba(129, 140, 248, 0.7)'
  return 'rgba(129, 140, 248, 0.95)'
}

export const getMotivationalMessage = (streak) => {
  if (streak === 1) return "Great start! Come back tomorrow to build your streak 🔥"
  if (streak === 3) return "3 days strong! You're building a habit!"
  if (streak === 7) return "One week streak! You're on fire! 🔥"
  if (streak === 14) return "Two weeks of consistency! Incredible dedication!"
  if (streak === 30) return "30-day streak! You're unstoppable! 🏆"
  if (streak % 10 === 0) return `${streak} day streak! Keep the momentum going!`
  return `${streak} day streak! Keep it up!`
}

export const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
export const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
