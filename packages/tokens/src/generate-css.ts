/**
 * CSS Variable Generator
 * Converts all 3 token layers into CSS custom properties
 * Output: :root {} for light mode with dark mode overrides
 */

import { primitive } from "./layers/primitive.js"
import { alias } from "./layers/alias.js"
import { component } from "./layers/component.js"

function flatten(obj: Record<string, unknown>, prefix = ""): string {
  let css = ""
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}-${key}` : key
    if (typeof value === "string") {
      css += `    --ux-${fullKey}: ${value};\n`
    } else {
      css += flatten(value as Record<string, unknown>, fullKey)
    }
  }
  return css
}

export function generateCSS(): string {
  let css =
    `/* ========================================\n` +
    `   UX Design System — CSS Custom Properties\n` +
    `   Auto-generated from 3-layer token architecture\n` +
    `   Main: Purple 🟣 | Headings: Roboto Mono | Body: Open Sans\n` +
    `======================================== */\n\n` +
    `:root {\n`

  // ─── LAYER 1: PRIMITIVE TOKENS ─────────────────────────────────
  css += `\n  /* ═══════════════════════════════════════════════════════════ */\n`
  css += `  /* LAYER 1: PRIMITIVE TOKENS */\n`
  css += `  /* ═══════════════════════════════════════════════════════════ */\n`

  // Colors
  css += `\n  /* ── Purple Spectrum ── */\n`
  css += flatten(primitive.color.purple, "color-purple")

  css += `\n  /* ── Neutral Spectrum ── */\n`
  css += flatten(primitive.color.neutral, "color-neutral")

  css += `\n  /* ── Status Colors ── */\n`
  css += flatten(primitive.color.status, "color-status")

  css += `\n  /* ── Accent Colors ── */\n`
  css += flatten(primitive.color.accent, "color-accent")

  // Typography
  css += `\n  /* ── Font Families ── */\n`
  css += flatten(primitive.font, "font-family")

  css += `\n  /* ── Font Sizes ── */\n`
  css += flatten(primitive.fontSize, "font-size")

  css += `\n  /* ── Font Weights ── */\n`
  css += flatten(primitive.fontWeight, "font-weight")

  css += `\n  /* ── Line Heights ── */\n`
  css += flatten(primitive.lineHeight, "line-height")

  css += `\n  /* ── Letter Spacing ── */\n`
  css += flatten(primitive.letterSpacing, "letter-spacing")

  // Spacing
  css += `\n  /* ── Spacing ── */\n`
  css += flatten(primitive.spacing, "spacing")

  // Radius
  css += `\n  /* ── Border Radius ── */\n`
  css += flatten(primitive.radius, "radius")

  // Shadows
  css += `\n  /* ── Shadows ── */\n`
  css += flatten(primitive.shadow, "shadow")

  // Z-index
  css += `\n  /* ── Z-Index ── */\n`
  css += flatten(primitive.zIndex, "z-index")

  // Breakpoints
  css += `\n  /* ── Breakpoints ── */\n`
  css += flatten(primitive.breakpoints, "breakpoint")

  // Transitions
  css += `\n  /* ── Transitions ── */\n`
  css += flatten(primitive.transition, "transition")

  // Easings
  css += `\n  /* ── Easings ── */\n`
  css += flatten(primitive.easing, "easing")

  // ─── LAYER 2: ALIAS TOKENS ─────────────────────────────────────
  css += `\n  /* ═══════════════════════════════════════════════════════════ */\n`
  css += `  /* LAYER 2: ALIAS TOKENS (Semantic) */\n`
  css += `  /* ═══════════════════════════════════════════════════════════ */\n`

  // Background aliases
  css += `\n  /* ── Background ── */\n`
  css += `  --ux-color-bg-primary: ${alias.color.bg.primary};\n`
  css += `  --ux-color-bg-secondary: ${alias.color.bg.secondary};\n`
  css += `  --ux-color-bg-tertiary: ${alias.color.bg.tertiary};\n`
  css += `  --ux-color-bg-subtle: ${alias.color.bg.subtle};\n`
  css += `  --ux-color-bg-elevated: ${alias.color.bg.elevated};\n`
  css += `  --ux-color-bg-inverted: ${alias.color.bg.inverted};\n`
  css += `  --ux-color-bg-overlay: ${alias.color.bg.overlay};\n`
  css += `  --ux-color-bg-ghost: ${alias.color.bg.ghost};\n`
  css += `  --ux-color-bg-brand: ${alias.color.brand[500]};\n`
  css += `  --ux-color-bg-brand-subtle: ${alias.color.brand[50]};\n`

  // Text aliases
  css += `\n  /* ── Text ── */\n`
  css += `  --ux-color-text-primary: ${alias.color.text.primary};\n`
  css += `  --ux-color-text-secondary: ${alias.color.text.secondary};\n`
  css += `  --ux-color-text-tertiary: ${alias.color.text.tertiary};\n`
  css += `  --ux-color-text-muted: ${alias.color.text.muted};\n`
  css += `  --ux-color-text-inverted: ${alias.color.text.inverted};\n`
  css += `  --ux-color-text-link: ${alias.color.text.link};\n`
  css += `  --ux-color-text-on-primary: ${alias.color.text.onPrimary};\n`
  css += `  --ux-color-text-on-accent: ${alias.color.text.onAccent};\n`
  css += `  --ux-color-text-brand: ${alias.color.text.brand};\n`
  css += `  --ux-color-text-brand-subtle: ${alias.color.text.brandSubtle};\n`

  // Border aliases
  css += `\n  /* ── Border ── */\n`
  css += `  --ux-color-border-default: ${alias.color.border.default};\n`
  css += `  --ux-color-border-strong: ${alias.color.border.strong};\n`
  css += `  --ux-color-border-subtle: ${alias.color.border.subtle};\n`
  css += `  --ux-color-border-focus: ${alias.color.border.focus};\n`
  css += `  --ux-color-border-destructive: ${alias.color.border.destructive};\n`
  css += `  --ux-color-border-brand: ${alias.color.border.brand};\n`
  css += `  --ux-color-border-brand-strong: ${alias.color.border.brandStrong};\n`

  // Status aliases
  css += `\n  /* ── Status ── */\n`
  css += `  --ux-color-status-success: ${alias.color.status.success};\n`
  css += `  --ux-color-status-success-light: ${alias.color.status.successLight};\n`
  css += `  --ux-color-status-warning: ${alias.color.status.warning};\n`
  css += `  --ux-color-status-warning-light: ${alias.color.status.warningLight};\n`
  css += `  --ux-color-status-error: ${alias.color.status.error};\n`
  css += `  --ux-color-status-error-light: ${alias.color.status.errorLight};\n`
  css += `  --ux-color-status-info: ${alias.color.status.info};\n`
  css += `  --ux-color-status-info-light: ${alias.color.status.infoLight};\n`

  // Accent aliases
  css += `\n  /* ── Accent ── */\n`
  css += `  --ux-color-accent-primary: ${alias.color.accent.primary};\n`
  css += `  --ux-color-accent-primary-light: ${alias.color.accent.primaryLight};\n`

  // ─── LAYER 3: COMPONENT TOKENS ─────────────────────────────────
  css += `\n  /* ═══════════════════════════════════════════════════════════ */\n`
  css += `  /* LAYER 3: COMPONENT TOKENS */\n`
  css += `  /* ═══════════════════════════════════════════════════════════ */\n`

  // Button tokens
  css += `\n  /* ── Button ── */\n`
  css += `  --ux-button-padding-sm: ${component.button.padding.sm};\n`
  css += `  --ux-button-padding-base: ${component.button.padding.base};\n`
  css += `  --ux-button-padding-lg: ${component.button.padding.lg};\n`
  css += `  --ux-button-font-size-sm: ${component.button.fontSize.sm};\n`
  css += `  --ux-button-font-size-base: ${component.button.fontSize.base};\n`
  css += `  --ux-button-font-size-lg: ${component.button.fontSize.lg};\n`
  css += `  --ux-button-font-weight: ${component.button.fontWeight};\n`
  css += `  --ux-button-border-radius: ${component.button.borderRadius};\n`
  css += `  --ux-button-gap: ${component.button.gap};\n`

  // Card tokens
  css += `\n  /* ── Card ── */\n`
  css += `  --ux-card-background: ${component.card.backgroundColor};\n`
  css += `  --ux-card-border-radius: ${component.card.borderRadius};\n`
  css += `  --ux-card-padding: ${component.card.padding};\n`
  css += `  --ux-card-shadow: ${component.card.shadow};\n`
  css += `  --ux-card-border: ${component.card.border};\n`

  // Form elements (shadcn-compat)
  css += `\n  /* ── Form Elements ── */\n`
  css += `  --ux-color-input: ${alias.color.border.default};\n`
  css += `  --ux-color-ring: ${alias.color.border.focus};\n`
  css += `  --ux-color-foreground: ${alias.color.text.primary};\n`

  // Input tokens
  css += `\n  /* ── Input ── */\n`
  css += `  --ux-input-height: ${component.input.height};\n`
  css += `  --ux-input-padding: ${component.input.padding};\n`
  css += `  --ux-input-font-size: ${component.input.fontSize};\n`
  css += `  --ux-input-border-radius: ${component.input.borderRadius};\n`
  css += `  --ux-input-border: ${component.input.border};\n`
  css += `  --ux-input-background: ${component.input.backgroundColor};\n`
  css += `  --ux-input-color: ${component.input.color};\n`

  // Modal tokens
  css += `\n  /* ── Modal ── */\n`
  css += `  --ux-modal-background: ${component.modal.backgroundColor};\n`
  css += `  --ux-modal-border-radius: ${component.modal.borderRadius};\n`
  css += `  --ux-modal-padding: ${component.modal.padding};\n`
  css += `  --ux-modal-shadow: ${component.modal.shadow};\n`

  // Badge tokens
  css += `\n  /* ── Badge ── */\n`
  css += `  --ux-badge-padding: ${component.badge.padding};\n`
  css += `  --ux-badge-font-size: ${component.badge.fontSize};\n`
  css += `  --ux-badge-font-weight: ${component.badge.fontWeight};\n`
  css += `  --ux-badge-border-radius: ${component.badge.borderRadius};\n`

  // Tooltip tokens
  css += `\n  /* ── Tooltip ── */\n`
  css += `  --ux-tooltip-background: ${component.tooltip.backgroundColor};\n`
  css += `  --ux-tooltip-color: ${component.tooltip.color};\n`
  css += `  --ux-tooltip-font-size: ${component.tooltip.fontSize};\n`
  css += `  --ux-tooltip-padding: ${component.tooltip.padding};\n`
  css += `  --ux-tooltip-border-radius: ${component.tooltip.borderRadius};\n`
  css += `  --ux-tooltip-shadow: ${component.tooltip.shadow};\n`

  // Table tokens
  css += `\n  /* ── Table ── */\n`
  css += `  --ux-table-background: ${component.table.backgroundColor};\n`
  css += `  --ux-table-color: ${component.table.color};\n`
  css += `  --ux-table-border: ${component.table.border};\n`

  // Alert tokens
  css += `\n  /* ── Alert ── */\n`
  css += `  --ux-alert-padding: ${component.alert.padding};\n`
  css += `  --ux-alert-border-radius: ${component.alert.borderRadius};\n`

  // Skeleton tokens
  css += `\n  /* ── Skeleton ── */\n`
  css += `  --ux-skeleton-background: ${component.skeleton.backgroundColor};\n`
  css += `  --ux-skeleton-border-radius: ${component.skeleton.borderRadius};\n`

  css += `}\n`

  return css
}

export function generateCSSWithAliases(): string {
  return generateCSS()
}

export function generateCSSDarkMode(): string {
  let css = `/* ── Dark Mode Overrides ── */\n`
  css += `:root[data-theme="dark"] {\n`

  // Background aliases
  css += `\n  /* Background */\n`
  css += `  --ux-color-bg-primary: ${alias.color.bg.inverted};\n`
  css += `  --ux-color-bg-secondary: ${primitive.color.neutral[900]};\n`
  css += `  --ux-color-bg-tertiary: ${primitive.color.neutral[800]};\n`
  css += `  --ux-color-bg-subtle: ${primitive.color.neutral[800]};\n`
  css += `  --ux-color-bg-elevated: ${alias.color.bg.inverted};\n`
  css += `  --ux-color-bg-inverted: ${alias.color.bg.primary};\n`
  css += `  --ux-color-bg-overlay: rgba(0, 0, 0, 0.7);\n`
  css += `  --ux-color-bg-brand: ${alias.color.brand[600]};\n`
  css += `  --ux-color-bg-brand-subtle: ${alias.color.brand[900]};\n`

  // Text aliases
  css += `\n  /* Text */\n`
  css += `  --ux-color-text-primary: ${primitive.color.neutral[50]};\n`
  css += `  --ux-color-text-secondary: ${primitive.color.neutral[400]};\n`
  css += `  --ux-color-text-tertiary: ${primitive.color.neutral[500]};\n`
  css += `  --ux-color-text-muted: ${primitive.color.neutral[600]};\n`
  css += `  --ux-color-text-inverted: ${primitive.color.neutral[950]};\n`
  css += `  --ux-color-text-link: ${alias.color.brand[400]};\n`
  css += `  --ux-color-text-brand: ${alias.color.brand[400]};\n`
  css += `  --ux-color-text-brand-subtle: ${alias.color.brand[300]};\n`

  // Border aliases
  css += `\n  /* Border */\n`
  css += `  --ux-color-border-default: ${primitive.color.neutral[800]};\n`
  css += `  --ux-color-border-strong: ${primitive.color.neutral[700]};\n`
  css += `  --ux-color-border-subtle: ${primitive.color.neutral[800]};\n`
  css += `  --ux-color-border-brand: ${alias.color.brand[800]};\n`
  css += `  --ux-color-border-brand-strong: ${alias.color.brand[700]};\n`

  // Form elements (dark mode)
  css += `\n  /* Form Elements */\n`
  css += `  --ux-color-input: ${primitive.color.neutral[800]};\n`
  css += `  --ux-color-ring: ${alias.color.brand[400]};\n`
  css += `  --ux-color-foreground: ${primitive.color.neutral[50]};\n`

  css += `}\n`

  return css
}
