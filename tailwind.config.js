/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cine: {
          bg: '#0A0D18',
          card: '#13182A',
          cardHover: '#1E253B',
          primary: '#A855F7',
          secondary: '#06B6D4',
          accent: '#F59E0B',
          chip: '#232A42',
          border: '#2A3452'
        }
      }
    },
  },
  plugins: [],
}
