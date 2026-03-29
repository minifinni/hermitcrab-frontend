import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0d0f14",
        card: "#161920",
        border: "#2a2d35",
        amber: {
          DEFAULT: "#f59e0b",
          dark: "#ea580c",
        },
      },
      fontFamily: {
        pixel: ["'Press Start 2P'", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        "scanline": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.95" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        glow: {
          "0%, 100%": { boxShadow: "0 0 8px #f59e0b40" },
          "50%": { boxShadow: "0 0 20px #f59e0b80, 0 0 40px #f59e0b20" },
        },
      },
      animation: {
        flicker: "flicker 3s ease-in-out infinite",
        slideIn: "slideIn 0.5s ease-out forwards",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
