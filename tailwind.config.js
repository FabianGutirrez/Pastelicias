
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
        'cream': '#FFF7F0',
        'blush-pink': '#FADADD', // Soft, primary pink
        'rose-gold': '#E6C7C2', // Elegant accent for buttons and links
        'cocoa-brown': '#5D4037', // Deep brown for text
        'muted-mauve': '#C9A8B9', // For hover states and secondary elements
        'dark-choco': '#5D4037', // Alias for consistency
        'brown-sugar': '#C9A8B9', // Re-purposed for secondary actions
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