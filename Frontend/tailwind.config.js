// Arquivo: Frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Diz ao Tailwind para olhar seus arquivos React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}