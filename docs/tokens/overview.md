# Tokens

Tokens are the design decisions encoded as named values. Every color, spacing, radius, font, shadow, and timing in the system has a named token; components reference the token name, not the literal value, so a single change in `globals.css` re-themes everything.

## How they're delivered

Tokens are exposed three ways. Pick the one that matches the layer you're working at:

| You're writing | You consume tokens via | Example |
|---|---|---|
| Component class strings | **Tailwind theme keys** mapped to tokens | `bg-primary`, `text-foreground`, `border-border` |
| Custom CSS or arbitrary values | **CSS custom properties** | `var(--ux-color-purple-600)` |
| TypeScript / Node code | **`@ux/tokens` exports** | `primitive.color.purple[600]` |

The Tailwind theme keys are the recommended path for component code. Use CSS variables when you need a value Tailwind can't express. Use the TypeScript exports for build-time tooling, design-tool plugins, and storybook decorators.

## Layered organisation

Conceptually there are three layers. In the **runtime CSS** they collapse into one big `:root { … }` block; the layering matters because of where you intervene:

```
Layer 3  Component tokens             component.ts  — programmatic, optional
         (button.primary.background, card.radius, …)
Layer 2  Semantic / alias tokens      :root + .dark in globals.css
         (--ux-color-bg-primary, --ux-color-text-primary,
          --ux-color-border-default, --ux-color-border-focus, …)
Layer 1  Primitive tokens             :root in globals.css
         (--ux-color-purple-{50..950}, --ux-spacing-{0..24},
          --ux-radius-{none..full}, --ux-shadow-*, …)
```

Components in `@ux/react` consume Tailwind theme keys, which **resolve to Layer 2**, which **reference Layer 1**. Layer 3 (`packages/tokens/src/layers/component.ts`) is provided for designers and tooling that want a single object describing per-component values; the React components themselves do not import it.

To re-theme:
- **Swap the brand color**: override Layer 1 (`--ux-color-purple-600`).
- **Change the meaning of "primary background"**: override Layer 2 (`--ux-color-bg-primary`).
- **Override one component**: override its Tailwind theme key locally (`<Button className="bg-fuchsia-600 hover:bg-fuchsia-700">`) or extend the Tailwind config.

## Layer 1: primitive tokens

The raw scales. None of these mean anything by themselves; they're just values.

```css
/* Purple — the brand spectrum */
--ux-color-purple-50:  #faf5ff;
--ux-color-purple-100: #f3e8ff;
--ux-color-purple-200: #e9d5ff;
--ux-color-purple-300: #d8b4fe;
--ux-color-purple-400: #c084fc;
--ux-color-purple-500: #a855f7;
--ux-color-purple-600: #9333ea;   /* main brand */
--ux-color-purple-700: #7e22ce;
--ux-color-purple-800: #6b21a8;
--ux-color-purple-900: #581c87;
--ux-color-purple-950: #3b0764;

/* Neutral — surfaces, text, borders */
--ux-color-neutral-0:   #ffffff;
--ux-color-neutral-50:  #fafafa;
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

/* Status — feedback */
--ux-color-status-success: #16a34a;       --ux-color-status-success-light: #bbf7d0;
--ux-color-status-warning: #ca8a04;       --ux-color-status-warning-light: #fef08a;
--ux-color-status-error:   #dc2626;       --ux-color-status-error-light:   #fecaca;
--ux-color-status-info:    #2563eb;       --ux-color-status-info-light:    #bfdbfe;

/* Accent (complementary) */
--ux-color-accent-primary:       #f472b6;
--ux-color-accent-primary-light: #fbcfe8;
```

Other primitive scales (excerpt — full list in `styles/globals.css`):

| Family | Range | Key values |
|---|---|---|
| Spacing | `--ux-spacing-0` … `--ux-spacing-24` | 0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20, 24 (rem fractions) |
| Radius | `--ux-radius-none` … `--ux-radius-full` | none, sm (.25rem), md (.5rem), lg (.75rem), xl (1rem), 2xl, 3xl, full (9999px) |
| Shadow | `--ux-shadow-sm` … `--ux-shadow-2xl`, `--ux-shadow-inner`, `--ux-shadow-none` | Layered rgba shadows |
| Z-index | `--ux-z-index-base` (0) … `--ux-z-index-tooltip` (1400) | base, dropdown, sticky, modal, popover, tooltip |
| Transitions | `--ux-transition-fast` (100ms) / `-normal` (150ms) / `-slow` (200ms) | Plus a shared cubic-bezier easing |
| Font sizes | `--ux-font-size-xs` (12px) … `--ux-font-size-5xl` (48px) | xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl |
| Font weights | 400 / 500 / 600 / 700 | normal, medium, semibold, bold |
| Line heights | `tight` (1.25) / `normal` (1.5) / `relaxed` (1.75) | |

