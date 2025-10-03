/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pink-prim': '#FF9393',
        'pink-sec': '#FFB3B3',
        'yellow-prim': '#FFC367',
        'yellow-sec': '#FFD28D',
        'blue-prim': '#88E0FF',
        'blue-sec': '#B1EBFF'

      }
    },
    fontFamily: {
      display: 'Montserrat, Arial, sans-serif',
      zenMaru: 'Zen Maru Gothic, sans-serif'
    }
  },
  plugins: [],
}

