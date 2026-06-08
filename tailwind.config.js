/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#1A365D',
          DEFAULT: '#0B1F3A',
          dark: '#0A1524',
          darker: '#060B12',
        },
        emerald: {
          light: '#34D399',
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        gold: {
          light: '#FBBF24',
          DEFAULT: '#F4B400',
          dark: '#D97706',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
