/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        peach: '#FFD1DC',
        pink: '#FFB6C1',
        darkpink: '#FF69B4',
        lightpeach: '#FFF0F5',
      },
      fontFamily: {
        playful: [
          'Caveat',
          'Pacifico',
          'Comic Sans MS',
          'Comic Sans',
          'cursive',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
} 