> **Rule of thumb:** never reference a primitive directly in a component class string. Prefer Tailwind theme keys, which resolve through Layer 2.

## Layer 2: semantic (alias) tokens

These are the names that carry meaning. They're the layer most consumer code should care about.

```css
/* Surfaces */
--ux-color-bg-primary:    var(--ux-color-neutral-0);     /* page background */
--ux-color-bg-secondary:  var(--ux-color-neutral-50);
--ux-color-bg-tertiary:   var(--ux-color-neutral-100);
--ux-color-bg-elevated:   var(--ux-color-neutral-0);     /* cards, popovers */
--ux-color-bg-inverted:   var(--ux-color-neutral-950);
--ux-color-bg-overlay:    rgba(0,0,0,0.5);
--ux-color-bg-ghost:      transparent;

/* Text */
--ux-color-text-primary:    var(--ux-color-neutral-950);
--ux-color-text-secondary:  var(--ux-color-neutral-600);
--ux-color-text-tertiary:   var(--ux-color-neutral-500);
--ux-color-text-muted:      var(--ux-color-neutral-400);
--ux-color-text-inverted:   var(--ux-color-neutral-0);
--ux-color-text-link:       var(--ux-color-purple-600);
--ux-color-text-on-primary: var(--ux-color-neutral-0);
--ux-color-text-on-accent:  var(--ux-color-neutral-950);

/* Borders */
--ux-color-border-default:     var(--ux-color-neutral-200);
--ux-color-border-strong:      var(--ux-color-neutral-300);
--ux-color-border-subtle:      var(--ux-color-neutral-100);
--ux-color-border-focus:       var(--ux-color-purple-500);
--ux-color-border-destructive: var(--ux-color-status-error);

/* Shadcn-compat semantic surfaces */
--ux-color-muted:               var(--ux-color-neutral-100);
--ux-color-muted-foreground:    var(--ux-color-neutral-500);
--ux-color-accent:              var(--ux-color-purple-100);
--ux-color-accent-foreground:   var(--ux-color-purple-900);
--ux-color-popover:             var(--ux-color-neutral-0);
--ux-color-popover-foreground:  var(--ux-color-neutral-950);
--ux-color-card:                var(--ux-color-neutral-0);
--ux-color-card-foreground:     var(--ux-color-neutral-950);
```

The `.dark { … }` block in `globals.css` overrides exactly this layer — the primitives don't change, just which neutrals get assigned to "primary background", "muted", and so on. See [Theming](../theming/overview.md).

## Layer 3: component tokens (programmatic)

Optional. Useful for design-tool plugins and storybook decorators that want a single object per component.

```ts
// @ux/tokens
import { component } from "@ux/tokens"

component.button.primary.background  // "var(--ux-color-purple-600)"
component.button.primary.hover       // "var(--ux-color-purple-700)"
component.card.radius                // "var(--ux-radius-lg)"
component.badge.primary.background   // "var(--ux-color-purple-100)"
```

The React components themselves do **not** read this object — they ship Tailwind class strings. If you need to wire them through, do it via your Tailwind config.

## Tailwind theme keys

The recommended consumption surface for component code. From `tailwind.config.ts`:

| Tailwind key | Resolves to | Use |
|---|---|---|
| `bg-primary`, `text-primary` | `--ux-color-purple-600` | Brand color |
| `bg-primary-foreground`, `text-primary-foreground` | `--ux-color-text-on-primary` (white) | Text on primary |
| `bg-background`, `text-background` | `--ux-color-bg-primary` | Page background |
| `text-foreground`, `bg-foreground` | `--ux-color-text-primary` | Body text |
| `border-border` | `--ux-color-border-default` | Default borders |
| `bg-muted`, `text-muted-foreground` | `--ux-color-muted` / `-foreground` | Subtle surfaces, captions |
| `bg-accent`, `text-accent-foreground` | `--ux-color-accent` / `-foreground` | Hover backgrounds, ghost-button hover |
| `bg-popover`, `text-popover-foreground` | `--ux-color-popover` / `-foreground` | Popovers, dropdowns |
| `bg-card`, `text-card-foreground` | `--ux-color-card` / `-foreground` | Card surfaces |
| `bg-destructive` | `--ux-color-status-error` | Destructive actions |
| `ring-ring` | `--ux-color-purple-500` | Focus rings |
| `font-heading`, `font-body`, `font-mono` | `--ux-font-family-headings/body/mono` | Typography |
| `rounded-{sm,md,lg}` | `--ux-radius-{sm,md,lg}` | Shadcn-conventional radii |
| `bg-primary-{50..950}` | `--ux-color-purple-{50..950}` | Full purple scale |

