/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        flexoki: {
          base: '#FFFCF0', // Paper White
          surface: '#F2F0E5', // Light Grey-Beige
          text: '#100F0F', // Black
          primary: '#BC5215', // Flexoki Orange
          success: '#66800B', // Flexoki Green
          error: '#AF3029', // Flexoki Red
          blue: '#205EA6',
          yellow: '#AD8301',
        }
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px #100F0F',
        'neo-sm': '2px 2px 0px 0px #100F0F',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
