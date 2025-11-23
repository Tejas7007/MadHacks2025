/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors
        'space': {
          950: '#020307',
          900: '#050810',
          800: '#0a0e1a',
          700: '#0f1420',
          600: '#1a1f35',
        },
        // Accent colors
        'cyber': {
          blue: '#00d4ff',
          purple: '#a855f7',
          green: '#10b981',
          pink: '#f472b6',
          yellow: '#fbbf24',
        },
        // Node role colors
        'role': {
          principle: '#fbbf24', // yellow
          fact: '#00d4ff',      // blue
          example: '#10b981',   // green
          analogy: '#a855f7',   // purple
        },
        // Tier colors for clustering
        'tier': {
          1: '#10b981',   // green - directly connected
          2: '#00d4ff',   // blue - secondary
          3: '#a855f7',   // purple - tertiary
        }
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(to right, rgba(0, 212, 255, 0.05) 1px, transparent 1px),
                         linear-gradient(to bottom, rgba(0, 212, 255, 0.05) 1px, transparent 1px)`,
        'radial-glow': 'radial-gradient(circle at center, rgba(0, 212, 255, 0.15) 0%, transparent 70%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.3), 0 0 10px rgba(0, 212, 255, 0.2)' },
          '100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 10px rgba(0, 212, 255, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)',
        'neon-purple': '0 0 10px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.3)',
        'neon-green': '0 0 10px rgba(16, 185, 129, 0.5), 0 0 20px rgba(16, 185, 129, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}
