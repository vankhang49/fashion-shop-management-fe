/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "!./src/pages/**/*",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  corePlugins: {
    preflight: false, // Tắt các CSS mặc định
  },
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}