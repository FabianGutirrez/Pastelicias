/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF7F0',
        'peach': '#FFDAB9',
        'brown-sugar': '#B08968',
        'dark-choco': '#7F5539',
        'gold-accent': '#D4AF37',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
