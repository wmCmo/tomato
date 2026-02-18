/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        "pink-prim": "#FF9393",
        "pink-sec": "#FFB3B3",
        "yellow-prim": "#FFC367",
        "yellow-sec": "#FFD28D",
        "blue-prim": "#88E0FF",
        "blue-sec": "#B1EBFF",
        "background": "var(--background)",
        "faded": "var(--faded)",
        "foreground": "var(--foreground)",
        "border": "var(--border)",
        "muted": "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        "accent": "var(--accent)",
        "extreme": "var(--extreme)",
      },
      fontFamily: {
        display: ["Montserrat", "Arial", "sans-serif"],
        zenMaru: ["Zen Maru Gothic", "sans-serif"],
        pixel: ["Pixelify Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
