import React, { useState, useEffect, useRef, useCallback } from 'react'
import { getRandomText } from '../utils/texts'
import { calcWPM, calcAccuracy, formatTime } from '../utils/helpers'
import useStore from '../store/useStore'
import { RotateCcw, ChevronRight } from 'lucide-react'

const STATE = { IDLE: 'idle', COUNTDOWN: 'countdown', TYPING: 'typing', DONE: 'done' }

export default function TypingBox({ onSessionComplete }) {
  const settings = useStore(s => s.settings)
  const addSession = useStore(s => s.addSession)

  const [text, setText] = useState(() => getRandomText(settings.difficulty || 'medium'))
  const [typed, setTyped] = useState('')
  const [status, setStatus] = useState(STATE.IDLE)
  const [countdown, setCountdown] = useState(3)
  const [elapsed, setElapsed] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [mistakes, setMistakes] = useState(0)
  const [result, setResult] = useState(null)

  const inputRef = useRef(null)
  const timerRef = useRef(null)
  const countdownRef = useRef(null)
  const startTimeRef = useRef(null)
  const mistakeSet = useRef(new Set())
  const textRef = useRef(text)
  textRef.current = text

  const duration = settings.duration || 60

  const reset = useCallback(() => {
    clearInterval(timerRef.current)
    clearInterval(countdownRef.current)
    const newText = getRandomText(settings.difficulty || 'medium')
    setText(newText)
    setTyped('')
    setStatus(STATE.IDLE)
    setCountdown(3)
    setElapsed(0)
    setWpm(0)
    setAccuracy(100)
    setMistakes(0)
    setResult(null)
    mistakeSet.current = new Set()
    startTimeRef.current = null
  }, [settings.difficulty])

  const startCountdown = useCallback(() => {
    if (status !== STATE.IDLE) return
    setStatus(STATE.COUNTDOWN)
    setCountdown(3)
    let c = 3
    countdownRef.current = setInterval(() => {
      c--
      if (c <= 0) {
        clearInterval(countdownRef.current)
        setCountdown(0)
        setStatus(STATE.TYPING)
        startTimeRef.current = Date.now()
        inputRef.current?.focus()
      } else {
        setCountdown(c)
      }
    }, 1000)
  }, [status])

  // Timer
  useEffect(() => {
    if (status === STATE.TYPING) {
      timerRef.current = setInterval(() => {
        const el = Math.round((Date.now() - startTimeRef.current) / 1000)
        setElapsed(el)
        const currentTyped = typed
        const correctCount = currentTyped.split('').filter((c, i) => c === textRef.current[i]).length
        const w = calcWPM(currentTyped.length, el || 1)
        const a = calcAccuracy(correctCount, currentTyped.length)
        setWpm(w)
        setAccuracy(a)

        if (el >= duration) {
          finishSession(currentTyped, el, w, a)
        }
      }, 500)
    }
    return () => clearInterval(timerRef.current)
  }, [status, typed, duration])

  const finishSession = useCallback((finalTyped, finalElapsed, finalWpm, finalAccuracy) => {
    clearInterval(timerRef.current)
    setStatus(STATE.DONE)
    const correctCount = finalTyped.split('').filter((c, i) => c === textRef.current[i]).length
    const totalMistakes = mistakeSet.current.size
    const session = {
      wpm: finalWpm || calcWPM(finalTyped.length, finalElapsed || 1),
      accuracy: finalAccuracy || calcAccuracy(correctCount, finalTyped.length),
      mistakes: totalMistakes,
      duration: finalElapsed,
      chars: finalTyped.length,
    }
    setResult(session)
    addSession(session)
    onSessionComplete?.(session)
  }, [addSession, onSessionComplete])

  const handleKeyDown = useCallback((e) => {
    if (status === STATE.IDLE) {
      startCountdown()
      return
    }
    if (status !== STATE.TYPING) return

    if (e.key === 'Escape') { reset(); return }
  }, [status, startCountdown, reset])

  const handleChange = useCallback((e) => {
    if (status !== STATE.TYPING) return
    const val = e.target.value
    if (val.length > text.length) return
    setTyped(val)

    // Track mistakes
    val.split('').forEach((c, i) => {
      if (c !== text[i]) mistakeSet.current.add(i)
    })
    setMistakes(mistakeSet.current.size)

    // Auto-finish on text complete
    if (val.length === text.length) {
      const el = Math.round((Date.now() - startTimeRef.current) / 1000)
      const correctCount = val.split('').filter((c, i) => c === text[i]).length
      const w = calcWPM(val.length, el || 1)
      const a = calcAccuracy(correctCount, val.length)
      finishSession(val, el, w, a)
    }
  }, [status, text, finishSession])

  const progress = status === STATE.TYPING
    ? (elapsed / duration) * 100
    : status === STATE.DONE ? 100 : 0

  const timeLeft = Math.max(0, duration - elapsed)

  // Render characters
  const renderText = () => {
    return text.split('').map((char, i) => {
      let cls = 'typing-pending'
      if (i < typed.length) {
        cls = typed[i] === char ? 'typing-correct' : 'typing-incorrect'
      } else if (i === typed.length) {
        cls = 'typing-current'
      }
      return (
        <span key={i} className={cls} style={{ fontFamily: 'JetBrains Mono', fontSize: '1.05rem', lineHeight: 1.8 }}>
          {char}
        </span>
      )
    })
  }

  if (status === STATE.DONE && result) {
    return <ResultPanel result={result} onRetry={reset} />
  }

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in">
      {/* Progress bar */}
      <div className="progress-bar mb-6">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      {/* Live stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'WPM', value: status === STATE.TYPING ? wpm : '—', accent: true },
          { label: 'Accuracy', value: status === STATE.TYPING ? `${accuracy}%` : '—' },
          { label: status === STATE.TYPING ? 'Time Left' : 'Duration', value: status === STATE.TYPING ? formatTime(timeLeft) : formatTime(duration) },
        ].map(({ label, value, accent }) => (
          <div key={label} className="card px-4 py-3 text-center">
            <div className="stat-label">{label}</div>
            <div className="stat-value text-xl mt-1" style={{ color: accent ? 'var(--accent)' : 'var(--text-primary)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Typing area */}
      <div
        className="card p-6 cursor-text relative"
        onClick={() => {
          if (status === STATE.IDLE) startCountdown()
          else inputRef.current?.focus()
        }}
      >
        {/* Countdown overlay */}
        {status === STATE.COUNTDOWN && (
          <div className="absolute inset-0 flex items-center justify-center z-10 rounded-2xl"
            style={{ background: 'rgba(9,9,15,0.85)', backdropFilter: 'blur(4px)' }}>
            <div key={countdown} className="font-display font-black text-8xl animate-count-down"
              style={{ color: 'var(--accent)' }}>
              {countdown}
            </div>
          </div>
        )}

        {status === STATE.IDLE && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 rounded-2xl gap-2"
            style={{ background: 'rgba(9,9,15,0.7)', backdropFilter: 'blur(4px)' }}>
            <div className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
              Ready to type?
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>Click here or press any key to start</div>
            <button
              onClick={(e) => { e.stopPropagation(); startCountdown() }}
              className="btn-primary mt-2"
            >
              Start Practice <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Text display */}
        <div className="leading-relaxed select-none" style={{ minHeight: 120 }}>
          {renderText()}
        </div>

        {/* Hidden input */}
        <input
          ref={inputRef}
          className="absolute opacity-0 w-0 h-0"
          value={typed}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          tabIndex={-1}
        />
      </div>

      {/* Mistakes counter */}
      {status === STATE.TYPING && (
        <div className="flex items-center justify-between mt-3 px-1">
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            {typed.length}/{text.length} characters
          </div>
          <div className="text-xs" style={{ color: mistakes > 0 ? 'var(--rose)' : 'var(--text-muted)' }}>
            {mistakes} mistake{mistakes !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Reset button */}
      {status !== STATE.IDLE && (
        <div className="flex justify-center mt-5">
          <button onClick={reset} className="btn-ghost gap-2">
            <RotateCcw size={14} /> New text (Esc)
          </button>
        </div>
      )}
    </div>
  )
}

function ResultPanel({ result, onRetry }) {
  const getGrade = (wpm, acc) => {
    if (acc >= 98 && wpm >= 80) return { g: 'S', color: '#f0abfc' }
    if (acc >= 95 && wpm >= 60) return { g: 'A', color: 'var(--jade)' }
    if (acc >= 90 && wpm >= 40) return { g: 'B', color: 'var(--accent)' }
    if (acc >= 80 && wpm >= 25) return { g: 'C', color: 'var(--accent-warm)' }
    return { g: 'D', color: 'var(--rose)' }
  }

  const grade = getGrade(result.wpm, result.accuracy)

  return (
    <div className="w-full max-w-3xl mx-auto animate-slide-up">
      <div className="card p-8 text-center">
        {/* Grade */}
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 font-display font-black text-4xl"
          style={{
            background: `${grade.color}15`,
            border: `2px solid ${grade.color}40`,
            color: grade.color,
          }}>
          {grade.g}
        </div>

        <h2 className="section-title text-2xl mb-1">Session Complete!</h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          Here's how you did
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'WPM', value: result.wpm, suffix: '', accent: 'var(--accent)' },
            { label: 'Accuracy', value: result.accuracy, suffix: '%', accent: 'var(--jade)' },
            { label: 'Time', value: formatTime(result.duration), suffix: '', accent: 'var(--accent-warm)' },
            { label: 'Mistakes', value: result.mistakes, suffix: '', accent: result.mistakes === 0 ? 'var(--jade)' : 'var(--rose)' },
          ].map(({ label, value, suffix, accent }) => (
            <div key={label} className="card-elevated px-4 py-4">
              <div className="stat-label mb-2">{label}</div>
              <div className="font-display font-bold text-2xl" style={{ color: accent }}>
                {value}{suffix}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={onRetry} className="btn-primary">
            <RotateCcw size={15} /> Try Again
          </button>
        </div>
      </div>
    </div>
  )
}
