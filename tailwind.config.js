/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        youtube: '#FF0000',
        tiktok: '#000000',
        instagram: '#E4405F',
        twitter: '#1DA1F2',
        linkedin: '#0077B5',
      },
    },
  },
  plugins: [],
}
