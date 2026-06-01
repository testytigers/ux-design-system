/**
 * UX Design System — 3-Layer Token Architecture
 * 
 * Layer 1: Primitive Tokens (raw values)
 * Layer 2: Alias Tokens (semantic mappings)
 * Layer 3: Component Tokens (UI-specific compositions)
 * 
 * Main: Purple 🟣 | Headings: Roboto Mono | Body: Open Sans
 */

// Layer 1: Primitives
export * from "./layers/primitive.js"

// Layer 2: Aliases
export * from "./layers/alias.js"

// Layer 3: Components
export * from "./layers/component.js"

// CSS generation
export { generateCSS, generateCSSWithAliases, generateCSSDarkMode } from "./generate-css.js"

// Re-export CSS content
export const cssVariables = `
/* ── Purple Spectrum ── */
--ux-color-purple-50: #faf5ff;
--ux-color-purple-100: #f3e8ff;
--ux-color-purple-200: #e9d5ff;
--ux-color-purple-300: #d8b4fe;
--ux-color-purple-400: #c084fc;
--ux-color-purple-500: #a855f7;
--ux-color-purple-600: #9333ea;
--ux-color-purple-700: #7e22ce;
--ux-color-purple-800: #6b21a8;
--ux-color-purple-900: #581c87;
--ux-color-purple-950: #3b0764;

/* ── Neutral Spectrum ── */
--ux-color-neutral-0: #ffffff;
--ux-color-neutral-50: #fafafa;
--ux-color-neutral-100: #f4f4f5;
--ux-color-neutral-200: #e4e4e7;
--ux-color-neutral-300: #d4d4d8;
--ux-color-neutral-400: #a1a1aa;
--ux-color-neutral-500: #71717a;
--ux-color-neutral-600: #52525b;
--ux-color-neutral-700: #3f3f46;
--ux-color-neutral-800: #27272a;
--ux-color-neutral-900: #18181b;
--ux-color-neutral-950: #09090b;

/* ── Status Colors ── */
--ux-color-status-success: #16a34a;
--ux-color-status-success-light: #bbf7d0;
--ux-color-status-warning: #ca8a04;
--ux-color-status-warning-light: #fef08a;
--ux-color-status-error: #dc2626;
--ux-color-status-error-light: #fecaca;
--ux-color-status-info: #2563eb;
--ux-color-status-info-light: #bfdbfe;

/* ── Accent Colors ── */
--ux-color-accent-primary: #f472b6;
--ux-color-accent-primary-light: #fbcfe8;

/* ── Font Families ── */
--ux-font-family-headings: 'Roboto Mono', ui-monospace, monospace;
--ux-font-family-body: 'Open Sans', sans-serif;
--ux-font-family-mono: 'JetBrains Mono', monospace;
--ux-font-family-system: system-ui, -apple-system, sans-serif;

/* ── Font Sizes ── */
--ux-font-size-xs: 0.75rem;
--ux-font-size-sm: 0.875rem;
--ux-font-size-base: 1rem;
--ux-font-size-lg: 1.125rem;
--ux-font-size-xl: 1.25rem;
--ux-font-size-2xl: 1.5rem;
--ux-font-size-3xl: 1.875rem;
--ux-font-size-4xl: 2.25rem;
--ux-font-size-5xl: 3rem;

/* ── Font Weights ── */
--ux-font-weight-normal: 400;
--ux-font-weight-medium: 500;
--ux-font-weight-semibold: 600;
--ux-font-weight-bold: 700;

/* ── Line Heights ── */
--ux-line-height-tight: 1.25;
--ux-line-height-normal: 1.5;
--ux-line-height-relaxed: 1.75;

/* ── Letter Spacing ── */
--ux-letter-spacing-tight: -0.025em;
--ux-letter-spacing-normal: 0em;
--ux-letter-spacing-wide: 0.025em;

/* ── Spacing ── */
--ux-spacing-0: 0;
--ux-spacing-0.5: 0.125rem;
--ux-spacing-1: 0.25rem;
--ux-spacing-1.5: 0.375rem;
--ux-spacing-2: 0.5rem;
--ux-spacing-2.5: 0.625rem;
--ux-spacing-3: 0.75rem;
--ux-spacing-4: 1rem;
--ux-spacing-5: 1.25rem;
--ux-spacing-6: 1.5rem;
--ux-spacing-8: 2rem;
--ux-spacing-10: 2.5rem;
--ux-spacing-12: 3rem;
--ux-spacing-16: 4rem;
--ux-spacing-20: 5rem;
--ux-spacing-24: 6rem;

/* ── Border Radius ── */
--ux-radius-none: 0;
--ux-radius-sm: 0.25rem;
--ux-radius-default: 0.375rem;
--ux-radius-md: 0.5rem;
--ux-radius-lg: 0.75rem;
--ux-radius-xl: 1rem;
--ux-radius-2xl: 1.5rem;
--ux-radius-3xl: 2rem;
--ux-radius-full: 9999px;

/* ── Shadows ── */
--ux-shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--ux-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--ux-shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--ux-shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--ux-shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
--ux-shadow-inner: inset 0 2px 4px 0 rgba(0, 0, 0, 0.05);
--ux-shadow-none: none;

/* ── Z-Index ── */
--ux-z-index-hide: -1;
--ux-z-index-base: 0;
--ux-z-index-dropdown: 1000;
--ux-z-index-sticky: 1100;
--ux-z-index-modal: 1200;
--ux-z-index-popover: 1300;
--ux-z-index-tooltip: 1400;

/* ── Transitions ── */
--ux-transition-fast: 100ms cubic-bezier(0.4, 0, 0.2, 1);
--ux-transition-normal: 150ms cubic-bezier(0.4, 0, 0.2, 1);
--ux-transition-slow: 200ms cubic-bezier(0.4, 0, 0.2, 1);
--ux-transition-slower: 300ms cubic-bezier(0.4, 0, 0.2, 1);

/* ── Semantic Alias Mappings ── */
--ux-color-bg-primary: var(--ux-color-neutral-0);
--ux-color-bg-secondary: var(--ux-color-neutral-50);
--ux-color-bg-tertiary: var(--ux-color-neutral-100);
--ux-color-bg-subtle: var(--ux-color-neutral-50);
--ux-color-bg-elevated: var(--ux-color-neutral-0);
--ux-color-bg-inverted: var(--ux-color-neutral-950);
--ux-color-bg-overlay: rgba(0, 0, 0, 0.5);
--ux-color-bg-ghost: transparent;

--ux-color-text-primary: var(--ux-color-neutral-950);
--ux-color-text-secondary: var(--ux-color-neutral-600);
--ux-color-text-tertiary: var(--ux-color-neutral-500);
--ux-color-text-muted: var(--ux-color-neutral-400);
--ux-color-text-inverted: var(--ux-color-neutral-0);
--ux-color-text-link: var(--ux-color-purple-600);
--ux-color-text-on-primary: var(--ux-color-neutral-0);
--ux-color-text-on-accent: var(--ux-color-neutral-950);

--ux-color-border-default: var(--ux-color-neutral-200);
--ux-color-border-strong: var(--ux-color-neutral-300);
--ux-color-border-subtle: var(--ux-color-neutral-100);
--ux-color-border-focus: var(--ux-color-purple-500);
--ux-color-border-destructive: var(--ux-color-status-error);
`
