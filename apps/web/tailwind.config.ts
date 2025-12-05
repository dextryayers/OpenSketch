import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Penting agar fitur dark mode berfungsi manual via tombol
  theme: {
    extend: {
      colors: {
        primary: '#3d85c6',
      },
    },
  },
  plugins: [],
}
export default config