## Programmatic API (`@ux/tokens`)

The package exports more than just the token objects. A complete inventory:

| Export | Type | What it is |
|---|---|---|
| `primitive` | object | Layer 1 values (`primitive.color.purple[600]` → `"#9333ea"`). |
| `alias` | object | Layer 2 — semantic aliases that wrap `var(--ux-…)` strings. |
| `component` | object | Layer 3 — per-component compositions (`component.button.primary.background`). |
| `cssVariables` | string | A pre-rendered string of all primitive vars; useful for SSR or for injecting into a `<style>` tag from JS. |
| `generateCSS()` | function | Returns the full CSS variables block as a string from the in-memory token tree. |
| `generateCSSWithAliases()` | function | Same, but also emits the Layer 2 aliases. |
| `generateCSSDarkMode()` | function | Returns just the `.dark { … }` overrides. |

```ts
import { primitive, alias, component, cssVariables, generateCSS, generateCSSWithAliases, generateCSSDarkMode } from "@ux/tokens"

// inject into a runtime <style> (e.g. an SSR shell that has no static CSS)
const styleEl = document.createElement("style")
styleEl.textContent = `:root {${cssVariables}}\n${generateCSSDarkMode()}`
document.head.append(styleEl)

// or generate a complete sheet from the token tree
const css = generateCSSWithAliases()
```

These are escape hatches, not the recommended path. For 99% of use cases, `@import "@ux/tokens/css"` in your global stylesheet is enough.

## TypeScript types

```ts
import type { Primitive, Alias, Component } from "@ux/tokens"

const purple600: Primitive["color"]["purple"][600]                    // "#9333ea"
const bgPrimary:  Alias["color"]["bg"]["primary"]                     // "var(--ux-color-bg-primary)"
const btnBg:      Component["button"]["primary"]["background"]        // "var(--ux-color-purple-600)"
```

Per-layer subpath imports are also available:

```ts
import { primitive } from "@ux/tokens/primitive"
import { alias }     from "@ux/tokens/alias"
import { component } from "@ux/tokens/component"
```

## Overriding tokens

Pick the lowest layer that captures your intent and override there.

```css
/* 1. Re-theme the brand. Touches everything that references purple. */
:root {
  --ux-color-purple-600: #2563eb;       /* primary button background */
  --ux-color-purple-700: #1d4ed8;       /* hover */
  --ux-color-purple-500: #3b82f6;       /* focus ring */
  --ux-color-purple-100: #dbeafe;       /* secondary, subtle accent */
  --ux-color-purple-900: #1e3a8a;       /* secondary foreground */
}

/* 2. Tighten the entire layout. */
:root {
  --ux-spacing-4:  0.875rem;
  --ux-spacing-6:  1.25rem;
  --ux-radius-lg:  0.5rem;
}

/* 3. Make cards heavier without touching their classes. */
:root {
  --ux-color-card: var(--ux-color-neutral-50);
  --ux-shadow-sm:  0 2px 4px rgba(0,0,0,0.08);
}
```

Overrides cascade — a media query or a class-scoped redefinition only applies inside that scope.

## Reference

- Full primitive list: `styles/globals.css` (`:root { … }`)
- Dark-mode overrides: `styles/globals.css` (`.dark { … }`)
- Built CSS file (for distribution): `packages/tokens/dist/css/variables.css`
- TypeScript source: `packages/tokens/src/layers/{primitive,alias,component}.ts`

## Best practices

1. **Override at the right layer.** Brand swap → Layer 1. Surface meaning change → Layer 2. One-off component tweak → Tailwind class on that component.
2. **Don't reach past Tailwind.** Inside component code, prefer `bg-primary` over `bg-[var(--ux-color-purple-600)]`. Same result, much cleaner override story.
3. **Keep dark mode in mind.** The semantic layer is what flips. If you override only `:root` and not `.dark`, dark mode will use the original values.
4. **Don't introduce raw hex colors in components.** Add a token, then a Tailwind theme key, then use the key. The CI guard at `scripts/check-tokens.mjs` catches forgotten variable references.
