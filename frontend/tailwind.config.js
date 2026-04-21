/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-container": "var(--primary-container)",
        "on-primary": "var(--on-primary)",
        "on-primary-container": "var(--on-primary-container)",
        background: "var(--background)",
        surface: "var(--surface)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        error: "var(--error)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
      },
    },
  },
  plugins: [],
}
