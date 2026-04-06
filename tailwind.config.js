/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Matcha theme (default)
        matcha: {
          bg: '#0f1923',
          surface: '#162030',
          border: '#1e3040',
          text: '#e8dcc8',
          subtext: '#8a9bb0',
          primary: '#4a7c59',
          secondary: '#d4a853',
          error: '#c84b31',
          correct: '#4a7c59',
        },
        // Sumi theme
        sumi: {
          bg: '#0d0d0d',
          surface: '#1a1a1a',
          border: '#2a2a2a',
          text: '#e0e0e0',
          subtext: '#666666',
          primary: '#d0d0d0',
          secondary: '#888888',
          error: '#cc4444',
          correct: '#aaaaaa',
        },
        // Ukiyo theme
        ukiyo: {
          bg: '#0a1628',
          surface: '#0f2040',
          border: '#1a3060',
          text: '#f0e6c0',
          subtext: '#8090b0',
          primary: '#4080c0',
          secondary: '#d4a853',
          error: '#c84b31',
          correct: '#4080c0',
        },
        // Shu theme
        shu: {
          bg: '#1a0a05',
          surface: '#2a1208',
          border: '#3d1e10',
          text: '#f5e6d0',
          subtext: '#9a7060',
          primary: '#c84b31',
          secondary: '#d4a853',
          error: '#ff6b35',
          correct: '#c84b31',
        },
        // Yuki theme
        yuki: {
          bg: '#0e1520',
          surface: '#161f2e',
          border: '#202c3e',
          text: '#d8e8f0',
          subtext: '#607080',
          primary: '#80b0d0',
          secondary: '#a0c0d0',
          error: '#d04050',
          correct: '#80b0d0',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', '"JetBrains Mono"', 'monospace'],
        sans: ['"Noto Sans JP"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'cursor-blink': 'cursorBlink 1.2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'ink-drop': 'inkDrop 0.6s ease-out',
        'sakura-fall': 'sakuraFall 3s ease-in-out infinite',
        'wave': 'wave 8s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        cursorBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        inkDrop: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '60%': { transform: 'scale(1.2)', opacity: '0.4' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        sakuraFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.8' },
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0' },
        },
        wave: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-2%)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 8px currentColor' },
          '50%': { boxShadow: '0 0 20px currentColor, 0 0 40px currentColor' },
        },
      },
      boxShadow: {
        'zen': '0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)',
        'zen-lg': '0 8px 48px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.4)',
        'ink': 'inset 0 1px 0 rgba(255,255,255,0.05)',
        'glow-green': '0 0 16px rgba(74,124,89,0.4)',
        'glow-gold': '0 0 16px rgba(212,168,83,0.4)',
        'glow-red': '0 0 16px rgba(200,75,49,0.4)',
      },
    },
  },
  plugins: [],
}
