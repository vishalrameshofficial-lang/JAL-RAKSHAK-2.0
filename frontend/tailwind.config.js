/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        abyss: {
          950: '#020C14',
          900: '#03131F',
          850: '#051926',
          800: '#061E2B',
          750: '#072433',
          700: '#082C3A',
          600: '#0E3E50',
          500: '#15556B'
        },
        aqua: {
          primary: '#00D4FF',
          deep: '#00B8D9',
          glow: '#38E1FF',
          seafoam: '#20E3C2',
          light: '#72F1DC',
          dark: '#00838F'
        },
        hazard: {
          warning: '#F59E0B',
          warningLight: '#FDE68A',
          critical: '#EF4444',
          criticalLight: '#FCA5A5',
          safe: '#10B981',
          safeLight: '#6EE7B7'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 212, 255, 0.25)',
        'glow-seafoam': '0 0 20px rgba(32, 227, 194, 0.25)',
        'glow-warning': '0 0 20px rgba(245, 158, 11, 0.25)',
        'glow-critical': '0 0 20px rgba(239, 68, 68, 0.3)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-flow': 'wave 8s ease-in-out infinite alternate',
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateY(0px) scale(1)' },
          '100%': { transform: 'translateY(-6px) scale(1.02)' },
        }
      }
    },
  },
  plugins: [],
}
