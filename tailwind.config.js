/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1a1a2e',
        secondary: '#16213e',
        accent: '#e94560',
        surface: '#0f3460',
        background: '#0a0a0a',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        'surface-50': '#f8fafc',
        'surface-100': '#f1f5f9',
        'surface-200': '#e2e8f0',
        'surface-300': '#cbd5e1',
        'surface-400': '#94a3b8',
        'surface-500': '#64748b',
        'surface-600': '#475569',
        'surface-700': '#334155',
        'surface-800': '#1e293b',
        'surface-900': '#0f172a'
      },
      fontFamily: {
        display: ['Creepster', 'cursive'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Inter', 'ui-sans-serif', 'system-ui']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'shake': 'shake 0.5s ease-in-out',
        'flash': 'flash 0.3s ease-out'
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            boxShadow: '0 0 5px rgba(233, 69, 96, 0.5)',
            transform: 'scale(1)'
          },
          '50%': { 
            boxShadow: '0 0 15px rgba(233, 69, 96, 0.8)',
            transform: 'scale(1.02)'
          }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' }
        },
        'flash': {
          '0%': { backgroundColor: 'rgba(233, 69, 96, 0.3)' },
          '50%': { backgroundColor: 'rgba(233, 69, 96, 0.6)' },
          '100%': { backgroundColor: 'transparent' }
        }
      }
    },
  },
  plugins: [],
}