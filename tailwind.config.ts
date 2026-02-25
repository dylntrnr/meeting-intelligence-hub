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
        background: "#0a0a0f",
        card: "rgba(255,255,255,0.04)",
        border: "rgba(255,255,255,0.08)",
        accent: "#6366f1",
        success: "#22c55e",
        warning: "#f97316",
        danger: "#ef4444",
        textPrimary: "#f1f5f9",
        textSecondary: "#94a3b8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      boxShadow: {
        glass: "0 0 0 1px rgba(255,255,255,0.08), 0 20px 50px rgba(0,0,0,0.4)",
      },
      keyframes: {
        floatIn: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        floatIn: "floatIn 500ms ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
