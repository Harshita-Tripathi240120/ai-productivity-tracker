/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode based on class
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Assuming Inter font as per guidelines
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For prose class
  ],
}
