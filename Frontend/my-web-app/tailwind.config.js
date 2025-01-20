/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-500": "var(--black-500)",
        "blue-100": "var(--blue-100)",
        "green-100": "var(--green-100)",
        "green-2": "var(--green-2)",
        white: "var(--white)",
      },
    },
  },
  plugins: [],
}
