/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        base: {
          900: '#09090f',
          800: '#0d0d16',
          700: '#111120',
          600: '#161628',
          500: '#1c1c34',
          400: '#252545',
          300: '#303060',
          200: '#4040a0',
        },
        accent: {
          DEFAULT: '#818cf8',
          hover: '#6366f1',
          muted: '#818cf820',
          warm: '#f59e0b',
        },
        jade: {
          DEFAULT: '#34d399',
          muted: '#34d39920',
        },
        rose: {
          DEFAULT: '#f87171',
          muted: '#f8717120',
        },
        ink: {
          primary: '#eeeef8',
          secondary: '#9090b8',
          tertiary: '#5050a0',
          muted: '#30306a',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'count-down': 'countdown 1s ease-in-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(16px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        countdown: {
          '0%': { transform: 'scale(1.5)', opacity: 0 },
          '30%': { opacity: 1 },
          '100%': { transform: 'scale(0.8)', opacity: 0 },
        },
        shimmer: {
          from: { backgroundPosition: '0 0' },
          to: { backgroundPosition: '-200% 0' },
        },
      },
      boxShadow: {
        glow: '0 0 24px rgba(129, 140, 248, 0.15)',
        'glow-sm': '0 0 12px rgba(129, 140, 248, 0.1)',
        'jade': '0 0 24px rgba(52, 211, 153, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
