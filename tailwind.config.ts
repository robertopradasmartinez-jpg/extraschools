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
          50: '#e6f7ff',
          100: '#b3e5ff',
          200: '#80d4ff',
          300: '#4dc2ff',
          400: '#1ab0ff',
          500: '#00A3FF',
          600: '#0082cc',
          700: '#006299',
          800: '#004166',
          900: '#002133',
        },
        secondary: {
          50: '#e6fff4',
          100: '#b3ffe0',
          200: '#80ffcc',
          300: '#4dffb8',
          400: '#1affa3',
          500: '#00E68A',
          600: '#00b86e',
          700: '#008a52',
          800: '#005c37',
          900: '#002e1b',
        },
        accent: {
          50: '#fff7e6',
          100: '#ffe9b3',
          200: '#ffdb80',
          300: '#ffcd4d',
          400: '#ffbf1a',
          500: '#FFB800',
          600: '#cc9300',
          700: '#996e00',
          800: '#664a00',
          900: '#332500',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-primary": "linear-gradient(135deg, #00A3FF 0%, #0082cc 100%)",
        "gradient-secondary": "linear-gradient(135deg, #00E68A 0%, #00b86e 100%)",
        "gradient-vibrant": "linear-gradient(135deg, #00A3FF 0%, #00E68A 100%)",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'hover': '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
export default config;
