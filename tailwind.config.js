/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      animation: {
        'marquee-with-pause': 'marquee 10s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '30%': { transform: 'translateX(0)' },
          '45%': { transform: 'translateX(0)' }, // Pausa en el centro
          '75%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
    },
  },
  plugins: [],
}