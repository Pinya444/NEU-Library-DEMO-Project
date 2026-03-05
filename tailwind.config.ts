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
        "neu-maroon": "#7B1C2E",
        "neu-gold":   "#C9A84C",
        "neu-dark":   "#1A0A0F",
        "neu-cream":  "#FAF6F0",
        "neu-muted":  "#8A7A72",
        "neu-border": "#E8DDD5",
      },
      fontFamily: {
        playfair: ["var(--font-playfair)", "serif"],
        sans:     ["var(--font-dm-sans)",  "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)"    },
        },
        modalPop: {
          from: { opacity: "0", transform: "scale(0.92) translateY(12px)" },
          to:   { opacity: "1", transform: "scale(1)    translateY(0)"    },
        },
      },
      animation: {
        fadeUp:   "fadeUp 0.5s ease both",
        modalPop: "modalPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
