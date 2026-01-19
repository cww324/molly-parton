import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      colors: {
        ink: "#0c0b0a",
        ember: "#f04e2b",
        dune: "#f7efe3",
        haze: "#f3cfa3",
        forest: "#0f2e22",
      },
      boxShadow: {
        glow: "0 20px 60px rgba(240, 78, 43, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
