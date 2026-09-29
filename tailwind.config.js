/** @type {import('tailwindcss').Config} */
const { tailwindColors, fontFamily } = require("./src/shared/theme/tokens");

module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // DMBA Brand Colors + font family — sourced from src/shared/theme/tokens.js,
      // the single source of truth shared with colors.ts (copied verbatim from the
      // app). Edit tokens.js to change a value, not this file.
      colors: tailwindColors,
      fontFamily,
    },
  },
  plugins: [],
};
