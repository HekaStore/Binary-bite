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
        skybrand: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
          950: '#082F49',
        },
        brand: {
          cobalt: "#0A2463",
          royal: "#0284C7",
          sky: "#E0F2FE",
          electric: "#0284C7",
          white: "#FFFFFF",
          slate: "#0F172A",
          muted: "#64748B",
          line: "#E2E8F0",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        script: ['"Caveat"', 'cursive', 'sans-serif'],
      },
      boxShadow: {
        'soft-float': '0 20px 40px -15px rgba(2, 132, 199, 0.12), 0 0 15px 0 rgba(0, 0, 0, 0.03)',
        'card-paper': '0 10px 25px -5px rgba(2, 132, 199, 0.08), 0 8px 10px -6px rgba(2, 132, 199, 0.04)',
        'btn-sky': '0 4px 14px 0 rgba(2, 132, 199, 0.35)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};

export default config;
