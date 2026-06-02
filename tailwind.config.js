/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8f0',
          100: '#ffedd5',
          200: '#fcd9b0',
          300: '#f0b872',
          400: '#e8943a',
          500: '#c8762a',
          600: '#a85f1f',
          700: '#8b4a18',
          800: '#6d3812',
          900: '#4a2610',
          950: '#2a1509',
        },
        accent: {
          400: '#fb923c',
          500: '#ea580c',
          600: '#dc2626',
        },
        navy: {
          950: '#0f0805',
          900: '#1a100a',
          800: '#2a1810',
          700: '#3d2418',
          600: '#523020',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 40px -12px rgba(232, 148, 58, 0.4)',
        card: '0 4px 24px -8px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
}
