/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
       colors: {
        orange: "#FF6A13",
        black: "#1C1C1C",
        lemon: "#F9E600",
        yellow: "#FFB800",
        green:  "#064749",
        darkGreen:"#064749",
        blue: '#1F51FF',
        fontFamily: {
          inter: ["Inter", "sans-serif"],
        },
      },
    },
  },
  plugins: [],
}
