
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#FFF9F5', // More creamy and warm
        'blush-pink': '#FF85A1', // Vibrant pink
        'rose-gold': '#E5B182', // Soft sandy gold
        'cocoa-brown': '#4E342E', // Deep chocolate
        'muted-mauve': '#8D6E63', // Warm brown
        'dark-choco': '#4E342E',
        'brown-sugar': '#B08968',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Roboto', 'sans-serif'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'scale-in': 'scaleIn 0.3s ease-out forwards',
        'shake': 'shake 0.5s ease-in-out',
      }
    },
  },
  plugins: [],
}