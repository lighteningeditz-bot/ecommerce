import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#EA580C",
          600: "#C2410C", // Brand primary
          700: "#9A3412",
          800: "#7C2D12",
          900: "#431407",
        },
        saffron: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#FBBF24",
          500: "#F59E0B", // Accent gold
          600: "#D97706",
          700: "#B45309",
        },
        indigoCraft: {
          500: "#4F46E5",
          600: "#4338CA",
          700: "#3730A3", // Trust accent
          800: "#312E81",
        },
        cream: {
          50: "#FFFAF5",
          100: "#FFF7ED",
          200: "#FDF2E3",
        },
        charcoal: {
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [forms],
};

export default config;
