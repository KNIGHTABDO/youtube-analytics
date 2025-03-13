/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF0000', // YouTube red
        secondary: '#282828', // YouTube dark gray
        background: '#0F0F0F', // YouTube black
        'gray-light': '#909090', // YouTube light gray
        'gray-dark': '#606060', // YouTube dark gray
        accent: '#f3f4f6', // Light gray for hover
        'accent-foreground': '#111827', // Dark text color
        input: '#e5e7eb', // Border color for inputs
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}; 