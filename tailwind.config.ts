/**
 * Tailwind CSS Configuration — UX Design System
 * Purple theme with Roboto Mono (headings) + Open Sans (body) + JetBrains Mono (code)
 */

import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px"
      }
    },
    extend: {
      colors: {
        border: "var(--ux-color-border-default)",
        input: "var(--ux-color-neutral-200)",
        ring: "var(--ux-color-purple-500)",
        background: "var(--ux-color-bg-primary)",
        foreground: "var(--ux-color-text-primary)",
        primary: {
          DEFAULT: "var(--ux-color-purple-600)",
          foreground: "var(--ux-color-text-on-primary)",
          50: "var(--ux-color-purple-50)",
          100: "var(--ux-color-purple-100)",
          200: "var(--ux-color-purple-200)",
          300: "var(--ux-color-purple-300)",
          400: "var(--ux-color-purple-400)",
          500: "var(--ux-color-purple-500)",
          600: "var(--ux-color-purple-600)",
          700: "var(--ux-color-purple-700)",
          800: "var(--ux-color-purple-800)",
          900: "var(--ux-color-purple-900)",
          950: "var(--ux-color-purple-950)"
        },
        secondary: {
          DEFAULT: "var(--ux-color-purple-100)",
          foreground: "var(--ux-color-purple-900)"
        },
        destructive: {
          DEFAULT: "var(--ux-color-status-error)",
          foreground: "#fff"
        },
        muted: {
          DEFAULT: "var(--ux-color-muted)",
          foreground: "var(--ux-color-muted-foreground)"
        },
        accent: {
          DEFAULT: "var(--ux-color-purple-100)",
          foreground: "var(--ux-color-purple-900)"
        },
        popover: {
          DEFAULT: "var(--ux-color-bg-elevated)",
          foreground: "var(--ux-color-text-primary)"
        },
        card: {
          DEFAULT: "var(--ux-color-bg-primary)",
          foreground: "var(--ux-color-text-primary)"
        }
      },
      borderRadius: {
        lg: "var(--ux-radius-lg)",
        md: "var(--ux-radius-md)",
        sm: "var(--ux-radius-sm)"
      },
      fontFamily: {
        heading: ["var(--ux-font-family-headings)", "ui-monospace", "monospace"],
        body: ["var(--ux-font-family-body)", "sans-serif"],
        mono: ["var(--ux-font-family-mono)", "monospace"]
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}

export default config
