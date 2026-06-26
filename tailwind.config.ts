import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Hanken Grotesk", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      colors: {
        // Cool-neutral + cobalt token palette (Instrument). Driven by CSS
        // variables in globals.css so light/dark switch automatically.
        paper: "var(--paper)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        ink: "var(--ink)",
        muted: "var(--muted)",
        faint: "var(--faint)",
        hairline: "var(--hairline)",
        "hairline-2": "var(--hairline-2)",
        accent: {
          DEFAULT: "var(--accent)",
          soft: "var(--accent-soft)",
          line: "var(--accent-line)",
        },
        positive: "var(--positive)",
        caution: "var(--caution)",
        critical: {
          DEFAULT: "var(--critical)",
          soft: "var(--critical-soft)",
        },
        // Cobalt brand scale (back-compat for any remaining brand-* usage).
        brand: {
          50: "#eef1ff",
          100: "#dfe4ff",
          200: "#c2ccff",
          300: "#94a6ff",
          400: "#5b7bff",
          500: "#3a5cff",
          600: "#2348ff",
          700: "#1b39d6",
          800: "#192fa8",
          900: "#172a84",
        },
      },
      borderRadius: {
        sm: "3px",
        md: "6px",
        lg: "10px",
        card: "14px",
      },
      letterSpacing: {
        display: "-0.035em",
      },
    },
  },
  plugins: [],
};

export default config;
