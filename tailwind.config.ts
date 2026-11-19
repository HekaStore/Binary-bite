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
        brand: {
          cobalt: "#0A2463",    // Deep Cobalt Blue - Header utama, footer, kontras tinggi
          royal: "#1E56A0",     // Royal Tech Blue - Kartu sekunder, aksen utama, tombol sekunder
          sky: "#D6E6F2",       // Crisp Sky Blue - Background section sekunder, highlight halus
          electric: "#2563EB",  // Electric Blue Accent - Tombol CTA utama, indikator aktif
          white: "#FFFFFF",     // Pure White - Background utama, permukaan kartu produk
          slate: "#0F172A",     // Dark Slate - Teks utama agar kontras dan tajam
          border: "#1E56A0",    // Border tech solid
          muted: "#64748B",     // Subteks slate muted
          line: "#E2E8F0",      // Garis pemisah tipis
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'flat-sm': '0 1px 2px 0 rgba(10, 36, 99, 0.05)',
        'flat-md': '0 4px 6px -1px rgba(10, 36, 99, 0.08), 0 2px 4px -2px rgba(10, 36, 99, 0.04)',
        'flat-lg': '0 10px 15px -3px rgba(10, 36, 99, 0.1), 0 4px 6px -4px rgba(10, 36, 99, 0.05)',
        'solid-cobalt': '0 4px 0 0 #0A2463',
        'solid-royal': '0 4px 0 0 #1E56A0',
        'solid-electric': '0 4px 0 0 #1D4ED8',
      },
    },
  },
  plugins: [],
};

export default config;

