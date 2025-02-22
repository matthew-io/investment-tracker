// tailwind.config.js
/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    // Add more paths if needed:
    './screens/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          gray: "#2C2C2C",
          green: "#15d448",
        },
      },
    },
  },
  plugins: [
    // Here’s the critical part: a custom plugin for RN shadow props
    plugin(function({ addUtilities }) {
      addUtilities({
        // Feel free to rename `.shadow-md` to any class name you like.
        '.shadow-md': {
          shadowColor: '#000',          // White (#fff) is often invisible on a white background
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 2,
        },
      })
    }),
  ],
}
