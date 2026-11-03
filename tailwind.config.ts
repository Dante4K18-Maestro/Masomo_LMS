import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Manrope Variable", ...defaultTheme.fontFamily.sans],
        display: ["Space Grotesk Variable", ...defaultTheme.fontFamily.sans],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        ink: {
          950: "#07111f",
          900: "#0b1729",
          800: "#12233c",
          700: "#1b3150",
          600: "#294566",
          500: "#3c5a7d",
        },
        mist: {
          50: "#f6f8fb",
          100: "#eef2f8",
          200: "#e2e8f1",
          300: "#cfd8e6",
          400: "#b5c2d5",
        },
        electric: {
          50: "#eef5ff",
          100: "#d9e8ff",
          200: "#bcd7ff",
          300: "#8ebeff",
          400: "#5b9aff",
          500: "#3678f6",
          600: "#2159db",
          700: "#1c47b1",
          800: "#1c3e8b",
          900: "#1c386f",
        },
        lime: {
          50: "#f8ffe6",
          100: "#efffc4",
          200: "#dffe8b",
          300: "#c7f45a",
          400: "#aee62b",
          500: "#8fc70e",
          600: "#6e9d06",
          700: "#54770b",
          800: "#445e0f",
          900: "#3a5012",
          950: "#2b3c0c",
        },
        coral: {
          50: "#fff3ef",
          100: "#ffe3da",
          200: "#ffc7b6",
          300: "#ffa087",
          400: "#ff6b47",
          500: "#f7512d",
          600: "#e43718",
          700: "#bf2912",
          800: "#9d2514",
          900: "#822516",
        },
      },
      boxShadow: {
        soft: "0 1px 2px rgba(11, 23, 41, 0.04), 0 8px 24px -12px rgba(11, 23, 41, 0.12)",
        lift: "0 2px 4px rgba(11, 23, 41, 0.04), 0 20px 45px -22px rgba(11, 23, 41, 0.28)",
        glow: "0 0 0 1px rgba(199, 244, 90, 0.25), 0 20px 60px -20px rgba(199, 244, 90, 0.35)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "pulse-ring": {
          "0%": { boxShadow: "0 0 0 0 rgba(199, 244, 90, 0.4)" },
          "70%": { boxShadow: "0 0 0 12px rgba(199, 244, 90, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(199, 244, 90, 0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
      },
      backgroundImage: {
        "grid-light":
          "linear-gradient(to right, rgba(11,23,41,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,23,41,0.045) 1px, transparent 1px)",
        "grid-dark":
          "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
