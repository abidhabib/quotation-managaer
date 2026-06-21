/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#f6f1e9',
          light: '#fffdf8',
        },
        espresso: {
          DEFAULT: '#1a1612',
          dark: '#1f1a14',
        },
        gold: {
          DEFAULT: '#b08842',
          bright: '#d4b876',
          soft: '#e8d4a8',
        },
        taupe: '#6b5d4f',
        charcoal: '#2c2a26',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.32em',
        wider: '0.26em',
        wide: '0.22em',
      },
    },
  },
  plugins: [],
}
