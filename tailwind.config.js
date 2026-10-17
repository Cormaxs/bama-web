/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Override the 'stone' scale used across the app
        stone: {
          50: '#f8f7f6',
          100: '#f3f1ef',
          200: '#e6e2df',
          300: '#cfc7c3',
          400: '#a79b95',
          500: '#7f6f6a',
          600: '#5f4e49',
          700: '#3f2f2b',
          800: '#1f1513',
          900: '#0f0b0a',
          950: '#080706'
        },
        uzumaki: {
          DEFAULT: '#d94b2a',
          accent: '#ff651f'
        }
      },
      ringColor: {
        uzumaki: '#d94b2a'
      }
    },
  },
  plugins: [],
}
