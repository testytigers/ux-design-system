/**
 * Tailwind CSS Configuration — Brand Design System
 * Violet theme (#8774e1) · Roboto Mono (headings) · Open Sans (body)
 */

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border:     "var(--ds-color-border-default)",
        input:      "var(--ds-color-input)",
        ring:       "var(--ds-color-ring)",
        background: "var(--ds-color-bg-primary)",
        foreground: "var(--ds-color-foreground)",
        primary: {
          DEFAULT:    "var(--ds-color-primary)",
          foreground: "var(--ds-color-primary-foreground)",
          50:  "var(--ds-color-violet-50)",
          100: "var(--ds-color-violet-100)",
          200: "var(--ds-color-violet-200)",
          300: "var(--ds-color-violet-300)",
          400: "var(--ds-color-violet-400)",
          500: "var(--ds-color-violet-500)",
          600: "var(--ds-color-violet-600)",
          700: "var(--ds-color-violet-700)",
          800: "var(--ds-color-violet-800)",
          900: "var(--ds-color-violet-900)",
          950: "var(--ds-color-violet-950)",
        },
        secondary: {
          DEFAULT:    "var(--ds-color-secondary)",
          foreground: "var(--ds-color-secondary-foreground)",
        },
        destructive: {
          DEFAULT:    "var(--ds-color-destructive)",
          foreground: "var(--ds-color-destructive-foreground)",
        },
        muted: {
          DEFAULT:    "var(--ds-color-muted)",
          foreground: "var(--ds-color-muted-foreground)",
        },
        accent: {
          DEFAULT:    "var(--ds-color-accent)",
          foreground: "var(--ds-color-accent-foreground)",
        },
        popover: {
          DEFAULT:    "var(--ds-color-popover)",
          foreground: "var(--ds-color-popover-foreground)",
        },
        card: {
          DEFAULT:    "var(--ds-color-card)",
          foreground: "var(--ds-color-card-foreground)",
        },
      },
      borderRadius: {
        lg:   "var(--ds-radius-lg)",
        md:   "var(--ds-radius-md)",
        sm:   "var(--ds-radius-sm)",
        xl:   "var(--ds-radius-xl)",
        "2xl":"var(--ds-radius-2xl)",
        full: "var(--ds-radius-full)",
      },
      fontFamily: {
        heading: ["var(--ds-font-family-headings)", "ui-monospace", "monospace"],
        body:    ["var(--ds-font-family-body)", "sans-serif"],
        mono:    ["var(--ds-font-family-mono)", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%":     { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "caret-blink":    "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
