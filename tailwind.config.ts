import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#e8f4fd',
          100: '#d1e9fb',
          200: '#a3d3f7',
          300: '#75bdf3',
          400: '#4a90e2',
          500: '#4A90E2',
          600: '#3b73b5',
          700: '#2c5688',
          800: '#1d395a',
          900: '#0e1c2d',
        },
        secondary: {
          50: '#f0fde8',
          100: '#e1fbd1',
          200: '#c3f7a3',
          300: '#a5f375',
          400: '#87ef47',
          500: '#76F136',
          600: '#5ec12b',
          700: '#479120',
          800: '#2f6015',
          900: '#18300b',
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
