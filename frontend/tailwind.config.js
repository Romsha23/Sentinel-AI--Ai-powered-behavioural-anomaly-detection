/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        smartnet: {
          bg: '#14052b',
          bgDark: '#0e031f',
          card: '#220e3f',
          cardHover: '#2d1452',
          border: 'rgba(168, 85, 247, 0.25)',
          borderGlow: 'rgba(217, 70, 239, 0.4)',
          violet: '#a855f7',
          purple: '#9333ea',
          fuchsia: '#d946ef',
          pink: '#ec4899',
          blue: '#3b82f6',
          cyan: '#06b6d4',
          textMuted: '#9482b6',
          textLight: '#e9d8a6',
        },
        cyber: {
          bg: '#14052b',
          card: '#220e3f',
          cardHover: '#2d1452',
          border: 'rgba(168, 85, 247, 0.25)',
          accent: '#a855f7',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          purple: '#A855F7',
          pink: '#EC4899',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
