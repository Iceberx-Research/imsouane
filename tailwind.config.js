/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: '#E8D5B7',
        ocean: '#1B6B93',
        terracotta: '#C84B31',
        paper: '#FEFEFE',
        dark: '#2D2424',
        mgreen: '#006233',
        mred: '#C1272D',
      },
      fontFamily: {
        heading: ['"El Messiri"', 'sans-serif'],
        sans: ['"Cairo"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'zellige-pattern': "url('/zellige-pattern.svg')",
      }
    },
  },
  plugins: [],
}
