/**
 * LAYER 1 — PRIMITIVE TOKENS
 * Raw, unsemantic values. These are the building blocks.
 * Never reference these directly in components — always go through aliases.
 */

export const primitive = {
  // ─── COLORS ─────────────────────────────────────────────────────
  // Purple spectrum (main brand color)
  color: {
    purple: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7", // ← Main purple
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
      950: "#3b0764"
    },
    // Neutral (slate-based)
    neutral: {
      0: "#ffffff",
      50: "#fafafa",
      100: "#f4f4f5",
      200: "#e4e4e7",
      300: "#d4d4d8",
      400: "#a1a1aa",
      500: "#71717a",
      600: "#52525b",
      700: "#3f3f46",
      800: "#27272a",
      900: "#18181b",
      950: "#09090b"
    },
    // Semantic colors
    status: {
      success: "#16a34a", // green-600
      successLight: "#bbf7d0", // green-200
      warning: "#ca8a04", // yellow-600
      warningLight: "#fef08a", // yellow-200
      error: "#dc2626", // red-600
      errorLight: "#fecaca", // red-200
      info: "#2563eb", // blue-600
      infoLight: "#bfdbfe" // blue-200
    },
    // Accent (complementary to purple)
    accent: {
      primary: "#f472b6", // pink-400 — complementary accent
      primaryLight: "#fbcfe8" // pink-200
    }
  },

  // ─── TYPOGRAPHY ─────────────────────────────────────────────────
  font: {
    headings: "'Roboto Mono', ui-monospace, monospace",
    body: "'Open Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
    system: "system-ui, -apple-system, sans-serif"
  },

  fontSize: {
    xs: "0.75rem", // 12px
    sm: "0.875rem", // 14px
    base: "1rem", // 16px
    lg: "1.125rem", // 18px
    xl: "1.25rem", // 20px
    "2xl": "1.5rem", // 24px
    "3xl": "1.875rem", // 30px
    "4xl": "2.25rem", // 36px
    "5xl": "3rem" // 48px
  },

  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },

  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.75"
  },

  letterSpacing: {
    tight: "-0.025em",
    normal: "0em",
    wide: "0.025em"
  },

  // ─── SPACING ────────────────────────────────────────────────────
  spacing: {
    0: "0",
    0.5: "0.125rem", // 2px
    1: "0.25rem", // 4px
    1.5: "0.375rem", // 6px
    2: "0.5rem", // 8px
    2.5: "0.625rem", // 10px
    3: "0.75rem", // 12px
    3.5: "0.875rem", // 14px
    4: "1rem", // 16px
    5: "1.25rem", // 20px
    6: "1.5rem", // 24px
    7: "1.75rem", // 28px
    8: "2rem", // 32px
    9: "2.25rem", // 36px
    10: "2.5rem", // 40px
    12: "3rem", // 48px
    14: "3.5rem", // 56px
    16: "4rem", // 64px
    20: "5rem", // 80px
    24: "6rem" // 96px
  },

  // ─── BORDER RADIUS ──────────────────────────────────────────────
  radius: {
    none: "0",
    sm: "0.25rem", // 4px
    default: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "0.75rem", // 12px
    xl: "1rem", // 16px
    "2xl": "1.5rem", // 24px
    "3xl": "2rem", // 32px
    full: "9999px"
  },

  // ─── SHADOWS ────────────────────────────────────────────────────
  shadow: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
    none: "none"
  },

  // ─── Z-INDEX ────────────────────────────────────────────────────
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1200,
    popover: 1300,
    tooltip: 1400
  },

  // ─── BREAKPOINTS ────────────────────────────────────────────────
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px"
  },

  // ─── TRANSITIONS ────────────────────────────────────────────────
  transition: {
    fast: "100ms cubic-bezier(0.4, 0, 0.2, 1)",
    normal: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
    slower: "300ms cubic-bezier(0.4, 0, 0.2, 1)"
  },

  // ─── EASINGS ────────────────────────────────────────────────────
  easing: {
    default: "cubic-bezier(0.4, 0, 0.2, 1)",
    linear: "linear",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    out: "cubic-bezier(0, 0, 0.2, 1)",
    inOut: "cubic-bezier(0.4, 0, 0.2, 1)"
  },

  // ─── ANIMATIONS ─────────────────────────────────────────────────
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    "fade-in": "fade-in 0.15s ease-out",
    "fade-out": "fade-out 0.15s ease-out",
    "slide-in": "slide-in 0.2s ease-out",
    "slide-out": "slide-out 0.2s ease-out",
    "zoom-in": "zoom-in 0.15s ease-out",
    "zoom-out": "zoom-out 0.15s ease-out",
    spin: "spin 1s linear infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    bounce: "bounce 1s infinite"
  }
}

export type Primitive = typeof primitive
