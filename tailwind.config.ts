import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#7B61FF",
          dark: "#2D1B69"
        }
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};
export default config;
