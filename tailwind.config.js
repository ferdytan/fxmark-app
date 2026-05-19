/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dashboard-bg': '#f8fafc',
        'sidebar-bg': '#ffffff',
        'primary-blue': '#2563eb',
      }
    },
  },
  plugins: [],
}
