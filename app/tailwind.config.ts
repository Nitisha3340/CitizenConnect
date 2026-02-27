import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class', // enable manual dark mode toggling
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        heading: ["var(--font-sora)"],
      },
    },
  },
  plugins: [],
};

export default config;
